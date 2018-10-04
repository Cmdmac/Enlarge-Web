<template>
    <div class="content">

        <div class="left">
            <el-tree
                    :props="props1"
                    :load="loadNode1"
                    lazy
                    show-checkbox>
            </el-tree>
        </div>
        <div class="right">
            kdkksdfs
        </div>

    </div>
</template>

<script>
    export default {
        name: 'FileManager',
        props: {
            msg: String
        },
        data() {
            return {
                props1: {
                    label: 'name',
                    children: 'zones',
                    isLeaf: 'leaf'
                },
            };
        },
        methods: {
            loadNode1(node, resolve) {
                if (node.level === 0) {
                    return resolve([{ name: 'region' }]);
                }
                if (node.level > 1) return resolve([]);

                setTimeout(() => {
                    const data = [{
                        name: 'leaf',
                        leaf: true
                    }, {
                        name: 'zone'
                    }];

                    resolve(data);
                }, 500);
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

    .content {
        display: flex;
        width: 100%;
    }

    .left {
        width: 30%;
    }

    .right {
        width: 100%;
    }
</style>
