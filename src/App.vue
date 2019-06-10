<template>
    <div class="root-element">
        <transition name="router-fade" mode="out-in">
            <keep-alive>
                <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
        </transition>

         <transition name="router-fade" mode="out-in">
            <router-view v-if="!$route.meta.keepAlive"></router-view>
        </transition>
    </div>
</template>

<script>
export default {
    name: "App"
}
</script>

<style lang="scss">
@import './style/common.scss';

.root-element {
    padding-top: 1.95rem;
}

.router-fade-enter,
.router-fade-leave-to {
    opacity: 0;
}

.router-fade-enter-active,
.router-fade-leave-active {
    transition: opacity .3s;
}
</style>
