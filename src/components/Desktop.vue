<template>
    <div>
        <table class="apps">
            <tbody>
            <tr v-for="(row, index) in apps" :key="index">
                <td v-for="app in row" v-bind:key="app.name">
                    <div>
                        <img :src="app.icon"/>
                        <div>{{app.name}}</div>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
        <div class="bottom-bar">
            <div class="task-bar"></div>
            <div class="status-bar">
                <img class="status-icon" :src='require("../assets/compatible_ie.png")'/>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: "Desktop",
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
                ]
            }
        },
        methods: {
            onDefaultClick() {
                alert("ccc")
//                eslint-disable-next-line
//                console.log("click");
            }
        }
    }
</script>
<style>
    .apps {
    }

    table tr td
    {
        width: 90px;
        height: 90px;
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
    }

</style>