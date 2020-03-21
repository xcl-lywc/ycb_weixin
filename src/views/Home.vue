<template>
  <div  class="home" :class="{'hidden': isShowSearch}">
		<!-- 城市搜索 -->
  	<!-- <div class="header-home">
  		<img @click=" $router.push({path: '/alphabetic_search'}) " src="../../assets/images/icon_home_logo.png"/>
  		<span @click=" $router.push({path: '/alphabetic_search'}) " >{{area_name}}</span> 
  	</div> -->  
		<div v-if="dataJson">
			<div class="header-home">
				<img @click=" isShowSearch = true " src="../assets/images/icon_home_logo.png"/>
				<span @click=" isShowSearch = true " >{{area_name}}</span> 
			</div>
	    <div class="container-box home-container">
				<!-- 刷新 -->
	    	<van-pull-refresh v-model="isLoading" @refresh="onRefresh" v-if="userData">
					<!-- 轮播图 -->
					<van-swipe :autoplay="3000">
						<van-swipe-item v-for="(item, index) in dataJson.banner" :key="index">
							<a :href="item.href"><img class="switchImage" :src="item.image" /></a>
						</van-swipe-item>
					</van-swipe>
					<!--（车主）交易行情 -->
					<div class="list-box" v-if="userData.type===1">
						<p class="more">
							<span>交易行情</span>
							<span class="button" @click="$router.push({path: '/home/trade_quotation'})">更多信息<van-icon name="arrow" /></span>
						</p>
						<div class="box-inner" v-for="(item, index) in dataJson.order.data" :key="index" @click="$router.push({path: '/home/trade_quotation'})">
							<p class="title">
								<span>{{item.order_time.split(' ')[0]}}&nbsp;&nbsp;&nbsp;<b>{{item.consignee_area}}</b></span> 
								<span class="unit-price fr">{{item.freight}}元/{{item.freight_unit}}</span>
							</p>
							<p class="dsc">{{item.desc}}</p>
						</div> 
					</div>
					<!--（车主）货源详情 -->
					<div class="list-box" v-if="userData.type===1">
						<p class="more">
							<span>货源详情</span>
							<span class="button" @click="$router.push({path: '/source_information'})">更多信息<van-icon name="arrow" /></span>
						</p>
						<div class="box-inner" v-for="(item, index) in dataJson.order_source.data" :key="index" @click="$router.push({path: '/source_information'})">
							<p class="title">
								<span>{{item.order_time}}</span> 
								<span class="unit-price fr"><i>心意运价</i>：{{item.freight}}元/{{item.freight_unit}}</span>
							</p>
							<p class="title"><b>{{item.consignee_area}}</b></p>
							<p class="dsc">{{item.desc}}</p>
						</div> 
					</div>
					<!--（货主）交易行情 -->
					<div class="list-box" v-if="userData.type===2">
						<p class="more">
							<span>交易行情</span>
							<span class="button" @click="$router.push({path: '/home/trade_quotation'})">更多信息<van-icon name="arrow" /></span>
						</p>
						<div class="box-inner"  v-for="(item, index) in dataJson.order.data" :key="index" @click="$router.push({path: '/home/trade_quotation'})">
							<p class="title">
								<span class="fl date">{{item.created_at.split(' ')[0]}}</span> 
								<span class="fl address">{{item.cargo_city + ' - ' + item.consignee_city}}</span>
								<span class="fl type">整车</span>
							  <span class="unit-price fr">{{item.freight+'元/吨'}}</span>
							</p>
						  <p class="dsc">{{item.desc}}</p>
						</div>
					</div>
					<!--（货主）车源信息 -->
					<div class="list-box" v-if="userData.type===2">
						<p class="more">
							<span>车源信息</span>
							<span class="button" @click="$router.push({path: '/car_source'})">更多信息<van-icon name="arrow" /></span>
						</p>
						<div class="box-inner" v-for="(item, index) in dataJson.vehicle_route.data" :key="index" @click="$router.push({path: '/car_source'})">
							<p class="title">
								<span class="date">{{item.created_at}}</span> 
							  <span class="unit-price fr"><i>心意运价</i>{{'：'+item.freight+'元/吨'}}</span>
							</p>
							<p class="title"><b>{{item.cargo_city + ' - ' + item.consignee_city}}</b></p>
						  <p class="dsc">{{item.desc}}</p>
						</div>
					</div>
				</van-pull-refresh>
	    </div>
	    <!-- 城市选择 -->
			<van-popup class="alphabetic-search" v-model="isShowSearch" position="bottom" :overlay="false">
				<div class="alphabetic-search-box">
					<p class="back"><van-icon @click=" isShowSearch = false " name="arrow-left"/> <span>城市选择</span></p>
	    		<alphabetic-search class="search-box" @codeName="codeNameFun"></alphabetic-search>
				</div>
	    </van-popup>
		</div>
    <div v-show="isLoading" class="fullScreen-loding"><van-loading type="spinner"/></div>
  </div>
</template>

<script>
import AlphabeticSearch from "../components/AlphabeticSearch.vue";
export default {
	components:{
		'alphabetic-search': AlphabeticSearch,
	},
	data(){
		return {
			isLoading: false,
			userData: this.getCookie('userData') ? JSON.parse(this.getCookie('userData')) : null,
			isLoading: false, // 下拉刷新状态
			isShowSearch: false, //true为显示地址栏 
      dataJson: null, //页面所有数据
			area_code: null,//定位的code值 
			area_name:'成都市',//定位的名字、地址
		}
	},
	mounted(){  
		// 当没有用户信息的情况下就不重查用户信息 
		!this.$store.state.userData ? this.getUserInfo() : this.getQueryIndexData(); 
		// console.log(this.userData)
	},
	methods: { 
		getUserInfo(){
			this.isLoading = true;
      this.axios.post(`${this.commonJs.basePath}/v1/users/info`, '').then( (response) => {
        this.userData = response.data.data;
        this.setCookie('userData',JSON.stringify(response.data.data));
       
        if(!this.$store.state.userData) this.$store.state.userData = response.data.data;
       	
        // -------  获取车主自己的车辆信息
        this.configMesg();
        
      }).catch( (error) => {
        this.$toast(error);
        this.isLoading = false;
      });
    },
    
    /*
     * 通用的一些数据
     */
    configMesg(){
      this.axios.get(`${this.commonJs.basePath}/v1/config`,'').then((response) => {
        sessionStorage.setItem('configMesg', JSON.stringify(response.data.data));
        if(this.$store.state.userData.type == 1){
        	this.getCarDetail()
        }else{
        	this.isLoading = false;
        	this.getQueryIndexData(); 
        }  
      }).catch((error) => {
        this.$toast(error);
        this.isLoading = false;
      })
    },
    /*
     * 获取车主的车辆信息
     */
    getCarDetail(){
      this.axios.get(`${this.commonJs.basePath}/v1/vehicle/get`, '').then((response) => {
        sessionStorage.setItem('carDetail', JSON.stringify(response.data.data));
        this.getQueryIndexData();

      }).catch((error) => {
        this.$toast(error);
        this.isLoading = false
      })
    },
		/* 
		 刷新
		 */
    onRefresh() {
      setTimeout(() => {
				this.getQueryIndexData();
        this.isLoading = false;
      }, 500);
    },
		
		/* 
		 获取首页数据
		 */
    getQueryIndexData(){
    	if(this.$store.state.userData) this.isLoading = true;
    	this.axios.get(`${this.commonJs.basePath}/v1/index`, this.paramsData()).then( (response) => {
  			this.dataJson = response.data.data;
  			this.$nextTick(() => {
  				this.isLoading = false;
  			})
  		}).catch( (error) => {
  			this.$toast(error)
  			this.isLoading = false;
  		});
    },
    paramsData(){
    	return {
    		params: {
    			area_code: this.area_code,
    		}
    	}
    },
		/* 
		 接收子组件向父组件所传的值
		 */
		codeNameFun(code,name){
			this.isShowSearch = false;
			
			//重新定位后，刷新首页数据
			this.area_code = code;
			this.area_name = name;
			this.getQueryIndexData();
		}
  }
};
</script> 
<style lang="less" scoped>
	.header-home{
		position: fixed;
		top:0;
		left: 0;
		width: 100vw;
		z-index: 1;
		display: flex;
    align-items: center;
    justify-content: center;
		color: #2c95e3;
		height: 50px;
		background-color: #fff;
		img{
			width: 30px;
		}
		span{
			position: relative;
			margin-left: 10px;
		}
		span:before{
			position: absolute;
			right: -10px;
			top: 8px;
			content: "";
			border: 4px solid #2c95e3;
			display: block;
			border-color: #2c95e3 transparent transparent transparent;
		}
	}
	.hidden{
		overflow: hidden;
    height: 100vh;
	}
	.home{
		position: relative;
		.alphabetic-search{
			 
		} 
		.search-box{
			margin-top: 40px;
		}
		.van-popup--bottom{
			height: 100vh;
			overflow: hidden;
			position: absolute;
		}
		.alphabetic-search-box{
      overflow-y: scroll;
      height: -webkit-fill-available;
    } 
	}
	.home-container 
	.switchImage{
    width: 100%;
    height: 100%;
	}
	.more{
		display: flex;
		width: 100%;
		color: #333;
		font-size: 14px;
		line-height: 35px;
		span{
			text-align: left;
			width: 50%;
			color: #707070;
	    font-weight: 600;	
		}
		.button{
			text-align: right;
			color: #a4a4a4;
			font-size: 13px;
		}
	}
	.list-box{
		.box-inner{
			margin-bottom: 5px;
			background-color: #fff;
			padding: 8px;
			color: #787878;
			.title{
				overflow: hidden;
				margin-bottom: 10px;
				.date{
					font-weight: normal;
					margin-right: 8px;
				}
				.address{
					margin-right: 8px;
				}
				.type{
					background: #2C95E3;
					color: #FFFFFF;
					font-size: 12px;
					height: 20px;
					line-height: 20px;
					width: 40px;
					border-radius: 4px;
					text-align: center;
				}
				.unit-price{ 
					color: #fc9000;
					font-size: 12px;
					i{
						color: #787878;
						font-style: inherit;
					}
				}
			}
			.dsc{
				font-size: 12px;
			}
		}
	}
	.hide{
		display: none;
	}
	
</style>