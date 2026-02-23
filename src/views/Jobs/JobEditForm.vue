<!-- src/views/jobs/JobEditForm.vue -->
 <!-- 求人情報の編集 -->
<template>
  <body class="job-admin is-employer is-login">
  <div class="wrap">
    <div style="position:fixed;z-index:99999;right:8px;bottom:8px;background:#111;color:#0f0;padding:4px 6px;font-size:12px;border-radius:4px;">
  JobEditForm LIVE
</div>

    <AppHeader />
    <HamburgerMenu />
    <FooterNav />

    <main>
      <section class="l-sec mypage-detail">
        <div class="page-title maru">求人情報の編集</div>
        <div class="form-wrap">
          <div class="inner">

            <!-- ========== 編集ステップ ========== -->
            <form v-if="!confirming" @submit.prevent="startConfirm">
              <div class="sec-title">施設情報</div>
              <p style="margin-bottom: 1em;">※<span class="opendata">公開</span>は登録していないユーザーにも公開されます。</p>

              <div class="form-items">
                <!-- 施設情報 -->
                <div class="form-item opendata-wrap">
                  <label>施設名（全角） <span class="req">※必須</span><span class="opendata">公開</span></label>
                  <input type="text" v-model="form.job_name" placeholder="ふくしまちケアセンター こおりやま" />
                </div>
                <div class="form-item opendata-wrap">
                  <label>施設名カナ（全角） <span class="req">※必須</span><span class="opendata">公開</span></label>
                  <input type="text" v-model="form.job_kana" placeholder="フクシマチケアセンター コオリヤマ" />
                </div>
                <div class="form-item">
                  <label>都道府県 <span class="req"></span><span class="opendata">公開</span></label>
                  <!-- <select v-model="form.job_pref"> -->
                  <select v-model="form.job_pref" :disabled="true" aria-readonly="true">
                    <option value="">選択してください</option>
                    <option v-for="pref in prefectures" :key="pref.id" :value="pref.name">{{ pref.name }}</option>
                  </select>
                </div>
                <div class="form-item opendata-wrap">
                  <label>住所（全角） <span class="req">※必須</span><span class="opendata">公開</span></label>
                  <input type="text" v-model="form.job_city" placeholder="〇〇郡〇〇市〇〇町" />
                </div>
                <div class="form-item">
                  <label>番地</label>
                  <input type="text" v-model="form.job_address1" placeholder="２－１６" />
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
                  <input type="text" v-model="form.job_last_kana" />
                </div>
                <div class="form-item">
                  <label>名カナ（全角）</label>
                  <input type="text" v-model="form.job_first_kana" />
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
                  <label>掲載タイトル（全角／30文字以内） <span class="req">※必須</span><span class="opendata">公開</span></label>
                  <textarea v-model="form.job_title" maxlength="50" rows="3"></textarea>
                </div>

                <!-- 施設形態 -->
                <div class="form-item">
                  <label>施設形態 <span class="req">※必須</span></label>
                  <select v-model="form.facility_type_id">
                    <option value="">選択してください</option>
                    <option v-for="t in serviceTypes" :key="t.id" :value="t.id">{{ t.name }}</option>
                  </select>
                </div>
                <div v-if="Number(form.facility_type_id) === 99" class="other-input" style="margin-top:8px;">
                  <label>施設形態：その他（自由記入）<span style="color:#d00;">※必須</span></label>
                  <input
                    id="service-type-other-input"
                    type="text"
                    v-model.trim="form.service_type_other_text"
                    maxlength="100"
                    class="input"
                  />
                  <p v-if="showServiceTypeOtherError" class="error-message" style="color:#d92d20;margin-top:6px;">
                    「施設形態」で「その他」を選んだ場合は内容を入力してください。
                  </p>
                </div>

                <!-- 募集職種 -->
                <div class="form-item">
                  <label>募集職種</label>
                  <select v-model="form.job_category_id">
                    <option value="">選択してください</option>
                    <option v-for="c in jobCategories" :key="c.id" :value="c.id">{{ c.name }}</option>
                  </select>
                </div>
                <div v-if="Number(form.job_category_id) === 99" class="other-input" style="margin-top:8px;">
                  <label>募集職種：その他（自由記入）<span style="color:#d00;">※必須</span></label>
                  <input
                    id="job-position-other-input"
                    type="text"
                    v-model.trim="form.job_position_other_text"
                    maxlength="100"
                    class="input"
                  />
                  <p v-if="showJobPositionOtherError" class="error-message" style="color:#d92d20;margin-top:6px;">
                    「募集職種」で「その他」を選んだ場合は内容を入力してください。
                  </p>
                </div>

                <div class="form-item">
                  <label>学歴</label>
                  <select v-model="form.education_id">
                    <option value="">選択してください</option>
                    <option v-for="e in educations" :key="e.id" :value="e.id">{{ e.name }}</option>
                  </select>
                </div>

                <!-- 給与 -->
                <div class="sec-title">給与について（半角数字記号）</div>
                <div class="form-item">
                  <label>基本給<span class="opendata">公開</span></label>
                  <div class="radio-items">
                    <label class="radio-item">
                      <input type="radio" name="base_salary_type" value="hourly" v-model="form.base_salary_type" />
                      時給
                    </label>
                    <label class="radio-item">
                      <input type="radio" name="base_salary_type" value="monthly" v-model="form.base_salary_type" />
                      月給
                    </label>
                  </div>
                </div>
                <div class="form-item">
                  <div class="flex" style="gap:12px; align-items:center;">
                    <input type="text" inputmode="numeric" placeholder="例）160,000" v-model="form.base_salary_min" style="max-width:220px;" />
                    <span>円～</span>
                    <input type="text" inputmode="numeric" placeholder="例）250,000" v-model="form.base_salary_max" style="max-width:220px;" />
                    <span>円</span>
                  </div>
                </div>
                <div class="form-item">
                  <label>処遇改善手当</label>
                  <div class="flex" style="gap:12px; align-items:center;">
                    <input type="text" inputmode="numeric" placeholder="10,000" v-model="form.treatment_allowance" style="max-width:220px;" />
                    <span>円</span>
                  </div>
                </div>
                <div class="form-item">
                  <label>昇給</label>
                  <div class="radio-items">
                    <label class="radio-item">
                      <input type="radio" name="raise_available" value="yes" v-model="form.raise_available" /> あり
                    </label>
                    <label class="radio-item">
                      <input type="radio" name="raise_available" value="no" v-model="form.raise_available" /> なし
                    </label>
                  </div>
                </div>
                <div class="form-item">
                  <label>賞与</label>
                  <div class="radio-items">
                    <label class="radio-item">
                      <input type="radio" name="bonus_available" value="yes" v-model="form.bonus_available" /> あり
                    </label>
                    <label class="radio-item">
                      <input type="radio" name="bonus_available" value="no" v-model="form.bonus_available" /> なし
                    </label>
                  </div>
                </div>

                <!-- 休日 / 保険 / 募集人数 / シフト / 勤務形態 / メリット -->
                <div class="form-item">
                  <label>休日</label>
                  <div class="checkbox-items">
                    <label class="checkbox" v-for="h in holidays" :key="'holiday-'+h.id">
                      <input type="checkbox" class="input-checkbox" name="holiday_ids[]" :value="Number(h.id)" v-model="form.job_holidays" />
                      <span class="checkbox-label">{{ h.name }}</span>
                    </label>
                  </div>

                  <!-- ★ 追加：その他=99 を選んだときだけ自由記入 -->
                  <div v-if="isOtherHolidaySelected" class="other-input" style="margin-top:10px;">
                    <label>その他（自由記入）<span style="color:#d00;">※必須</span></label>
                    <input
                      id="holiday-other-input"
                      type="text"
                      v-model.trim="form.holiday_other_text"
                      maxlength="100"
                      placeholder="例：シフト制（週2日休み） など"
                      class="input"
                      style="width:100%;padding:.7em;border:1px solid #ccc;border-radius:4px;"
                    />
                    <p v-if="showHolidayOtherError" class="error-message" style="color:#d92d20;margin-top:6px;">
                      「その他」を選択した場合は内容を入力してください。
                    </p>
                  </div>
                </div>


                <div class="form-item">
                  <label>保険加入</label>
                  <div class="checkbox-items">
                    <label class="checkbox" v-for="w in insurances" :key="'ins-'+w.id">
                      <input type="checkbox" class="input-checkbox" name="welfare_option_ids[]" :value="Number(w.id)" v-model="form.job_insurance" />
                      <span class="checkbox-label">{{ w.name }}</span>
                    </label>
                  </div>
                </div>

                <div class="form-item">
                  <label>募集人数</label>
                  <div class="flex" style="gap:12px; align-items:center;">
                    <input type="text" inputmode="numeric" placeholder="5" v-model="form.openings" style="max-width:120px;" />
                    <span>人</span>
                  </div>
                </div>

                <div class="form-item">
                  <label>シフト <span class="req">※必須</span></label>
                  <select v-model="form.shift_id">
                    <option value="">選択してください</option>
                    <option v-for="s in shifts" :key="s.id" :value="s.id">{{ s.name }}</option>
                  </select>
                </div>

                <div class="form-item">
                  <label>勤務形態 <span class="req">※必須</span><span class="opendata">公開</span></label>
                  <select v-model="form.employment_type_id">
                    <option value="">選択してください</option>
                    <option v-for="e in employmentTypes" :key="e.id" :value="e.id">{{ e.name }}</option>
                  </select>
                </div>

                <!-- メリット（チェックボックス） -->
                <div class="form-item">
                  <label>メリット<span class="opendata">公開</span></label>
                  <div class="checkbox-items">
                    <label class="checkbox" v-for="m in merits" :key="'merit-'+m.id">
                      <input type="checkbox" class="input-checkbox" name="merit_ids[]" :value="Number(m.id)" v-model="form.job_merit" />
                      <span class="checkbox-label">{{ m.name }}</span>
                    </label>
                  </div>
                </div>
                <div v-if="form.job_merit.includes(99)" class="other-input" style="margin-top:8px;">
                  <label>メリット：その他（自由記入）<span style="color:#d00;">※必須</span></label>
                  <input
                    id="merit-other-input"
                    type="text"
                    v-model.trim="form.merit_other_text"
                    maxlength="100"
                    class="input"
                  />
                  <p v-if="showMeritOtherError" class="error-message" style="color:#d92d20;margin-top:6px;">
                    「メリット」で「その他」を選んだ場合は内容を入力してください。
                  </p>
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
                <p class="text-note">写真は施設の外観・内観・スタッフの働く様子など、職場の雰囲気が伝わるものを4点ご用意ください。以下の条件を満たす画像をアップロードしてください。</p>
                <ul class="note indent file-note">
                  <li>・推奨サイズ：横幅1200px × 縦幅800px 以上（横長）</li>
                  <li>・著作権に問題のない画像のみご使用ください</li>
                  <li>・人物が写る場合は、事前に本人の同意を得てください</li>
                  <li>・過度な加工（フィルター等）はご遠慮ください</li>
                </ul>
                <!-- アップロード枠 -->
                <div
                  class="uploader"
                  @dragover.prevent
                  @drop.prevent="onDrop"
                  style="border:2px dashed #ddd; border-radius:8px; padding:28px; text-align:center;"
                >
                <svg class="uploader__icon" xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M48 39a10 10 0 0 0-3.4-19.4A14 14 0 0 0 18 22a9 9 0 0 0-2 17.8"></path>
                <polyline points="32 28 32 46"></polyline>
                <polyline points="24 34 32 26 40 34"></polyline>
                </svg>
                  <div class="uploader__lead">画像をドラッグ&ドロップ<br/>または</div>
                  <div style="margin-top:10px;">
                    <label class="btn btn-primary maru" style="cursor:pointer;">
                      ファイルを選択
                      <input
                        ref="fileInput"
                        type="file"
                        accept="image/png,image/jpeg"
                        multiple
                        @change="onChooseFiles"
                        style="display:none"
                        :disabled="slotsLeft === 0"
                      />
                    </label>
                  </div>
                  <div style="margin-top:8px; color:#777;">
                    JPG / PNG /JPEG（5MBまで）・最大 {{ MAX_IMAGES }} 枚（あと {{ slotsLeft }} 枚）
                  </div>
                </div>

                <!-- プレビュー -->
                <div v-if="uploadPreviews.length" class="form-item">
                  <div class="label">選択中の画像（{{ uploadPreviews.length }} / {{ MAX_IMAGES }}）</div>
                  <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(140px,1fr)); gap:12px;">
                    <div v-for="(src, i) in uploadPreviews" :key="'up-'+i" style="position:relative;">
                      <img :src="src" style="width:100%; height:100px; object-fit:cover; border-radius:8px;">
                      <button type="button" class="btn" @click="removeUpload(i)" style="position:absolute; top:6px; right:6px;">✕</button>
                    </div>
                  </div>
                </div>

                <!-- 既存（保存済み）画像の表示：編集ステップ用 -->
                <!-- <div v-if="existingImages.length" class="form-item">
                  <div class="label">保存済みの画像</div>
                  <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(140px,1fr)); gap:12px;">
                    <div v-for="(src, i) in existingImages" :key="'ex-'+i" style="position:relative;">
                      <img :src="src" style="width:100%; height:100px; object-fit:cover; border-radius:8px; border:1px solid #eee;">
                    </div>
                  </div> -->
                  <!-- デバッグ用に一時表示したいときは下を一時的に有効化 -->
                  <!-- <pre style="margin-top:8px; font-size:12px; color:#666;">{{ existingImages }}</pre>
                </div> -->


                <!-- 既存（保存済み）画像の表示：編集ステップでも見せる -->
                <!-- <div v-if="existingImages.length" class="form-item">
                  <div class="label">現在の掲載画像</div>
                  <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(140px,1fr)); gap:12px;">
                    <div v-for="(src, i) in existingImages" :key="'ex-'+i" style="position:relative;">
                      <img :src="src" style="width:100%; height:100px; object-fit:cover; border-radius:8px; border:1px solid #eee;">
                    </div>
                  </div>
                </div> -->

                <!-- 保存済み画像（削除可：チェックを外すと除外） -->
                <div v-if="existingImages.length" class="form-item">
                  <div class="label">現在の掲載画像（チェックを外すと削除）</div>
                  <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(140px,1fr)); gap:12px;">
                    <div v-for="(img, i) in existingImages" :key="'ex-'+i" style="position:relative;">
                      <img :src="img.url" style="width:100%; height:100px; object-fit:cover; border-radius:8px; border:1px solid #eee;">
                      <label style="position:absolute;left:6px;bottom:6px;background:rgba(255,255,255,.92);border-radius:6px;padding:2px 6px;font-size:12px;">
                        <input type="checkbox" v-model="img.keep"> 残す
                      </label>
                    </div>
                  </div>
                </div>

                <!-- 既存（サンプル）画像：常時表示 -->
                <div class="form-item">
                  <div class="label">画像がない方へ</div>
                  <p class="text-note">以下の画像からご利用できます。（アップロードと合わせて最大 {{ MAX_IMAGES }} 枚）</p>
                  <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); gap:16px;">
                    <label v-for="s in stockImages" :key="s.id" style="display:block; text-align:center;">
                      <img :src="s.url" style="width:100%; height:110px; object-fit:cover; border-radius:8px; border:1px solid #eee;">
                      <div style="margin-top:6px;">
                        <input type="checkbox" :value="s.id" v-model="selectedStock" :disabled="isStockDisabled(s.id)" />
                      </div>
                    </label>
                  </div>
                </div>

                <!-- ボタン -->
                <div class="form-btn-item">
                  <button type="submit" class="btn btn-primary maru">登録情報を確認する</button>
                </div>

                <!-- 任意のAPI保存テストボタン -->
                <!-- <div class="form-btn-item">
                  <button type="button" class="btn" @click="submitCreate">画像付きで登録する（API保存）※テスト用です。</button>
                </div> -->
              </div>
            </form>

              <!-- ===== 確認ステップ ===== -->
            <section v-if="confirming" class="l-sec mypage-detail">
              <div class="page-title maru">登録内容をご確認ください。</div>

              <div class="form-wrap">
                <div class="inner">
                  <p>以下の内容で登録します。問題がなければ「登録する」ボタンを押してください。</p>

                  <div class="conf-items">
                    <!-- 施設情報 -->
                    <div class="conf-item">
                      <div class="employer_name">
                        <span class="label-name">施設名</span>
                        <span class="conf-result">{{ confirm.job_name || '-' }}</span>
                      </div>
                    </div>
                    <div class="conf-item">
                      <div class="employer_kana">
                        <span class="label-name">施設名カナ</span>
                        <span class="conf-result">{{ confirm.job_kana || '-' }}</span>
                      </div>
                    </div>
                    <div class="conf-item">
                      <div class="employer_zipcode">
                        <span class="label-name">郵便番号</span>
                        <span class="conf-result">{{ confirm.job_zipcode || '-' }}</span>
                      </div>
                    </div>
                    <div class="conf-item">
                      <div class="employer_pref">
                        <span class="label-name">都道府県</span>
                        <span class="conf-result">{{ confirm.job_pref || '-' }}</span>
                      </div>
                    </div>
                    <div class="conf-item">
                      <div class="employer_city">
                        <span class="label-name">市町村</span>
                        <span class="conf-result">{{ confirm.job_city || '-' }}</span>
                      </div>
                    </div>
                    <div class="conf-item">
                      <div class="employer_address1">
                        <span class="label-name">番地</span>
                        <span class="conf-result">{{ confirm.job_address1 || '-' }}</span>
                      </div>
                    </div>
                    <div class="conf-item">
                      <div class="employer_address2">
                        <span class="label-name">建物</span>
                        <span class="conf-result">{{ confirm.job_address2 || '-' }}</span>
                      </div>
                    </div>
                    <div class="conf-item">
                      <div class="employer_tel">
                        <span class="label-name">電話番号</span>
                        <span class="conf-result">{{ confirm.job_tel || '-' }}</span>
                      </div>
                    </div>

                    <!-- 採用担当者情報 -->
                    <div class="form-items-subtitle txt-center">採用担当者情報</div>
                    <div class="conf-items">
                      <div class="conf-item flex">
                        <div class="employer_last_name">
                          <span class="label-name">姓</span>
                          <span class="conf-result">{{ confirm.job_last_name || '-' }}</span>
                        </div>
                        <div class="employer_first_name">
                          <span class="label-name">名</span>
                          <span class="conf-result">{{ confirm.job_first_name || '-' }}</span>
                        </div>
                      </div>
                      <div class="conf-item flex">
                        <div class="employer_last_kana">
                          <span class="label-name">姓カナ</span>
                          <span class="conf-result">{{ confirm.job_last_kana || '-' }}</span>
                        </div>
                        <div class="employer_first_kana">
                          <span class="label-name">名カナ</span>
                          <span class="conf-result">{{ confirm.job_first_kana || '-' }}</span>
                        </div>
                      </div>
                      <div class="conf-item">
                        <div class="employer_email">
                          <span class="label-name">担当者メールアドレス</span>
                          <span class="conf-result">{{ confirm.job_email || '-' }}</span>
                        </div>
                      </div>
                      <div class="conf-item">
                        <div class="employer_contact_tel">
                          <span class="label-name">担当者電話番号</span>
                          <span class="conf-result">{{ confirm.job_contact_tel || '-' }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- 応募要項 -->
                    <div class="form-items-subtitle txt-center">応募要項</div>
                    <div class="conf-item">
                      <div class="employer_title">
                        <span class="label-name">掲載タイトル</span>
                        <span class="conf-result">{{ confirm.job_title || '-' }}</span>
                      </div>
                    </div>
                    <div class="conf-item">
                      <div class="employer_service_type">
                        <span class="label-name">施設形態</span>
                        <span class="conf-result">{{ serviceTypeName || '-' }}</span>
                      </div>
                    </div>
                    <div class="conf-item">
                      <div class="employer_job_position">
                        <span class="label-name">募集職種</span>
                        <span class="conf-result">{{ jobCategoryName || '-' }}</span>
                      </div>
                    </div>
                    <div class="conf-item">
                      <div class="employer_education">
                        <span class="label-name">学歴</span>
                        <span class="conf-result">{{ educationName || '-' }}</span>
                      </div>
                    </div>
                    <div class="conf-item">
                      <div class="employer_base_salary">
                        <span class="label-name">基本給</span>
                        <span class="conf-result">
                          {{ confirm.base_salary_type === 'monthly' ? '月給' : '時給' }}
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
                        <span class="conf-result">{{ confirm.raise_available === 'yes' ? 'あり' : 'なし' }}</span>
                      </div>
                    </div>
                    <div class="conf-item">
                      <div class="employer_bonus">
                        <span class="label-name">賞与</span>
                        <span class="conf-result">{{ confirm.bonus_available === 'yes' ? 'あり' : 'なし' }}</span>
                      </div>
                    </div>
                    <div class="conf-item">
                      <div class="employer_holidays">
                        <span class="label-name">休日</span>
                        <span class="conf-result">
                          <template v-if="selectedHolidayLabels.length === 0">-</template>
                          <template v-else>
                            <span v-for="(name, i) in selectedHolidayLabels" :key="'h'+i">
                              {{ name }}<br v-if="i < selectedHolidayLabels.length - 1" />
                            </span>
                          </template>
                        </span>
                      </div>
                    </div>
                    <div class="conf-item">
                      <div class="employer_insurances">
                        <span class="label-name">保険加入</span>
                        <span class="conf-result">
                          <template v-if="selectedInsuranceLabels.length === 0">-</template>
                          <template v-else>
                            <span v-for="(name, i) in selectedInsuranceLabels" :key="'w'+i">
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
                          {{ (confirm.openings ?? '') === '' ? '-' : confirm.openings + '人' }}
                        </span>
                      </div>
                    </div>
                    <div class="conf-item">
                      <div class="employer_shift">
                        <span class="label-name">シフト</span>
                        <span class="conf-result">{{ shiftName || '-' }}</span>
                      </div>
                    </div>
                    <div class="conf-item">
                      <div class="employer_employment_type">
                        <span class="label-name">勤務形態</span>
                        <span class="conf-result">{{ employmentTypeName || '-' }}</span>
                      </div>
                    </div>
                    <div class="conf-item">
                      <div class="employer_merits">
                        <span class="label-name">メリット</span>
                        <span class="conf-result">
                          <template v-if="selectedMeritLabels.length === 0">-</template>
                          <template v-else>
                            <span v-for="(name, i) in selectedMeritLabels" :key="'m'+i">
                              {{ name }}<br v-if="i < selectedMeritLabels.length - 1" />
                            </span>
                          </template>
                        </span>
                      </div>
                    </div>
                    <div class="conf-item">
                      <div class="employer_pr">
                        <span class="label-name">PR 情報</span>
                        <span class="conf-result whitespace-pre-wrap">{{ confirm.pr_info || '-' }}</span>
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
                                <img class="thumb" :src="img.src" alt="">
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
                      <button type="submit" class="btn btn-primary maru" :disabled="saving" @click="saveAndFinish">
                        {{ saving ? '保存中…' : '登録する' }}
                      </button>
                    </div>
                    <div class="form-btn-item">
                      <!-- 休止中から来た場合は下書き保存を非表示 -->
                      <button v-if="!cameFromPaused" type="submit" class="btn maru" :disabled="savingDraft" @click="saveAsDraft">
                        {{ savingDraft ? '保存中…' : '下書き保存' }}
                      </button>
                    </div>
                      <!-- <button type="submit" class="btn maru" :disabled="savingDraft" @click="saveAsDraft">
                        {{ savingDraft ? '保存中…' : '下書き保存' }}
                      </button> -->
                    <!-- </div> -->
                    <div class="form-btn-item">
                      <!-- <button type="submit" class="btn btn-back" @click="confirming=false">修正する</button> -->
                      <button type="submit" class="btn btn-back" @click="backToEdit">修正する</button>
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
// import { ref, onMounted, computed } from 'vue'
// import { ref, onMounted, computed, nextTick } from 'vue'
import { ref, onMounted, computed, nextTick } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'

import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
import FooterNav from '@/components/layout/FooterNav.vue'
import PcModel from '@/components/layout/PcModel.vue'

console.log('%c[JobEditForm] MOUNTED', 'background:#222;color:#0f0;padding:2px 6px', {
  route: window.location.pathname + window.location.search,
  buildStamp: 'JobEditForm.vue: ' + new Date().toISOString()
})

const FUKUSHIMA_PREF_NAME = '福島県'


const router = useRouter()
const route  = useRoute()
const cameFromPaused = computed(() => String(route.query.from || '') === 'paused')

// 編集対象ID（/business/jobs/:id/edit の :id）
const editingId = computed(() => Number(route.params.id))

// 事業者プロフィール保持用
const myBusiness = ref(null)  // { id, business_name, certification_id, ... } が入る想定

// 編集/確認の切替と、確認用データ
const confirming = ref(false)
const confirm = ref({}) // buildConfirmPayload() の結果を入れる
const message = ref('')
const ok = ref(false)
const saving = ref(false)
const savingDraft = ref(false)

// 名前解決のユーティリティ（確認表示用）
const nameById = (list, id) => list.find(v => Number(v.id) === Number(id))?.name || ''
const serviceTypeName   = computed(() => {
  const id = form.value.facility_type_id
  const base = nameById(serviceTypes.value, id)
  return Number(id) === 99 && form.value.service_type_other_text?.trim()
    ? `${base}：${form.value.service_type_other_text.trim()}`
    : base
})
const jobCategoryName   = computed(() => {
  const id = form.value.job_category_id
  const base = nameById(jobCategories.value, id)
  return Number(id) === 99 && form.value.job_position_other_text?.trim()
    ? `${base}：${form.value.job_position_other_text.trim()}`
    : base
})
const educationName     = computed(() => nameById(educations.value, form.value.education_id))
const shiftName         = computed(() => nameById(shifts.value, form.value.shift_id))
const employmentTypeName= computed(() => nameById(employmentTypes.value, form.value.employment_type_id))


// 「その他」選択状態の判定
const isOtherServiceTypeSelected = computed(() => Number(form.value.facility_type_id) === 99)
const isOtherJobPositionSelected = computed(() => Number(form.value.job_category_id) === 99)
const isOtherMeritSelected       = computed(() => (form.value.job_merit || []).includes(99))
const isOtherHolidaySelected     = computed(() => form.value.job_holidays.includes(99)) // ←既存

// 「その他」を選んだ時だけ必須エラーを出すためのトリガー
const triedServiceTypeOther = ref(false)
const triedJobPositionOther = ref(false)
const triedMeritOther       = ref(false)
const triedHolidayOther     = ref(false) // ←既存を流用

// エラーメッセージ表示条件
const showServiceTypeOtherError = computed(() =>
  triedServiceTypeOther.value && isOtherServiceTypeSelected.value && !form.value.service_type_other_text?.trim()
)
const showJobPositionOtherError = computed(() =>
  triedJobPositionOther.value && isOtherJobPositionSelected.value && !form.value.job_position_other_text?.trim()
)
const showMeritOtherError = computed(() =>
  triedMeritOther.value && isOtherMeritSelected.value && !form.value.merit_other_text?.trim()
)
// const showHolidayOtherError = computed(() =>
//   triedHolidayOther.value && isOtherHolidaySelected.value && !form.value.holiday_other_text?.trim()
// )



// サンプル画像
import sample1 from '@/assets/sampleimage01.jpg'
import sample2 from '@/assets/sampleimage02.jpg'
import sample3 from '@/assets/sampleimage03.jpg'
import sample4 from '@/assets/sampleimage04.jpg'

// { path:'/uploads/images/jobs/ID/xxx.jpg', url:'http://.../uploads/images/jobs/ID/xxx.jpg', keep:true }
const existingImages = ref([])

// ユーティリティ群（JS版）
const pick = (obj, ...keys) => {
  for (const k of keys) {
    const v = obj && obj[k]
    if (v !== undefined && v !== null && v !== '') return v
  }
  return ''
}
const toYesNo = (v) => {
  if (v === true || v === 1 || v === '1') return 'yes'
  if (typeof v === 'string' && /^(true|yes|あり)$/i.test(v)) return 'yes'
  return 'no'
}
// const toIdArray = (v) => {
//   if (!v) return []
//   if (Array.isArray(v)) {
//     if (v.length && typeof v[0] === 'object') return v.map(x => Number(x.id)).filter(Number.isFinite)
//     return v.map(x => Number(x)).filter(Number.isFinite)
//   }
//   if (typeof v === 'string') {
//     return v.split(/[^\d]+/).map(n => Number(n)).filter(Number.isFinite)
//   }
//   return []
// }
const extractImageUrls = (it) => {
  const out = []
  if (Array.isArray(it?.images)) {
    it.images.forEach((u) => {
      if (typeof u === 'string') out.push(u)
      else if (u && (u.url || u.file_path || u.path)) out.push(u.url || u.file_path || u.path)
    })
  } else {
    for (let i = 1; i <= 4; i++) {
      const u = it?.[`image_${i}`] || it?.[`image${i}`]
      if (u) out.push(u)
    }
  }
  return out.filter(Boolean)
}


const API = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api' });
API.interceptors.request.use((config) => {
  const t = localStorage.getItem('token');

  // masters への GET は認証ヘッダを付けない（不要なら）
  const url = typeof config.url === 'string' ? config.url : '';
  const isMastersGet = url.startsWith('/masters') && (config.method || 'get').toLowerCase() === 'get';

  if (!isMastersGet) {
    // "null" や "undefined" の文字列、空、JWT っぽくない値は弾く
    const looksJwt = t && t !== 'null' && t !== 'undefined' && t.includes('.');
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

console.debug('[jobRegisterForm API_BASE]', import.meta.env.VITE_API_BASE_URL ?? '/api')

// const router = useRouter()

const form = ref({
  user_id: null,
  facility_id: null,   // ★ 追加：事業者ID（business_profiles.id）
  job_name: '',
  job_kana: '',
  job_pref: '',
  job_city: '',
  job_address1: '',
  job_address2: '',
  job_zipcode: '',
  job_tel: '',
  job_last_name: '',
  job_first_name: '',
  job_last_kana: '',
  job_first_kana: '',
  job_email: '',
  job_contact_tel: '',
  job_title: '',
  // ★ 追加（IDで保持）
  facility_type_id: '',
  job_category_id: '',
  education_id: '',

  // ★ 給与
  base_salary_type: 'hourly',   // 'hourly' | 'monthly'
  base_salary_min: '',          // 文字列で入力 → 送信前に数値化/カンマ除去
  base_salary_max: '',
  treatment_allowance: '',
  raise_available: 'yes',       // 'yes' | 'no'
  bonus_available: 'yes',        // 'yes' | 'no'
  openings: '',            // 募集人数（文字入力→送信前に数値化）
  shift_id: '',            // shifts.id
  employment_type_id: '',   // employment_types.id
  /** ← チェックボックスの v-model（ID配列） */
  job_holidays: [],     // holidays の id[]
  holiday_other_text: '',
  job_insurance: [],     // insurances の id[]
  job_merit: [],        // merits の id[]
  pr_info: '',           // PR 情報（最大500文字）
  // ★ 追加: それぞれの自由記入欄
  service_type_other_text: '',
  job_position_other_text: '',
  merit_other_text: '',
})

const prefectures = ref([])
const merits = ref([])
const holidays = ref([])
const insurances = ref([])
const serviceTypes = ref([])   // 施設形態
const jobCategories = ref([])   // 募集職種
const educations   = ref([])    // 学歴
const shifts = ref([])
const employmentTypes = ref([])

const MAX_IMAGES = 4
const fileInput = ref(null)
const uploadFiles = ref([])        // File[]
const uploadPreviews = ref([])     // objectURL[]
// const stockImages = ref([])        // [{ filename, url }]
// const selectedStock = ref([])      // string[]
const stockImages = ref([
  { id: 'sampleimage01.jpg', url: sample1 },
  { id: 'sampleimage02.jpg', url: sample2 },
  { id: 'sampleimage03.jpg', url: sample3 },
  { id: 'sampleimage04.jpg', url: sample4 },
])
const selectedStock = ref([])


// 数値ID化（空文字と区別）
const toNumOrEmpty = (v) => (v === 0 || Number(v)) ? Number(v) : ''

/** ユーティリティ：ID配列を number[] に正規化 */
const toIds = (arr) =>
  Array.isArray(arr) ? arr.map((x) => Number(x)).filter((n) => Number.isFinite(n)) : []

/** 選択ラベル（確認画面でそのまま表示できます） */
const selectedMeritLabels = computed(() =>
  merits.value
    .filter((m) => form.value.job_merit.includes(Number(m.id)))
    .map((m) =>
      Number(m.id) === 99 && form.value.merit_other_text?.trim()
        ? `${m.name}：${form.value.merit_other_text.trim()}`
        : m.name
    )
)

const selectedHolidayLabels = computed(() =>
  holidays.value
    .filter(h => form.value.job_holidays.includes(h.id))
    .map(h => {
      if (h.id === 99 && form.value.holiday_other_text?.trim()) {
        return `${h.name}：${form.value.holiday_other_text.trim()}`
      }
      return h.name
    })
)

const selectedInsuranceLabels = computed(() =>
  insurances.value
    .filter((w) => form.value.job_insurance.includes(w.id))
    .map((w) => w.name)
)

// ヘルパーを追加
const prefNameFromId = (id) => {
  const p = prefectures.value.find(x => Number(x.id) === Number(id))
  return p?.name || ''
}


onMounted(async () => {
  // 1) 先に user_id を確定
  let uid = null
  try {
    const raw = localStorage.getItem('userId')
    if (raw != null) {
      const n = Number(raw)
      uid = Number.isFinite(n) ? n : (JSON.parse(raw)?.id ?? null)
    }
  } catch (e) {
    // dev のときだけログ（未使用/空ブロックの lint を同時に回避）
    if (import.meta?.env?.DEV) console.debug('[JobEditForm] userId parse failed:', e)
  }
  form.value.user_id = uid

  // 2) マスタ & 事業者プロフィールを並列取得
  const mastersP = Promise.allSettled([
    API.get('/masters/prefectures'),
    API.get('/masters/merits'),
    API.get('/masters/holidays'),
    API.get('/masters/welfare-options'),
    API.get('/masters/service-types'),
    API.get('/masters/job-positions'),
    API.get('/masters/education-levels'),
    API.get('/masters/shifts'),
    API.get('/masters/employment-types')
  ])
  const profileP = uid ? API.get(`/business/profile/${uid}`).catch(() => null) : null

  const [mastersR, profileR] = await Promise.all([mastersP, profileP])

  // 3) マスタ反映
  const takeItems = (r) => (r?.status === 'fulfilled' ? (r.value?.data?.items ?? []) : [])
  const arrayLike = Array.isArray(mastersR?.value) ? mastersR.value : mastersR
  const [p,m,h,i,st,jc,ed,sh,et] = arrayLike
  prefectures.value   = takeItems(p); merits.value = takeItems(m); holidays.value = takeItems(h)
  insurances.value    = takeItems(i); serviceTypes.value = takeItems(st); jobCategories.value = takeItems(jc)
  educations.value    = takeItems(ed); shifts.value = takeItems(sh); employmentTypes.value = takeItems(et)

  // 4) 事業者プロフィールをフォーム初期化（空欄のみ ||= で補完）
  const prof = profileR?.data?.profile
  myBusiness.value = prof || null
  if (prof?.id) {
    form.value.facility_id    = prof.id
    form.value.job_name     ||= prof.business_name || ''
    form.value.job_kana     ||= prof.business_kana || ''
    form.value.job_pref     ||= (prof.prefectures || prof.prefecture_id || '')
    form.value.job_city     ||= prof.city || ''
    form.value.job_address1 ||= prof.address_line1 || ''
    form.value.job_address2 ||= prof.address_line2 || ''
    form.value.job_zipcode  ||= prof.postcode || ''
    form.value.job_tel      ||= prof.phone || ''
  }

  // 5) 最後に既存求人データを読み込み
  if (Number.isFinite(editingId.value) && editingId.value > 0) {
    await loadJobDetail(editingId.value)
  }
 // ---- ここで最終的に「福島県」を強制セット----
 form.value.job_pref = FUKUSHIMA_PREF_NAME
})


// 「その他」を選んだかどうかの判定
// const isOtherHolidaySelected = computed(() => form.value.job_holidays.includes(99))

// 「その他」を選んだ時だけ必須エラーを出すフラグ
// const triedHolidayOther = ref(false)
// const showHolidayOtherError = computed(() =>
//   triedHolidayOther.value && isOtherHolidaySelected.value && !form.value.holiday_other_text?.trim()
// )


function normalizeNumberLike(s) {
  if (s == null || s === '') return null
  const v = String(s)
    .replace(/[,\s]/g, '')
    .replace(/[０-９]/g, d => String('０１２３４５６７８９'.indexOf(d)))
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

const slotsLeft = computed(() => {
  const keptExisting = existingImages.value.filter(x => x.keep).length
  return Math.max(0, MAX_IMAGES - keptExisting - uploadFiles.value.length - selectedStock.value.length)
})

function validateFile(file) {
  const okType = ['image/jpeg', 'image/png'].includes(file.type)
  const okSize = file.size <= 5 * 1024 * 1024
  return okType && okSize
}

function pushFiles(files) {
  for (const f of files) {
    if (!validateFile(f)) continue
    if (slotsLeft.value <= 0) break
    uploadFiles.value.push(f)
    uploadPreviews.value.push(URL.createObjectURL(f))
  }
}

function onChooseFiles(e) {
  const files = Array.from(e.target.files || [])
  pushFiles(files)
  // 連続選択でもonChangeが走るように
  e.target.value = ''
}

function onDrop(e) {
  const files = Array.from(e.dataTransfer.files || [])
  pushFiles(files)
}

function removeUpload(i) {
  const url = uploadPreviews.value[i]

  // blob URL だけ安全に解放（残り0などで undefined の時に備える）
  if (url && typeof url === 'string' && url.startsWith('blob:')) {
    try {
      URL.revokeObjectURL(url)
    } catch (e) {
      // 一部環境で例外が出ても無視（no-empty回避）
      if (import.meta?.env?.DEV) console.debug('[revokeObjectURL] ignored:', e)
    }
  }

  uploadPreviews.value.splice(i, 1)
  uploadFiles.value.splice(i, 1)
}


function isStockDisabled(name) {
  const already = selectedStock.value.includes(name)
  // 既に選択済みなら常に有効、未選択なら残り0枚で無効
  return !already && slotsLeft.value === 0
}

// 通貨表記（カンマ付・空や0は「0円」、null/undefinedは「―」）
const yen = (v) => {
  if (v === null || v === undefined || v === '') return '―'
  const n = Number(String(v).replace(/[^\d.-]/g, ''))
  if (!Number.isFinite(n)) return '―'
  return new Intl.NumberFormat('ja-JP').format(n) + '円'
}

// 県名/ID文字列/数値 いずれでも受け取り、都道府県IDの数値を返す
const resolvePrefectureId = (v) => {
  if (v == null || v === '') return null
  const n = Number(v)
  if (Number.isFinite(n)) return n
  const hit = prefectures.value.find(p => p.name === v || String(p.id) === String(v))
  return hit ? Number(hit.id) : null
}


// 送信用ヘルパ（既存）
async function appendImagesToFormData(fd) {
  uploadFiles.value.forEach(f => fd.append('images[]', f))
  for (const id of selectedStock.value) {
    const item = stockImages.value.find(s => s.id === id)
    if (!item) continue
    const res = await fetch(item.url)
    const blob = await res.blob()
    const ext = id.split('.').pop()?.toLowerCase()
    const type = blob.type || (ext === 'png' ? 'image/png' : 'image/jpeg')
    const file = new File([blob], id, { type })
    fd.append('images[]', file)
  }
}

// 画像（アップロード + サンプル選択）の詳細配列
const confirmImagesDetailed = computed(() => {
  const ups = uploadFiles.value.map((f, i) => ({
    key: 'up-' + i,
    src: uploadPreviews.value[i],
    name: f.name || 'アップロード画像',
    sizeText: f.size ? (Math.round((f.size / 1024) * 10) / 10).toLocaleString() + ' KB' : ''
  }))
  const stocks = selectedStock.value
    .map((id) => {
      const item = stockImages.value.find(s => s.id === id)
      return item ? { key: 'st-' + id, src: item.url, name: id, sizeText: '' } : null
    })
    .filter(Boolean)
    const ex = existingImages.value
    .filter(x => x.keep)
    .map((o, i) => ({
      key: 'ex-' + i, src: o.url, name: (o.path || o.url).split('/').pop() || '既存画像', sizeText: ''
    }))
  return [...ups, ...stocks, ...ex].slice(0, MAX_IMAGES)
})



/** 確認画面へ渡すデータを整形
 *  - *_ids は API へそのまま送れる配列（数値）
 *  - *_labels は確認画面表示用（任意）
 */
const buildConfirmPayload = () => {
  const copy = JSON.parse(JSON.stringify(form.value))
  const merit_ids          = toIds(copy.job_merit)
  const holiday_ids        = toIds(copy.job_holidays)
  const welfare_option_ids = toIds(copy.job_insurance)

  copy.openings = normalizeNumberLike(copy.openings)
  if (typeof copy.pr_info === 'string') copy.pr_info = copy.pr_info.trim().slice(0, 500)

  return {
    ...copy,
    merit_ids,
    holiday_ids,
    welfare_option_ids,
    // ★ 追加（確認画面や送信用に残す）
    holiday_other_text: copy.holiday_other_text ?? '',
    // 表示用ラベル
    merit_labels: selectedMeritLabels.value,
    holiday_labels: selectedHolidayLabels.value,
    insurance_labels: selectedInsuranceLabels.value
  }
}


const startConfirm = () => {
  message.value = ''

  // まず各「その他」系のトリガーを ON
  triedServiceTypeOther.value = true
  triedJobPositionOther.value = true
  triedMeritOther.value       = true
  triedHolidayOther.value     = true

  // 未入力のターゲットを順番に判定（最初に見つかった場所へスクロール＆フォーカス）
  const lacks = []

  if (isOtherServiceTypeSelected.value && !form.value.service_type_other_text?.trim()) {
    lacks.push({ id: 'service-type-other-input', label: '施設形態の「その他（自由記入）」' })
  }
  if (isOtherJobPositionSelected.value && !form.value.job_position_other_text?.trim()) {
    lacks.push({ id: 'job-position-other-input', label: '募集職種の「その他（自由記入）」' })
  }
  if (isOtherMeritSelected.value && !form.value.merit_other_text?.trim()) {
    lacks.push({ id: 'merit-other-input', label: 'メリットの「その他（自由記入）」' })
  }
  if (isOtherHolidaySelected.value && !form.value.holiday_other_text?.trim()) {
    lacks.push({ id: 'holiday-other-input', label: '休日の「その他（自由記入）」' })
  }

  if (lacks.length) {
    const first = lacks[0]
    nextTick(() => {
      const el = document.getElementById(first.id)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el?.focus()
    })
    message.value = `${lacks.map(x => x.label).join('、')} を入力してください。`
    ok.value = false
    return // ← 確認画面へ遷移しない
  }

  // すべてOK → 確認ペイロード作成＆画面遷移
  confirm.value = buildConfirmPayload()
  confirming.value = true

  nextTick(() => {
    const topEl = document.querySelector('.l-sec.mypage-detail') || document.body
    topEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
}

const backToEdit = () => {
  // 確認画面 → 編集フォームへ戻す
  confirming.value = false
  message.value = ''   // （任意）メッセージ消す
  ok.value = false

  nextTick(() => {
    // 画面先頭へ
    const sec = document.querySelector('.l-sec.mypage-detail') || document.body
    sec.scrollIntoView({ behavior: 'smooth', block: 'start' })
    // （任意）最初の入力にフォーカス
    const firstInput = document.querySelector('form input, form select, form textarea')
    if (firstInput instanceof HTMLElement) firstInput.focus()
  })
}


const saveAndFinish = async () => {
  saving.value = true
  message.value = ''
  ok.value = false
  try {
    if (!Number.isFinite(editingId.value) || editingId.value <= 0) {
      throw new Error('編集IDが取得できませんでした')
    }

    const data = await submitUpdate(editingId.value)


    // ★休止中一覧から来ていたら、編集後も休止を維持
    if (cameFromPaused.value) {
      try {
        await API.patch(`/jobs/${editingId.value}/pause`, {
          value: 1,
          user_id: form.value.user_id || 0
        })
      } catch (e) {
        console.warn('[keep paused] failed but continue', e)
      }
    }

    ok.value = true
    message.value = '保存しました。'

    if (data && data.success) {
      router.replace({ name: 'JobEditComplete', query: { id: editingId.value } })
    } else {
      message.value = '保存は完了しましたが、完了画面へ遷移できませんでした。'
    }
  } catch (e) {
    ok.value = false
    message.value =
      (e && e.response && e.response.data && e.response.data.error) ||
      (e && e.message) ||
      '保存に失敗しました。'
  } finally {
    saving.value = false
  }
}

 // ==== 画像URLを絶対化（画像配信用の明示オリジンを最優先） ====
 const FILE_ORIGIN = (() => {
   const base =
     import.meta.env.VITE_FILE_BASE_URL       // ★ 画像配信用（推奨）
     || import.meta.env.VITE_IMG_BASE_URL     // 互換
     || import.meta.env.VITE_API_BASE_URL     // 絶対URLならOK
     || ''
   if (base && /^https?:\/\//i.test(base)) {
     try { return new URL(base).origin } catch { /* fallthrough */ }
   }
   return '' // 相対しか無い場合は空（=後段で相対のまま返す）
 })()

// APIから来る image_1 が「31/xxx.jpg」「jobs/31/xxx.jpg」「/upload/jobs/31/xxx.jpg」…どれでもOKにする
 const toImgUrl = (p) => {
   if (!p) return ''
   let s = String(p).trim()

   // 1) すでに絶対URLなら、そのまま or 誤オリジンなら画像オリジンに付け替え
   if (/^https?:\/\//i.test(s)) {
     try {
       const u = new URL(s)
       // dev で 5173 などアプリ側オリジンを指していたら /upload/* だけ付け替える
       if (FILE_ORIGIN && u.origin !== FILE_ORIGIN && u.pathname.startsWith('/upload/')) {
         return FILE_ORIGIN + u.pathname
       }
       return s
     } catch { /* fallthrough */ }
   }

   // 2) 先頭スラッシュ有りの /upload/* はそのままオリジン前置
   if (s.startsWith('/upload/')) {
     return FILE_ORIGIN ? (FILE_ORIGIN + s) : s
   }
   if (s.startsWith('/uploads/')) {
     const path = s.replace(/^\/+/, '')
     return FILE_ORIGIN ? (FILE_ORIGIN + '/' + path) : ('/' + path)
   }

   // 3) よくある相対パスを /upload/jobs/* に正規化
   s = s.replace(/^\/+/, '')
        .replace(/^images?\//i, '')
        .replace(/^uploads?\/(images?\/)?/i, '')
        .replace(/^jobs?\//i, 'jobs/')
   if (!s.startsWith('jobs/')) s = 'jobs/' + s
   const path = '/upload/' + s
   return FILE_ORIGIN ? (FILE_ORIGIN + path) : path
 }


/** 下書き保存（post_status=draft） */
const saveAsDraft = async () => {
  // 休止中からの編集ではドラフト保存を許可しない（保険）
  if (cameFromPaused.value) {
    message.value = '休止中からの編集では「下書き保存」はできません。';
    ok.value = false;
    return;
  }
  savingDraft.value = true
  message.value = ''
  ok.value = false
  try {
    if (!Number.isFinite(editingId.value) || editingId.value <= 0) {
      throw new Error('編集IDが取得できませんでした')
    }
    await submitUpdateWithStatus(editingId.value, 'draft')

    // ★休止中からの編集なら休止維持（保険）
    if (cameFromPaused.value) {
      try {
        await API.patch(`/jobs/${editingId.value}/pause`, {
          value: 1,
          user_id: form.value.user_id || 0
        })
      } catch (e) {
        console.warn('[keep paused after draft] failed but continue', e)
      }
    }

    ok.value = true
    message.value = '下書きとして保存しました。'
    router.replace({ name: 'JobEditComplete', query: { id: editingId.value } })
  } catch (e) {
    ok.value = false
    message.value =
      (e && e.response && e.response.data && e.response.data.error) ||
      (e && e.message) ||
      '下書き保存に失敗しました。'
  } finally {
    savingDraft.value = false
  }
}

/** post_status を指定して更新（published / draft） */
async function submitUpdateWithStatus(id, status /* 'published' | 'draft' */) {
  const fd = new FormData()
  fillFormData(fd, { postStatus: status })
  await appendImagesToFormData(fd)
  const keep = existingImages.value
    .filter(x => x.keep && x.path)
    .map(x => x.path)
  fd.append('keep_images', JSON.stringify(keep))

  // デバッグ出力（任意）
  console.log('--- [UPDATE '+status+'] FormData start (id=' + id + ') ---')
  for (const [k, v] of fd.entries()) {
    if (v instanceof File) console.log(k, `(File) name=${v.name}, size=${v.size}, type=${v.type}`)
    else console.log(k, String(v))
  }
  console.log('--- [UPDATE '+status+'] FormData end ---')

  const { data } = await API.post(`/business/job/${id}/update`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return data
}


// マスタ（name→id）でID配列に直す
const idsByNames = (names, master) => {
  const map = new Map(master.map(x => [x.name, Number(x.id)]))
  return names.map(n => map.get(n)).filter(Number.isFinite)
}

const pickOther = (s) => {
  const m = String(s || '').match(/^その他[:：]\s*(.+)$/)
  return m ? m[1].trim() : ''
}
const getIds = (v) => Array.isArray(v) ? v.map(n => Number(n)).filter(Number.isFinite) : []
// const toIntCsv = (s) => String(s || '').split(/[^\d]+/).map(n => Number(n)).filter(Number.isFinite)

// 送信用フィールド詰め（登録ページと同じ内容）
/** 全フィールドを FormData に詰める共通関数 */
function fillFormData(fd, { postStatus = 'published' } = {}) {
if (Number(form.value.facility_type_id) === 99) {
   fd.append('service_type_other_text', (form.value.service_type_other_text || '').slice(0, 100))
}
if (Number(form.value.job_category_id) === 99) {
  fd.append('job_position_other_text', (form.value.job_position_other_text || '').slice(0, 100))
}
if ((form.value.job_merit || []).includes(99)) {
  fd.append('merit_other_text', (form.value.merit_other_text || '').slice(0, 100))
}
  // --- 基本項目
  fd.append('title', form.value.job_title ?? '')
  fd.append('service_type_id', String(form.value.facility_type_id ?? ''))
  fd.append('employment_type_id', String(form.value.employment_type_id ?? ''))
  fd.append('shift_id', String(form.value.shift_id ?? ''))
  fd.append('number_of_positions', String(form.value.openings ?? ''))
  fd.append('base_salary_type', form.value.base_salary_type ?? '')
  fd.append('base_salary_min', String(form.value.base_salary_min ?? ''))
  fd.append('base_salary_max', String(form.value.base_salary_max ?? ''))
  fd.append('improvement_allowance', String(form.value.treatment_allowance ?? ''))
  fd.append('has_salary_raise', form.value.raise_available === 'yes' ? '1' : '0')
  fd.append('has_bonus', form.value.bonus_available === 'yes' ? '1' : '0')
  fd.append('pr_message', form.value.pr_info ?? '')
  fd.append('user_id', String(form.value.user_id ?? ''))
  fd.append('post_status', postStatus)

  // --- 施設スナップショット
  fd.append('facility_name', form.value.job_name ?? '')
  fd.append('facility_name_kana', form.value.job_kana ?? '')
  fd.append('prefecture_id', String(resolvePrefectureId(form.value.job_pref) ?? ''))
  fd.append('city', form.value.job_city ?? '')
  fd.append('address_line1', form.value.job_address1 ?? '')
  fd.append('address_line2', form.value.job_address2 ?? '')
  fd.append('postal_code', (form.value.job_zipcode || '').replace(/-/g, ''))
  fd.append('phone', (form.value.job_tel || '').replace(/[^\d]/g, ''))

  // --- 採用担当スナップショット
  fd.append('contact_last_name',  form.value.job_last_name  ?? '')
  fd.append('contact_first_name', form.value.job_first_name ?? '')
  fd.append('contact_last_kana',  form.value.job_last_kana  ?? '')
  fd.append('contact_first_kana', form.value.job_first_kana ?? '')
  fd.append('contact_email',      form.value.job_email      ?? '')
  fd.append('contact_phone',      (form.value.job_contact_tel || '').replace(/[^\d]/g, ''))

  // --- 応募要項（マスタID）
  fd.append('job_position_id',    String(form.value.job_category_id ?? ''))
  fd.append('education_level_id', String(form.value.education_id ?? ''))

  // --- 任意: 公開日
  if (form.value.published_date) {
    fd.append('published_date', form.value.published_date)
  }

  // --- チェックボックス配列
  ;(form.value.job_merit || []).forEach(id => fd.append('merit_ids[]', String(id)))
  ;(form.value.job_holidays || []).forEach(id => fd.append('holiday_ids[]', String(id)))
  ;(form.value.job_insurance || []).forEach(id => fd.append('welfare_option_ids[]', String(id)))

  // 「休日：その他」選択時の自由記入
  if ((form.value.job_holidays || []).includes(99)) {
    fd.append('holiday_other_text', (form.value.holiday_other_text || '').slice(0, 100))
  }

  // 事業者ID
  fd.append('facility_id', String(form.value.facility_id ?? ''))
}

/** 更新 */
async function submitUpdate(id) {
  const fd = new FormData()
  fillFormData(fd)                // ← ここで必ず呼ぶ
  await appendImagesToFormData(fd)
  // 既存画像の保持リスト（チェックONのみ送る）
  const keep = existingImages.value
    .filter(x => x.keep && x.path)
    .map(x => x.path)
  fd.append('keep_images', JSON.stringify(keep))

  // ← 送信直前：FormDataの中身をそのまま出力
  console.log('--- [UPDATE] FormData start (id=' + id + ') ---')
  for (const [k, v] of fd.entries()) {
    if (v instanceof File) {
      console.log(k, `(File) name=${v.name}, size=${v.size}, type=${v.type}`)
    } else {
      console.log(k, String(v))
    }
  }
  console.log('--- [UPDATE] FormData end ---')


  const { data } = await API.post(`/business/job/${id}/update`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return data
}


/** 既存求人の詳細を読み込み → フォームへ反映 */
async function loadJobDetail(id) {
  // const { data } = await API.get(`/jobs/${id}`, { params: { user_id: form.value.user_id || 0 } })
  const { data } = await API.get(`/jobs/${id}`, { params: { user_id: form.value.user_id || 0, owner_only: 1 }
  })
  const it = data?.item || {}
  console.log('[jobs/:id item]', it)
  // 施設
  form.value.job_name      = pick(it, 'facility_name', 'job_name')
  form.value.job_kana      = pick(it, 'facility_name_kana', 'job_kana')
  form.value.job_pref      = pick(it, 'prefecture_name', 'prefecture', 'job_pref') || prefNameFromId(it.prefecture_id)
  form.value.job_city      = pick(it, 'city', 'job_city')
  form.value.job_address1  = pick(it, 'address_line1', 'job_address1')
  form.value.job_address2  = pick(it, 'address_line2', 'job_address2')
  form.value.job_zipcode   = String(it.postal_code ?? it.postcode ?? it.zip ?? it.zipcode ?? it.job_zipcode ?? '')
  form.value.job_tel       = String(it.phone ?? it.tel ?? it.facility_phone ?? it.job_tel ?? '')

  // 担当者
  form.value.job_last_name   = pick(it, 'contact_last_name',  'job_last_name')
  form.value.job_first_name  = pick(it, 'contact_first_name', 'job_first_name')
  form.value.job_last_kana   = pick(it, 'contact_last_kana',  'contact_last_name_kana',  'job_last_kana')
  form.value.job_first_kana  = pick(it, 'contact_first_kana', 'contact_first_name_kana', 'job_first_kana')
  form.value.job_email       = pick(it, 'contact_email',      'job_email')
  form.value.job_contact_tel = pick(it, 'contact_phone',      'job_contact_tel')

  // 応募
  form.value.job_title           = pick(it, 'title', 'job_title')
  form.value.facility_type_id    = pick(it, 'service_type_id', 'facility_type_id')
  form.value.job_category_id     = pick(it, 'job_position_id', 'job_category_id')
  form.value.education_id        = pick(it, 'education_level_id', 'education_id')
  form.value.base_salary_type    = pick(it, 'base_salary_type') || 'hourly'
  form.value.base_salary_min     = it.base_salary_min ?? ''
  form.value.base_salary_max     = it.base_salary_max ?? ''
  form.value.treatment_allowance = it.treatment_allowance ?? ''
  form.value.raise_available     = toYesNo(pick(it, 'has_salary_raise', 'raise_available', 'raise', 'raise_text'))
  form.value.bonus_available     = toYesNo(pick(it, 'has_bonus',        'bonus_available', 'bonus', 'bonus_text'))
  form.value.openings            = pick(it, 'number_of_positions', 'headcount', 'openings')
  form.value.pr_info             = pick(it, 'pr_message', 'description', 'pr_info')

  // form.value.shift_id            = toNumOrEmpty(pick(it, 'shift_id', 'shift'))
 {
   const shiftName = pick(it, 'shift_text', 'shift_name')
   const sh = shifts.value.find(s => s.name === shiftName)
   form.value.shift_id = (sh && sh.id) ? sh.id : ''
 }
  form.value.employment_type_id  = toNumOrEmpty(pick(it, 'employment_type_id', 'employment_type'))

/** 休日（ID配列＋その他） */
{
  let ids = []
  if (Array.isArray(it.holidays)) {
    ids = it.holidays.map(h => Number(h.holiday_id)).filter(Number.isFinite)
    const otherRow = it.holidays.find(h => Number(h.holiday_id) === 99 && h.other_text)
    form.value.holiday_other_text = otherRow?.other_text || ''
  } else {
    if (Array.isArray(it.holiday_ids)) ids = it.holiday_ids.map(Number).filter(Number.isFinite)
    if (!ids.length) {
      const names = (it.holidays_text || it.holiday_names_csv || '').split(/[,\s、/・]+/).filter(Boolean)
      ids = idsByNames(names, holidays.value)
    }
    form.value.holiday_other_text = it.holiday_other_text || pickOther(it.holidays_text) || ''
  }
  form.value.job_holidays = ids
}

/** 保険加入 */
{
  let ids = []
  if (Array.isArray(it.welfare_option_ids)) ids = it.welfare_option_ids.map(Number).filter(Number.isFinite)
  if (!ids.length) {
    const names = (it.insurance_text || it.welfare_option_names_csv || '').split(/[,\s、/・]+/).filter(Boolean)
    ids = idsByNames(names, insurances.value)
  }
  form.value.job_insurance = ids
}

/** メリット（ID配列＋その他） */
{
  // 1) 数値IDが来ていればそれを最優先
  let ids = Array.isArray(it.merit_ids) && it.merit_ids.length
    ? it.merit_ids.map(Number).filter(Number.isFinite)
    : []

  // 2) 無ければ文字列配列やCSVから解決
  if (!ids.length) {
    if (Array.isArray(it.merits)) {
      ids = idsByNames(it.merits, merits.value)
    } else {
      const names = (it.merit_names || it.merits || it.merit_names_csv || '')
        .split(/[,\s、/・]+/).filter(Boolean)
      ids = idsByNames(names, merits.value)
    }
  }
  form.value.job_merit = ids

  // 3) その他テキスト
  if (ids.includes(99)) {
    const fromArray = Array.isArray(it.merits)
      ? it.merits.map(pickOther).find(Boolean)
      : ''
    form.value.merit_other_text =
      fromArray || it.merit_other_text || pickOther(it.merit_names_csv) || ''
  } else {
    form.value.merit_other_text = ''
  }
}

/** 施設形態（中間テーブル優先）＋その他 */
{
  const arr = getIds(it.service_type_ids)
  const fallback = toNumOrEmpty(pick(it, 'service_type_id', 'facility_type_id'))
  form.value.facility_type_id = arr[0] ?? fallback ?? ''
  if ((arr.includes(99) || Number(form.value.facility_type_id) === 99)) {
    form.value.service_type_other_text = it.service_type_other_text || ''
  }
}

/** 募集職種（中間テーブル優先）＋その他 */
{
  const arr = getIds(it.job_position_ids)
  const fallback = toNumOrEmpty(pick(it, 'job_position_id', 'job_category_id'))
  form.value.job_category_id = arr[0] ?? fallback ?? ''
  if ((arr.includes(99) || Number(form.value.job_category_id) === 99)) {
    form.value.job_position_other_text = it.position_other_text
      || it.job_position_other_text
      || ''
  }
}


// 既存画像（path と url の両方を保持）
{
  const raw = Array.isArray(it.images) ? it.images : extractImageUrls(it)
  const mapped = raw.map((u) => {
    const url = toImgUrl(u)
    let path = ''
    const s = String(u || '').trim()
    if (s.startsWith('/')) {
      // すでに /upload/... や /uploads/... の相対パス
      path = s
    } else {
      try {
        // どのオリジンでも pathname だけを採用（/upload/... を得たい）
        const uo = new URL(url, window.location.origin)
        path = uo.pathname
      } catch {
        // フォールバック: jobs/xx/xxx.jpg → /upload/jobs/xx/xxx.jpg に寄せる
        let t = s.replace(/^\/+/, '')
        t = t
          .replace(/^uploads?\//i, '')
          .replace(/^images?\//i, '')
          .replace(/^jobs?\//i, 'jobs/')
        path = t ? `/upload/${t}` : ''
      }
    }
    return { url, path, keep: true }
  })
  existingImages.value = mapped.slice(0, MAX_IMAGES)
}
  console.log('画像：',existingImages.value )
}

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
  box-shadow: 0 1px 0 rgba(0,0,0,.03) inset;
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
  font-size: .95rem;
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
.img-name { font-size: .95rem; }
.img-size { color: #888; font-size: .85rem; }

.confirm-cta {
  text-align: center;
  font-weight: 600;
  margin: 22px 0 10px;
}

/* 大きめボタン（デザイナーのクラスを拡張） */
/* .btn.big {
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
} */

/* 任意の補助スタイル */
.other-input .input {
  border: 2px solid #ccc;
  background-color: #fff;
  padding: 0.7em;
  border-radius: 5px;
}

/* 改行をそのまま表示（連続スペースも保持） */
.whitespace-pre-wrap {
  white-space: pre-wrap;
  word-break: break-word; /* 長い単語対策（任意） */
}

</style>
