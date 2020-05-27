const canvas = document.getElementById('maincanvas');
const ctx = canvas.getContext('2d');
/*背景色
ctx.fillStyle = "green";
ctx.fillRect(0, 0, canvas.width, canvas.height);
*/
var srcs = [
  ['back.png',0,0],
  ['mito.png',40,240]
];

var images = [];
for (var i in srcs){
  images[i] = new Image();
  images[i].src = srcs[i][0];
}

var loadedCount = 1;
for (var i in images){
  images[i].addEventListener('load',function(){
    if (loadedCount == images.length){
      for(var j in images){
        ctx.drawImage(images[j],srcs[j][1],srcs[j][2]);
        console.log('a');
      }
    }
    console.log('b');
    loadedCount++;
  },false);
}

var x = 40;
var y = 240;
var n = 5;
var upswitch = 1;
function jump(){
  ctx.clearRect(0, 0, 400, 400);
  ctx.drawImage(images[0],0,0);
  ctx.drawImage(images[1],x,y);

  if (y <= 225){
    upswitch = 0;
    n = n ;
    console.log('down');
  }else if (y >= 240) {
    upswitch = 1;
    n = n - 11;
  } else { 
  }

  if (upswitch == 0){
    n = n + 1;
    y = y + n;
  }else{
    n = n + 1;
    y = y + n;
  }

  console.log(n);
  console.log(y);
}
setInterval(jump,100);