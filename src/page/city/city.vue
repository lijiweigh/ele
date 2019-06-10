<template>
    <div class="city">
        <head-top goback="true" :head-title="cityname">
            <template #changecity>
                <span class="change-city" @click="changeCity">切换城市</span>
            </template>
        </head-top>

        <form class="search" @submit.prevent>
            <input type="text" class="search-input" v-model="searchValue" placeholder="输入地址" @input="submitSearch">
            <input type="submit" class="search-button" value="提交" />
        </form>

        <div class="separator" v-show="showSearchBar">搜索历史</div>

        <section class="history">
            <div class="item" @click="choosePlace(index, item.geohash)" v-for="(item, index) in placelist" :key="index">
                <div class="place-name">{{item.name}}</div>
                <div class="place-pos">{{item.address}}</div>
            </div>
            <div class="clear" @click="clear" v-show="showClear">清空所有</div>
            <div class="clear" v-show="noResult">抱歉没有搜索结果</div>
        </section>
    </div>
</template>

<script>
import headTop from "components/header/head"
import {currentcity, searchplace} from 'src/service/getData'
import {getStore, setStore, removeStore} from 'src/config/mUtils'

export default {
    name: "city",
    data () {
        return {
            cityname: "母鸡啊",
            searchValue: "",
            showResult: false,
            placelist: [],
            showClear: false,
            cityID: "",
            showSearchBar: true,
            noResult: false
        }
    },
    mounted () {
        this.cityID = this.$route.params.id
        currentcity(this.cityID).then(res => {
            this.cityname = res.name
        })

        this.init()
    },
    methods: {
        init () {
            if (getStore("placeHistory")) {
                this.placelist = JSON.parse(getStore("placeHistory"))
                this.showClear = true
            } else {
                this.placelist = []
                this.showClear = false
            }
        },
        changeCity () {
            this.$router.push({name: "home"})
        },
        submitSearch () {
            if (this.searchValue) {
                searchplace(this.cityID, this.searchValue).then(res => {
                    this.showClear = false
                    this.showSearchBar = false
                    this.placelist = res
                    if (this.placelist.length < 1) {
                        this.noResult = true
                    } else {
                        this.noResult = false
                    }
                })
            }
        },
        clear () {
            removeStore ("placeHistory")
            this.init()
        }, 
        choosePlace (index, geohash) {
            let history = getStore("placeHistory")
            let choosen = this.placelist[index]
            if (history && history.length) {
                history = JSON.parse(history)
                let checked = false
                history.forEach(element => {
                    if (element.geohash == geohash) {
                        checked = true
                    }
                });
                if (!checked) {
                    history.push(choosen)
                    setStore("placeHistory", history)
                }
            }else {
                setStore("placeHistory",[choosen])
            }

            this.$router.push({path: "/msite", query: {geohash}})
        }
    },
    components: {
        headTop
    }
}
</script>

<style lang="scss" scoped>
@import "../../style/mixin.scss";

.change-city {
    position: absolute;
    right: .4rem;
    top: 50%;
    transform: translateY(-50%);
    font: {
        size: .6rem;
    }
    color: #fff;
}

.search {
    background: #fff;
    padding: .4rem 0;
    margin-top: .5rem;
    @include border_bot;
    .search-input {
        display: block;
        width: 80%;
        line-height: 1.4rem;
        margin: 0 auto 0;
        border: 1px solid #ccc;
        border-radius: .2rem;
        padding: 0 .3rem;
    }
    .search-button {
        display: block;
        width: 80%;
        line-height: 1.4rem;
        margin: .3rem auto 0;
        background: #3190e8;
        color: #fff;
        border-radius: .2rem;
    }
}

.separator {
    line-height: 1rem;
    font-size: .5rem;
    padding-left: .5rem;
}

.history {
    background: #fff;
    .item {
        @include border_bot;
        padding: .5rem;
        .place-name {
            font-size: .65rem;
            margin-bottom: .3rem;
        }

        .place-pos {
            font-size: .45rem;
        }
    }
}
.clear {
    font-size: .65rem;
    line-height: 1.5rem;
    text-align: center;
}
</style>
