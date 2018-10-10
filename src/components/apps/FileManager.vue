<template>
    <div class="container">
        <Dialog ref="dialog" v-on:onConfirm="doConfirm"></Dialog>
        <div class="header">
            <input style="width: 300px;" placeholder="搜索"/>
            <div class="switchFile">
                <i class="el-icon-refresh" style="width: 20px; height: 20px; margin-right: 5px" @click="onRefreshClick"></i>
                <i class="el-icon-plus" style="width: 20px; height: 20px; margin-right: 5px" @click="onNewDirClick"></i>
                <i class="el-icon-edit" style="width: 20px; height: 20px; margin-right: 20px" @click="onEditNameClick"></i>
                <i class="el-icon-tickets" style="width: 20px; height: 20px; margin-right: 5px" @click="onShowListFile"></i>
                <i class="el-icon-menu" style="width: 20px; height: 20px; margin-left: 5px" @click="onShowGridFile"></i>
            </div>
        </div>
        <div class="navigator">
            <i class="el-icon-arrow-left" style="width: 20px; height: 20px; margin-right: 5px" @click="onBackward"></i>
            <i class="el-icon-arrow-right" style="width: 20px; height: 20px; margin-right: 5px" @click="onForward"></i>
            <PathNavigator :currentPath="currentPath" style="margin-left: 10px" v-on:onNavigatorTo="onNavigatorTo"></PathNavigator>
        </div>
        <div ref="content" class="content">
            <div class="left">
                <el-tree
                        :default-expanded-keys='["0-Android"]'
                        nodeKey="id"
                        :highlight-current="true"
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
                                   :src="require('../../../public/images/grid_dirempty.png')"/>
                              <span style="line-height: 24px; height: 100%; text-align: center; ">{{ node.label
                                  }}</span>
                     </div>
                </el-tree>
            </div>
            <div class="right">
                <component ref="filesListComponent" :is="showFileType" v-on:onTableRowDbClick="onTableRowDbClick" :files="tableData"/>
            </div>
        </div>
    </div>
</template>

<script>
    import PathNavigator from '@/components/widgets/PathNavigator.vue';
    import FileView from '@/components/widgets/FileView.vue'
    import GridFileView from '@/components/widgets/GridFileView.vue'
    import Dialog from '@/components/widgets/Dialog.vue'


    export default {
        name: 'FileManager',
        components: { PathNavigator, FileView, GridFileView, Dialog },
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
                                            {name: "xiaomi", isDir: true, modifyDateTime: "2018-10-14 12:30:12",
                                                children: [
                                                    {name: "dd.log", isDir: false, modifyDateTime: "2018-11-03 11:32:40", size: "2 KB"},
                                                ]
                                            },
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
                            {name: "工作安排1", isDir: true, modifyDateTime: "2013-5-06 5:30:12",
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

            //原始数据转变成tree数据
            convertToTreeItem(node, item) {
                if (Array.isArray(item) == true) {
                    let children = [];
                    for (let i = 0; i < item.length; i++) {
                        let child = item[i];
                        if (child.isDir) {
                            let h = this.convertToTreeItem(node, child);//{name: child.name, isDir: child.isDir, leaf: false};
                            children.push(h);
                        }
                    }
                    return children;
                } else {
                    var treeItem = {};
//                if (item.isDir) {
                    treeItem.name = item.name;
                    treeItem.isDir = item.isDir;
                    treeItem.id = node.level + '-' + item.name;
                    treeItem.children = [];
                    let children = this.convertToTreeItem(node, item.children);
                    treeItem.children = children;
                    if (children.length > 0) {
                        treeItem.leaf = false;
                    } else {
                        treeItem.leaf = true;
                    }
//                }
                    return treeItem;
                }
            },

            loadNode(node, resolve) {

//                if (node.level > 1) return resolve([]);
//                    this.getFiles(node.data.path, resolve);
                setTimeout(() => {
                    if (node.level === 0) {
                        this.$set(this, 'currentPath', this.fileTree.name);
                        resolve([this.convertToTreeItem(node, this.fileTree)]);
                    } else {
                        let data = this.getFiles(node);
                        let treeData = this.convertToTreeItem(node, data);
                        resolve(treeData);
                        this.showFiles(data);
                    }
                }, 100);
            },

            getIcon(type) {
                if (type == 'txt') {
                    return require('../../../public/images/txt.png');
                } else if (type == 'pdf') {
                    return require('../../../public/images/grid_dirempty.png');
                } else if (type == 'doc') {
                    return require('../../../public/images/doc.png');
                } else if (type == 'docx') {
                    return require('../../../public/images/docx.png');
                } else if (type == 'jpg') {
                    return require('../../../public/images/jpg.png');
                } else if (type == 'mp4') {
                    return require('../../../public/images/mp4.png');
                } else if (type == 'png') {
                    return require('../../../public/images/png.png');
                } else if (type == 'wav') {
                    return require('../../../public/images/wav.png');
                } else if (type == 'zip') {
                    return require('../../../public/images/zip.png');
                } else if (type == 'gz') {
                    return require('../../../public/images/gz.png');
                } else if (type == 'rar') {
                    return require('../../../public/images/rar.png');
                } else if (type == 'apk') {
                    return require('../../../public/images/apk.png');
                }
                return require('../../../public/images/unknow.png');
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
                    files.push({name: children[i].name, isDir: children[i].isDir, date: children[i].modifyDateTime, type: type, icon: this.getIcon(type), size: children[i].size});
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
//                if (node.loaded) {
                    var r = this.getFiles(node);
                    this.showFiles(r);
//                } else if (node.isLeaf) {
//                    var r = this.getFiles(node);
//                    this.showFiles(r);
//                }

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
            },

            onBackward() {
                alert('backward')
            },

            onForward() {
                alert('forward')
            },

            onRefreshClick() {
                alert('refresh')
            },

            onNewDirClick() {
                let d = this.$refs.dialog;
                d.show('新建文件夹', '新建文件夹');
                d.extra = 'new';
                //alert('new dir')
            },

            doConfirm(name, oldName) {
                let d = this.$refs.dialog;
                if (d.extra == 'new') {
                    this.doNewDirClick(name);
                } else if (d.extra == 'modify') {
                    this.doModify(oldName, name);
                }
            },

            doNewDirClick(name) {
                if (name == '') {
                    alert('名字不能为空');
                    return;
                }
                let data = this.findFromTree(this.currentPath, this.fileTree);
                if (data != undefined) {
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].name == name) {
                            alert(name + '已存在');
                            return;
                        }
                    }
                    let dir = {
                        name: name,
                        isDir: true,
                        modifyDateTime: "2000-5-08 10:20:5",
                        type: "文件夹",
                        children: []
                    };
                    data.push(dir);
                    let dirs = this.currentPath.split('/');
                    let count = dirs.length;
                    let key = count - 1 + '-' + dirs[dirs.length - 1];
//                    let node = this.$refs.folderTree.getNode(key);
//                    let children = this.convertToTreeItem(node, data);
                    this.$refs.folderTree.updateKeyChildren(key, []);

                    this.$refs.folderTree.append({id: count + '-' + name, name: name, isDir: true, leaf: true, children: []}, key);
//                    this.$refs.folderTree.updateKeyChildren(key, children);
//                    node.data.children.push({name: '新建文件夹', leaf: true, children: []});
                    this.showFiles(data);
                }
            },

            doModify(oldName, name) {
                let data = this.findFromTree(this.currentPath, this.fileTree);
                if (data != undefined) {
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].name == oldName) {
                            data[i].name = name;
                            break;
                        }
                    }
                    let dirs = this.currentPath.split('/');
                    let count = dirs.length;
                    let key = count - 1 + '-' + dirs[dirs.length - 1];

                   let node = this.$refs.folderTree.getNode(key);
                   let len = node.childNodes.length;
                   for(let j = 0; j < len; j++) {
                       this.$refs.folderTree.remove(node.childNodes[0]);
                   }
                   let children = this.convertToTreeItem(node, data);
                   //  this.$refs.folderTree.updateKeyChildren(key, []);
//
                    var that = this;
                    this.$nextTick(function () {
                        that.$refs.folderTree.updateKeyChildren(key, children);
                    });
//                     this.$refs.folderTree.append(key, []);
//                     for (let i = 0; i < children.length; i++) {
//                         node.append(children[i]);
//                     }

//                    node.data.children.push({name: '新建文件夹', leaf: true, children: []});
                    this.showFiles(data);
                }
            },

            onEditNameClick() {
                if (this.$refs.filesListComponent.currentRow != -1) {
                    let d = this.$refs.dialog;
                    d.show('修改', this.$refs.filesListComponent.currentRow.name);
                    d.extra = 'modify';
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
