<!-- src/components/setting/MailReceiveSettingView.vue（例） -->
<template>
  <div class="wrap signup is-guest signup-setting">
    <!-- 共通ヘッダー -->
    <AppHeader />

    <main>
      <section class="l-sec signup-detail">
        <!-- タイトル -->
        <div class="page-title maru">メールの受信設定</div>

        <!-- 説明 -->
        <div class="inner signup-lead">
          <p>
            アカウント作成後、確認メールをお送りします。受信できない場合、迷惑メールフォルダに
            振り分けられている可能性がございます。
          </p>
          <p>
            【@fukushimachi.com】からのメールを受信できるよう、事前に設定のご確認をお願いいたします。
          </p>
        </div>

        <!-- 戻る（左矢印＋テキスト） -->
        <div class="btn-back">
          <a href="#" @click.prevent="goBack">
            <span class="ico"><img :src="icoBack" alt="" /></span>
            戻る
          </a>
        </div>

        <!-- 下部リンク（必要なら） -->
        <div class="inner" style="margin-top: 40px;">
          <router-link class="btn-mini" to="/privacy">プライバシーポリシー</router-link>
        </div>
      </section>
    </main>

    <!-- 共通フッター -->
    <AppFooter />

  </div>
  <PcModel />
</template>

<script setup>
import { useRouter } from 'vue-router'

/* 画像は必ず import して :src で渡す */
import icoBack from '@/assets/images/common/ico-back.svg'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import PcModel from '@/components/layout/PcModel.vue'

const router = useRouter()
const goBack = () => router.back()
</script>
