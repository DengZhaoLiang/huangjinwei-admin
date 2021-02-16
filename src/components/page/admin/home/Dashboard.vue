<template>
    <div>
        <el-row :gutter='24'>
            <el-col :span='24'>
                <img alt='首页背景图' src='../../../../assets/img/dashboard.jpg'
                     style='width: 1620px; height: 710px; margin-top: 10px'>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: 'dashboard',
        data() {
            return {
                name: localStorage.getItem('adminUsername')
            };
        },
        computed: {},
        created() {
        },
        methods: {}
    };
</script>


<style scoped>

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list span {
        margin-left: 70px;
    }
</style>
