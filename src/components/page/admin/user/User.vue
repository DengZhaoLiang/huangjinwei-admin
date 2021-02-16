<template>
    <div>
        <div class='crumbs'>
            <el-breadcrumb separator='/'>
                <el-breadcrumb-item>
                    <i class='el-icon-lx-cascades'></i> 用户管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>用户列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class='container'>
            <div class='handle-box'>
                <el-button
                    @click='delAllSelection'
                    class='handle-del mr10'
                    icon='el-icon-delete'
                    type='primary'
                >批量删除
                </el-button>
                <el-input class='handle-input mr10' placeholder='用户名' v-model='query.name'></el-input>
                <el-input class='handle-input mr10' placeholder='手机号' v-model='query.phone'></el-input>
                <el-button @click='handleSearch' icon='el-icon-search' type='primary'>搜索</el-button>
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
                <el-table-column label='手机号' prop='phone'></el-table-column>
                <el-table-column label='昵称' prop='name'></el-table-column>
                <el-table-column align='center' label='头像'>
                    <template slot-scope='scope'>
                        <el-image
                            :preview-src-list='[scope.row.avatar]'
                            :src='scope.row.avatar'
                            class='table-td-thumb'
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column :formatter='formatInstant' label='最近登录时间' prop='lastLoginAt'></el-table-column>
                <el-table-column :formatter='formatInstant' label='注册时间' prop='createdAt'></el-table-column>
                <el-table-column align='center' label='操作' width='180'>
                    <template slot-scope='scope'>
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
        name: 'userForm',
        data() {
            return {
                query: {
                    phone: '',
                    name: '',
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
                request.get('/api/admin/user', this.query)
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
            // 触发搜索按钮
            handleSearch() {
                this.tableData = [];
                this.$set(this.query, 'page', 1);
                this.getData();
            },
            // 删除操作
            handleDelete(row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    request.delete('/api/admin/user/' + row.id)
                        .then(() => {
                            this.$set(this.query, 'page', 1);
                            this.getData();
                            this.$message.success('删除成功');
                        });
                }).catch(() => {
                });
            },
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            delAllSelection() {
                request.delete('api/admin/user', {
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
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'page', val);
                this.getData();
            },
            // 格式化时间戳
            formatInstant(row, col, val, index) {
                let date = new Date(val * 1000);
                return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
            }
        }
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
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

    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }
</style>
