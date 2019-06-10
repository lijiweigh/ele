<template>
    <div class="home">
        <head-top signin-up="home">
            <template #logo>
                <span class="head_logo" @click="reload">ele.me</span>
            </template>
        </head-top>

        <div class="city_now">
            <div class="location_now">
                <span>当前定位城市：</span>
                <span class="now_bold">定位不准时，请在城市列表中选择</span>
            </div>
            <div class="location_city" @click="goToCity(guessCityid)">
                <span>{{ guessCity }}</span>
                <!-- <span>北京</span> -->
                <svg class="arrow_right">
                     <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                </svg>
            </div>
        </div>

        <section class="hotCity">
            <h4 class="hotTitle">热门城市</h4>
            <ul class="hotList">
                <li class="hotItem" v-for="(item, index) in hotcity" :key="index" @click="goToCity(item.id)">{{item.name}}</li>
            </ul>
        </section>

        <section class="allCity">
            <ul class="allCityItem" >
                <li v-for="(item, key, index) in sortgroupcity" :key="index">
                    <h4 class="hotTitle">{{key}}</h4>
                    <ul class="hotList">
                        <li class="hotItem" v-for="(value, index2) in item" :key="index2" @click="goToCity(value.id)">{{value.name}}</li>
                    </ul>
                </li>
            </ul>
        </section>
    </div>
</template>

<script>

import headTop from "components/header/head"
import {cityGuess, hotcity, groupcity} from '../../service/getData'

export default {
    name: "home",
    data () {
        return {
            guessCity: '',   //当前城市
            guessCityid: '', //当前城市id
            hotcity: [],     //热门城市列表
            groupcity: {},   //所有城市列表
        }
    },
    computed: {
        
        sortgroupcity(){
            let sortobj = {};
            for (let i = 65; i <= 90; i++) {
                if (this.groupcity[String.fromCharCode(i)]) {
                    sortobj[String.fromCharCode(i)] = this.groupcity[String.fromCharCode(i)];
                }
            }
            return sortobj
        }
        
    },
    components: {
        headTop
    },
    mounted () {
         // 获取当前城市
        cityGuess().then(res => {
            this.guessCity = res.name;
            this.guessCityid = res.id;
        })

        //获取热门城市
        hotcity().then(res => {
            this.hotcity = res;
        })

        //获取所有城市
        groupcity().then(res => {
            this.groupcity = res;
        })
    },
    methods: {
        reload () {
            window.location.reload()
        },
        goToCity (id) {
            this.$router.push({path: "/city/" + id})
        }
    }
   
}
</script>

<style lang="scss" scoped>
@import '../../style/mixin';
.head_logo{
    left: 0.4rem;
    font-weight: 400;
    line-height: 0.8rem;
    @include sc(0.7rem, #fff);
    @include wh(2.3rem, 0.8rem);
    @include ct;
}

.home {
    // padding-top: 1.95rem;
}

.city_now {
    font-size: .55rem;
    padding: 0 10px;
    background: #fff;
    margin-bottom: .4rem;
   
    .location_now, .location_city {
        display: flex;
        justify-content: space-between;
        padding: 0 0 .45rem;
    }

    .location_now {
        height: 1.45rem;
        line-height: 1.45rem;
        @include border_bot
    }

    .location_city {
        height: 1.8rem;
        line-height: 1.8rem;
        font-size: .75rem;
        span {
            color: #3190e8;
        }
        .arrow_right {
            width: .6rem;
            height: .6rem;
            fill: #999;
        }
    }
}

section {
    margin-bottom: .4rem;
    background: #fff;
}

.hotTitle {
    @include border_bot;
}

.hotList {
    font-size: 0;
    li {
        display: inline-block;
        padding: 0 1px;
        font-size: .6rem;
        height: 1.5rem;
        line-height: 1.5rem;
        width: 23%;
        margin: 1%;
        // @include border_bot;
        // @include border_rit;
        @include border_all;
        box-sizing: border-box;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        // border-right: .3333px solid #ccc;
        // border-bottom: .3333px solid #ccc;

        // &:nth-of-type(4n) {
        //     &::before {
        //         border-right: none;
        //     }
        // }
    }
}
</style>
