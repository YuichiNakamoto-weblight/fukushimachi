<!-- src/components/jobs/JobCard.vue -->
<!-- 求人情報一覧用コンポーネント -->
<template>
  <div class="inner">
    <div class="job-list-items">
      <article
        class="job-list-item"
        @click="openDetail"
        @keydown.enter.prevent="openDetail"
        @keydown.space.prevent="openDetail"
        tabindex="0"
        role="button"
        aria-label="求人詳細を開く"
      >
        <div class="job-card__badges">
          <span v-if="item.is_new" class="job-list-item__label item__job-label--new">NEW</span>
          <slot name="extra-badges" />
        </div>

        <!-- クリップ・グッド・トーク ※事業者は非表示 -->
        <footer v-if="!isEmployer" class="job-card__footer">
          <div class="status__items">
            <div class="status__clip">
              <button
                class="js-modal-trigger"
                :class="{ active: localClipped }"
                aria-label="クリップ"
                @click.stop.prevent="onToggleClip"
                @keydown.enter.stop.prevent="onToggleClip"
                @keydown.space.stop.prevent="onToggleClip"
              >
                <img src="/src/assets/images/common/ico-clip.svg" alt="" />
              </button>
            </div>
            <div class="status__good">
              <button
                class="js-modal-trigger"
                :class="{ active: localGooded }"
                aria-label="グッド"
                @click.stop.prevent="onToggleGood"
                @keydown.enter.stop.prevent="onToggleGood"
                @keydown.space.stop.prevent="onToggleGood"
              >
                <img src="/src/assets/images/common/ico-good.svg" alt="" />
              </button>
            </div>
            <div class="status__talk">
              <button
                class="js-modal-trigger"
                aria-label="トーク"
                @click.stop.prevent="onOpenTalk"
                @keydown.enter.stop.prevent="onOpenTalk"
                @keydown.space.stop.prevent="onOpenTalk"
              >
                <img src="/src/assets/images/common/ico-talk.svg" alt="" />
              </button>
            </div>
          </div>
        </footer>

        <!-- 閲覧数 -->
        <!-- <div class="job-list-item__data">
          <div>
            <span class="job-list-item__data--begins">募集開始：{{ formatDate(item.published_date) }}</span>
            <span class="job-list-item__data--view">
              <span class="ico">
                <img src="/src/assets/images/jobs/ico-view.svg">
              </span>
              {{ item.view_count == null ? 0 : item.view_count }}
            </span>
          </div>
        </div> -->

        <!-- タイトル -->
        <!-- <div class="job-list-item__title">{{ item.title }}</div> -->

        <!-- ヘッダー（募集職種 + タイトル + 募集開始/閲覧数） -->
        <div class="job-list-item__header">
          <!-- 左側：募集職種タグ + タイトル -->
          <div class="job-list-item__header-main">
            <!-- 募集職種タグ -->
            <div
              class="job-list-item__jobtag"
              v-if="item.job_positions && item.job_positions.length"
            >
              <ul>
                <li v-for="(p, i) in item.job_positions" :key="i">
                  {{ p }}
                </li>
              </ul>
            </div>

            <!-- タイトル -->
            <div class="job-list-item__title">
              {{ item.title }}
            </div>
          </div>

          <!-- 右側：募集開始日 & 閲覧数 -->
          <div class="job-list-item__data">
            <span class="job-list-item__data--begins">
              募集開始：{{ formatDate(item.published_date) }}
            </span>
            <span class="job-list-item__data--view">
              <span class="ico">
                <img src="/src/assets/images/jobs/ico-view.svg" />
              </span>
              {{ item.view_count == null ? 0 : item.view_count }}
            </span>
          </div>
        </div>
        <!-- メリット -->
        <div class="job-list-item__merit">
          <ul>
            <li v-for="(m, i) in item.merits || []" :key="i">{{ m }}</li>
          </ul>
        </div>

        <!-- メイン -->
        <!-- メイン -->
        <div class="job-list-item__summary flex">
          <div class="job-list-item__tmb">
            <!-- 画像が1枚以上ある場合のみ v-for で描画 -->
            <template v-if="hasImages">
              <img
                v-for="(src, i) in thumbList"
                :key="i"
                :src="src"
                alt=""
                decoding="async"
                loading="lazy"
                @error="onImgError"
              />
            </template>
            <!-- 画像が無い場合は何も描画しない（空の枠だけ） -->
          </div>

          <div class="job-list-item__txtwrap">
            <div class="job-list-item__companyname">{{ item.business_name }}</div>
            <div class="job-list-item__facilityname">{{ item.facility_name }}</div>
            <div class="job-list-item__jobtype">
              <ul>
                <li>
                  <span class="job-list-item__jobtype--full">{{ item.employment_type_name }}</span>
                </li>
              </ul>
            </div>

            <!-- 住所 -->
            <div class="job-list-item__note">
              <div class="job-list-item__location">
                <span class="ico">
                  <img src="/src/assets/images/jobs/ico-location.svg" alt="エリア" />
                </span>
                {{ item.city }}
              </div>

              <!-- 給与 -->
              <div class="job-list-item__salary">
                <span class="ico">
                  <img src="/src/assets/images/jobs/ico-fee.svg" alt="給与" />
                </span>
                {{ salaryDisplay }}
              </div>
            </div>
          </div>

          <div class="job-list-item__licence">
            <span v-if="certImgSrc">
              <img :src="certImgSrc" alt="認証" />
            </span>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";

/* ===== 認証マーク画像の解決 ===== */
const CERT_IMAGE_MAP = (() => {
  const mods = import.meta.glob("/src/assets/images/common/*", {
    eager: true,
    import: "default",
  });
  const map = {};
  for (const [p, url] of Object.entries(mods)) {
    const fname = p.split("/").pop().toLowerCase();
    map[fname] = url;
  }
  console.log("map:", map);
  return map;
})();

const router = useRouter();

const props = defineProps({
  item: { type: Object, required: true },
  imageBase: { type: String, default: "" },
});
const emit = defineEmits(["toggle-clip", "toggle-good", "open-talk", "require-auth"]);

/* ===== ユーザー認証判定（JSON 文字列/数値どちらでもOK） ===== */
function readUserId() {
  try {
    const raw = localStorage.getItem("userId") || "";
    if (!raw) return 0;
    if (raw.trim().startsWith("{")) {
      const o = JSON.parse(raw);
      return Number(o?.id ?? o?.userId ?? o?.user?.id ?? 0) || 0;
    }
    return Number(raw) || 0;
  } catch {
    return 0;
  }
}
const authedRef = ref(readUserId() > 0);
const isAuthed = computed(() => authedRef.value);

const userTypeRef = ref((localStorage.getItem("userType") || "").toLowerCase());
const isEmployer = computed(() =>
  ["employer", "business", "facility", "2", "事業者"].includes(userTypeRef.value),
);

const onStorage = (e) => {
  if (e.key === "userType") userTypeRef.value = (e.newValue || "").toLowerCase();
  if (e.key === "userId") authedRef.value = readUserId() > 0;
};
onMounted(() => window.addEventListener("storage", onStorage));
onBeforeUnmount(() => window.removeEventListener("storage", onStorage));

/* ===== いいね/クリップ ローカル状態 ===== */
const localClipped = ref(!!props.item?.clipped);
const localGooded = ref(!!props.item?.gooded);
watch(
  () => props.item.clipped,
  (v) => {
    localClipped.value = !!v;
  },
);
watch(
  () => props.item.gooded,
  (v) => {
    localGooded.value = !!v;
  },
);

/* ===== ハンドラ（親へ通知、即時 UI 反映） ===== */
function onToggleClip() {
  if (!isAuthed.value) {
    emit("require-auth");
    return;
  }
  const next = !localClipped.value;
  let usedCb = false;
  emit("toggle-clip", props.item, (v) => {
    usedCb = true;
    localClipped.value = typeof v === "boolean" ? v : next;
  });
  if (!usedCb) localClipped.value = next;
}
function onToggleGood() {
  if (!isAuthed.value) {
    emit("require-auth");
    return;
  }
  const next = !localGooded.value;
  let usedCb = false;
  emit("toggle-good", props.item, (v) => {
    usedCb = true;
    localGooded.value = typeof v === "boolean" ? v : next;
  });
  if (!usedCb) localGooded.value = next;
}
function onOpenTalk() {
  if (!isAuthed.value) {
    emit("require-auth");
    return;
  }
  emit("open-talk", props.item);
}

/* ===== 詳細へ遷移 ===== */
function openDetail() {
  const id = props.item?.id;
  if (!id) return;
  if (!isAuthed.value) {
    // 親に「続行用コールバック」を渡す
    emit("require-auth", {
      jobId: id,
      continue: () => router.push({ name: "JobDetail", params: { id } }),
    });
    return;
  }
  router.push({ name: "JobDetail", params: { id } });
}

/* ===== 表示ユーティリティ ===== */
const formatDate = (v) => {
  if (!v) return "";
  const d = new Date(v);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" });
};
const formatMoney = (v) =>
  v == null || v === "" || Number.isNaN(Number(v)) ? "-" : Number(v).toLocaleString("ja-JP");
const salaryLabel = (type, min, max) => {
  const prefix = type === "hourly" ? "時給 " : type === "monthly" ? "月給 " : "";
  const minStr = formatMoney(min);
  const hasMax = max != null && max !== "" && !Number.isNaN(Number(max));
  return `${prefix}${minStr}${hasMax ? `〜${formatMoney(max)}` : ""}`;
};
const salaryText = computed(() =>
  salaryLabel(
    props.item?.base_salary_type,
    props.item?.base_salary_min,
    props.item?.base_salary_max,
  ),
);

const strip = (s = "") => String(s).replace(/^\/+|\/+$/g, "");

/* ===== 画像URLの土台（オリジン） ===== */
const origin = computed(() => {
  const b = String(props.imageBase || "").replace(/\/+$/, "");
  if (b) return b.replace(/\/uploads(?:\/images)?$/i, "");
  return typeof window !== "undefined" ? window.location.origin : "";
});

/* no-image フォールバック（/app 配下でも壊れないよう BASE_URL考慮） */
const fallback = `${import.meta.env.BASE_URL}stock-images/no-image.png`;

/* 保存先は /uploads/images/jobs を正とする */
const IMAGE_BASE = computed(() => `${origin.value}/uploads/images/jobs`);

/** 任意の入力を最終的に /uploads/images/jobs/:id/:file へ正規化して返す */
const imageUrl = (p) => {
  // ★ここを変更：画像パスが無いときは空文字を返す
  if (!p) return "";
  const raw = String(p).trim();
  if (/^(https?:|data:|blob:)/i.test(raw)) return raw;

  const s = raw.startsWith("/") ? raw : `/${raw}`;
  if (/^\/uploads\/images\/jobs\//i.test(s)) return `${origin.value}${s}`;
  if (/^\/upload\/jobs\//i.test(s))
    return `${origin.value}${s.replace(/^\/upload\/jobs\//i, "/uploads/images/jobs/")}`;
  if (/^\/uploads\/jobs\//i.test(s))
    return `${origin.value}${s.replace(/^\/uploads\/jobs\//i, "/uploads/images/jobs/")}`;

  let rel = strip(raw);
  rel = rel
    .replace(/^uploads\/(?:images\/)?jobs\/+/i, "")
    .replace(/^images\/+/i, "")
    .replace(/^jobs\/+/i, "");

  const m = rel.match(/^(\d{1,10})\/(.+)$/);
  if (m) return `${IMAGE_BASE.value}/${m[1]}/${m[2]}`;

  const id = props.item?.id;
  if (id) return `${IMAGE_BASE.value}/${id}/${rel}`;

  // ★ここも変更：おかしなパスは fallback ではなく「無効」とみなす
  return "";
};

/* ★ image_1〜image_4 を配列化して表示用URLに正規化 */
const thumbList = computed(() => {
  const paths = [
    props.item?.image_1,
    props.item?.image_2,
    props.item?.image_3,
    props.item?.image_4,
  ].filter(Boolean); // null / '' を除外

  // 画像パスが1つも無い場合は空配列
  if (!paths.length) return [];

  // imageUrl が '' を返すものは除外
  const urls = paths.map(imageUrl).filter(Boolean);
  return urls;
});

const hasImages = computed(() => (thumbList.value?.length || 0) > 0);

/* 認証マーク画像の実 URL 解決 */
const certImgSrc = computed(() => {
  const fname = String(props.item?.certification_image || "").trim();
  if (!fname) return "";
  const key = fname.split("/").pop().toLowerCase();
  return CERT_IMAGE_MAP[key] || "";
});

/* 画像ロード失敗時フォールバック */
function onImgError(e) {
  const t = e?.target;
  if (!t) return;

  // 既に no-image を表示しているなら何もしない（点滅防止）
  if ((t.getAttribute("src") || "").includes("stock-images/no-image.png")) {
    t.onerror = null;
    return;
  }

  if (t.dataset.didFallback === "1") {
    t.onerror = null;
    t.src = fallback;
    return;
  }
  t.dataset.didFallback = "1";
  const src = t.getAttribute("src") || "";
  if (/\/uploads\/jobs\//i.test(src)) {
    t.src = src.replace(/\/uploads\/jobs\//i, "/uploads/images/jobs/");
    return;
  }
  t.src = fallback;
}

onMounted(() => {
  console.log("[cert] DB =", props.item?.certification_image);
  console.log("[cert] keys =", Object.keys(CERT_IMAGE_MAP));
});

const salaryDisplay = computed(() => {
  const type = props.item?.base_salary_type;
  const prefix = type === "hourly" ? "時給 " : type === "monthly" ? "月給 " : "";

  // 最大があるなら「〜」もそれっぽく伏せる
  const max = props.item?.base_salary_max;
  const hasMax = max != null && max !== "" && !Number.isNaN(Number(max));

  if (!isAuthed.value) {
    return `${prefix}＊＊＊＊＊${hasMax ? "〜＊＊＊＊＊" : ""}円`;
  }

  // ログイン済みは通常表示
  return `${salaryText.value}円`;
});
</script>

<style scoped>
.job-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  padding: 12px;
  margin: 16px 0;
}
.job-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.job-card__meta {
  font-size: 12px;
  color: #666;
  display: flex;
  gap: 12px;
}
.badge {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
}
.badge-new {
  background: #ff3655;
  color: #fff;
}
.job-card__body {
  display: flex;
  gap: 12px;
}
.job-card__thumb {
  width: 128px;
  height: 96px;
  object-fit: cover;
  border-radius: 8px;
  flex: 0 0 auto;
}
.job-card__title {
  font-size: 18px;
  margin: 0 0 6px 0;
}
.job-card__merits {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 6px 0 8px 0;
  padding: 0;
  list-style: none;
}
.pill {
  background: #eee;
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 12px;
}
.job-card__org {
  display: flex;
  gap: 8px;
  align-items: center;
}
.cert {
  background: #cfeedd;
  color: #187a4a;
  padding: 0 6px;
  border-radius: 6px;
  font-size: 12px;
}
.job-card__info {
  display: flex;
  gap: 12px;
  color: #444;
  margin-top: 6px;
  font-size: 14px;
}
.job-card__footer {
  display: flex;
  gap: 12px;
  margin-top: 10px;
}
.icon-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.4rem 0.7rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: #fff;
  color: #374151;
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    border-color 0.15s ease;
}
.icon-btn.active {
  background: #e53935;
  border-color: #e53935;
  color: #fff;
}
.cert {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #cfeedd;
  color: #187a4a;
  padding: 0 6px;
  border-radius: 6px;
  font-size: 12px;
}
.cert-img {
  height: 16px;
  width: auto;
  display: block;
}

@media (max-width: 640px) {
  .job-card__body {
    flex-direction: column;
  }
  .job-card__thumb {
    width: 100%;
    height: 160px;
  }
}

.clip-remove .js-modal-trigger {
  background: var(--color-p);
  font-size: var(--font-size-sm);
  padding: var(--padding-xs) var(--padding-md);
  color: #fff;
  text-align: center;
  display: inline-block;
  border-radius: 99px;
  cursor: pointer;
}
.status__items .js-modal-trigger.active {
  background: #ff7f50;
  border-color: #ff7f50;
  color: #fff;
  text-align: center;
  display: inline-block;
  border-radius: 99px;
  cursor: pointer;
}
.status__items .js-modal-trigger.active img {
  filter: invert(1) brightness(110%); /* アイコンを白く */
}
.action-item.is-active .icon img,

/* ベース：非アクティブ時はそのまま表示 */
.status__items .js-modal-trigger img {
  filter: none;
}

/* アクティブ時は白化（黒系SVG想定） */
.status__items .js-modal-trigger.active img {
  filter: brightness(0) invert(1);
}
/* ===== 親: 相対配置にして子の absolute の基準にする ===== */
.job-admin .job-list-item {
  position: relative; /* ←コレが肝 */
  padding-top: 28px; /* 上に固定したメタぶんの逃がし */
}

/* ===== メタ行（募集開始・閲覧数）を右上に固定 ===== */
.job-admin .job-list-item__data {
  position: absolute; /* 右上に“浮かせる” */
  top: 10px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: var(--font-size-xs);
  margin: 0; /* 以前の margin-bottom を無効化 */
}

/* タイトルが右上メタの下に潜り込まないよう右余白を確保 */
.job-admin .job-list-item__title {
  padding-right: 160px; /* メタの横幅ぶん（目安）。必要に応じて調整 */
  line-height: 1.25;
}

/* ===== スマホは重なりを避けて通常フローに戻す（崩れ防止） ===== */
@media (max-width: 640px) {
  .job-admin .job-list-item {
    padding-top: 0;
  }
  .job-admin .job-list-item__data {
    position: static; /* 通常フローへ戻す */
    margin-bottom: 6px;
  }
  .job-admin .job-list-item__title {
    padding-right: 0;
  }
}

/* 認証マークの位置微調整（上へ & 左へ） */
.job-list-item__licence {
  align-self: flex-start; /* 行頭寄せで少し上側に */
}

.job-list-item__licence img {
  position: relative;
  top: -13px; /* 上へ（-で上）  値はお好みで調整 */
  left: -25px; /* 左へ（-で左） 値はお好みで調整 */
  height: 80px; /* 既に拡大している場合はそのまま/調整可 */
  width: auto;
  display: block;
}

/* サムネイル枠のサイズを固定 */
.job-list-item__tmb {
  width: 180px;
  height: 130px;
  flex: 0 0 auto;
  overflow: hidden;
  border-radius: 8px;
}

/* 画像を枠いっぱいに表示し、縦長・横長をトリミングして揃える */
.job-list-item__tmb img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* これで縦長画像も枠に合わせて中央トリミング */
  display: block;
}

@media (max-width: 640px) {
  .job-list-item__summary {
    align-items: flex-start; /* お好みですが、縦位置を揃えたいときに */
  }

  .job-list-item__tmb {
    width: 100px; /* ←「少し小さく」するサイズ（お好みで調整） */
    height: 80px; /* だいたい 4:3 くらいにしています */
  }
}

/* === 求人カード ヘッダー部（募集職種 + タイトル + 募集開始/閲覧数） === */
.job-list-item__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 6px;
}

.job-list-item__header-main {
  min-width: 0; /* タイトルが折り返せるように */
}

/* 募集職種タグ */
.job-list-item__jobtag {
  padding-top: 4px;
}

.job-list-item__jobtag ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.job-list-item__jobtag li {
  display: inline-block;
  margin: 0 0 4px 3px;
  padding: 5px 9px;
  border-radius: 4px;
  line-height: 1em;
  font-weight: 500;
  font-size: var(--font-size-xs);
  background: #fe8365;
  color: #fff;
}

/* タイトルは少し上との余白だけ調整（必要なら） */
.job-list-item__title {
  margin-top: 2px;
}

/* 募集開始 & 閲覧数を右寄せ */
.job-list-item__data {
  font-size: var(--font-size-xs);
  text-align: right;
  white-space: nowrap;
}

.job-list-item__data--view .ico {
  margin-right: 2px;
}

/* スマホ時のレイアウト（縦積みした方が良ければ） */
@media (max-width: 640px) {
  .job-list-item__header {
    /* 順番を逆転させて「募集開始/ビュー数 → 募集職種 → タイトル」にする */
    flex-direction: column-reverse;
    align-items: stretch; /* 子要素を横幅いっぱいに */
    gap: 4px;
  }

  .job-list-item__data {
    width: 100%; /* 親の横幅いっぱいを使う */
    text-align: right; /* テキストを右寄せ */
  }
}
</style>
