<template>
    <el-dialog :title="title" :visible.sync="showDialog"   width="30%">
        <el-input name="name" v-model="name" placeholder="请输入名称" clearable></el-input>
        <div slot="footer" class="dialog-footer">
            <el-button @click="showDialog = false">取 消</el-button>
            <el-button type="primary" @click="onConfirm">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
    export default {
        data() {return {title: '', showDialog: false, oldName:'', name: '', callback: ''}},
        methods: {
            onConfirm() {
                this.$emit('onConfirm', this.name, this.oldName);
                this.hide();
            },

            show(title, name) {
                this.$set(this, 'title', title);
                this.$set(this, 'oldName', name);
                this.$set(this, 'name', name);
                this.$set(this, 'showDialog', true);
            },

            hide() {
                this.$set(this, 'showDialog', false);
            },

            getName() {
                return this.name;
            }
        }
    }
</script>