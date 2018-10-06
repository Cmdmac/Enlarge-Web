<template>
    <div class="container">
        <div class="grid">
            <div class="gridItem" v-for="(item, index) in files" :key="index" @dblclick="onItemDoubleClick(item)">
                <img v-if="item.isDir" class="icon" :src="require('../../assets/grid_dirempty.png')" />
                <img v-else class="icon" :src="require('../../assets/unknow.png')" />
                <div>{{item.name}}</div>
            </div>
        </div>
        <div v-if="files.length == 0" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center"><span>暂无数据</span></div>
    </div>
</template>

<script>
    export default {
        name: "GridFileView",
        props: {files: Array},
        data() {
            return {};
        },
        methods: {
            onItemDoubleClick(item) {
//                alert(item);
                this.$emit('onTableRowDbClick', item);
            }
        }
    }
</script>

<style scoped>
    .container {
        display: flex;
        align-items: center;
    }

    .grid {
        display: flex;
        flex-wrap: wrap;
        margin: 12px;
    }

    .gridItem {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .icon {
        width: 80px;
        height: 70px;
    }
</style>