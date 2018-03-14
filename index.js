var chess = document.getElementById("chess");
var context = chess.getContext('2d');
var img = new Image();
var me = true;
var chessBoard = new Array();
var over = false;
img.src = 'background.jpg';

// 赢法数组,三维数组
var wins = [];


for(var i=0;i<15;i++){
    wins[i] = [];
    for(var j=0;j<15;j++){
        wins[i][j] = [];
    }
}
for(var i=0;i<15;i++){
    chessBoard[i] = [];
    for(var j=0;j<15;j++){
        chessBoard[i][j] = 0;
    }
}

// 赢的情况(数量)
var count = 0;
// 横向
for(var i=0;i<15;i++){
    for(var j=0;j<11;j++){
        for(var k=0;k<5;k++){
            wins[i][j+k][count] = true;
        }
    count++;
    }
}
//竖向
for(var i=0;i<15;i++){
    for(var j=0;j<11;j++){
        for(var k=0;k<5;k++){
            wins[j+k][i][count] = true;
        }
        count++;
    }
}
//斜向
for(var i=0;i<11;i++){
    for(var j=0;j<11;j++){
        for(var k=0;k<5;k++){
            wins[i+k][j+k][count] = true;
        }
        count++;
    }
}
//反斜向
for(var i=0;i<11;i++){
    for(var j=14;j>3;j--){
        for(var k=0;k<5;k++){
            wins[i+k][j-k][count] = true;
        }
    count++;  
    }
}
console.log(count);

//定义我赢了和电脑赢了数组
var iWin = new Array();
var pcWin = new Array();
for(var i=0;i<count;i++){
    iWin[i] = 0;
    pcWin[i] = 0;
}

img.onload = function(){
    context.drawImage(img,0,0,455,455);
    drawLine();
}
// 画网格线
function drawLine(){
    context.strokeStyle = '#aaa';
    context.lineWidth = 1;

    for(var i=0;i<435;i+=30){
        context.moveTo(18,18+i);
        context.lineTo(438,18+i);
        context.stroke();
        context.moveTo(18+i,18);
        context.lineTo(18+i,438);
        context.stroke();
    }
}

// 棋子
var step = function(i,j,me){
    context.beginPath();
    context.arc(18+30*i,18+30*j,13,0,2*Math.PI);
    context.closePath();
    var chessStyle = context.createRadialGradient(15+i*30+2,15+j*30-2,15,15+i*30,15+j*30,0);
    if(me){
        chessStyle.addColorStop(0,"#0a0a0a");
        chessStyle.addColorStop(1,"#636363");
    }else{
        chessStyle.addColorStop(0, "#D1D1D1");
        chessStyle.addColorStop(1, "#F9F9F9");
    }
    context.fillStyle = chessStyle;
    context.fill();
}

// 落子
// chessBoard为零则表示该点无棋子，可以落子，否则不能落子
chess.onclick = function(e){
    var x = e.offsetX;
    var y = e.offsetY;
    var i = Math.floor(x/30);
    var j = Math.floor(y/30);
    if(chessBoard[i][j]==0){
        step(i,j,me);
        chessBoard[i][j] = 1;   
        for(var k=0;k<count;k++){
            if(wins[i][j][k]){
                iWin[k]++;
                pcWin[k] = 6;
                if(iWin[k]==5){
                    window.alert('小伙子有前途，居然赢了我的Ai');
                    over = true;
                }
            }
        }
        if(!over){
            me = !me;
            Ai();
        }
    }  
}

var Ai = function(){
    var myScore = [];
    var pcScore = [];
    var max = 0;//max为各点落子权重
    var u = 0,v = 0;
    for(var i=0;i<15;i++){
        myScore[i] = [];
        pcScore[i] = [];
        for(var j=0;j<15;j++){
            myScore[i][j] = 0;
            pcScore[i][j] = 0;
        }
    }
// 落子权重
for(var i=0;i<15;i++){
    for(var j=0;j<15;j++){
        if(chessBoard[i][j]==0){
            for(var k=0;k<count;k++){
                if(wins[i][j][k]){
                    if(iWin[k]==1){
                        myScore[i][j] += 200;//黑方一个棋子
                    }else if(iWin[k]==2){
                        myScore[i][j] += 400;
                    }else if(iWin[k]==3){
                        myScore[i][j] += 2000;
                    }else if(iWin[k]==4){
                        myScore[i][j] += 10000;
                    }
                    if(pcWin[k]==1){
                        pcScore[i][j] += 220;
                    }else if(pcWin[k]==2){
                        pcScore[i][j] += 420;
                    }else if(pcWin[k]==3){
                        pcScore[i][j] += 2100;
                    }else if(pcWin[k]==4){
                        pcScore[i][j] += 20000;
                    }
                                        
                }
            }
            // 根据各点权重确定PC最佳落子点
            if(myScore[i][j]>max){
                max = myScore[i][j];
                u = i;
                v = j;
            }else if(myScore[i][j]==max){
                if(pcScore[i][j]>pcScore[u][v]){
                    u = i;
                    v = j;
                }
            }
            if(pcScore[i][j]>max){
                u = i;
                v = j;
            }else if(pcScore[i][j]==max){
                if(myScore[i][j]>myScore[u][v]){
                    u = i;
                    v = j;
                }
            }
        }
    }
}

step(u,v,false); //得到最佳落子点之后，为其落白点（PC）
chessBoard[u][v] = 2;

for(var k=0;k<count;k++){
    if(wins[u][v][k]){
        pcWin[k]++;
        iWin[k] = 6;
        if(pcWin[k] == 5){
            window.alert("继续努力哦！我的Ai可是很强的");
            over = true;
        }
    }
}
if(!over){
    me = !me;
}
}

