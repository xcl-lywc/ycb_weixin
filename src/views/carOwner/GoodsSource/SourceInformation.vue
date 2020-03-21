<!-- 
	货源信息
 -->

<template>
  <div class="sourceInformation">
		<!-- 导航栏 -->
		<van-nav-bar title="货源信息" fixed></van-nav-bar>
		<!-- 标签栏 -->
		<van-tabbar v-model="active" style="top: 45px;" @change="onTab">
			<van-tabbar-item icon="" @click="showAddress = true"><span class="text-ellipsis">{{cargo_area_name}}</span><span class="select-arrow"></span></van-tabbar-item>
			<van-tabbar-item icon="" @click="showAddress_ = true">{{consignee_area_name}}<span class="select-arrow"></span></van-tabbar-item>
			<van-tabbar-item icon="" @click="clickFreight">运价排序
				<span class="desc-arrow" v-bind:class="{desc_arrow_bc:index==99}"></span><!-- 降序 -->
				<span class="asc-arrow" v-bind:class="{asc_arrow_bc:index==100}"></span><!-- 升序 -->
			</van-tabbar-item>
			<van-tabbar-item icon="" @click="showCarLength = true">{{vehicle_length}}<span class="select-arrow"></span></van-tabbar-item>
		</van-tabbar>
		<!-- 货源信息列表 -->
		<van-pull-refresh v-model="isLoading" @refresh="onRefresh" class="mart90" v-if="orderList">
			<div class="car-content">
				<ul class="car-list car-list-bt5" v-for="item in orderList" @click="$router.push({name:'sourceDetails',params:{id:item.id}})">
					<li>
						<p class="fl">{{item.created_at}}</p>
						<p class="fr">
							<span class="car-fcg">心意价格：</span>
							<span class="car-fcy">{{item.freight+'元/吨'}}</span>
						</p>
					</li>
					<li class="car-fw9 car-fs14">{{item.cargo_city + ' - ' + item.consignee_city}}</li>
					<li class="car-fcg">{{item.desc}}</li>
				</ul>
				<p v-if="orderList.length" @click="loadMore" class="align-center mart10">{{listPrompt}}</p>
			</div>
			<div v-if="!orderList.length && !loading" class="no_resource">
				<img src="../../../assets/images/no_resource.jpg" alt="">
				<p class="tips">暂 无 数 据</p>
			</div> 
		</van-pull-refresh>
		<!-- 出发地与收货地的底部弹出层 -->
		<van-popup v-model="showAddress" position="bottom">
			<van-picker
				show-toolbar
				title="选择地址"
				:columns="area_list"
				@cancel="showAddress = false"
				@confirm="onConfirmAddress"
				@change="onChangeArea"
				value-key="name"
			/>
		</van-popup>
		<van-popup v-model="showAddress_" position="bottom">
			<van-picker
				show-toolbar
				title="选择地址"
				:columns="area_list"
				@cancel="showAddress_ = false"
				@confirm="onConfirmAddress_"
				@change="onChangeArea"
				value-key="name"
			/>
		</van-popup>
		<!-- 车长的的底部弹出层 -->
		<van-popup v-model="showCarLength" position="bottom" v-if='carLengthData'>
			<van-picker
				show-toolbar
				title="选择车长"
				:columns="carLengthData"
				@cancel="showCarLength = false"
				@confirm="onConfirmCar"
				@change=""
			/>
		</van-popup>
		<div v-show="loading" class="fullScreen-loding"><van-loading type="spinner"/></div>
  </div>
</template>

<script>

	export default {
		data(){
			return{
				listPrompt: 				 '点击或者上拉加载更多', //提示
				isFirstVisit: true, // true为第一次访问，需要添加一个等待效果，false则不需要
				loading: false,   //是否处于加载状态
				orderList:[],//货源信息列表
				isLoading: false,
				form:{
					cargo_area_code:'',
					consignee_area_code:'',
					vehicle_length:'',
					order_by:'publish_time',//按什么排序， 可选 publish_time,freight, 
					sort:"desc",//排序规则可选 asc, desc, asc 为升序， desc为降序
					page:     this.commonJs.pagination.pageDefault, 		//页码
					pre_page: this.commonJs.pagination.prePageDefault, //每页条数
				},
				
				showAddress:false,
				showAddress_:false,
				showCarLength:false,
				active: 0,//切换
				index:0,//升序、降序
				count:0,//计数
				area_list:[ { values:[] }, { values:[] }, { values:[] } ],//地址列表
				carLengthData:null,// 车长
				cargo_area_name:'出发地',
				consignee_area_name:'收货地',
				vehicle_length:'车辆长度',
				userData: this.getCookie('userData') ? JSON.parse(this.getCookie('userData')) : null,
			};
		},
		mounted() {
			// this.getUserLocation();
			this.getOneAreaList();
			this.getTwoAreaList(11);
			this.getThreeAreaList(11,1101);
			this.getVehicleLength();
			this.getOrderList();
		},
		created(){
			window.addEventListener('scroll', this.handleScroll);
		},
		methods: {
			
			/* 
				调用微信api和百度api获取用户当前位置 
			*/
			getUserLocation(){
				let that = this;
				wx.config({
					debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					appId: '${appId}', // 必填，公众号的唯一标识 
					timestamp: '${ timestamp}' , // 必填，生成签名的时间戳 
					nonceStr: '${ nonceStr}', // 必填，生成签名的随机串 
					signature: '${ signature}',// 必填，签名，见附录1 
					jsApiList: [
						'checkJsApi', 'openLocation', 'getLocation'
					] 
				});
				wx.checkJsApi({
					jsApiList: ['getLocation'],
					success: function (res) {
						if (res.checkResult.getLocation == false) {
							alert('你的微信版本太低，不支持微信JS接口，请升级到最新的微信版本！');
							return;
						}
					}
        });
				wx.ready(function(){
					wx.getLocation({
						type: 'wgs84',
						complete:function(argv){
							if(argv.errMsg=="getLocation:fail"){
								alert(JSON.stringify(res));
								var gc = new BMap.Geocoder();
								var pointAdd = new BMap.Point(res.longitude, res.latitude);
								gc.getLocation(pointAdd, function(rs){
								var city = rs.addressComponents.city;
									alert(city);
								}
							);
							}else{
								alert("ok");
							}
						},
						cancel: function (res) {
							alert('用户拒绝授权获取地理位置');
						}
					});
				});
				wx.error(function (res) {
					alert("调用微信jsapi返回的状态:"+res.errMsg);
				});
			},
			
			handleScroll(ev){
				// ------------ 滚动到最底部 ，加载更多
				if(this.commonJs.getScrollTop() + this.commonJs.getWindowHeight() == this.commonJs.getScrollHeight())
				this.loadMore();
			},
			/*
			* 加载更多
			*/
			loadMore(){  
				this.form.page++;
				this.getOrderList();
			},
			
			/* 
			下拉刷新重新加载数据(需清空数据)
			*/
			onRefresh() {
				setTimeout(() => {
					this.form.page = 1;
					this._dataClear();
					this.isLoading = false;
				}, 500);
			},
			/*
			* 清空数据
			*/
			_dataClear(){ 
				this.listPrompt = '点击或者上拉加载更多';
				this.orderList = [];
				this.getOrderList();
			},
			
			/* 
			获取货源列表
			*/
			getOrderList(){
				if(this.isFirstVisit) {this.loading = true; this.isFirstVisit = false;}
				if(this.orderList.length) this.listPrompt = '正在加载更多的数据...';
				this.axios.get(`${this.commonJs.basePath}/v1/order/source/list`,{params:this.form}).then((response) =>{
					this.orderList = this.orderList.concat(response.data.data.data);
					this.listPrompt = '点击或者上拉加载更多';
					// ----- 列表原来有数据，但再次查询出来的没有数据，执行以下语句
					if(this.orderList.length && !response.data.data.data.length) this.listPrompt = '没有更多啦';
					this.dateModelData = response.data.data.status_options;
					// ----- 先将暂无数据显示出来
					this.isResourceShow = true;
					this.loading = false;
				}).catch((error) =>{
					this.$toast(error);
					this.loading = false;
				});
			},
			
			/* 
				标签栏切换
			 */
			onTab(active) {
				if(active!=2){
					this.count = 0;
					this.index = 0;
				}
				if(active==2){
					this.index = 99;
					this.form.sort = 'desc';
				}
			},
			
			/* 
			 运价排序
			 */
			clickFreight(){
				this.count++;
				if(this.count%2==0){
					this.index=100
					this.form.sort = 'asc';
					this.orderList = [];
					this.getOrderList();
				}else{
					this.index=99
					this.form.sort = 'desc';
					this.orderList = [];
					this.getOrderList();
				}
			},
			
			/* 
				获取车长
			*/
			getVehicleLength(){
				this.axios.get(`${this.commonJs.basePath}/v1/config`,{params:{version:'',area_code:''}}).then((response) =>{
					this.carLengthData = response.data.data.vehicle_lengths;
				}).catch((error) =>{
					this.$toast(error)
				});
			},
			
			
			/* 
				选择并确认出发地与收货地地址
			*/
			onConfirmAddress(value,index){
				if(value[value.length-1] == undefined){
					this.form.cargo_area_code = value[value.length-2].code
					this.cargo_area_name = value[0].name
					if(value[value.length-2].name == '全部'){
						this.form.cargo_area_code = value[0].code
						this.cargo_area_name = value[0].name
					}
				}
				else if(value[value.length-1] != undefined){
					this.form.cargo_area_code = value[value.length-1].code
					this.cargo_area_name = value[0].name
					if(value[value.length-1].name == '全部'&&value[value.length-2].name!= '全部'){
						this.form.cargo_area_code = value[1].code
						this.cargo_area_name = value[0].name
					}
					if(value[value.length-1].name == '全部'&&value[value.length-2].name== '全部'){
						this.form.cargo_area_code = value[0].code
						this.cargo_area_name = value[0].name
					}
				}
				this.orderList = [];
				this.getOrderList();
				this.showAddress = false;
			},
			onConfirmAddress_(value,index){
				if(value[value.length-1] == undefined){
					this.form.consignee_area_code = value[value.length-2].code
					this.consignee_area_name = value[0].name
					if(value[value.length-2].name == '全部'){
						this.form.consignee_area_code = value[0].code
						this.consignee_area_name = value[0].name
					}
				}
				else if(value[value.length-1] != undefined){
					this.form.consignee_area_code = value[value.length-1].code
					this.consignee_area_name = value[0].name
					if(value[value.length-1].name == '全部'&&value[value.length-2].name!= '全部'){
						this.form.consignee_area_code = value[1].code
						this.consignee_area_name = value[0].name
					}
					if(value[value.length-1].name == '全部'&&value[value.length-2].name== '全部'){
						this.form.consignee_area_code = value[0].code
						this.consignee_area_name = value[0].name
					}
				}
				this.orderList = [];
				this.getOrderList();
				this.showAddress_ = false;
			},
			/* 
				选择并确认车长
			*/
			onConfirmCar(value,index){
				this.form.vehicle_length = value;
				this.vehicle_length = value;
				this.orderList = [];
				this.getOrderList();
				this.showCarLength = false;
			},
			
			/* 
			省市区选项改变时触发
			*/
			onChangeArea(picker,value,index) {
				this.loading = true;
				if(index === 0){
					this.axios.get(`${this.commonJs.basePath}/v1/area/children`,{params: {parent_area_code:value[0].code,scope:'1'}}).then( (response) => {
						if(response.data.errcode === 0){
							var arr = [];
							if(JSON.stringify(response.data.data)=='[]'){
								arr = response.data.data;
							}else{
								arr = response.data.data;
								arr.unshift({code:'',name:"全部",})
							}
							picker.setColumnValues(1,arr)// 重设市的选项
						}else{
							this.$toast.fail(response.data.message);  
						}
						this.loading = false;
					}).catch( (error) => {this.loading = false;});
					this.axios.get(`${this.commonJs.basePath}/v1/area/children`,{params: {parent_area_code:value[0].code,scope:'2',city_code:value[0].code+"01"}}).then( (response) => {
						if(response.data.errcode === 0){
							var arr = [];
							if(JSON.stringify(response.data.data)=='[]'){
								arr = response.data.data;
							}else{
								arr = response.data.data;
								arr.unshift({code:'',name:"全部",})
							}
							picker.setColumnValues(2,arr)//重设区的第一选项
						}else{
							this.$toast.fail(response.data.message);  
						}
						this.loading = false;
					}).catch( (error) => {this.loading = false;});
				}
				if(index === 1){
					this.axios.get(`${this.commonJs.basePath}/v1/area/children`,{params: {parent_area_code:value[0].code,scope:'2',city_code:value[1].code}}).then( (response) => {
						if(response.data.errcode === 0){
							var arr = [];
							if(JSON.stringify(response.data.data)=='[]'){
								arr = response.data.data;
							}else{
								arr = response.data.data;
								arr.unshift({code:'',name:"全部",})
							}
							picker.setColumnValues(2,arr)// 重设区的选项
						}else{
							this.$toast.fail(response.data.message);  
						}
						this.loading = false;
					}).catch( (error) => {this.loading = false;});
				}
				if(index === 2){
					this.loading = false;
				}
			},
			/* 
			获取一级地区列表
			*/
			getOneAreaList(){
				this.axios.get(`${this.commonJs.basePath}/v1/area/children`,this._oneAreaListParams()).then( (response) => {
					if(response.data.errcode === 0){
						this.area_list[0].values = response.data.data;
						this.area_list[0].values.unshift({code:'',name:"全部",});
					}else{
						this.$toast.fail(response.data.message);  
					}
				}).catch( (error) => {});
			},
			_oneAreaListParams(){
				return {
					params: {
						parent_area_code:'',
					}
				}
			},
			/* 
			根据code获取二级地区列表
			*/
			getTwoAreaList(two_level_code){
				this.axios.get(`${this.commonJs.basePath}/v1/area/children`,{params: {parent_area_code:two_level_code,scope:'1'}}).then( (response) => {
					if(response.data.errcode === 0){
						this.area_list[1].values = response.data.data;
						this.area_list[1].values.unshift({code:'',name:"全部",});
					}else{
						this.$toast.fail(response.data.message);  
					}
				}).catch( (error) => {});
			},
			/* 
			根据code获取三级地区列表
			*/
			getThreeAreaList(two_level_code,three_level_code){
				this.axios.get(`${this.commonJs.basePath}/v1/area/children`,{params: {parent_area_code:two_level_code,scope:'2',city_code:three_level_code}}).then( (response) => {
					if(response.data.errcode === 0){
						this.area_list[2].values = response.data.data;
						this.area_list[2].values.unshift({code:'',name:"全部",});
					}else{
						this.$toast.fail(response.data.message);  
					}
				}).catch( (error) => {});
			},
		
		},
	};
</script>

<style scoped>
	/* 升序与降序style */
	.asc-arrow{
		display: inline-block;
		width: 5px;
		height: 5px;
		transform: rotate(45deg);
		border: 1px solid #443030;
		border-right-color: transparent;
		border-bottom-color: transparent;
		margin-left: -7px;
		margin-bottom: 4px;
	}
	.asc_arrow_bc{
		border-left-color: #38f;
		border-top-color: #38f;
	}
	.desc-arrow{
		display: inline-block;
		width: 5px;
		height: 5px;
		transform: rotate(45deg);
		border: 1px solid #443030;
		border-left-color: transparent;
		border-top-color: transparent;
		margin-left: 5px;
		margin-bottom: 1px;
	}
	.desc_arrow_bc{
		border-right-color: #38f;
		border-bottom-color: #38f;
	}
	/* 货源信息列表style */
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
