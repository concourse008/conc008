'use strict';
const game0Divided = document.getElementById('game-area0');
const game1Divided = document.getElementById('game-area1');
let talk = '初期';//これを表示する文字の格納先とする
let nowID = 0;//現在のイベントidを記録する

//画像読み込み
  const canvas = {
    0: document.getElementById("canvas1"),
    1: document.getElementById("canvas2"),
    2: document.getElementById("canvas0")//入力用
    };
  let flip = 0;
  canvas[1-flip].style.visibility='hidden';
  canvas[flip].style.visibility='visible';
  canvas[2].style.visibility='visible';
  flip = 1 - flip;
  let ctx = canvas[flip].getContext('2d');
  const ctx0 = canvas[2].getContext('2d');
  const srcs = [//画像一覧
    ['back.png',0,0],
    ['yes.png',205,270],
    ['no.png',10,270],
    ['message.png',10,185],
    ['mito2.png',50,100]
  ];
  let images = [];
  for (let i in srcs){
    images[i] = new Image();
    images[i].src = srcs[i][0];
  }
  let loadedCount = 1;
  for (let i in images){
    images[i].addEventListener('load',function(){
      if (loadedCount == images.length){
        for(let j in images){
          ctx.drawImage(images[j],srcs[j][1],srcs[j][2]);
          window.requestAnimationFrame(step);
        }
      }
      loadedCount++;
    },false);
  }
//画像読み込み

//画面の描写
  function step(){
    window.requestAnimationFrame(step);
    canvas[1-flip].style.visibility='hidden';
    canvas[flip].style.visibility='visible';
    flip = 1 - flip;
    ctx = canvas[flip].getContext('2d');
    for(let j in images){
      ctx.drawImage(images[j],srcs[j][1],srcs[j][2]);
    }
    //文字の表示
    for (let lines= (String(talk.value)).split("\n"),i=0,l=lines.length;l>i;i++){
      ctx.font = "18px sans-serif";
      let line = lines[i];
      let addY = 18;
      if (i) addY += 18 * 1.16 * i ;
      ctx.fillText(line,50,190+addY);
    }
    //選択肢左の表示
    for (let lines= (String(talk.choice0)).split("\n"),i=0,l=lines.length;l>i;i++){
      ctx.font = "24px sans-serif";
      let line = lines[i];
      let addY = 18;
      if (i) addY += 18 * 1.16 * i ;
      ctx.fillText(line,30,290+addY);
    }
    //右選択肢の表示
    for (let lines= (String(talk.choice1)).split("\n"),i=0,l=lines.length;l>i;i++){
      ctx.font = "24px sans-serif";
      let line = lines[i];
      let addY = 18;
      if (i) addY += 18 * 1.16 * i ;
      ctx.fillText(line,230,290+addY);
    }
    //ほぼ60fpsで繰り返すそう、本当か？
    console.log('a');
  }
//画面の描写

//クリック
let point = 0;
canvas[2].addEventListener('click',e =>{
  //マウスの座標をカンバス内の座標と合わせる
  const rect = canvas[2].getBoundingClientRect();
  point = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
  if (talk.next0 == 0){
    startgame();
  }else if (talk.choice0 == ''){
    talk = talk.next0;
  }else if(point.x >= 50 && point.x <= 170 && point.y >= 270&&point.y <= 390){
    talk = talk.next0;
  } else if(point.x >= 230 && point.x <= 350 && point.y >= 270&&point.y <= 390){
    talk = talk.next1;
  }
})
//クリック

//0体力　1たいまつ　2お金
let status = ['やる気に','松明を','お金を']
let statusdam = ['ダメージを受けた。','使った。','円なくした。']

//バッドイベント
class Trap{
  constructor(name,damage,damagetype){
    this.name = name ;
    this.damage = damage ;
    this.damagetype = status[damagetype] ;
    this.damagelog = statusdam[damagetype];
  }
  badresult(){
    let i = this.name + '！<br>カエデは' + this.damagetype + this.damage + this.damagelog;
    playlog(i);
  }
  goodresult(){
    
  }
}

let crow = new Trap('カラスに馬鹿にされた',10,0);
let stone = new Trap('石に躓いてころんだ',10,2);
let mos = new Trap('蛾をおっぱらった',5,1);

//テキスト
//表示される文面、左で進む、右で進む、左選択肢文、同じく右、左で減るアイテムID、減る量、増えるアイテムID、増える量、右で減るアイテムID、減る量、増えるアイテムID、増える量
class Text{
  constructor(value,next0,next1,choice0,choice1){
    this.value = value;
    this.next0 = next0;
    this.next1 = next1;
    this.choice0 = choice0;
    this.choice1 = choice1;
  }
}

//イベント抽選
let idol = new Text('行動中……',0,0,'','');
function startgame(){
  let i = Math.floor(Math.random()*events.length);
  talk = events[i] ;
}


let juce3 = new Text('「ガマンや！」\nやる気が 10 あがった！',idol,0,'','');
let juce2 = new Text('「おいしい！」\nおかねを 100 失った！\nやる気が 20 あがった！',idol,0,'','');
let juce1 = new Text('自販機でジュースを買う？',juce3,juce2,'のまない','のむ');
let juce0 = new Text('カエデは自動販売機を\n見つけた！',juce1,juce1,'','');

let mito1 = new Text('「ほんまに？ やったー！」\nやる気が 20 あがった！',idol,0,'','');
let mito0 = new Text('カエデはミトと出会った！\n「カエデちゃんおつかいですか？\nえらいですねぇ……」',mito1,mito1,'','');

const events = [juce0,mito0];

talk = idol;
