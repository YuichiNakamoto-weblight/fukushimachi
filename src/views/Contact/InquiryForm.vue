<!-- src/views/Contact/InquiryForm.vue -->
<template>
    <body class="contact is-guest">
        <div class="wrap">
            <AppHeader />
            <HamburgerMenu />
            <FooterNav />

            <div class="content">
                <main>
                    <section class="l-sec contact-detail">
                        <div class="page-title maru">お問い合わせフォーム</div>
                        <div class="inner ontact-lead">
                            <div class="btn-base user">
                            <RouterLink :to="{ name: 'SeekerContact' }">求職者の方はこちら</RouterLink>
                            </div>
                            <div class="btn-base employer">
                             <RouterLink :to="{ name: 'BusinessContact' }">介護事業者の方はこちら</RouterLink>
                            </div>
                        </div>
                        <div class="btn-back">
                            <a href="#" onclick="history.back()" return="false;=">
                            <span class="ico">
                                <img src="/src/assets/images/common/ico-back.svg">
                            </span>
                            戻る
                            </a>
                        </div>
                    </section>
                </main>
            </div>
            <AppFooter />
        </div>

        <!-- <div class="body-bg pc">
                <img src="/src/assets/images/common/bg-pc.png">
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
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HamburgerMenu from '@/components/layout/HamburgerMenu.vue'
import FooterNav from '@/components/layout/FooterNav.vue'
import PcModel from '@/components/layout/PcModel.vue'
</script>

<style scoped>

</style>
