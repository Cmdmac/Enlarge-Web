<template>
    <div>
        <span v-for="(item, index) in pathItems" :key="index">
            <span v-if="index > 0">/</span><span @click="onNavigatorTo(index)" style="margin-left: 5px; margin-right: 5px; cursor: pointer">{{item}}</span>
        </span>
    </div>
</template>

<script>
    export default {
        name: "PathNavigator",
        props: { currentPath: String },
        data() {
            return {
                pathItems: []
            }
        },

        watch: {
            currentPath: function (path) {
                this.splitPath(path);
            }
        },

        mounted() {

        },

        methods: {

            lastPath() {
                return this.pathItems[this.pathItems.length - 1];
            },

            splitPath(path) {
                let paths = path.split("/");
                this.$set(this, 'pathItems', paths);
            },

            onNavigatorTo(index) {
//                alert(item);
                let path = "";
                for (let i = 0; i <= index; i++) {
                    path = path + '/' + this.pathItems[i];
                }
                this.$emit('onNavigatorTo', path);
            }
        }
    }
</script>

<style scoped>

</style>