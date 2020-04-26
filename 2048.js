'use strict';
var gameCon;
const animationTime = 20;
var AddFlag = 0;
var nowScore = '#nowScore>span';
var bestHistory = '#bestHistory>span';
var nowScoreNumber = 0;
var bestHistoryNumber = 0;
var callBackCount=0;
var gameconDiv='.gamecon';
function init() {

    $('.gamecon>div').remove();
    if (!localStorage.getItem("gameCon")) {
        gameCon = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        nowScoreNumber = 0;
        localStorage.setItem("gameCon", JSON.stringify(gameCon));
        localStorage.setItem("nowScore", nowScoreNumber);
        AddNewNumber();
    } else {
        gameCon = JSON.parse(localStorage.getItem("gameCon"));
        nowScoreNumber = Number(localStorage.getItem("nowScore"));
        bestHistoryNumber = Number(localStorage.getItem("bestHistory"));
        UpDateScore(0);
    }
    gameCon.forEach(function (element, index, array) {
        array[index].forEach(function (ele, ind, arr) {
            if (ele != 0) {
                AddNewCon(index, ind, ele)
            }
        });
    });

}
//更新分数
function UpDateScore(addScoreNumber) {
    nowScoreNumber += addScoreNumber;
    if (nowScoreNumber > bestHistoryNumber) {
        bestHistoryNumber = nowScoreNumber;
    }
    $(nowScore).text(nowScoreNumber.toString());
    $(bestHistory).text(bestHistoryNumber.toString());
    localStorage.setItem("nowScore", nowScoreNumber);
    localStorage.setItem("bestHistory", bestHistoryNumber);

}
//添加数字块
function AddNewCon(x, y, num) {
    x += 1;
    y += 1;
    var adddiv = document.createElement('div');
    adddiv.innerText = num;
    var className = 'number' + num.toString();
    var positionName='c'+x.toString()+y.toString();
    adddiv.classList.add(className);
    adddiv.classList.add(positionName);
    adddiv.classList.add('comeout');
    $(gameconDiv).append(adddiv);
    // idName = '#c' + x.toString() + y.toString()+'>div';
    // $(idName).hide();
    // $(idName).fadeIn(10);
}
function CheckLose() {
    var gameConTemp = gameCon;
    for (let dp_i = 0; dp_i < 3; dp_i++) {
        for (let dp_j = 0; dp_j < 3; dp_j++) {
            if (gameConTemp[dp_i][dp_j] === gameConTemp[dp_i][dp_j + 1] || gameConTemp[dp_i][dp_j] === gameConTemp[dp_i + 1][dp_j]) {
                return 'notlose';
            }
        }

    }
    for (let dp_i = 0; dp_i < 3; dp_i++) {
        if (gameConTemp[dp_i][3] === gameConTemp[dp_i + 1][3]) {
            return 'notlose';
        }


    }
    for (let dp_i = 0; dp_i < 3; dp_i++) {
        if (gameConTemp[3][dp_i] === gameConTemp[3][dp_i + 1]) {
            return 'notlose';
        }
    }
    return 'lose';

}

//寻找空白区域，随机放入2或4
function AddNewNumber() {
    var emptyCon_x = [];
    var emptyCon_y = [];
    gameCon.forEach(function (element, index, array) {
        array[index].forEach(function (ele, ind, arr) {
            if (ele === 0) {
                emptyCon_x.push(index);
                emptyCon_y.push(ind);
            }
        });
    });
    if (emptyCon_x.length === 0) {
        if (CheckLose() === 'lose') {
            $('.youWin>p').text('LOSE!');
            $('.youWin').show();
            return;
        } else {
            return;
        }
    }
    var choosenIndex = parseInt(Math.random() * emptyCon_x.length);
    var addNumber = 2 * parseInt(1.5 + Math.random());//2或4
    gameCon[emptyCon_x[choosenIndex]][emptyCon_y[choosenIndex]] = addNumber;
    localStorage.setItem("gameCon", JSON.stringify(gameCon));
    AddNewCon(emptyCon_x[choosenIndex], emptyCon_y[choosenIndex], addNumber);
    if (emptyCon_x.length === 1) {
        if (CheckLose() === 'lose') {
            $('.youWin>p').text('Game Over');
            $('.youWin').show();
            return;
        }
    }

}
//移动
function MoveCon(init_x, init_y, target_x, target_y, target_num) {
    init_x++;
    init_y++;
    target_x++;
    target_y++;
    var initCName = '.c' + init_x.toString() + init_y.toString();
    var initClass = 'c' + init_x.toString() + init_y.toString();
    var targetCName = '.c' + target_x.toString() + target_y.toString();
    var targetClass= 'c' + target_x.toString() + target_y.toString();
    var tempNumClass='number'+target_num.toString();
    $(targetCName).remove();
    $(initCName).addClass(targetClass).removeClass(initClass);
    $(targetCName).addClass(tempNumClass);
    $(targetCName).text(target_num);
    if (target_num === 2048) {
        $('youWin').text('YOU WIN!');
        $('youWin').show();
    }
}
//向左
function LeftArrow() {
    for (let i = 0; i < 4; i++) {
        // console.log('step-1:' + i);
        // console.log(gameCon);
        for (let j = 0; j < 4; j++) {
            var temp;
            if (gameCon[i][j] != 0) {
                for (let jtemp = j + 1; jtemp < 4; jtemp++) {
                    if (gameCon[i][jtemp] != 0 && gameCon[i][jtemp] != gameCon[i][j]) {
                        break;
                    }
                    if (gameCon[i][jtemp] === 0) {
                        continue;
                    } else {
                        gameCon[i][j] = gameCon[i][j] + gameCon[i][jtemp];//合并
                        gameCon[i][jtemp] = 0;
                        AddFlag = 1;
                        //LevelCombine(i,j,jtemp,gameCon[i][j],'combine');
                        MoveCon(i, jtemp, i, j, gameCon[i][j]);
                        UpDateScore(gameCon[i][j]);
                        break;
                    }
                }
                temp = gameCon[i].indexOf(0);
                // console.log(i + " " + j + 'first zero:' + temp);
                if (temp > j || temp === -1) {
                    continue;
                } else {//左移
                    gameCon[i][temp] = gameCon[i][j];
                    gameCon[i][j] = 0;
                    AddFlag = 1;
                    //LevelCombine(i,j,temp,gameCon[i][temp],'shift');
                    // console.log('step-2');
                    // console.log(gameCon);
                    MoveCon(i, j, i, temp, gameCon[i][temp]);

                }
            }
        }
    }
    // console.log('step-3');
    // console.log(gameCon);

}
//向右
function RightArrow() {
    for (let i = 0; i < 4; i++) {
        for (let j = 3; j >= 0; j--) {
            var temp;
            if (gameCon[i][j] != 0) {
                for (let jtemp = j - 1; jtemp >= 0; jtemp--) {
                    if (gameCon[i][jtemp] != 0 && gameCon[i][jtemp] != gameCon[i][j]) {
                        break;
                    }
                    if (gameCon[i][jtemp] === 0) {
                        continue;
                    } else {
                        gameCon[i][j] = gameCon[i][j] + gameCon[i][jtemp];//合并
                        gameCon[i][jtemp] = 0;
                        AddFlag = 1;
                        //LevelCombine(i, j, jtemp, gameCon[i][j], 'combine');
                        MoveCon(i, jtemp, i, j, gameCon[i][j]);
                        UpDateScore(gameCon[i][j]);
                        break;
                    }

                }
                temp = gameCon[i].lastIndexOf(0);
                if (temp < j || temp === -1) {
                    continue;
                }
                else {//右移
                    gameCon[i][temp] = gameCon[i][j];
                    gameCon[i][j] = 0;
                    AddFlag = 1;
                    //LevelCombine(i, j, temp, gameCon[i][temp], 'shift');
                    MoveCon(i, j, i, temp, gameCon[i][temp]);
                }

            }

        }

    }
}
//向下
function DownArrow() {
    for (let j = 0; j < 4; j++) {
        for (let i = 3; i >= 0; i--) {
            var temp;
            if (gameCon[i][j] != 0) {
                for (let itemp = i - 1; itemp >= 0; itemp--) {
                    if (gameCon[itemp][j] != 0 && gameCon[itemp][j] != gameCon[i][j]) {
                        break;
                    }
                    if (gameCon[itemp][j] === 0) {
                        continue;
                    } else {
                        gameCon[i][j] = gameCon[i][j] + gameCon[itemp][j];//合并
                        gameCon[itemp][j] = 0;
                        AddFlag = 1;
                        //VerticalCombine(j, i, itemp, gameCon[i][j], 'combine');
                        MoveCon(itemp, j, i, j, gameCon[i][j]);
                        UpDateScore(gameCon[i][j]);
                        break;
                    }

                }
                for (let ii = 3; ii >= 0; ii--) {
                    if (gameCon[ii][j] === 0) {
                        temp = ii;
                        break;
                    }
                    if (ii === 0) {
                        temp = -1;
                    }

                }
                if (temp < i || temp === -1) {
                    continue;
                }
                else {//下移
                    gameCon[temp][j] = gameCon[i][j];
                    gameCon[i][j] = 0;
                    AddFlag = 1;
                    //VerticalCombine(i, j, temp, gameCon[temp][j], 'shift');
                    MoveCon(i, j, temp, j, gameCon[temp][j]);
                }

            }

        }

    }
}
//向上
function UpArrow() {
    for (let j = 0; j < 4; j++) {
        for (let i = 0; i < 4; i++) {
            var temp;
            if (gameCon[i][j] != 0) {
                for (let itemp = i + 1; itemp < 4; itemp++) {
                    if (gameCon[itemp][j] != 0 && gameCon[itemp][j] != gameCon[i][j]) {
                        break;
                    }
                    if (gameCon[itemp][j] === 0) {
                        continue;
                    } else {
                        gameCon[i][j] = gameCon[i][j] + gameCon[itemp][j];//合并
                        gameCon[itemp][j] = 0;
                        AddFlag = 1;
                        //VerticalCombine(j, i, itemp, gameCon[i][j], 'combine');
                        MoveCon(itemp, j, i, j, gameCon[i][j]);
                        UpDateScore(gameCon[i][j]);
                        break;
                    }

                }
                temp = gameCon.findIndex((item) => {

                    if (item[j] === 0) return true;
                })
                if (temp > i || temp === -1) {
                    continue;
                }
                else {//上移
                    gameCon[temp][j] = gameCon[i][j];
                    gameCon[i][j] = 0;
                    AddFlag = 1;
                    //VerticalCombine(i, j, temp, gameCon[temp][j], 'shift');
                    MoveCon(i, j, temp, j, gameCon[temp][j]);
                }

            }

        }

    }
}

init();
AddNewNumber();
//获取外设操作
$(window).keydown(function (e) {
    switch (e.keyCode) {
        case 37:
            LeftArrow();
            if (AddFlag === 1) {
                AddNewNumber();
                AddFlag = 0;
            }
            break;
        case 38:
            UpArrow();
            if (AddFlag === 1) {
                AddNewNumber();
                AddFlag = 0;
            }
            break;
        case 39:
            RightArrow();
            if (AddFlag === 1) {
                AddNewNumber();
                AddFlag = 0;
            }
            break;
        case 40:
            DownArrow();
            if (AddFlag === 1) {
                AddNewNumber();
                AddFlag = 0;
            }
            break;
        default:
            break;
    }
    console.log(e.keyCode);
})
//重新游戏
$('button#replay').click(function (e) {

    gameCon = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    $('.gamecon>div').remove();
    nowScoreNumber = 0;
    $(nowScore).text(nowScoreNumber.toString());
    localStorage.setItem("gameCon", gameCon);
    localStorage.setItem("nowScore", nowScoreNumber);
    AddNewNumber();
    AddNewNumber();
})
$(window).click(function () {
    $('.youWin').hide();
});
var startX;
var startY;
var moveEndX;
var moveEndY;
var X;
var Y;
$("body").on("touchstart", function (e) {
    // 判断默认行为是否可以被禁用
    if (e.cancelable) {
        // 判断默认行为是否已经被禁用
        if (!e.defaultPrevented) {
            e.preventDefault();
        }
    }
    startX = e.originalEvent.changedTouches[0].pageX,
    startY = e.originalEvent.changedTouches[0].pageY;
});
$(window).on("touchmove", function (e) {
    // 判断默认行为是否可以被禁用
    if (e.cancelable) {
        // 判断默认行为是否已经被禁用
        if (!e.defaultPrevented) {
            e.preventDefault();
        }
    }
});
$(window).on("touchend", function (e) {
    // 判断默认行为是否可以被禁用
    if (e.cancelable) {
        // 判断默认行为是否已经被禁用
        if (!e.defaultPrevented) {
            e.preventDefault();
        }
    }
    moveEndX = e.originalEvent.changedTouches[0].pageX,
    moveEndY = e.originalEvent.changedTouches[0].pageY,
    X = moveEndX - startX,
    Y = moveEndY - startY;
    // //左右滑
    if (Math.abs(X)>Math.abs(Y) ) {
        if(X<-30){//左滑
            LeftArrow();
            if (AddFlag === 1) {
                AddNewNumber();
                AddFlag = 0;
            }
        }
        if(X>30){//右滑
            RightArrow();
            if (AddFlag === 1) {
                AddNewNumber();
                AddFlag = 0;
            }
        }
    }
    //上下滑
    if (Math.abs(X)<Math.abs(Y) ) {
        if(Y<-30){//上滑
            UpArrow();
            if (AddFlag === 1) {
                AddNewNumber();
                AddFlag = 0;
            }
        }
        if(Y>30){//下滑
            DownArrow();
            if (AddFlag === 1) {
                AddNewNumber();
                AddFlag = 0;
            }
        }else{
            $('.youWin').hide();
        }
        

    }
});
$('.youWin').on("touchstart",function(){//重新开始
    $('.youWin').hide();
        gameCon = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        $('.gamecon>div').remove();
        nowScoreNumber = 0;
        $(nowScore).text(nowScoreNumber.toString());
        localStorage.setItem("gameCon", gameCon);
        localStorage.setItem("nowScore", nowScoreNumber);
        AddNewNumber();
        AddNewNumber();

    
})
$('button').on("touchstart",function(){//replay手机端
    gameCon = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    $('.gamecon>div').remove();
    nowScoreNumber = 0;
    $(nowScore).text(nowScoreNumber.toString());
    localStorage.setItem("gameCon", gameCon);
    localStorage.setItem("nowScore", nowScoreNumber);
    AddNewNumber();
    AddNewNumber();
});
