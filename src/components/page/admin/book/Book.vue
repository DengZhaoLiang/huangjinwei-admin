<template>
    <div>
        <div class='crumbs'>
            <el-breadcrumb separator='/'>
                <el-breadcrumb-item>
                    <i class='el-icon-lx-cascades'></i> 图书管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>图书列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class='container'>
            <div class='handle-box'>
                <el-button
                    @click='handleInsert'
                    class='handle-del mr10'
                    icon='el-icon-plus'
                    type='primary'
                >新增图书
                </el-button>
                <el-button
                    @click='delAllSelection'
                    class='handle-del mr10'
                    icon='el-icon-delete'
                    type='primary'
                >批量删除
                </el-button>
                <el-input class='handle-input mr10' placeholder='图书名' v-model='query.name'></el-input>类别：
                <template>
                    <el-select v-model="query.categroyId" placeholder="请选择">
                        <el-option
                                v-for="categoty in categories"
                                :key="categoty.id"
                                :label="categoty.name"
                                :value="categoty.id">
                        </el-option>
                    </el-select>
                </template>
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
                <el-table-column align='center' label='书名' prop='name'></el-table-column>
                <el-table-column align='center' label='作者' prop='author'></el-table-column>
                <el-table-column align='center' label='封面图'>
                    <template slot-scope='scope'>
                        <el-image
                            :preview-src-list='[scope.row.image]'
                            :src='scope.row.image'
                            class='table-td-thumb'
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column align='center' label='图书价格'>
                    <template slot-scope='scope'>￥{{ scope.row.price }}</template>
                </el-table-column>
                <el-table-column align='center' label='库存' prop='inventory'></el-table-column>
                <el-table-column align='center' label='推荐程度' prop='commend'></el-table-column>
                <el-table-column align='center' label='类别' prop='categoryName'></el-table-column>
                <el-table-column align='center' label='状态'>
                    <template slot-scope='scope'>
                        <el-tag
                            :type="scope.row.status===1 ?'success':(scope.row.status=== 0 ?'danger':'')"
                        >{{ scope.row.statusStr }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column align='center' label='操作' width='180'>
                    <template slot-scope='scope'>
                        <el-button
                            @click='handleStatus(scope.row)'
                            icon='el-icon-d-caret'
                            type='text'>
                            {{ scope.row.status === 1 ? '下架' : '上架' }}
                        </el-button>
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
        name: 'book',
        data() {
            return {
                query: {
                    categroyId: '',
                    name: '',
                    page: 1,
                    size: 10
                },
                tableData: [],
                multipleSelection: [],
                delList: [],
                pageTotal: 0,
                id: -1,
                categories: []
            };
        },
        created() {
            this.getData();
            request.get(`api/admin/category/list`)
                .then(res => {
                    if (res.status === 200) {
                        this.categories = res.data
                        console.log()
                    } else {
                        this.$message.error(res.message)
                    }
                })
        },
        methods: {
            getData() {
                request.get('/api/admin/book', this.query)
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
                this.$set(this.query, 'pageIndex', 1);
                this.getData();
            },
            // 删除操作
            handleDelete(row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    request.delete('/api/admin/book/' + row.id)
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
                request.delete('api/admin/book', {
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
                this.$router.push({ path: '/admin/bookEdit', query: { id: row.id } });
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
            // 上下架图书
            handleStatus(row) {
                let status = row.status === 1 ? 0 : 1;
                request.put('/api/admin/book/' + row.id + '/' + status)
                    .then(res => {
                        if (res.status === 200) {
                            this.getData();
                            if (status === 1) {
                                this.$message.success('上架成功');
                            } else {
                                this.$message.success('下架成功');
                            }
                        }
                    });
            },
            // 新增图书
            handleInsert() {
                this.$router.push('/admin/bookEdit');
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
