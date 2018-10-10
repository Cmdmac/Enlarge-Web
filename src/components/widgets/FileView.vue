<template>
    <div ref="container" class="container">
        <el-table
                :highlight-current = "true"
                :data="files"
                :highlight-current-row="true"
                @current-change="onRowChange"
                height="tableHeight"
                @row-dblclick="onTableRowDbClick"
                :default-sort = "{prop: 'name', order: 'descending'}"
                :row-class-name="tableRowClass"
                :max-height="800">
            <el-table-column
                    prop="name"
                    label="名称"
                    :sort-method="sortFiles"
                    sortable>
                <template slot-scope="scope" >
                    <div style="display: flex; width: 100% ">
                        <img v-if="scope.row.isDir"
                             class="icon"
                             :src="require('../../../public/images/grid_dirempty.png')"/>
                        <img class="icon" v-else :src="scope.row.icon"/>
                        <span>{{ scope.row.name }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    prop="date"
                    label="修改日期"
                    sortable
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="type"
                    label="类型"
                    sortable
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="size"
                    sortable
                    label="大小"
                    width="120">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        name: "FileView",
        props: {files: Array},
        data() {
            return {
                tableHeight: this.$refs.container,
                currentRow: -1
            }
        },

        methods: {

            /* eslint-disable */
            onTableRowDbClick(row, event) {
                this.$emit('onTableRowDbClick', row);
            },

            sortFiles(a, b) {
//                if (a.isDir && !b.isDir) {
//                    return true;
//                } else if (!a.isDir && b.isDir) {
//                    return false;
//                } else if (a.isDir && b.isDir) {
//                    return true;
//                } else if (!a.isDir && !b.isDir) {
//                    return false;
//                }
                if (a.isDir) {
                    return false;
                }

                if (b.isDir) {
                    return true;
                }
                return true;
            },

            /* eslint-disable */
            tableRowClass(row) {
                return "tableRow";
            },

            onRowChange(currentRow, oldCurrentRow) {
                this.$set(this, 'currentRow', currentRow);
            }
        }
    }
</script>

<style scoped>
    .container {
        width: 100%;
        height: 100%;
        display: flex;
        /*flex-direction: column;*/
        /*align-items: stretch;*/
    }

    .tableRow {
        cursor: pointer;
    }

    .icon {
        width: 22px;
        height: 22px;
        margin-right: 5px;
    }
</style>