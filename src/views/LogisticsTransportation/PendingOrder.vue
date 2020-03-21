<!-- 
	物流运输---待接单
 -->
<template>
  <div class="pendingOrder">  
		<!-- 导航栏 -->
		<van-nav-bar
			title="待接单"
			left-text=""
			left-arrow
			@click-left="onClickLeft"
			fixed
		/>
		<!-- 选择分类 -->
		<van-tabbar style="top: 45px;">
			<van-tabbar-item icon="" @click="showCarMenu = true">{{carModelActiveName}}<span class="select-arrow"></span></van-tabbar-item>
			<van-tabbar-item icon="" @click="showDateMenu = true">{{dateModelActiveName}}<span class="select-arrow"></span></van-tabbar-item>
		</van-tabbar>
		<!-- 列表 -->
		<van-pull-refresh v-model="isLoading" @refresh="onRefresh" class="mart96"> 
			<div class="car-content">
				<ul 
					class="car-list car-list-bt5" 
					v-for="item in dataList">
					<li @click="  activeOrder = item ; showOperationSelect = true; ">
						<p class="fl">{{item.created_at}}</p>
						<p class="fr">
							<span class="car-fcg">运价：</span>
							<span class="car-fcy">{{item.freight+'元/吨'}}</span>
						</p>
						<p class="fr marr10 type">{{item.type == 1 ? '整车' : '拼车'}}</p>
						<p class="fr marr10">
							<van-tag 
								type="danger" v-if="item.status == 5">{{item.status_desc}}</van-tag>
						</p>
					</li>
					<li 
						@click=" showOperationSelect = true; activeOrder = item " 
						class="car-fw9 car-fs14">{{item.cargo_city + ' - ' + item.consignee_city}}</li>
					<li class="car-fcg">
						<span @click=" showOperationSelect = true; activeOrder = item ">{{item.desc}}</span> 
						<span 
							class="fr"
							v-if="item.status_desc != 5">
							<van-button type="default" size="small" @click="notifyVehicleOwner(item)">邀约司机</van-button>
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
		<van-popup v-model="showOperationSelect" :overlay="true" v-if="activeOrder">
			<div class="operation-select" v-if="activeOrder.status != 5">
				<ul >
					<li  
						@click="operationSelectClick(item)" 
						v-for="(item,index) in operationSelect1" 
						:key="index">
							{{item.desc}}
					</li> 
				</ul>
			</div> 
			<div class="operation-select" v-else>
				<ul> 
					<li 
						
						@click="operationSelectClick(item)" 
						v-for="(item,index) in operationSelect2" 
						:key="index">
							{{item.desc}}
					</li>
				</ul>
			</div> 
		</van-popup>
		<div v-show="isLoadingAll" class="fullScreen-loding"><van-loading type="spinner"/></div>
  </div>
</template>

<script>
	import MatchingVehicleSource from "./MatchingVehicleSource.vue";
	import EditOrder from "./EditOrder.vue";
	export default {
		components:{
			'matching-vehicl-source': MatchingVehicleSource,
			'edit-order': EditOrder,
		},
		data(){
			return{ 
				activeOrder:  null, //被选中的订单数据
				activeOrderId: null,// 单独申明一个Id因为用的子组件的方式，要是现实弹框后此赋值，避免提前赋值，数据提前条用，但是不显示数据
				isFirstVisit: true, // true为第一次访问，需要添加一个等待效果，false则不需要
        isLoadingAll: false,
				isResourceShow: 		 false,
				isLoading:  				 false,
				showCarMenu: 				 false,
				showDateMenu: 			 false,
				showOperationSelect: false,
				carModelActiveName:  '全部', //货车类型被选中的名称
				dateModelActiveName: '全部', //日期类型被选中的名称
				carModelData: 			 [{name: '1,2', desc: '全部'}, {name: '1',desc: '整车'}, {name: '2', desc: '拼车'}],
				operationSelect1:    [{name: '1', desc: '匹配车源'}, {name: '2', desc: '编辑货源'}, {name: '3', desc: '删除货源'}],
				operationSelect2:    [{name: '2', desc: '再次发布'}, {name: '3', desc: '删除货源'}],
				dateModelData: 			 [],
				dataList:        		 [],
				listPrompt: 				 '点击或者上拉加载更多', //提示
				searchParams: {
					type: 0, //1整车, 2拼车 0全部 
					status: '1,5',// 状态: 1 ; 等待中 2 ; 抢单成功, 等待支付 3; 运输中 4; 收货完成 5; 已过期 6; 货主已取消 7; 已经支付，等待货主装货 8; 已经支付，货主已经装货, 等待车主发货
					page:     this.commonJs.pagination.pageDefault, 		//页码
					pre_page: this.commonJs.pagination.prePageDefault, //每页条数
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

	    	this.axios.get(`${this.commonJs.basePath}/v1/users/order/list`, {params: this.searchParams}).then( (response) => {
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
				this.searchParams.status = item.name;
				this.dateModelActiveName = item.desc;
				this.showDateMenu = false;
				this.isFirstVisit = true;
				this._dataReset(); 
			},
			/*
			 * 根据期限状态判断显示那些数据
			 */
			statusPptionsFun(item){  
				let bool = false; 
				if(this.searchParams.status == 5){ //显示有效数据;
					bool = true;
				}else if(this.searchParams.status_options == 5){ //显示过期数据
					bool = true;
				}else{ //显示全部
					bool = true;
				}
				// 有数据就将暂无数据给隐藏
				if(bool){
					this.isResourceShow = false;
				}
				return bool;
			},
			/*
			 * 邀约司机
			 */
			notifyVehicleOwner(item){
				this.axios.post(`${this.commonJs.basePath}/v1/order/notify-vehicle-owner`, {id: item.id}).then( (response) => {
	  			 this.$toast('邀约成功') 
	  		}).catch( (error) => {
	  			this.$toast(error) 
	  		});
			},
			/*
			 * 选择操作类型
			 */
			operationSelectClick(item){  
				switch(item.name){
					case '1':
						this.$router.push({'name': 'matchingVehicleSource', params: {id: this.activeOrder.id}}); 
						this.showOperationSelect = false;
						break;
					case '2':
						this.$router.push({'name': 'editOrder', params: {id: this.activeOrder.id}}); 
						this.showOperationSelect = false;
						break;
					case '3':
						this.deleteOrder();
						break;
				}
			}, 
			/*
			 * 根据Id删除订单
			 */
			deleteOrder(){
				this.axios.post(`${this.commonJs.basePath}/v1/order/delete`, {id: this.activeOrder.id}).then( (response) => {
	  			this.$toast('删除成功');
	  			this.showOperationSelect = false;
	  			this.getQueryList();
	  		}).catch( (error) => {
	  			this.$toast(error) 
	  			this.showOperationSelect = false;
	  		});
			}
		},
		mounted(){
			this.getQueryList();
		},
	};
</script>

<style lang="less">
	.operation-select{
		li{
			padding: 0 50px;
			line-height: 40px;
			border-bottom: 1px solid #cccccc;
		}
	}
</style>
