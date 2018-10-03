<template>
    <div>
        <table class="apps">
            <tbody>
            <tr v-for="(row, index) in apps" :key="index">
                <td class="app-item" v-for="app in row" v-bind:key="app.name">
                    <div @click="onLaunchApp(app.name)">
                        <img :src="app.icon"/>
                        <div>{{app.name}}</div>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
        <div id="app.name" v-for="(app, index) in launchers" :key="index">
            <Window :extras="app.extras" v-on:onClose="onWindowClose(app.name)"/>
        </div>
        <div class="bottom-bar">
            <div class="task-bar"></div>
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
    import Window from '@/components/Window.vue'
    export default {
        name: "Desktop",
        components: {Window},
        data() {
            return {
                apps: [
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
        methods: {
            onLaunchApp(name) {
                var d = {name: name, extras: {name: name}};
//                this.$set(this.launchers, d);
                this.launchers.push(d);
                //不set不会更新的
                this.$set(this, 'launchers', this.launchers);
//                eslint-disable-next-line
//                console.log(this.launchers);
            },

            onWindowClose(name) {
                // eslint-disable-next-line
                console.log(name);
                for(let i = 0; i < this.launchers.length; i++) {
                    let item = this.launchers[i];
                    if (item.name == name) {
                        this.launchers.splice(i, 1);
                        break;
                    }
                }
                this.$set(this, 'launchers', this.launchers);
            }
        }
    }
</script>
<style>
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
        background-color: lightgray;
    }

    .task-bar {

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