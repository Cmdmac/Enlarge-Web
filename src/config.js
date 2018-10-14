var server = "http://192.168.31.193:9090/";
var config = {
    // server: "http://192.168.31.213:9090/",
    api: {
        fileManager: {
            list: server + "filemanager/list",
            mkDir: server + "filemanager/mkDir",
            rm: server + "filemanager/rm",
            getThumb: server + "filemanager/getThumb"
        }
    }
}

export {
    config
}