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
                <img class="status-icon" :src='require("../../public/images/compatible_chrome.png")'/>
                <img class="status-icon" :src='require("../../public/images/compatible_safari.png")'/>
                <img class="status-icon" :src='require("../../public/images/compatible_opera.png")'/>
                <img class="status-icon" :src='require("../../public/images/compatible_ie.png")'/>
            </div>
        </div>
        <div class="qrcode" v-if="needScan">
            <span style="margin: 2px">请扫描二维码登录</span>
            <img :src="qrcodeUri"/>
        </div>
    </div>
</template>
<script>
    // import Window from '@/components/Window.vue';
    import axios from 'axios';
    import VueSocketio from 'vue-socket.io';
    import Vue from "vue";

    export default {
        name: "Desktop",
        components: {'Window' : () => import("@/components/Window.vue")},
        data() {
            return {
                needScan: true,
                qrcodeUri: this.config.server.qrcode,
                websock: null,
                apps: [],
                launchers: [
//                    {name: "dd", extras: {name: "hello"}},
                    //{name: "tt", extras: {name: "挺好用的啊"}},
                ]
            }
        },

        sockets:{
            connect: function(){
                //eslint-disable-next-line
                console.log('connect');
            },

            redirect: function (data) {
                //eslint-disable-next-line
                console.log('redirect:' + JSON.stringify(data));
                this.config.ws_server = data.ws;
                this.config.http_server = data.http;
                this.initWebSocket();
                //hide qrcode
                this.$set(this, 'needScan', false);

                var that = this;
                axios.get(this.config.server.getApps)
                    .then(function (response) {
                        that.$set(that, 'apps', response.data);
                    })
                    .catch(function (error) {
                        //eslint-disable-next-line
                        console.log(error);
                    });
            }
        },

        created() {
            Vue.use(VueSocketio, this.config.server.host);
        },

        mounted() {

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
                const wsuri = this.config.ws_server;
                this.websock = new WebSocket(wsuri);
                this.websock.onmessage = this.websocketOnMessage;
                this.websock.onopen = this.websocketOnOpen;
                this.websock.onerror = this.websocketOnError;
                this.websock.onclose = this.websocketClose;
            },

            websocketOnOpen(){ //连接建立之后执行send方法发送数据
                let actions = {'type': 100, 'msg': 'requestPermission'}
                this.websocketSend(JSON.stringify(actions));
                var that = this;
                setInterval(function () {
                    that.websocketSend(JSON.stringify({'type': 0, 'msg': 'ping'}));
                }, 15000);
            },

            websocketOnError(){//连接建立失败重连
                this.initWebSocket();
            },

            websocketOnMessage(e){ //数据接收
                const redata = JSON.parse(e.data);
                // eslint-disable-next-line
                console.log(redata);
                // eslint-disable-next-line

            },

            websocketSend(Data){//数据发送
                this.websock.send(Data);
            },

            // eslint-disable-next-line
            websocketClose(e){  //关闭
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

    .qrcode {
        z-index: 999;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        /*position: fixed;*/
        /*left: 20%;*/
        /*top: 20%;*/
    }

</style>