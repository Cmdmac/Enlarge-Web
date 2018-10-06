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
                    children: 'children',
                    isLeaf: 'leaf'
                },
                fileTree: {
                    name: "Android", isDir: true, modifyDateTime: "2018-10-04 11:30:12",
                    children: [
                            {name: "tencent", isDir: true, modifyDateTime: "2018-11-03 11:32:40",
                                children: [
                                    {name: "QQ", isDir: true, modifyDateTime: "2017-11-03 10:32:40",
                                        children: [
                                            {name: "abc.txt", isDir: false, modifyDateTime: "2018-11-03 11:32:40", size: "2 KB"},
                                            {name: "秘密.doc", isDir: false, modifyDateTime: "2012-11-03 11:32:40", size: "10 KB"},
                                        ]
                                    },
                                    {name: "MicroMsg", isDir: true, modifyDateTime: "2016-11-03 9:32:40",
                                        children: [
                                            {name: "收集.xsl", isDir: false, modifyDateTime: "2008-11-03 11:32:40", size: "302 KB"},
                                            {name: "H.apk", isDir: false, modifyDateTime: "2011-11-03 11:32:40", size: "12 KB"},
                                        ]},
                                    {name: "update.log", isDir: false, modifyDateTime: "2018-11-03 11:32:40", size: "102 KB"},
                                ]
                            },
                            {name: "xiaomi", isDir: true, modifyDateTime: "2018-10-14 12:30:12",
                                children: [
                                    {name: "dd.log", isDir: false, modifyDateTime: "2018-11-03 11:32:40", size: "2 KB"},
                                ]
                            },
                            {name: "huwwei", isDir: true, modifyDateTime: "2018-9-04 11:30:12",
                                children: [
                                    {name: "aaa.mp4", isDir: false, modifyDateTime: "2018-11-03 11:32:40", size: "2 MB"},
                                ]},
                            {name: "SangSumg", isDir: true, modifyDateTime: "2018-5-09 10:32:12",
                                children: [
                                    {name: "tt.mp3", isDir: false, modifyDateTime: "2018-11-03 11:32:40", size: "4 MB"},
                                ]},
                            {name: "update.bin", isDir: false, modifyDateTime: "2018-10-04 11:30:12", size: "1 G"},
                        ]
                    },
                tableData: [],
                tableHeight: window.innerHeight - 300
            };
        },
        methods: {
            getNextPath(path) {
                let index = path.indexOf('/');
                if (index != -1) {
                    return path.substring(index + 1);
                } else {
                    return undefined;
                }
            },

            findFromTree(path, tree) {
                //eslint-disable-next-line
                console.log("entry:" + path);
                let index = path.indexOf('/');
                // Android/tencent/QQ
                if (index != -1) {
                    // tencent/QQ
                    let name = path.substring(0, index);
                    if (name == tree.name) {
                        let leftPath = path.substring(index + 1);
                        if (leftPath != undefined) {
                            let next = leftPath.indexOf('/');
                            if (next != -1) {
                                let nextPath = leftPath.substring(0, next);
                                for (let i = 0; i < tree.children.length; i++) {
                                    let item = tree.children[i];
                                    if (item.isDir == true && item.name == nextPath) {
                                        return this.findFromTree(leftPath, item);
                                    }
                                }
                            } else {
                                for (let i = 0; i < tree.children.length; i++) {
                                    let item = tree.children[i];
                                    if (item.isDir == true && item.name == leftPath) {
                                        return this.findFromTree(leftPath, item);
                                    }
                                }
                            }
                        }
                    }
                    return undefined;
                } else {
                    return tree.children;
                }
            },

            getFiles(node) {
                let path = this.buildPath(node);
                let data = this.findFromTree(path, this.fileTree);
                return data;
            },

            loadNode(node, resolve) {
                if (node.level === 0) {
                    return resolve([{name: 'Android', isDir: true}]);
                }
//                if (node.level > 1) return resolve([]);
                if (!node.isLeaf) {
//                    this.getFiles(node.data.path, resolve);
                    setTimeout(() => {
                        var data = this.getFiles(node);
                        for (let i = 0; i < data.length; i++) {
                            if (data[i].isDir) {
                                data[i].leaf = false;
                            } else {
                                data[i].leaf = true;
                            }
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

            buildPath(node) {
                var path = node.data.name;
                var tmp = node.parent;
                while (tmp != null && tmp.data != undefined) {
                    path = tmp.data.name + '/' + path;
                    tmp = tmp.parent;
                }
                //eslint-disable-next-line
                console.log(path);
                return path;
            },

            onNodeClick(data, node) {
                if (node.childNodes.length <= 0 && !node.isloded && !node.isloading) {
                    node.loadFromClk = true;
                    node.loadData();
                } else {
                    this.showFiles(node, data);
                }
            },
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
