<template>
    <div class='sidebar'>
        <el-menu
            :collapse='collapse'
            :default-active='onRoutes'
            active-text-color='#20a0ff'
            background-color='#324157'
            class='sidebar-el-menu'
            router
            text-color='#bfcbd9'
            unique-opened
        >
            <template v-for='item in items'>
                <template v-if='item.subs'>
                    <el-submenu :index='item.index' :key='item.index'>
                        <template slot='title'>
                            <i :class='item.icon'></i>
                            <span slot='title'>{{ item.title }}</span>
                        </template>
                        <template v-for='subItem in item.subs'>
                            <el-submenu
                                :index='subItem.index'
                                :key='subItem.index'
                                v-if='subItem.subs'
                            >
                                <template slot='title'>{{ subItem.title }}</template>
                                <el-menu-item
                                    :index='threeItem.index'
                                    :key='i'
                                    v-for='(threeItem,i) in subItem.subs'
                                >{{ threeItem.title }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                :index='subItem.index'
                                :key='subItem.index'
                                v-else
                            >{{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index='item.index' :key='item.index'>
                        <i :class='item.icon'></i>
                        <span slot='title'>{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from './bus';

    export default {
        data() {
            return {
                collapse: false,
                items: [
                    {
                        icon: 'el-icon-lx-home',
                        index: 'index',
                        title: '系统首页'
                    },
                    {
                        icon: 'el-icon-lx-calendar',
                        index: 'category',
                        title: '类别管理'
                    },
                    {
                        icon: 'el-icon-lx-calendar',
                        index: 'book',
                        title: '图书管理'
                    },
                    {
                        icon: 'el-icon-lx-calendar',
                        index: 'order',
                        title: '订单管理'
                    },
                    {
                        icon: 'el-icon-lx-calendar',
                        index: 'user',
                        title: '用户管理'
                    }
                ]
            };
        },
        computed: {
            onRoutes() {
                return this.$route.path.replace('/', '');
            }
        },
        created() {
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
                bus.$emit('collapse-content', msg);
            });
        }
    };
</script>

<style scoped>
    .sidebar {
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom: 0;
        overflow-y: scroll;
    }

    .sidebar::-webkit-scrollbar {
        width: 0;
    }

    .sidebar-el-menu:not(.el-menu--collapse) {
        width: 250px;
    }

    .sidebar > ul {
        height: 100%;
    }
</style>
