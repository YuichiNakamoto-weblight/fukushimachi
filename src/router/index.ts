// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { useAuthLocal } from "@/stores/authLocal";
import { setCanonical, setTitle, setMetaDescription } from "../lib/seo";

// import BusinessEmailVerifyView from '@/views/Auth/BusinessEmailVerifyView.vue'

// 共通の振り分け関数
const gateRedirect = () => {
  const auth = useAuthLocal();
  if (auth.userId == null) auth.restore?.(); // ← 初回でも復元してから判定

  const raw = (auth.userType ?? localStorage.getItem("userType") ?? "")
    .toString()
    .trim()
    .toLowerCase();

  // 表記ゆれ対策：business を employer に寄せる
  const t = raw === "business" ? "employer" : raw;

  if (t === "seeker") return { name: "TopSeeker" };
  if (t === "employer" || t === "admin") return { name: "TopBusiness" };
  return { name: "TopPublic" };
};

// const TopView = () => import('@/views/TopView.vue') // テスト用
const RegisterChoiceView = () => import("@/views/Auth/RegisterChoiceView.vue");
const LoginView = () => import("@/views/Auth/LoginView.vue");
const LogoutView = () => import("@/views/Auth/LogoutView.vue");
const RegisterSeekerView = () => import("@/views/Auth/RegisterSeekerView.vue");
const RegisterFacilityView = () => import("@/views/Auth/RegisterFacilityView.vue");
const SeekerEmailVerifyView = () => import("@/views/Auth/SeekerEmailVerifyView.vue");
const BusinessEmailVerifyView = () => import("@/views/Auth/BusinessEmailVerifyView.vue");
const SeekerProfileView = () => import("@/views/Auth/SeekerProfileView.vue");
const BusinessProfileView = () => import("@/views/Auth/BusinessProfileView.vue");
const BusinessProfileEditView = () => import("@/views/Auth/BusinessProfileEditView.vue");
const BusinessProfileEditComplete = () => import("@/views/Auth/BusinessProfileEditComplete.vue");
const ForgotPasswordView = () => import("@/views/Auth/ForgotPasswordView.vue");
const ResetPasswordView = () => import("@/views/Auth/ResetPasswordView.vue");
const SeekerProfileCompleteView = () => import("@/views/Auth/SeekerProfileCompleteView.vue");
const SeekerProfileEditComplete = () => import("@/views/Auth/SeekerProfileEditComplete.vue");
const BusinessProfileCompleteView = () => import("@/views/Auth/BusinessProfileCompleteView.vue");
const SeekerProfileEditView = () => import("@/views/Auth/SeekerProfileEditView.vue");

// トップ3種類
const TopPublicView = () => import("@/views/public/TopPublic.vue");
const TopSeekerView = () => import("@/views/seekers/TopSeeker.vue");
const TopBusinessView = () => import("@/views/biz/TopBusiness.vue");

// 事業所用求人一覧
const BusinessJobListPage = () => import("@/views/jobs/BusinessJobListPage.vue");
// 事業者用：グッド一覧
const BizGoodsListPage = () => import("@/views/biz/BizGoodsListPage.vue");
const GoodGiverDetail = () => import("@/views/biz/GoodGiverDetail.vue");
// ▼ 事業者用：トーク一覧
const BizTalkListPage = () => import("@/views/biz/BizTalkListPage.vue");

// 求人登録関連
const JobRegisterFormView = () => import("@/views/Jobs/JobRegisterForm.vue");
const JobRegisterComplete = () => import("@/views/Jobs/JobRegisterComplete.vue");
const JobEditFormView = () => import("@/views/jobs/JobEditForm.vue");
const JobEditCompleteView = () => import("@/views/jobs/JobEditComplete.vue");
const JobDraftSaved = () => import("@/views/jobs/JobDraftSaved.vue");

// 求人一覧
const JobListPage = () => import("@/views/jobs/JobListPage.vue");
const JobDetailPage = () => import("@/views/jobs/JobDetailPage.vue");
//施設別求人情報一覧
const FacilityJobsList = () => import("@/views/jobs/FacilityJobsList.vue");

// メール受信設定
const MailReceiveSettingView = () => import("@/views/settings/MailReceiveSettingView.vue");

// マイページ
const SeekerMyPage = () => import("@/views/Auth/SeekerMyPage.vue");
const BusinessMyPage = () => import("@/views/Auth/BusinessMyPage.vue");

// ダッシュボード（雛形）
const SeekerDashboardView = () => import("@/views/Dashboard/SeekerDashboardView.vue");
const FacilityDashboardView = () => import("@/views/Dashboard/FacilityDashboardView.vue");

//　トーク画面
const EmployerTalkView = () => import("@/views/Messages/EmployerTalkView.vue");
const SeekerTalkView = () => import("@/views/Messages/SeekerTalkView.vue");
// 求職者用：トーク一覧
const SeekerTalkListPage = () => import("@/views/Seekers/SeekerTalkListpage.vue");
// 求職者用：グッド一覧
const SeekerGoodsListPage = () => import("@/views/Seekers/SeekerGoodsListPage.vue");
// 求職者用：クリップ一覧
const SeekerClipsListPage = () => import("@/views/Seekers/SeekerClipsListPage.vue");
// 使い方
const howtouseView = () => import("@/views/public/howtouseView.vue");
const seekerhowtouseView = () => import("@/views/Seekers/howtouseView.vue");
const bizhowtouseView = () => import("@/views/biz/howtouseView.vue");

/* ▼ 追加：問い合わせ＆ポリシー */
const InquiryForm = () => import("@/views/Contact/InquiryForm.vue");
const SeekerContactForm = () => import("@/views/Contact/SeekerContactForm.vue");
const BusinessContactForm = () => import("@/views/Contact/BusinessContactForm.vue");
const BusinessContactComplete = () => import("@/views/Contact/BusinessContactComplete.vue");
const SeekerContactComplete = () => import("@/views/Contact/SeekerContactComplete.vue");
const PolicyView = () => import("@/views/PolicyView.vue");

// お知らせ
const AnnouncementCreateView = () => import("@/views/biz/AnnouncementCreateView.vue");
const AnnouncementDetailView = () => import("@/views/news/AnnouncementDetailView.vue");
const AnnouncementListMine = () => import("@/views/biz/AnnouncementListMine.vue");
const AnnouncementListMineEnd = () => import("@/views/biz/AnnouncementListMineEnd.vue");
const AnnouncementEditView = () => import("@/views/biz/AnnouncementEditView.vue");
const NewsListPublicView = () => import("@/views/news/NewsListPublicView.vue");
// 特集一覧
const OfficeTopicsListView = () => import("@/views/news/OfficeTopicsListView.vue");
// 事務局用（特集、事務局から）
const AdminLoginView = () => import("@/views/office/AdminLoginView.vue");
const OfficeAnnouncementCreateView = () => import("@/views/office/AnnouncementCreateView.vue");
// 事務局用：お知らせ（一覧／編集）
const OfficeAnnouncementListView = () => import("@/views/office/OfficeAnnouncementListView.vue");
const OfficeAnnouncementEditView = () => import("@/views/office/OfficeAnnouncementEditView.vue");
const OfficeAnnouncementPreview = () => import("@/views/office/OfficeAnnouncementPreviewView.vue");

// メールアドレス再設定
const AccountSettingView = () => import("@/views/settings/AccountSettingView.vue");
const AccountOtpVerifyView = () => import("@/views/settings/AccountOtpVerifyView.vue");
const AccountChangeEmailInputView = () =>
  import("@/views/settings/AccountChangeEmailInputView.vue");
const AccountChangeEmailCompleteView = () =>
  import("@/views/settings/AccountChangeEmailCompleteView.vue");
// const AccountChangeSent = () => import('@/views/settings/AccountChangeSent.vue')
// const AccountChangeVerifyView = () => import('@/views/settings/AccountChangeVerify.vue')
// const AccountChangeDoneView = () => import('@/views/settings/AccountChangeDone.vue')

// 退会フロー
const WithdrawIntroView = () => import("@/views/Auth/WithdrawIntroView.vue"); // ① 退会手順
const WithdrawFormView = () => import("@/views/Auth/WithdrawFormView.vue"); // ② 退会希望
const WithdrawDoneView = () => import("@/views/Auth/WithdrawDoneView.vue"); // ④ 退会完了

// 通知設定
const SeekerNoticeIndex = () => import("@/views/settings/SeekerNoticeIndex.vue");
const SeekerNoticeEmail = () => import("@/views/settings/SeekerNoticeEmail.vue");
const SeekerNoticePush = () => import("@/views/settings/SeekerNoticePush.vue");

const BizNoticeIndex = () => import("@/views/settings/BizNoticeIndex.vue");
const BizNoticeEmail = () => import("@/views/settings/BizNoticeEmail.vue");
const BizNoticePush = () => import("@/views/settings/BizNoticePush.vue");

// プッシュ通知用ボタン
const PushSettingsView = () => import("@/views/settings/PushSettingsView.vue");

// よくある質問
const FaqPage = () => import("@/views/Contact/FaqPage.vue");

//操作マニュアルリンク集
const ManualPage = () => import("@/views/Contact/ManualPage.vue");

const routes: RouteRecordRaw[] = [
  // TOPページ
  { path: "/", name: "TopGate", redirect: gateRedirect },
  // { path: '/public',   name: 'TopPublic',   component: TopPublicView, beforeEnter: (_to, _from, next) => next(gateRedirect()) },
  {
    path: "/public",
    name: "TopPublic",
    component: TopPublicView,
    meta: {
      title: "トップ",
      description: "福島県の介護求人を探すなら「ふくしまち」。求人検索、特集、最新情報をチェック。",
    },
  },
  {
    path: "/seeker",
    name: "TopSeeker",
    component: TopSeekerView,
    meta: { requiresAuth: true, roles: ["seeker"] },
  },
  {
    path: "/employer",
    name: "TopBusiness",
    component: TopBusinessView,
    meta: { requiresAuth: true, roles: ["employer"] },
  },

  { path: "/register", name: "RegisterChoice", component: RegisterChoiceView },
  { path: "/login", name: "Login", component: LoginView },
  {
    path: "/logout",
    name: "Logout",
    component: LogoutView,
    meta: { public: true },
    alias: ["/auth/logout"],
  },
  { path: "/register/seeker", name: "RegisterSeeker", component: RegisterSeekerView },
  // { path: '/register/facility', name: 'RegisterFacility', component: RegisterFacilityView },
  {
    path: "/register/facility",
    name: "RegisterFacility",
    component: RegisterFacilityView,
    props: { defaultUserType: "employer" },
  },
  { path: "/Seeker/verify", name: "SeekerEmailVerifyView", component: SeekerEmailVerifyView },
  { path: "/business/verify", name: "BusinessEmailVerifyView", component: BusinessEmailVerifyView },
  { path: "/profile/seeker", name: "SeekerProfile", component: SeekerProfileView },
  { path: "/profile/business", name: "BusinessProfile", component: BusinessProfileView },
  {
    path: "/business/profile/edit",
    name: "BusinessProfileEdit",
    component: BusinessProfileEditView,
    meta: { requiresAuth: true },
  },
  {
    path: "/business/edit/complete",
    name: "BusinessProfileEditComplete",
    component: BusinessProfileEditComplete,
  },
  { path: "/forgot-password", name: "ForgotPassword", component: ForgotPasswordView },
  { path: "/reset-password", name: "ResetPassword", component: ResetPasswordView },
  { path: "/seeker/complete", name: "SeekerProfileComplete", component: SeekerProfileCompleteView },
  {
    path: "/seeker/edit/complete",
    name: "SeekerProfileEditComplete",
    component: SeekerProfileEditComplete,
  },
  {
    path: "/business/complete",
    name: "BusinessProfileComplete",
    component: BusinessProfileCompleteView,
  },
  {
    path: "/seeker/profile/edit",
    name: "SeekerProfileEdit",
    component: SeekerProfileEditView,
    meta: { requiresAuth: true },
  },

  // 事業者側求人情報関連
  { path: "/jobs/register", name: "JobRegisterForm", component: JobRegisterFormView },
  { path: "/jobs/register/complete", name: "JobRegisterComplete", component: JobRegisterComplete },
  {
    path: "/jobs",
    name: "Jobs",
    component: JobListPage,
    meta: {
      title: "求人一覧",
      description:
        "福島県の介護求人を一覧で探せます。職種・雇用形態・エリアなどの条件で検索できます。",
    },
  },
  {
    path: "/jobs/:id",
    name: "JobDetail",
    component: JobDetailPage,
    meta: {
      title: "求人詳細",
      description: "求人の仕事内容・給与・休日・施設情報などの詳細を確認できます。",
    },
  },

  {
    path: "/business/jobs/:id/edit",
    name: "JobEditForm",
    component: JobEditFormView,
    meta: { requiresAuth: true },
  },
  {
    path: "/jobs/edit/complete",
    name: "JobEditComplete",
    component: JobEditCompleteView,
    meta: { requiresAuth: true },
  },
  {
    path: "/jobs/draft-saved",
    name: "JobDraftSaved",
    component: JobDraftSaved,
    meta: { requiresAuth: true },
  },

  // ダッシュボード（遷移先用のダミー）
  { path: "/dashboard/seeker", name: "SeekerDashboard", component: SeekerDashboardView },
  { path: "/dashboard/facility", name: "FacilityDashboard", component: FacilityDashboardView },

  // メール受信設定
  {
    path: "/settings/MailReceiveSetting",
    name: "MailReceiveSetting",
    component: MailReceiveSettingView,
  },

  // 求職者向け：自分の一覧
  {
    path: "/jobs/clips",
    name: "MyClips",
    component: SeekerClipsListPage,
    props: { view: "clips" },
    meta: { requiresAuth: true },
  },
  {
    path: "/jobs/goods",
    name: "MyGoods",
    component: SeekerGoodsListPage,
    props: { view: "goods" },
    meta: { requiresAuth: true },
  },
  {
    path: "/jobs/talks",
    name: "MyTalks",
    component: SeekerTalkListPage,
    props: { view: "talks" },
    meta: { requiresAuth: true },
  },

  // 使い方
  {
    path: "/public/howtouse",
    name: "howtouse",
    component: howtouseView,
    meta: {
      title: "使い方",
      description: "ふくしまちの使い方。求人検索、クリップ、グッド、トークの利用方法を案内します。",
    },
  },
  {
    path: "/seeker/howtouse",
    name: "seekerhowtouse",
    component: seekerhowtouseView,
    meta: {
      requiresAuth: true,
      title: "使い方（求職者向け）",
      description: "求職者向けに、求人の検索、トーク機能などの基本的な使い方をまとめています。",
    },
  },
  {
    path: "/biz/howtouse",
    name: "bizhowtouseView",
    component: bizhowtouseView,
    meta: {
      requiresAuth: true,
      title: "使い方（事業者向け）",
      description:
        "事業者向けに、求人の登録・編集、応募者対応、トーク機能などの基本的な使い方をまとめています。",
    },
  },

  // 事業者向け：自分の一覧
  {
    path: "/business/jobs/open",
    name: "BizJobsOpen",
    component: BusinessJobListPage,
    props: { status: "open" },
    meta: { requiresAuth: true },
  },
  {
    path: "/business/jobs/paused",
    name: "BizJobsPaused",
    component: BusinessJobListPage,
    props: { status: "paused" },
    meta: { requiresAuth: true },
  },
  {
    path: "/business/jobs/closed",
    name: "BizJobsClosed",
    component: BusinessJobListPage,
    props: { status: "closed" },
    meta: { requiresAuth: true },
  },
  {
    path: "/business/jobs/draft",
    name: "BizJobsDraft",
    component: BusinessJobListPage,
    props: { status: "draft" },
    meta: { requiresAuth: true },
  },
  //施設別求人情報一覧
  {
    path: "/facility-jobs/:userId?",
    name: "FacilityJobs",
    component: FacilityJobsList,
    props: true,
  },

  // 事業者向け：グッド受信一覧
  {
    path: "/biz/goods",
    name: "BizGoodsList",
    component: BizGoodsListPage,
    meta: { requiresAuth: true },
  },
  {
    path: "/biz/goods/:jobId/giver/:seekerUserId",
    name: "GoodGiverDetail",
    component: GoodGiverDetail,
    props: true,
  },

  // 事業者向け：トーク一覧
  {
    path: "/biz/talks",
    name: "BizTalkList",
    component: BizTalkListPage,
    meta: { requiresAuth: true },
    alias: ["/business/talks"],
  },

  // マイページ
  { path: "/seeker/MyPage", name: "SeekerMyPage", component: SeekerMyPage },
  {
    path: "/business/mypage",
    name: "BusinessMyPage",
    component: BusinessMyPage,
    meta: { requiresAuth: true },
  },

  /** トーク（スレッド単体表示） */
  {
    path: "/employer/talk/:threadId(\\d+)",
    name: "EmployerTalk",
    component: EmployerTalkView,
    meta: { requiresAuth: true },
    props: (route) => ({ threadId: Number(route.params.threadId) }),
  },
  {
    path: "/seeker/talk/:threadId(\\d+)",
    name: "SeekerTalk",
    component: SeekerTalkView,
    meta: { requiresAuth: true },
    props: (route) => ({ threadId: Number(route.params.threadId) }),
  },

  /* 問い合わせフォーム（ログイン必須の要件なので requiresAuth:true） */
  // { path: '/contact', name: 'InquiryForm', component: InquiryForm },
  // { path: '/contact/seeker',   name: 'SeekerContact',   component: SeekerContactForm,   meta: { requiresAuth: true } },
  // { path: '/contact/employer', name: 'BusinessContact', component: BusinessContactForm, meta: { requiresAuth: true } },
  // { path: '/contact/employer/complete', name: 'BusinessContactComplete',  component: BusinessContactComplete, meta: { requiresAuth: true } },
  // { path: '/contact/seeker/complete', name: 'SeekerContactComplete', component: SeekerContactComplete, meta: { requiresAuth: true } },

  /* 問い合わせフォーム（ログイン不要にする） */
  {
    path: "/contact",
    name: "InquiryForm",
    component: InquiryForm,
    meta: { title: "お問い合わせ", description: "ふくしまちへのお問い合わせフォームです。" },
  },
  {
    path: "/contact/seeker",
    name: "SeekerContact",
    component: SeekerContactForm,
    meta: {
      title: "お問い合わせ（求職者）",
      description: "求職者向けのお問い合わせフォームです。",
    },
  },
  {
    path: "/contact/employer",
    name: "BusinessContact",
    component: BusinessContactForm,
    meta: {
      title: "お問い合わせ（事業者）",
      description: "事業者向けのお問い合わせフォームです。",
    },
  },
  {
    path: "/contact/employer/complete",
    name: "BusinessContactComplete",
    component: BusinessContactComplete,
    meta: { title: "お問い合わせ完了（事業者）", description: "お問い合わせを受け付けました。" },
  },
  {
    path: "/contact/seeker/complete",
    name: "SeekerContactComplete",
    component: SeekerContactComplete,
    meta: { title: "お問い合わせ完了（求職者）", description: "お問い合わせを受け付けました。" },
  },

  //お知らせ// 事業者/運営のみ
  {
    path: "/biz/announcements/new",
    name: "AnnouncementCreate",
    component: AnnouncementCreateView,
    meta: { requiresAuth: true, roles: ["employer"] },
  },
  {
    path: "/news/:id(\\d+)",
    name: "AnnouncementDetail",
    component: AnnouncementDetailView,
    meta: { title: "お知らせ詳細", description: "お知らせの詳細ページです。" },
  },
  {
    path: "/business/announcements",
    name: "AnnouncementListMine",
    component: AnnouncementListMine,
    meta: { requiresAuth: true },
  },
  {
    path: "/business/announcements/End",
    name: "AnnouncementListMineEnd",
    component: AnnouncementListMineEnd,
    meta: { requiresAuth: true },
  },
  {
    path: "/business/announcements/:id/edit",
    name: "AnnouncementEdit",
    component: AnnouncementEditView,
    meta: { requiresAuth: true },
    props: (route) => ({ id: Number(route.params.id) }),
  },
  {
    path: "/news",
    name: "NewsPublic",
    component: NewsListPublicView,
    meta: {
      title: "お知らせ",
      description: "ふくしまちからのお知らせ一覧。新着情報、特集、運営からのご案内を掲載します。",
    },
  },
  {
    path: "/news/office",
    name: "OfficeTopics",
    component: OfficeTopicsListView,
    meta: { title: "特集", description: "介護の仕事探しに役立つ特集記事を掲載しています。" },
  },

  // { path: '/office', name: 'AdminLoginView', component: AdminLoginView,},
  // 事務局用：/office は一覧へ（ログインページは使わない）
  { path: "/office", redirect: { name: "OfficeAnnouncementList" } },
  {
    path: "/officeCreate",
    name: "OfficeAnnouncementCreateView",
    component: OfficeAnnouncementCreateView,
  },
  // 事務局用（特集・事務局から：カテゴリ3/4）
  {
    path: "/office/announcements",
    name: "OfficeAnnouncementList",
    component: OfficeAnnouncementListView,
    meta: { requiresAuth: true },
  },
  {
    path: "/office/announcements/new",
    name: "OfficeAnnouncementCreate",
    component: OfficeAnnouncementCreateView,
    alias: ["/officeCreate"],
    meta: { requiresAuth: true },
  },
  {
    path: "/office/announcements/:id(\\d+)/edit",
    name: "OfficeAnnouncementEdit",
    component: OfficeAnnouncementEditView,
    props: (route) => ({ id: Number(route.params.id) }),
    meta: { requiresAuth: true },
  },
  {
    path: "/office/announcements/preview/:id",
    name: "OfficeAnnouncementPreview",
    component: OfficeAnnouncementPreview,
    meta: { requiresAuth: true },
  },

  // ▼ アカウント変更（メール・パスワード再設定）
  { path: "/account-Setting", name: "AccountSettingView", component: AccountSettingView },
  { path: "/account-change/verify", name: "AccountOtpVerify", component: AccountOtpVerifyView },
  {
    path: "/account-change/email",
    name: "AccountChangeEmailInput",
    component: AccountChangeEmailInputView,
  },
  {
    path: "/account-change/email/complete",
    name: "AccountChangeEmailComplete",
    component: AccountChangeEmailCompleteView,
  },
  // { path: '/account-change', name: 'AccountChangeSent', component: AccountChangeSent },
  // { path: '/account-change/verify', name: 'AccountChangeVerify', component: AccountChangeVerifyView },
  // { path: '/account-change/done', name: 'AccountChangeDone', component: AccountChangeDoneView },

  // ▼ 退会フロー
  // { path: '/withdraw', redirect: { name: 'WithdrawIntro' } },

  // 退会
  {
    path: "/withdraw/intro",
    name: "WithdrawIntro",
    component: WithdrawIntroView,
    meta: { requiresAuth: true },
  },
  {
    path: "/withdraw/form",
    name: "WithdrawForm",
    component: WithdrawFormView,
    meta: { requiresAuth: true },
  },
  {
    path: "/withdraw/done",
    name: "WithdrawDone",
    component: WithdrawDoneView,
    meta: { public: true },
    alias: ["/withdraw/complete"],
  },

  /* ▼ 追加：/policy の警告回避用。別名でも来る場合に備えて alias も付与 */
  {
    path: "/policy",
    name: "Policy",
    component: PolicyView,
    alias: ["/privacy", "/privacy-policy"],
  },

  // 通知設定
  { path: "/settings/notice", name: "SeekerNoticeIndex", component: SeekerNoticeIndex },
  { path: "/settings/email", name: "SeekerNoticeEmail", component: SeekerNoticeEmail },
  { path: "/settings/notice/push", name: "SeekerNoticePush", component: SeekerNoticePush },

  { path: "/biz/settings/notice", name: "BizNoticeIndex", component: BizNoticeIndex },
  { path: "/biz/settings/notice/email", name: "BizNoticeEmail", component: BizNoticeEmail },
  { path: "/biz/settings/notice/push", name: "BizNoticePush", component: BizNoticePush },

  // プッシュ通知用ボタン（テスト用）
  {
    path: "/settings/push",
    name: "PushSettings",
    component: PushSettingsView,
    meta: { requiresAuth: true },
  },

  // よくある質問
  {
    path: "/faq",
    name: "Faq",
    component: FaqPage,
    meta: {
      title: "よくある質問",
      description: "ふくしまちの使い方やよくある質問をまとめました。",
    },
  },

  //操作マニュアルリンク集
  {
    path: "/manuals",
    name: "manuals",
    component: ManualPage,
    meta: {
      title: "操作マニュアル",
      description:
        "新規登録、求人情報、ログイン、マイページなどの使い方マニュアルをダウンロードできます。",
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0, left: 0 }),
});

const SITE_NAME = "ふくしまち 介護求人・転職支援";
const DEFAULT_TITLE = SITE_NAME;
const DEFAULT_DESC = "福島県の介護の就職・転職情報サイト「ふくしまち」。";

router.afterEach((to) => {
  const origin = window.location.origin;

  // canonical（基本はパスだけ）
  const canonicalPath = (to.meta as any)?.canonical || to.path;
  setCanonical(origin + canonicalPath);

  // title（metaが無ければデフォルト）
  const pageTitle = (to.meta as any)?.title as string | undefined;
  setTitle(pageTitle ? `${pageTitle} | ${SITE_NAME}` : DEFAULT_TITLE);

  // description（metaが無ければデフォルト）
  const desc = (to.meta as any)?.description as string | undefined;
  setMetaDescription(desc || DEFAULT_DESC);
});

router.beforeEach((to, _from, next) => {
  const auth = useAuthLocal();
  if (auth.userId == null) auth.restore();

  // 認証必須
  if (to.meta?.requiresAuth && !auth.isAuthed) {
    return next({ name: "Login", query: { redirect: to.fullPath } });
  }

  // 役割制限（必要なルートに meta.roles を付ける：['seeker'] or ['employer']）
  const roles = (to.meta as any)?.roles as string[] | undefined;
  if (roles && roles.length) {
    const t = localStorage.getItem("userType");
    if (!t || !roles.includes(t)) {
      // 権限外はトップへ
      return next({ name: "TopGate" });
    }
  }
  next();
});

export default router;
