import home from "../page/home/home.vue"
import city from "../page/city/city.vue"
import msite from "../page/msite/msite.vue"


export default [
    {
        path: "/home",
        name: "home",
        component: home
    },
    {
        path: "/city/:id",
        name: "city",
        component: city
    },
    {
        path: "/msite",
        name: "msite",
        component: msite
    },
    {
        path: "/",
        redirect: "/home"
    }
]