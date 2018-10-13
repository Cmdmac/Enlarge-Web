<template>
    <div class="container">
        <div class="grid">
            <div v-for="(item, index) in files" :key="index" @dblclick="onItemDoubleClick(index)" @click="onItemClick(index) " v-bind:class="{'gridItem-checked': checked == index, 'gridItem': checked != index}">
                <img v-if="item.isDir" class="icon" :src="require('../../../public/images/grid_dirempty.png')" />
                <img v-else class="icon" :src="item.icon" />
                <div class="text">{{item.name}}</div>
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
            // eslint-disable-next-line
            return {checked: -1}
        },

        watch: {

            //eslint-disable-next-line
            files: function (files) {
                this.$set(this, 'checked', -1);
            }
        },

        methods: {
            onItemDoubleClick(index) {
//                alert(item);
                this.$emit('onTableRowDbClick', this.files[index]);
            },

            onItemClick(index) {
//                for (let i = 0; i < this.files.length; i++) {
//                    if (index == i) {
//                        this.files[i].checked = true;
//                    } else {
//                        this.files[i].checked = false;
//                    }
//                }
                this.$set(this, 'checked', index);
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
        width: 100%;
        /*height: 100%;*/
        display: flex;
        flex-wrap: wrap;
        overflow: auto;
    }

    .gridItem {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100px;
    }

    .gridItem-checked {
        background-color: #409eff;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100px;
    }

    .icon {
        width: 80px;
        height: 70px;
    }

    .text {
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        max-width: 95px;

    }
</style>