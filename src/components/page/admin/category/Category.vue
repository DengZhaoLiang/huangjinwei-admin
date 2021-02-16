<template>
    <div>
        <div class='crumbs'>
            <el-breadcrumb separator='/'>
                <el-breadcrumb-item>
                    <i class='el-icon-lx-cascades'></i> 类别管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>类别列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class='container'>
            <div class='handle-box'>
                <el-button
                    @click='handleInsert'
                    class='handle-del mr10'
                    icon='el-icon-plus'
                    type='primary'
                >新增类别
                </el-button>
                <el-button
                    @click='delAllSelection'
                    class='handle-del mr10'
                    icon='el-icon-delete'
                    type='primary'
                >批量删除
                </el-button>
            </div>
            <el-table
                :data='tableData'
                @selection-change='handleSelectionChange'
                border
                class='table'
                header-cell-class-name='table-header'
                ref='multipleTable'
            >
                <el-table-column align='center' type='selection' width='55'></el-table-column>
                <el-table-column align='center' label='ID' prop='id' width='55'></el-table-column>
                <el-table-column align='center' label='类别名称' prop='name'></el-table-column>
                <el-table-column align='center' label='操作' width='180'>
                    <template slot-scope='scope'>
                        <el-button
                            @click='handleEdit(scope.row)'
                            icon='el-icon-edit'
                            type='text'
                        >编辑
                        </el-button>
                        <el-button
                            @click='handleDelete(scope.row)'
                            class='red'
                            icon='el-icon-delete'
                            type='text'
                        >删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class='pagination'>
                <el-pagination
                    :current-page='query.page'
                    :page-size='query.size'
                    :total='pageTotal'
                    @current-change='handlePageChange'
                    background
                    layout='total, prev, pager, next'
                ></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import request from '@/utils/request';
    import { formatDate } from '@/utils/date';

    export default {
        name: 'category',
        data() {
            return {
                query: {
                    page: 1,
                    size: 10
                },
                tableData: [],
                multipleSelection: [],
                delList: [],
                pageTotal: 0,
                id: -1
            };
        },
        created() {
            this.getData();
        },
        methods: {
            getData() {
                request.get('/api/admin/category', this.query)
                    .then(res => {
                        if (res.status === 200) {
                            let data = res.data;
                            this.tableData = data.content;
                            this.pageTotal = data.totalElements;
                            this.page = data.number;
                        } else {
                            this.$message.error(res.message);
                        }
                    });
            },
            // 删除操作
            handleDelete(row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    request.delete('/api/admin/category/' + row.id)
                        .then(res => {
                            if (res.status === 200) {
                                this.getData();
                                this.$message.success('删除成功');
                            }
                        });
                }).catch(() => {
                });
            },
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            delAllSelection() {
                request.delete('api/admin/category', {
                    ids: this.multipleSelection.map(val => val.id)
                }).then(() => {
                    const length = this.multipleSelection.length;
                    let str = '';
                    this.delList = this.delList.concat(this.multipleSelection);
                    for (let i = 0; i < length; i++) {
                        str += this.multipleSelection[i].name + ' ';
                    }
                    this.multipleSelection = [];
                    this.$set(this.query, 'page', 1);
                    this.getData();
                    this.$message.error(`删除了${str}`);
                });
            },
            // 编辑操作
            handleEdit(row) {
                this.$router.push({ path: '/admin/categoryEdit', query: { id: row.id } });
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'page', val);
                this.getData();
            },
            // 格式化时间戳
            formatInstant(row, col, val, index) {
                let date = new Date(val * 1000);
                return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
            },
            // 新增类别
            handleInsert() {
                this.$router.push('/admin/categoryEdit');
            }
        },
        watch: {
            '$route'() {
                this.getData();
            }
        }
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .table {
        width: 100%;
        font-size: 14px;
    }

    .red {
        color: #ff0000;
    }

    .mr10 {
        margin-right: 10px;
    }
</style>
