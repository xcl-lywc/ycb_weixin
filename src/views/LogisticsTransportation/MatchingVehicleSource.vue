<!-- 
	匹配车源
 -->
<template>
  <div class="carSource"> 
		<!-- 导航栏 -->
		<van-nav-bar title="匹配车源" fixed left-arrow @click-left="$router.go(-1)"></van-nav-bar> 
		<!-- 车源信息列表 -->
		<van-pull-refresh v-if="dataList" v-model="isLoading" @refresh="onRefresh" class="mart45">
			<div class="car-content">
				<ul 
					class="car-list car-list-bt5" 
					v-for="item in dataList"  
					@click=" showOperationSelect = true ">
					<li>
						<p class="fl">{{item.created_at}}</p>
						<p class="fr">
							<span class="car-fcg">心意运价：</span>
							<span class="car-fcy">{{item.freight+'元/吨'}}</span>
						</p> 
						<p class="fr marr10">
							<van-tag 
								type="danger" v-if="item.status_desc == 5">{{item.status_desc}}</van-tag>
						</p>
					</li>
					<li class="car-fw9 car-fs14">{{item.cargo_city + ' - ' + item.consignee_city}}</li>
					<li class="car-fcg">
						{{item.last_address}}  
					</li>
				</ul>
				<p v-if="dataList.length" @click="loadMore" class="align-center mart10">{{listPrompt}}</p>
			</div>
			<div v-if="!dataList.length && !isLoadingAll" class="no_resource">
				<img src="../../assets/images/no_resource.jpg" alt="">
				<p class="tips">暂 无 数 据</p>
			</div> 
		</van-pull-refresh> 
		<div v-show="isLoadingAll" class="fullScreen-loding"><van-loading type="spinner"/></div>
  </div>
</template>

<script>
	export default { 
		data(){
			return{
				isLoadingAll: false,   //是否处于加载状态
				isFirstVisit: true, // true为第一次访问，需要添加一个等待效果，false则不需要
				dataList: [],//车源信息列表
				listPrompt: 				 '点击或者上拉加载更多', //提示
				isLoading: false,   
				searchParams: {
					id: this.$route.params.id,
					user_type: JSON.parse(this.getCookie('userData')).type,
					page:     this.commonJs.pagination.pageDefault, 		//页码
					pre_page: this.commonJs.pagination.prePageDefault, //每页条数
				},
			};
		},
		mounted() { 
			this.getQueryList();
		},
		created(){
			window.addEventListener('scroll', this.handleScroll);
		},
		watch:{ 
		},
		methods: { 
			handleScroll(ev){
				// ------------ 滚动到最底部 ，加载更多
				if(this.commonJs.getScrollTop() + this.commonJs.getWindowHeight() == this.commonJs.getScrollHeight())
					this.loadMore();
			},
			/*
			 * 加载更多
			 */
			loadMore(){  
				this.searchParams.page++;
				this.getQueryList();
			},
			getQueryList(){ 
				if(this.isFirstVisit) {this.isLoadingAll = true; this.isFirstVisit = false;}

				if(this.dataList.length) this.listPrompt = '正在加载更多的数据...';

	    	this.axios.get(`${this.commonJs.basePath}/v1/order/notify-vehicle-owner/list`, 
	    		{params: this.searchParams})
	    	.then( (response) => {
	  			this.dataList = this.dataList.concat(response.data.data.data);
	  			this.listPrompt = '点击或者上拉加载更多';
	  			// ----- 列表原来有数据，但再次查询出来的没有数据，执行以下语句
	  			if(this.dataList.length && !response.data.data.data.length) this.listPrompt = '没有更多啦';
	  			this.dateModelData = response.data.data.status_options;
	  			// ----- 先将暂无数据显示出来
	  			this.isResourceShow = true;
	  			this.isLoadingAll = false;
	  		}).catch( (error) => {
	  			this.$toast(error)
	  			this.isLoadingAll = false;
	  		});
	     }, 
			/*
			 * 下拉刷新重新加载数据
			 */
			onRefresh() {
				setTimeout(() => {
					this.searchParams.page = 1;
					this._dataClear();
					this.isLoading = false;
				}, 500);
			},
			/*
			 * 清空数据
			 */
			_dataClear(){ 
				this.listPrompt = '点击或者上拉加载更多';
				this.dataList = [];
				this.getQueryList();
			},
		
		},
	};
</script>

<style scoped>
	/* 车源信息列表style */
	.car-content{
		/* background-color: #f7f7f7; */
		padding-bottom: 60px;
		font-size: 12px;
	}
	.car-content .car-list{
		width: 98%;
		margin: 5px auto 0;
		overflow: hidden;
		padding: 10px;
		box-sizing: border-box;
		color: #222;
		background-color: #fff;
		border-radius: 4px;
	}
	.car-content .car-list-bt5{
		border-top: 5px solid #f7f7f7;
	}
	.car-content .car-list li{
		width: 100%;
		overflow: hidden;
		text-align: left;
		margin-bottom: 4px;
	}
	.car-content .car-list .car-fw9{
		font-weight: 900;
	}
	.car-content .car-list .car-fcg{
		color: #636161;
	}
	.car-content .car-list .car-fcy{
		color: #fc9000;
	}
	.car-content .car-list .car-fs14{
		font-size: 14px;
	}
	.car-content .car-list .car-marl10{
		margin-left: 10px;
	}
</style>
