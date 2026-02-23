<!-- src/components/layout/FooterNav.vue -->
<!-- フッターナビ-->
<template>
  <nav>
    <!-- 未ログイン -->
    <!--<div class="foot-nav guest-content" v-if="!isAuthed">-->
    <div class="foot-nav" v-if="!isAuthed">
      <ul class="flex">
        <li>
          <RouterLink :to="{ name: 'RegisterChoice' }">
            <span class="foot-nav-ico"><img :src="navJoin" alt="新規登録" /></span>
            <span class="foot-nav-txt">新規登録</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'Login' }">
            <span class="foot-nav-ico"><img :src="navLogin" alt="ログイン" /></span>
            <span class="foot-nav-txt">ログイン</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink :to="{ path: '/news' }">
            <span class="foot-nav-ico"><img :src="navAbout" alt="お知らせ" /></span>
            <span class="foot-nav-txt">お知らせ</span>
          </RouterLink>
        </li>
        <li class="nav-job">
          <RouterLink :to="{ name: 'Jobs' }">
            <span class="foot-nav-ico"><img :src="navJob" alt="求人情報" /></span>
            <span class="foot-nav-txt">求人情報</span>
          </RouterLink>
        </li>
      </ul>
    </div>

    <!-- 求職者 -->
    <div class="foot-nav" v-else-if="isSeeker">
      <ul class="flex">
        <li class="has-badge">
          <RouterLink :to="{ name: 'Jobs', query: { view: 'clips' } }">
            <span class="foot-nav-ico"><img :src="navClip" alt="クリップ" /></span>
            <span class="foot-nav-txt">クリップ</span>
          </RouterLink>
          <!-- <span v-if="badges.clips>0" class="count">{{ compact(badges.clips) }}</span> -->
        </li>

        <li class="has-badge">
          <RouterLink :to="{ name: 'Jobs', query: { view: 'goods' } }">
            <span class="foot-nav-ico"><img :src="navGood" alt="グッド" /></span>
            <span class="foot-nav-txt">グッド</span>
          </RouterLink>
          <!-- <span v-if="badges.goods>0" class="count">{{ compact(badges.goods) }}</span> -->
        </li>

        <li class="has-badge">
          <RouterLink :to="{ name: 'MyTalks' }">
            <span class="foot-nav-ico"><img :src="navTalk" alt="トーク" /></span>
            <span class="foot-nav-txt">トーク</span>
          </RouterLink>
          <span v-if="badges.talks > 0" class="count">{{ compact(badges.talks) }}</span>
        </li>

        <li class="nav-job">
          <RouterLink :to="{ name: 'Jobs' }">
            <span class="foot-nav-ico"><img :src="navJob" alt="求人情報" /></span>
            <span class="foot-nav-txt">求人情報</span>
          </RouterLink>
        </li>
      </ul>
    </div>

    <!-- 事業者 -->
    <!-- <div class="foot-nav employer-content" v-else-if="isEmployer"> -->
    <div class="foot-nav" v-else-if="isEmployer">
      <ul class="flex">
        <li class="has-badge">
          <RouterLink :to="{ name: 'BizGoodsList' }">
            <span class="foot-nav-ico"><img :src="navGood" alt="グッド" /></span>
            <span class="foot-nav-txt">グッド</span>
          </RouterLink>
          <!-- <span v-if="badges.bizGoods>0" class="badge-unread">{{ compact(badges.bizGoods) }}</span> -->
          <span v-if="badges.bizGoods > 0" class="count">{{ compact(badges.bizGoods) }}</span>
        </li>

        <li class="has-badge">
          <RouterLink :to="{ name: 'BizTalkList' }">
            <span class="foot-nav-ico"><img :src="navTalk" alt="トーク" /></span>
            <span class="foot-nav-txt">トーク</span>
          </RouterLink>
          <!-- <span v-if="badges.bizTalks>0" class="badge-unread">{{ compact(badges.bizTalks) }}</span> -->
          <span v-if="badges.bizTalks > 0" class="count">{{ compact(badges.bizTalks) }}</span>
        </li>

        <li>
          <RouterLink :to="{ path: '/news' }">
            <span class="foot-nav-ico"><img :src="navAbout" alt="お知らせ" /></span>
            <span class="foot-nav-txt">お知らせ</span>
          </RouterLink>
        </li>

        <li class="nav-job">
          <RouterLink :to="{ name: 'Jobs' }">
            <span class="foot-nav-ico"><img :src="navJob" alt="求人情報" /></span>
            <span class="foot-nav-txt">求人情報</span>
          </RouterLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { RouterLink } from "vue-router";

import navJoin from "@/assets/images/common/nav-join.svg?url";
import navLogin from "@/assets/images/common/nav-login.svg?url";
import navAbout from "@/assets/images/common/nav-about.svg?url";
import navJob from "@/assets/images/common/nav-job.svg?url";
import navClip from "@/assets/images/common/nav-clip.svg?url";
import navGood from "@/assets/images/common/nav-good.svg?url";
import navTalk from "@/assets/images/common/nav-talk.svg?url";
import { watchEffect } from "vue";

watchEffect(() => {
  const raw = (localStorage.getItem("userType") || "").trim().toLowerCase();
  const role =
    raw === "seeker"
      ? "seeker"
      : ["employer", "business", "facility", "2", "事業者"].includes(raw)
        ? "employer"
        : "";
  document.body.classList.toggle("is-user", role === "seeker");
  document.body.classList.toggle("is-employer", role === "employer");
  document.body.classList.toggle("is-login", !!localStorage.getItem("userId"));
});

/* --- 認証状態（localStorage） --- */
const userType = ref(""); // ← 役割の表示制御は userType のみで判定
const userId = ref(0); // ← バッジ件数取得には引き続き使用（未ログイン時は 0）

const norm = (v) =>
  (v ?? "")
    .replace(/^['"]|['"]$/g, "")
    .trim()
    .toLowerCase();

function readUserId() {
  try {
    const cands = [
      localStorage.getItem("auth_user"),
      sessionStorage.getItem("auth_user"),
      localStorage.getItem("userId"),
      sessionStorage.getItem("userId"),
    ];
    for (const v of cands) {
      if (!v) continue;
      if (/^\s*\d+\s*$/.test(v)) return Number(v);
      try {
        const o = JSON.parse(v);
        const n = Number(o?.id ?? o?.userId ?? o?.user?.id);
        if (Number.isFinite(n) && n > 0) return n;
      } catch (err) {
        void err;
      }
    }
  } catch (err) {
    void err;
  }
  return 0;
}

function refreshAuth() {
  userType.value = norm(localStorage.getItem("userType"));
  userId.value = readUserId();
}

/* ✅ 役割の表示切替は userType だけで判定（userId の有無に依存しない） */
const isSeeker = computed(() => userType.value === "seeker");
const isEmployer = computed(() => userType.value === "employer");
const isAuthed = computed(() => isSeeker.value || isEmployer.value);

/* --- バッジ --- */
const badges = ref({ clips: 0, goods: 0, talks: 0, bizGoods: 0, bizTalks: 0 });
const API_BASE = import.meta.env?.VITE_API_BASE_URL || "/api";

function urlWithParams(path, params) {
  const u = new URL((API_BASE + path).replace(/([^:]\/)\/+/g, "$1"), window.location.origin);
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") u.searchParams.set(k, String(v));
  });
  return u.toString();
}
function pickListPayload(data) {
  const items = Array.isArray(data?.items)
    ? data.items
    : Array.isArray(data?.rows)
      ? data.rows
      : Array.isArray(data?.list)
        ? data.list
        : [];
  const total = Number(data?.total ?? data?.total_count ?? data?.count ?? 0) || 0;
  return { items, total };
}
async function safeGet(path, params) {
  try {
    const res = await fetch(urlWithParams(path, params), {
      credentials: "include",
      headers: { "x-user-id": String(userId.value || 0) }, // ★ 追加
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.log(e);
    return null;
  }
}

/* 求職者の件数（userId が無ければ 0 件で返すだけ） */
async function fetchSeekerBadges() {
  const uid = userId.value;
  if (!isSeeker.value || !uid) {
    badges.value = { ...badges.value, clips: 0, goods: 0, talks: 0 };
    return;
  }
  // ✅ 新しい軽量カウンタAPI（公開状態に依存しない）
  const counters = (await safeGet("/jobs/me/counters", { user_id: uid })) || {};
  const clips = Number(counters.clips || 0);
  const goods = Number(counters.goods || 0);

  // トーク未読
  let talks = 0;
  {
    const data = await safeGet("/talks/threads", {
      role: "seeker",
      userId: uid,
      perPage: 100,
      page: 1,
    });
    const { items } = pickListPayload(data || {});
    talks = items
      .map((r) => Number(r?.unread_count ?? r?.unreadCount ?? 0) || 0)
      .reduce((a, b) => a + b, 0);
  }

  badges.value = { ...badges.value, clips, goods, talks };
}

/* 事業者の件数（userId が無ければ 0 件で返すだけ） */
async function fetchEmployerBadges() {
  const eid = userId.value;
  if (!isEmployer.value || !eid) {
    badges.value = { ...badges.value, bizGoods: 0, bizTalks: 0 };
    return;
  }

  // 受信グッド件数（総数）
  let bizGoods = 0;
  {
    // ① 未読数をAPIで
    const unread = await safeGet("/jobs/goods/unread", { user_id: eid });
    if (unread && typeof unread.goods === "number") {
      bizGoods = unread.goods;
    } else {
      // ② 失敗時は総数にフォールバック（従来どおり）
      let data = await safeGet("/biz/goods", { user_id: eid, perPage: 1, page: 1 });
      if (!data) data = await safeGet("/employer/goods", { user_id: eid, perPage: 1, page: 1 });
      if (!data) data = await safeGet("/jobs/goods", { user_id: eid, perPage: 1, page: 1 });
      const { items, total } = pickListPayload(data || {});
      bizGoods = total || items.length || 0;
    }
  }

  // トーク未読
  let bizTalks = 0;
  {
    const data = await safeGet("/talks/threads", {
      role: "employer",
      userId: eid,
      perPage: 100,
      page: 1,
    });
    const { items } = pickListPayload(data || {});
    bizTalks = items
      .map((r) => Number(r?.unread_count ?? r?.unreadCount ?? 0) || 0)
      .reduce((a, b) => a + b, 0);
  }

  badges.value = { ...badges.value, bizGoods, bizTalks };
}

/* 現在のロールに応じて取得 */
async function fetchBadges() {
  if (isSeeker.value) await fetchSeekerBadges();
  else if (isEmployer.value) await fetchEmployerBadges();
  else badges.value = { clips: 0, goods: 0, talks: 0, bizGoods: 0, bizTalks: 0 };
}

/* 99+ 表示 */
function compact(n) {
  const v = Number(n) || 0;
  return v > 99 ? "99+" : String(v);
}

/* ポーリング＆イベント */
let timerId = 0;
function startPolling() {
  stopPolling();
  timerId = window.setInterval(fetchBadges, 5000);
}
function stopPolling() {
  if (timerId) {
    clearInterval(timerId);
    timerId = 0;
  }
}

let debounceId = 0;
function debounceFetch() {
  if (debounceId) cancelAnimationFrame(debounceId);
  debounceId = requestAnimationFrame(() => fetchBadges());
}

const onStorage = (e) => {
  const k = String(e && e.key);
  if (k === "userType" || k === "userId" || k === "auth_user") {
    refreshAuth();
    fetchBadges();
  }
  if (k === "badgePing") debounceFetch();
};
const onFocus = () => {
  refreshAuth();
  fetchBadges();
};
const onBadgePing = () => debounceFetch();

onMounted(() => {
  refreshAuth();
  fetchBadges();
  startPolling();
  window.addEventListener("storage", onStorage);
  window.addEventListener("focus", onFocus);
  window.addEventListener("badge:ping", onBadgePing);
});
onBeforeUnmount(() => {
  stopPolling();
  window.removeEventListener("storage", onStorage);
  window.removeEventListener("focus", onFocus);
  window.removeEventListener("badge:ping", onBadgePing);
});

watch([isSeeker, isEmployer], () => {
  fetchBadges();
});
</script>

<style scoped>
.foot-nav.user-content,
.foot-nav.employer-content,
.foot-nav.guest-content {
  display: block;
}

/* ✅ このコンポーネント内では常に表示。
   グローバルの .guest-content/.user-content/.employer-content の display:none を無効化 */
.foot-nav.guest-content,
.foot-nav.user-content,
.foot-nav.employer-content {
  display: block !important;
}

/* 念のため前面に（背景やギャラリーの上に出す） */
.foot-nav {
  z-index: 3000;
}

/* PCサイズのみ：バッジ(赤い丸)を少し下げる */
@media screen and (min-width: 1024px) {
  .foot-nav .has-badge {
    position: relative;
  }
  .foot-nav .has-badge .count {
    position: absolute;
    right: 8px;
    top: 14px !important; /* ← ここを 10〜18px で微調整してください */
    transform: none; /* 他のスタイルの影響を打ち消す */
  }
}
</style>
