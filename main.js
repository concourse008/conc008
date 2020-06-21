'use strict';
const game0Divided = document.getElementById('game-area0');
const game1Divided = document.getElementById('game-area1');
let talk = '初期';  //表示するイベントを格納
let place = 0;     //現在の場所を記録
let flag = [1, 0, 0];      //初回のみのイベントのフラグをまとめる
let inputok = true; //入力受付中
let me = 0;
let lo = 0;
//紅茶、ティーポット、薪、ケトル、鍋、氷、茶こし、ザル、マグ、周隠器、ジェット、電気
let itemflag = [0, 0, 0, 0, 0, 0, 0, 0, 0];

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
  ['back2.png', 0, -5],
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
  ctx.drawImage(backimages[srcs2.length - 1], srcs2[srcs2.length - 1][1], srcs2[srcs2.length - 1][2]);//ベース
  ctx.drawImage(backimages[oldplace], oldbi, -5);//場面背景古い
  ctx.drawImage(backimages[place], nowbi, -5);//場面背景新しい
  for (let j in images) {
    ctx.drawImage(images[j], srcs[j][1], srcs[j][2]);
  }
  //文字の表示
  ctx.font = "14px sans-serif";
  if (talk.who == 0) {
    ctx.fillText('ミト', 60, 205);
  } else if (talk.who == 1) {
    ctx.fillText('カエデ', 60, 205);
  } else {
    ctx.fillText(' ', 60, 205);
    console.log('a');
  }
  for (let lines = (String(text)).split("\n"), i = 0, l = lines.length; l > i; i++) {
    ctx.font = "18px sans-serif";
    let line = lines[i];
    let addY = 18;
    addY += 18 * 1.26 * i;
    ctx.fillText(line, 50, 215 + addY);
  }
  //選択肢の表示
  if (talk instanceof Branch || talk instanceof Menu) {
    ctx.font = "20px sans-serif";
    ctx.fillText(talk.choice0, 30, 305);
    ctx.fillText(talk.choice1, 230, 305);
    ctx.fillText(talk.choice2, 30, 367);
    ctx.fillText(talk.choice3, 230, 367);
  }
}
//画面の描写

//クリック
let point = 0;
canvas[2].addEventListener('click', e => {
  if (inputok) {
    //マウスの座標をカンバス内の座標と合わせる
    const rect = canvas[2].getBoundingClientRect();
    point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
    if (talk instanceof Last) {
      inputok = false;
      lastdo();
    } else if (talk instanceof Branch) {
      inputok = false;
      branchdo();
    } else if (talk instanceof Menu) {
      inputok = false;
      menudo();
    } else if (talk instanceof Check) {
      inputok = false;
      checkdo();
    } else {
      inputok = false;
      if (talk.next0) {
        talk = talk.next0;
      } else {
        talk = lo[place];
      }
      count = 0;//メッセージウィンドウをリセット
      disp();//メッセージ表示
    }
  }
})
//クリック

//テキストのみ
class Text {
  constructor(who, value, next0) {
    this.who = who;
    this.value = value;
    this.next0 = next0;
  }
}
//調べる
class Branch extends Text {
  constructor(who, value, next0, next1, next2, choice0, choice1, choice2) {
    super(who, value, next0);
    this.next1 = next1;
    this.next2 = next2;
    this.choice0 = choice0;
    this.choice1 = choice1;
    this.choice2 = choice2;
    this.choice3 = 'もどる';
  }
}
function branchdo() {
  count = 0;
  if (point.x >= 10 && point.x <= 195 && point.y >= 270 && point.y <= 327) {
    if (talk.next0 == 0) {
      inputok = true;
    } else {
      talk = talk.next0;
      disp();
    }
  } else if (point.x >= 205 && point.x <= 390 && point.y >= 270 && point.y <= 327) {
    if (talk.next1 == 0) {
      inputok = true;
    } else {
      talk = talk.next1;
      disp();
    }
  } else if (point.x >= 10 && point.x <= 195 && point.y >= 333 && point.y <= 390) {
    if (talk.next2 == 0) {
      inputok = true;
    } else {
      talk = talk.next2;
      disp();
    }
  } else if (point.x >= 205 && point.x <= 390 && point.y >= 333 && point.y <= 390) {
    talk = me[place];
    disp();
  } else {
    count = 100;
    disp();
  }

}
//メニュー
class Menu extends Text {
  constructor(who, value) {
    super(who, value);
    this.choice0 = '左に進む';
    this.choice1 = '右に進む';
    this.choice2 = 'アイテム';
    this.choice3 = 'しらべる';
  }
}
let rightgo = 0;
let leftgo = 0;
function menudo() {
  if (point.x >= 10 && point.x <= 195 && point.y >= 270 && point.y <= 327) {
    if (place == 0) {
      inputok = true;
    } else {
      oldplace = place;
      place = place - 1;
      oldbi = 0;
      nowbi = -400;
      ju();
      leftgo = setInterval(left, 1000 / 30);
    }
  } else if (point.x >= 205 && point.x <= 390 && point.y >= 270 && point.y <= 327) {
    if (place == 2) {
      inputok = true;
    } else {
      oldplace = place;
      place = place + 1;
      oldbi = 0;
      nowbi = 400;
      ju();
      rightgo = setInterval(right, 1000 / 30);
    }
  } else if (point.x >= 10 && point.x <= 195 && point.y >= 333 && point.y <= 390) {
    console.log('2');
    inputok = true;
  } else if (point.x >= 205 && point.x <= 390 && point.y >= 333 && point.y <= 390) {
    look();
  } else {
    inputok = true;
  }
}
function right() {
  oldbi = oldbi - 8;
  nowbi = nowbi - 8;
  if (nowbi == 0) {
    clearInterval(rightgo);
    clearInterval(jumping);
    if (flag[place] == 0) {
      flag[place] = 1;
      talk = fi[place];
      count = 0;
    } else {
      talk = me[place];
    }
    disp();
  }
}
function left() {
  oldbi = oldbi + 8;
  nowbi = nowbi + 8;
  if (nowbi == 0) {
    clearInterval(leftgo);
    clearInterval(jumping);
    if (flag[place] == 0) {
      flag[place] = 1;
      talk = fi[place];
      count = 0;
    } else {
      talk = me[place];
    }
    disp();
  }
}
function look() {
  talk = lo[place];
  count = 0;
  disp();
}
//フラグ処理あり
class Last extends Text {
  constructor(who, value, next0, itemid) {
    super(who, value, next0);
    this.itemid = itemid;
  }
}
function lastdo() {
  itemflag[talk.itemid] = 1;
  talk = talk.next0;
  count = 0;
  disp();
}
//フラグによる分岐あり n番のフラグが１か０かをチェック、それぞれの分岐
class Check extends Text {
  constructor(who, value, set, checkid) {
    super(who, value);
    this.set = set;
    this.checkid = checkid;
  }
}
function checkdo() {
  let j = 0;
  for (let i = 0; i < talk.set.length; i++) {
    j = j + itemflag[i];
  }
  talk = talk.set[j];
  count = 0;
  disp();
}

//外
const menu0 = new Menu(1, 'たのしみやなぁ……');
const op6 = new Text(1, 'うん、行こ！', menu0);
const op5 = new Text(0, '面白い物があるかもしれません\n行ってみましょうか？', op6);
const op4 = new Text(1, 'オゾン！ なんかええなぁ\nよう燃えそうな感じするわ', op5);
const op3 = new Text(0, '色んなものを売っていたお店です\nあれは『OZONE』ってお店ですよ', op4);
const op2 = new Text(1, 'なんなんそれ？', op3);
const op1 = new Text(0, 'あれは……\nショッピングモールですねぇ', op2);
const op0 = new Text(1, 'ミトちゃん\nあのでっかいのなんやろ？', op1);
const look0 = new Branch(2, 'どこを調べよう？', 0, 0, 0, '', '', '');

talk = op0;

//オゾン入り口
const menu1 = new Menu(1, 'でかいけどボロいなぁ');
const fi102 = new Text(0, 'さっそく入ってみましょう', menu1);
const fi101 = new Text(1, '近くに来るとよけいでかいなぁ', fi102);
const look1 = new Branch(2, 'どこを調べよう？', 0, 0, 0, '', '', '');

//紅茶店
const menu2 = new Menu(0, 'ほとんどチリになってますねぇ……');
const fi208 = new Text(0, 'やりますか！\nカエデちゃん、わたくしも手伝います！', menu2);
const fi207 = new Text(1, 'よし！ 待ってて！\n探してみるわ！', fi208);
const fi206 = new Text(0, '飲んでみたいですねぇ……\nでも茶葉が残ってるかどうか……', fi207);
const fi205 = new Text(1, 'へぇー………\nミトちゃん飲んでみたい？', fi206);
const fi204 = new Text(0, '美味しくておちつく飲み物です\n飲んだことはないですが……', fi205);
const fi203 = new Text(1, 'こうちゃって？', fi204);
const fi202 = new Text(0, '『シゲルチャペック』……\n紅茶のお店だったようですねぇ……', fi203);
const fi201 = new Text(1, 'なんか変な匂いする！', fi202);

const lo2038 = new Text(1, 'そうやね、冒険や！');
const lo2037 = new Text(0, 'はい、のんびり材料を集めましょう\nここ以外も見て回りたいですし', lo2038);
const lo2036 = new Text(1, 'えっ！？\nそしたらもっとおいしい？', lo2037);
const lo2035 = new Text(0, 'ふふ、紅茶を美味しく飲むコツは\n焦らない事なんですよ', lo2036);
const lo2034 = new Text(1, 'もうのめる？', lo2035);
const lo2032 = new Text(0, 'これはまだ使えそうですねぇ……', lo2034);
const lo2031 = new Last(2, 'ティーポットを見つけた！', lo2032, 1);
const lo2030 = new Text(0, 'よいせのせ、と……', lo2031);
const lo2031n = new Text(0, 'おっとカエデちゃん\n触ると危ないですよ');
const lo2030n = new Text(1, 'てぃーポットのかけらでいっぱいや', lo2031n);

const lo2027 = new Text(0, 'まずは……　　　\n棚のアレをもらいましょうか');
const lo2026 = new Text(1, 'そうなんや、ここにある？', lo2027);
const lo2025 = new Text(0, 'ええ、でも紅茶を美味しく飲むには\n他にもいる物があるんです', lo2026);
const lo2024 = new Text(1, 'それ紅茶なん？\n飲めるん？', lo2025);
const lo2023 = new Text(0, 'あるもんですねぇ……', lo2024);
const lo2022 = new Last(2, '真空保存された紅茶を見つけた！', lo2023, 0);
const lo2021 = new Text(2, '『100年後の火星でも、\n　おいしい紅茶をたのしく』', lo2022);
const lo2020 = new Text(0, 'おや、これは……', lo2021);
const lo2021n = new Text(0, '………');
const lo2020n = new Text(2, '『100年後の火星でも、\n　おいしい紅茶をたのしく』', lo2021n);

const lo2015 = new Text(1, 'もちろんええよ！\nこれはわたしとミトちゃんの！');
const lo2014 = new Text(0, 'わたくしも眺めたいですねぇ……', lo2015);
const lo2013 = new Text(1, '持って帰って\n棚のとこに飾るんや～', lo2014);
const lo2012 = new Text(0, 'あっ！ いいですねぇ……', lo2013);
const lo2011 = new Text(1, '見てミトちゃん！\nこのカンカンかわええ！', lo2012);
const lo2010 = new Text(0, 'どれも中身がチリになってますねぇ……', lo2011);

const look23 = new Branch(2, 'どこを調べよう？', lo2010, lo2020n, lo2030n, '机', '引き出し', '棚');
const look22 = new Branch(2, 'どこを調べよう？', lo2010, lo2020n, lo2030, '机', '引き出し', '棚');
const look21 = new Branch(2, 'どこを調べよう？', lo2010, lo2020, 0, '机', '引き出し', '');
const look2set = [look21, look22, look23]
const look2 = new Check(2, 'どこを調べよう？', look2set, [0, 1]);

lo = [look0, look1, look2]//探索イベントまとめ
const fi = [0, fi101, fi201]//初移動イベント
me = [menu0, menu1, menu2]//各待機

//二人がぴょこぴょこする仕組み
let jumpi = 0;
function jump() {
  jumpi = 1 - jumpi;
  srcs[srcs.length - 1][2] = 90 - 3 * jumpi;
}
let jumping = 0;
function ju() {
  jumping = setInterval(jump, 200);
}

//一文字ずつ表示する仕組み
let text = '';
let count = 0;
function disp() {
  let i = talk.value.substring(0, count);
  text = i;
  count++;
  let rep = setTimeout("disp()", 60);
  if (count > talk.value.length) {
    clearInterval(rep);
    inputok = true;
  }
}
disp();