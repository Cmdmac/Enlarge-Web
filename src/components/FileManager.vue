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
                        :accordion = "true"
                        @node-click="onNodeClick"
                        :expand-on-click-node="false"
                        lazy>
                     <span class="custom-tree-node" slot-scope="{ node, data }">
                          <span> <i v-if="node.data.isDir" class="el-icon-info"></i>{{ node.label }}</span>
                     </span>
                </el-tree>
            </div>
            <div class="right">
                <el-table
                        :data="tableData"
                        height="tableHeight"
                        :max-height="800">
                    <el-table-column
                            prop="date"
                            label="日期"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="姓名"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            label="地址">
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
                }, 500);
            },

            loadNode(node, resolve) {
                if (node.level === 0) {
                    return resolve([{name: 'region', isDir: true, path: "/sss/ddd"}]);
                }
//                if (node.level > 1) return resolve([]);
                if (!node.isLeaf) {
                    this.getFiles(node.data.path, resolve);
                }
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

                    node.loadData();
                }
                //eslint-disable-next-line
                console.log(data);
                //eslint-disable-next-line
                console.log(node);
                var files = [];
                var nodes = node.childNodes;
                /*
                {
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
                }
                 */
                for(let i =  0; i < nodes.length; i++) {
                    //eslint-disable-next-line
//                    console.log(nodes[i].data);
//                    files.push(nodes[i].data);
                    this.tableData.push({date: '2018-10-04', name: nodes[i].data.name, address: 'hhaha'});
                }
                //eslint-disable-next-line
                console.log(files);
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
