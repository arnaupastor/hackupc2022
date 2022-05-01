import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "HelloWorld",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: function () {
            return import(
                /* webpackChunkName: "about" */ "./components/HelloWorld.vue"
                );
        },
    },
    {
        path: "/moto/:id",
        name: "ProductPage",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: function () {
            return import(
                /* webpackChunkName: "about" */ "./components/ProductPage.vue"
                );
        },
    },

    {
        path: "/tasacion",
        name: "Tasacion",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: function () {
            return import(
                /* webpackChunkName: "about" */ "./components/Tasacion.vue"
                );
        },
    },
];
const router = new VueRouter({
    mode: "hash", // USING CORDOVA
    // mode: "history",
    base: process.env.BASE_URL,
    routes,
});

export default router;
