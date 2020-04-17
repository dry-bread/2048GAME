'use strict';
var gameCon;
const animationTime = 1000;
var AddFlag = 0;
var nowScore='#nowScore>span';
var bestHistory='#bestHistory>span';
var nowScoreNumber=0;
var bestHistoryNumber=0;
function init() {
    $('#game .con>div').remove();
    if (!localStorage.getItem("gameCon")) {
        gameCon = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        nowScoreNumber=0;
        localStorage.setItem("gameCon", JSON.stringify(gameCon));
        localStorage.setItem("nowScore", JSON.stringify(nowScoreNumber));
        AddNewNumber();
    } else {
        gameCon = JSON.parse(localStorage.getItem("gameCon"));
        nowScoreNumber=JSON.parse(localStorage.getItem("nowScore"));
        bestHistoryNumber=JSON.parse(localStorage.getItem("bestHistory"));
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
function UpDateScore(addScoreNumber){
    nowScoreNumber += addScoreNumber;
    if(nowScoreNumber >bestHistoryNumber){
        bestHistoryNumber=nowScoreNumber;
    }
    $(nowScore).text(nowScoreNumber.toString()) ;
    $(bestHistory).text(bestHistoryNumber.toString()) ;
    localStorage.setItem("nowScore", JSON.stringify(nowScoreNumber));
    localStorage.setItem("bestHistory", JSON.stringify(bestHistoryNumber));

}
//添加数字块
function AddNewCon(x, y, num) {
    x += 1;
    y += 1;
    var adddiv = document.createElement('div');
    adddiv.innerText = num;
    var className = 'number' + num.toString();
    adddiv.classList.add(className);
    var idName = '#c' + x.toString() + y.toString();
    $(idName).append(adddiv);
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
        return 'game over!'
    }
    var choosenIndex = parseInt(Math.random() * emptyCon_x.length);
    var addNumber = 2 * parseInt(1.5 + Math.random());//2或4
    gameCon[emptyCon_x[choosenIndex]][emptyCon_y[choosenIndex]] = addNumber;
    localStorage.setItem("gameCon", JSON.stringify(gameCon));
    AddNewCon(emptyCon_x[choosenIndex], emptyCon_y[choosenIndex], addNumber);
}
//水平合并动画
function LevelCombine(x, init_y, target_y, target_num, shift_combine) {
    x++;
    init_y++;
    target_y++;
    var tempTime = parseInt(animationTime / (Math.abs(target_y - init_y) + 1));
    if (target_y < init_y) {
        var TempIdName;
        var adddiv;
        if (shift_combine == 'shift') {
            var className = 'number' + target_num.toString();
        } else {
            var className = 'number' + (parseInt(target_num / 2)).toString();
        }
        TempIdName = '#c' + x.toString() + init_y.toString() + '>div';
        $(TempIdName).remove();
        for (let temp_y = init_y; temp_y > target_y; temp_y--) {
            adddiv = document.createElement('div');
            adddiv.classList.add(className);
            TempIdName = '#c' + x.toString() + temp_y.toString();
            $(TempIdName).append(adddiv);
            TempIdName = '#c' + x.toString() + temp_y.toString() + '>div'
            // $(TempIdName).animate({ width: "0px" }, tempTime, function () {
            // $(this).remove();
            // });
            $(TempIdName).remove();
        }
        adddiv = document.createElement('div');
        className = 'number' + target_num.toString();
        adddiv.classList.add(className);
        adddiv.innerText = target_num;
        TempIdName = '#c' + x.toString() + target_y.toString();
        $(TempIdName).append(adddiv);

    }
    if (target_y > init_y) {
        var TempIdName;
        var adddiv;
        var className = 'number' + (parseInt(target_num / 2)).toString();
        TempIdName = '#c' + x.toString() + init_y.toString() + '>div';
        $(TempIdName).remove();
        for (let temp_y = init_y; temp_y < target_y; temp_y++) {
            adddiv = document.createElement('div');
            adddiv.classList.add(className);
            TempIdName = '#c' + x.toString() + temp_y.toString();
            $(TempIdName).append(adddiv);
            TempIdName = '#c' + x.toString() + temp_y.toString() + '>div'
            // $(TempIdName).animate({ width: "0px", left: "101px" }, tempTime, function () {
            //     $(this).remove();
            // });
            $(TempIdName).append(adddiv);
        }
        adddiv = document.createElement('div');
        className = 'number' + target_num.toString();
        adddiv.classList.add(className);
        adddiv.innerText = target_num;
        TempIdName = '#c' + x.toString() + target_y.toString() + '>div';
        $(TempIdName).remove();
        TempIdName = '#c' + x.toString() + target_y.toString();
        $(TempIdName).append(adddiv);

    }

}
//垂直合并动画
function VerticalCombine(y, init_x, target_x, target_num, shift_combine) {
    var tempTime = parseInt(animationTime / (Math.abs(target_x - init_x) + 1));
    if (target_x < init_x) {
        var TempIdName;
        var adddiv = document.createElement('div');
        if (shift_combine == 'shift') {
            var className = 'number' + target_num.toString();
        } else {
            var className = 'number' + (parseInt(target_num / 2)).toString();
        }
        adddiv.classList.add(className);
        TempIdName = '#c' + init_x.toString() + y.toString() + '>div';
        $(TempIdName).remove();
        for (let temp_x = init_x; temp_x > target_x; temp_x--) {
            TempIdName = '#c' + temp_x.toString() + y.toString();
            $(TempIdName).append(adddiv);
            TempIdName = '#c' + temp_x.toString() + y.toString() + '>div'
            $(TempIdName).animate({ height: "0px" }, tempTime, function () {
                $(this).remove();
            })
        }
        adddiv.classList.remove(className);
        className = 'number' + target_num.toString();
        adddiv.classList.add(className);
        adddiv.innerText = target_num;
        TempIdName = '#c' + target_x.toString() + y.toString();
        $(TempIdName).append(adddiv);

    }
    if (target_x > init_x) {
        var TempIdName;
        var adddiv = document.createElement('div');
        var className = 'number' + (parseInt(target_num / 2)).toString();
        adddiv.classList.add(className);
        TempIdName = '#c' + init_x.toString() + y.toString() + '>div';
        $(TempIdName).remove();
        for (let temp_x = init_x; temp_x < target_x; temp_y++) {
            TempIdName = '#c' + temp_x.toString() + y.toString();
            $(TempIdName).append(adddiv);
            TempIdName = '#c' + temp_x.toString() + y.toString() + '>div'
            $(TempIdName).animate({ height: "0px", top: "100px" }, tempTime, function () {
                $(this).remove();
            })
        }
        adddiv.classList.remove(className);
        className = 'number' + target_num.toString();
        adddiv.classList.add(className);
        adddiv.innerText = target_num;
        TempIdName = '#c' + target_x.toString() + y.toString();
        $(TempIdName).append(adddiv);

    }

}
//移动
function MoveCon(init_x, init_y, target_x, target_y, target_num) {
    init_x++;
    init_y++;
    target_x++;
    target_y++;
    var targetClassName = 'number' + target_num.toString();
    var initSName = '#c' + init_x.toString() + init_y.toString() + '>div';
    var targetSName = '#c' + target_x.toString() + target_y.toString() + '>div';
    $(initSName).remove();
    $(targetSName).remove();
    targetSName = '#c' + target_x.toString() + target_y.toString();
    var addDiv = document.createElement('div');
    addDiv.classList.add(targetClassName);
    addDiv.innerText = target_num;
    $(targetSName).append(addDiv);
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
                if (temp < i || temp=== -1) {
                    continue;
                }
                else{//下移
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
    $('#game .con>div').remove();
    nowScoreNumber=0;
    $(nowScore).text(nowScoreNumber.toString());
    localStorage.setItem("gameCon", JSON.stringify(gameCon));
    localStorage.setItem("nowScore", JSON.stringify($(nowScore).text()));
    AddNewNumber();
    AddNewNumber();
})