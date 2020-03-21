<!-- 
	找货-发布路线、我的路线
 -->

<template>
  <div class="goodsRoute">
		<!-- 发布路线 -->
		<div class="line-content" v-if="route==null&&order==null&&order_source==null">
			<div class="container-line">
				<!-- 导航栏 -->
				<van-nav-bar title="发布路线" left-arrow @click-left="$router.push({path: '/source_information'})" fixed></van-nav-bar>
				<!-- 路线 -->
				<div class="plate mart56">
					<van-cell-group>
						<ul class="receive-send" @click="showAddress = true">
							<li class="fl receive-send-icon"></li>
							<li class="fl receive-send-info">{{cargo_area_name}}</li>
							<li class="fr receive-send-arrow"><van-icon name="arrow" /></li>
						</ul>
					</van-cell-group>
					<van-cell-group>
						<ul class="receive-send" @click="showAddress_ = true">
							<li class="fl receive-send-icons"></li>
							<li class="fl receive-send-info">{{consignee_area_name}}</li>
							<li class="fr receive-send-arrow"><van-icon name="arrow" /></li>
						</ul>
					</van-cell-group>
				</div>
				<!-- 期望运价 -->
				<div class="plate freight">
					<span>期望运价</span>
					<input type="text" v-model="form.freight"/>
					<span>元/吨</span>
				</div>
			</div>
				
			<div class="plate fixed-bottom">
				<van-button size="large" type="primary" @click="publishRoute">发 布</van-button>
			</div>
		</div>
		
		<!-- 我的路线-我的路线与我的接单 -->
		<div v-if="order&&route&&order_source==null">
			<!-- 导航栏 -->
			<van-nav-bar title="我的路线" left-arrow @click-left="$router.push({path: '/source_information'})" fixed></van-nav-bar>
			<!-- 我的路线与我的接单-->
			<div class="line-content" style="margin-top: 56px;">
				<!-- 我的路线-->
				<div v-if="route">
					<h4 class="formItem-title">路线</h4>
					<ul class="plate route" @click="$router.push({path: '/find_goods/edit_route'})">
						<li class="fl left-route-content">
							<p class="address">
								{{(route.cargo_area_code == 0 ?"全部":route.cargo_city)+' —— '+(route.consignee_area_code == 0?"全部":route.consignee_city)}}
							</p>
							<p class="price">期望运价<span>1.0</span>车 约<span>{{route.freight}}</span>元/<span>{{route.freight_unit}}</span></p>
						</li>
						<li class="fr right-route-content"><van-icon name="arrow" /></li>
					</ul>
				</div>
				<!-- 我的接单-->
				<div v-if="order.length!=0">
					<div v-if="order.length!=0">
						<h4 class="formItem-title">我的接单</h4>
						<van-pull-refresh v-model="isLoading" @refresh="onRefresh" class="">
							<ul class="plate order" v-for="(item,index) in order" @click="skipPage(item.status_desc,item.id)" >
								<li>
									<span class="fl date">{{item.order_time.split(" ")[0]}}</span>
									<p class="fr money">心意价格：<span>{{item.freight+'元/'+item.freight_unit}}</span></p>
									<span class="fr type" v-if="item.type==1">整车</span>
									<span class="fr type" v-if="item.type==2">拼车</span>
									<span class="fr type" v-if="item.type==0">全部</span>
								</li>
								<li>{{item.cargo_city+" - "+item.consignee_city}}</li>
								<li>
									<span class="fl desc">{{item.desc}}</span>
									<span class="fr states">{{item.status_desc}}</span>
								</li>
							</ul>
							<p v-if="order_total>order.length" @click="loadMore" class="align-center mart10 marb10">{{listPrompt}}</p>
						</van-pull-refresh>
					</div>
					<div v-if="order.length==0">
						<h4 class="formItem-title">我的接单</h4>
						<div  class="no_resource">
							<img src="../../../assets/images/no_resource.jpg" alt="">
							<p class="tips">暂 无 数 据</p>
						</div>
					</div>
				</div>
				<!-- 暂 无 数 据  -->
			</div>
		</div>
		
		<!-- 我的路线-我的路线与我的接单、我的匹配货源 -->
		<div v-if="order&&route&&order_source">
			<!-- 导航栏 -->
			<van-nav-bar title="我的路线" left-arrow @click-left="$router.push({path: '/source_information'})" fixed></van-nav-bar>
			<!-- 我的路线与我的接单、我的匹配货源-->
			<div class="line-content" style="margin-top: 56px;">
				<!-- 我的路线-->
				<div v-if="route">
					<h4 class="formItem-title">路线</h4>
					<ul class="plate route" @click="$router.push({path: '/find_goods/edit_route'})">
						<li class="fl left-route-content">
							<p class="address">
								{{(route.cargo_area_code == 0 ?"全部":route.cargo_city)+' —— '+(route.consignee_area_code == 0?"全部":route.consignee_city)}}
							</p>
							<p class="price">期望运价<span>1.0</span>车 约<span>{{route.freight}}</span>元/<span>{{route.freight_unit}}</span></p>
						</li>
						<li class="fr right-route-content"><van-icon name="arrow" /></li>
					</ul>
				</div>
				<!-- 我的接单-->
				<div v-if="order.length!=0&&order_source.length==0">
					<div v-if="order.length!=0">
						<h4 class="formItem-title">我的接单</h4>
						<van-pull-refresh v-model="isLoading" @refresh="onRefresh" class="">
							<ul class="plate order" v-for="(item,index) in order" @click="skipPage(item.status_desc,item.id)" >
								<li>
									<span class="fl date">{{item.order_time.split(" ")[0]}}</span>
									<p class="fr money">心意价格：<span>{{item.freight+'元/'+item.freight_unit}}</span></p>
									<span class="fr type" v-if="item.type==1">整车</span>
									<span class="fr type" v-if="item.type==2">拼车</span>
									<span class="fr type" v-if="item.type==0">全部</span>
								</li>
								<li>{{item.cargo_city+" - "+item.consignee_city}}</li>
								<li>
									<span class="fl desc">{{item.desc}}</span>
									<span class="fr states">{{item.status_desc}}</span>
								</li>
							</ul>
							<p v-if="order_total>order.length" @click="loadMore" class="align-center mart10 marb10">{{listPrompt}}</p>
						</van-pull-refresh>
					</div>
					<div v-if="order.length==0">
						<h4 class="formItem-title">我的接单</h4>
						<div  class="no_resource">
							<img src="../../../assets/images/no_resource.jpg" alt="">
							<p class="tips">暂 无 数 据</p>
						</div>
					</div>
				</div>
				<!-- 我的匹配货源 -->
				<div v-if="order_source.length!=0&&order.length==0">
					<div v-if="order_source.length!=0">
						<h4 class="formItem-title">
							<span class="fl">我的匹配货源</span>
							<van-radio-group v-model="radio" checked-color="#3283fa" class="type-style fr" @change="typeChange">
								<van-radio name="2" class="fr marr5">拼车</van-radio>
								<van-radio name="1" class="fr marr5">整车</van-radio>
								<van-radio name="0" class="fr marr5">全部</van-radio>
							</van-radio-group>
						</h4>
						<van-pull-refresh v-model="isLoading" @refresh="onRefresh" class="mart45">
							<ul class="plate order" v-for="(item,index) in order_source" @click="$router.push({name:'sourceDetails',params:{id:item.id}})" >
								<li>
									<span class="fl date">{{item.order_time.split(" ")[0]}}</span>
									<p class="fr money">心意价格：<span>{{item.freight+'元/'+item.freight_unit}}</span></p>
									<span class="fr type" v-if="item.type==1">整车</span>
									<span class="fr type" v-if="item.type==2">拼车</span>
									<span class="fr type" v-if="item.type==0">全部</span>
								</li>
								<li>{{item.cargo_city+" - "+item.consignee_city}}</li>
								<li>
									<span class="fl desc">{{item.desc}}</span>
									<span class="fr states">{{item.status_desc}}</span>
								</li>
							</ul>
							<p v-if="order_source_total>order_source.length" @click="loadMore" class="align-center mart10 marb10">{{listPrompt}}</p>
						</van-pull-refresh>
					</div>
					<div v-if="order_source.length==0">
						<h4 class="formItem-title">
							<span class="fl">我的匹配货源</span>
							<van-radio-group v-model="radio" checked-color="#3283fa" class="type-style fr" @change="typeChange">
								<van-radio name="2" class="fr marr5">拼车</van-radio>
								<van-radio name="1" class="fr marr5">整车</van-radio>
								<van-radio name="0" class="fr marr5">全部</van-radio>
							</van-radio-group>
						</h4>
						<div  class="no_resource">
							<img src="../../../assets/images/no_resource.jpg" alt="">
							<p class="tips">暂 无 数 据</p>
						</div>
					</div>
				</div>
				<!-- 暂 无 数 据  -->
				<div v-if="order_source.length==0&&order.length==0" class="no_resource">
					<h4 class="formItem-title">
						<span class="fl">我的匹配货源</span>
						<van-radio-group v-model="radio" checked-color="#3283fa" class="type-style fr" @change="typeChange">
							<van-radio name="2" class="fr marr5">拼车</van-radio>
							<van-radio name="1" class="fr marr5">整车</van-radio>
							<van-radio name="0" class="fr marr5">全部</van-radio>
						</van-radio-group>
					</h4>
					<img src="../../../assets/images/no_resource.jpg" alt="">
					<p class="tips">您尚未接单，且匹配货源暂无</p>
				</div>
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
				listPrompt: 				 '点击或者上拉加载更多', //提示
				isLoading: false,   
				showAddress:false,
				showAddress_:false,
				area_list:[ { values:[] }, { values:[] }, { values:[] } ],
				cargo_area_name:"请选择出发地",
				consignee_area_name:'请选择目的地',
				//发布路线的form
				form:{
					cargo_area_code:null,
					consignee_area_code:null,
					freight:null,
				},
				route:null,//我的路线---路线
				order:null,//我的路线---我的接单
				order_total:null,
				order_source:null,//我的路线---我的匹配货源
				order_source_total:null,
				showNoSource:false,
				radio: '0',
				type:'0',
				page:1, 		//页码
				pre_page:5,//每页条数
			};
		},
		mounted() {
			this.getOneAreaList();
			this.getTwoAreaList(11);
			this.getThreeAreaList(11,1101);
			this.getRoute();
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
				this.pre_page+=1;
				if(this.pre_page>this.order_source_total){
					return;
				}else{
					this.getRoute();
				}
			},
			
			/*
			* 下拉刷新重新加载数据
			*/
			onRefresh() {
				setTimeout(() => {
					this.page = 1;
					this.pre_page = 5;
					this._dataClear();
					this.isLoading = false;
				}, 500);
			},
			/*
			* 清空数据
			*/
			_dataClear(){ 
				this.order = [];
				this.order_source = [];
				this.getRoute();
			},
			
			/* 
				获取我的路线以及接单、匹配货源
			*/
			getRoute(){
				this.axios.get(`${this.commonJs.basePath}/v1/vehicle/route/get`,this._routeParams()).then( (response) => {
					this.route = response.data.data.route;
					this.order = response.data.data.order.data;
					this.order_total = response.data.data.order.total;
					this.order_source = response.data.data.order_source?response.data.data.order_source.data:null;
					this.order_source_total = response.data.data.order_source?response.data.data.order_source.total:null;
					this.loading = false;
				}).catch( (error) => {
					this.$toast("duqhfuwfwuie"); 
					this.loading = false;
				});
			},
			_routeParams(){
				return {
					params: {
						type:this.type,//类型 1整车, 2拼车 ,0全部
						page:this.page,
						pre_page:this.pre_page,
					}
				}
			},
			
			/* 
			 跳转
			 */
			skipPage(status,orderId){
				if(status=="待支付"){
					// this.$router.push({name:'wxPayPage',params:{id:"0-"+orderId,}}),
					window.location.href = window.location.origin + "/#/pay/0-"+orderId;
				}else{
					this.$router.push({name:'orderDetail',params:{id:orderId}})
				}
				
			},
			
			/* 
				发布或添加路线
			*/
			publishRoute(){
				if(this.form.freight==null){
					this.$toast('请填写期望运价'); 
					return;
				}
				this.axios.post(`${this.commonJs.basePath}/v1/vehicle/route/add`,this.form).then( (response) => {
					this.$toast('路线发布成功！！'); 
					location.reload();
				}).catch( (error) => {
					this.$toast(error); 
				});
			},
			
			/* type改变 */
			typeChange(){
				console.log(this.radio)
				if(this.radio=="0"){
					this.type = "0";
					this.page = 1;
					this.pre_page = 5;
					this.order_source = [];
					this.getRoute();
				}else if(this.radio=="1"){
					this.type = "1";
					this.page = 1;
					this.pre_page = 5;
					this.order_source = [];
					this.getRoute();
				}else if(this.radio=="2"){
					this.type = "2";
					this.page = 1;
					this.pre_page = 5;
					this.order_source = [];
					this.getRoute();
				}
			},
			
			/* 
				选择并确认出发地与收货地地址
			*/
			onConfirmAddress(value,index){
				if(value[value.length-1] == undefined){
					this.form.cargo_area_code = value[value.length-2].code
					this.cargo_area_name = value[0].name+" - "+value[1].name
				}
				else if(value[value.length-1] != undefined){
					this.form.cargo_area_code = value[value.length-1].code
					this.cargo_area_name = value[0].name+" - "+value[1].name+" - "+value[2].name
				}
				this.showAddress = false;
			},
			onConfirmAddress_(value,index){
				if(value[value.length-1] == undefined){
					this.form.consignee_area_code = value[value.length-2].code
					this.consignee_area_name = value[0].name+" - "+value[1].name
				}
				else if(value[value.length-1] != undefined){
					this.form.consignee_area_code = value[value.length-1].code
					this.consignee_area_name = value[0].name+" - "+value[1].name+" - "+value[2].name
				}
				this.showAddress_ = false;
			},
			/* 
			省市区选项改变时触发
			*/
			onChangeArea(picker,value,index) {
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
	.line-content .type-style .van-radio .van-icon-checked{
		color:#2391E2 !important;
	}
</style>

<style scoped>
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
		margin: 0 auto 10px;
		border-radius: 5px;
		background: #fff;
	}
	.line-content .formItem-title{
		color: #999;
		padding: 5px 0 10px 3%;
		text-align: left;
		font-size: 15px;
		font-weight: normal;
	}
	.line-content .type-style{
    height: 20px;
		line-height: 20px;
    margin-bottom: 10px;
    margin-right: 6%;
	}
	.line-content .type-style .van-radio .van-icon-checked{
		color:#2391E2 !important;
	}
	.line-content .plate.mart56{
		margin-top: 56px;
	}
	.line-content .plate.route{
		padding: 8px;
		color: #999;
		box-sizing: border-box;
	}
	.line-content .plate.route .left-route-content{
		overflow: hidden;
	}
	.line-content .plate.route .right-route-content{
		padding-top: 20px;
	}
	.line-content .plate.route .left-route-content p{
		margin:8px 0;
	}
	.line-content .plate.route .left-route-content .address{
		color: #222;
	}
	.line-content .plate.route .left-route-content .price{
		font-size: 12px;
	}
	.line-content .plate.route .left-route-content p span{
		color: #e4ba6c;
	}
	.line-content .plate.freight{
		padding: 8px;
		box-sizing: border-box;
		color: #999;
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
	.line-content .plate.order{
		padding: 8px;
		color: #999;
		box-sizing: border-box;
	}
	.line-content .plate.order li{
		margin:8px 0;
		overflow: hidden;
		color: #222222;
	}
	.line-content .plate.order li .date{
		margin-top: 2px;
	}
	.line-content .plate.order li .type{
		background: #3283fa;
    color: #fff;
    padding: 3px 8px;
    border-radius: 4px;
	}
	.line-content .plate.order li .money{
		margin-left: 10px;
    margin-top: 2px;
	}
	.line-content .plate.order li .money span{
		color: #e4ba6c;
	}
	.line-content .plate.order li .desc{
		color: #999;
    font-size: 12px;
	}
	.line-content .plate.fixed-bottom{
		position: fixed;
    bottom: 0;
    width: 100%;
    margin-bottom: 0;
		z-index: 99;
	}
</style>
