<template>
    <div>
        <div class='crumbs'>
            <el-breadcrumb separator='/'>
                <el-breadcrumb-item>
                    <i class='el-icon-lx-cascades'></i> 订单管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>订单列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class='container'>
            <div class='handle-box'>
                <el-input class='handle-input mr10' placeholder='订单号' v-model='query.orderSn'></el-input>
                <el-input class='handle-input mr10' placeholder='图书名' v-model='query.name'></el-input>
                <el-select placeholder='请选择' v-model='query.status'>
                    <el-option key='1' label='未付款' value='1'></el-option>
                    <el-option key='2' label='已付款' value='2'></el-option>
                </el-select>
                <el-button @click='handleSearch' icon='el-icon-search' type='primary'>搜索</el-button>
            </div>
            <el-table
                :data='tableData'
                border
                class='table'
                header-cell-class-name='table-header'
                ref='multipleTable'
            >
                <el-table-column align='center' type='selection' width='55'></el-table-column>
                <el-table-column align='center' label='ID' prop='id' width='55'></el-table-column>
                <el-table-column align='center' label='图书名' prop='name'></el-table-column>
                <el-table-column align='center' label='订单号' prop='orderSn'></el-table-column>
                <el-table-column align='center' label='购买金额'>
                    <template slot-scope='scope'>￥{{ scope.row.totalPrice }}</template>
                </el-table-column>
                <el-table-column :formatter='formatInstant' label='支付时间' prop='payAt'></el-table-column>
                <el-table-column align='center' label='状态'>
                    <template slot-scope='scope'>
                        <el-tag
                            :type="scope.row.status===2 ?'success':(scope.row.status=== 1 ?'danger':'')"
                        >{{ scope.row.statusStr }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column :formatter='formatInstant' label='下单时间' prop='createdAt'></el-table-column>
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
        name: 'order',
        data() {
            return {
                query: {
                    orderSn: '',
                    name: '',
                    status: '',
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
                request.get('/api/admin/order', this.query)
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
