// ########コンポーネント/component

// コンポーネントの作成方法は2種類　⭐️おすすめは2)のローカル⭐️
// ++++----------------
// 1) Vue.component()メソッド
//    グローバルコンポーネントとなり、Vueテンプレートのどこからでも呼び出せる。
//    そのため、使用の有無にかかわらず必ず読み込まれるため、
//    ビルドの時間やアプリケーションのサイズに影響を与える。

// 2) const宣言 & Vueインスタンスのcomponentsオプション
//    ローカルコンポーネントとなり、登録先のインスタンス(またはコンポーネント)内でのみ使用できる。
//    他のインスタンスやHTMLファイル上のテンプレートでは使用できない。
// ----------------++++

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ####グローバルコンポーネント

// 1st para  任意のコンポーネント名を指定。
//           指定した名前はHTMLでタグ名のように使用できる。
// 2nd para  Vueインスタンスの生成要素と同じように記載できる。
// !!!!! WARNING !!!!!
// コンポーネントの定義は、インスタンスの作成より前に書かないとエラーとなる。
Vue.component('g-list-title', {
  template: `
    <h3>########コンポーネント(グローバル)</h3>
  `
})

Vue.component('g-user-list', {
  // !!!!! WARNING !!!!!
  // Vueインスタンスと異なり、dataをオブジェクトで記載できない。
  // 必ず関数の返り値で定義すること。
  data() {
    return {
      users: [
        { id: 1, name: 'ユーザ1' },
        { id: 2, name: 'ユーザ2' },
        { id: 3, name: 'ユーザ3' },
      ]
    }
  },
  // テンプレート直下では1つの要素しか書けない。
  // 複数要素は1つの要素で囲むようにする。
  template: `
    <div>
      <!-- 別のコンポーネントを記載することもできる。 -->
      <g-list-title></g-list-title>
      <ul>
        <li v-for="user in users" :key="user.id">
          {{ user.name }}
        </li>
      </ul>
    </div>
  `
})

// ルートのVueインスタンスを作成
// DOMをマウントすると、その要素内でコンポーネントを使用できる。
const vm3 = new Vue({
  el: '#app3'
})

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ####ローカルコンポーネント/componentsオプション/propsオプション

const LoListTitle = {
  template: `
    <h3>########コンポーネント(ローカル)</h3>
  `
}

const UserDetail = {
  // propsオプション
  // 親コンポーネント(今回の場合 LoUserList)から受け取るdataの情報を定義する。
  // !!!!! WARNING !!!!!
  // dataと違い、propsの値は変更できない。Reactと一緒だね。
  // ただしtypeによって挙動が異なる。
  // 例:
  // ❌ type: String => 文字列を変更
  // ⭕ type: Object => オブジェクト内のプロパティの値を変更
  // ❌ type: Object => 別のオブジェクトを代入
  props: {
    // userという名前でObject型のプロパティを受け取る。
    // 親コンポーネントでUserDetailコンポーネントを呼び出す時、
    // v-bind:user='オブジェクト'の形式で、
    // 親コンポーネントからpropsを受け取ることを想定している。
    user: { type: Object },
    userName: { type: String}
  },
  template: `
    <div>
      <h3>選択中のユーザ</h3>
      <!-- propsもdataと同じようにアクセス可能。 -->
      {{ user.name }}
      <input v-model='userName'>
    </div>
  `
}


const LoUserList = {
  // componentsオプション
  // { 'コンポーネント名': コンポーネントオブジェクト }
  components: {
    'lo-list-title': LoListTitle,
    'user-detail': UserDetail,
  },
  data() {
    return {
      users: [
        { id: 1, name: 'ユーザ1' },
        { id: 2, name: 'ユーザ2' },
        { id: 3, name: 'ユーザ3' },
      ],
      // clickしたユーザ情報を格納。
      selected_user: {}
    }
  },
  template: `
    <div>
      <!-- ローカルコンポーネントなので、lo-list-titleは
        このtemplateオプションの中でのみ呼び出せる。 -->
      <lo-list-title></lo-list-title>
      <ul>
        <!-- @click='selected_user = user'
          クリックしたらselected_userにuserのdataを格納する -->
        <li v-for="user in users" :key="user.id" @click='selected_user = user; '>
          {{ user.name }}
        </li>
      </ul>
      <!-- UserDetailコンポーネントを呼び出す。
        ++++----------------
        props:
        user に selected_user が、
        userName に selected_user.name が渡される。
        !!!!! WARNING !!!!!
        propsオプションではキャメルケース(例: userName)で書き、
        v-bindではケバブケース(例: user-name)で書くことが推奨されている
        (HTML属性は case-insensitive(大文字・小文字区別なし) のため)。
        ----------------++++
        UserDetailのtemplateオプションに書いたとおり、
        親から受け取ったpropsをもとに、user.nameとinputボックスが表示される。 -->
      <user-detail :user='selected_user' :user-name='selected_user.name'></user-detail>
    </div>
  `
}

const vm4 = new Vue({
  el: '#app4',
  // componentsオプション
  // { 'コンポーネント名': コンポーネントオブジェクト }
  components: {
    'lo-user-list': LoUserList,
  },
})

// ************************************************************
// ########子コンポーネントから親コンポーネントへのデータの伝播/$emit()

// 親コンポーネント: ユーザー名表示
// 子コンポーネント: ユーザー名変更フォーム
// 子コンポーネントで表示したユーザー名を親コンポーネントに反映する。

// 子コンポーネント: ユーザー名変更フォーム
const UserForm = {
  template: `
    <div>
      <div>ユーザー名変更フォーム</div>
      <input v-model='user_name' />
      <button @click='update'>名前変更</button>
    </div>
  `,
  props: {
    // required: true
    // 親コンポーネントからのpropsの受け渡しを必ず要求する。
    userName: { type: String, required: true },
  },
  data() {
    return {
      user_name: this.userName
    }
  },
  methods: {
    update() {
      // $emit()
      // 1st para => 親コンポーネントに定義したv-onのイベント名
      //             今回ば場合 @update:user-nameのイベントハンドラが実行される。
      // 2nd para => 親コンポーネントに渡す値
      this.$emit('update:user-name', this.user_name)
    }
  },
}

// 親コンポーネント: ユーザー名表示
const UserDetail2 = {
  components: {
    'user-form': UserForm,
  },
  data() {
    return {
      user_name: '山田　太郎',
    }
  },
  template: `
    <div>
      <h3>########子コンポーネントから親コンポーネントへのデータの伝播</h3>
      <div>
        <!-- dataからユーザー名を呼び出す。 -->
        <span>ユーザー名: {{ user_name }}</span>
      </div>
      <div>
        <!-- 子コンポーネントを呼び出す。 -->
        <!-- $event は子コンポーネンで定義した $emit の 2nd para -->
        <user-form :user-name='user_name' @update:user-name='user_name = $event'></user-form>
      </div>
    </div>
  `
}

// Vueインスタンス
const vm5 = new Vue({
  el: '#app5',
  components: {
    'user-detail': UserDetail2
  },
})

// ************************************************************
// ########Vueインスタンスのオプションとメソッド

// vm はVue Modelの略。慣例としてVueインスタンスに使うことが多い。
const vm = new Vue({

  // ####elオプション
  // VueインスタンスをDOMに適用することをマウントという。
  // そのマウントするDOMを指定するオプション。
  // DOMはCSSセレクタ or DOM要素のオブジェクト
  // (document.getElementByIdなどで取得)で指定。
  // まずはelオプションでマウントするのが基本。
  el: '#app',

  // ####templateオプション
  // VueテンプレートをHTMLファイルではなく、JSファイルに記載できる。
  // Template literal(バッククォートの囲み)なら改行もそのまま有効となる。
  // !!!!! WARNING !!!!!
  // 1)templateオプション使用時は、マウント先のHTMLファイルの
  //   テンプレートは無視されるので、同時に使用はできない。
  // 2)単一のタグで囲む必要がある(Reactと一緒だね)。
  /*
    template: `
    <div>
      <h1>タイトル</h1>
      <p>あいうえお</p>
    </div>
    `,
   */

  // ####dataオプション
  // プロパティ名をHTMLで変数として使用できる。
  // Object型とFunction型がある。
  // --------------------
  // Object型
  /*
    data: {
      message: 'Hello, Vue!',
      message2: 'Hello, World!'
    }
   */
  // Function型
  // data: function() {
  // 上記の短縮形(ES6)
  data() {
    // 返り値のオブジェクトがdataにセットされる。
    return {
      message1: 'Hello, Vue!',
      message2: 'Hello, World!',
      numbers: [],
      totalNum: 0,
      titleMsg: 'v-bindによるtitle属性の追加',
      price: 3000000,
      buttonDisabled: true,
      reserve: false, // チェックボックスのチェック状態を管理
      ifMsg: '',
      todos: [
        { id: 1, text: "Learn JavaScript", done: false },
        { id: 2, text: "Learn Vue", done: false },
        { id: 3, text: "Play around in JSFiddle", done: true },
        { id: 4, text: "Build something awesome", done: true }
      ],
      name: '山田',
      email: 'user1@example.jp',
      text: 'xxxについて',
    }
  },

  // ####methodsオプション
  // ディレクティブなどから呼び出すためのメソッドをまとめて管理。
  methods: {
    // 引数には呼び出し元のイベントオブジェクトが渡ってくる。
    clickLog(event) {
      console.log(event) // イベントオブジェクト
      console.log(event.target) // イベントが発生した要素
    },
    hoverLog() {
      console.log('hovering')
    },
    // todoのchange属性を管理。
    toggle: function (todo) {
      todo.done = !todo.done
    },
    submit() {
      const inquiry = `
        次の問い合わせ内容を送信しました。

        【名前】
        ${this.name}
        【メールアドレス】
        ${this.email}
        【お問い合わせ内容】
        ${this.text}
      `
      alert(inquiry)
    }
  },

  // ####watchオプション
  // dataの変更時にメソッドを実行する。
  watch: {
    // dataのプロパティ名と同じ名前でメソッドを作ることで、
    // そのdataが更新された時にメソッドを実行する。
    numbers(value) {
      // numbers[]をすべて足し直すので、totalNumを一度リセット。
      this.totalNum = 0
      // numbers[]の全要素を加算し、totalNumに代入。
      this.numbers.forEach((number) => {
        this.totalNum += number
      })
    }
  },

  // ####filtersオプション
  // 値の加工や変形に使用。HTMLのマスタッシュ内で、dataを | で渡して利用できる。
  filters: {
    numberWithDelimiter(value) {
      if (!value) return '0'
      // 文字列.replace(置換対象の文字列, 置換後の文字列または関数)
      // /正規表現/g   パターンにマッチするすべてを置換対象とする。
      // ++++----------------
      // \d      数値にマッチ。[0-9]に相当。
      // (x)     'x' にマッチし、マッチした内容を記憶。replaceの2nd paraで
      //         $n(n番目の括弧)として呼び出せる。キャプチャリング括弧という。
      // x(?=y)  'x' に 'y' が続く場合のみ 'x' にマッチ。
      // {n}     直前の文字のn回連続にマッチ。
      // +       直前の文字の1回以上の繰り返しにマッチ。{1,}に相当。
      // $       入力の末尾にマッチ。
      // --------++++--------
      // /(\d)(?=(\d{3})+$)/g
      //
      // !!!!! WARNING !!!!!
      // (\d)の()と、(?=...)の()は意味が違うことに注意。
      // (\d)      上記の(x)
      // (?=...)   上記のx(?=y)
      // ----------------++++
      return value.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,')
    }
  },

  // ####computedオプション(算出プロパティ)
  // 算出プロパティ(下記の場合はbuttonLabel())を設定する。
  // 算出プロパティは、算出プロパティ内のdata(下記の場合はthis.buttonDisabled)が
  // 変更された時に再実行される。
  // dataが変更されないかぎり、何度呼ばれてもキャッシュによって同じ結果を返す。
  // !!!!! WARNING !!!!!
  // dataに関係のないメソッドは、どんな内容でも1度しか実行されない。
  computed: {
    buttonLabel() {
      // 三項演算子
      // thisはVueインスタンス
      return this.buttonDisabled ? '無効' : '有効'
    }
  },
})

// ####$mount()メソッド
// elオプションを使わない方法。あとから動的にDOMを指定する場合に使うことが多い。
// vm.$mount('#app');

// Consoleで監視可能にする。
// セクション3-5.Vueコンストラクタのdataオプション(後半)
window.vm = vm

// ####$watch()メソッド
// dataの値を監視。値の変更時にcallbackを実行。
// 動作確認やログ出力に便利。
// --------------------
// 1st para => 関数。監視対象のdataを返す関数を指定。
// 2nd para => 関数。監視対象のdataが変更された時のcallback。
//             1st para  => 変更後の値。
vm.$watch(function () {
  // thisはVueインスタンス  ※アロー関数にするとthisが変わってしまうので注意。
  return this.message1
}, function (newMessage1) {
  console.log('$watch() 変更後の値: ' + newMessage1)
})

// !!!!! WARNING !!!!!
// 以下の関数はmethodsオプションの存在を知る前に書きました。
// なので、本来ならmethodsにまとめるほうがいいと思う。
// ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
// 「Msg1を変更」formのボタンクリックで実行。
let messageMod = () => {
  const newMsg = document.form_msg1.message.value;
  // Vueインスタンスのdataの値を変更。
  vm.message1 = newMsg;
}
// 「Totalに加算」formのボタンクリックで実行。
let sum = () => {
  // formの値を文字列から数値に変換し、numに代入。
  const num = Number(document.form_total.num.value);
  // numをnumbers[]に追加。
  vm.numbers.push(num);
}

// computedオプション(算出プロパティ)の[change]buttonで実行。
let buttonDisabledChange = () => {
  vm.buttonDisabled = !vm.buttonDisabled
}
// ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

// ************************************************************
// ########Vueインスタンスのライフサイクルの確認

const vm2 = new Vue({
  el: '#app2',
  template: `
    <p>{{ message }}</p>
  `,
  data() {
    return {
      message: 'Check Lifecycle',
      interval_id: null,
    }
  },

  // ####ライフサイクルフック
  // それぞれ規定のタイミングで関数を実行できる。
  // --------------------
  beforeCreate() {
    console.log('beforeCreate: Vueインスタンス作成前')
  },
  // dataの操作が可能となる。
  // APIでデータを取得し、dataに反映したい時などに便利。
  // setInterval()やsetTimeout()など、断続的な処理もここに記入できる。
  created() {
    console.log('created: Vueインスタンス作成後')
    this.message = 'Instance Created'
    let seconds = 0
    this.interval_id = setInterval(() => {
      // vm2.$destroy()実行し忘れの対策として、あらかじめ書いた処理。
      // ++++----------------
      if (seconds >= 10) {
        vm2.$destroy()
      }
      // ----------------++++
      console.log(`${seconds += 2}秒経過`)
    }, 2000);
  },
  beforeMount() {
    console.log('beforeMount: マウント前')
  },
  mounted() {
    console.log('mounted: マウント後')
  },
  beforeUpdate() {
    console.log('beforeUpdate: 再描画前')
  },
  updated() {
    console.log('updated: 再描画後')
  },
  // 以降は Vueインスタンス.$destroy() を実行すると処理される。
  // !!!!! WARNING !!!!!
  // メモリリーク(不要なメモリの確保によってメモリの空き領域が
  // 減っていくこと)を解消するために、役目を完了したインスタンスの処理を
  // beforeDestroy()でクリアすることが望ましい。
  beforeDestroy() {
    console.log('beforeDestroy: Vueインスタンス削除前')
    // clearInterval()でsetInterval()の処理を解除できる。
    clearInterval(this.interval_id)
  },
  destroyed() {
    console.log('destroyed: Vueインスタンス削除後')
  },
})


