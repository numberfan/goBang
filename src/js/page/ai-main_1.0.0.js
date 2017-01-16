;(function () {

    var width = 600,
        height = 600,
        square = 40,
        cols = width/square,
        rows = cols,
        isGameOver = false, //游戏是否结束
        personTurn = true, //玩家顺序
        container = $(".game-container"),
        coordinate = [],    //（0:无块，1:黑色，2:白色）
        allRounte = [],     //所有可能赢得路线
        rounteCount = 0,    //路线计数
        personWin = [],     //赢法数组
        computerWin = [];

    /*
        黑子(1)：人
        白子(2)：电脑
     */
    
    function Gobang() {}

    Gobang.prototype.setComputerChess = function (x, y) {
        var ele = $(".repeat[data-x=" + x + "][data-y=" + y + "]"),
            hasSquare = ele.attr("data-val");

        //当前有块
        if (hasSquare == "true") {
            return false;
        }

        coordinate[x][y] = 2;
        ele.addClass("white").attr("data-val", true);
        return true;
    };

    //玩家
    Gobang.prototype.play = function() {
        var self = this;

        container.click(function (event) {
            if (isGameOver) {
                console.log("游戏结束");
                return;
            }

            if (!personTurn) {
                console.log("现在是玩家顺序");
                return;
            }

            var ele = $(event.target),
                nowClass = "black",
                hasSquare = ele.attr("data-val"),
                x = 0,
                y = 0;

            //当前有块,或者事件对象为外容器
            if (hasSquare == "true" || !ele.hasClass("repeat")) {
                return;
            }
            x = ele.attr("data-x");
            y = ele.attr("data-y");

            coordinate[x][y] = 1;
            ele.addClass(nowClass).attr("data-val", true);

            personTurn = false;

            //玩家赢法数组
            for (var i = 0; i < rounteCount; i++) {
                if (allRounte[x][y][i]) {
                    personWin[i]++;
                    if (personWin[i] == 5) {
                        console.log("玩家赢了！");
                        isGameOver = true;
                    }
                }
            }

            if (!isGameOver) {
                self.computerPlay();
            }
        });
    };

    Gobang.prototype.computerPlay = function () {
        var personScore = [],   //权重
            computerScore = [],
            maxScore = 0,       //权重值最大的点
            maxX = 0,           //坐标
            maxY = 0;

        //初始化personScore、computerScore
        for (var i = 0; i < rows; i++) {
            personScore[i] = [];
            computerScore[i] = [];
            for (var j = 0; j < cols; j++) {
                personScore[i][j] = 0;
                computerScore[i][j] = 0;
            }
        }

        //计算玩家、电脑在棋盘上每一点的权重
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                if (coordinate[i][j] == 0) {
                    for (var k = 0; k < rounteCount; k++) {
                        if (allRounte[i][j][k]) {
                            if (personWin[k] == 1) {
                                personScore[i][j] += 10;
                            } else if (personWin[k] == 2) {
                                personScore[i][j] += 50;
                            } else if (personWin[k] == 3) {
                                personScore[i][j] += 100;
                            } else if (personWin[k] == 4) {
                                personScore[i][j] += 200;
                            }

                            if (computerWin[k] == 1) {
                             computerScore[i][j] += 12;
                             } else if (computerWin[k] == 2) {
                             computerScore[i][j] += 52;
                             } else if (computerWin[k] == 3) {
                             computerScore[i][j] += 120;
                             } else if (computerWin[k] == 4) {
                             computerScore[i][j] += 220;
                             }
                        }
                    }
                }
            }
        }

        //落子的最佳位置
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {

                if (computerScore[i][j] > maxScore) {
                    maxScore = computerScore[i][j];
                    maxX = i;
                    maxY = j;
                }

                if (personScore[i][j] > maxScore && personScore[i][j] > computerScore[i][j]) {
                    maxScore = personScore[i][j];
                    maxX = i;
                    maxY = j;
                }
            }
        }

        var isSetWell = this.setComputerChess(maxX, maxY);

        //落子
        if (isSetWell == true) {
            personTurn = true;
            for (var i = 0; i < rounteCount; i++) {
                if (allRounte[maxX][maxY][i]) {
                    computerWin[i]++;
                    if (computerWin[i] == 5) {
                        console.log("电脑赢了！");
                    }
                }
            }
        }
    };

    Gobang.prototype.init = function() {
        //网格
        for (var i = 0; i < rows; i++) {
            coordinate[i] = [];
            for (var j = 0; j < cols; j++) {
                coordinate[i][j] = 0;
                var _div = $("<div></div>");

                _div.css({
                    width: square + "px",
                    height: square + "px",
                    top: i*square + "px",
                    left: j*square + "px"
                }).attr({
                    "data-x": i,
                    "data-y": j,
                    "data-val": false
                }).addClass("repeat");

                container.append(_div);
            }
        }

        //初始化allRounte
        for (var i = 0; i < cols; i++) {
            allRounte[i] = [];
            for (var j = 0; j < rows; j++) {
                allRounte[i][j] = [];
            }
        }

        //水平
        for (var i = 0; i < cols; i++) {
            for (var j = 0; j < rows-4; j++) {
                for (var k = 0; k <5; k++) {
                    allRounte[i][j+k][rounteCount] = true;
                }
                rounteCount++;
            }
        }

        //垂直
        for (var i = 0; i < cols-4; i++) {
            for (var j = 0; j < rows; j++) {
                for (var k = 0; k < 5; k++) {
                    allRounte[i+k][j][rounteCount] = true;
                }
                rounteCount++;
            }
        }

        //左斜角
        for (var i = 0; i < cols-4; i++) {
            for (var j = 0; j < rows-4; j++) {
                for (var k = 0; k < 5; k++) {
                    allRounte[i+k][j+k][rounteCount] = true;
                }
                rounteCount++;
            }
        }

        //右斜角
        for (var i = 4; i < cols; i++) {
            for (var j = 0; j < rows-4; j++) {
                for (var k = 0; k < 5; k++) {
                    allRounte[i-k][j+k][rounteCount] = true;
                }
                rounteCount++;
            }
        }

        for (var i = 0; i < rounteCount; i++) {
            personWin[i] = 0;
            computerWin[i] = 0;
        }

        this.play();
    };

    var sna = new Gobang();
    sna.init();

})();
