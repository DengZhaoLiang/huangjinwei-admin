import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err);
};

export default new Router({
    mode: 'hash',
    routes: [
        {
            path: '/admin',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/admin/Home.vue'),
            redirect: '/admin/index',
            meta: { title: 'Home' },
            children: [
                {
                    path: 'index',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/admin/home/Dashboard.vue'),
                    meta: { title: '首页' }
                },
                {
                    path: 'profile',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/admin/home/AdminForm.vue'),
                    meta: { title: '个人资料' }
                },
                {
                    path: 'category',
                    component: () => import(/* webpackChunkName: "category" */ '../components/page/admin/category/Category.vue'),
                    meta: { title: '类别' }
                },
                {
                    path: 'categoryEdit',
                    component: () => import(/* webpackChunkName: "category" */ '../components/page/admin/category/CategoryEdit.vue'),
                    meta: { title: '类别编辑' }
                },
                {
                    path: 'book',
                    component: () => import(/* webpackChunkName: "book" */ '../components/page/admin/book/Book.vue'),
                    meta: { title: '图书' }
                },
                {
                    path: 'bookEdit',
                    component: () => import(/* webpackChunkName: "book" */ '../components/page/admin/book/BookEdit.vue'),
                    meta: { title: '图书编辑' }
                },
                {
                    path: 'order',
                    component: () => import(/* webpackChunkName: "order" */ '../components/page/admin/order/Order.vue'),
                    meta: { title: '订单' }
                },
                {
                    path: 'user',
                    component: () => import(/* webpackChunkName: "user" */ '../components/page/admin/user/User.vue'),
                    meta: { title: '用户' }
                },
                {
                    path: '404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/admin/error/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/admin/error/403.vue'),
                    meta: { title: '403' }
                }
            ]
        },
        {
            path: '/admin/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/admin/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '/admin*/',
            redirect: '/admin/404'
        }
    ]
});
