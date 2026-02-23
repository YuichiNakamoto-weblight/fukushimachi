<!-- src/views/Auth/WithdrawFormView.vue -->
<!-- 退会理由選択-->
<template>
  <body>
    <div class="wrap">

      <AppHeader />
      <HamburgerMenu />
      <FooterNav />

      <div class="content">
        <main>
          <section class="l-sec signout-detail">

            <div class="page-title maru">退会希望</div>
            <div class="form-wrap">
              <div class="inner">
                <div class="form-items">
                  <div class="form-item">
                    <label for="signout_reason">退会理由</label>
                    <select id="signout_reason" v-model="reason" required>
                      <option value="">選択してください</option>
                      <option>サービスを利用しなくなった</option>
                      <option>事業者とトラブルや不快なやりとりがあった</option>
                      <option>掲載施設の質が良くなかった</option>
                      <option>その他</option>
                    </select>
                  </div>

                  <div class="form-item">
                    <label for="signout_reason-detail">詳しい理由</label>
                    <textarea id="signout_reason-detail" v-model="reasonDetail"></textarea>
                  </div>

                  <div class="checkbox-items consent-wrap">
                    <label for="consent">退会は即時反映され、一度退会すると復活できません。履歴はすべて消去されます。</label>
                    <label class="checkbox-item">
                      <!-- ★ 同意チェックを Vue 状態にバインド -->
                      <input type="checkbox" id="consent" name="consent[]" value="同意する" v-model="agree">
                      同意する
                    </label>
                  </div>

                  <p class="sup">メールアドレスが間違っていたり、ドメイン指定受信をしていると返答が届きませんのでご注意ください。</p>

                  <div class="form-group">
                    <!-- ★ canSubmit に連動して活性/非活性と見た目を制御 -->
                    <button
                      type="submit"
                      id="submitBtn"
                      :class="['btn-submit','maru', { 'is-invalid': !canSubmit }]"
                      :aria-disabled="!canSubmit"
                      :disabled="!canSubmit"
                      @click.prevent="submit"
                    >
                      上記に同意して退会する
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <AppFooter />
    </div>
  </body>

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
    <PcModel />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { http } from '@/api/http'

import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
import FooterNav from '@/components/layout/FooterNav.vue'
import PcModel from '@/components/layout/PcModel.vue'

const reason = ref('')
const reasonDetail = ref('')
const agree = ref(false)
const router = useRouter()

const canSubmit = computed(() => reason.value && agree.value)

const submit = async () => {
  try {
    await http.post('/withdraw', {
      reason: reason.value,
      reason_detail: reasonDetail.value
    })

    localStorage.removeItem('userId')
    localStorage.removeItem('userType')

    router.push({ name: 'WithdrawDone' })
  } catch (err) {
    console.log(err)
    alert('退会処理に失敗しました。')
  }
}
</script>
