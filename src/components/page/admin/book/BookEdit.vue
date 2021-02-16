<template>
    <div>
        <div class='crumbs'>
            <el-breadcrumb separator='/'>
                <el-breadcrumb-item>
                    <i class='el-icon-lx-cascades'></i> 图书管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>编辑</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class='container'>
            <div class='form-box'>
                <el-form :model='form' label-width='80px' ref='form'>
                    <el-form-item label='书名'>
                        <el-input v-model='form.name'></el-input>
                    </el-form-item>
                    <el-form-item label='作者'>
                        <el-input v-model='form.author'></el-input>
                    </el-form-item>
                    <el-form-item label='封面图'>
                        <el-upload
                            :on-success='handleAvatarSuccess'
                            :show-file-list='false'
                            action='http://localhost:9527/api/supplier/upload'
                            class='avatar-uploader'>
                            <img :src='form.image' class='avatar' v-if='form.image'>
                            <i class='el-icon-plus avatar-uploader-icon' v-else></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label='价格'>
                        <el-input min='0.00' step='0.01' type='Number' v-model='form.price'></el-input>
                    </el-form-item>
                    <el-form-item label='库存量'>
                        <el-input min='0' type='Number' v-model='form.inventory'></el-input>
                    </el-form-item>
                    <el-form-item label='推荐程度'>
                        <el-input min='0.0' max="5.0" step="0.1" type='Number' v-model='form.commend'></el-input>
                    </el-form-item>
                    <el-form-item label='类别'>
                        <template>
                            <el-select v-model="form.categoryId" placeholder="请选择">
                                <el-option
                                        v-for="categoty in categories"
                                        :key="categoty.id"
                                        :label="categoty.name"
                                        :value="categoty.id">
                                </el-option>
                            </el-select>
                        </template>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click='onSubmit' type='primary'>确定</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>

    import request from '@/utils/request';

    export default {
        name: 'bookEdit',
        data() {
            return {
                form: {
                    id: '',
                    name: '',
                    author: '',
                    image: '',
                    price: 0.00,
                    inventory: 0,
                    commend: 0,
                    categoryId: ''
                },
                categories: []
            };
        },
        created() {
            this.getData();
        },
        methods: {
            getData() {
                if (typeof this.$route.query.id !== 'undefined') {
                    request.get('/api/admin/book/' + this.$route.query.id)
                        .then(res => {
                            if (res.status === 200) {
                                this.form = res.data;
                            }
                        });
                }
            },
            onSubmit() {
                if (this.form.categoryId === '') {
                    this.$message.error('图书类别不能为空')
                }
                if (typeof this.$route.query.id !== 'undefined') {
                    request.put('/api/admin/book', this.form)
                        .then(res => {
                            if (res.status === 200) {
                                this.$message.success('提交成功！');
                                this.$router.back();
                            }
                        });
                } else {
                    request.post('/api/admin/book', this.form)
                        .then(res => {
                            if (res.status === 200) {
                                this.$message.success('提交成功！');
                                this.$router.back();
                            }
                        });
                }
            },
            handleAvatarSuccess(res, file) {
                this.form.image = res;
            },
        },
        watch: {
            '$route'() {
                this.form = {};
                this.getData();
            }
        },
        created () {
            request.get(`api/admin/category/list`)
                .then(res => {
                    if (res.status === 200) {
                        this.categories = res.data
                    } else {
                        this.$message.error(res.message)
                    }
                })
        }
    };
</script>

<style>
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>
