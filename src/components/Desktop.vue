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
        <div id="windows" v-for="(app, index) in launchers" :key="index">
            <Window :tag="app.name"/>
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
                    {name: "dd", extras: {}},
                ]
            }
        },
        methods: {
            onLaunchApp(name) {
                alert(name)
//                eslint-disable-next-line
//                console.log("click");
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