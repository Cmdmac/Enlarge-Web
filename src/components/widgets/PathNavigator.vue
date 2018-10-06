<template>
    <div>
        <span v-for="item in pathItems" :key="item">
            <span>/{{item}}</span>
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
            splitPath(path) {
                let paths = path.split("/");
                this.$set(this, 'pathItems', paths);
            }
        }
    }
</script>

<style scoped>

</style>