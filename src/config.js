var http_server = "http://172.29.229.54:9090/";
var config = {
    ws_server : "ws://172.29.229.54:9090",
    api: {
        fileManager: {
            list: http_server + "filemanager/list",
            mkDir: http_server + "filemanager/mkDir",
            rm: http_server + "filemanager/rm",
            getThumb: http_server + "filemanager/getThumb"
        }
    }
}

export {
    config
}