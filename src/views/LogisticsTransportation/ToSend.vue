<!-- 
	物流运输---已到达
 -->
<template>
  <div class="pendingOrder">
		<!-- 导航栏 -->
		<van-nav-bar
			title="我的到达"
			left-text=""
			left-arrow
			@click-left="onClickLeft"
			fixed
		/>
		<!-- 选择分类 -->
		<van-tabbar style="top: 45px;">
			<van-tabbar-item icon="" @click="showDateMenu = true">{{dateModelActiveName}}<span class="select-arrow"></span></van-tabbar-item>
			<van-tabbar-item icon="" @click="showCarMenu = true">{{carModelActiveName}}<span class="select-arrow"></span></van-tabbar-item>
		</van-tabbar>
		<!-- 列表 -->
		<van-pull-refresh v-model="isLoading" @refresh="onRefresh" class="mart96"> 
			<div class="car-content">
				<ul class="car-list car-list-bt5" v-for="item in dataList">
					<li>
						<p class="fl">{{item.created_at}}</p>
						<p class="fr">
							<span class="car-fcg">运价：</span>
							<span class="car-fcy">{{item.freight+'元/吨'}}</span>
						</p>
						<p class="fr marr10 type">{{item.type == 1 ? '整车' : '拼车'}}</p>
					</li>
					<li class="car-fw9 car-fs14">{{item.cargo_city + ' - ' + item.consignee_city}}</li>
					<li class="car-fcg">
						{{item.desc}} 
						<span 
							class="fr"
							v-if="item.created_at.split(' ')[0] > commonJs._convertDate(new Date(), 'yyyy年MM月dd日')">
							<van-button type="default" size="small">邀约司机</van-button>
						</span>
					</li>
				</ul>
				<p v-if="dataList.length" @click="loadMore" class="align-center mart10">{{listPrompt}}</p>
			</div>
			<div v-if="!dataList.length && !isLoadingAll" class="no_resource">
				<img src="../../assets/images/no_resource.jpg" alt="">
				<p class="tips">暂 无 数 据</p>
			</div>
		</van-pull-refresh>
		<!-- 货车类型的底部弹出层 -->
		<van-popup v-model="showCarMenu" position="bottom">
			<van-picker
				show-toolbar 
				value-key="desc"
				:columns="carModelData"
				@cancel="showCarMenu = false"
				@confirm="onConfirmCar"
				@change=""
			/>
		</van-popup>
		<!-- 日期类型的底部弹出层 -->
		<van-popup v-model="showDateMenu" position="bottom">
			<van-picker
				show-toolbar 
				value-key="desc"
				:columns="dateModelData"
				@cancel="showDateMenu = false"
				@confirm="onConfirmDate"
				@change=""
			/>
		</van-popup>
		<div v-show="isLoadingAll" class="fullScreen-loding"><van-loading type="spinner"/></div>
  </div>
</template>

<script>
	export default {
		data(){
			return{
				isFirstVisit: true, // true为第一次访问，需要添加一个等待效果，false则不需要
        isLoadingAll: false,
				isLoading:  				 false,
				showCarMenu: 				 false,
				showDateMenu: 			 false,
				carModelActiveName:  '全部', //货车类型被选中的名称
				dateModelActiveName: '最近三个月订单', //日期类型被选中的名称
				carModelData: [],
				dateModelData:[],
				dataList: 					 [],  //列表数据
				listPrompt: 				 '点击或者上拉加载更多', //提示
				searchParams: {
					time_option: 'last_three_month', //时间选择 传time_options 里面的name字段 默认为最近3个月
					type: '1,2',				//1整车, 2拼车
					with_consignee: 2,  // 0 我发的，我收的， 1我发的/我送的， 2 我收的
					page:     this.commonJs.pagination.pageDefault, 		//页码
					pre_page: this.commonJs.pagination.prePageDefault,  //每页条数
				},
			};
		},
		created(){
			window.addEventListener('scroll', this.handleScroll);
		},
		methods:{
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

	    	this.axios.get(`${this.commonJs.basePath}/v1/order/comfirmed-list`, {params: this.searchParams}).then( (response) => {
	  			this.dataList = this.dataList.concat(response.data.data.data.data);

	  			this.listPrompt = '点击或者上拉加载更多';
	  			// ----- 列表原来有数据，但再次查询出来的没有数据，执行以下语句
	  			if(this.dataList.length && !response.data.data.data.data.length) this.listPrompt = '没有更多啦';
	  			
	  			this.dateModelData = response.data.data.time_options;
	  			this.carModelData = response.data.data.type_options;
	  			this.isLoadingAll = false;
	  		}).catch( (error) => {
	  			this.$toast(error)
	  			this.isLoadingAll = false;
	  		});
	     }, 
			/* 
			下拉刷新
			*/
			onRefresh() {
				setTimeout(() => {
					this._dataReset();
					this.isLoading = false;
				}, 500);
			},
			/*
			 * 清空数据
			 */
			_dataReset(){
				this.searchParams.page = 1;
				this.listPrompt = '点击或者上拉加载更多';
				this.dataList = [];
				this.getQueryList();
			},
			/* 
			 返回个人中心
			 */
			onClickLeft(){
				// this.$router.back(-1);
				this.$router.push({path: '/my'});
			},
			/* 
				选择并确认货车类型
			*/
			onConfirmCar(item,index){
				this.searchParams.type = item.name;
				this.carModelActiveName = item.desc;
				this.showCarMenu = false;
				this.isFirstVisit = true;
				this._dataReset();
			},
			/* 
				选择并确认日期类型
			*/
			onConfirmDate(item,index){
				this.searchParams.time_option = item.name;
				this.dateModelActiveName = item.desc;
				this.showDateMenu = false;
				this.isFirstVisit = true;
				this._dataReset(); 
			},
		},
		mounted(){
			this.getQueryList();
		},
	};
</script>

<style>

</style>
