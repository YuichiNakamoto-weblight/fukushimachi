<!-- src/components/talk/TalkTemplates.vue -->
 <!-- トークテンプレート -->
<template>
  <!-- 入力欄の直下など、このコンポーネントを置いた場所に出す起動ボタン -->
  <div class="tpl-trigger-wrap">
    <!-- <button type="button" aria-label="トークテンプレートを開く"
            style="background:none; border:0; padding:0; cursor:pointer;"
            @click="open = true">
       <img class="tpl-trigger-img" src="/src/assets/images/mypage/btn-talk-tpl.png" alt="トークテンプレート" />
    </button> -->
   <button
     type="button"
     class="tpl-trigger-btn"
     aria-label="トークテンプレートを開く"
     @click="open = true"
   >
     トークテンプレート
   </button>
  </div>

  <!-- モーダル本体 -->
  <teleport to="body">
    <div v-if="open" id="modal-talktpl" class="modal talk-tpl" role="dialog" aria-modal="true" aria-hidden="false">
      <div class="modal__overlay" data-close="true" @click="open=false"></div>
      <button class="modal__close circle__close__btn" type="button" aria-label="閉じる" data-close="true" @click="open=false">×</button>

      <!-- ★ ここに roleClass を付与（求職者=オレンジ/事業者=ブルー想定） -->
      <div class="modal__panel" :class="roleClass" role="document" @click.stop>
        <div class="talk-tpl-title">
          <img src="/src/assets/images/mypage/talk-tpl-title.png" alt=""/>
        </div>

        <!-- ===== 求職者向け ===== -->
        <div class="copy-txt-inner" v-if="role === 'seeker'">
          <div class="copy-txt-title">介護施設に質問があるとき</div>
          <div class="copy-txt" id="copy-txt01">
            <pre class="copy-txt-detail">{{ seeker.q }}</pre>
            <!-- 中央寄せ（CSSは触らず、テンプレ内で中央寄せ） -->
            <div style="display:flex; justify-content:center;">
              <div class="btn-copy" @click="emitPaste(seeker.q)">入力欄にペースト</div>
            </div>
          </div>

          <div class="copy-txt-title">介護施設に就職希望を伝えるとき</div>
          <div class="copy-txt" id="copy-txt02">
            <pre class="copy-txt-detail">{{ seeker.apply }}</pre>
            <div style="display:flex; justify-content:center;">
              <div class="btn-copy" @click="emitPaste(seeker.apply)">入力欄にペースト</div>
            </div>
          </div>

          <div class="copy-note">
            <div class="copy-note-title">書く時の注意点</div>
            <ul>
              <li>・できるだけ素早い返信を心がけましょう</li>
              <li>・要件を簡潔にまとめましょう</li>
              <li>・社名や名前は正しく書きましょう</li>
              <li>・誤字や敬語の間違いに注意しましょう</li>
              <li>・丁寧な言葉遣いにしましょう</li>
            </ul>
          </div>
        </div>

        <!-- ===== 事業者向け ===== -->
        <div class="copy-txt-inner" v-else>
          <div class="copy-txt-title">求職者からグッドが届いたとき</div>
          <div class="copy-txt" id="copy-txt05">
            <pre class="copy-txt-detail">{{ employer.good }}</pre>
            <div style="display:flex; justify-content:center;">
              <div class="btn-copy" @click="emitPaste(employer.good)">入力欄にペースト</div>
            </div>
          </div>

          <div class="copy-txt-title">求職者の情報を詳しく聞くとき</div>
          <div class="copy-txt" id="copy-txt03">
            <pre class="copy-txt-detail">{{ employer.ask }}</pre>
            <div style="display:flex; justify-content:center;">
              <div class="btn-copy" @click="emitPaste(employer.ask)">入力欄にペースト</div>
            </div>
          </div>

          <div class="copy-txt-title">求職者に御礼を伝えるとき</div>
          <div class="copy-txt" id="copy-txt04">
            <pre class="copy-txt-detail">{{ employer.thanks }}</pre>
            <div style="display:flex; justify-content:center;">
              <div class="btn-copy" @click="emitPaste(employer.thanks)">入力欄にペースト</div>
            </div>
          </div>

          <div class="copy-note">
            <div class="copy-note-title">書く時の注意点</div>
            <ul>
              <li>・できるだけ素早い返信を心がけましょう</li>
              <li>・要件を簡潔にまとめましょう</li>
              <li>・名前は正しく書きましょう</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>


<script setup>
import { ref, computed } from 'vue'

const props = defineProps({ role: { type: String, required: true } }) // 'seeker' | 'employer'
const emit  = defineEmits(['paste'])

const open = ref(false)
const roleClass = computed(() => (props.role === 'employer' ? '-blue' : '-orange'))

const seeker = {
  q: `●●●●施設 ご担当者様
御社の求人情報を拝見しました。
質問があるので、こちらからメッセージを
お送りします。
（質問内容をわかりやすく書いてください。）
ご連絡いただけますよう、よろしくお願いいたします。`,
  apply: `●●●●施設 ご担当者様
御社の求人情報を拝見し、ぜひ応募したいと思ったので、こちらからメッセージをお送りします。
プロフィールをご確認いただきご連絡いただけると幸いです。
よろしくお願いいたします。`,
}

const employer = {
 good: `●●さん、こんにちは。
●●法人で採用を担当しております●●です。
●●（職種等）の求人にグッドをいただきまして、ありがとうございます。
掲載の求人内容などで確認したいことがありましたら、お気軽にお問い合わせください。
お待ちしております。`,
  ask: `●●●●様
この度は弊社の求人情報に関心をお寄せいただき、誠にありがとうございます。
ご経歴・お考えを拝見いたしました。
◯◯様のご経験や想いは、当社の◯◯◯◯
（事業内容や価値観など）とも通じるものがあり、大変心強く感じております。
つきましては、ぜひ一度お話を伺えればと思っております。
差し支えなければ、以下の内容についてご返信いただけますでしょうか。
□ご希望の雇用形態（正社員／契約社員／業務委託など）
□ご希望の勤務開始時期
ご多用のところ恐縮ですが、ご返信をお待ちしております。
今後ともどうぞよろしくお願い申し上げます。
敬具`,
  thanks: `●●●●様
求人情報をご覧いただきありがとうございます！
求人に興味を持っていただけてとても嬉しいです。
勤務条件や職場の雰囲気など、気になることがあればお気軽にトークでご質問ください
`,
}

function emitPaste(text){ emit('paste', text); open.value = false }
</script>

<style scoped>
.tpl-trigger-wrap{
padding-bottom: -10px;

}
/* テキスト版トリガーボタン */
.tpl-trigger-btn{
  margin-top: -10px;
  margin-left: 6px;
  padding: 12px;
  font-size: 14px;
  color: #111827;
  justify-content: flex-start;
  text-decoration: underline;
  text-underline-offset: 2px;     /* 下線の間隔 */
  text-decoration-thickness: 1.5px;
}

/* テンプレ本文の枠 */
.copy-txt{
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  margin-bottom: 16px;
  max-width: 100%;
  overflow: hidden; /* 枠外はみ出し防止 */
}

/* 例文テキスト：枠内で改行 */
.copy-txt-detail{
  /* <pre> だけど折り返す */
  white-space: pre-wrap;      /* 改行は保持しつつ折り返し */
  overflow-wrap: anywhere;    /* 日本語・長いURL対策 */
  word-break: break-word;     /* 保険（連続文字の折り返し） */
  line-height: 1.6;
  font-family: inherit;       /* 等幅にならないように */
  font-size: 14px;
  margin: 0;                  /* preのデフォルト余白をリセット */
  display: block;
  max-width: 100%;
}

/* スマホでパネル幅から溢れないように */
.modal__panel{
  max-width: min(720px, 92vw);
}

</style>
