<!-- 
	交易行情
 -->

<template>
  <div class="tradeQuotation" v-if="orderList">
		<!-- 导航栏 -->
		<van-nav-bar title="交易行情" left-arrow @click-left="$router.go(-1)" fixed></van-nav-bar>
		<!-- 标签栏 -->
		<van-tabbar v-model="active" style="top: 45px;" @change="onTab">
			<van-tabbar-item icon="" @click="showCarType = true">{{car_type}}<span class="select-arrow"></span></van-tabbar-item>
			<van-tabbar-item icon="" @click="showAddress = true">{{cargo_area_name}}<span class="select-arrow"></span></van-tabbar-item>
			<van-tabbar-item icon="" @click="showAddress_ = true">{{consignee_area_name}}<span class="select-arrow"></span></van-tabbar-item>
			<van-tabbar-item icon="" @click="showCarModel = true">{{vehicle_name}}<span class="select-arrow"></span></van-tabbar-item>
		</van-tabbar>
		<!-- 交易行情列表 -->
		<van-pull-refresh v-model="isLoading" @refresh="onRefresh" class="mart100">
			<div class="order-content">
				<div class="box-inner" v-for="item in orderList">
					<p class="title">
						<span class="fl date">{{item.created_at.split(' ')[0]}}</span> 
						<span class="fl address">{{item.cargo_city + ' - ' + item.consignee_city}}</span>
						<span class="fl type">{{item.type == 1 ? '整车' : '拼车'}}</span>
						<span class="unit-price fr">{{item.freight+'元/吨'}}</span>
					</p>
					<p class="dsc">{{item.desc}}</p>
				</div>
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
		<van-popup v-model="showCarModel" position="bottom">
			<van-picker
				show-toolbar
				title="选择车型"
				:columns="carModelData"
				@cancel="showCarModel = false"
				@confirm="onConfirmCar"
				@change=""
			/>
		</van-popup>
		<!-- 车型的的底部弹出层 -->
		<van-popup v-model="showCarType" position="bottom">
			<van-picker
				show-toolbar
				title="选择车型"
				:columns="carTypeData"
				@cancel="showCarType = false"
				@confirm="onConfirmCarType"
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
				loading: false,   //是否处于加载状态
				orderList:null,
				isLoading: false,
				active: 0,
				showAddress:false,
				showAddress_:false,
				showCarModel:false,
				showCarType:false,
				area_list:[ { values:[] }, { values:[] }, { values:[] } ],
				carModelData:[],
				carTypeData:['全部','整车','拼车'],
				type:'',
				consignee_area_code:'',
				vehicle_type:'',
				cargo_area_code:'',
				cargo_area_name:'出发地',
				consignee_area_name:'收货地',
				vehicle_name:'车型',
				car_type:'整车/拼车',
			};
		},
		mounted() {
			this.getOneAreaList();
			this.getTwoAreaList(11);
			this.getThreeAreaList(11,1101);
			this.getVehicleType();
			this.getOrderList();
		},
		created(){
			
		},
		methods: {
			
			/* 
			 下拉刷新
			 */
			onRefresh() {
				setTimeout(() => {
					this.getOrderList();
					this.$toast('刷新成功');
					this.isLoading = false;
				}, 500);
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
					this.cargo_area_code = value[value.length-2].code
					this.cargo_area_name = value[0].name
					if(value[value.length-2].name == '全部'){
						this.cargo_area_code = value[0].code
						this.cargo_area_name = value[0].name
					}
				}
				else if(value[value.length-1] != undefined){
					this.cargo_area_code = value[value.length-1].code
					this.cargo_area_name = value[0].name
					if(value[value.length-1].name == '全部'&&value[value.length-2].name!= '全部'){
						this.cargo_area_code = value[1].code
						this.cargo_area_name = value[0].name
					}
					if(value[value.length-1].name == '全部'&&value[value.length-2].name== '全部'){
						this.cargo_area_code = value[0].code
						this.cargo_area_name = value[0].name
					}
				}
				this.getOrderList();
				this.showAddress = false;
			},
			onConfirmAddress_(value,index){
				if(value[value.length-1] == undefined){
					this.consignee_area_code = value[value.length-2].code
					this.consignee_area_name = value[0].name
					if(value[value.length-2].name == '全部'){
						this.consignee_area_code = value[0].code
						this.consignee_area_name = value[0].name
					}
				}
				else if(value[value.length-1] != undefined){
					this.consignee_area_code = value[value.length-1].code
					this.consignee_area_name = value[0].name
					if(value[value.length-1].name == '全部'&&value[value.length-2].name!= '全部'){
						this.consignee_area_code = value[1].code
						this.consignee_area_name = value[0].name
					}
					if(value[value.length-1].name == '全部'&&value[value.length-2].name== '全部'){
						this.consignee_area_code = value[0].code
						this.consignee_area_name = value[0].name
					}
				}
				this.getOrderList();
				this.showAddress_ = false;
			},
			/* 
				选择并确认车型
			*/
			onConfirmCar(value,index){
				this.vehicle_type = value;
				this.vehicle_name = value;
				this.getOrderList();
				this.showCarModel = false;
			},
			onConfirmCarType(value,index){
				if(index===0){
					this.type = '';
					this.car_type = value;
				}else{
					this.type = index;
					this.car_type = value;
				}
				this.getOrderList();
				this.showCarType = false;
			},
			
			/* 
			省市区选项改变时触发
			*/
			onChangeArea(picker,value,index) {
				// console.log(picker,value,index)
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
							this.loading = false;
						}else{
							this.$toast.fail(response.data.message);  
						}
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
							this.loading = false;
						}else{
							this.$toast.fail(response.data.message);  
						}
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
							this.loading = false;
						}else{
							this.$toast.fail(response.data.message);  
						}
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
				this.loading = true;
				this.axios.get(`${this.commonJs.basePath}/v1/area/children`,this._oneAreaListParams()).then( (response) => {
					if(response.data.errcode === 0){
						// this.$toast.success(response.data.message);
						this.area_list[0].values = response.data.data;
						this.area_list[0].values.unshift({code:'',name:"全部",}),
						this.loading = false;
					}else{
						this.$toast.fail(response.data.message);  
					}
				}).catch( (error) => {
					//this.$toast.fail(error); 
					this.loading = false;
				});
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
				this.loading = true;
				this.axios.get(`${this.commonJs.basePath}/v1/area/children`,{params: {parent_area_code:two_level_code,scope:'1'}}).then( (response) => {
					if(response.data.errcode === 0){
						// this.$toast.success(response.data.message);
						this.area_list[1].values = response.data.data;
						this.area_list[1].values.unshift({code:'',name:"全部",}),
						this.loading = false;
					}else{
						this.$toast.fail(response.data.message);  
					}
				}).catch( (error) => {
					//this.$toast.fail(error); 
					this.loading = false;
				});
			},
			/* 
			根据code获取三级地区列表
			*/
			getThreeAreaList(two_level_code,three_level_code){
				this.loading = true;
				this.axios.get(`${this.commonJs.basePath}/v1/area/children`,{params: {parent_area_code:two_level_code,scope:'2',city_code:three_level_code}}).then( (response) => {
					if(response.data.errcode === 0){
						// this.$toast.success(response.data.message);
						this.area_list[2].values = response.data.data;
						this.area_list[2].values.unshift({code:'',name:"全部",}),
						this.loading = false;
					}else{
						this.$toast.fail(response.data.message);  
					}
				}).catch( (error) => {
					//this.$toast.fail(error); 
					this.loading = false;
				});
			},
			
			/* 
				获取车型
			*/
			getVehicleType(){
				this.axios.get(`${this.commonJs.basePath}/v1/config`,{params:{version:'',area_code:''}}).then((response) =>{
					if(response.data.errcode === 0){
						this.carModelData = response.data.data.vehicle_types;
					}else{
						this.$toast.fail(response.data.message)
					}
				}).catch((error) =>{
					
				});
			},
			/* 
			 获取交易行情列表
			 */
			getOrderList(){
				this.axios.get(`${this.commonJs.basePath}/v1/order/list`,{params:{type:this.type,consignee_area_code:this.consignee_area_code,vehicle_type:this.vehicle_type,cargo_area_code:this.cargo_area_code}}).then((response) =>{
					if(response.data.errcode === 0){
						this.orderList = response.data.data.data
					}else{
						this.$toast.fail(response.data.message)
					}
				}).catch((error) =>{
					
				});
			},
		
		},
	};
</script>

<style lang="less" scoped>
	/* 交易行情列表style */
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
	.order-content{
		/* background-color: #f7f7f7; */
		/* padding-bottom: 60px; */
		/* font-size: 12px; */
	}
</style>
