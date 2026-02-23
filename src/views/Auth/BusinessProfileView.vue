<!-- src/views/Auth/BusinessProfileView.vue -->
<!-- 事業者用プロフィール登録 -->
<template>
  <body class="is-employer">
    <div class="wrap">
      <!-- <div class="wrap":class="[{ 'is-employer': defaultUserType==='employer', 'is-guest': true }, pageSlug]"> -->

      <!-- 共通ヘッダー -->
      <AppHeader />
      <HamburgerMenu />
      <FooterNav />

      <main>
        <section class="l-sec mypage-detail">
          <div class="page-title maru">プロフィール作成</div>
          <!-- 編集/確認でリード文を出し分け -->
          <div class="inner signup-lead">
            <template v-if="!confirming">
              <div class="signup-step flex">
                <div class="signup-step__step step1">アカウント<br />登録</div>
                <div class="signup-step__step step2">ワンタイム<br />パスワード<br />入力</div>
                <div class="signup-step__step step3 select">プロフィール<br />作成</div>
                <div class="signup-step__step step4">完了</div>
              </div>
              <p>
                <strong>アカウント登録が完了しました。</strong><br />
                ご登録いただきありがとうございます。続けて、あなたのプロフィールをご登録ください。
              </p>
            </template>
            <template v-else>
              <strong>登録内容をご確認ください。</strong>
              <p>以下の内容で登録します。問題がなければ「登録する」ボタンを押してください。</p>
            </template>
          </div>

          <div class="form-wrap">
            <div class="inner">
              <!-- ローディング -->
              <div v-if="loading" class="loading">読み込み中…</div>

              <!-- ===== 編集ステップ ===== -->
              <form v-else v-show="!confirming" @submit.prevent="startConfirm" class="form">
                <div class="form-items">
                  <!-- メッセージ -->
                  <p v-if="message" :class="ok ? 'msg-success' : 'msg-error'">{{ message }}</p>

                  <!-- 事業者名／カナ -->
                  <div class="form-item">
                    <label for="employer_name"
                      >事業者名（全角）<span class="req">※必須</span></label
                    >
                    <input
                      id="employer_name"
                      type="text"
                      name="employer_name"
                      placeholder="社会福祉法人⚫︎⚫︎⚫︎会"
                      v-model.trim="f.business_name"
                      required
                    />
                  </div>
                  <!-- <div class="form-item">
                  <label for="employer_kana">事業者名カナ（全角）<span class="req">※必須</span></label>
                  <input id="employer_kana" type="text" name="employer_kana" placeholder="シャカイフクシホウジン⚫︎⚫︎カイ" v-model.trim="f.business_kana" required />
                </div> -->
                  <div class="form-item" :class="{ error: kanaErr.business_kana }">
                    <label for="employer_kana"
                      >事業者名カナ（全角）<span class="req">※必須</span></label
                    >
                    <input
                      id="employer_kana"
                      type="text"
                      name="employer_kana"
                      placeholder="シャカイフクシホウジン⚫︎⚫︎カイ"
                      v-model.trim="f.business_kana"
                      required
                      pattern="^[ァ-ヶー・\s ]+$"
                      title="全角カタカナで入力してください"
                      inputmode="kana"
                    />
                    <p v-if="kanaErr.business_kana" class="error-message">
                      全角カタカナで入力してください。
                    </p>
                  </div>
                  <!-- 郵便番号／都道府県／市町村 -->
                  <div class="form-item w50">
                    <label for="employer_zipcode"
                      >郵便番号（半角数字）※ハイフンは含めない<span class="req">※必須</span></label
                    >
                    <input
                      id="employer_zipcode"
                      type="text"
                      name="employer_zipcode"
                      class="zipcode"
                      placeholder="9608670"
                      inputmode="numeric"
                      maxlength="7"
                      v-model.trim="f.postcode"
                      required
                    />
                  </div>

                  <div class="form-item">
                    <label for="employer_pref">都道府県<span class="req">※必須</span></label>
                    <select
                      id="employer_pref"
                      name="employer_pref"
                      v-model.number="f.prefecture_id"
                      required
                    >
                      <option :value="null" disabled>選択してください</option>
                      <option v-for="p in prefList" :key="p.id" :value="p.id">{{ p.name }}</option>
                    </select>
                    <div class="note" v-if="prefLoading">都道府県を読み込み中…</div>
                    <div class="msg-error" v-if="prefErr">{{ prefErr }}</div>
                  </div>

                  <!-- 市町村（マスタ参照） -->
                  <div class="form-item">
                    <label for="employer_city">市町村<span class="req">※必須</span></label>

                    <select
                      id="employer_city"
                      name="employer_city"
                      v-model.number="f.work_location_id"
                      required
                    >
                      <option :value="null" disabled>選択してください</option>
                      <option v-for="c in workLocationList" :key="c.id" :value="c.id">
                        {{ c.name }}
                      </option>
                    </select>

                    <div class="note" v-if="workLocationLoading">市町村を読み込み中…</div>
                    <div class="msg-error" v-if="workLocationErr">{{ workLocationErr }}</div>
                  </div>

                  <!-- 住所 -->
                  <div class="form-item">
                    <label for="employer_address1"
                      >住所（全角）<span class="req">※必須</span></label
                    >
                    <input
                      id="employer_address1"
                      type="text"
                      name="employer_address1"
                      placeholder="杉妻町2-16"
                      v-model.trim="f.address_line1"
                      required
                    />
                  </div>

                  <!-- 建物 -->
                  <div class="form-item">
                    <label for="employer_address2">建物（全角）</label>
                    <input
                      id="employer_address2"
                      type="text"
                      name="employer_address2"
                      placeholder="杉妻ビル"
                      v-model.trim="f.address_line2"
                    />
                  </div>

                  <!-- 電話番号（CSS適用のため text、補助は inputmode/pattern） -->
                  <div class="form-item">
                    <label for="employer_tel"
                      >電話番号（半角数字）※ハイフンは含めない<span class="req">※必須</span></label
                    >
                    <input
                      id="employer_tel"
                      type="text"
                      name="employer_tel"
                      placeholder="0249000000"
                      v-model.trim="f.phone"
                      inputmode="numeric"
                      pattern="[0-9]+"
                      required
                    />
                  </div>

                  <!-- 認証 ※2026年2月まで非表示にする-->
                  <!-- <div class="form-item">
                  <label for="employer_license">認証評価取得の有無</label>
                  <select id="employer_license" name="employer_license" v-model.number="f.certification_id">
                    <option :value="null" disabled>選択してください</option>
                    <option v-for="c in certList" :key="c.id" :value="c.id">{{ c.name }}</option>
                  </select>
                  <ul class="note indent">
                    <li>※登録した求人情報に認証マークが表示されます。</li>
                    <li>
                      ※認証制度は申請が必要となります。<br />
                      <a href="https://www.eidell.co.jp/fukushima-kaigo/" target="_blank" rel="noopener noreferrer">詳しくはこちらから</a>
                    </li>
                  </ul>
                  <div class="note" v-if="certLoading">認証マスタを読み込み中…</div>
                  <div class="msg-error" v-if="certErr">{{ certErr }}</div>
                </div> -->

                  <!-- 管理担当者 -->
                  <div class="form-items-subtitle txt-center">管理担当者について</div>
                  <div class="form-item">
                    <label for="employer_last_name">姓（全角）<span class="req">※必須</span></label>
                    <input
                      id="employer_last_name"
                      type="text"
                      name="employer_last_name"
                      placeholder="福島"
                      v-model.trim="f.manager_last_name"
                      required
                    />
                  </div>
                  <div class="form-item">
                    <label for="employer_first_name"
                      >名（全角）<span class="req">※必須</span></label
                    >
                    <input
                      id="employer_first_name"
                      type="text"
                      name="employer_first_name"
                      placeholder="町子"
                      v-model.trim="f.manager_first_name"
                      required
                    />
                  </div>
                  <!-- <div class="form-item">
                  <label for="employer_last_kana">姓カナ（全角）<span class="req">※必須</span></label>
                  <input id="employer_last_kana" type="text" name="employer_last_kana" placeholder="フクシマ" v-model.trim="f.manager_last_name_kana" required />
                </div> -->
                  <div class="form-item" :class="{ error: kanaErr.manager_last_name_kana }">
                    <label for="employer_last_kana"
                      >姓カナ（全角）<span class="req">※必須</span></label
                    >
                    <input
                      id="employer_last_kana"
                      type="text"
                      name="employer_last_kana"
                      placeholder="フクシマ"
                      v-model.trim="f.manager_last_name_kana"
                      required
                      pattern="^[ァ-ヶー・\s ]+$"
                      title="全角カタカナで入力してください"
                      inputmode="kana"
                    />
                    <p v-if="kanaErr.manager_last_name_kana" class="error-message">
                      全角カタカナで入力してください。
                    </p>
                  </div>
                  <!-- <div class="form-item">
                  <label for="employer_first_kana">名カナ（全角）<span class="req">※必須</span></label>
                  <input id="employer_first_kana" type="text" name="employer_first_kana" placeholder="マチコ" v-model.trim="f.manager_first_name_kana" required />
                </div> -->
                  <div class="form-item" :class="{ error: kanaErr.manager_first_name_kana }">
                    <label for="employer_first_kana"
                      >名カナ（全角）<span class="req">※必須</span></label
                    >
                    <input
                      id="employer_first_kana"
                      type="text"
                      name="employer_first_kana"
                      placeholder="マチコ"
                      v-model.trim="f.manager_first_name_kana"
                      required
                      pattern="^[ァ-ヶー・\s ]+$"
                      title="全角カタカナで入力してください"
                      inputmode="kana"
                    />
                    <p v-if="kanaErr.manager_first_name_kana" class="error-message">
                      全角カタカナで入力してください。
                    </p>
                  </div>
                  <!-- メール -->
                  <div class="form-item">
                    <label for="user_email">メールアドレス<span class="req">※必須</span></label>
                    <input
                      id="user_email"
                      type="user_email"
                      name="user_email"
                      placeholder="XXX@fukushimachi.com"
                      v-model.trim="f.contact_email"
                      autocomplete="email"
                      required
                    />
                  </div>

                  <p class="txt-center">登録情報はマイページから変更できます。</p>

                  <!-- 確認へ -->
                  <div class="form-btn-item">
                    <!-- <button type="submit" class="btn btn-primary maru" :disabled="saving">
                    登録情報を確認する
                  </button> -->
                    <button
                      type="submit"
                      class="btn btn-primary maru"
                      :disabled="saving || hasKanaError"
                    >
                      登録情報を確認する
                    </button>
                  </div>
                </div>
              </form>

              <!-- ===== 確認ステップ ===== -->
              <section v-if="!loading && confirming" class="l-sec signup-detail">
                <div class="form-wrap error">
                  <div class="inner">
                    <div class="conf-items">
                      <div class="conf-item">
                        <div class="user_business_name">
                          <span class="label-name">事業所名</span>
                          <span class="conf-result">{{ f.business_name || "-" }}</span>
                        </div>
                      </div>

                      <div class="conf-item">
                        <div class="user_business_kana">
                          <span class="label-name">事業所カナ</span>
                          <span class="conf-result">{{ f.business_kana || "-" }}</span>
                        </div>
                      </div>

                      <div class="conf-item">
                        <div class="user_zipcode">
                          <span class="label-name">郵便番号</span>
                          <span class="conf-result">{{ f.postcode || "-" }}</span>
                        </div>
                      </div>

                      <div class="conf-item">
                        <div class="user_pref">
                          <span class="label-name">都道府県</span>
                          <span class="conf-result">{{
                            prefectureName || f.prefectures || "-"
                          }}</span>
                        </div>
                      </div>

                      <div class="conf-item">
                        <div class="user_city">
                          <span class="label-name">市町村</span>
                          <span class="conf-result">{{ workLocationName || f.city || "-" }}</span>
                        </div>
                      </div>

                      <div class="conf-item">
                        <div class="user_addr1">
                          <span class="label-name">住所</span>
                          <span class="conf-result">{{ f.address_line1 || "-" }}</span>
                        </div>
                      </div>

                      <div class="conf-item">
                        <div class="user_addr2">
                          <span class="label-name">建物</span>
                          <span class="conf-result">{{ f.address_line2 || "-" }}</span>
                        </div>
                      </div>

                      <div class="conf-item">
                        <div class="user_tel">
                          <span class="label-name">電話番号</span>
                          <span class="conf-result">{{ f.phone || "-" }}</span>
                        </div>
                      </div>

                      <!-- 認証取得 ※2026年2月まで非表示にする -->
                      <!-- <div class="conf-item">
                      <div class="user_cert">
                        <span class="label-name">ふくしま介護の職場認証評価取得の有無</span>
                        <span class="conf-result">
                          {{ certName || '選択なし' }}
                          <template v-if="certName">
                            <div class="note indent" style="margin-top:6px;">
                              認証には福島県への申請が必要です。<br />
                              求人には認証マークが表示されます。
                            </div>
                            <div style="margin-top:8px;">
                              <img v-if="certMarkSrc" :src="certMarkSrc" alt="認証マーク" style="width:90px;height:auto;" />
                            </div>
                          </template>
                        </span>
                      </div>
                    </div> -->

                      <div class="conf-item flex">
                        <div class="user_manager_ln">
                          <span class="label-name">管理担当者（姓）</span>
                          <span class="conf-result">{{ f.manager_last_name || "-" }}</span>
                        </div>
                        <div class="user_manager_fn">
                          <span class="label-name">管理担当者（名）</span>
                          <span class="conf-result">{{ f.manager_first_name || "-" }}</span>
                        </div>
                      </div>

                      <div class="conf-item flex">
                        <div class="user_manager_lk">
                          <span class="label-name">フリガナ（セイ）</span>
                          <span class="conf-result">{{ f.manager_last_name_kana || "-" }}</span>
                        </div>
                        <div class="user_manager_fk">
                          <span class="label-name">フリガナ（メイ）</span>
                          <span class="conf-result">{{ f.manager_first_name_kana || "-" }}</span>
                        </div>
                      </div>

                      <div class="conf-item">
                        <div class="user_email">
                          <span class="label-name">メールアドレス</span>
                          <span class="conf-result">{{ f.contact_email || "-" }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- ボタン -->
                    <div class="back-btn-items">
                      <form class="form" @submit.prevent="saveAndComplete">
                        <div class="form-btn-items-lead">この内容で登録しますか？</div>
                        <div class="form-btn-item">
                          <button type="submit" class="btn btn-primary maru" :disabled="saving">
                            {{ saving ? "保存中…" : exists ? "更新する" : "登録する" }}
                          </button>
                        </div>
                        <div class="form-btn-item">
                          <button
                            type="button"
                            class="btn btn-back"
                            @click="
                              () => {
                                confirming = false;
                                nextTick(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
                              }
                            "
                          >
                            修正する
                          </button>
                        </div>
                      </form>
                    </div>

                    <p v-if="message" :class="ok ? 'msg-success' : 'msg-error'">{{ message }}</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>
      </main>

      <!-- 共通フッター -->
      <AppFooter />
    </div>

    <!-- <div class="body-bg pc">
    <img src="/src/assets/images/common/bg-pc.png" alt>
  </div>

  <div class="hero-copy pc">
    <img src="/src/assets/images/home/hero-copy.svg" alt="はなして、わかって、マッチする。あたらしい介護の就活。">
  </div>

  <div class="pc">
    <h1 class="sitelogo guest-content">
      <a href="/">
        <img src ="/src/assets/images/common/sitelogo.svg" alt="ふくしま介護福祉就職情報サイト「ふくしまち」">
      </a>
    </h1>

    <h1 class="sitelogo user-content">
      <a href="/user">
        <img src ="/src/assets/images/common/sitelogo.svg" alt="ふくしま介護福祉就職情報サイト「ふくしまち」">
      </a>
    </h1>

    <h1 class="sitelogo employer-content">
      <a href="/employer">
        <img src ="/src/assets/images/common/sitelogo.svg" alt="ふくしま介護福祉就職情報サイト「ふくしまち」">
      </a>
    </h1>
  </div>

  <div class="pc">
    <div class="user-content login-content">
      <div class="mypage-link">
        <a href="/user/mypage">
          <div class="mypage-link-tmb">
            <img src="/src/assets/images/common/ico-user.svg" alt="マイページ">
          </div>
          <span class="mypage-link-txt">マイページ</span>
        </a>
      </div>
    </div>

    <div class="employer-content login-content">
      <div class="mypage-link">
        <a href="/employer/mypage">
          <div class="mypage-link-tmb">
            <img src="/src/assets/images/common/ico-user.svg" alt="マイページ">
          </div>
          <span class="mypage-link-txt">マイページ</span>
        </a>
      </div>
    </div>
  </div> -->
  </body>
  <PcModel />
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from "vue";
import { reactive, watch } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
// import lcStandard from '@/assets/lc-standard.svg' //2026年2月まで非表示
// import lcHigh from '@/assets/lc-highi.svg'//2026年2月まで非表示

/* 共通ヘッダー／フッター */
import AppHeader from "@/components/layout/AppHeader.vue";
import AppFooter from "@/components/layout/AppFooter.vue";
import HamburgerMenu from "@/components/layout/HamburgerMenu.vue";
import FooterNav from "@/components/layout/FooterNav.vue";
import PcModel from "@/components/layout/PcModel.vue";

// APIクライアント（Authorization ヘッダー付与）
const API = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api" });
API.interceptors.request.use((config) => {
  const t = localStorage.getItem("token");
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

const router = useRouter();

const f = ref({
  user_id: null, // ← UPSERT版は必須
  business_name: "",
  business_kana: "",
  postcode: "",
  prefecture_id: null,
  prefectures: null, // 名称で送る場合に備え（API側でID解決）任意
  work_location_id: null, // ★追加（市町村マスタID）
  city: "",
  address_line1: "",
  address_line2: "",
  phone: "",
  certification_id: null, // ← 認証の外部キー
  manager_last_name: "",
  manager_first_name: "",
  manager_last_name_kana: "",
  manager_first_name_kana: "",
  contact_email: "",
});

const loading = ref(true);
const saving = ref(false);
const message = ref("");
const ok = ref(false);
const exists = ref(false);
const confirming = ref(false); // ★ 追加：確認ステップ制御

const prefLoading = ref(true);
const prefErr = ref("");
const prefList = ref([]);

const certLoading = ref(true);
const certErr = ref("");
const certList = ref([]);

const workLocationLoading = ref(true);
const workLocationErr = ref("");
const workLocationList = ref([]);

async function loadWorkLocations() {
  workLocationLoading.value = true;
  workLocationErr.value = "";
  try {
    const { data } = await API.get("/masters/work-locations");
    workLocationList.value = data?.items || [];
  } catch (e) {
    workLocationErr.value = e?.response?.data?.error || "市町村の取得に失敗しました。";
  } finally {
    workLocationLoading.value = false;
  }
}

const workLocationName = computed(() => {
  const c = workLocationList.value.find((x) => Number(x.id) === Number(f.value.work_location_id));
  return c?.name || "";
});

watch(
  () => f.value.work_location_id,
  (id) => {
    if (!id) {
      f.value.city = "";
      return;
    }
    const c = workLocationList.value.find((x) => Number(x.id) === Number(id));
    f.value.city = c?.name || "";
  },
);

/** 全角カタカナ + 長音・中点・空白のみ許可 */
const KATAKANA = /^[ァ-ヶー・\s ]+$/;

/** 半角 → 全角（NFKC）、ひらがな → カタカナ に寄せる */
function normalizeKana(input) {
  if (!input) return "";
  var s = String(input).normalize("NFKC");
  // ひらがな(ぁ-ゖ) → カタカナ(+0x60)
  s = s.replace(/[ぁ-ゖ]/g, function (ch) {
    return String.fromCharCode(ch.charCodeAt(0) + 0x60);
  });
  return s;
}

/** 各フィールドのエラー状態 */
const kanaErr = reactive({
  business_kana: false,
  manager_last_name_kana: false,
  manager_first_name_kana: false,
});

/** 入力を監視して自動正規化＆エラー反映 */
watch(
  () => f.value.business_kana,
  (v) => {
    var n = normalizeKana(v);
    if (n !== v) f.value.business_kana = n;
    kanaErr.business_kana = !!n && !KATAKANA.test(n);
  },
);
watch(
  () => f.value.manager_last_name_kana,
  (v) => {
    var n = normalizeKana(v);
    if (n !== v) f.value.manager_last_name_kana = n;
    kanaErr.manager_last_name_kana = !!n && !KATAKANA.test(n);
  },
);
watch(
  () => f.value.manager_first_name_kana,
  (v) => {
    var n = normalizeKana(v);
    if (n !== v) f.value.manager_first_name_kana = n;
    kanaErr.manager_first_name_kana = !!n && !KATAKANA.test(n);
  },
);

/** どれか1つでもエラーなら true */
const hasKanaError = computed(function () {
  return kanaErr.business_kana || kanaErr.manager_last_name_kana || kanaErr.manager_first_name_kana;
});

/** 送信直前の最終チェック（startConfirm/save 両方から呼ぶ） */
function assertKanaOrThrow() {
  var items = [
    ["事業者名カナ", "business_kana"],
    ["姓カナ", "manager_last_name_kana"],
    ["名カナ", "manager_first_name_kana"],
  ];
  for (var i = 0; i < items.length; i++) {
    var label = items[i][0];
    var key = items[i][1];
    var val = f.value[key] || "";
    var n = normalizeKana(val);
    if (n !== val) f.value[key] = n;
    kanaErr[key] = !!n && !KATAKANA.test(n);
    if (!n || kanaErr[key]) {
      throw new Error(label + "は全角カタカナで入力してください。");
    }
  }
}

function resolveUserId() {
  try {
    const raw = localStorage.getItem("auth_user");
    if (raw) {
      const u = JSON.parse(raw);
      if (u?.id) return Number(u.id);
    }
  } catch (err) {
    // パース失敗などは無視（ログだけ出す）
    console.warn("[resolveUserId] localStorage parse failed", err);
  }

  const params = new URLSearchParams(window.location.search || "");
  const qid = Number(params.get("uid") ?? params.get("userId") ?? 0);
  return qid || null;
}

async function loadPrefectures() {
  prefLoading.value = true;
  prefErr.value = "";
  try {
    const { data } = await API.get("/masters/prefectures");
    prefList.value = data?.items || [];
  } catch (e) {
    prefErr.value = e?.response?.data?.error || "都道府県の取得に失敗しました。";
  } finally {
    prefLoading.value = false;
  }
}

async function loadCertifications() {
  certLoading.value = true;
  certErr.value = "";
  try {
    const { data } = await API.get("/business/certifications");
    certList.value = data?.items || [];
  } catch (e) {
    certErr.value = e?.response?.data?.error || "認証マスタの取得に失敗しました。";
  } finally {
    certLoading.value = false;
  }
}

async function loadExistingByUserId(uid) {
  try {
    const { data } = await API.get(`/business/profile/${uid}`);
    const profile = data?.profile || null;
    if (profile) {
      Object.assign(f.value, profile);
      f.value.user_id = uid;
      exists.value = true;
    } else {
      exists.value = false;
    }
  } catch {
    exists.value = false;
  }
}

// 表示用：都道府県名
const prefectureName = computed(() => {
  const p = prefList.value.find((x) => Number(x.id) === Number(f.value.prefecture_id));
  return p?.name || "";
});

// 表示用：認証名称＆マーク ※2026年2月まで非表示
// const certName = computed(() => {
//   const c = certList.value.find(x => Number(x.id) === Number(f.value.certification_id))
//   return c?.name || ''
// })
// const certMarkSrc = computed(() => {
//   const n = certName.value
//   if (!n) return null
//   if (n.includes('ハイレベル')) return lcHigh
//   if (n.includes('スタンダード')) return lcStandard
//   return null
// })

// 入力サニタイズ
function sanitizePayload(raw) {
  const p = { ...raw };
  if (p.work_location_id === 0) p.work_location_id = null;
  if (p.postcode) p.postcode = String(p.postcode).replace(/-/g, "");
  if (p.phone) p.phone = String(p.phone).replace(/[^0-9]/g, "");
  if (p.prefecture_id === 0) p.prefecture_id = null;
  if (p.certification_id === 0) p.certification_id = null;
  for (const k of Object.keys(p)) if (p[k] === "") p[k] = null;
  return p;
}

// 「確認へ」
async function startConfirm() {
  try {
    assertKanaOrThrow();
  } catch (e) {
    message.value = e.message || "カタカナ入力を確認してください。";
    return;
  }
  message.value = "";
  ok.value = false;
  if (!f.value.user_id) {
    message.value = "ユーザーIDを取得できませんでした。";
    return;
  }
  confirming.value = true;
  await nextTick();
  window.scrollTo({ top: 0, behavior: "smooth" }); // ← これだけ
}

// 保存（ここでは遷移しない）
async function save() {
  try {
    assertKanaOrThrow();
  } catch (e) {
    message.value = e.message || "カタカナ入力を確認してください。";
    return false;
  }
  message.value = "";
  ok.value = false;
  if (!f.value.user_id) {
    message.value = "ユーザーIDを取得できませんでした。";
    return false;
  }
  saving.value = true;
  try {
    const payload = sanitizePayload(f.value);
    const { data } = await API.post("/business/profile", payload); // UPSERT
    exists.value = true;
    ok.value = true;
    message.value = data?.message || "保存しました。";
    // ★ 成功したら必ずローカル保存（次画面の遷移要件）
    persistEmployerLogin(f.value.user_id);
    return true;
  } catch (e) {
    const s = e?.response?.status;
    message.value =
      e?.response?.data?.error ||
      (s === 400
        ? "必須項目が未入力です。"
        : s === 401
          ? "未ログインです（OTP認証を完了してください）"
          : s === 409
            ? "既にプロフィールが存在します。"
            : "保存に失敗しました。");
    ok.value = false;
    return false;
  } finally {
    saving.value = false;
  }
}

// 保存→成功なら完了ページへ（多段フォールバック付き）
const saveAndComplete = async () => {
  const ok = await save();
  if (!ok) return;

  try {
    await router.replace({ name: "BusinessProfileComplete" }); // 1) 名前で遷移
  } catch (err1) {
    console.warn("[nav] replace by name failed:", err1);
    try {
      await router.replace("/business/complete"); // 2) パスで遷移
    } catch (err2) {
      console.error("[nav] replace by path failed:", err2);
      window.location.assign("/business/complete"); // 3) 最終フォールバック
    }
  }
};

function persistEmployerLogin(uid) {
  if (!uid) return;
  try {
    // 次画面が参照するキー
    localStorage.setItem("userId", String(uid));
    localStorage.setItem("userType", "employer");
  } catch (e) {
    console.warn("[persistEmployerLogin]", e);
  }
}

onMounted(async () => {
  f.value.user_id = resolveUserId();
  if (f.value.user_id) persistEmployerLogin(f.value.user_id);

  await Promise.all([loadPrefectures(), loadCertifications(), loadWorkLocations()]);

  if (f.value.user_id) {
    await loadExistingByUserId(f.value.user_id);

    // city→work_location_id 補完（既存データが city のみのケース対応）
    if (!f.value.work_location_id && f.value.city && workLocationList.value.length) {
      const hit = workLocationList.value.find(
        (x) => (x.name || "").trim() === String(f.value.city).trim(),
      );
      if (hit) f.value.work_location_id = Number(hit.id);
    }
  }
  loading.value = false;
});
</script>

<!-- デザイナーCSSを優先。必要最小限の補助のみ（背景が透ける対策） -->
<style>
.form-item input,
.form-item textarea,
.form-item select {
  background: #fff;
}
.btn.btn-primary.maru {
  background-color: #42b2e6;
}
.btn.btn-back {
  background: #81b7c1;
  padding: 13px 24px;
  text-align: center;
  color: white;
  border-radius: 18px;
  width: 100%;
}
:global(.wrap.is-employer) .signup-step__step.select {
  background: var(--color-employ); /* 事業者の色 */
  color: #fff;
}

.error-message {
  margin-top: 4px;
  color: #dc2626;
  font-size: 12px;
}
.form-item.error input {
  border-color: #dc2626;
}
</style>
