<template>
    <div class="container">
        <div class="header">
            <input style="width: 300px;" placeholder="搜索"/>
            <div class="switchFile">
                <i class="el-icon-tickets" style="width: 20px; height: 20px; margin-right: 5px" @click="onShowListFile"></i>
                <i class="el-icon-menu" style="width: 20px; height: 20px; margin-left: 5px" @click="onShowGridFile"></i>
            </div>
        </div>
        <div class="navigator">
            <button>后退</button><button>前进</button> <PathNavigator :currentPath="currentPath" style="margin-left: 10px" v-on:onNavigatorTo="onNavigatorTo"></PathNavigator>
        </div>
        <div ref="content" class="content">
            <div class="left">
                <el-tree
                        :default-expanded-keys='["0-Android"]'
                        nodeKey="id"
                        ref="folderTree"
                        :props="tree_items"
                        :load="loadNode"
                        :accordion = "false"
                        :expand-on-click-node="true"
                        @node-click="onNodeClick"
                        lazy>
                     <div class="custom-tree-node" slot-scope="{ node, data }" style="display: flex; justify-content: center">
                              <img v-if="node.data.isDir"
                                   style="width: 22px; height: 22px; "
                                   :src="require('../../assets/grid_dirempty.png')"/>
                              <span style="line-height: 24px; height: 100%; text-align: center; ">{{ node.label
                                  }}</span>
                     </div>
                </el-tree>
            </div>
            <div class="right">
                <FileView :is="showFileType" v-on:onTableRowDbClick="onTableRowDbClick" :files="tableData"/>
            </div>
        </div>
    </div>
</template>

<script>
    import PathNavigator from '@/components/widgets/PathNavigator.vue';
    import FileView from '@/components/widgets/FileView.vue'
    import GridFileView from '@/components/widgets/GridFileView.vue'

    export default {
        name: 'FileManager',
        components: { PathNavigator, FileView, GridFileView },
        props: {
            msg: String
        },
        data() {
            return {
                showFileType: "FileView",
                tableData: [],
                currentPath: "",
                tree_items: {
                    label: 'name',
                    children: 'children',
                    isLeaf: 'leaf'
                },
                fileTree: {
                    name: "Android", isDir: true, modifyDateTime: "2018-10-04 11:30:12", id: "0-Android",
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
                            {name: "new.html", isDir: false, modifyDateTime: "2018-10-04 11:30:12", size: "10 KB"},
                            {name: "Hello", isDir: true, modifyDateTime: "2008-1-04 11:30:12",
                                children: []
                            },
                            {name: "xix.ppt", isDir: false, modifyDateTime: "2018-10-04 11:30:12", size: "2.2 MB"},
                            {name: "Kitty.key", isDir: false, modifyDateTime: "2018-10-04 11:30:12", size: "3 MB"},
                            {name: "baby.css", isDir: false, modifyDateTime: "2018-10-04 11:30:12", size: "22 K"},
                            {name: "思程", isDir: true, modifyDateTime: "2015-11-05 11:30:12",
                                children: []
                            },
                            {name: "工作安排", isDir: true, modifyDateTime: "2013-5-06 5:30:12",
                                children: [{name: "收集.xsl", isDir: false, modifyDateTime: "2008-11-03 11:32:40", size: "302 KB"},
                                    {name: "H.apk", isDir: false, modifyDateTime: "2011-11-03 11:32:40", size: "12 KB"},]
                            },
                    ]
                    },
            };
        },

        mounted() {
//            let tree = this.$refs.folderTree;
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
//                console.log("entry:" + path);
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
                    this.$set(this, 'currentPath', this.fileTree.name);
                    return resolve([this.fileTree]);
                }
//                if (node.level > 1) return resolve([]);
                if (!node.isLeaf) {
//                    this.getFiles(node.data.path, resolve);
                    setTimeout(() => {
                        var data = this.getFiles(node);
                        let treeData = [];
                        for (let i = 0; i < data.length; i++) {
                            let item = data[i];
                            if (item.isDir) {
                                item.id = node.level + '-' + item.name;
                                if (item.children.length > 0) {
                                    item.leaf = false;
                                } else {
                                    item.leaf = true;
                                }
                                treeData.push(item);
                            }
                        }
                        resolve(treeData);
                        var that = this;
//                        if (node.loadFromClk != undefined) {
                            //
                            that.showFiles(data);
//                            node.loadFromClk = undefined;
//                        }
                    }, 100);
                } else {
                    return resolve([]);
                }
            },

            showFiles(data) {
                //eslint-disable-next-line
//                console.log(data);
                var files = [];
                let children = data;
                for (let i = 0; i < children.length; i++) {
                    //eslint-disable-next-line
//                    console.log(nodes[i].data);
//                    files.push(nodes[i].data);
                    let type = '';
                    if (children[i].isDir) {
                        type = '文件夹';
                    } else {
                        let index = children[i].name.lastIndexOf('.');
                        if (index != -1) {
                            type = children[i].name.substring(index + 1);
                        }
                    }
                    files.push({name: children[i].name, isDir: children[i].isDir, date: children[i].modifyDateTime, type: type, size: children[i].size});
                }
                //eslint-disable-next-line
//                console.log(files);
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
//                console.log(path);
                return path;
            },

            onNodeClick(data, node) {
                let path = this.buildPath(node);
                this.$set(this, 'currentPath', path);
                if (node.loaded) {
                    var r = this.getFiles(node);
                    this.showFiles(r);
                } else if (node.isLeaf) {
                    this.showFiles([]);
                }

            },

            onTableRowDbClick(row) {
                //eslint-disable-next-line
                if (row.isDir) {
                    let enterPath = this.currentPath + '/' + row.name;
                    let data = this.findFromTree(enterPath, this.fileTree);
                    this.showFiles(data);
                    let count = 0;
                    for (let i = 0; i < this.currentPath.length; i++) {
                        if (this.currentPath.charAt(i) == '/') {
                            count++;
                        }
                    }
                    this.$set(this, 'currentPath', enterPath);
                    let node = this.$refs.folderTree.getNode((count + 1) + '-' + row.name);
//                    let node = this.$refs.folderTree.store.currentNode;
//                if (node == undefined) {
//                    node = this.$refs.folderTree.currentNode;
//                }
                    node.expand();
//                    this.$refs.folderTree.store.currentNode = node;
                }
            },

            onNavigatorTo(to) {
//                alert(to);
                let enterPath = to.substring(1);
                let data = this.findFromTree(enterPath, this.fileTree);
                this.showFiles(data);
                this.$set(this, 'currentPath', enterPath);
            },

            onShowListFile() {
                this.$set(this, 'showFileType', 'FileView');
            },

            onShowGridFile() {
                this.$set(this, 'showFileType', 'GridFileView');
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
        justify-content: space-between;
        align-items: center;
        height: 30px;
        margin-top: 5px;
        margin-bottom: 5px;
        margin-left: 5px;
    }

    .switchFile {
        margin-right: 10px;
    }

    .navigator {
        width: 100%;
        display: flex;
        align-items: center;
        height: 30px;
        margin: 5px;
    }

    .content {
        display: flex;
        width: 100%;
        height: 100%;
        margin-bottom: 2px;
        max-height: 900px;
    }

    .left {
        width: 25%;
        height: 100%;
        border: solid 1px lightgrey;
        border-radius: 0 0 0 8px;
    }

    .right {
        height: 100%;
        width: 75%;
        border: solid 1px lightgrey;
        display: flex;
        align-items: stretch;
        border-radius: 0 0 8px 0;
    }

</style>
