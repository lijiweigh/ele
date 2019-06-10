<template>
    <div class="msite">
        <head-top signin-up="msite">
            <template #search is="span">
                <span class="top_search" @click="goSearch">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1">
                        <circle cx="8" cy="8" r="7" stroke="rgb(255,255,255)" stroke-width="1" fill="none"/>
                        <line x1="14" y1="14" x2="20" y2="20" style="stroke:rgb(255,255,255);stroke-width:2"/>
                    </svg>
                </span>
            </template>

            <template #msite-title>
                <span class="top_title" @click="goHome">{{ msiteTitle }}</span>
            </template>
        </head-top>

        <div class="swiper-container nav">
            <!-- Additional required wrapper -->
            <div class="swiper-wrapper">
                <!-- Slides -->
                <div class="swiper-slide">Slide 1</div>
                <div class="swiper-slide">Slide 2</div>
                <div class="swiper-slide">Slide 3</div>
            </div>
            <!-- If we need pagination -->
            <div class="swiper-pagination"></div>
        </div>
    </div>
</template>

<script>
import headTop from "components/header/head"
import {msiteAddress, msiteFoodTypes, cityGuess} from 'src/service/getData'
import { mapMutations } from "vuex"
import Swiper from "swiper"
import  'swiper/dist/css/swiper.min.css'

export default {
    name: "msite",
    data () {
        return {
            geohash: '', // city页面传递过来的地址geohash
            msiteTitle: '请选择地址...', // msite页面头部标题
            foodTypes: [], // 食品分类列表
            hasGetData: false, //是否已经获取地理位置数据，成功之后再获取商铺列表信息
            imgBaseUrl: 'https://fuss10.elemecdn.com', //图片域名地址
        }
    },
    components: {
        headTop
    },
    async beforeMount(){
		if (!this.$route.query.geohash) {
			const address = await cityGuess();
			this.geohash = address.latitude + ',' + address.longitude;
		}else{
			this.geohash = this.$route.query.geohash
		}
		//保存geohash 到vuex
		this.SAVE_GEOHASH(this.geohash);
    	//获取位置信息
    	let res = await msiteAddress(this.geohash);
    	this.msiteTitle = res.name;
    	// 记录当前经度纬度
    	this.RECORD_ADDRESS(res);

    	this.hasGetData = true;
    },
    mounted () {
         //获取导航食品类型列表
       	msiteFoodTypes(this.geohash).then(res => {
       		let resLength = res.length;
       		let resArr = [...res]; // 返回一个新的数组
       		let foodArr = [];
    		for (let i = 0, j = 0; i < resLength; i += 8, j++) {
    			foodArr[j] = resArr.splice(0, 8);
    		}
    		this.foodTypes = foodArr;
        }).then(() => {
        	//初始化swiper
        	new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                direction: "horizontal",
		        loop: true
		    });
        })
    },
    methods: {
        goSearch () {
            this.$router.push("/search/geohash")
        },
        goHome () {
            this.$router.push("/home")
        },
        ...mapMutations([
    		'RECORD_ADDRESS', 'SAVE_GEOHASH'
    	]),
    	// 解码url地址，求去restaurant_category_id值
    	getCategoryId(url){
    		let urlData = decodeURIComponent(url.split('=')[1].replace('&target_name',''));
    		if (/restaurant_category_id/gi.test(urlData)) {
    			return JSON.parse(urlData).restaurant_category_id.id
    		}else{
    			return ''
    		}
    	}
    }
}
</script>

<style lang="scss" scoped>
.top_search {
    position: absolute;
    top: 50%;
    left: .5rem;
    transform: translateY(-50%);
    width: .9rem;
    height: .9rem;
    font-size: 0;
}

.top_title {
    width: 50%;
    font-size: .8rem;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: #fff;
}

.nav {
    height: 10.6rem;
}
</style>
