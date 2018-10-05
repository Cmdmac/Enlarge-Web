<template>
    <div class="container">
        <div class="header">
            <input placeholder="搜索"/>
            <button>列表</button>
            <button>网格</button>
        </div>
        <div class="navigator">
            <button>Test</button>
        </div>
        <div ref="content" class="content">
            <div class="left">
                <el-tree
                        :props="tree_items"
                        :load="loadNode"
                        :accordion = "false"
                        @node-click="onNodeClick"
                        :expand-on-click-node="false"
                        lazy>
                     <div class="custom-tree-node" slot-scope="{ node, data }" style="display: flex; justify-content: center">
                              <img v-if="node.data.isDir"
                                   style="width: 22px; height: 22px; "
                                   :src="require('../assets/grid_dirempty.png')"/>
                              <span style="line-height: 24px; height: 100%; text-align: center; ">{{ node.label
                                  }}</span>
                     </div>
                </el-tree>
            </div>
            <div class="right">
                <el-table
                        :data="tableData"
                        height="tableHeight"
                        :max-height="800">
                    <el-table-column
                            prop="name"
                            label="名称"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="date"
                            label="修改日期"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="type"
                            label="类型">
                    </el-table-column>
                    <el-table-column
                            prop="size"
                            label="大小">
                    </el-table-column>
                </el-table>
            </div>
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
                tree_items: {
                    label: 'name',
                    children: 'zones',
                    isLeaf: 'leaf'
                },
                files: [
                    {name: "360", isDir: true, icon: "el-icon-info" }, {name: "tencent", isDir: true }, {name: "xiaomi", isDir: true, leaf: true}, {name: "test.txt", isDir: false, leaf: true}, {name: "中文.doc", isDir: false, leaf: true}
                ],
                tableData: [],
                tableHeight: window.innerHeight - 300
            };
        },
        methods: {
            getFiles(dir, resolve) {
                setTimeout(() => {
                    const data = this.files;
                    resolve(data);
                }, 100);
            },

            loadNode(node, resolve) {
                if (node.level === 0) {
                    return resolve([{name: 'Android', isDir: true, path: "/sdcard/Android"}]);
                }
//                if (node.level > 1) return resolve([]);
                if (!node.isLeaf) {
//                    this.getFiles(node.data.path, resolve);
                    setTimeout(() => {
                        var data = [];
                        if (node.data.path == "/sdcard/Android") {
                            data.push({name: "tencent", path: "/sdcard/Android/tencent", isDir: true, leaf: false});
                            data.push({name: "xiaomi", path: "/sdcard/Android/xiaomi", isDir: true, leaf: false});
                            data.push({name: "huawei", path: "/sdcard/Android/huawei", isDir: true, leaf: false});
                            data.push({name: "SangSumg", path: "/sdcard/Android/SangSumg", isDir: true, leaf: false});
                        } else if (node.data.path == "/sdcard/Android/tencent") {
                            data.push({name: "QQ", path: "/sdcard/Android/tencent/QQ", isDir: true, leaf: false});
                            data.push({name: "MicroMsg", path: "/sdcard/Android/tencent/MicroMsg", isDir: true, leaf: false});
                        } else if (node.data.path == "/sdcard/Android/xiaomi") {
                            data.push({name: "cc.bak", path: "/sdcard/Android/xiaomi/cc", isDir: false, leaf: true});
                        } else if (node.data.path == "/sdcard/Android/huawei") {
                            data.push({name: "dd.mp4", path: "/sdcard/Android/huawei/dd", isDir: false, leaf: true});
                        } else if (node.data.path == "/sdcard/Android/SangSumg") {
                            data.push({name: "ff.apk", path: "/sdcard/Android/SangSumg/ff", isDir: false, leaf: true});
                            data.push({name: "dd.mp3", path: "/sdcard/Android/SangSumg/dd", isDir: false, leaf: true});
                        } else if (node.data.path == "/sdcard/Android/tencent/QQ") {
                            data.push({name: "abc.txt", path: "/sdcard/Android/tencent/QQ/abc", isDir: false, leaf: true});
                            data.push({name: "123.doc", path: "/sdcard/Android/tencent/QQ/123", isDir: false, leaf: true});
                        } else if (node.data.path == "/sdcard/Android/tencent/MicroMsg") {
                            data.push({name: "你好.txt", path: "/sdcard/Android/tencent/MicroMsg/abc", isDir: false, leaf: true});
                            data.push({name: "test.html", path: "/sdcard/Android/tencent/MicroMsg/123", isDir: false, leaf: true});
                        }
                        resolve(data);
                        var that = this;
                        if (node.loadFromClk != undefined) {
                            //
                            that.showFiles(node, data);
                            node.loadFromClk = undefined;
                        }
                    }, 100);
                } else {
                    return resolve([]);
                }
            },

            showFiles(node, data) {
                //eslint-disable-next-line
                console.log(data);
                //eslint-disable-next-line
                console.log(node);
                var files = [];
                var nodes = node.childNodes;
                for (let i = 0; i < nodes.length; i++) {
                    //eslint-disable-next-line
//                    console.log(nodes[i].data);
//                    files.push(nodes[i].data);
                    files.push({date: '2018-10-04', name: nodes[i].data.name, type: '文件', size: "1.2M"});
                }
                //eslint-disable-next-line
                console.log(files);
                this.$set(this, 'tableData', files);
            },

            onNodeClick(data, node) {
                if (node.childNodes.length <= 0 && !node.isloded && !node.isloading) {
                    //load data
//                    node.data = this.files;
                    //build path
                    var path = node.data.name;
                    var tmp = node.parent;
                    while (tmp != null && tmp.data != undefined) {
                        path = tmp.data.name + '/' + path;
                        tmp = tmp.parent;
                    }
                    //eslint-disable-next-line
                    console.log(path);
                    node.loadFromClk = true;
                    node.loadData();
                } else {
                    this.showFiles(node, data);
                }
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

    .container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: stretch;
    }

    .header {
        width: 100%;
        display: flex;
    }

    .navigator {
        width: 100%;
        display: flex;
    }

    .content {
        display: flex;
        width: 100%;
        height: 100%;
        max-height: 900px;
        padding-bottom: 5px;
    }

    .left {
        width: 30%;
        height: 100%;
        border: solid 1px lightgrey;
    }

    .right {
        height: 100%;
        width: 70%;
        border: solid 1px lightgrey;
        display: flex;
        align-items: stretch;
    }

    .table_header {
        height: 50px;
    }
</style>
