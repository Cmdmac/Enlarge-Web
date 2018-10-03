<template>
    <div>
        <div ref="box" class="box">
            <div ref="boxHeader" class="boxHeader">
                <div ref="title" class="title">{{title}}</div>
                <div ref="button" class="button">
                    <div class="minimize"></div>
                    <div class="maximize"></div>
                    <div class="close"></div>
                </div>
            </div>
            <div ref="boxSide" class="boxSide">
                <div ref="boxN" class="boxN"></div>
                <div ref="boxE" class="boxE"></div>
                <div ref="boxS" class="boxS"></div>
                <div ref="boxW" class="boxW"></div>
                <div ref="boxNE" class="boxNE"></div>
                <div ref="boxES" class="boxES"></div>
                <div ref="boxSW" class="boxSW"></div>
                <div ref="boxWN" class="boxWN"></div>
            </div>
        </div>
        <!--<button ref="showButton" class="showButton"><span>[_]</span>-->
            <!--<p>居然关掉人家，讨厌~</p>-->
            <!--<p>快打开</p></button>-->
        <div id="virtualBox" class="virtualBox"></div>
    </div>
</template>

<script>
    export default {
        name: 'Window',
        props: {extras: Object},
        data() {
            return {
                title:  this.extras.name
            }
        },

        mounted: function () {
            this.changeSize();
            this.dragDiv();
            this.boxButton();
            //eslint-disable-next-line
//            console.log("mounted");
            //eslint-disable-next-line
//            console.log(this.extras);
//            this.$set(this.title, this.$props['extras']);
        },

        activated: function () {
            //eslint-disable-next-line
//            console.log("mounted");
            //eslint-disable-next-line
//            console.log(this.extras.name);
//            this.$set(this.title, this.extras.name);
        },

        methods: {
            //拖扯box函数
            dragDiv() {
                var box = this.$refs.box;
                var boxHeader = this.$refs.boxHeader;
                var bDraging = false;
                var disX = 0;
                var disY = 0;
                //记录鼠标按下时距离box左、上边框距离
                boxHeader.onmousedown = function (e) {
                    bDraging = true;
                    document.body.style.cursor = "move";
                    var event = e || window.event;
                    disX = event.clientX - box.offsetLeft;
                    disY = event.clientY - box.offsetTop;
                    //拖动box
                    document.onmousemove = function (e) {
                        if (!bDraging) return false;
                        document.body.style.cursor = "move";
                        var event = e || window.event;
                        var boxX = event.clientX - disX;
                        var boxY = event.clientY - disY;
                        var maxX = document.body.scrollWidth - box.offsetWidth;
                        var maxY = document.body.offsetHeight - box.offsetHeight;
                        boxX = (boxX < 0) ? 0 : boxX;
                        boxY = (boxY < 0) ? 0 : boxY;
                        boxX = (boxX > maxX) ? maxX : boxX;
                        boxY = (boxY > maxY) ? maxY : boxY;
                        box.style.left = boxX + "px";
                        box.style.top = boxY + "px";
                    };
                    document.onmouseup = function () {
                        bDraging = false;
                        document.body.style.cursor = "";
                    };
                    return false;
                };
            },
            changeSize() {
                var box = this.$refs.box;
                var virtualBox = this.$refs.virtualBox;
                var content = this.$refs.boxSide;
                var boxSide = content.getElementsByTagName("div");
                var bSizeChanging = false;
                var bMousedowning = false;
                //box是否正在改变 & 鼠标是否正在按下
                var originalWidth = box.offsetWidth;
                //box最原始宽度
                var originalHeight = box.offsetHeight;
                //box最原始高度
                for (var i = 0; i < boxSide.length; i++) {
                    //遍历boxside，监听鼠标
                    boxSide[i].index = i;
                    boxSide[i].onmouseover = function () {
                        if (bMousedowning) return false;
                        changeCursor(true, this.index);
                    };
                    boxSide[i].onmouseout = function () {
                        if (bMousedowning) return false;
                        changeCursor(false, this.index);
                    };
                    boxSide[i].onmousedown = function (e) {
                        var event = e || window.event;
                        var index = this.index;
                        var aBoxPrevious = new Array();
                        //记录box上一次的状态
                        aBoxPrevious["clientX"] = event.clientX;
                        aBoxPrevious["clientY"] = event.clientY;
                        aBoxPrevious["left"] = box.offsetLeft;
                        aBoxPrevious["top"] = box.offsetTop;
                        aBoxPrevious["width"] = box.offsetWidth;
                        aBoxPrevious["height"] = box.offsetHeight;
                        bMousedowning = true;
                        bSizeChanging = true;
                        showVirtualBox(virtualBox, aBoxPrevious);
                        document.onmousemove = function (event) {
                            if (!bSizeChanging) return false;
                            changeVirtualBoxSize(event, aBoxPrevious, index);
                        };
                        document.onmouseup = function () {
                            changeBoxSize(virtualBox)
                            hideVirtualBox(virtualBox);
                            bSizeChanging = false;
                            bMousedowning = false;
                            changeCursor(false, index);
                        };
                        return false;
                    };
                }
                //改变鼠标指针样式
                var changeCursor = function (bIsShowing, index) {
                    if (bIsShowing) {
                        var cursorStyle = ["n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "se-resize", "sw-resize", "nw-resize"];
                        document.body.style.cursor = cursorStyle[index];
                    }
                    else {
                        document.body.style.cursor = "";
                    }
                };
                //显示预览DIV
                var showVirtualBox = function (virtualBox, aBoxPrevious) {
//                    with (virtualBox.style) {
                    virtualBox.style.display = "block";
                    virtualBox.style.top = aBoxPrevious["top"] + "px";
                    virtualBox.style.left = aBoxPrevious["left"] + "px";
                    virtualBox.style.width = aBoxPrevious["width"] + "px";
                    virtualBox.style.height = aBoxPrevious["height"] + "px";
//                    }
                }
                //隐藏预览DIV
                var hideVirtualBox = function (virtualBox) {
                    virtualBox.style.display = "none";
                }
                //改变box大小
                var changeVirtualBoxSize = function (e, aBoxPrevious, index) {
                    var event = e || window.event;
                    var bTop = false;
                    var bRight = false;
                    var bBottom = false;
                    var bLeft = false;
                    //八个方向，分别为N、E、S、W、NE、SW、SW、NW
                    switch (index) {
                        case 0:
                            bTop = true;
                            break;
                        case 1:
                            bRight = true;
                            break;
                        case 2:
                            bBottom = true;
                            break;
                        case 3:
                            bLeft = true;
                            break;
                        case 4:
                            bTop = bRight = true;
                            break;
                        case 5:
                            bRight = bBottom = true;
                            break;
                        case 6:
                            bBottom = bLeft = true;
                            break;
                        case 7:
                            bLeft = bTop = true;
                            break;
                        default:
                            break;
                    }
                    //向北改变高度
                    if (bTop) {
                        var newTopHeight = aBoxPrevious["height"] - (event.clientY - aBoxPrevious["clientY"]);
                        (newTopHeight < originalHeight) && (newTopHeight = originalHeight);
                        (newTopHeight > aBoxPrevious["top"] + aBoxPrevious["height"]) && (newTopHeight = aBoxPrevious["top"] + aBoxPrevious["height"]);
                        var newTop = aBoxPrevious["top"] + (event.clientY - aBoxPrevious["clientY"]);
                        (newTop > aBoxPrevious["top"] + aBoxPrevious["height"] - originalHeight) && (newTop = aBoxPrevious["top"] + aBoxPrevious["height"] - originalHeight);
                        (newTop < 0) && (newTop = 0);
                        virtualBox.style.top = newTop + "px";
                        virtualBox.style.height = newTopHeight - box.clientTop * 2 + "px";
                        //不能忽略border-width
                        bTop = false;
                    }
                    //向东改变宽度
                    if (bRight) {
                        var newRightWidth = aBoxPrevious["width"] + (event.clientX - aBoxPrevious["clientX"]);
                        (newRightWidth < originalWidth) && (newRightWidth = originalWidth);
                        (newRightWidth > document.body.scrollWidth - aBoxPrevious["left"]) && (newRightWidth = document.body.scrollWidth - aBoxPrevious["left"]);
                        virtualBox.style.width = newRightWidth - box.clientTop * 2 + "px";
                        bRight = false;
                    }
                    //向南改变高度
                    if (bBottom) {
                        var newBottomHeight = aBoxPrevious["height"] + (event.clientY - aBoxPrevious["clientY"]);
                        (newBottomHeight < originalHeight) && (newBottomHeight = originalHeight);
                        (newBottomHeight > document.body.scrollHeight - aBoxPrevious["top"]) && (newBottomHeight = document.body.scrollHeight - aBoxPrevious["top"]);
                        virtualBox.style.height = newBottomHeight - box.clientTop * 2 + "px";
                        bBottom = false;
                    }
                    //向西改变宽度
                    if (bLeft) {
                        var newLeftWidth = aBoxPrevious["width"] - (event.clientX - aBoxPrevious["clientX"]);
                        (newLeftWidth < originalWidth) && (newLeftWidth = originalWidth);
                        (newLeftWidth > aBoxPrevious["left"] + aBoxPrevious["width"]) && (newLeftWidth = aBoxPrevious["left"] + aBoxPrevious["width"]);
                        var newLeft = aBoxPrevious["left"] + (event.clientX - aBoxPrevious["clientX"]);
                        (newLeft > aBoxPrevious["left"] + aBoxPrevious["width"] - originalWidth) && (newLeft = aBoxPrevious["left"] + aBoxPrevious["width"] - originalWidth);
                        (newLeft < 0) && (newLeft = 0);
                        virtualBox.style.left = newLeft + "px";
                        virtualBox.style.width = newLeftWidth - box.clientLeft * 2 + "px";
                        bLeft = false;
                    }
                };
                //获取style样式的css属性,考虑兼容;ie,火狐/谷歌;
                var getStyle = function getStyle(parm1,parm2) {
                    return parm1.currentStyle ? parm1.currentStyle[parm2] : getComputedStyle(parm1)[parm2];
                    //parm1,要改变的元素代替名;parm2,要改变的属性名
                };
                var changeBoxSize = function (virtualBox) {
//                    with (box.style) {
                    box.style.left = virtualBox.style.left;
                    box.style.top = virtualBox.style.top;
                    box.style.width = virtualBox.style.width;
                    box.style.height = virtualBox.style.height;

//                    content.style.left = box.style.left;
//                    content.style.top = box.style.top - 30;
                    content.style.width = parseInt(getStyle(box, "width")) + "px";
                    content.style.height = parseInt(getStyle(box, "height")) - 31 + "px";
                    //eslint-disable-next-line
                    console.log(box.style.height);
                    //eslint-disable-next-line
                    console.log("content:" + content.style.height);

//                    }
                }
            },
            //窗口按钮函数
            boxButton() {
                var box = this.$refs.box;
                var boxHeader = this.$refs.boxHeader;
                var content = this.$refs.boxSide;
                var aButton = this.$refs.button.getElementsByTagName("div");
//                var showButton = this.$refs.showButton;
//                var span = showButton.getElementsByTagName("span")[0];
                var bIsMin = false;
                var bIsMax = false;
                //目前状态是否最小 or 最大
                boxHeader.ondblclick = function () {
                    maximize();
                }
                for (var i = 0; i < aButton.length; i++) {
                    aButton[i].index = i;
                    aButton[i].onmouseover = function () {
                        aButton[this.index].style.background = "#AAA";
                        document.body.style.cursor = "pointer";
                    };
                    aButton[i].onmouseout = function () {
                        aButton[this.index].style.background = "";
                        document.body.style.cursor = ""
                    };
                    aButton[i].onclick = function () {
                        switch (this.index) {
                            case 0:
                                minimize();
                                break;
                            case 1:
                                maximize();
                                break;
                            case 2:
                                close();
                                break;
                            default:
                                break;
                        }
                    };
                }
                var minimize = function () {
                    if (bIsMin) {
                        resumeBox();
                        bIsMin = false;
                    }
                    else {
                        box.style.width = "89px";
                        box.style.height = "32px";
                        box.style.left = "2%";
                        box.style.top = document.body.offsetHeight - box.offsetHeight - 15 + "px";
                        bIsMin = true;
                        bIsMax = false;
                    }
                };
                var maximize = function () {
                    if (bIsMax) {
                        resumeBox();
                        bIsMax = false;
                    }
                    else {
                        box.style.width = document.body.scrollWidth - 10 + "px";
                        box.style.height = document.body.scrollHeight - 10 + "px";
                        box.style.left = "5px";
                        box.style.top = "5px";

                        content.style.width = document.body.scrollWidth - 10 + "px";
                        content.style.height = document.body.scrollHeight - 41 + "px";
                        content.style.left = "2px";
                        content.style.top = "37px";

                        bIsMax = true;
                        bIsMin = false;
                    }
                };
                var that = this;
                var close = function () {
                    box.style.display = "none";
                    that.$emit('onClose', that.extras);
//                    showButton.style.display = "block";
                };
                var resumeBox = function () {
                    box.style.top = "30%";
                    box.style.left = "40%";
                    box.style.width = "250px";
                    box.style.height = "150px";

                    content.style.width = "250px";
                    content.style.height = "119px";
                };
//                showButton.onmousedown = function () {
//                    span.innerHTML = "^o^";
//                };
//                showButton.onclick = function () {
//                    this.style.display = "none";
//                    span.innerHTML = ">_<";
//                    resumeBox();
//                    box.style.display = "block";
//                };
            }
        }
    }
</script>

<style lang="less" media="screen">
    html, body, div {
        margin: 0;
        padding: 0;
    }

    html, body {
        background: #FFFFFF;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .title {
        float:left;
        padding: 5px;
    }

    .box {
        position: absolute;
        top: 30%;
        left: 40%;
        width: 500px;
        height: 300px;
        background: #EEE;
        border: 1px solid #666;
        border-radius: 8px;
    }

    /*标题栏*/
    .boxHeader {
        width: 100%;
        height: 30px;
        background: #AAAAAA !important;
        border-bottom: 1px solid #AAA;
        border-radius: 5px 5px 0 0;
    }

    .boxSide {
        width: 100%;
        background-color: white;
        border-radius: 0 0 8px 8px;
    }

    .button {
        float: right;
        width: 79px;
        height: 15px;
        margin: 5px 5px 0 0 !important;
        margin: 5px 2px 0 0;
        background: #CCC;
        border-radius: 5px;
    }

    .button div {
        float: left;
        width: 25px;
        height: 15px;
        border-right: 2px #AAA solid;
    }

    .button .close {
        border: none;
        border-radius: 0px 5px 5px 0;
    }

    .button .minimize {
        border-radius: 5px 0 0 5px;
    }

    /*八个方向*/
    /*用于显示变栏颜色，作为测试
    #boxN, #boxE, #boxS, #boxW {
     background: red;
    }
    #boxNE, #boxES, #boxSW, #boxWN {
     background: green;
    }
    */
    #boxN {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 5px;
        overflow: hidden;
    }

    .boxE {
        position: absolute;
        top: 0;
        right: 0;
        width: 5px;
        height: 100%;
        overflow: hidden;
    }

    .boxS {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 5px;
        width: 100%;
        overflow: hidden;
    }

    .boxW {
        position: absolute;
        top: 0;
        left: 0;
        width: 5px;
        height: 100%;
        overflow: hidden;
    }

    .boxNE {
        position: absolute;
        right: 0;
        top: 0;
        width: 5px;
        height: 5px;
        overflow: hidden;
    }

    .boxES {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 5px;
        height: 5px;
        overflow: hidden;
    }

    .boxSW {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 5px;
        height: 5px;
        overflow: hidden;
    }

    .boxWN {
        position: absolute;
        left: 0;
        top: 0;
        width: 5px;
        height: 5px;
        overflow: hidden;
    }

    /*显示按钮*/
    .showButton {
        display: none;
        position: absolute;
        top: 50%;
        left: 50%;
        margin: -75px 0 0 -75px;
        width: 150px;
        height: 150px;
    }

    .showButton span {
        font: 50px bolder;
    }

    /*改变大小时的预览DIV*/
    .virtualBox {
        position: absolute;
        background: #8EC6FF;
        border: 1px solid #147AFF;
        border-radius: 8px;
        opacity: 0.4;
        filter: alpha(opacity=40);
    }
</style>