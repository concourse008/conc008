'use strict';
const game0Divided = document.getElementById('game-area0');
const game1Divided = document.getElementById('game-area1');
let talk = '初期';  //表示するイベントを格納
let place = 0;     //現在の場所を記録
let flag = [];      //初回のみのイベントのフラグをまとめる

let mitokae = {
  x: 160,
  y: 100
}

//画像読み込み
const canvas = {
  0: document.getElementById("canvas1"),
  1: document.getElementById("canvas2"),
  2: document.getElementById("canvas0")//入力用
};
let flip = 0;
canvas[1 - flip].style.visibility = 'hidden';
canvas[flip].style.visibility = 'visible';
canvas[2].style.visibility = 'visible';
flip = 1 - flip;
let ctx = canvas[flip].getContext('2d');
const ctx0 = canvas[2].getContext('2d');
const srcs = [//画像一覧
  ['pic3.png', 205, 333],
  ['pic2.png', 10, 333],
  ['pic1.png', 205, 270],
  ['pic0.png', 10, 270],
  ['message.png', 10, 185],
  ['mito2.png', 160, 90]
];
const srcs2 = [//背景画像一覧
  ['back0.png', 0, -5],
  ['back1.png', 0, -5],
  ['back.png', 0, 0]
];
let images = [];
for (let i in srcs) {
  images[i] = new Image();
  images[i].src = srcs[i][0];
}
let loadedCount = 1;
for (let i in images) {
  images[i].addEventListener('load', function () {
    if (loadedCount == images.length) {
      for (let j in images) {
        ctx.drawImage(images[j], srcs[j][1], srcs[j][2]);

      }
    }
    loadedCount++;
  }, false);
}
let backimages = [];
for (let i in srcs2) {
  backimages[i] = new Image();
  backimages[i].src = srcs2[i][0];
}
let loadedCount2 = 1;
for (let i in backimages) {
  backimages[i].addEventListener('load', function () {
    if (loadedCount2 == backimages.length) {
      for (let j in backimages) {
        ctx.drawImage(backimages[j], srcs2[j][1], srcs2[j][2]);
        console.log('a');
        window.requestAnimationFrame(step);
      }
    }
    loadedCount2++;
  }, false);
}
//画像読み込み

//画面の描写
let oldbi = 400;
let nowbi = 0;
let oldplace = 0;
function step() {
  window.requestAnimationFrame(step);
  canvas[1 - flip].style.visibility = 'hidden';
  canvas[flip].style.visibility = 'visible';
  flip = 1 - flip;
  ctx = canvas[flip].getContext('2d');
  ctx.clearRect(0, 0, 400, 400);
  ctx.drawImage(backimages[srcs2.length-1], srcs2[srcs2.length-1][1], srcs2[srcs2.length-1][2]);//ベース
  ctx.drawImage(backimages[oldplace], oldbi, -5);//場面背景古い
  ctx.drawImage(backimages[place], nowbi, -5);//場面背景新しい
  for (let j in images) {
    ctx.drawImage(images[j], srcs[j][1], srcs[j][2]);
  }
  //文字の表示
  for (let lines = (String(talk.value)).split("\n"), i = 0, l = lines.length; l > i; i++) {
    ctx.font = "18px sans-serif";
    let line = lines[i];
    let addY = 18;
    if (i == 1) {
      addY += 18 * 1.46 * i
    } else {
      addY += 18 * 1.26 * i
    }
    ctx.fillText(line, 50, 190 + addY);
  }
  //選択肢の表示
  if (talk instanceof Branch || talk instanceof Menu) {
    ctx.font = "20px sans-serif";
    ctx.fillText(talk.choice0, 30, 305);
    ctx.fillText(talk.choice1, 230, 305);
    ctx.fillText(talk.choice2, 30, 367);
    ctx.fillText(talk.choice3, 230, 367);
  }
  //ほぼ60fpsで繰り返すそう、本当か？
  console.log('a');
}
//画面の描写

//クリック
let point = 0;
canvas[2].addEventListener('click', e => {
  //マウスの座標をカンバス内の座標と合わせる
  const rect = canvas[2].getBoundingClientRect();
  point = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  }
  if (talk instanceof Last) {
    status[talk.plusid] = status[talk.plusid] + talk.plusv;
    status[talk.minusid] = status[talk.minusid] - talk.minusv;
  }
  if (talk instanceof Branch) {
    branchdo();
  } else if (talk instanceof Menu) {
    menudo();
  } else {
    talk = talk.next0;
  }
})
//クリック

//テキストのみ
class Text {
  constructor(value, next0) {
    this.value = value;
    this.next0 = next0;
  }
}
//調べる
class Branch extends Text {
  constructor(value, next0, next1, next2, next3, choice0, choice1, choice2, choice3) {
    super(value, next0);
    this.next1 = next1;
    this.next2 = next2;
    this.next3 = next3;
    this.choice0 = choice0;
    this.choice1 = choice1;
    this.choice2 = choice2;
    this.choice3 = choice3;
  }
}
function branchdo(){
  if (point.x >= 50 && point.x <= 170 && point.y >= 270 && point.y <= 327) {
    talk = talk.next0;
  } else if (point.x >= 230 && point.x <= 350 && point.y >= 270 && point.y <= 327) {
    talk = talk.next1;
  }else if (point.x >= 50 && point.x <= 170 && point.y >= 333 && point.y <= 390) {
    talk = talk.next2;
  }else if (point.x >= 230 && point.x <= 350 && point.y >= 333 && point.y <= 390) {
    talk = talk.next3;
  }
}
//メニュー
class Menu extends Text {
  constructor(value) {
    super(value);
    this.choice0 = '左に進む';
    this.choice1 = '右に進む';
    this.choice2 = 'アイテム';
    this.choice3 = 'しらべる';
  }
}
let rightgo = 0;
let leftgo = 0;
function menudo(){
  if (point.x >= 10 && point.x <= 195 && point.y >= 270 && point.y <= 327) {
    oldplace = place;
    place = place -1;
    oldbi = 0;
    nowbi = -400;
    ju();
    leftgo = setInterval(left, 1000/30);
  }else if (point.x >= 205 && point.x <= 390 && point.y >= 270 && point.y <= 327) {
    oldplace = place;
    place = place +1;
    oldbi = 0;
    nowbi = 400;
    ju();
    rightgo = setInterval(right, 1000/30);
  }else if (point.x >= 10 && point.x <= 195 && point.y >= 333 && point.y <= 390) {
    console.log('2');
  }else if (point.x >= 205 && point.x <= 390 && point.y >= 333 && point.y <= 390) {
    console.log('3');
  }
}
function right(){
  oldbi = oldbi -8;
  nowbi = nowbi -8;
  if (nowbi == 0){
    clearInterval(rightgo);
    clearInterval(jumping);
  }
}
function left(){
  oldbi = oldbi +8;
  nowbi = nowbi +8;
  if (nowbi == 0){
    clearInterval(leftgo);
    clearInterval(jumping);
  }
}
//ステータス処理あり
class Last extends Text {
  constructor(value, next0, itemid) {
    super(value, next0);
    this.itemid = itemid;
  }
}


const menu0 = new Menu('＊カエデ\nたのしみやなぁ……');
const op6 = new Text('＊カエデ\nうん、行こ！', menu0);
const op5 = new Text('＊ミト\n残ってる物があるかもしれませんね\n行ってみましょうか？', op6);
const op4 = new Text('＊カエデ\nオゾン！ なんかええなぁ\nよう燃えそうな感じするわ', op5);
const op3 = new Text('＊ミト\n色んなものを売っていたお店です\nあれは『OZONE』ってお店ですよ', op4);
const op2 = new Text('＊カエデ\nなんなんそれ？', op3);
const op1 = new Text('＊ミト\nあれは……\nショッピングモールですねぇ', op2);
const op0 = new Text('＊カエデ\nミトちゃん\nあのでっかいのなんやろ？', op1);

talk = op0;


let jumpi = 0;
function jump() {
  jumpi = 1 - jumpi;
  srcs[srcs.length - 1][2] = 90 - 3 * jumpi;
}
let jumping = 0;
function ju(){
  jumping = setInterval(jump, 200);
}