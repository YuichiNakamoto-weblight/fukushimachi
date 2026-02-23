<!-- src/views/office/AnnouncementCreateView.vue -->
<!-- 事務局用お知らせ（特集or事務局から）作成ページ -->
<template>
  <body>
    <div class="wrap">
      <!-- <AppHeader /> -->
      <!-- <HamburgerMenu /> -->
      <!-- <FooterNav /> -->

      <main class="l-sec mypage-detail">
        <div class="page-title maru">
          {{
            step === "form"
              ? "お知らせの新規登録（事務局）"
              : step === "confirm"
                ? "登録内容をご確認ください。"
                : "あなたのお知らせがサイトに掲載されました。"
          }}
        </div>

        <div class="form-wrap">
          <div class="inner">
            <!-- ① 入力フォーム -->
            <form v-if="step === 'form'" class="form" @submit.prevent="toConfirm">
              <!-- カテゴリー（3:事務局から / 4:特集 のみ） -->
              <div class="form-item">
                <label class="form-label">カテゴリー</label>
                <div class="checkbox-items">
                  <label v-for="c in officeCategories" :key="c.id" class="checkbox">
                    <input type="radio" name="category" :value="c.id" v-model="form.category_id" />
                    <span>{{ c.name }}</span>
                  </label>
                </div>
              </div>

              <!-- ★ 特集（カテゴリ=4）の場合のみ：求人情報の関連付け（必須） -->
              <div class="form-item" v-if="Number(form.category_id) === 4">
                <label class="form-label">関連する事業所（必須）</label>
                <select v-model="form.business_profile_id" class="input">
                  <option :value="null">-- 選択してください --</option>
                  <option v-for="bp in businesses" :key="bp.id" :value="bp.id">
                    {{ businessLabel(bp) }}
                  </option>
                </select>
                <div class="help">
                  特集として掲載する場合、どの事業所の特集かを選択してください。
                </div>
              </div>

              <!-- タイトル -->
              <div class="form-item">
                <label class="form-label">お知らせタイトル（全角／50文字以内）</label>
                <textarea
                  v-model="form.title"
                  rows="2"
                  class="input"
                  :class="{ 'is-error': titleError }"
                  placeholder=""
                  @input="noop"
                />
                <div class="help">
                  文字数：{{ titleCount }} / 50
                  <span v-if="titleError" class="error">※ 50文字を超えています</span>
                </div>
              </div>

              <!-- メイン画像（1枚） -->
              <div class="form-item">
                <div class="section-title">メイン画像</div>
                <div class="uploader" @dragover.prevent @drop.prevent="onDrop">
                  <div class="uploader-inner">
                    <svg
                      class="uploader__icon"
                      xmlns="http://www.w3.org/2000/svg"
                      width="72"
                      height="72"
                      viewBox="0 0 64 64"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <path
                        d="M48 39a10 10 0 0 0-3.4-19.4A14 14 0 0 0 18 22a9 9 0 0 0-2 17.8"
                      ></path>
                      <polyline points="32 28 32 46"></polyline>
                      <polyline points="24 34 32 26 40 34"></polyline>
                    </svg>
                    <div>画像をドラッグ＆ドロップ</div>
                    <div>または</div>
                    <label class="btn-file">
                      ファイルを選択
                      <input
                        type="file"
                        accept="image/png,image/jpeg"
                        @change="onFilePick"
                        hidden
                      />
                    </label>
                    <span class="uploader__hint">JPG / PNG / JPEG（5MBまで）</span>
                  </div>
                </div>

                <div class="thumbs" v-if="files.length">
                  <div v-for="(f, i) in files" :key="f.uid" class="thumb">
                    <img :src="f.preview" alt="" />
                    <button type="button" class="thumb-del" @click="removeFile(i)">×</button>
                    <div class="thumb-cap">#{{ i + 1 }}</div>
                  </div>
                </div>
              </div>

              <!-- 本文（ツールバー付き） -->
              <div class="form-item">
                <label class="form-label">お知らせ本文</label>

                <div class="editor-toolbar">
                  <button type="button" class="btn-mini" @click="triggerInlineImage">
                    ＋画像を追加（本文）
                    <span class="muted"
                      >（残り {{ MAX_INLINE_IMAGES - inlineImageCount }} /
                      {{ MAX_INLINE_IMAGES }}）</span
                    >
                  </button>
                  <button type="button" class="btn-mini" @click="insertHeading">
                    ＋見出し追加（H2）
                  </button>
                  <button type="button" class="btn-mini" @click="addUnderline">＋下線追加</button>
                  <button type="button" class="btn-mini" @click="insertLink">＋URLリンク</button>
                  <input
                    ref="inlinePicker"
                    type="file"
                    accept="image/png,image/jpeg"
                    hidden
                    @change="onPickInlineImage"
                  />
                </div>

                <textarea
                  ref="bodyRef"
                  v-model="form.body"
                  rows="12"
                  class="input"
                  placeholder="本文を入力してください（ボタンで見出し・下線・画像を挿入できます）"
                />
                <div class="help">
                  本文内に挿入できる画像は最大 {{ MAX_INLINE_IMAGES }} 枚です。
                </div>
              </div>

              <!-- 概要 -->
              <div class="form-item">
                <label class="form-label">概要</label>

                <div v-for="(s, idx) in summaries" :key="s.uid" class="summary-card">
                  <div class="summary-head">
                    <div class="summary-no">#{{ idx + 1 }}</div>
                    <div class="summary-actions">
                      <button type="button" class="btn-mini" @click="duplicateSummary(idx)">
                        複製
                      </button>
                      <button
                        type="button"
                        class="btn-mini -danger"
                        @click="removeSummary(idx)"
                        :disabled="summaries.length === 1"
                      >
                        削除
                      </button>
                    </div>
                  </div>

                  <div class="summary-body">
                    <div class="form-subitem">
                      <label class="form-sublabel">見出し</label>
                      <input
                        v-model="s.heading"
                        type="text"
                        class="input"
                        placeholder="例）開催場所"
                      />
                    </div>
                    <div class="form-subitem">
                      <label class="form-sublabel">内容</label>
                      <textarea
                        v-model="s.content"
                        rows="3"
                        class="input"
                        placeholder="例）2025年◯月◯日"
                      />
                    </div>
                  </div>
                </div>

                <div class="summary-add">
                  <button type="button" class="btn-add" @click="addSummary">＋ 行を追加</button>
                </div>
              </div>

              <!-- ボタンラベル / URL -->
              <div class="form-item">
                <label class="form-label">ボタンラベル</label>
                <input
                  v-model="form.button_label"
                  type="text"
                  class="input"
                  placeholder="例）詳しくはこちら"
                />
              </div>
              <div class="form-item">
                <label class="form-label">ボタンのリンク先URL</label>
                <input
                  v-model="form.button_url"
                  type="url"
                  class="input"
                  placeholder="https://example.com/page"
                />
                <div class="help">http(s) のURLを入力してください</div>
              </div>

              <div class="form-actions">
                <!-- <button
                  type="button"
                  class="btn btn-primary maru"
                  :disabled="draftSaving"
                  @click="saveDraft"
                >
                  {{ draftSaving ? "保存中…" : "下書き保存" }}
                </button> -->
                <!-- <button
                  type="button"
                  class="btn btn-back maru"
                  :disabled="pausing || !draftId"
                  @click="togglePause"
                >
                  {{ pausing ? "処理中…" : isPaused ? "休止解除" : "休止" }}
                </button> -->
                <button class="btn btn-primary maru" type="submit">登録情報を確認する</button>
              </div>
            </form>

            <!-- ② 確認画面 -->
            <section v-else-if="step === 'confirm'" class="confirm">
              <p class="confirm-lead">
                以下の内容で登録します。問題がなければ「登録する」ボタンを押してください。
              </p>

              <div class="conf-items">
                <dl class="conf-item">
                  <dt>お知らせタイトル</dt>
                  <dd>{{ form.title }}</dd>
                </dl>
                <dl class="conf-item">
                  <dt>カテゴリー</dt>
                  <dd>{{ selectedCategoryName || "未選択" }}</dd>
                </dl>

                <dl class="conf-item" v-if="Number(form.category_id) === 4">
                  <dt>関連する事業所</dt>
                  <dd>{{ selectedBusinessLabel || "未選択" }}</dd>
                </dl>

                <dl class="conf-item">
                  <dt>お知らせ本文</dt>
                  <dd>
                    <div class="preview-tabs">
                      <button
                        type="button"
                        class="btn-mini"
                        :class="{ active: confirmTab === 'preview' }"
                        @click="confirmTab = 'preview'"
                      >
                        プレビュー
                      </button>
                      <button
                        type="button"
                        class="btn-mini"
                        :class="{ active: confirmTab === 'html' }"
                        @click="confirmTab = 'html'"
                      >
                        HTML
                      </button>
                    </div>

                    <div
                      v-if="confirmTab === 'preview'"
                      class="article-body preview-box"
                      v-html="safeBody"
                    ></div>
                    <pre v-else class="code-box">{{ form.body || "" }}</pre>
                  </dd>
                </dl>

                <div class="conf-item" v-for="s in summaries" :key="s.uid">
                  <dl class="conf-item-sub">
                    <dt>見出し</dt>
                    <dd>{{ s.heading || "（未入力）" }}</dd>
                  </dl>
                  <dl class="conf-item-sub">
                    <dt>内容</dt>
                    <dd class="multiline">{{ s.content || "（未入力）" }}</dd>
                  </dl>
                </div>

                <dl class="conf-item">
                  <dt>ボタンラベル</dt>
                  <dd>{{ form.button_label || "（未設定）" }}</dd>
                </dl>
                <dl class="conf-item">
                  <dt>ボタンのリンク先URL</dt>
                  <dd>
                    <template v-if="form.button_url">
                      <a :href="form.button_url" target="_blank" rel="noopener">{{
                        form.button_url
                      }}</a>
                    </template>
                    <template v-else>（未設定）</template>
                  </dd>
                </dl>

                <div class="conf-item -images">
                  <dt>掲載画像</dt>
                  <dd>
                    <div v-if="files.length" class="thumbs">
                      <div v-for="f in files" :key="f.uid" class="thumb">
                        <img :src="f.preview" alt="" />
                        <div class="cap">
                          {{ f.file.name
                          }}<span class="size">（{{ humanSize(f.file.size) }}）</span>
                        </div>
                      </div>
                    </div>
                    <div v-else>（なし）</div>
                  </dd>
                </div>
              </div>

              <div class="back-btn-items">
                <div class="form-btn-items-lead">この内容で登録しますか？</div>
                <div class="form-btn-item">
                  <button
                    type="button"
                    class="btn btn-primary maru"
                    :disabled="submitting"
                    @click="submit"
                  >
                    {{ submitting ? "登録中…" : "登録する" }}
                  </button>
                </div>
                <!-- ★追加：確認画面で下書き保存 -->
                <div class="form-btn-item">
                  <button
                    type="button"
                    class="btn btn-ghost maru"
                    :disabled="draftSaving || submitting"
                    @click="saveDraft"
                  >
                    {{ draftSaving ? "保存中…" : "下書き保存" }}
                  </button>
                </div>

                <div class="form-btn-item">
                  <button
                    type="button"
                    class="btn btn-back maru"
                    :disabled="submitting || draftSaving"
                    @click="backToEdit"
                  >
                    修正する
                  </button>
                </div>
              </div>
            </section>

            <!-- ③ 完了画面 -->
            <section v-else class="l-sec mypage-detail">
              <p class="txt-center">あなたのお知らせがサイトに掲載されました。</p>
              <div class="public-url">
                <div class="public-url-title">公開URL</div>
                <a v-if="done.url" :href="done.url" target="_blank" rel="noopener">
                  {{ done.url }}
                </a>
                <div v-else class="public-url -muted">URL を取得できませんでした</div>
              </div>

              <div class="back-btn-items">
                <div class="btn-base maru">
                  <a href="/office/announcements/">TOPへ戻る</a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <!-- <AppFooter /> -->
    </div>

    <!-- <div class="body-bg pc">
      <img src="/src/assets/images/common/bg-pc.png" alt />
    </div>

    <div class="hero-copy pc">
      <img src="/src/assets/images/home/hero-copy.svg" alt="はなして、わかって、マッチする。あたらしい介護の就活。">
    </div> -->
  </body>
  <!-- <PcModel /> -->
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { http } from "@/api/http";
import DOMPurify from "dompurify";

// import AppHeader from '@/components/layout/AppHeader.vue'
// import AppFooter from '@/components/layout/AppFooter.vue'
// import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
// import PcModel from '@/components/layout/PcModel.vue'

const router = useRouter();
const route = useRoute();

const draftId = ref(null); // 下書き/編集中ID
const draftSaving = ref(false);
const isPaused = ref(false);
const confirmTab = ref("preview"); // 'preview' | 'html'

const safeBody = computed(() => {
  const raw = form.value.body || "";
  return DOMPurify.sanitize(raw, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ["target", "rel", "class"],
    ALLOWED_ATTR: ["href", "target", "rel", "src", "alt", "class"],
  });
});

/** ===== 設定 ===== */
const API_BASE = "/announcements";
// const JOBS_API = '/job_informations' // ← 実際のエンドポイントに合わせて変更してください
// const JOBS_API = '/jobs'
const BUSINESS_API = "/business/list";
const MAX_TITLE = 50;
const MAX_IMAGES = 1;
const MAX_MB = 5;
const MAX_INLINE_IMAGES = 10;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const API_ORIGIN = (() => {
  try {
    return new URL(API_BASE_URL, window.location.origin).origin;
  } catch {
    return window.location.origin;
  }
})();

/** ===== 事務局 固定ユーザーID ===== */
const OFFICE_USER_ID = 100;

/** ===== 状態 ===== */
const form = ref({
  title: "",
  body: "",
  button_label: "",
  button_url: "",
  category_id: null,
  // job_information_id: null,
  business_profile_id: null,
});
// const userId = ref(null)
const categories = ref([]);
// const jobs = ref([])          // ★ 求人一覧
// const jobsLoaded = ref(false) // 二度取り防止
const businesses = ref([]);
const businessesLoaded = ref(false);
const summaries = ref([{ uid: uid(), heading: "", content: "" }]);
const files = ref([]);
const submitting = ref(false);
const step = ref("form");
const done = ref({ url: "" });

/** ===== 本文ツールバー refs ===== */
const bodyRef = ref(null);
const inlinePicker = ref(null);

/** ===== カテゴリー（3/4 のみ） ===== */
const officeCategories = computed(() =>
  (categories.value || []).filter((c) => Number(c.id) === 3 || Number(c.id) === 4),
);
const selectedCategoryName = computed(() => {
  const id = Number(form.value.category_id);
  const hit = officeCategories.value.find((c) => Number(c.id) === id);
  return (hit && hit.name) || "";
});

/** 求人タイトル表示用 */
// const selectedJobTitle = computed(() => {
//   const id = Number(form.value.job_information_id)
//   const hit = jobs.value.find(j => Number(j.id) === id)
//   return hit?.title || ''
// })

/** 本文内画像 枚数 */
const inlineImageCount = computed(() => (form.value.body.match(/<img\b[^>]*>/gi) || []).length);

/** 文字数 */
const titleCount = computed(() => countGraphemes(form.value.title || ""));
const titleError = computed(() => titleCount.value > MAX_TITLE);

/** 初期ロード */
onMounted(async () => {
  try {
    const { data } = await http.get(`${API_BASE}/categories`);
    categories.value = data || [];
    if (form.value.category_id == null) {
      const pref = officeCategories.value[0]?.id ?? null;
      form.value.category_id = pref;
    }
  } catch (e) {
    console.error("[ann:categories] failed", e);
  }
  // 下書き編集（例: /office/announcements/create?id=123）
  const qid = Number(route.query.id || 0);
  if (qid > 0) {
    await loadAnnouncement(qid);
  }
});

function toAbsUrl(rel) {
  if (!rel) return "";
  if (/^https?:\/\//i.test(rel)) return rel;
  return new URL(rel.startsWith("/") ? rel : `/${rel}`, API_ORIGIN).toString();
}

function buildFormData({ isDraft = false } = {}) {
  const fd = new FormData();

  fd.append("title", form.value.title);
  fd.append("category_id", String(form.value.category_id));

  // 特集(4)は事業所必須
  if (Number(form.value.category_id) === 4 && Number(form.value.business_profile_id)) {
    fd.append("business_profile_id", String(form.value.business_profile_id));
  }

  if (form.value.body) fd.append("body", form.value.body);
  if (form.value.button_label) fd.append("button_label", form.value.button_label);
  if (form.value.button_url) fd.append("button_url", form.value.button_url);

  // 事務局は固定
  fd.append("user_id", String(OFFICE_USER_ID));

  // summaries
  const sums = summaries.value.map((s) => ({
    heading: s.heading || "",
    content: s.content || "",
  }));
  fd.append("summaries", JSON.stringify(sums));

  // 既存画像を保持したい場合（PUT用）
  const keep = files.value.filter((x) => !x.file && x.existingPath).map((x) => x.existingPath);
  if (draftId.value && keep.length) fd.append("keep_images", JSON.stringify(keep));

  // 新規アップロード分（メイン画像は1枚運用）
  for (const it of files.value) {
    if (it.file) fd.append("images", it.file);
  }

  // 下書きフラグ
  fd.append("is_draft", isDraft ? "1" : "0");

  return fd;
}

async function loadAnnouncement(id) {
  try {
    const { data } = await http.get(`${API_BASE}/${id}`);
    draftId.value = Number(data?.id || id);
    form.value.title = data?.title || "";
    form.value.body = data?.body || "";
    form.value.button_label = data?.button_label || "";
    form.value.button_url = data?.button_url || "";
    form.value.category_id = data?.category_id ?? null;
    form.value.business_profile_id = data?.business_profile_id ?? null;
    isPaused.value = Number(data?.is_paused || 0) === 1;
    // summaries
    const ss = Array.isArray(data?.summaries) ? data.summaries : [];
    summaries.value = ss.length
      ? ss.map((s) => ({ uid: uid(), heading: s.heading || "", content: s.content || "" }))
      : [{ uid: uid(), heading: "", content: "" }];

    // images（メイン画像は1枚運用）
    files.value.forEach((f) => f.preview && f.file && URL.revokeObjectURL(f.preview));
    files.value = [];
    const img0 = (data?.images || [])[0];
    if (img0?.image_path) {
      files.value.push({
        uid: uid(),
        file: null,
        existingPath: img0.image_path,
        preview: toAbsUrl(img0.image_path),
      });
    }

    // 特集なら事業所一覧を確保
    if (Number(form.value.category_id) === 4) await ensureBusinesses();
  } catch (e) {
    console.error("[ann:load] failed", e);
    alert("下書きの読み込みに失敗しました");
  }
}

/** カテゴリが 4 になったら求人一覧を取得 */
watch(
  () => form.value.category_id,
  async (v) => {
    if (Number(v) === 4) {
      // await ensureJobs()
      await ensureBusinesses();
    } else {
      // form.value.job_information_id = null
      form.value.business_profile_id = null;
    }
  },
);

// const pausing = ref(false);

// async function togglePause() {
//   if (!draftId.value) {
//     alert("休止は「一度保存されたお知らせ」から利用できます。先に下書き保存してください。");
//     return;
//   }

//   const next = isPaused.value ? 0 : 1;
//   const msg = next
//     ? "このお知らせを休止（非表示）にしますか？"
//     : "休止を解除して公開状態に戻しますか？";
//   if (!window.confirm(msg)) return;

//   try {
//     pausing.value = true;
//     await http.post(`${API_BASE}/${draftId.value}/pause`, {
//       paused: next,
//       user_id: OFFICE_USER_ID,
//     });
//     isPaused.value = !!next;
//     alert(next ? "休止にしました" : "休止を解除しました");
//   } catch (e) {
//     console.error("[ann:pause] failed", e);
//     alert("休止の更新に失敗しました");
//   } finally {
//     pausing.value = false;
//   }
// }

async function ensureBusinesses() {
  if (businessesLoaded.value) return;
  try {
    // 返却想定: [{ id, business_name, city, prefecture_name, user_id, ... }]
    const { data } = await http.get(BUSINESS_API, { params: { limit: 500 } });
    businesses.value = Array.isArray(data) ? data : data?.items || [];
    businessesLoaded.value = true;
  } catch (e) {
    console.error("[business: list] load failed", e);
    businesses.value = [];
  }
}

// 追加：セレクト用ラベル生成
function businessLabel(bp) {
  const name = (bp?.business_name ?? "").toString().trim() || "事業所名未設定";
  const loc = [bp?.prefecture_name, bp?.city].filter(Boolean).join("");
  return loc ? `${name}｜${loc}` : name;
}
const selectedBusinessLabel = computed(() => {
  const id = Number(form.value.business_profile_id);
  const hit = businesses.value.find((b) => Number(b.id) === id);
  return hit ? businessLabel(hit) : "";
});

/** 概要操作 */
function addSummary() {
  summaries.value.push({ uid: uid(), heading: "", content: "" });
}
function duplicateSummary(i) {
  const s = summaries.value[i];
  summaries.value.splice(i + 1, 0, { uid: uid(), heading: s.heading, content: s.content });
}
function removeSummary(i) {
  if (summaries.value.length > 1) summaries.value.splice(i, 1);
}

/** 本文ツールバー */
function replaceSelection(html, collapseToEnd = true) {
  const el = bodyRef.value;
  if (!el) return;
  const s = el.selectionStart ?? 0;
  const e = el.selectionEnd ?? s;
  const before = form.value.body.slice(0, s);
  const after = form.value.body.slice(e);
  form.value.body = before + html + after;
  nextTick(() => {
    el.focus();
    const pos = collapseToEnd ? before.length + html.length : before.length;
    el.setSelectionRange(pos, pos);
  });
}
function wrapSelection(open, close, placeholder = "") {
  const el = bodyRef.value;
  if (!el) return;
  const s = el.selectionStart ?? 0;
  const e = el.selectionEnd ?? s;
  const sel = form.value.body.slice(s, e);
  const inner = sel || placeholder;
  replaceSelection(`${open}${inner}${close}`);
}
function insertHeading() {
  wrapSelection("<h2>", "</h2>\n", "見出し");
}
function addUnderline() {
  wrapSelection("<u>", "</u>", "ここに下線");
}

/** 本文にURLリンクを挿入 */
function insertLink() {
  // 1) URL入力
  const urlRaw = window.prompt("リンク先URL（http(s)）を入力してください", "https://") ?? "";
  const url = urlRaw.trim();
  if (!url) return;

  if (!/^https?:\/\//i.test(url)) {
    alert("URLは http または https で入力してください");
    return;
  }

  const el = bodyRef.value;
  if (!el) return;

  const s = el.selectionStart ?? 0;
  const e = el.selectionEnd ?? s;
  const hasSelection = e > s;

  // 属性用にエスケープ
  const href = escapeHtml(url);

  if (hasSelection) {
    // 選択文字があれば、その文字列をリンクにする
    wrapSelection(`<a href="${href}" target="_blank" rel="noopener">`, "</a>");
  } else {
    // 選択なしならテキストも入力してもらう（未入力ならURLそのまま）
    const labelRaw = window.prompt("リンクテキスト（省略時はURLをそのまま表示）", "") ?? "";
    const label = labelRaw.trim() || url;
    const text = escapeHtml(label);

    replaceSelection(`<a href="${href}" target="_blank" rel="noopener">${text}</a>`);
  }
}

/** 本文へ画像追加（最大4枚） */
function triggerInlineImage() {
  if (inlineImageCount.value >= MAX_INLINE_IMAGES) {
    alert(`本文に挿入できる画像は最大 ${MAX_INLINE_IMAGES} 枚です。`);
    return;
  }
  inlinePicker.value?.click();
}
async function onPickInlineImage(e) {
  const file = e?.target?.files?.[0];
  e.target.value = "";
  if (!file) return;
  if (!/image\/(png|jpe?g)/i.test(file.type)) {
    alert("本文に挿入できるのは JPG/PNG 画像のみです");
    return;
  }
  if (file.size > MAX_MB * 1024 * 1024) {
    alert(`本文画像は ${MAX_MB}MB 以内にしてください`);
    return;
  }
  try {
    const fd = new FormData();
    fd.append("image", file);
    const { data } = await http.post(`${API_BASE}/inline-image`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const rel = String(data?.url || "").trim();
    if (!rel) {
      alert("画像のアップロードに失敗しました");
      return;
    }
    const src = /^https?:\/\//i.test(rel)
      ? rel
      : new URL(rel.startsWith("/") ? rel : `/${rel}`, API_ORIGIN).toString();
    // 任意キャプション（キャンセルなら空文字）
    const capRaw = window.prompt("キャプション（任意）", "") ?? "";
    const cap = escapeHtml(capRaw);
    // アクセシビリティ向上のため alt にはキャプションを流用（空なら空でOK）
    const alt = cap;
    // figure 構造で挿入（クラスは表示側スタイル用）
    replaceSelection(
      `<figure class="ann-img">\n` +
        `  <img src="${src}" alt="${alt}">\n` +
        `  <figcaption>${cap}</figcaption>\n` +
        `</figure>\n`,
    );
  } catch (err) {
    console.error("[inline-image] failed", err);
    alert("画像のアップロードに失敗しました");
  }
}

/** メイン画像（1枚） */
function pushFiles(list) {
  const room = MAX_IMAGES - files.value.length;
  const add = Array.from(list).slice(0, Math.max(0, room));
  for (const f of add) {
    if (!/image\/(png|jpe?g)/i.test(f.type)) continue;
    if (f.size > MAX_MB * 1024 * 1024) continue;
    files.value.push({ uid: uid(), file: f, preview: URL.createObjectURL(f) });
  }
}
function onFilePick(e) {
  const input = e.target;
  if (!input.files) return;
  pushFiles(input.files);
  input.value = "";
}
function onDrop(e) {
  if (!e.dataTransfer?.files) return;
  pushFiles(e.dataTransfer.files);
}
function removeFile(i) {
  const r = files.value.splice(i, 1)[0];
  if (r?.preview) URL.revokeObjectURL(r.preview);
}

/** バリデーション→確認へ */
function validateBeforeConfirm() {
  if (!form.value.title) {
    alert("タイトルを入力してください");
    return false;
  }
  if (titleError.value) {
    alert(`タイトルは${MAX_TITLE}文字以内で入力してください`);
    return false;
  }
  if (!form.value.category_id) {
    alert("カテゴリーを選択してください");
    return false;
  }
  if (Number(form.value.category_id) === 4 && !Number(form.value.business_profile_id)) {
    alert("特集（カテゴリ=4）の場合、関連する事業所を選択してください");
    return false;
  }
  if (form.value.button_url && !/^https?:\/\//i.test(form.value.button_url)) {
    alert("ボタンのリンク先URLは http(s) を指定してください");
    return false;
  }
  if (files.value.length > MAX_IMAGES) {
    alert(`掲載画像（メイン）は最大${MAX_IMAGES}枚までです`);
    return false;
  }
  if (inlineImageCount.value > MAX_INLINE_IMAGES) {
    alert(`本文内の画像が上限（${MAX_INLINE_IMAGES}枚）を超えています`);
    return false;
  }
  return true;
}
function toConfirm() {
  if (!validateBeforeConfirm()) return;
  step.value = "confirm";
  window.scrollTo({ top: 0 });
}

/** 登録 */
async function submit() {
  try {
    submitting.value = true;
    // const fd = new FormData()
    // fd.append('title', form.value.title)
    // fd.append('category_id', String(form.value.category_id))
    // if (Number(form.value.category_id) === 4 && Number(form.value.business_profile_id)){
    //   fd.append('business_profile_id', String(form.value.business_profile_id))
    // }
    // if (form.value.body) fd.append('body', form.value.body)
    // if (form.value.button_label) fd.append('button_label', form.value.button_label)
    // if (form.value.button_url) fd.append('button_url', form.value.button_url)
    // // if (userId.value) fd.append('user_id', String(userId.value))
    // // ★ 事務局は常に固定値を送る（ローカルストレージは使わない）
    // fd.append('user_id', String(OFFICE_USER_ID))
    // console.log('ユーザーID(固定):', OFFICE_USER_ID)

    // const sums = summaries.value.map(s => ({ heading: s.heading || '', content: s.content || '' }))
    // fd.append('summaries', JSON.stringify(sums))
    // for (const it of files.value.slice(0, MAX_IMAGES)) fd.append('images', it.file)

    // const { data } = await http.post(`${API_BASE}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    const fd = buildFormData({ isDraft: false });
    let data;
    if (draftId.value) {
      const resp = await http.put(`${API_BASE}/${draftId.value}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      data = { id: draftId.value, ...resp.data };
    } else {
      const resp = await http.post(`${API_BASE}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      data = resp.data;
    }
    done.value.url = resolvePublicUrl(data);
    step.value = "done";
    window.scrollTo({ top: 0 });
  } catch (e) {
    console.error("[ann:create] failed ", e);
    alert("登録に失敗しました");
  } finally {
    submitting.value = false;
  }
}

/** 戻る */
function backToEdit() {
  step.value = "form";
  window.scrollTo({ top: 0 });
}

/** util */
function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
function countGraphemes(s) {
  return [...(s || "")].length;
}
function humanSize(n) {
  const kb = n / 1024;
  return kb >= 1024 ? (kb / 1024).toFixed(1) + " MB" : kb.toFixed(1) + " KB";
}
function noop() {}
function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
function resolvePublicUrl(resp) {
  if (!resp) return "";
  if (resp.public_url) return resp.public_url;
  if (resp.url) return resp.url;
  const id = Number(resp.id || resp.announcement_id || 0);
  if (id > 0) {
    try {
      const href = router.resolve({ name: "AnnouncementDetail", params: { id } }).href;
      return new URL(href, window.location.origin).toString();
    } catch {
      return `${window.location.origin}/news/announcements/${id}`;
    }
  }
  return "";
}

async function saveDraft() {
  // 下書きでも最低限は必要（titleはDB NOT NULL）
  if (!form.value.title) {
    alert("下書き保存するにはタイトルを入力してください");
    return;
  }
  if (titleError.value) {
    alert(`タイトルは${MAX_TITLE}文字以内で入力してください`);
    return;
  }
  if (!form.value.category_id) {
    alert("カテゴリーを選択してください");
    return;
  }
  if (Number(form.value.category_id) === 4 && !Number(form.value.business_profile_id)) {
    alert("特集（カテゴリ=4）の場合、関連する事業所を選択してください");
    return;
  }

  try {
    draftSaving.value = true;
    const fd = buildFormData({ isDraft: true });

    if (draftId.value) {
      await http.put(`${API_BASE}/${draftId.value}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      const { data } = await http.post(`${API_BASE}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      draftId.value = Number(data?.id || 0) || null;
      // URLにidを残しておく（リロードしても復元しやすくする）
      if (draftId.value) router.replace({ query: { ...route.query, id: String(draftId.value) } });
    }
    alert("下書き保存しました");
  } catch (e) {
    console.error("[ann:draft] failed", e);
    alert("下書き保存に失敗しました");
  } finally {
    draftSaving.value = false;
  }
}
</script>

<style scoped>
/* ラッパー */
.form-wrap {
  background: #f3f4f6;
  border-radius: 16px;
  padding: 24px;
}
.page-title {
  text-align: center;
  margin-bottom: 18px;
}

/* 共通フォーム */
.form-item {
  margin-bottom: 22px;
}
.form-label {
  display: block;
  font-weight: 700;
  margin-bottom: 8px;
}
.input {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 10px 12px;
  background: #fff;
  font-size: 14px;
}
.input.is-error {
  border-color: #ef4444;
}
.help {
  margin-top: 6px;
  color: #6b7280;
  font-size: 12px;
}
.help .error {
  color: #ef4444;
  margin-left: 8px;
}

.checkbox-items {
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
}
.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 本文ツールバー */
.editor-toolbar {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
  flex-wrap: wrap;
}
.btn-mini {
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
}
.btn-mini:hover {
  background: #f9fafb;
}
.btn-mini.-danger {
  border-color: #fca5a5;
  color: #b91c1c;
}
.muted {
  color: #6b7280;
  font-size: 12px;
  margin-left: 4px;
}

/* 概要 */
.summary-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px 12px 8px;
  margin-bottom: 12px;
}
.summary-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.summary-no {
  font-weight: 800;
  color: #374151;
}
.summary-actions {
  display: flex;
  gap: 6px;
}
.form-subitem {
  margin-bottom: 10px;
}
.form-sublabel {
  display: block;
  font-size: 13px;
  color: #4b5563;
  margin-bottom: 6px;
}
.summary-add {
  margin-top: 8px;
}
.btn-add {
  border: 1px dashed #9ca3af;
  background: #fff;
  border-radius: 999px;
  padding: 6px 12px;
  cursor: pointer;
}

/* 画像アップロード（メイン） */
.section-title {
  font-weight: 800;
  text-align: center;
  margin: 12px 0;
}
.uploader {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  background: #fff;
  padding: 24px;
  text-align: center;
}
.uploader-inner {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
}
.uploader__icon {
  font-size: 22px;
}
.btn-file {
  display: inline-block;
  background: #2563eb;
  color: #fff;
  padding: 8px 12px;
  border-radius: 999px;
  cursor: pointer;
}

.thumbs {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 10px;
}
.thumb {
  position: relative;
  width: 140px;
  height: 100px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}
.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.thumb-del {
  position: absolute;
  top: 4px;
  right: 4px;
  background: #111827;
  color: #fff;
  border: none;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  cursor: pointer;
}
.thumb-cap {
  position: absolute;
  bottom: 2px;
  right: 6px;
  color: #fff;
  background: rgba(0, 0, 0, 0.4);
  padding: 2px 6px;
  border-radius: 999px;
  font-size: 12px;
}

/* 確認画面 */
.confirm-lead {
  margin-bottom: 14px;
  color: #4b5563;
}
.multiline {
  white-space: pre-wrap;
  line-height: 1.7;
}
.public-url {
  color: #0ea5e9;
  text-decoration: underline;
  word-break: break-all;
}
.public-url.-muted {
  color: #6b7280;
  text-decoration: none;
}

/* 詳細ページ側の本文領域例： .news-detail .article-body 等に合わせて調整 */
.article-body .ann-img {
  margin: 16px 0;
  text-align: center;
}
.article-body .ann-img img {
  max-width: 100%;
  height: auto;
}
.article-body .ann-img figcaption {
  margin-top: 6px;
  font-size: 0.875rem;
  color: #6b7280; /* グレー */
  line-height: 1.5;
}

/* === 確認画面の2ボタン（PCのみ・このブロックだけ変更）=================== */
@media (min-width: 768px) {
  /* ボタン一式のラッパーを中央寄せ（上下左右） */
  .back-btn-items {
    display: flex;
    flex-wrap: wrap; /* 1行目:リード文 / 2行目:ボタン×2 */
    justify-content: center; /* 水平方向センター */
    align-items: center; /* 垂直方向センター */
    gap: 16px 28px;
    min-height: 42vh; /* 画面中央に来るよう高さ確保 */
    margin: 0 auto;
  }
  .back-btn-items .form-btn-items-lead {
    flex: 0 0 100%;
    text-align: center;
    font-weight: 700;
    color: #374151;
    margin: 0 0 4px;
  }
  .back-btn-items .form-btn-item {
    flex: 0 0 320px; /* ボタン幅 */
  }

  /* ボタン見た目（この画面内のみ作用） */
  .back-btn-items .btn {
    width: 100%;
    padding: 14px 18px;
    border-radius: 14px;
    font-weight: 800;
    font-size: 16px;
    transition:
      transform 0.06s ease,
      box-shadow 0.2s ease,
      background 0.2s ease,
      filter 0.2s ease;
  }
  .back-btn-items .btn:active {
    transform: translateY(1px);
  }

  /* 決定ボタン：グラデ＋立体感 */
  .back-btn-items .btn-primary {
    background: linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%);
    color: #fff;
    border: 1px solid #1e40af;
    box-shadow: 0 10px 24px rgba(29, 78, 216, 0.25);
  }
  .back-btn-items .btn-primary:hover {
    filter: brightness(1.05);
    box-shadow: 0 14px 28px rgba(29, 78, 216, 0.28);
  }
  .back-btn-items .btn-primary:disabled {
    opacity: 0.6;
    box-shadow: none;
    cursor: not-allowed;
  }

  /* 修正ボタン：白ベースのアウトライン */
  .back-btn-items .btn-back {
    background: #fff;
    color: #334155;
    border: 1px solid #cbd5e1;
    box-shadow: 0 8px 20px rgba(2, 6, 23, 0.06);
  }
  .back-btn-items .btn-back:hover {
    background: #f8fafc;
    border-color: #94a3b8;
  }
}

.preview-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}
.btn-mini.active {
  border-color: #2563eb;
  color: #1d4ed8;
  font-weight: 800;
}
.preview-box {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px;
}
.code-box {
  background: #0b1020;
  color: #e5e7eb;
  border-radius: 10px;
  padding: 12px;
  overflow: auto;
  white-space: pre-wrap;
  line-height: 1.6;
}

/* === 入力画面のボタン（下書き保存/確認）を同じデザインにする === */
.form-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 16px;
}

.form-actions .btn {
  flex: 1 1 240px;
  width: 100%;
  padding: 14px 18px;
  border-radius: 14px;
  font-weight: 800;
  font-size: 16px;
  cursor: pointer;
  border: 1px solid transparent;
  transition:
    transform 0.06s ease,
    box-shadow 0.2s ease,
    background 0.2s ease,
    filter 0.2s ease;
  display: inline-flex;
  align-items: center; /* 縦中央 */
  justify-content: center; /* 横中央 */
  text-align: center;
}

.form-actions .btn:active {
  transform: translateY(1px);
}

/* btn-primary の見た目（確認画面と同じ） */
.form-actions .btn-primary {
  background: linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%);
  color: #fff;
  border: 1px solid #1e40af;
  box-shadow: 0 10px 24px rgba(29, 78, 216, 0.25);
}

.form-actions .btn-primary:hover {
  filter: brightness(1.05);
  box-shadow: 0 14px 28px rgba(29, 78, 216, 0.28);
}

.form-actions .btn-primary:disabled {
  opacity: 0.6;
  box-shadow: none;
  cursor: not-allowed;
}
.btn-ghost {
  background: #fff;
  color: #334155;
  border: 1px solid #cbd5e1;
  box-shadow: 0 8px 20px rgba(2, 6, 23, 0.06);
}
.btn-ghost:hover {
  background: #f8fafc;
  border-color: #94a3b8;
}
.btn-ghost:disabled {
  opacity: 0.6;
  box-shadow: none;
  cursor: not-allowed;
}
</style>
