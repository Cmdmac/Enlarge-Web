// class Uri {
//     constructor(path) {
//         this.path = path;
//     }
//
//     splitPath(path) {
//         let paths = path.split("/");
//         this.dirs = paths;
//     }
//
//     lastDir() {
//         return this.dirs[this.dirs.length];
//     }
//
//     dirs(index) {
//         return this.dirs[index];
//     }
// }

Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),    //day
        "h+": this.getHours(),   //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}

function toSizeString(size) {
    if  (size < 1024) {
        return size + " B";
    }
    let kb = size / 1024.0;
    if (kb < 1024) {
        return kb.toFixed(2) + " KB";
    }
    let mb = kb / 1024;
    if (mb < 1024) {
        return mb.toFixed(2) + " MB";
    }
    return (mb / 1024).toFixed(2) + " GB";
}

export {
    toSizeString
}