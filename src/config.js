var config = {
    http_server : "http://172.29.229.54:9090/",
    ws_server : "ws://172.29.229.54:9090",
    api: {
        fileManager: {
            list: "/filemanager/list",
            mkDir: "/filemanager/mkDir",
            rm:  "/filemanager/rm",
            getThumb: "/filemanager/getThumb",
        },

        desktop: {
            getApps: "/desktop/getApps"
        }
    },

    server: {
        host: "http://localhost",
        qrcode : "http://localhost/qrcode",
    }
}

export {
    config
}