<!-- src/views/jobs/jobRegisterForm.vue -->
<!-- 求人情報の登録 -->
<template>
  <body class="job-admin is-employer is-login">
    <div class="wrap">
      <AppHeader />
      <HamburgerMenu />
      <FooterNav />
      <main>
        <section class="l-sec mypage-detail white-bg">
          <div class="page-title maru">求人情報の登録</div>

          <div class="form-wrap">
            <div class="inner">
              <!-- ========== 編集ステップ ========== -->
              <form v-if="!confirming" @submit.prevent="startConfirm">
                <div class="sec-title">施設情報</div>
                <p style="margin-bottom: 1em">
                  <span class="opendata">公開</span>は登録していないユーザーにも公開されます。
                </p>

                <div class="form-items">
                  <!-- 施設情報 -->
                  <div class="form-item opendata-wrap">
                    <label
                      >施設名（全角） <span class="req">※必須</span
                      ><span class="opendata">公開</span></label
                    >
                    <input
                      id="job-name-input"
                      type="text"
                      v-model="form.job_name"
                      placeholder="ふくしまちケアセンター こおりやま"
                    />
                    <p v-if="reqErrors.job_name" class="error-inline">必須です</p>
                  </div>
                  <div class="form-item opendata-wrap">
                    <label
                      >施設名カナ（全角） <span class="req">※必須</span
                      ><span class="opendata">公開</span></label
                    >
                    <!-- <input type="text" v-model="form.job_kana" placeholder="フクシマチケアセンター コオリヤマ" /> -->
                    <input
                      id="job-kana-input"
                      type="text"
                      v-model="form.job_kana"
                      placeholder="フクシマチケアセンター コオリヤマ"
                    />
                    <p v-if="kanaErrors.job_kana" class="error-inline">
                      カタカナで入力してください
                    </p>
                    <p v-if="reqErrors.job_kana" class="error-inline">必須です</p>
                  </div>
                  <div class="form-item">
                    <label
                      >都道府県 <span class="req"></span><span class="opendata">公開</span></label
                    >
                    <!-- <select id="pref-select" v-model="form.job_pref"> -->
                    <select
                      id="pref-select"
                      v-model="form.job_pref"
                      :disabled="true"
                      aria-readonly="true"
                    >
                      <option value="">選択してください</option>
                      <option v-for="pref in prefectures" :key="pref.id" :value="pref.name">
                        {{ pref.name }}
                      </option>
                    </select>
                    <p v-if="reqErrors.job_pref" class="error-inline">必須です</p>
                  </div>
                  <div class="form-item opendata-wrap">
                    <label
                      >市町村 <span class="req">※必須</span
                      ><span class="opendata">公開</span></label
                    >

                    <select id="job-city-select" v-model.number="form.work_location_id" required>
                      <option :value="null">選択してください</option>
                      <option v-for="c in workLocationList" :key="c.id" :value="c.id">
                        {{ c.name }}
                      </option>
                    </select>

                    <p v-if="reqErrors.work_location_id" class="error-inline">必須です</p>
                  </div>
                  <div class="form-item">
                    <label>住所（全角）</label>
                    <input type="text" v-model="form.job_address1" placeholder="" />
                  </div>
                  <div class="form-item">
                    <label>建物（全角）</label>
                    <input type="text" v-model="form.job_address2" placeholder="〇〇ビル" />
                  </div>
                  <div class="form-item w50">
                    <label>郵便番号（半角数字）<span>※ハイフンは含めない</span></label>
                    <input type="text" v-model="form.job_zipcode" placeholder="9608670" />
                  </div>
                  <div class="form-item">
                    <label>電話番号（半角数字）<span>※ハイフンは含めない</span></label>
                    <input type="text" v-model="form.job_tel" placeholder="0249000000" />
                  </div>

                  <!-- 採用担当者情報 -->
                  <div class="sec-title">採用担当者情報</div>
                  <div class="form-item">
                    <label>姓（全角）</label>
                    <input type="text" v-model="form.job_last_name" />
                  </div>
                  <div class="form-item">
                    <label>名（全角）</label>
                    <input type="text" v-model="form.job_first_name" />
                  </div>
                  <div class="form-item">
                    <label>姓カナ（全角）</label>
                    <!-- <input type="text" v-model="form.job_last_kana" /> -->
                    <input id="job-last-kana-input" type="text" v-model="form.job_last_kana" />
                    <p v-if="kanaErrors.job_last_kana" class="error-inline">
                      カタカナで入力してください
                    </p>
                  </div>
                  <div class="form-item">
                    <label>名カナ（全角）</label>
                    <!-- <input type="text" v-model="form.job_first_kana" /> -->
                    <input id="job-first-kana-input" type="text" v-model="form.job_first_kana" />
                    <p v-if="kanaErrors.job_first_kana" class="error-inline">
                      カタカナで入力してください
                    </p>
                  </div>
                  <div class="form-item">
                    <label>メールアドレス <span class="req">※必須</span></label>
                    <input type="email" v-model="form.job_email" required />
                  </div>
                  <div class="form-item">
                    <label>電話番号（半角数字）<span>※ハイフンは含めない</span></label>
                    <input type="text" v-model="form.job_contact_tel" />
                  </div>

                  <!-- 応募要項 -->
                  <div class="sec-title">応募要項</div>
                  <div class="form-item">
                    <label
                      >掲載タイトル（全角／30文字以内）<span class="req">※必須</span
                      ><span class="opendata">公開</span></label
                    >
                    <!-- <textarea v-model="form.job_title" maxlength="50" rows="3"></textarea> -->
                    <textarea
                      id="job-title-input"
                      v-model="form.job_title"
                      maxlength="50"
                      rows="3"
                    ></textarea>
                    <p v-if="reqErrors.job_title" class="error-inline">必須です</p>
                  </div>

                  <!-- 施設形態 / 募集職種 / 学歴 -->
                  <div class="form-item">
                    <label>施設形態 <span class="req">※必須</span></label>
                    <!-- <select v-model="form.facility_type_id"> -->
                    <select id="facility-type-select" v-model="form.facility_type_id">
                      <option value="">選択してください</option>
                      <option v-for="t in serviceTypes" :key="t.id" :value="t.id">
                        {{ t.name }}
                      </option>
                    </select>
                    <p v-if="reqErrors.facility_type_id" class="error-inline">必須です</p>
                    <!-- ★ “その他=99” のときだけ表示 -->
                    <div
                      v-if="isOtherServiceTypeSelected"
                      class="other-input"
                      style="margin-top: 10px"
                    >
                      <label>その他（自由記入）<span style="color: #d00">※必須</span></label>
                      <input
                        id="service-type-other-input"
                        type="text"
                        v-model.trim="form.service_type_other_text"
                        maxlength="100"
                        placeholder="例：地域包括支援センター など"
                        class="input"
                        style="
                          width: 100%;
                          padding: 0.7em;
                          border: 1px solid #ccc;
                          border-radius: 4px;
                        "
                      />
                      <p
                        v-if="showServiceTypeOtherError"
                        class="error-message"
                        style="color: #d92d20; margin-top: 6px"
                      >
                        「その他」を選択した場合は内容を入力してください。
                      </p>
                    </div>
                  </div>
                  <div class="form-item">
                    <label>募集職種 <span class="req">※必須</span></label>
                    <!-- <select v-model="form.job_category_id"> -->
                    <select id="job-category-select" v-model="form.job_category_id">
                      <option value="">選択してください</option>
                      <option v-for="c in jobCategories" :key="c.id" :value="c.id">
                        {{ c.name }}
                      </option>
                    </select>
                    <p v-if="reqErrors.job_category_id" class="error-inline">必須です</p>
                    <!-- ★ “その他=99” のときだけ表示 -->
                    <div
                      v-if="isOtherJobPositionSelected"
                      class="other-input"
                      style="margin-top: 10px"
                    >
                      <label>その他（自由記入）<span style="color: #d00">※必須</span></label>
                      <input
                        id="job-position-other-input"
                        type="text"
                        v-model.trim="form.job_position_other_text"
                        maxlength="100"
                        placeholder="例：生活相談員（非常勤） など"
                        class="input"
                        style="
                          width: 100%;
                          padding: 0.7em;
                          border: 1px solid #ccc;
                          border-radius: 4px;
                        "
                      />
                      <p
                        v-if="showJobPositionOtherError"
                        class="error-message"
                        style="color: #d92d20; margin-top: 6px"
                      >
                        「その他」を選択した場合は内容を入力してください。
                      </p>
                    </div>
                  </div>
                  <div class="form-item">
                    <label>学歴</label>
                    <select v-model="form.education_id">
                      <option value="">選択してください</option>
                      <option v-for="e in educations" :key="e.id" :value="e.id">
                        {{ e.name }}
                      </option>
                    </select>
                  </div>

                  <!-- 給与 -->
                  <div class="sec-title">給与について（半角数字記号）</div>
                  <div class="form-item">
                    <label>基本給<span class="opendata">公開</span></label>
                    <div class="radio-items">
                      <label class="radio-item">
                        <input
                          type="radio"
                          name="base_salary_type"
                          value="hourly"
                          v-model="form.base_salary_type"
                        />
                        時給
                      </label>
                      <label class="radio-item">
                        <input
                          type="radio"
                          name="base_salary_type"
                          value="monthly"
                          v-model="form.base_salary_type"
                        />
                        月給
                      </label>
                    </div>
                  </div>
                  <div class="form-item">
                    <div class="flex" style="gap: 12px; align-items: center">
                      <!-- <input type="text" inputmode="numeric" placeholder="例）160,000" v-model="form.base_salary_min" style="max-width:220px;" /> -->
                      <input
                        type="text"
                        inputmode="numeric"
                        placeholder="例）160000 ※カンマ不要"
                        v-model="form.base_salary_min"
                        @input="onNumInput('base_salary_min', $event)"
                        style="max-width: 220px"
                      />
                      <span>円～</span>
                      <!-- <input type="text" inputmode="numeric" placeholder="例）250,000" v-model="form.base_salary_max" style="max-width:220px;" /> -->
                      <input
                        type="text"
                        inputmode="numeric"
                        placeholder="例）250000 ※カンマ不要"
                        v-model="form.base_salary_max"
                        @input="onNumInput('base_salary_max', $event)"
                        style="max-width: 220px"
                      />
                      <span>円</span>
                    </div>
                  </div>
                  <div class="form-item">
                    <label>処遇改善手当</label>
                    <div class="flex" style="gap: 12px; align-items: center">
                      <!-- <input type="text" inputmode="numeric" placeholder="10,000" v-model="form.treatment_allowance" style="max-width:220px;" /> -->
                      <input
                        type="text"
                        inputmode="numeric"
                        placeholder="10000 ※カンマ不要"
                        v-model="form.treatment_allowance"
                        @input="onNumInput('treatment_allowance', $event)"
                        style="max-width: 220px"
                      />
                      <span>円</span>
                    </div>
                  </div>
                  <div class="form-item">
                    <label>昇給</label>
                    <div class="radio-items">
                      <label class="radio-item">
                        <input
                          type="radio"
                          name="raise_available"
                          value="yes"
                          v-model="form.raise_available"
                        />
                        あり
                      </label>
                      <label class="radio-item">
                        <input
                          type="radio"
                          name="raise_available"
                          value="no"
                          v-model="form.raise_available"
                        />
                        なし
                      </label>
                    </div>
                  </div>
                  <div class="form-item">
                    <label>賞与</label>
                    <div class="radio-items">
                      <label class="radio-item">
                        <input
                          type="radio"
                          name="bonus_available"
                          value="yes"
                          v-model="form.bonus_available"
                        />
                        あり
                      </label>
                      <label class="radio-item">
                        <input
                          type="radio"
                          name="bonus_available"
                          value="no"
                          v-model="form.bonus_available"
                        />
                        なし
                      </label>
                    </div>
                  </div>

                  <!-- 休日 / 保険 / 募集人数 / シフト / 勤務形態 / メリット -->
                  <div class="form-item">
                    <label>休日</label>
                    <div class="checkbox-items">
                      <label class="checkbox" v-for="h in holidays" :key="'holiday-' + h.id">
                        <input
                          type="checkbox"
                          class="input-checkbox"
                          name="holiday_ids[]"
                          :value="h.id"
                          v-model="form.job_holidays"
                        />
                        <span class="checkbox-label">{{ h.name }}</span>
                      </label>
                    </div>

                    <!-- ★ 追加：その他=99 を選んだときだけ自由記入 -->
                    <div v-if="isOtherHolidaySelected" class="other-input" style="margin-top: 10px">
                      <label>その他（自由記入）<span style="color: #d00">※必須</span></label>
                      <input
                        id="holiday-other-input"
                        type="text"
                        v-model.trim="form.holiday_other_text"
                        maxlength="100"
                        placeholder="例：シフト制（週2日休み） など"
                        class="input"
                        style="
                          width: 100%;
                          padding: 0.7em;
                          border: 1px solid #ccc;
                          border-radius: 4px;
                        "
                      />
                      <p
                        v-if="showHolidayOtherError"
                        class="error-message"
                        style="color: #d92d20; margin-top: 6px"
                      >
                        「その他」を選択した場合は内容を入力してください。
                      </p>
                    </div>
                  </div>

                  <div class="form-item">
                    <label>保険加入（複数可）</label>
                    <div class="checkbox-items">
                      <label class="checkbox" v-for="w in insurances" :key="'ins-' + w.id">
                        <input
                          type="checkbox"
                          class="input-checkbox"
                          name="welfare_option_ids[]"
                          :value="w.id"
                          v-model="form.job_insurance"
                        />
                        <span class="checkbox-label">{{ w.name }}</span>
                      </label>
                    </div>
                  </div>

                  <div class="form-item">
                    <label>募集人数</label>
                    <div class="flex" style="gap: 12px; align-items: center">
                      <input
                        type="text"
                        inputmode="numeric"
                        placeholder="5"
                        v-model="form.openings"
                        style="max-width: 120px"
                      />
                      <span>人</span>
                    </div>
                  </div>

                  <div class="form-item">
                    <label>シフト<span class="req">※必須</span></label>
                    <!-- <select v-model="form.shift_id"> -->
                    <select id="shift-select" v-model="form.shift_id">
                      <option value="">選択してください</option>
                      <option v-for="s in shifts" :key="s.id" :value="s.id">{{ s.name }}</option>
                    </select>
                    <p v-if="reqErrors.shift_id" class="error-inline">必須です</p>
                  </div>

                  <div class="form-item">
                    <label
                      >勤務形態<span class="req">※必須</span
                      ><span class="opendata">公開</span></label
                    >
                    <!-- <select v-model="form.employment_type_id"> -->
                    <select id="employment-type-select" v-model="form.employment_type_id">
                      <option value="">選択してください</option>
                      <option v-for="e in employmentTypes" :key="e.id" :value="e.id">
                        {{ e.name }}
                      </option>
                    </select>
                    <p v-if="reqErrors.employment_type_id" class="error-inline">必須です</p>
                  </div>

                  <!-- メリット -->
                  <div class="form-item">
                    <label>メリット（複数可）<span class="opendata">公開</span></label>
                    <div class="checkbox-items">
                      <label class="checkbox" v-for="m in merits" :key="'merit-' + m.id">
                        <input
                          type="checkbox"
                          class="input-checkbox"
                          name="merit_ids[]"
                          :value="m.id"
                          v-model="form.job_merit"
                        />
                        <span class="checkbox-label">{{ m.name }}</span>
                      </label>
                    </div>

                    <!-- ★ 追加：その他=99 選択時のみ自由記入 -->
                    <div v-if="isOtherMeritSelected" class="other-input" style="margin-top: 10px">
                      <label>その他（自由記入）<span style="color: #d00">※必須</span></label>
                      <input
                        id="merit-other-input"
                        type="text"
                        v-model.trim="form.merit_other_text"
                        maxlength="100"
                        placeholder="例：資格取得支援 など"
                        class="input"
                        style="
                          width: 100%;
                          padding: 0.7em;
                          border: 1px solid #ccc;
                          border-radius: 4px;
                        "
                      />
                      <p
                        v-if="showMeritOtherError"
                        class="error-message"
                        style="color: #d92d20; margin-top: 6px"
                      >
                        「その他」を選択した場合は内容を入力してください。
                      </p>
                    </div>
                  </div>

                  <!-- PR 情報 -->
                  <div class="form-item">
                    <label>PR 情報（全角／500文字以内）</label>
                    <textarea
                      v-model="form.pr_info"
                      maxlength="500"
                      rows="6"
                      placeholder="施設の特色・働きやすさ・教育体制 などを自由にご記入ください。"
                    ></textarea>
                  </div>

                  <!-- 掲載画像 -->
                  <div class="sec-title">掲載画像について<span class="opendata">公開</span></div>
                  <p class="text-note">
                    写真は施設の外観・内観・働く様子など、最大4点まで掲載できます。推奨：横1200px×縦800px以上（横長）／JPG・PNG（5MBまで）
                  </p>

                  <!-- アップロード枠 -->
                  <div
                    class="form-item"
                    @dragover.prevent
                    @drop.prevent="onDrop"
                    style="
                      border: 2px dashed #ddd;
                      border-radius: 8px;
                      padding: 28px;
                      text-align: center;
                    "
                  >
                    <div style="font-size: 40px; line-height: 1">☁️⬆️</div>
                    <div>画像をドラッグ&ドロップ<br />または</div>
                    <div style="margin-top: 10px">
                      <label class="btn btn-primary maru" style="cursor: pointer">
                        ファイルを選択
                        <input
                          ref="fileInput"
                          type="file"
                          accept="image/png,image/jpeg"
                          multiple
                          @change="onChooseFiles"
                          style="display: none"
                          :disabled="slotsLeft === 0"
                        />
                      </label>
                    </div>
                    <div style="margin-top: 8px; color: #777">
                      JPG / PNG（5MBまで）・最大 {{ MAX_IMAGES }} 枚（あと {{ slotsLeft }} 枚）
                    </div>
                  </div>

                  <!-- プレビュー -->
                  <div v-if="uploadPreviews.length" class="form-item">
                    <div class="label">
                      選択中の画像（{{ uploadPreviews.length }} / {{ MAX_IMAGES }}）
                    </div>
                    <div
                      style="
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
                        gap: 12px;
                      "
                    >
                      <div
                        v-for="(src, i) in uploadPreviews"
                        :key="'up-' + i"
                        style="position: relative"
                      >
                        <img
                          :src="src"
                          style="width: 100%; height: 100px; object-fit: cover; border-radius: 8px"
                        />
                        <button
                          type="button"
                          class="btn"
                          @click="removeUpload(i)"
                          style="position: absolute; top: 6px; right: 6px"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- 既存（サンプル）画像：常時表示 -->
                  <div class="form-item">
                    <div class="label">画像がない方へ</div>
                    <p class="text-note">
                      以下の画像からご利用できます。（アップロードと合わせて最大
                      {{ MAX_IMAGES }} 枚）
                    </p>
                    <div
                      style="
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                        gap: 16px;
                      "
                    >
                      <label
                        v-for="s in stockImages"
                        :key="s.id"
                        style="display: block; text-align: center"
                      >
                        <img
                          :src="s.url"
                          style="
                            width: 100%;
                            height: 110px;
                            object-fit: cover;
                            border-radius: 8px;
                            border: 1px solid #eee;
                          "
                        />
                        <div style="margin-top: 6px">
                          <input
                            type="checkbox"
                            :value="s.id"
                            v-model="selectedStock"
                            :disabled="isStockDisabled(s.id)"
                          />
                        </div>
                      </label>
                    </div>
                  </div>

                  <!-- ボタン -->
                  <div class="form-btn-item">
                    <button type="submit" class="btn btn-primary maru">登録情報を確認する</button>
                  </div>

                  <!-- 下書き保存（確認をスキップして即保存） -->
                  <div class="form-btn-item">
                    <button
                      type="button"
                      class="btn btn-primary maru btn--full"
                      :disabled="saving || draftBlocked"
                      @click="saveDraftQuick"
                      :title="draftBlocked ? draftBlockedReason : ''"
                    >
                      {{ saving ? "保存中…" : "下書き保存する" }}
                    </button>

                    <!-- 追加：ブロック理由を常時見せる -->
                    <p v-if="draftBlocked" class="hint-error">
                      下書きを保存できません：{{ draftBlockedReason }}
                      <button type="button" class="as-link" @click="focusFirstDraftLack()">
                        該当箇所へ移動
                      </button>
                    </p>
                  </div>
                </div>
              </form>

              <!-- ===== 確認ステップ ===== -->
              <section v-if="confirming" class="l-sec mypage-detail">
                <div class="page-title maru">登録内容をご確認ください。</div>

                <div class="form-wrap">
                  <div class="inner">
                    <p>
                      以下の内容で登録します。問題がなければ「登録する」ボタンを押してください。
                    </p>

                    <div class="conf-items">
                      <!-- 施設情報 -->
                      <div class="conf-item">
                        <div class="employer_name">
                          <span class="label-name">施設名</span>
                          <span class="conf-result">{{
                            workLocationName || confirm.job_city || "-"
                          }}</span>
                        </div>
                      </div>
                      <div class="conf-item">
                        <div class="employer_kana">
                          <span class="label-name">施設名カナ</span>
                          <span class="conf-result">{{ confirm.job_kana || "-" }}</span>
                        </div>
                      </div>
                      <div class="conf-item">
                        <div class="employer_zipcode">
                          <span class="label-name">郵便番号</span>
                          <span class="conf-result">{{ confirm.job_zipcode || "-" }}</span>
                        </div>
                      </div>
                      <div class="conf-item">
                        <div class="employer_pref">
                          <span class="label-name">都道府県</span>
                          <span class="conf-result">{{ confirm.job_pref || "-" }}</span>
                        </div>
                      </div>
                      <div class="conf-item">
                        <div class="employer_city">
                          <span class="label-name">市町村</span>
                          <span class="conf-result">{{ confirm.job_city || "-" }}</span>
                        </div>
                      </div>
                      <div class="conf-item">
                        <div class="employer_address1">
                          <span class="label-name">住所</span>
                          <span class="conf-result">{{ confirm.job_address1 || "-" }}</span>
                        </div>
                      </div>
                      <div class="conf-item">
                        <div class="employer_address2">
                          <span class="label-name">建物</span>
                          <span class="conf-result">{{ confirm.job_address2 || "-" }}</span>
                        </div>
                      </div>
                      <div class="conf-item">
                        <div class="employer_tel">
                          <span class="label-name">電話番号</span>
                          <span class="conf-result">{{ confirm.job_tel || "-" }}</span>
                        </div>
                      </div>

                      <!-- 採用担当者情報 -->
                      <div class="form-items-subtitle txt-center">採用担当者情報</div>
                      <div class="conf-items">
                        <div class="conf-item flex">
                          <div class="employer_last_name">
                            <span class="label-name">姓</span>
                            <span class="conf-result">{{ confirm.job_last_name || "-" }}</span>
                          </div>
                          <div class="employer_first_name">
                            <span class="label-name">名</span>
                            <span class="conf-result">{{ confirm.job_first_name || "-" }}</span>
                          </div>
                        </div>
                        <div class="conf-item flex">
                          <div class="employer_last_kana">
                            <span class="label-name">姓カナ</span>
                            <span class="conf-result">{{ confirm.job_last_kana || "-" }}</span>
                          </div>
                          <div class="employer_first_kana">
                            <span class="label-name">名カナ</span>
                            <span class="conf-result">{{ confirm.job_first_kana || "-" }}</span>
                          </div>
                        </div>
                        <div class="conf-item">
                          <div class="employer_email">
                            <span class="label-name">担当者メールアドレス</span>
                            <span class="conf-result">{{ confirm.job_email || "-" }}</span>
                          </div>
                        </div>
                        <div class="conf-item">
                          <div class="employer_contact_tel">
                            <span class="label-name">担当者電話番号</span>
                            <span class="conf-result">{{ confirm.job_contact_tel || "-" }}</span>
                          </div>
                        </div>
                      </div>

                      <!-- 応募要項 -->
                      <div class="form-items-subtitle txt-center">応募要項</div>
                      <div class="conf-item">
                        <div class="employer_title">
                          <span class="label-name">掲載タイトル</span>
                          <span class="conf-result">{{ confirm.job_title || "-" }}</span>
                        </div>
                      </div>
                      <div class="conf-item">
                        <div class="employer_service_type">
                          <span class="label-name">施設形態</span>
                          <span class="conf-result">{{ serviceTypeName || "-" }}</span>
                        </div>
                      </div>
                      <div class="conf-item">
                        <div class="employer_job_position">
                          <span class="label-name">募集職種</span>
                          <span class="conf-result">{{ jobCategoryName || "-" }}</span>
                        </div>
                      </div>
                      <div class="conf-item">
                        <div class="employer_education">
                          <span class="label-name">学歴</span>
                          <span class="conf-result">{{ educationName || "-" }}</span>
                        </div>
                      </div>
                      <div class="conf-item">
                        <div class="employer_base_salary">
                          <span class="label-name">基本給</span>
                          <span class="conf-result">
                            {{ confirm.base_salary_type === "monthly" ? "月給" : "時給" }}
                            {{ yen(confirm.base_salary_min) }} ～ {{ yen(confirm.base_salary_max) }}
                          </span>
                        </div>
                      </div>
                      <div class="conf-item">
                        <div class="employer_treatment_allowance">
                          <span class="label-name">処遇改善手当</span>
                          <span class="conf-result">{{ yen(confirm.treatment_allowance) }}</span>
                        </div>
                      </div>
                      <div class="conf-item">
                        <div class="employer_raise">
                          <span class="label-name">昇給</span>
                          <span class="conf-result">{{
                            confirm.raise_available === "yes" ? "あり" : "なし"
                          }}</span>
                        </div>
                      </div>
                      <div class="conf-item">
                        <div class="employer_bonus">
                          <span class="label-name">賞与</span>
                          <span class="conf-result">{{
                            confirm.bonus_available === "yes" ? "あり" : "なし"
                          }}</span>
                        </div>
                      </div>
                      <div class="conf-item">
                        <div class="employer_holidays">
                          <span class="label-name">休日</span>
                          <span class="conf-result">
                            <template v-if="selectedHolidayLabels.length === 0">-</template>
                            <template v-else>
                              <span v-for="(name, i) in selectedHolidayLabels" :key="'h' + i">
                                {{ name }}<br v-if="i < selectedHolidayLabels.length - 1" />
                              </span>
                            </template>
                          </span>
                        </div>
                      </div>
                      <div class="conf-item">
                        <div class="employer_insurances">
                          <span class="label-name">保険加入（複数可）</span>
                          <span class="conf-result">
                            <template v-if="selectedInsuranceLabels.length === 0">-</template>
                            <template v-else>
                              <span v-for="(name, i) in selectedInsuranceLabels" :key="'w' + i">
                                {{ name }}<br v-if="i < selectedInsuranceLabels.length - 1" />
                              </span>
                            </template>
                          </span>
                        </div>
                      </div>
                      <div class="conf-item">
                        <div class="employer_openings">
                          <span class="label-name">募集人数</span>
                          <span class="conf-result">
                            {{ (confirm.openings ?? "") === "" ? "-" : confirm.openings + "人" }}
                          </span>
                        </div>
                      </div>
                      <div class="conf-item">
                        <div class="employer_shift">
                          <span class="label-name">シフト</span>
                          <span class="conf-result">{{ shiftName || "-" }}</span>
                        </div>
                      </div>
                      <div class="conf-item">
                        <div class="employer_employment_type">
                          <span class="label-name">勤務形態</span>
                          <span class="conf-result">{{ employmentTypeName || "-" }}</span>
                        </div>
                      </div>
                      <div class="conf-item">
                        <div class="employer_merits">
                          <span class="label-name">メリット（複数可）</span>
                          <span class="conf-result">
                            <template v-if="selectedMeritLabels.length === 0">-</template>
                            <template v-else>
                              <span v-for="(name, i) in selectedMeritLabels" :key="'m' + i">
                                {{ name }}<br v-if="i < selectedMeritLabels.length - 1" />
                              </span>
                            </template>
                          </span>
                        </div>
                      </div>
                      <div class="conf-item">
                        <div class="employer_pr">
                          <span class="label-name">PR 情報</span>
                          <span class="conf-result whitespace-pre-wrap">{{
                            confirm.pr_info || "-"
                          }}</span>
                        </div>
                      </div>
                      <div class="conf-item">
                        <div class="employer_images">
                          <span class="label-name">掲載画像</span>
                          <span class="conf-result">
                            <template v-if="confirmImagesDetailed.length === 0">-</template>
                            <template v-else>
                              <ul id="fileList" class="uploader__filelist" aria-live="polite">
                                <li v-for="img in confirmImagesDetailed" :key="img.key">
                                  <img class="thumb" :src="img.src" alt="" />
                                  <span class="name">{{ img.name }}</span>
                                  <span class="meta" v-if="img.sizeText"> {{ img.sizeText }}</span>
                                </li>
                              </ul>
                            </template>
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- ボタン -->
                    <div class="back-btn-items">
                      <div class="form-btn-items-lead">この内容で登録しますか？</div>
                      <div class="form-btn-item">
                        <button
                          type="submit"
                          class="btn btn-primary maru"
                          :disabled="saving"
                          @click="saveAndFinish"
                        >
                          {{ saving ? "保存中…" : "登録する" }}
                        </button>
                      </div>

                      <div class="form-btn-item">
                        <button
                          type="button"
                          class="btn btn-primary maru"
                          :disabled="saving"
                          @click="saveDraftFromConfirm"
                        >
                          {{ saving ? "保存中…" : "下書き保存する" }}
                        </button>
                      </div>

                      <div class="form-btn-item">
                        <button type="submit" class="btn btn-back" @click="confirming = false">
                          修正する
                        </button>
                      </div>
                    </div>

                    <p v-if="message" :class="ok ? 'msg-success' : 'msg-error'">{{ message }}</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>
      </main>
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
import { ref, onMounted, computed, watch, nextTick } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

import AppHeader from "@/components/layout/AppHeader.vue";
import AppFooter from "@/components/layout/AppFooter.vue";
import HamburgerMenu from "@/components/layout/HamburgerMenu.vue";
import FooterNav from "@/components/layout/FooterNav.vue";
import PcModel from "@/components/layout/PcModel.vue";

const router = useRouter();

const FUKUSHIMA_PREF_NAME = "福島県";

const workLocationList = ref([]);

// 事業者プロフィール保持用
const myBusiness = ref(null); // { id, business_name, certification_id, ... } が入る想定

// 編集/確認の切替と、確認用データ
const confirming = ref(false);
const confirm = ref({}); // buildConfirmPayload() の結果を入れる
const message = ref("");
const ok = ref(false);
const saving = ref(false);

// 名前解決のユーティリティ（確認表示用）
const nameById = (list, id) => list.find((v) => Number(v.id) === Number(id))?.name || "";
// const serviceTypeName   = computed(() => nameById(serviceTypes.value, form.value.facility_type_id))
// const jobCategoryName   = computed(() => nameById(jobCategories.value, form.value.job_category_id))
const serviceTypeName = computed(() => {
  const id = Number(form.value.facility_type_id);
  const base = nameById(serviceTypes.value, id);
  return id === 99 && form.value.service_type_other_text?.trim()
    ? `${base}：${form.value.service_type_other_text.trim()}`
    : base;
});

const jobCategoryName = computed(() => {
  const id = Number(form.value.job_category_id);
  const base = nameById(jobCategories.value, id);
  return id === 99 && form.value.job_position_other_text?.trim()
    ? `${base}：${form.value.job_position_other_text.trim()}`
    : base;
});
const educationName = computed(() => nameById(educations.value, form.value.education_id));
const shiftName = computed(() => nameById(shifts.value, form.value.shift_id));
const employmentTypeName = computed(() =>
  nameById(employmentTypes.value, form.value.employment_type_id),
);

// サンプル画像
import sample1 from "@/assets/sampleimage01.jpg";
import sample2 from "@/assets/sampleimage02.jpg";
import sample3 from "@/assets/sampleimage03.jpg";
import sample4 from "@/assets/sampleimage04.jpg";

// const API = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api' });
// API.interceptors.request.use((config) => {
//   const t = localStorage.getItem('token')
//   if (t) config.headers.Authorization = `Bearer ${t}`
//   return config
// });
const API = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api" });
API.interceptors.request.use((config) => {
  const t = localStorage.getItem("token");

  // masters への GET は認証ヘッダを付けない（不要なら）
  const url = typeof config.url === "string" ? config.url : "";
  const isMastersGet =
    url.startsWith("/masters") && (config.method || "get").toLowerCase() === "get";

  if (!isMastersGet) {
    // "null" や "undefined" の文字列、空、JWT っぽくない値は弾く
    const looksJwt = t && t !== "null" && t !== "undefined" && t.includes(".");
    if (looksJwt) {
      config.headers.Authorization = `Bearer ${t}`;
    } else {
      delete config.headers.Authorization;
    }
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

console.debug("[jobRegisterForm API_BASE]", import.meta.env.VITE_API_BASE_URL ?? "/api");

// const router = useRouter()

const form = ref({
  user_id: null,
  facility_id: null, // ★ 追加：事業者ID（business_profiles.id）
  job_name: "",
  job_kana: "",
  job_pref: "",
  job_city: "",
  job_address1: "",
  job_address2: "",
  job_zipcode: "",
  job_tel: "",
  job_last_name: "",
  job_first_name: "",
  job_last_kana: "",
  job_first_kana: "",
  job_email: "",
  job_contact_tel: "",
  job_title: "",
  // ★ 追加（IDで保持）
  facility_type_id: "",
  job_category_id: "",
  education_id: "",
  work_location_id: null, // ★追加（市町村ID）

  // ★ 給与
  base_salary_type: "hourly", // 'hourly' | 'monthly'
  base_salary_min: "", // 文字列で入力 → 送信前に数値化/カンマ除去
  base_salary_max: "",
  treatment_allowance: "",
  raise_available: "yes", // 'yes' | 'no'
  bonus_available: "yes", // 'yes' | 'no'
  openings: "", // 募集人数（文字入力→送信前に数値化）
  shift_id: "", // shifts.id
  employment_type_id: "", // employment_types.id
  /** ← チェックボックスの v-model（ID配列） */
  job_holidays: [], // holidays の id[]
  holiday_other_text: "",
  // ★ 追加
  service_type_other_text: "",
  job_position_other_text: "",
  job_insurance: [], // insurances の id[]
  job_merit: [], // merits の id[]
  merit_other_text: "", // ★ 追加：メリットの「その他」自由記入
  pr_info: "", // PR 情報（最大500文字）
});

const prefectures = ref([]);
const merits = ref([]);
const holidays = ref([]);
const insurances = ref([]);
const serviceTypes = ref([]); // 施設形態
const jobCategories = ref([]); // 募集職種
const educations = ref([]); // 学歴
const shifts = ref([]);
const employmentTypes = ref([]);

const MAX_IMAGES = 4;
const fileInput = ref(null);
const uploadFiles = ref([]); // File[]
const uploadPreviews = ref([]); // objectURL[]
// const stockImages = ref([])        // [{ filename, url }]
// const selectedStock = ref([])      // string[]
const stockImages = ref([
  { id: "sampleimage01.jpg", url: sample1 },
  { id: "sampleimage02.jpg", url: sample2 },
  { id: "sampleimage03.jpg", url: sample3 },
  { id: "sampleimage04.jpg", url: sample4 },
]);
const selectedStock = ref([]);
// const stockLoading = ref(false)

/** ユーティリティ：ID配列を number[] に正規化 */
const toIds = (arr) =>
  Array.isArray(arr) ? arr.map((x) => Number(x)).filter((n) => Number.isFinite(n)) : [];

/** 選択ラベル（確認画面でそのまま表示できます） */
const selectedMeritLabels = computed(() =>
  merits.value
    .filter((m) => form.value.job_merit.includes(m.id))
    .map((m) => {
      if (m.id === 99 && form.value.merit_other_text?.trim()) {
        return `${m.name}：${form.value.merit_other_text.trim()}`;
      }
      return m.name;
    }),
);

const selectedHolidayLabels = computed(() =>
  holidays.value
    .filter((h) => form.value.job_holidays.includes(h.id))
    .map((h) => {
      if (h.id === 99 && form.value.holiday_other_text?.trim()) {
        return `${h.name}：${form.value.holiday_other_text.trim()}`;
      }
      return h.name;
    }),
);

const selectedInsuranceLabels = computed(() =>
  insurances.value.filter((w) => form.value.job_insurance.includes(w.id)).map((w) => w.name),
);

onMounted(async () => {
  // 事業者プロフィールを取得（ログインユーザー）
  if (form.value.user_id) {
    try {
      const { data } = await API.get(`/business/profile/${form.value.user_id}`);
      myBusiness.value = data?.profile || null;
      if (myBusiness.value?.id) {
        // フォームに facility_id をセット（重要）
        form.value.facility_id = myBusiness.value.id;
        // 施設スナップショット未入力なら、プロフィール値で初期化（任意）
        form.value.job_name ||= myBusiness.value.business_name || "";
        form.value.job_kana ||= myBusiness.value.business_kana || "";
        form.value.job_pref ||=
          myBusiness.value.prefectures || myBusiness.value.prefecture_id || "";
        form.value.job_city ||= myBusiness.value.city || "";
        form.value.job_address1 ||= myBusiness.value.address_line1 || "";
        form.value.job_address2 ||= myBusiness.value.address_line2 || "";
        form.value.job_zipcode ||= myBusiness.value.postcode || "";
        form.value.job_tel ||= myBusiness.value.phone || "";
      }
    } catch (e) {
      console.debug("[jobRegister] business profile not found for user", form.value.user_id, e);
    }
  }
  let uid = null;
  try {
    const raw = localStorage.getItem("userId");
    if (raw != null) {
      const n = Number(raw);
      uid = Number.isFinite(n) ? n : (JSON.parse(raw)?.id ?? null);
    }
  } catch (e) {
    uid = null;
    if (import.meta?.env?.DEV) console.debug("[jobRegister] userId parse failed:", e);
  }
  form.value.user_id = uid;

  const [p, m, h, i, st, jc, ed, sh, et, wl] = await Promise.allSettled([
    API.get("/masters/prefectures"),
    API.get("/masters/merits"),
    API.get("/masters/holidays"),
    API.get("/masters/welfare-options"),
    API.get("/masters/service-types"),
    API.get("/masters/job-positions"),
    API.get("/masters/education-levels"),
    API.get("/masters/shifts"),
    API.get("/masters/employment-types"),
    API.get("/masters/work-locations"),
    API.get("/masters/work-locations"), // ★追加
  ]);

  const pick = (r) => (r.status === "fulfilled" ? (r.value?.data?.items ?? []) : []);

  prefectures.value = pick(p);
  merits.value = pick(m);
  holidays.value = pick(h);
  insurances.value = pick(i);
  serviceTypes.value = pick(st);
  jobCategories.value = pick(jc);
  educations.value = pick(ed);
  shifts.value = pick(sh);
  employmentTypes.value = pick(et);
  workLocationList.value = pick(wl);

  // 都道府県「福島県」に固定
  form.value.job_pref = FUKUSHIMA_PREF_NAME;
});

// 「その他」を選んだかどうかの判定
const isOtherHolidaySelected = computed(() => form.value.job_holidays.includes(99));
const isOtherServiceTypeSelected = computed(() => Number(form.value.facility_type_id) === 99);
const isOtherJobPositionSelected = computed(() => Number(form.value.job_category_id) === 99);

console.log("isOtherHolidaySelected:", isOtherHolidaySelected);
console.log("isOtherServiceTypeSelected:", isOtherServiceTypeSelected);
console.log("isOtherJobPositionSelected:", isOtherJobPositionSelected);

// 「その他」を選んだ時だけ必須エラーを出すフラグ
const triedHolidayOther = ref(false);
const showHolidayOtherError = computed(
  () =>
    triedHolidayOther.value &&
    isOtherHolidaySelected.value &&
    !form.value.holiday_other_text?.trim(),
);
const triedServiceTypeOther = ref(false);
const triedJobPositionOther = ref(false);

const showServiceTypeOtherError = computed(
  () =>
    triedServiceTypeOther.value &&
    isOtherServiceTypeSelected.value &&
    !form.value.service_type_other_text?.trim(),
);
const showJobPositionOtherError = computed(
  () =>
    triedJobPositionOther.value &&
    isOtherJobPositionSelected.value &&
    !form.value.job_position_other_text?.trim(),
);

const isOtherMeritSelected = computed(() => form.value.job_merit.includes(99));

// ドラフト保存を禁止する条件
const draftBlocked = computed(() => {
  const posNG =
    Number(form.value.job_category_id) === 99 && !form.value.job_position_other_text?.trim();
  const meritNG = isOtherMeritSelected.value && !form.value.merit_other_text?.trim();
  return posNG || meritNG;
});
const draftBlockedReason = computed(() => {
  const reasons = [];
  if (Number(form.value.job_category_id) === 99 && !form.value.job_position_other_text?.trim()) {
    reasons.push("募集職種で「その他」を選んだ場合は自由記入が必須です");
  }
  if (isOtherMeritSelected.value && !form.value.merit_other_text?.trim()) {
    reasons.push("メリットで「その他」を選んだ場合は自由記入が必須です");
  }
  return reasons.join("／");
});

const triedMeritOther = ref(false);
const showMeritOtherError = computed(
  () => triedMeritOther.value && isOtherMeritSelected.value && !form.value.merit_other_text?.trim(),
);

// 追加：不足箇所へスクロール＆赤枠
function jumpAndMark(selector) {
  const el = document.querySelector(selector);
  if (!el) return false;
  el.classList.add("is-invalid");
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  // input/textarea/selectにフォーカス
  if (typeof el.focus === "function") el.focus();
  // 3秒で赤枠を消す（任意）
  setTimeout(() => el.classList.remove("is-invalid"), 3000);
  return true;
}

// 追加：“下書き不可”の最初の不足箇所へ飛ぶ
function focusFirstDraftLack() {
  // 募集職種=その他
  if (Number(form.value.job_category_id) === 99 && !form.value.job_position_other_text?.trim()) {
    jumpAndMark("#job-position-other-input");
    return;
  }
  // メリット=その他
  if (isOtherMeritSelected.value && !form.value.merit_other_text?.trim()) {
    jumpAndMark("#merit-other-input");
    return;
  }
}

watch(
  () => form.value.facility_type_id,
  (v) => {
    if (Number(v) !== 99) {
      form.value.service_type_other_text = "";
      triedServiceTypeOther.value = false;
    }
  },
);
watch(
  () => form.value.job_category_id,
  (v) => {
    if (Number(v) !== 99) {
      form.value.job_position_other_text = "";
      triedJobPositionOther.value = false;
    }
  },
);

watch(
  () => form.value.job_merit.slice(),
  (arr) => {
    if (!arr.includes(99)) {
      form.value.merit_other_text = "";
      triedMeritOther.value = false;
    }
  },
);

function normalizeNumberLike(s) {
  if (s == null || s === "") return null;
  const v = String(s)
    .replace(/[,\s]/g, "")
    .replace(/[０-９]/g, (d) => String("０１２３４５６７８９".indexOf(d)));
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

const slotsLeft = computed(() =>
  Math.max(0, MAX_IMAGES - uploadFiles.value.length - selectedStock.value.length),
);

function validateFile(file) {
  const okType = ["image/jpeg", "image/png"].includes(file.type);
  const okSize = file.size <= 5 * 1024 * 1024;
  return okType && okSize;
}

function pushFiles(files) {
  for (const f of files) {
    if (!validateFile(f)) continue;
    if (slotsLeft.value <= 0) break;
    uploadFiles.value.push(f);
    uploadPreviews.value.push(URL.createObjectURL(f));
  }
}

function onChooseFiles(e) {
  const files = Array.from(e.target.files || []);
  pushFiles(files);
  // 連続選択でもonChangeが走るように
  e.target.value = "";
}

function onDrop(e) {
  const files = Array.from(e.dataTransfer.files || []);
  pushFiles(files);
}

function removeUpload(i) {
  const url = uploadPreviews.value[i];

  // blob URL だけ安全に解放（残り0などで undefined の時に備える）
  if (url && typeof url === "string" && url.startsWith("blob:")) {
    try {
      URL.revokeObjectURL(url);
    } catch (e) {
      // 一部環境で例外が出ても無視（no-empty回避）
      if (import.meta?.env?.DEV) console.debug("[revokeObjectURL] ignored:", e);
    }
  }

  uploadPreviews.value.splice(i, 1);
  uploadFiles.value.splice(i, 1);
}

function isStockDisabled(name) {
  const already = selectedStock.value.includes(name);
  // 既に選択済みなら常に有効、未選択なら残り0枚で無効
  return !already && slotsLeft.value === 0;
}

// 通貨表記（カンマ付・空や0は「0円」、null/undefinedは「―」）
const yen = (v) => {
  if (v === null || v === undefined || v === "") return "―";
  const n = Number(String(v).replace(/[^\d.-]/g, ""));
  if (!Number.isFinite(n)) return "―";
  return new Intl.NumberFormat("ja-JP").format(n) + "円";
};

// 県名/ID文字列/数値 いずれでも受け取り、都道府県IDの数値を返す
const resolvePrefectureId = (v) => {
  if (v == null || v === "") return null;
  const n = Number(v);
  if (Number.isFinite(n)) return n;
  const hit = prefectures.value.find((p) => p.name === v || String(p.id) === String(v));
  return hit ? Number(hit.id) : null;
};

function onNumInput(key, e) {
  const raw = String(e?.target?.value ?? "");
  // 全角数字→半角、カンマ/空白除去（※記号や文字は消える）
  const half = raw
    .replace(/[０-９]/g, (d) => String("０１２３４５６７８９".indexOf(d)))
    .replace(/[,\s]/g, "");
  form.value[key] = half;
}

// 送信用ヘルパ（既存）
async function appendImagesToFormData(fd) {
  uploadFiles.value.forEach((f) => fd.append("images[]", f));
  for (const id of selectedStock.value) {
    const item = stockImages.value.find((s) => s.id === id);
    if (!item) continue;
    const res = await fetch(item.url);
    const blob = await res.blob();
    const ext = id.split(".").pop()?.toLowerCase();
    const type = blob.type || (ext === "png" ? "image/png" : "image/jpeg");
    const file = new File([blob], id, { type });
    fd.append("images[]", file);
  }
}

// カタカナ項目のエラーフラグ
const kanaErrors = ref({
  job_kana: false,
  job_last_kana: false,
  job_first_kana: false,
});

/** 全角カタカナのみ許可（長音ー・中点・全角スペース・全角（ ）はOK） */
function isZenkakuKatakanaOnly(s = "") {
  // 空/スペースのみは通す（必須は別チェック）
  const noSpace = String(s).replace(/[ \u3000]/g, "");
  if (!noSpace) return true;
  // 全角カタカナ + 中点・全角（ ）・全角スペースのみ許可
  return /^[\u30A0-\u30FF・（）\u3000]+$/.test(s);
}

/** カナ3項目を検証し、各項目の直下にエラー表示する */
async function validateKanaFields() {
  // いったん全クリア
  kanaErrors.value.job_kana = false;
  kanaErrors.value.job_last_kana = false;
  kanaErrors.value.job_first_kana = false;

  const targets = [
    { key: "job_kana", el: "#job-kana-input" },
    { key: "job_last_kana", el: "#job-last-kana-input" },
    { key: "job_first_kana", el: "#job-first-kana-input" },
  ];

  const bad = [];
  for (const t of targets) {
    if (!isZenkakuKatakanaOnly(form.value[t.key])) {
      kanaErrors.value[t.key] = true;
      bad.push(t);
    }
  }

  if (bad.length) {
    await nextTick();
    const first = document.querySelector(bad[0].el);
    first?.scrollIntoView({ behavior: "smooth", block: "center" });
    first?.focus();
    return false;
  }
  return true;
}

/** 登録する（確認画面で使う） */
async function submitCreate(opts = { status: "published" }) {
  const status = opts?.status === "draft" ? "draft" : "published";
  const fd = new FormData();

  const titleNormalized = (form.value.job_title ?? "")
    .normalize("NFKC")
    .trim()
    .replace(/\s+/g, " ");
  // ここで空なら空のまま送らず、エラーにする or プレースホルダにする
  if (!titleNormalized) {
    // 下書きも必須にするなら return エラー
    // throw new Error('掲載タイトルは必須です。')
  }

  // 基本項目
  // fd.append('title', form.value.job_title ?? '')
  fd.append("title", titleNormalized);
  fd.append("service_type_id", String(form.value.facility_type_id ?? ""));
  fd.append("employment_type_id", String(form.value.employment_type_id ?? ""));
  fd.append("shift_id", String(form.value.shift_id ?? ""));
  fd.append("number_of_positions", String(form.value.openings ?? ""));
  fd.append("base_salary_type", form.value.base_salary_type ?? "");
  // fd.append('base_salary_min', String(form.value.base_salary_min ?? ''))
  // fd.append('base_salary_max', String(form.value.base_salary_max ?? ''))
  // fd.append('improvement_allowance', String(form.value.treatment_allowance ?? ''))
  const min = normalizeNumberLike(form.value.base_salary_min);
  const max = normalizeNumberLike(form.value.base_salary_max);
  const ta = normalizeNumberLike(form.value.treatment_allowance);

  fd.append("base_salary_min", min != null ? String(min) : "");
  fd.append("base_salary_max", max != null ? String(max) : "");
  // DB は text 欄ですが、数値だけに正規化して送ります（仕様的に金額なら数値で問題なし）
  fd.append("improvement_allowance", ta != null ? String(ta) : "");
  fd.append("has_salary_raise", form.value.raise_available === "yes" ? "1" : "0");
  fd.append("has_bonus", form.value.bonus_available === "yes" ? "1" : "0");
  fd.append("pr_message", form.value.pr_info ?? "");
  fd.append("user_id", String(form.value.user_id ?? ""));
  fd.append("post_status", status); // ← ここでpublished or draft切替

  // 施設スナップショット
  fd.append("facility_name", form.value.job_name ?? "");
  fd.append("facility_name_kana", form.value.job_kana ?? "");
  fd.append("prefecture_id", String(resolvePrefectureId(form.value.job_pref) ?? ""));
  fd.append("city", form.value.job_city ?? "");
  fd.append("address_line1", form.value.job_address1 ?? "");
  fd.append("address_line2", form.value.job_address2 ?? "");
  fd.append("postal_code", (form.value.job_zipcode || "").replace(/-/g, ""));
  fd.append("phone", (form.value.job_tel || "").replace(/[^\d]/g, ""));

  // 採用担当スナップショット
  fd.append("contact_last_name", form.value.job_last_name ?? "");
  fd.append("contact_first_name", form.value.job_first_name ?? "");
  fd.append("contact_last_kana", form.value.job_last_kana ?? "");
  fd.append("contact_first_kana", form.value.job_first_kana ?? "");
  fd.append("contact_email", form.value.job_email ?? "");
  fd.append("contact_phone", (form.value.job_contact_tel || "").replace(/[^\d]/g, ""));

  // 応募要項（マスタID）
  fd.append("job_position_id", String(form.value.job_category_id ?? ""));
  fd.append("education_level_id", String(form.value.education_id ?? ""));

  fd.append("merit_ids", (form.value.job_merit || []).join(","));
  fd.append("holiday_ids", (form.value.job_holidays || []).join(","));
  fd.append("welfare_option_ids", (form.value.job_insurance || []).join(","));

  // 施設形態/募集職種は join テーブル用にも CSV で送る（単一でも文字列）
  fd.append("service_type_ids", String(form.value.facility_type_id || ""));
  fd.append("job_position_ids", String(form.value.job_category_id || ""));
  // 公開日を使う場合のみ
  if (form.value.published_date) {
    fd.append("published_date", form.value.published_date);
  }

  // 施設形態：その他
  if (Number(form.value.facility_type_id) === 99) {
    fd.append("service_type_other_text", (form.value.service_type_other_text || "").slice(0, 100));
  }

  // 職種：その他
  if (Number(form.value.job_category_id) === 99) {
    fd.append("job_position_other_text", (form.value.job_position_other_text || "").slice(0, 100));
  }

  // メリット：その他
  if ((form.value.job_merit || []).includes(99)) {
    fd.append("merit_other_text", (form.value.merit_other_text || "").slice(0, 100));
  }

  // ★ メリットの自由記入（99 のときだけ送る）
  if ((form.value.job_merit || []).includes(99)) {
    fd.append("merit_other_text", (form.value.merit_other_text || "").slice(0, 100));
  }

  // ★ 追加：holiday_other_text（その他=99 選択時のみ送付）
  if ((form.value.job_holidays || []).includes(99)) {
    fd.append("holiday_other_text", (form.value.holiday_other_text || "").slice(0, 100));
  }

  // 事業者ID：必ず送る（myBusiness.id が取れていればそれ、なければ空）
  fd.append("facility_id", String(form.value.facility_id ?? ""));
  // 画像（アップロード＆サンプル）
  await appendImagesToFormData(fd);

  // ← 送信直前：FormDataの中身をそのまま出力
  console.log("--- [CREATE] FormData start ---");
  for (const [k, v] of fd.entries()) {
    if (v instanceof File) {
      console.log(k, `(File) name=${v.name}, size=${v.size}, type=${v.type}`);
    } else {
      console.log(k, String(v));
    }
  }
  console.log("--- [CREATE] FormData end ---");

  // 送信してレスポンスを返す（完了画面への遷移で使用）
  const { data } = await API.post("/business/job/create", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

// 画像（アップロード + サンプル選択）の詳細配列
const confirmImagesDetailed = computed(() => {
  const ups = uploadFiles.value.map((f, i) => ({
    key: "up-" + i,
    src: uploadPreviews.value[i],
    name: f.name || "アップロード画像",
    sizeText: f.size ? (Math.round((f.size / 1024) * 10) / 10).toLocaleString() + " KB" : "",
  }));

  const stocks = selectedStock.value
    .map((id) => {
      const item = stockImages.value.find((s) => s.id === id);
      return item ? { key: "st-" + id, src: item.url, name: id, sizeText: "" } : null;
    })
    .filter(Boolean);

  return [...ups, ...stocks].slice(0, MAX_IMAGES);
});

/** 確認画面へ渡すデータを整形
 *  - *_ids は API へそのまま送れる配列（数値）
 *  - *_labels は確認画面表示用（任意）
 */
const buildConfirmPayload = () => {
  const copy = JSON.parse(JSON.stringify(form.value));
  const merit_ids = toIds(copy.job_merit);
  const holiday_ids = toIds(copy.job_holidays);
  const welfare_option_ids = toIds(copy.job_insurance);

  copy.openings = normalizeNumberLike(copy.openings);
  if (typeof copy.pr_info === "string") copy.pr_info = copy.pr_info.trim().slice(0, 500);

  return {
    ...copy,
    merit_ids,
    holiday_ids,
    welfare_option_ids,
    // ★ 追加（確認画面や送信用に残す）
    holiday_other_text: copy.holiday_other_text ?? "",
    service_type_other_text: copy.service_type_other_text ?? "",
    job_position_other_text: copy.job_position_other_text ?? "",
    merit_other_text: copy.merit_other_text ?? "",
    // 表示用ラベル
    merit_labels: selectedMeritLabels.value,
    holiday_labels: selectedHolidayLabels.value,
    insurance_labels: selectedInsuranceLabels.value,
  };
};

const startConfirm = async () => {
  // カタカナ欄をチェック
  if (!(await validateKanaFields())) return;
  // 必須チェック（編集ステップで出す赤字エラー）
  if (!(await validateRequiredForConfirm())) return;

  // 休日(その他) 既存チェック
  triedHolidayOther.value = true;
  if (isOtherHolidaySelected.value && !form.value.holiday_other_text?.trim()) {
    message.value = "休日で「その他」を選んだ場合は内容を入力してください。";
    document
      .getElementById("holiday-other-input")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  // ★ 施設形態(その他)
  triedServiceTypeOther.value = true;
  if (isOtherServiceTypeSelected.value && !form.value.service_type_other_text?.trim()) {
    message.value = "施設形態で「その他」を選んだ場合は内容を入力してください。";
    document
      .getElementById("service-type-other-input")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  // ★ 募集職種(その他)
  triedJobPositionOther.value = true;
  if (isOtherJobPositionSelected.value && !form.value.job_position_other_text?.trim()) {
    message.value = "募集職種で「その他」を選んだ場合は内容を入力してください。";
    document
      .getElementById("job-position-other-input")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  // ★ メリット(その他)
  triedMeritOther.value = true;
  if (isOtherMeritSelected.value && !form.value.merit_other_text?.trim()) {
    message.value = "メリットで「その他」を選んだ場合は内容を入力してください。";
    document
      .getElementById("merit-other-input")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  // 施設名カナ：全角カタカナ以外NG（・（）全角スペースのみ許容）
  // const kanaOk = /^[\u30A0-\u30FF・（） ]+$/.test(form.value.job_kana || '')
  // if (!kanaOk) {
  //   message.value = '施設名カナは全角カタカナで入力してください。（記号は「・」「（」「）」と全角スペースのみ可）'
  //   document.getElementById('job_kana')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  //   return
  // }

  confirm.value = buildConfirmPayload();
  confirming.value = true;
};

// 必須エラー
const reqErrors = ref({
  job_name: false,
  job_kana: false,
  job_pref: false,
  // job_city: false,
  work_location_id: false, // ★追加
  job_title: false,
  facility_type_id: false,
  job_category_id: false,
  employment_type_id: false,
  shift_id: false,
});

function clearReqErrors() {
  Object.keys(reqErrors.value).forEach((k) => (reqErrors.value[k] = false));
}

async function validateRequiredForConfirm() {
  clearReqErrors();
  const order = [
    ["job_name", "施設名", "#job-name-input"],
    ["job_kana", "施設名カナ", "#job-kana-input"],
    ["job_pref", "都道府県", "#pref-select"],
    ["work_location_id", "市町村", "#job-city-select"],
    ["job_title", "掲載タイトル", "#job-title-input"],
    ["facility_type_id", "施設形態", "#facility-type-select"],
    ["job_category_id", "募集職種", "#job-category-select"],
    ["shift_id", "シフト", "#shift-select"],
    ["employment_type_id", "勤務形態", "#employment-type-select"],
  ];
  const missing = [];
  for (const [key, label, sel] of order) {
    const v = String(form.value[key] ?? "").trim();
    if (!v) {
      reqErrors.value[key] = true;
      missing.push({ sel, label });
    }
  }

  // === 追加: “その他” 選択時の自由記入必須 ===
  const otherLacks = [];
  if (isOtherServiceTypeSelected.value && !form.value.service_type_other_text?.trim()) {
    otherLacks.push({
      sel: "#service-type-other-input",
      label: "施設形態の「その他（自由記入）」",
    });
  }
  if (isOtherJobPositionSelected.value && !form.value.job_position_other_text?.trim()) {
    otherLacks.push({
      sel: "#job-position-other-input",
      label: "募集職種の「その他（自由記入）」",
    });
  }
  if (isOtherMeritSelected.value && !form.value.merit_other_text?.trim()) {
    otherLacks.push({ sel: "#merit-other-input", label: "メリットの「その他（自由記入）」" });
  }
  if (isOtherHolidaySelected.value && !form.value.holiday_other_text?.trim()) {
    otherLacks.push({ sel: "#holiday-other-input", label: "休日の「その他（自由記入）」" });
  }

  if (missing.length) {
    await nextTick();
    const first = document.querySelector(missing[0].sel);
    first?.scrollIntoView({ behavior: "smooth", block: "center" });
    first?.focus();
    message.value = `${missing.map((m) => m.label).join("、")} を入力/選択してください。`;
    ok.value = false;
    return false;
  }

  if (otherLacks.length) {
    await nextTick();
    const first = document.querySelector(otherLacks[0].sel);
    first?.scrollIntoView({ behavior: "smooth", block: "center" });
    first?.focus();
    message.value = `${otherLacks.map((m) => m.label).join("、")} を入力してください。`;
    ok.value = false;
    return false;
  }
  message.value = "";
  return true;
}

const workLocationName = computed(() => {
  const c = workLocationList.value.find(
    (x) => Number(x.id) === Number(form.value.work_location_id),
  );
  return c?.name || "";
});

watch(
  () => form.value.work_location_id,
  (id) => {
    if (!id) {
      form.value.job_city = "";
      return;
    }
    const c = workLocationList.value.find((x) => Number(x.id) === Number(id));
    form.value.job_city = c?.name || "";
  },
);

const saveAndFinish = async () => {
  if (!(await validateKanaFields())) return;
  // 公開保存時は facility_id も含めた必須チェック
  //  if (!(await validateRequiredForPublish())) return
  saving.value = true;
  message.value = "";
  ok.value = false;
  try {
    // const data = await submitCreate()
    const data = await submitCreate({ status: "published" });
    console.log("saveAndFinishのdata:", data);
    ok.value = true;
    message.value = "保存しました。";

    if (data && data.success) {
      // 完了画面へ（ルート名は router/index.ts の定義どおり）
      router.replace({ name: "JobRegisterComplete", query: { id: data.jobId } });
    } else {
      // success が false の場合の保険
      message.value = "保存は完了しましたが、完了画面へ遷移できませんでした。";
    }
  } catch (e) {
    ok.value = false;
    message.value =
      (e && e.response && e.response.data && e.response.data.error) ||
      (e && e.message) ||
      "保存に失敗しました。";
  } finally {
    saving.value = false;
  }
};

// 確認を経由せずに即「draft」で保存（バリデーションは最小限）
const saveDraftQuick = async () => {
  if (!(await validateKanaFields())) return;
  // タイトル必須（下書きでも）
  if (!form.value.job_title || !form.value.job_title.trim()) {
    reqErrors.value.job_title = true;
    await nextTick();
    document
      .querySelector("#job-title-input")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    document.querySelector("#job-title-input")?.focus();
    message.value = "掲載タイトルは必須です。（下書き保存でも入力してください）";
    return;
  }

  // ★ 「その他」必須（募集職種・メリット）を厳密チェックしてブロック
  triedJobPositionOther.value = true;
  triedMeritOther.value = true;
  if (Number(form.value.job_category_id) === 99 && !form.value.job_position_other_text?.trim()) {
    message.value = "募集職種で「その他」を選んだ場合は内容を入力してください。";
    document
      .getElementById("job-position-other-input")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  if (isOtherMeritSelected.value && !form.value.merit_other_text?.trim()) {
    message.value = "メリットで「その他」を選んだ場合は内容を入力してください。";
    document
      .getElementById("merit-other-input")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  if (!form.value.user_id) {
    alert("ログイン情報が無効です。再ログインしてください。");
    return;
  }
  saving.value = true;
  message.value = "";
  ok.value = false;
  try {
    const data = await submitCreate({ status: "draft" });
    ok.value = true;
    message.value = "下書きとして保存しました。";
    if (data?.jobId) {
      // router.replace({ name: 'JobEditForm', params: { id: data.jobId } })
      router.replace({ name: "JobDraftSaved" });
    }
  } catch (e) {
    ok.value = false;
    message.value =
      (e && e.response && e.response.data && e.response.data.error) ||
      (e && e.message) ||
      "下書き保存に失敗しました。";
  } finally {
    saving.value = false;
  }
};

// 確認画面から「下書き保存」
const saveDraftFromConfirm = async () => {
  if (!(await validateKanaFields())) return;
  saving.value = true;
  message.value = "";
  ok.value = false;
  try {
    const data = await submitCreate({ status: "draft" });
    ok.value = true;
    message.value = "下書きとして保存しました。";
    if (data?.jobId) {
      router.replace({ name: "JobEditForm", params: { id: data.jobId } });
    }
  } catch (e) {
    ok.value = false;
    message.value =
      (e && e.response && e.response.data && e.response.data.error) ||
      (e && e.message) ||
      "下書き保存に失敗しました。";
  } finally {
    saving.value = false;
  }
};

// 公開登録前の必須チェック（確認画面用の赤字表示 + facility_id チェック）
// async function validateRequiredForPublish() {
//   // まず画面上の必須4項目を「赤字&スクロール」で案内
//   const ok = await validateRequiredForConfirm()
//   if (!ok) return false
//   // 追加で facility_id を確認（取得できていないと公開不可）
//   if (!form.value.facility_id) {
//     alert('施設情報が取得できていません。いったん再読み込みしてください。')
//     return false
//   }
//   return true
// }
</script>

<style scoped>
.text-note {
  font-size: 0.875rem;
  margin-bottom: 1rem;
  color: #444;
}
.white-bg {
  background: white;
}

input[type="email"] {
  border: 2px solid #ccc;
  background-color: #fff;
  padding: 0.7em;
  border-radius: 5px;
  width: 100%;
}

/* ===== 確認画面 ===== */
.confirm-title {
  font-size: 1.5rem;
  margin: 0 0 14px;
}
.confirm-box {
  background: #f6f7f8;
  border-radius: 14px;
  padding: 20px 18px;
}
.confirm-lead {
  margin: 0 0 18px;
  color: #444;
}
.confirm-subtitle {
  font-size: 1.125rem;
  margin: 24px 0 10px;
}
.confirm-group {
  background: #fff;
  border-radius: 10px;
  padding: 6px 0;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.03) inset;
}
.confirm-row {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 14px;
  padding: 14px 16px;
  border-bottom: 1px dotted #ddd;
}
.confirm-row:last-child {
  border-bottom: 0;
}
.confirm-label {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.6;
  white-space: nowrap;
}
.confirm-value {
  color: #111;
  line-height: 1.8;
}

/* 画像リスト */
.confirm-images {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
  list-style: none;
  padding: 0;
  margin: 0;
}
.confirm-images li {
  display: grid;
  grid-template-columns: 90px 1fr;
  gap: 10px;
  align-items: center;
  background: #fafafa;
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 10px;
}
.confirm-images img {
  width: 90px;
  height: 64px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #e8e8e8;
}
.img-meta {
  display: grid;
  gap: 4px;
}
.img-name {
  font-size: 0.95rem;
}
.img-size {
  color: #888;
  font-size: 0.85rem;
}

.confirm-cta {
  text-align: center;
  font-weight: 600;
  margin: 22px 0 10px;
}

/* 大きめボタン（デザイナーのクラスを拡張） */
.btn.big {
  display: block;
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  height: 52px;
  font-size: 1.05rem;
}
.btn-back {
  background: #dfeef2;
  color: #234;
}

/* 任意の補助スタイル */
.other-input .input {
  border: 2px solid #ccc;
  background-color: #fff;
  padding: 0.7em;
  border-radius: 5px;
}
.error-inline {
  color: #d92d20;
  margin-top: 6px;
  font-size: 0.875rem;
}

/* 既存の .btn/.btn-primary が input[type=submit] 前提でも確実に適用する */
:deep(button.btn.btn-primary.maru),
:deep(input[type="submit"].btn.btn-primary.maru) {
  display: block;
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  padding: 14px 24px;
  border: none;
  border-radius: 9999px;
  background: #4db7e5; /* プロジェクトの primary に合わせてください */
  color: #fff;
  font-weight: 700;
  text-align: center;
}

/* 幅あわせ用ユーティリティ（任意） */
:deep(.btn--full) {
  display: block;
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
}

/* 追加スタイル（scopedでOK） */
.hint-error {
  margin-top: 8px;
  color: #d92d20;
  font-size: 0.9rem;
  line-height: 1.6;
}
.as-link {
  border: 0;
  background: none;
  padding: 0 0 0 8px;
  text-decoration: underline;
  cursor: pointer;
}
.is-invalid {
  outline: 2px solid #d92d20;
  outline-offset: 2px;
}

/* 改行をそのまま表示（連続スペースも保持） */
.whitespace-pre-wrap {
  white-space: pre-wrap;
  word-break: break-word; /* 長い単語対策（任意） */
}
</style>
