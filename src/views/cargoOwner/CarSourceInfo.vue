<!-- 
	车源信息
 -->

<template>
  <div class="carSource">
		<!-- 导航栏 -->
		<van-nav-bar title="车源信息" fixed></van-nav-bar>
		<!-- 标签栏 -->
		<van-tabbar v-model="active" style="top: 38px;" @change="onTab">
			<van-tabbar-item icon="" @click="showAddress = true"><span class="text-ellipsis">{{cargo_area_name}}</span><span class="select-arrow"></span></van-tabbar-item>
			<van-tabbar-item icon="" @click="showAddress_ = true">{{consignee_area_name}}<span class="select-arrow"></span></van-tabbar-item>
			<van-tabbar-item icon="" @click="showCarModel = true">{{vehicle_name}}<span class="select-arrow"></span></van-tabbar-item>
		</van-tabbar>
		<!-- 车源信息列表 -->
		<van-pull-refresh v-model="isLoading" @refresh="onRefresh" class="mart90" v-if="vehicleRouteList">
			<div class="car-content">
				<ul class="car-list car-list-bt5" v-for="item in vehicleRouteList">
					<li>
						<p class="fl">{{item.created_at}}</p>
						<p class="fr">
							<span class="car-fcg">心意价格：</span>
							<span class="car-fcy">{{item.freight+'元/吨'}}</span>
						</p>
					</li>
					<li class="car-fw9 car-fs14">{{item.cargo_city + ' - ' + item.consignee_city}}</li>
					<li class="car-fcg">{{item.desc}}</li>
					<li class="car-fcg">
						<van-icon name="location" />
						<span class="car-marl10">{{item.last_address}}</span>
					</li>
				</ul>
				<p v-if="vehicleRouteList.length" @click="loadMore" class="align-center mart10">{{listPrompt}}</p>
			</div>
			<div v-if="!vehicleRouteList.length && !loading" class="no_resource">
				<img src="../../assets/images/no_resource.jpg" alt="">
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
		<!-- 车型的的底部弹出层 -->
		<van-popup v-model="showCarModel" position="bottom" v-if='carModelData'>
			<van-picker
				show-toolbar
				title="选择车型"
				:columns="carModelData"
				@cancel="showCarModel = false"
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
				vehicleRouteList:[],//车源信息列表
				isLoading: false,
				form:{
					cargo_area_code:'',
					consignee_area_code:'',
					vehicle_type:'',
					vehicle_length:'',
					page:     this.commonJs.pagination.pageDefault, 		//页码
					pre_page: this.commonJs.pagination.prePageDefault, //每页条数
				},
				
				active: 0,
				showAddress:false,
				showAddress_:false,
				showCarModel:false,
				area_list:[ { values:[] }, { values:[] }, { values:[] } ],
				carModelData:[],
				cargo_area_name:'出发地',
				consignee_area_name:'收货地',
				vehicle_name:'车型'
			};
		},
		mounted() {
			this.getOneAreaList();
			this.getTwoAreaList(11);
			this.getThreeAreaList(11,1101);
			this.getVehicleType();
			this.getVehicleRouteList();
		},
		created(){
			window.addEventListener('scroll', this.handleScroll);
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
				this.form.page++;
				this.getVehicleRouteList();
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
				this.vehicleRouteList = [];
				this.getVehicleRouteList();
			},
			
			/* 
			获取车源列表
			*/
			getVehicleRouteList(){
				if(this.isFirstVisit) {this.loading = true; this.isFirstVisit = false;}
				if(this.vehicleRouteList.length) this.listPrompt = '正在加载更多的数据...';
				this.axios.post(`${this.commonJs.basePath}/v1/vehicle/route/list`,this.form).then((response) =>{
					this.vehicleRouteList = this.vehicleRouteList.concat(response.data.data.data);
					this.listPrompt = '点击或者上拉加载更多';
					// ----- 列表原来有数据，但再次查询出来的没有数据，执行以下语句
					if(this.vehicleRouteList.length && !response.data.data.data.length) this.listPrompt = '没有更多啦';
					this.dateModelData = response.data.data.status_options;
					// ----- 先将暂无数据显示出来
					this.isResourceShow = true;
					this.loading = false;
				}).catch((error) =>{
					this.$toast(error);
					this.loading =false;
				});
			},
			
			/* 
				标签栏切换
			 */
			onTab(active) {
				console.log(active)
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
				this.vehicleRouteList = [];
				this.getVehicleRouteList();
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
				this.vehicleRouteList = [];
				this.getVehicleRouteList();
				this.showAddress_ = false;
			},
			/* 
				选择并确认车型
			*/
			onConfirmCar(value,index){
				this.form.vehicle_type = value;
				this.vehicle_name = value;
				this.getVehicleRouteList();
				this.showCarModel = false;
			},
			
			/* 
			省市区选项改变时触发
			*/
			onChangeArea(picker,value,index) {
				this.loading = true;
				if(index === 0){
					console.log("00000")
					this.axios.get(`${this.commonJs.basePath}/v1/area/children`,{params: {parent_area_code:value[0].code,scope:'1'}}).then( (response) => {
						if(response.data.errcode === 0){
							var arr = [];
							if(JSON.stringify(response.data.data)=='[]'){
								arr = response.data.data;
							}else{
								arr = response.data.data;
								arr.unshift({code:'',name:"全部",})
							}
							console.log("重设市的选项",arr)
							picker.setColumnValues(1,arr)// 重设市的选项
						}else{
							this.$toast.fail(response.data.message);  
						}
						this.loading = false;
					}).catch( (error) => {this.loading = false;});
					console.log("---------------")
					this.axios.get(`${this.commonJs.basePath}/v1/area/children`,{params: {parent_area_code:value[0].code,scope:'2',city_code:value[0].code+"01"}}).then( (response) => {
						if(response.data.errcode === 0){
							var arr = [];
							if(JSON.stringify(response.data.data)=='[]'){
								arr = response.data.data;
							}else{
								arr = response.data.data;
								arr.unshift({code:'',name:"全部",})
							}
							console.log("重设区的第一选项",arr)
							picker.setColumnValues(2,arr)//重设区的第一选项
						}else{
							this.$toast.fail(response.data.message);  
						}
						this.loading = false;
					}).catch( (error) => {this.loading = false;});
				}
				if(index === 1){
					console.log("11111")
					this.axios.get(`${this.commonJs.basePath}/v1/area/children`,{params: {parent_area_code:value[0].code,scope:'2',city_code:value[1].code}}).then( (response) => {
						if(response.data.errcode === 0){
							var arr = [];
							if(JSON.stringify(response.data.data)=='[]'){
								arr = response.data.data;
							}else{
								arr = response.data.data;
								arr.unshift({code:'',name:"全部",})
							}
							console.log("重设区的选项",arr)
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
						this.area_list[0].values.unshift({code:'',name:"全部",})
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
						this.area_list[1].values.unshift({code:'',name:"全部",})
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
			
			/* 
				获取车型
			*/
			getVehicleType(){
				this.axios.get(`${this.commonJs.basePath}/v1/config`,{params:{version:'',area_code:''}}).then((response) =>{
					this.carModelData = response.data.data.vehicle_types;
				}).catch((error) =>{
					this.$toast(error)
				});
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
