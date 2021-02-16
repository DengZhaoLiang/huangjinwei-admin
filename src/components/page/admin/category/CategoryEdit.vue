<template>
    <div>
        <div class='crumbs'>
            <el-breadcrumb separator='/'>
                <el-breadcrumb-item>
                    <i class='el-icon-lx-cascades'></i> 类别管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>编辑</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class='container'>
            <div class='form-box'>
                <el-form :model='form' label-width='80px' ref='form'>
                    <el-form-item label='类别名称'>
                        <el-input v-model='form.name'></el-input>
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
        name: 'categoryEdit',
        data() {
            return {
                form: {
                    id: '',
                    name: ''
                }
            };
        },
        created() {
            this.getData();
        },
        methods: {
            getData() {
                if (typeof this.$route.query.id !== 'undefined') {
                    request.get('/api/admin/category/' + this.$route.query.id)
                        .then(res => {
                            if (res.status === 200) {
                                this.form = res.data;
                            }
                        });
                }
            },
            onSubmit() {
                if (typeof this.$route.query.id !== 'undefined') {
                    request.put('/api/admin/category', this.form)
                        .then(res => {
                            if (res.status === 200) {
                                this.$message.success('提交成功！');
                                this.$router.back();
                            }
                        });
                } else {
                    request.post('/api/admin/category', this.form)
                        .then(res => {
                            if (res.status === 200) {
                                this.$message.success('提交成功！');
                                this.$router.back();
                            }
                        });
                }
            },
        },
        watch: {
            '$route'() {
                this.form = {};
                this.getData();
            }
        }
    };
</script>

<style>
</style>
