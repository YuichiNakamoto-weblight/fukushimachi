<!-- src/views/Auth/BusinessProfileEditView.vue -->
<template>
  <body class="mypage-profle is-employer is-login">
    <div class="wrap">
      <!-- 共通ヘッダー -->
      <!-- <AppHeader /> -->
      <AppHeader data-app-header />
      <HamburgerMenu />
      <FooterNav />

      <div class="content">
        <main>
          <section class="l-sec mypage-detail">
            <div class="page-title maru">プロフィールの編集</div>

            <!-- リード：編集/確認で出し分け -->
            <div class="inner signup-lead">
              <template v-if="!confirming">
                <p class="txt-center">
                  登録済みの事業者プロフィールを編集します。<br />
                  入力後「登録情報を確認する」を押してください。
                </p>
              </template>
              <template v-else>
                <strong>更新内容をご確認ください。</strong>
                <p>以下の内容で更新します。問題がなければ「更新する」ボタンを押してください。</p>
              </template>
            </div>

            <div class="form-wrap">
              <div class="inner">
                <!-- ローディング -->
                <div v-if="loading" class="loading">読み込み中…</div>

                <!-- ===== 編集フォーム ===== -->
                <form v-else v-show="!confirming" @submit.prevent="startConfirm" class="form">
                  <div class="form-items">
                    <p v-if="message" :class="ok ? 'msg-success' : 'msg-error'">
                      {{ message }}
                    </p>

                    <!-- 事業者名／カナ -->
                    <div class="form-item">
                      <label for="employer_name"
                        >事業者名（全角）<span class="req">※必須</span></label
                      >
                      <input
                        id="employer_name"
                        type="text"
                        v-model.trim="f.business_name"
                        required
                      />
                    </div>
                    <div class="form-item">
                      <label for="employer_kana"
                        >事業者名カナ（全角）<span class="req">※必須</span></label
                      >
                      <input
                        id="employer_kana"
                        type="text"
                        v-model.trim="f.business_kana"
                        required
                      />
                    </div>

                    <!-- 郵便番号／都道府県／市町村 -->
                    <div class="form-item w50">
                      <label for="employer_zipcode"
                        >郵便番号（半角数字・ハイフンなし）<span class="req">※必須</span></label
                      >
                      <input
                        id="employer_zipcode"
                        type="text"
                        inputmode="numeric"
                        maxlength="7"
                        v-model.trim="f.postcode"
                        required
                      />
                    </div>

                    <div class="form-item">
                      <label for="employer_pref">都道府県<span class="req">※必須</span></label>
                      <select id="employer_pref" v-model.number="f.prefecture_id" required>
                        <option :value="null" disabled>選択してください</option>
                        <option v-for="p in prefList" :key="p.id" :value="p.id">
                          {{ p.name }}
                        </option>
                      </select>
                      <div class="note" v-if="prefLoading">都道府県を読み込み中…</div>
                      <div class="msg-error" v-if="prefErr">{{ prefErr }}</div>
                    </div>

                    <!-- 市町村（マスタ参照） -->
                    <div class="form-item">
                      <label for="employer_city">市町村<span class="req">※必須</span></label>

                      <select id="employer_city" v-model.number="f.work_location_id" required>
                        <option :value="null" disabled>選択してください</option>
                        <option v-for="c in workLocationList" :key="c.id" :value="c.id">
                          {{ c.name }}
                        </option>
                      </select>

                      <div class="note" v-if="workLocationLoading">市町村を読み込み中…</div>
                      <div class="msg-error" v-if="workLocationErr">{{ workLocationErr }}</div>
                    </div>

                    <div class="form-item">
                      <label for="employer_address1"
                        >住所（全角）<span class="req">※必須</span></label
                      >
                      <input
                        id="employer_address1"
                        type="text"
                        v-model.trim="f.address_line1"
                        required
                      />
                    </div>
                    <div class="form-item">
                      <label for="employer_address2">建物（全角）</label>
                      <input id="employer_address2" type="text" v-model.trim="f.address_line2" />
                    </div>

                    <!-- 電話 -->
                    <div class="form-item">
                      <label for="employer_tel"
                        >電話番号（半角数字・ハイフンなし）<span class="req">※必須</span></label
                      >
                      <input
                        id="employer_tel"
                        type="text"
                        inputmode="numeric"
                        pattern="[0-9]+"
                        v-model.trim="f.phone"
                        required
                      />
                    </div>

                    <!-- 認証 -->
                    <!-- <div class="form-item">
                  <label for="employer_license">ふくしま介護の職場認証評価取得の有無</label>
                  <select id="employer_license" v-model.number="f.certification_id">
                    <option :value="null" disabled>選択してください</option>
                    <option v-for="c in certList" :key="c.id" :value="c.id">{{ c.name }}</option>
                  </select>
                  <div class="note" v-if="certLoading">認証マスタを読み込み中…</div>
                  <div class="msg-error" v-if="certErr">{{ certErr }}</div>
                </div> -->

                    <!-- 管理担当者 -->
                    <div class="form-items-subtitle txt-center">管理担当者について</div>
                    <div class="form-item">
                      <label for="mgr_ln">姓（全角）<span class="req">※必須</span></label>
                      <input id="mgr_ln" type="text" v-model.trim="f.manager_last_name" required />
                    </div>
                    <div class="form-item">
                      <label for="mgr_fn">名（全角）<span class="req">※必須</span></label>
                      <input id="mgr_fn" type="text" v-model.trim="f.manager_first_name" required />
                    </div>
                    <div class="form-item">
                      <label for="mgr_lk">姓カナ（全角）<span class="req">※必須</span></label>
                      <input
                        id="mgr_lk"
                        type="text"
                        v-model.trim="f.manager_last_name_kana"
                        required
                      />
                    </div>
                    <div class="form-item">
                      <label for="mgr_fk">名カナ（全角）<span class="req">※必須</span></label>
                      <input
                        id="mgr_fk"
                        type="text"
                        v-model.trim="f.manager_first_name_kana"
                        required
                      />
                    </div>

                    <!-- メール -->
                    <div class="form-item">
                      <label for="contact_email"
                        >メールアドレス<span class="req">※必須</span></label
                      >
                      <input
                        id="contact_email"
                        type="text"
                        autocomplete="email"
                        v-model.trim="f.contact_email"
                        required
                      />
                    </div>

                    <p class="txt-center">入力内容を確認のうえ更新してください。</p>

                    <!-- 確認へ -->
                    <div class="form-btn-item">
                      <button type="submit" class="btn btn-primary maru" :disabled="saving">
                        登録情報を確認する
                      </button>
                    </div>
                  </div>
                </form>

                <!-- ===== 確認画面 ===== -->
                <section v-if="!loading && confirming" class="l-sec signup-detail">
                  <div class="form-wrap error">
                    <div class="inner">
                      <div class="conf-items">
                        <div class="conf-item">
                          <span class="label-name">事業所名</span>
                          <span class="conf-result">{{ f.business_name || "-" }}</span>
                        </div>
                        <div class="conf-item">
                          <span class="label-name">事業所カナ</span>
                          <span class="conf-result">{{ f.business_kana || "-" }}</span>
                        </div>
                        <div class="conf-item">
                          <span class="label-name">郵便番号</span>
                          <span class="conf-result">{{ f.postcode || "-" }}</span>
                        </div>
                        <div class="conf-item">
                          <span class="label-name">都道府県</span>
                          <span class="conf-result">{{
                            prefectureName || f.prefectures || "-"
                          }}</span>
                        </div>
                        <div class="conf-item">
                          <span class="label-name">市町村</span>
                          <span class="conf-result">{{ workLocationName || f.city || "-" }}</span>
                        </div>
                        <div class="conf-item">
                          <span class="label-name">住所</span>
                          <span class="conf-result">{{ f.address_line1 || "-" }}</span>
                        </div>
                        <div class="conf-item">
                          <span class="label-name">建物</span>
                          <span class="conf-result">{{ f.address_line2 || "-" }}</span>
                        </div>
                        <div class="conf-item">
                          <span class="label-name">電話番号</span>
                          <span class="conf-result">{{ f.phone || "-" }}</span>
                        </div>
                        <div class="conf-item">
                          <span class="label-name">認証取得</span>
                          <span class="conf-result">
                            {{ certName || "選択なし" }}
                            <template v-if="certName">
                              <div class="note indent" style="margin-top: 6px">
                                認証には福島県への申請が必要です。求人には認証マークが表示されます。
                              </div>
                              <div style="margin-top: 8px">
                                <img
                                  v-if="certMarkSrc"
                                  :src="certMarkSrc"
                                  alt="認証マーク"
                                  style="width: 90px; height: auto"
                                />
                              </div>
                            </template>
                          </span>
                        </div>
                        <div class="conf-item flex">
                          <div>
                            <span class="label-name">管理担当者（姓）</span>
                            <span class="conf-result">{{ f.manager_last_name || "-" }}</span>
                          </div>
                          <div>
                            <span class="label-name">管理担当者（名）</span>
                            <span class="conf-result">{{ f.manager_first_name || "-" }}</span>
                          </div>
                        </div>
                        <div class="conf-item flex">
                          <div>
                            <span class="label-name">フリガナ（セイ）</span>
                            <span class="conf-result">{{ f.manager_last_name_kana || "-" }}</span>
                          </div>
                          <div>
                            <span class="label-name">フリガナ（メイ）</span>
                            <span class="conf-result">{{ f.manager_first_name_kana || "-" }}</span>
                          </div>
                        </div>
                        <div class="conf-item">
                          <span class="label-name">メールアドレス</span>
                          <span class="conf-result">{{ f.contact_email || "-" }}</span>
                        </div>
                      </div>

                      <!-- ボタン -->
                      <div class="back-btn-items">
                        <form class="form" @submit.prevent="saveAndComplete">
                          <div class="form-btn-items-lead">この内容で更新しますか？</div>
                          <div class="form-btn-item">
                            <button type="submit" class="btn btn-primary maru" :disabled="saving">
                              {{ saving ? "保存中…" : "更新する" }}
                            </button>
                          </div>
                          <div class="form-btn-item">
                            <!-- <button type="button" class="btn btn-back" @click="confirming=false">修正する</button> -->
                            <button type="button" class="btn btn-back" @click="backToEdit">
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
import { ref, computed, onMounted, nextTick, onBeforeUnmount, watch } from "vue";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";
import lcStandard from "@/assets/lc-standard.svg";
import lcHigh from "@/assets/lc-highi.svg";
// import bgPc from '@/assets/images/common/bg-pc.png'

import AppHeader from "@/components/layout/AppHeader.vue";
import AppFooter from "@/components/layout/AppFooter.vue";
import HamburgerMenu from "@/components/layout/HamburgerMenu.vue";
import FooterNav from "@/components/layout/FooterNav.vue";
import PcModel from "@/components/layout/PcModel.vue";

/* API クライアント */
const API = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api" });
API.interceptors.request.use((config) => {
  const t = localStorage.getItem("token");
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

const router = useRouter();
const route = useRoute();

/* フォームモデル */
const f = ref({
  user_id: null,
  business_name: "",
  business_kana: "",
  postcode: "",
  prefecture_id: null,
  prefectures: null,
  work_location_id: null, // ★追加
  city: "",
  address_line1: "",
  address_line2: "",
  phone: "",
  certification_id: null,
  manager_last_name: "",
  manager_first_name: "",
  manager_last_name_kana: "",
  manager_first_name_kana: "",
  contact_email: "",
});

/* 状態 */
const loading = ref(true);
const saving = ref(false);
const message = ref("");
const ok = ref(false);
const confirming = ref(false);
const exists = ref(false);

/* マスタ */
const prefLoading = ref(true);
const prefErr = ref("");
const prefList = ref([]);
const certLoading = ref(true);
const certErr = ref("");
const certList = ref([]);
const workLocationLoading = ref(true);
const workLocationErr = ref("");
const workLocationList = ref([]);

/* ✅ ユーザーID 解決（求職者側と同じ・実績有り） */
function resolveUserId() {
  // userId / auth_user / ルートクエリ の順で探す
  const pickId = (raw) => {
    if (!raw) return null;
    try {
      const v = JSON.parse(raw);
      if (typeof v === "number") return v > 0 ? v : null;
      if (typeof v === "string") return Number(v) || null;
      if (typeof v === "object" && v) {
        return Number(v.id ?? v.userId ?? v.user?.id ?? 0) || null;
      }
    } catch {
      const n = Number(String(raw).replace(/"/g, ""));
      return Number.isFinite(n) && n > 0 ? n : null;
    }
    return null;
  };

  const idFromStorage =
    pickId(localStorage.getItem("userId")) ??
    pickId(sessionStorage.getItem("userId")) ??
    pickId(localStorage.getItem("auth_user"));

  const idFromQuery = Number(route.query.uid ?? route.query.userId ?? 0) || null;

  return idFromStorage ?? idFromQuery;
}

/** 応答から1レコードを安全に取り出す */
function pickProfileRow(data) {
  if (!data) return null;
  if (data.profile && typeof data.profile === "object") return data.profile;
  if (data.item && typeof data.item === "object") return data.item;
  const arr = data.items || data.rows || data.list || data.result || data.data;
  if (Array.isArray(arr) && arr.length) return arr[0];
  if (data.user_id || data.business_name) return data;
  return null;
}

/** DB → フォームの正規化（型やキーのズレを吸収） */
function normalizeBusinessProfile(row) {
  if (!row || typeof row !== "object") return null;
  const toNum = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };
  return {
    user_id: toNum(row.user_id),
    business_name: row.business_name ?? "",
    business_kana: row.business_kana ?? "",
    postcode: (row.postcode ?? "").toString(),
    prefecture_id: toNum(row.prefecture_id),
    prefectures: row.prefectures ?? null,

    work_location_id: toNum(row.work_location_id), // ★ここに追加
    city: row.city ?? "", // cityも維持

    address_line1: row.address_line1 ?? "",
    address_line2: row.address_line2 ?? "",
    phone: (row.phone ?? "").toString(),
    certification_id: toNum(row.certification_id),
    manager_last_name: row.manager_last_name ?? "",
    manager_first_name: row.manager_first_name ?? "",
    manager_last_name_kana: row.manager_last_name_kana ?? "",
    manager_first_name_kana: row.manager_first_name_kana ?? "",
    contact_email: row.contact_email ?? "",
  };
}

/** 既存プロファイルを多段で取得（どれか当たればOK） */
async function loadExistingByUserId(uid) {
  const tryGet = async (url) => {
    try {
      const { data } = await API.get(url);
      const row = pickProfileRow(data);
      if (!row) return false;
      const norm = normalizeBusinessProfile(row);
      if (!norm) return false;

      Object.assign(f.value, norm);
      f.value.user_id = uid;
      exists.value = true;
      return true;
    } catch {
      return false;
    }
  };

  if (await tryGet(`/business/profile/${uid}`)) return;
  if (await tryGet(`/business/profiles/${uid}`)) return;
  if (await tryGet(`/business/profile?user_id=${uid}`)) return;
  if (await tryGet(`/business/profile/by-user/${uid}`)) return;

  exists.value = false;
}

/* マスタ取得 */
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

/* 表示用 */
const prefectureName = computed(() => {
  const p = prefList.value.find((x) => Number(x.id) === Number(f.value.prefecture_id));
  return p?.name || "";
});
const certName = computed(() => {
  const c = certList.value.find((x) => Number(x.id) === Number(f.value.certification_id));
  return c?.name || "";
});
const certMarkSrc = computed(() => {
  const n = certName.value;
  if (!n) return null;
  if (n.includes("ハイレベル")) return lcHigh;
  if (n.includes("スタンダード")) return lcStandard;
  return null;
});
const workLocationName = computed(() => {
  const c = workLocationList.value.find((x) => Number(x.id) === Number(f.value.work_location_id));
  return c?.name || "";
});

/* サニタイズ */
function sanitizePayload(raw) {
  const p = { ...raw };
  if (p.work_location_id === 0) p.work_location_id = null; // ★追加

  if (p.postcode) p.postcode = String(p.postcode).replace(/-/g, "");
  if (p.phone) p.phone = String(p.phone).replace(/[^0-9]/g, "");
  if (p.prefecture_id === 0) p.prefecture_id = null;
  if (p.certification_id === 0) p.certification_id = null;
  for (const k of Object.keys(p)) if (p[k] === "") p[k] = null;
  return p;
}

/* 確認へ */
function startConfirm() {
  message.value = "";
  ok.value = false;
  if (!f.value.user_id) {
    message.value = "ユーザーIDを取得できませんでした。";
    return;
  }
  confirming.value = true;
  // 確認画面を表示したらページ上部へ
  nextTick(() => {
    // メインセクションの先頭にスクロール（取れなければ window 先頭へ）
    const topEl = document.querySelector(".l-sec.mypage-detail") || document.body;
    topEl.scrollIntoView({ behavior: "smooth", block: "start" });
    // 念のため window も上へ
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function backToEdit() {
  confirming.value = false;
  nextTick(() => {
    const topEl = document.querySelector(".l-sec.mypage-detail") || document.body;
    topEl.scrollIntoView({ behavior: "smooth", block: "start" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* 保存 */
async function save() {
  message.value = "";
  ok.value = false;
  if (!f.value.user_id) {
    message.value = "ユーザーIDを取得できませんでした。";
    return false;
  }
  saving.value = true;
  try {
    const payload = sanitizePayload(f.value); // ←ここだけでOK

    const { data } = await API.post("/business/profile", payload);
    ok.value = true;
    exists.value = true;
    message.value = data?.message || "保存しました。";
    return true;
  } catch (e) {
    const s = e?.response?.status;
    message.value =
      e?.response?.data?.error ||
      (s === 400
        ? "必須項目が未入力です。"
        : s === 401
          ? "未ログインです（OTP認証を完了してください）。"
          : "保存に失敗しました。");
    ok.value = false;
    return false;
  } finally {
    saving.value = false;
  }
}

/* 保存→完了ページ（既存の complete を流用） */
const saveAndComplete = async () => {
  const ok = await save();
  if (!ok) return;
  try {
    await router.replace({ name: "BusinessProfileEditComplete" });
  } catch (err1) {
    console.debug("[nav] complete by name failed:", err1?.message);
    try {
      await router.replace("/business/complete");
    } catch (err2) {
      console.debug("[nav] complete by path failed:", err2?.message);
      window.location.assign("/business/complete");
    }
  }
};

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

/* 初期化 */
onMounted(async () => {
  f.value.user_id = resolveUserId();

  await Promise.all([loadPrefectures(), loadCertifications(), loadWorkLocations()]);

  if (f.value.user_id) {
    await loadExistingByUserId(f.value.user_id);

    // city → work_location_id 補完（既存データが city のみのケース対応）
    if (!f.value.work_location_id && f.value.city && workLocationList.value.length) {
      const hit = workLocationList.value.find(
        (x) => (x.name || "").trim() === String(f.value.city).trim(),
      );
      if (hit) f.value.work_location_id = Number(hit.id);
    }
  }

  loading.value = false;
});

const headerH = ref(72); // 仮の初期値（必要なら 64 などに）

function updateHeaderHeight() {
  // AppHeader のルート要素に合わせてセレクタを調整してください
  // const headerEl =
  //   document.querySelector('.app-header') ||
  //   document.querySelector('header') ||
  //   document.querySelector('[data-site-header]')
  const headerEl =
    document.querySelector("[data-app-header]") || // ← これを最優先
    document.querySelector("header");

  if (!headerEl) return;
  const rect = headerEl.getBoundingClientRect();
  headerH.value = Math.max(0, Math.round(rect.height));
  document.documentElement.style.setProperty("--header-height", `${headerH.value}px`);
}

onMounted(() => {
  updateHeaderHeight();
  window.addEventListener("resize", updateHeaderHeight, { passive: true });
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", updateHeaderHeight);
});
</script>

<style scoped>
.loading {
  padding: 24px;
  text-align: center;
  color: #666;
}
.req {
  color: #d92d20;
  font-weight: 600;
  margin-left: 0.4em;
}
.form-item input,
.form-item textarea,
.form-item select {
  background: #fff;
}
.btn.btn-primary.maru {
  background-color: #42b2e6;
  color: #fff;
}
.btn.btn-back {
  background: #81b7c1;
  padding: 13px 24px;
  text-align: center;
  color: #fff;
  border-radius: 18px;
  width: 100%;
}

/* スマホ時：.content を下げてマージン相殺を回避 */
@media (max-width: 768px) {
  :root {
    --header-height: 72px;
  } /* JS が実測で上書きする初期値 */
  .content {
    padding-top: var(--header-height);
  }
  /* 先頭セクションの上マージンを念のため無効化 */
  .content > main > .l-sec:first-child {
    margin-top: 0;
  }
}
</style>
