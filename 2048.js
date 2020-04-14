var gameCon;
if(!localStorage.getItem("gameCon")){
    gameCon=[
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ];
    localStorage.setItem("gameCon", JSON.stringify(gameCon));
}else{
    gameCon = JSON.parse(localStorage.getItem("gameCon"));
}

//寻找空白区域，随机放入2或4
function AddNew(){
    var emptyCon = $('#game .con').filter(function(){
        return !(this.children[0]);
    });
    if(emptyCon.length===0){
        return 'game over!'
    }
    var choosenIndex = parseInt(Math.random()*emptyCon.length) ;
    var addNumber=2*parseInt(1.5+Math.random());//2或4
    document.createElement('div')
    emptyCon[choosenIndex]

}