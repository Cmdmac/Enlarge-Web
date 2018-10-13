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

function getIcon(type) {
    if (type == 'txt') {
        return require('../../public/images/txt.png');
    } else if (type == 'pdf') {
        return require('../../public/images/grid_dirempty.png');
    } else if (type == 'doc') {
        return require('../../public/images/doc.png');
    } else if (type == 'docx') {
        return require('../../public/images/docx.png');
    } else if (type == 'jpg') {
        return require('../../public/images/jpg.png');
    } else if (type == 'mp4') {
        return require('../../public/images/mp4.png');
    } else if (type == 'png') {
        return require('../../public/images/png.png');
    } else if (type == 'wav') {
        return require('../../public/images/wav.png');
    } else if (type == 'zip') {
        return require('../../public/images/zip.png');
    } else if (type == 'gz') {
        return require('../../public/images/gz.png');
    } else if (type == 'rar') {
        return require('../../public/images/rar.png');
    } else if (type == 'apk') {
        return require('../../public/images/apk.png');
    }
    return require('../../public/images/unknow.png');
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
    toSizeString, getIcon
}