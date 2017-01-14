;(function () {

    var width = 600,
        height = 600,
        square = 40,
        cols = width/square,
        rows = cols,
        container = $(".game-container"),
        coordinate = [];    //（0:无块，1:黑色，2:白色）
    
    function Gobang() {

    }

    //coordinate（0:无块，1:黑色，2:白色）
    Gobang.prototype.getCoordinateVal = function(colorClass) {
        if (!colorClass) return;

        if (colorClass == "black") {
            return 1;
        } else if (colorClass == "white") {
            return 2;
        } else {
            return 0;
        }
    };

    //坐标范围
    Gobang.prototype.isWithinScope = function(x, y) {
        var xMin = 0,
            xMax = coordinate.length-1,
            yMin = 0,
            yMax = coordinate[0].length - 1;

        if (x >= xMin && x <= xMax && y >= yMin && y <= yMax) {
            return true
        }
        return false;
    };

    //擦除
    Gobang.prototype.erase = function (x, y, colorClass) {
        var oneLineArr = this.isAbital(x, y, colorClass);
        if (oneLineArr && oneLineArr.length >= 5) {
            for (var i = 0; i < 5; i++) {

                var _x = oneLineArr[i][0],
                    _y = oneLineArr[i][1];

                $(".repeat[data-x=" + _x + "][data-y=" + _y + "]")
                    .removeClass("black white")
                    .attr("data-val", false);

                coordinate[_x][_y] = 0;
            }
        }
    };

    //玩家
    Gobang.prototype.play = function() {
        var lastClass = null,   //标记上次棋子颜色
            self = this;

        container.click(function (event) {
            var ele = $(event.target),
                nowClass = "black",
                hasSquare = ele.attr("data-val"),
                twoDX = 0,
                twoDY = 0;

            //当前有块,或者事件对象为外容器
            if (hasSquare == "true" || !(ele.hasClass("repeat"))) {
                return;
            }

            if (lastClass == "black") {
                nowClass = "white";
            } else {
                nowClass = "black";
            }

            lastClass = nowClass;
            twoDX = ele.attr("data-x");
            twoDY = ele.attr("data-y");
            coordinate[twoDX][twoDY] = self.getCoordinateVal(nowClass);
            ele.addClass(nowClass).attr("data-val", true);

            //五子判断
            var timer = setTimeout(function () {
                self.erase(twoDX, twoDY, nowClass);
                clearTimeout(timer);
            }, 500);

        });
    };

    //五子
    Gobang.prototype.isAbital = function(x, y, colorClass) {

        if (!x || !y || !colorClass) return;

        var oneLine = 1,
            oneLineArr = [];
            x = parseInt(x),
            y = parseInt(y),
            aimVal = this.getCoordinateVal(colorClass);

        //上下
        for (var i = 1; i <= 5; i++) { //上
            if (!this.isWithinScope(x-i, y) || coordinate[x-i][y] != aimVal) break;

            ++oneLine;
            oneLineArr.push([x-i, y]);
        }
        for (var i = 1; i <= 5; i++) { //下
            if (!this.isWithinScope(x+i, y) || coordinate[x+i][y] != aimVal) break;

            ++oneLine;
            oneLineArr.push([x+i, y]);
        }
        if (oneLine >= 5) {
            oneLineArr.unshift([x, y]);
            return oneLineArr;
        }

        //左右
        oneLine = 1;
        oneLineArr = [];

        for (var i = 1; i <= 5; i++) { //左
            if (!this.isWithinScope(x, y-i) || coordinate[x][y-i] != aimVal) break;

            ++oneLine;
            oneLineArr.push([x, y-i]);
        }
        for (var i = 1; i <= 5; i++) { //右
            if (!this.isWithinScope(x, y+i) || coordinate[x][y+i] != aimVal) break;

            ++oneLine;
            oneLineArr.push([x, y+i]);
        }
        if (oneLine >= 5) {
            oneLineArr.unshift([x, y]);
            return oneLineArr;
        }

        //左斜角
        oneLine = 1;
        oneLineArr = [];

        for (var i = 1; i <= 5; i++) { //左
            if (!this.isWithinScope(x-i, y-i) || coordinate[x-i][y-i] != aimVal) break;

            ++oneLine;
            oneLineArr.push([x-i, y-i]);
        }
        for (var i = 1; i <= 5; i++) { //右
            if (!this.isWithinScope(x+i, y+i) || coordinate[x+i][y+i] != aimVal) break;

            ++oneLine;
            oneLineArr.push([x+i, y+i]);
        }
        if (oneLine >= 5) {
            oneLineArr.unshift([x, y]);
            return oneLineArr;
        }

        //右斜角
        oneLine = 1;
        oneLineArr = [];

        for (var i = 1; i <= 5; i++) { //左
            if (!this.isWithinScope(x+i, y-i) || coordinate[x+i][y-i] != aimVal) break;

            ++oneLine;
            oneLineArr.push([x+i, y-i]);
        }
        for (var i = 1; i <= 5; i++) { //右
            if (!this.isWithinScope(x-i, y+i) || coordinate[x-i][y+i] != aimVal) break;

            ++oneLine;
            oneLineArr.push([x-i, y+i]);
        }
        if (oneLine >= 5) {
            oneLineArr.unshift([x, y]);
            return oneLineArr;
        }

        return;

    };

    //初始化所有可能的路线
    Gobang.prototype.initRounte = function () {

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

        this.play();
    };


    var sna = new Gobang();
    sna.init();

})();
