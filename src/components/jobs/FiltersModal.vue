<!-- src/components/jobs/FiltersModal.vue -->
 <!-- 求人情報の絞り込み用のコンポーネント-->
 <template>
  <teleport to="body">
    <div
      v-if="open"
      class="modal-root"
      @keydown.esc.stop.prevent="close()"
    >
      <!-- backdrop -->
      <div class="modal-backdrop" @click="close()"></div>

      <!-- panel -->
      <div
        class="modal-panel"
        role="dialog"
        aria-modal="true"
        @click.stop
      >
        <header class="modal-header">
          <h2>求人を探す</h2>
          <button class="icon-btn" @click="close">✕</button>
        </header>

        <div class="modal-body">
          <!-- エリア（グループ→市町村） -->
          <section class="acc">
            <button class="acc-head" @click="toggle('area')">
              エリア
              <span class="chev">{{ openSec.area ? '－' : '＋' }}</span>
            </button>
            <div v-show="openSec.area" class="acc-body">
              <div
                v-for="g in sortedAreaGroups"
                :key="g.name"
                class="area-group"
              >
                <div class="area-row">
                  <label class="chk">
                    <input
                      type="checkbox"
                      :checked="isAreaAllChecked(g)"
                      @change="toggleAreaGroup($event, g)"
                    />
                    <span class="area-name">{{ g.name }}</span>
                  </label>
                </div>
                <div class="city-grid">
                  <label
                    v-for="c in g.cities"
                    :key="c"
                    class="chk"
                  >
                    <input
                      type="checkbox"
                      :value="c"
                      v-model="local.cities"
                    />
                    <span>{{ c }}</span>
                  </label>
                </div>
              </div>
            </div>
          </section>

          <!-- 募集職種 -->
          <section class="acc">
            <button class="acc-head" @click="toggle('pos')">
              募集職種
              <span class="chev">{{ openSec.pos ? '－' : '＋' }}</span>
            </button>
            <div v-show="openSec.pos" class="acc-body">
              <label
                v-for="p in jobPositions"
                :key="p.id"
                class="chk"
              >
                <input
                  type="checkbox"
                  :value="p.id"
                  v-model.number="local.job_position_ids"
                />
                <span>{{ p.name }}</span>
              </label>
            </div>
          </section>

          <section class="acc">
            <button class="acc-head" @click="toggle('emp')">
              勤務形態
              <span class="chev">{{ openSec.emp ? '－' : '＋' }}</span>
            </button>
            <div v-show="openSec.emp" class="acc-body">
              <label
                v-for="e in employmentTypes"
                :key="e.id"
                class="chk"
              >
                <input
                  type="checkbox"
                  :value="e.id"
                  v-model.number="local.employment_type_ids"
                />
                <span>{{ e.name }}</span>
              </label>
            </div>
          </section>

          <section class="acc">
            <button class="acc-head" @click="toggle('svc')">
              施設形態
              <span class="chev">{{ openSec.svc ? '－' : '＋' }}</span>
            </button>
            <div v-show="openSec.svc" class="acc-body">
              <label
                v-for="s in serviceTypes"
                :key="s.id"
                class="chk"
              >
                <input
                  type="checkbox"
                  :value="s.id"
                  v-model.number="local.service_type_ids"
                />
                <span>{{ s.name }}</span>
              </label>
            </div>
          </section>

          <section class="acc">
            <button class="acc-head" @click="toggle('merit')">
              メリット
              <span class="chev">{{ openSec.merit ? '－' : '＋' }}</span>
            </button>
            <div v-show="openSec.merit" class="acc-body">
              <label
                v-for="m in merits"
                :key="m.id"
                class="chk"
              >
                <input
                  type="checkbox"
                  :value="m.id"
                  v-model.number="local.merit_ids"
                />
                <span>{{ m.name }}</span>
              </label>
            </div>
          </section>

          <section class="acc">
            <button class="acc-head" @click="toggle('salary')">
              給与（下限）
              <span class="chev">{{ openSec.salary ? '－' : '＋' }}</span>
            </button>
            <div v-show="openSec.salary" class="acc-body">
              <div class="radio-row">
                <label class="radio">
                  <input type="radio" value="monthly"  v-model="local.salary_type" />
                  月給
                </label>
                <label class="radio">
                  <input type="radio" value="hourly"   v-model="local.salary_type" />
                  時給
                </label>
              </div>
              <input
                type="text"
                inputmode="numeric"
                placeholder="例）200000"
                v-model="local.salary_min"
                class="input"
              />
              <span class="note">※この金額以上の募集</span>
            </div>
          </section>
        </div>

        <!-- 選択中チップ -->
        <div class="chips">
          <template v-for="c in local.cities" :key="'city-'+c">
            <button class="chip" @click="removeCity(c)">× {{ c }}</button>
          </template>

          <template v-for="id in local.job_position_ids" :key="'pos-'+id">
            <button class="chip" @click="removeFrom('job_position_ids', id)">× {{ labelById(jobPositions, id) }}</button>
          </template>

          <template v-for="id in local.employment_type_ids" :key="'emp-'+id">
            <button class="chip" @click="removeFrom('employment_type_ids', id)">× {{ labelById(employmentTypes, id) }}</button>
          </template>

          <template v-for="id in local.service_type_ids" :key="'svc-'+id">
            <button class="chip" @click="removeFrom('service_type_ids', id)">× {{ labelById(serviceTypes, id) }}</button>
          </template>

          <template v-for="id in local.merit_ids" :key="'merit-'+id">
            <button class="chip" @click="removeFrom('merit_ids', id)">× {{ labelById(merits, id) }}</button>
          </template>

          <button v-if="local.salary_min" class="chip" @click="local.salary_min=''">× 給与下限: {{ local.salary_min }}</button>
        </div>

        <footer class="modal-footer">
          <button class="btn" @click="clearAll">条件をクリア</button>
          <button class="btn primary" @click="apply">この条件で検索</button>
        </footer>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { reactive, watch, computed } from 'vue'

// 希望の表示順（エリア）
const AREA_ORDER = ['県北','県中','県南','会津','南会津','相双','いわき']

const props = defineProps({
  open: { type: Boolean, default: false },
  value: {
    type: Object,
    default: () => ({
      cities: [],
      job_position_ids: [],
      employment_type_ids: [],
      service_type_ids: [],
      merit_ids: [],
      salary_min: '',
      salary_type: '' // '', 'monthly', 'hourly'
    })
  },
  jobPositions: { type: Array, default: () => [] },
  employmentTypes: { type: Array, default: () => [] },
  serviceTypes: { type: Array, default: () => [] },
  merits: { type: Array, default: () => [] },
  /** [{ name: '県北', cities: ['福島市','二本松市',...]}] */
  areaGroups: { type: Array, default: () => [] }
})

// ▼ 修正：エリアだけ並び替え。cities は API（= DB sort_order）の順をそのまま使用
const sortedAreaGroups = computed(() => {
  const order = AREA_ORDER.map(n => n.trim())
  const idx = (name) => {
    const i = order.indexOf(String(name || '').trim())
    return i === -1 ? 999 : i // 未指定エリアは末尾
  }

  // props.areaGroups をコピーしてエリアだけソート
  return [...(props.areaGroups || [])].sort(
    (a, b) => idx(a?.name) - idx(b?.name)
  )
})

const emit = defineEmits(['update:open','apply'])

/* 内部状態（双方向） */
const local = reactive({
  cities: [],
  job_position_ids: [],
  employment_type_ids: [],
  service_type_ids: [],
  merit_ids: [],
  salary_min: '',
  salary_type: ''
})

/* 初期化＆親からの変更を反映 */
watch(() => props.open, (v) => {
  if (v) Object.assign(local, clonePayload(props.value))
}, { immediate: true })
watch(() => props.value, (v) => {
  if (props.open) Object.assign(local, clonePayload(v))
})

const openSec = reactive({ area:true, pos:false, emp:false, svc:false, merit:false, salary:false })

function toggle(key){ openSec[key] = !openSec[key] }
function close(){ emit('update:open', false) }
function apply(){
  emit('apply', clonePayload(local))
  emit('update:open', false)
}
function clearAll(){
  Object.assign(local, clonePayload({}))
}
function clonePayload(src){
  const s = src || {}
  return {
    cities: [...(s.cities || [])],
    job_position_ids: [...(s.job_position_ids || [])],
    employment_type_ids: [...(s.employment_type_ids || [])],
    service_type_ids: [...(s.service_type_ids || [])],
    merit_ids: [...(s.merit_ids || [])],
    salary_min: s.salary_min ? String(s.salary_min).replace(/[^\d]/g,'') : '',
    salary_type: (s.salary_type || '').toString().toLowerCase() // '', 'monthly', 'hourly'
  }
}

function labelById(list, id){
  return list.find(v => Number(v.id) === Number(id))?.name || String(id)
}

/* エリアの一括 ON/OFF */
function isAreaAllChecked(group){
  const set = new Set(local.cities)
  return group.cities.every(c => set.has(c))
}
function toggleAreaGroup(ev, group){
  const checked = ev.target.checked
  if (checked){
    const add = group.cities.filter(c => !local.cities.includes(c))
    local.cities.push(...add)
  }else{
    const s = new Set(group.cities)
    Object.assign(local, { ...local, cities: local.cities.filter(c => !s.has(c)) })
  }
}
function removeCity(c){
  const i = local.cities.indexOf(c)
  if (i >= 0) local.cities.splice(i, 1)
}
function removeFrom(key, id){
  const i = local[key].indexOf(id)
  if (i >= 0) local[key].splice(i, 1)
}
</script>

<style scoped>
/* レイヤー */
.modal-root{
  position: fixed;
  inset: 0;
  z-index: 9999;          /* 十分に前面へ */
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-backdrop{
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,.45);
}
.modal-panel{
  position: relative;
  width: min(860px, 96vw);
  max-height: 92vh;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0,0,0,.25);
  overflow: auto;
  padding: 16px 16px 12px;
}

/* header / footer */
.modal-header{
  display:flex; align-items:center; justify-content:space-between;
  border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 12px;
}
.modal-footer{
  display:flex; gap:10px; justify-content:flex-end;
  border-top: 1px solid #eee; padding-top: 10px; margin-top: 14px;
}

.icon-btn{ background:#f3f4f6; border:1px solid #e5e7eb; border-radius:8px; padding:.4em .7em; }
.btn{ background:#eef2f7; border:1px solid #cfd7e4; border-radius:10px; padding:.6em 1.1em; }
.btn.primary{ background:#ff6f3d; border-color:#ff6f3d; color:#fff; }

/* アコーディオン */
.acc{ border-top:1px solid #eee; }
.acc:first-child{ border-top:0; }
.acc-head{
  width:100%; text-align:left; background:#fff; border:0; padding:12px 6px; font-weight:600;
  display:flex; justify-content:space-between; align-items:center;
}
.acc-body{ padding:6px 6px 14px; }

/* エリア */
.area-group{ padding:8px 0; }
.area-row{ margin-bottom:6px; }
.area-name{ font-weight:700; margin-left:4px; }
.city-grid{
  display:grid; grid-template-columns: repeat(auto-fill, minmax(120px,1fr));
  gap:8px 14px; padding-left:8px;
}

/* 共通 */
.chk{ display:inline-flex; gap:6px; align-items:center; margin:4px 10px 4px 0; }
.input{
  width: 220px; padding:.6em .7em; border:1px solid #d0d7e2; border-radius:8px;
}
.note{ margin-left:10px; color:#666; font-size:.9em; }

/* chips */
.chips{ display:flex; flex-wrap:wrap; gap:8px; margin:10px 0 4px; }
.chip{ background:#f1f5f9; border:1px solid #e2e8f0; border-radius:999px; padding:.25em .6em; }

.sep{ height:12px; }
.radio-row{ display:flex; gap:16px; margin-top:8px; flex-wrap:wrap; }
.radio{ display:inline-flex; align-items:center; gap:6px; }
</style>
