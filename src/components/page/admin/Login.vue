<template>
    <div class='login-wrap'>
        <div class='ms-login'>
            <div class='ms-title'>SMALLFROG管理系统</div>
            <el-form :model='param' :rules='rules' class='ms-content' label-width='0px' ref='login'>
                <el-form-item prop='account'>
                    <el-input placeholder='管理员账号' v-model='param.account'>
                        <el-button icon='el-icon-lx-people' slot='prepend'></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop='password'>
                    <el-input
                        @keyup.enter.native='submitForm()'
                        placeholder='管理员密码'
                        type='password'
                        v-model='param.password'
                    >
                        <el-button icon='el-icon-lx-lock' slot='prepend'></el-button>
                    </el-input>
                </el-form-item>
                <div class='login-btn'>
                    <el-button @click='submitForm()' type='primary'>登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    import request from '../../../utils/request.js';

    export default {
        data: function() {
            return {
                param: {
                    account: '',
                    password: ''
                },
                rules: {
                    account: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                    password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
                }
            };
        },
        methods: {
            submitForm() {
                this.$refs.login.validate(valid => {
                    if (valid) {
                        request.post('/api/admin', this.param)
                            .then(res => {
                                if (res.status === 200) {
                                    localStorage.setItem('adminUsername', res.data.name);
                                    localStorage.setItem('ms_avatar', res.data.avatar);
                                    this.$router.push('/admin');
                                } else {
                                    this.$message.error(res.message);
                                }
                            });
                    } else {
                        this.$message.error('请输入账号和密码');
                        return false;
                    }
                });
            }
        }
    };
</script>

<style scoped>
    .login-wrap {
        position: relative;
        width: 100%;
        height: 100%;
        background-image: url(../../../assets/img/login-bg.jpg);
        background-size: 100%;
    }

    .ms-title {
        width: 100%;
        line-height: 50px;
        text-align: center;
        font-size: 20px;
        color: #15d4cb;
        border-bottom: 1px solid #ddd;
    }

    .ms-login {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 350px;
        margin: -190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.7);
        overflow: hidden;
    }

    .ms-content {
        padding: 30px 30px;
    }

    .login-btn {
        text-align: center;
    }

    .login-btn button {
        width: 100%;
        height: 36px;
        margin-bottom: 10px;
    }
</style>
