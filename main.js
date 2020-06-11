'use strict';
const game0Divided = document.getElementById('game-area0');
const game1Divided = document.getElementById('game-area1');
let talk = '初期';//これを表示する文字の格納先とする
let nowID = 0;//現在のイベントidを記録する
let status = [0,100,100,5];//ハズレ、元気、たいまつ、100円

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
    //ステータスの表示
    ctx.font = "16px sans-serif"
    let sta = 'やるき：'+status[1]+'％　たいまつ：'+status[2]+'％　100円玉：'+status[3]+'枚';
    ctx.fillText(sta,5,22)
    //文字の表示
    for (let lines= (String(talk.value)).split("\n"),i=0,l=lines.length;l>i;i++){
      ctx.font = "18px sans-serif";
      let line = lines[i];
      let addY = 18;
      if (i) addY += 18 * 1.16 * i ;
      ctx.fillText(line,50,190+addY);
    }
    //選択肢の表示
    if (talk instanceof Branch){
    for (let lines= (String(talk.choice0)).split("\n"),i=0,l=lines.length;l>i;i++){
      ctx.font = "16px sans-serif";
      let line = lines[i];
      let addY = 18;
      if (i) addY += 18 * 1.16 * i ;
      ctx.fillText(line,30,290+addY);
    }
    for (let lines= (String(talk.choice1)).split("\n"),i=0,l=lines.length;l>i;i++){
      ctx.font = "16px sans-serif";
      let line = lines[i];
      let addY = 18;
      if (i) addY += 18 * 1.16 * i ;
      ctx.fillText(line,230,290+addY);
    }
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
  }
  if (talk instanceof Last){
    status[talk.plusid] = status[talk.plusid] + talk.plusv;
    status[talk.minusid] = status[talk.minusid] + talk.minusv;
  }
  if (talk.next0 == 0){
    startgame();
  }else if (talk instanceof Branch){
    if(point.x >= 50 && point.x <= 170 && point.y >= 270&&point.y <= 390){
    talk = talk.next0;
    } else if(point.x >= 230 && point.x <= 350 && point.y >= 270&&point.y <= 390){
    talk = talk.next1;
    }
  }else{
    talk = talk.next0;
  }
})
//クリック

//テキストのみ
class Text{
  constructor(value,next0){
    this.value = value;
    this.next0 = next0;
  }
}
//選択肢あり
class Branch extends Text{
  constructor(value,next0,next1,choice0,choice1){
    super(value,next0);
    this.next1 = next1;
    this.choice0 = choice0;
    this.choice1 = choice1;
  }
}
//ステータス処理あり
class Last extends Text{
  constructor(value,next0,plusid,plusv,minusid,minusv){
    super(value,next0);
    this.plusid = plusid;
    this.plusv = plusv;
    this.minusid = minusid;
    this.minusv = minusv;
  }
}

//イベント抽選
let idol = new Text('行動中……',0);
function startgame(){
  let i = Math.floor(Math.random()*events.length);
  status[2] = status[2] -10;
  talk = events[i] ;
}

let juce3 = new Last('「ガマンや！」\nやる気が 10 あがった！',idol,1,10,0,0);
let juce2 = new Last('「おいしい！」\n100円を 1 失った！\nやる気が 20 あがった！',idol,1,20,3,-1);
let juce1 = new Branch('自販機でジュースを買う？',juce3,juce2,'のまない','のむ');
let juce0 = new Text('カエデは自動販売機を\n見つけた！',juce1);

let mito1 = new Last('「ほんまに？ やったー！」\nやる気が 20 あがった！',idol,1,20,0,0);
let mito0 = new Text('カエデはミトと出会った！\n「カエデちゃんおつかいですか？\nえらいですねぇ……」',mito1);

const events = [juce0,mito0];

talk = idol;
