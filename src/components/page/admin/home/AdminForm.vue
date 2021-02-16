<template>
    <div>
        <div class='crumbs'>
            <el-breadcrumb separator='/'>
                <el-breadcrumb-item>
                    <i class='el-icon-lx-calendar'></i> 设置
                </el-breadcrumb-item>
                <el-breadcrumb-item>个人资料</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class='container'>
            <div class='form-box'>
                <el-form :model='form' label-width='80px' ref='form'>
                    <el-form-item label='账号'>
                        <el-input v-model='form.account'></el-input>
                    </el-form-item>
                    <el-form-item label='姓名'>
                        <el-input v-model='form.name'></el-input>
                    </el-form-item>
                    <el-form-item label='头像'>
                        <el-upload
                            :on-success='handleAvatarSuccess'
                            :show-file-list='false'
                            action='http://localhost:9527/api/supplier/upload'>
                            <img :src='showImage' class='avatar'>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label='旧密码'>
                        <el-input type='password' v-model='oldPassword'></el-input>
                    </el-form-item>
                    <el-form-item label='新密码'>
                        <el-input type='password' v-model='newPassword'></el-input>
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
        name: 'adminForm',
        data() {
            return {
                form: {
                    account: '',
                    name: '',
                    avatar: '',
                    password: ''
                },
                oldPassword: '',
                newPassword: ''
            };
        },
        created() {
            request.get('/api/admin')
                .then(res => {
                    if (res.status === 200) {
                        this.form = res.data;
                    }
                });
        },
        methods: {
            onSubmit() {
                this.form.password = this.getPassword;
                request.put('/api/admin', this.form);
                this.$message.success('提交成功！');
                request.get('/api/admin')
                    .then(res => {
                        if (res.status === 200) {
                            localStorage.setItem('adminUsername', res.data.name);
                            localStorage.setItem('ms_avatar', res.data.avatar);
                            location.reload();
                        }
                    });
            },
            handleAvatarSuccess(res, file) {
                this.form.avatar = res;
                localStorage.setItem('ms_avatar', res);
            }
        },
        computed: {
            getPassword() {
                if (this.oldPassword !== '' && this.newPassword !== '') {
                    if (this.form.password !== this.oldPassword) {
                        this.$message.error('密码不正确，请重新输入');
                        this.reject();
                        return '';
                    }
                    return this.newPassword;
                }
            },
            showImage() {
                return !this.form.avatar ?
                    'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3041701001,1968583786&fm=11&gp=0.jpg' : this.form.avatar;
            }
        }
    };
</script>

<style>
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>
