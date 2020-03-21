<!-- 
	找货-编辑路线
 -->

<template>
  <div class="editRoute">
		<div id="allmap"></div>
		<div class="line-content" v-if="route">
			<div class="container-line">
				<!-- 导航栏 -->
				<van-nav-bar 
					title="编辑路线" 
					left-text="取消" @click-left="$router.back(-1)" 
					right-text="完成" @click-right="editRoute" 
					fixed>
				</van-nav-bar>
				<!-- 路线 -->
				<div class="plate mart56">
					<van-cell-group>
						<ul class="receive-send" @click="showAddress = true">
							<li class="fl receive-send-icon"></li>
							<li class="fl receive-send-info">{{route.cargo_area_code == 0 ?"全部":route.cargo_city}}</li>
							<li class="fr receive-send-arrow"><van-icon name="arrow" /></li>
						</ul>
					</van-cell-group>
					<van-cell-group>
						<ul class="receive-send" @click="showAddress_ = true">
							<li class="fl receive-send-icons"></li>
							<li class="fl receive-send-info">{{route.consignee_area_code == 0?"全部":route.consignee_city}}</li>
							<li class="fr receive-send-arrow"><van-icon name="arrow" /></li>
						</ul>
					</van-cell-group>
				</div>
				<!-- 期望运价 -->
				<div class="plate freight">
					<span>期望运价</span>
					<input type="text" v-model="route.freight"/>
					<span>{{"元/"+route.freight_unit}}</span>
				</div>
			</div>
			<div class="plate fixed-bottom">
				<van-button size="large" type="primary" @click="deleteRoute">删 除 路 线</van-button>
			</div>
		</div>
		
		<!-- 出发地与目的地的弹出层 -->
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
		<div v-show="loading" class="fullScreen-loding"><van-loading type="spinner"/></div>
	</div>
</template>

<script>
	export default {
		data(){
			return{
				loading:false,//是否处于加载状态
				showAddress:false,
				showAddress_:false,
				area_list:[ { values:[] }, { values:[] }, { values:[] } ],
				route:null,//路线
			};
		},
		mounted() {
			this.getOneAreaList();
			this.getTwoAreaList(11);
			this.getThreeAreaList(11,1101);
			this.getRoute();
// 			this.$nextTick(()=>{
// 				this.showMap();
// 			})
		},
		methods:{
			
			/*
			 * 获取起始地址
			 */
			_startEndAddress(startCode, endCode) {
				let start, end;
				// -------------- 一次调用获取开始地址 -------------------
				this._getQueryAreaCodeDetailByCode(startCode).then((response) => {
					start = response.data.district_code_name;
					// -------------- 二次调用获取结束地址 -------------------
					this._getQueryAreaCodeDetailByCode(endCode).then((response2) => {
						end = response2.data.district_code_name;
						// ----- 调用地图 -----
						this.showMap(start, end);
						//转化为经纬度
					}).catch((error) => {
						this.$toast(error)
					});
				}).catch((error) => {
					this.$toast(error)
				});
			},
			/*
			* 根据code获取到AreaCode对应信息
			*/
			_getQueryAreaCodeDetailByCode(code) {
				return new Promise((resolve, reject) => {
					this.axios.get(`${this.commonJs.basePath}/v1/area/info`, {params: {area_code: code}}).then((response) => {
						resolve(response.data)
					}).catch((error) => {
						reject(error)
					});
				})
			},
			
			/*
			* 显示地图
			*/
			showMap(start, end){
				var map = new BMap.Map("allmap");    
				map.centerAndZoom(new BMap.Point(116.404, 39.915), 14); 
				map.enableScrollWheelZoom();    //启用滚轮放大缩小，默认禁用
				map.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用

				map.addControl(new BMap.NavigationControl());  //添加默认缩放平移控件
				var driving = new BMap.DrivingRoute(map, {    
				 renderOptions: {    
					 map: map,    
					 autoViewport: true    
				 }    
				});
				driving.search(start, end);
				// driving.search(new BMap.Point(116.404, 39.915), new BMap.Point(116.389, 39.811));
			},
			
			/* 
				获取我的路线
			*/
			getRoute(){
				this.loading = true;
				this.axios.get(`${this.commonJs.basePath}/v1/vehicle/route/get`,this._routeParams()).then( (response) => {
					this.route = response.data.data.route;
					// ---------------------- 获取地图信息 --------------------
					this.$nextTick(() => {
							this._startEndAddress(response.data.data.route.cargo_area_code, response.data.data.route.consignee_area_code);
					});
					this.loading = false;
				}).catch( (error) => {
					this.$toast(error);
					 this.loading = false;
				});
			},
			_routeParams(){
				return {
					params: {
						type:'0',//类型 1整车, 2拼车 ,0全部
					}
				}
			},
			
			/* 
				编辑路线
			*/
			editRoute(){
				let form = {
					cargo_area_code:this.route.cargo_area_code,
					consignee_area_code:this.route.consignee_area_code,
					freight:this.route.freight,
				}
				this.axios.post(`${this.commonJs.basePath}/v1/vehicle/route/add`,form).then( (response) => {
					// this.$toast(response.data.message); 
					this.$router.push({path: '/find_goods'})
				}).catch( (error) => {
					this.$toast(error); 
				});
			},
			
			/* 
				删除路线
			*/
			deleteRoute(){
				this.axios.get(`${this.commonJs.basePath}/v1/vehicle/route/delete`,{params: {}}).then( (response) => {
					this.$toast(response.data.message); 
					this.$router.push({path: '/find_goods'})
				}).catch( (error) => {
					this.$toast(error); 
				});
			},
			
			/* 
				选择并确认出发地与收货地地址
			*/
			onConfirmAddress(value,index){
				if(value[value.length-1] == undefined){
					this.route.cargo_area_code = value[value.length-2].code
					this.route.cargo_city = value[0].name+" - "+value[1].name
				}
				else if(value[value.length-1] != undefined){
					this.route.cargo_area_code = value[value.length-1].code
					this.route.cargo_city = value[0].name+" - "+value[1].name+" - "+value[2].name
				}
				this.showAddress = false;
			},
			onConfirmAddress_(value,index){
				if(value[value.length-1] == undefined){
					this.route.consignee_area_code = value[value.length-2].code
					this.route.consignee_city = value[0].name+" - "+value[1].name
				}
				else if(value[value.length-1] != undefined){
					this.route.consignee_area_code = value[value.length-1].code
					this.route.consignee_city = value[0].name+" - "+value[1].name+" - "+value[2].name
				}
				this.showAddress_ = false;
			},
			/* 
			省市区选项改变时触发
			*/
			onChangeArea(picker,value,index) {
				// console.log(picker,value,index)
				if(index === 0){
					this.axios.get(`${this.commonJs.basePath}/v1/area/children`,{params: {parent_area_code:value[0].code,scope:'1'}}).then( (response) => {
						if(response.data.errcode === 0){
							picker.setColumnValues(1,response.data.data)// 重设市的选项
						}else{
							this.$toast.fail(response.data.message);  
						}
					}).catch( (error) => {});
					this.axios.get(`${this.commonJs.basePath}/v1/area/children`,{params: {parent_area_code:value[0].code,scope:'2',city_code:value[0].code+"01"}}).then( (response) => {
						if(response.data.errcode === 0){
							picker.setColumnValues(2,response.data.data)//重设区的第一选项
						}else{
							this.$toast.fail(response.data.message);  
						}
					}).catch( (error) => {});
				}
				if(index === 1){
					this.axios.get(`${this.commonJs.basePath}/v1/area/children`,{params: {parent_area_code:value[0].code,scope:'2',city_code:value[1].code}}).then( (response) => {
						if(response.data.errcode === 0){
							picker.setColumnValues(2,response.data.data)// 重设区的选项
						}else{
							this.$toast.fail(response.data.message);  
						}
					}).catch( (error) => {});
				}
			},
			/* 
			获取一级地区列表
			*/
			getOneAreaList(){
				this.axios.get(`${this.commonJs.basePath}/v1/area/children`,this._oneAreaListParams()).then( (response) => {
					if(response.data.errcode === 0){ 
						this.area_list[0].values = response.data.data;
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
					}else{
						this.$toast.fail(response.data.message);  
					}
				}).catch( (error) => {});
			},
		}
	};
</script>

<style>
	.van-nav-bar__left .van-nav-bar__text{
		color: #222222; 
	}
</style>

<style scoped lang="less">
	#allmap{
		height: calc(~'100vh - 1rem');
		width: 100vw;
	}
	/* 
	 目的地与出发地style
	 */
	.receive-send{
		width: 100%;
		overflow: hidden;
		border-bottom: 1px solid #f7f7f7;
	}
	.receive-send .receive-send-icon{
		width: 12px;
    height: 12px;
    border: 4px solid #2bcb84;
    border-radius: 50%;
    box-sizing: border-box;
    margin: 16px;
	}
	.receive-send .receive-send-icons{
		width: 12px;
		height: 12px;
		border: 4px solid #f44;
		border-radius: 50%;
		box-sizing: border-box;
		margin: 16px;
	}
	.receive-send .receive-send-info{
		color: #666;
    font-size: 13px;
		margin-top: 12px;
	}
	.receive-send .receive-send-arrow{
		margin-right: 4%;
		margin-top: 15px;
	}
	.receive-send .receive-send-arrow .van-icon{
		color: #999;
		font-size: 13px;
	}
	
	/* 路线的style */
	.container-line{
		position: fixed;
		top: 0;
		width: 100%;
		overflow: hidden; 
		z-index: 100;
		background: #f7f7f7;
	}
	.line-content{
		overflow: hidden;
	}
	.line-content .plate{
		width: 95%;
		overflow: hidden;
		margin: 0 auto;
		border-radius: 5px;
		background: #fff;
		margin-bottom: 10px;
	}
	.line-content .plate.freight{
		padding: 8px;
		box-sizing: border-box;
		color: #999;
	}
	.line-content .plate.mart56{
		margin-top: 56px;
	}
	.line-content .plate.freight input{
		margin: 0 5px;
    background: #eee;
    outline: none;
    width: 80px;
    height: 36px;
    text-align: center;
    border-radius: 4px;
		color: #666;
	}
	.line-content .plate.fixed-bottom{
		position: fixed;
    bottom: 0;
    width: 100%;
    margin-bottom: 0;
		z-index: 99;
	}
	.line-content .plate.fixed-bottom button{
		background: #fff !important;
    color: #f44;
    height: 50px !important;
    border: none !important;
	}
</style>
