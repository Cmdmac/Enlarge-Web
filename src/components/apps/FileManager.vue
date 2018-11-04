<template>
    <div class="container" v-loading="loading">
        <Dialog ref="dialog" v-on:onConfirm="doConfirm"></Dialog>
        <div class="header">
            <input style="width: 300px;" placeholder="搜索"/>
            <div class="switchFile">
                <input ref="upload" type="file" style="display: none;" multiple="true" @change="onFileSelected"/>
                <i class="el-icon-upload2" style="width: 20px; height: 20px; margin-right: 5px" @click="submitUpload"></i>
                <i class="el-icon-download" style="width: 20px; height: 20px; margin-right: 5px" @click="onDownload"></i>
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
            <PathNavigator  ref="pathNavigator" :currentPath="currentPath" style="margin-left: 10px" v-on:onNavigatorTo="onNavigatorTo"></PathNavigator>
        </div>
        <div ref="content" class="content">
            <div class="left">
                <el-tree
                        class="tree"
                        :default-expanded-keys='["0-sdcard"]'
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
    import axios from "axios";
    import qs from 'qs';
    import { toSizeString, getIcon } from "../util.js"

    export default {
        name: 'FileManager',
        components: { PathNavigator, FileView, GridFileView, Dialog },
        props: {
            msg: String
        },
        data() {
            return {
                loading: false,
                showFileType: "FileView",
                tableData: [],
                currentPath: "",
                tree_items: {
                    label: 'name',
                    children: 'children',
                    isLeaf: 'leaf'
                },
                fileTree: {},
                uploadUrl: this.custom_config.http_server + this.custom_config.api.fileManager.upload
            };
        },

        mounted() {
           let tree = this.$refs.content;
           //eslint-disable-next-line
            console.log(tree.offsetHeight);
        },

        methods: {
            onFileSelected(e) {
                //eslint-disable-next-line
                console.log(e.target.files);
                var data = new FormData();//重点在这里 如果使用 var data = {}; data.inputfile=... 这样的方式不能正常上传
                for (let i = 0; i < e.target.files.length; i++) {
                    data.append(e.target.files[i].name, e.target.files[i]);
                }

                data.append("dir", this.currentPath)    ;
                // var cfg = {
                //   'Content-type':'multipart/form-data'
                // }
//                axios.defaults.headers.post['Content-Type']='multipart/form-data; charset=UTF-8;'
                let instance = axios.create({
                    headers: { 'Content-Type': 'charset=UTF-8; multipart/form-data;' }
                });
                var that = this;
                instance.post(this.custom_config.http_server + this.custom_config.api.fileManager.upload, data)
                    .then(function(data){
                        //eslint-disable-next-line
//                        console.log(data);
                        if (data.data.code == 200) {
                            //refresh
                            that.onRefreshClick();
                        }
                },function(err){
                    //eslint-disable-next-line
                    console.log(err);
                })
//                this.$refs.uploadForm.submit();
                this.$refs.upload.value = null;
            },

            submitUpload() {
                this.$refs.upload.click();
//                this.$refs.upload.submit();
            },

            beforeUpload: function (file) {
                //eslint-disable-next-line
                console.log(file)
                //这里是重点，将文件转化为formdata数据上传
                let fd = new FormData()
                fd.append('file', file)
                return false;
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

            updateTreeData(path, tree, data) {
                let pos = 0;
                let index = 0;
                let parent = tree;
                let node = tree;
                let parts = path.split("/");
                while (pos < parts.length) {
                    if (pos + 1 == parts.length) {
                        //find
                        node = data;
                        parent.children.splice(index, 1, data);
                        break;
                    }
                    if (parts[pos] == node.name) {
                        for (let i = 0; i < node.children.length; i++) {
                            let item = node.children[i];
                            if (item.name == parts[pos + 1]) {
                                parent = node;
                                node = node.children[i];
                                index = i;
                                break;
                            }
                        }

                    }
                    pos++;
                }
            },

            getFiles(node) {
                let path = this.buildPath(node);
                let data = this.findFromTree(path, this.fileTree);
                return data;
            },

            //原始数据转变成tree数据
            convertToTreeItem(level, item) {
                if (Array.isArray(item) == true) {
                    let children = [];
                    if (item == undefined) {
                        return children;
                    }
                    for (let i = 0; i < item.length; i++) {
                        let child = item[i];
                        if (child.isDir) {
                            let h = this.convertToTreeItem(level, child);//{name: child.name, isDir: child.isDir, leaf: false};
                            children.push(h);
                        }
                    }
                    return children;
                } else {
                    var treeItem = {};
                    if (item == undefined) {
                        return treeItem;
                    }
//                if (item.isDir) {
                    treeItem.name = item.name;
                    treeItem.isDir = item.isDir;
                    treeItem.id = level + '-' + item.name;
                    treeItem.children = [];
                    let children = this.convertToTreeItem(level + 1, item.children);
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

            loadFromNetwork(dir, node, resolve) {

                this.$set(this, 'loading', true);

                var that = this;
                axios.get(this.custom_config.http_server + this.custom_config.api.fileManager.list, {params: { dir: dir }})
                    .then(function (response) {
                        //eslint-disable-next-line
//                                console.log(response.data);
                        //根目录名
                        if (node.level == 0) {
                            let root = {id: "0-sdcard", name: "sdcard", isDir: true, leaf: false, children: []}
                            response.data.name = "sdcard";
                            that.$set(that, 'fileTree', response.data);
                            that.$set(that, 'currentPath', root.name);
                            resolve([root]);
                        } else {
                            let c = that.convertToTreeItem(node.level, response.data);
                            if (resolve != undefined) {
                                resolve([c]);
                            }
                            //插入数据
                            that.updateTreeData(dir, that.fileTree, response.data);
//                            that.$refs.folderTree.updateKeyChildren(node.data.id, c);
                            node.expand();
                        }
                        //eslint-disable-next-line
//                                console.log(c);

                        that.showFiles(response.data.children);
                        that.$set(that, 'loading', false);
                    })
                    .catch(function (error) {
                        //eslint-disable-next-line
                        console.log(error);
                        that.$set(that, 'loading', false);
                    });
            },

            loadNode(node, resolve) {

                if (node.level == 0) {
                    //load from network
                    this.loadFromNetwork("", node, resolve);
                } else {
                    let data = this.getFiles(node);
                    if (data == undefined) {
                        let dir = this.buildPath(node);
                        this.loadFromNetwork(dir, node, resolve);
                    } else {
                        let treeData = this.convertToTreeItem(node.level, data);
                        resolve(treeData);
                        this.showFiles(data);
                    }
                }
            },

            showFiles(data) {
                //eslint-disable-next-line
//                console.log(data);
                var files = [];
                let children = data;
                var that = this;
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
                        } else {
                            type = "unknown";
                        }
                    }
                    files.push({name: children[i].name, isDir: children[i].isDir,
                        date: new Date(children[i].lastModify).format("yyyy-MM-dd hh:mm:ss"),
                        type: type, icon: getIcon(type),
                        size: children[i].isDir ? "" : toSizeString(children[i].size), thumb: that.custom_config.http_server + that.custom_config.api.fileManager.getThumb + "?path=" + this.currentPath + "/" + children[i].name
                    });
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
                    if (r == undefined) {
                        this.loadFromNetwork(path, node, undefined);
                    } else {
                        this.showFiles(r);
                    }
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
                    if (data == undefined) {
                        let count = 0;
                        for (let i = 0; i < this.currentPath.length; i++) {
                            if (this.currentPath.charAt(i) == '/') {
                                count++;
                            }
                        }
                        this.$set(this, 'currentPath', enterPath);
                        let node = this.$refs.folderTree.getNode((count + 1) + '-' + row.name);
//                        node.expand();
                        this.loadFromNetwork(enterPath, node, undefined);
                    } else {
                        this.showFiles(data);
                        let count = 0;
                        for (let i = 0; i < this.currentPath.length; i++) {
                            if (this.currentPath.charAt(i) == '/') {
                                count++;
                            }
                        }
                        this.$set(this, 'currentPath', enterPath);
                        let node = this.$refs.folderTree.getNode((count + 1) + '-' + row.name);
                        node.expand();
                    }
                } else {
                    let path = this.currentPath + '/' + this.$refs.filesListComponent.currentRow.name;
                    let url = this.custom_config.http_server + this.custom_config.api.fileManager.open + '?path=' + path;
                    window.open(url);
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
                let count = 0;
                for (let i = 0; i < this.currentPath.length; i++) {
                    if (this.currentPath.charAt(i) == '/') {
                        count++;
                    }
                }
                let node = this.$refs.folderTree.getNode(count + '-' + this.$refs.pathNavigator.lastPath());
//                        node.expand();
                this.loadFromNetwork(this.currentPath, node, undefined);
            },

            onDownload() {
                // eslint-disable-next-line
                let path = this.currentPath + '/' + this.$refs.filesListComponent.currentRow.name;
                let url = this.custom_config.http_server + this.custom_config.api.fileManager.download + '?path=' + path;
                window.open(url);
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
                    var that = this;
                    let instance = axios.create({
                        headers: { 'content-type': 'application/x-www-form-urlencoded' }
                    });
                    instance.post(this.custom_config.http_server + this.custom_config.api.fileManager.mkDir,
                        qs.stringify({ dir: this.currentPath, name: name }
                    )).then(function (response) {
                            if (response.data.code == 200) {
                                let dir = {
                                    name: name,
                                    isDir: true,
                                    lastModify: 0,
                                    type: "文件夹",
                                    children: []
                                };
                                data.push(dir);
                                let dirs = that.currentPath.split('/');
                                let count = dirs.length;
                                let key = count - 1 + '-' + dirs[dirs.length - 1];
                                let node = that.$refs.folderTree.getNode(key);
                                let children = that.convertToTreeItem(node, data);
                                that.$refs.folderTree.updateKeyChildren(key, children);
                                that.showFiles(data);
                            }
                        })
                        .catch(function (error) {
                            //eslint-disable-next-line
                            console.log(error);
                        });

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
                   let children = this.convertToTreeItem(node.level, data);
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

    .tree {
        width: 100%;
        height: 100%;
        overflow: auto;
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
