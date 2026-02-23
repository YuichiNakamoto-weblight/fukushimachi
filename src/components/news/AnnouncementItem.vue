<!-- src/components/news/AnnouncementItem.vue -->
<!-- お知らせ一覧ページのコンポーネント -->
<template>
  <RouterLink v-if="to" class="ann-item" :to="to" @click="onClick">
    <div class="ann-item__row">
      <!-- 左：カテゴリ（色付き） -->
      <span class="ann-badge" :class="badgeClass">
        {{ categories }}
      </span>

      <!-- 右：日付 + タイトル -->
      <div class="ann-item__main">
        <div class="ann-item__meta">
          <time class="ann-item__date">{{ fmtDate(date) }}</time>

          <span v-if="categories.trim() === '求人情報' && facilityName" class="ann-item__facility">
            {{ facilityName }}
          </span>
        </div>

        <h3 class="ann-item__title">{{ title }}</h3>
      </div>
    </div>
  </RouterLink>

  <!-- 万一 to が無いケース用 -->
  <div v-else class="ann-item">
    <div class="ann-item__row">
      <span class="ann-badge" :class="badgeClass">{{ categories }}</span>
      <div class="ann-item__main">
        <time class="ann-item__date">{{ fmtDate(date) }}</time>
        <span v-if="categories.trim() === '求人情報' && facilityName" class="ann-item__facility">
          {{ facilityName }}
        </span>
        <h3 class="ann-item__title">{{ title }}</h3>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  title: { type: String, default: "" },
  date: { type: String, default: "" },
  categories: { type: String, default: "" }, // ← "求人情報" / "特集" / "施設から" / "事務局から" など
  facilityName: { type: String, default: "" }, // ★追加
  to: { type: [Object, String], default: null },
});

// ★未ログイン判定は token 推奨（userId残骸で誤判定しない）
const isAuthed = computed(() => !!localStorage.getItem("userId"));

const isJob = computed(() => (props.categories || "").trim() === "求人情報");

// RouterLinkクリックを横取り
function onClick(e) {
  if (!isJob.value) return;
  if (isAuthed.value) return;

  e.preventDefault();

  // 元の遷移先（求人詳細）へ戻せるように
  const redirect = props.to ? router.resolve(props.to).fullPath : "/jobs";

  router.push({ name: "RegisterChoice", query: { redirect } });
}

const badgeClass = computed(() => {
  const c = (props.categories || "").trim();

  if (c === "求人情報") return "is-jobs";
  if (c === "特集") return "is-event";
  if (c === "施設から") return "is-facility";
  if (c === "事務局から") return "is-office";
  return "is-default";
});

function fmtDate(v) {
  // 文字列が ISO/DB形式でもなるべく見やすく
  const t = Date.parse(v || "");
  if (!t) return v || "";
  const d = new Date(t);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}
</script>

<style scoped>
/* 1行カード */
.ann-item {
  display: block;
  text-decoration: none;
  color: inherit;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 12px 12px;
  transition:
    transform 0.08s ease,
    box-shadow 0.08s ease;
}
.ann-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
}

/* 左：カテゴリ、右：本文 */
.ann-item__row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

/* カテゴリバッジ（左上強調） */
.ann-badge {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 800;
  font-size: 12px;
  line-height: 1;
  border: 1px solid transparent;
  white-space: nowrap;
  margin-top: 2px; /* “上部左側”感を少し強める */
}

/* 右側（日付＋タイトル） */
.ann-item__main {
  min-width: 0;
  flex: 1;
}
.ann-item__date {
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: #6b7280;
  margin-bottom: 4px;
}
.ann-item__title {
  margin: 0;
  font-size: 15px;
  font-weight: 800;
  color: #111827;
  line-height: 1.35;
  word-break: break-word;
}

/* 色分け（お好みで調整OK） */
.ann-badge.is-jobs {
  background: #e8f0ff;
  /* color: #1d4ed8; */
  color: #0082bd;
  border-color: #c7d6ff;
}
.ann-badge.is-event {
  /* background: #f3e8ff; */
  background: #ffff00;
  /* color: #6d28d9; */
  color: #71710a;
  border-color: #e9d5ff;
}
.ann-badge.is-facility {
  background: #e7f8ef;
  color: #15803d;
  border-color: #bbf7d0;
}
.ann-badge.is-office {
  background: #fff2e6;
  color: #c2410c;
  border-color: #fed7aa;
}
.ann-badge.is-default {
  background: #f3f4f6;
  color: #374151;
  border-color: #e5e7eb;
}

/* スマホ：詰まりすぎ防止 */
@media (max-width: 480px) {
  .ann-item {
    padding: 10px;
  }
  .ann-item__title {
    font-size: 14px;
  }
  .ann-badge {
    padding: 6px 8px;
  }
}

.ann-item__meta {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 4px;
  min-width: 0;
}

.ann-item__date {
  display: inline-block; /* ★ block から変更 */
  margin-bottom: 0; /* ★ meta側で制御 */
}

.ann-item__facility {
  font-size: 12px;
  font-weight: 800;
  /* color: #064eea; */
  color: #0082bd;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}
</style>
