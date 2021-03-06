import Vue from "vue"
import VueRouter from "vue-router"
import routes from "./router/router"
import store from "./store/"
import App from "./App.vue"
import { routerMode } from "./config/env"
import "./config/rem"
import FastClick from "fastclick"

if ("addEventListener" in window) {
    document.addEventListener("DOMContentLoaded", function () {
        FastClick.attach(document.body)
    }, false)
}

Vue.use(VueRouter)

const router = new VueRouter({
    routes,
    mode: routerMode,
    strict: process.env.NODE_ENV !== "production",
    scrollBehavior (to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            if (from.meta.keepAlive) {
                from.meta.savedPosition = document.body.scrollTop
            }
            return {x: 0, y: to.meta.savedPosition || 0}
        }
    }
})

new Vue({
    el: "#app",
    router,
    store,
    components: { App },
    template: "<App />"

})