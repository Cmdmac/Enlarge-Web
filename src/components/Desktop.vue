<template>
    <div>
        <table class="apps">
            <tbody>
            <tr v-for="(row, index) in apps" :key="index">
                <td class="app-item" v-for="app in row" v-bind:key="app.id">
                    <div @click="onLaunchApp(app.name)">
                        <img :src="app.icon"/>
                        <div>{{app.name}}</div>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
        <div id="window" v-for="app in launchers" :key="app.id">+
            <Window :ref="app.id" :args="app" v-on:onClose="onWindowClose">
            </Window>
        </div>
        <div class="bottom-bar">
            <div class="task-bar">
                <div class="task-item" v-for="app in launchers" :key="app.id" @click="onResumeWindow(app.id)">
                    <div>{{app.id}}</div>
                </div>
            </div>
            <div class="status-bar">
                <img class="status-icon" :src='require("../assets/compatible_chrome.png")'/>
                <img class="status-icon" :src='require("../assets/compatible_safari.png")'/>
                <img class="status-icon" :src='require("../assets/compatible_opera.png")'/>
                <img class="status-icon" :src='require("../assets/compatible_ie.png")'/>
            </div>
        </div>
    </div>
</template>
<script>
    import Window from '@/components/Window.vue';
    import { config } from "../config.js"

    export default {
        name: "Desktop",
        components: {Window},
        data() {
            return {
                websock: null,
                apps: [
                    [{
                        name: "FileManager",
                        icon: require("../assets/compatible_ie.png")
                    }, {
                        name: "Calendar",
                        icon: require("../assets/compatible_chrome.png")
                    }, {
                        name: "opera",
                        icon: require("../assets/compatible_opera.png")
                    },{
                        name: "safari",
                        icon: require("../assets/compatible_safari.png")
                    }],
                    [{
                        name: "ie",
                        icon: require("../assets/compatible_ie.png")
                    }, {
                        name: "chrome",
                        icon: require("../assets/compatible_chrome.png")
                    }, {
                        name: "opera",
                        icon: require("../assets/compatible_opera.png")
                    },{
                        name: "safari",
                        icon: require("../assets/compatible_safari.png")
                    }]
                ],
                launchers: [
//                    {name: "dd", extras: {name: "hello"}},
                    //{name: "tt", extras: {name: "挺好用的啊"}},
                ]
            }
        },

        created() {
            this.initWebSocket();
        },
        destroyed() {
            this.websock.close() //离开路由之后断开websocket连接
        },

        methods: {
            isAppLaunched(id) {
                for(let i = 0; i < this.launchers.length; i++) {
                    let item = this.launchers[i];
                    if (item.id == id) {
//                        console.log(item.name);
                        return true;
                    }
                }
                return false;
            },

            onLaunchApp(name) {
                if (this.isAppLaunched(name)) {
                    return;
                }
                var d = {id: name, target: name, extras: {name: name}};
//                this.$set(this.launchers, d);
                this.launchers.push(d);
                //不set不会更新的
                this.$set(this, 'launchers', this.launchers);
//                eslint-disable-next-line
//                console.log(this.launchers);
            },

            onWindowClose(id) {
                // eslint-disable-next-line
//                console.log(id);
                for(let i = 0; i < this.launchers.length; i++) {
                    let item = this.launchers[i];
                    if (item.id == id) {
                        // eslint-disable-next-line
                        console.log("close:" + item.id);
                        // eslint-disable-next-line
//                        console.log(item.name);
                        this.launchers.splice(i, 1);
                        break;
                    }
                }
//                this.launchers[index];
//                let list = this.$refs.windows;
//                let nodes = list.childNodes[index];
//                 eslint-disable-next-line
//                console.log(this.launchers);
//                list.removeChild(nodes);
//                this.launchers.splice(index, 1);
//                this.$set(this, 'launchers', this.launchers);
            },

            onResumeWindow(id) {
                //eslint-disable-next-line
                console.log("resume:" + id);
                //eslint-disable-next-line
//                console.log(this.$refs);
                for (let ref in this.$refs) {
                    //eslint-disable-next-line
//                    console.log("ref:" + ref);
                    if (ref == id) {
                        //eslint-disable-next-line
                        let r = this.$refs[ref][0];
                        if (r.isShow() == false) {
                            r.resume();
                        }
                        break;
                    }
                }
            },

            initWebSocket(){ //初始化weosocket
                const wsuri = config.ws_server;
                this.websock = new WebSocket(wsuri);
                this.websock.onmessage = this.websocketonmessage;
                this.websock.onopen = this.websocketonopen;
                this.websock.onerror = this.websocketonerror;
                this.websock.onclose = this.websocketclose;
            },

            websocketonopen(){ //连接建立之后执行send方法发送数据
                let actions = {'type': 100, 'msg': 'requestPermission'}
                this.websocketsend(JSON.stringify(actions));
            },

            websocketonerror(){//连接建立失败重连
                this.initWebSocket();
            },

            websocketonmessage(e){ //数据接收
                const redata = JSON.parse(e.data);
                // eslint-disable-next-line
                console.log(redata);
                // eslint-disable-next-line
                console.log('onmessage');
                var that = this;
                setTimeout(function () {
                    that.websocketsend(JSON.stringify({'type': 0, 'msg': 'ping'}));
                }, 15000)
            },

            websocketsend(Data){//数据发送
                this.websock.send(Data);
            },

            // eslint-disable-next-line
            websocketclose(e){  //关闭
                // eslint-disable-next-line
                console.log('断开连接',e);
            },

        }
    }
</script>
<style scoped>
    /*body {*/
        /*background-color: #8EC6FF;*/
    /*}*/
    .apps {
    }

    .app-item
    {
        width: 90px;
        height: 90px;
    }

    .app-item:active {
        background-color: lightgray;
    }

    .bottom-bar {
        position: fixed;
        bottom: 0px;
        width: 100%;
        height: 30px;
        background-color: #AAAAAADD;
    }

    .task-bar {
    }

    .task-item {
        float: left;
        height: 100%;
        line-height: 30px;
        min-width: 100px;
        text-align: center;
        color: white;
        background-color: #708090AA;
        margin-left: 1px;
        margin-right: 1px;
    }

    .status-bar {
        float: right;
        align: center;
        margin-top: 5px;
        margin-bottom: 5px;
        margin-right: 10px;
    }

    .status-icon {
        width: 20px;
        height: 20px;
        margin-left: 5px;
        margin-right: 5px;
    }

</style>