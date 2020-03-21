<!-- 
	物流运输---已交付
 -->
<template>
  <div class="pendingOrder">
		<!-- 导航栏 -->
		<van-nav-bar
			title="已交付"
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
				<ul @click="showOrderInfo(item)" class="car-list car-list-bt5" v-for="item in dataList">
					<li>
						<p class="fl">{{item.created_at}}</p>
						<p class="fr">
							<span class="car-fcg">心意运价：</span>
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
		<!-- 订单详情 -->
		<van-popup v-model="infoShow" position="right" :overlay="true" class="set-popup">
			<van-nav-bar
			title="订单详情"
			left-text=""
			left-arrow
			@click-left=" infoShow = false " 
			/> 
		  <div v-if="selectOrder">
		  	<!-- 车主详情 -->
				<div v-if="userData.type == 1" class="order-info mar5">
					<van-cell-group class="pad5">
					  <p>{{selectOrder.status_desc}}
					  	<br> 订单编号{{selectOrder.id}}
					  	<span class="fr two-right-time">{{selectOrder.updated_at}}</span>
					  </p>  
					</van-cell-group>
					<h5 class="mar5">我的路线</h5>
					<van-cell-group class="pad5">
					  <p>{{selectOrder.vehicle_route.cargo_area}}-{{selectOrder.vehicle_route.consignee_area}}</p>
					  <p>期望运价
					  	<span class="colore08d3e">{{selectOrder.vehicle_route.freight}}</span>元/{{selectOrder.vehicle_route.freight_unit}}
					  	约<span class="colore08d3e">{{Math.round(selectOrder.vehicle_route.freight/selectOrder.load)}}</span>元/{{selectOrder.vehicle_route.freight_unit}}
					  </p>
					</van-cell-group>
					<h5 class="mar5">货源详情</h5>
					<van-cell-group class="pad5">
					  <p class="color-black marl15">{{selectOrder.cargo_owner_name}} <span class="marl10">{{selectOrder.cargo_owner_cellphone}}</span></p>
						<p><i class="round"></i>{{selectOrder.cargo_city}}</p>
						<p class="marl15">{{selectOrder.cargo_address}}</p>
					</van-cell-group>
					<van-cell-group class="pad5">
					  <p class="color-black marl15">{{selectOrder.consignee}} <span class="marl10">{{selectOrder.consignee_cellphone}}</span></p>
						<p><i class="round red"></i>{{selectOrder.consignee_city}}</p>
						<p class="marl15">{{selectOrder.consignee_address}}</p>
					</van-cell-group>
					<van-cell-group class="pad5">
						<p>
							<span class="width50"><b>货物类型</b>{{selectOrder.cargo_type}}</span>
							<span class="width50"><b>货物重量</b>{{selectOrder.cargo_weight}}{{selectOrder.freight_unit}}</span>
						</p>
						<p>
							<span class="width50"><b>货物件数</b>{{selectOrder.cargo_num}}</span>
							<span class="width50"><b>货物体积</b>{{selectOrder.cargo_volume}}m³</span>
						</p>
						<p>
							<span class="width50">
								<b>期望运价</b>
								<span class="colore08d3e">{{selectOrder.freight}}/{{selectOrder.freight_unit}}</span>
							</span>
						</p>
					</van-cell-group>
					<van-cell-group class="pad5">
						<p>
							<span class="width50"><b>车辆类型</b>{{selectOrder.vehicle_type}}</span>
							<span class="width50"><b>车辆长度</b>{{selectOrder.vehicle_length}}米</span>
						</p>
					</van-cell-group>
					<van-cell-group class="pad5">
						<p><b>支付方式</b>{{selectOrder.payer == 1 ? '发货人' : '收货人'}}付款</p>
					</van-cell-group>
					<van-cell-group class="pad5">
						<p><b>货主备注</b>{{selectOrder.note}}</p>
					</van-cell-group>
					<van-cell-group class="pad5">
						<img 
							style="margin-right: 5px;"
							v-if="selectOrder.cargo_images"
							v-for="itemImg in JSON.parse(selectOrder.cargo_images)"
	      			:src="itemImg"
	      			@click="checkBigImg([itemImg])"
	      			width="80px"
	      			height="80px"/>
					</van-cell-group>
				</div>
				<!-- 货主详情 -->
				<div v-if="userData.type == 2" class="order-info mar5">
	        <van-cell-group class="pad5">
	            <p>{{selectOrder.status_desc}}</p>
	            <p>订单编号{{selectOrder.id}}</p>
	        </van-cell-group> 
	        <div v-show="!isShowOrderDetail" class="checkbtn"><span @click=" isShowOrderDetail = true; ">查看订单详情<img
                    src="../../assets/images/icon_more_down.png"/></span></div>
	        <!-- 满足条件显示，地图和联系电话 -->
	        <div v-show="!isShowOrderDetail"> 
	        	上传资料
	          <van-cell class="mart10">
              入库单
              <div class="mar5">
                <img 
                  style=" display: inline-block; margin-right: 5px;"
                  v-for="(item, index) in JSON.parse(selectOrder.order_rating.warehouse_receipt_images)"
                  @click="checkBigImg([item])"
                  :src="item"
                  width="80px"
                  height="80px"/> 
              </div>
            </van-cell>
            <van-cell class="mart10">
              货物入库照片
              <div class="mar5">
                <img
                  style=" display: inline-block; margin-right: 5px;"
                  v-for="(item, index) in JSON.parse(selectOrder.order_rating.warehouse_cargo_images)"
                  :src="item"
                  width="80px"
                  height="80px"
                  @click="checkBigImg([item])"/>  
              </div>
            </van-cell>  
	        </div>
	        <!-- 满足条件显示订单详情 -->
	        <div class="order-detail-box" v-show="isShowOrderDetail"> 
	          <h5 class="mar5">车源信息</h5>
			      <van-cell-group class="pad5">
			        <p class="">司机名字 {{selectOrder.vehicle_owner.name}} {{selectOrder.vehicle_owner.cellphone}}
			        </p>
			        <p>
		            <span class="width50"><b>车牌号</b>{{selectOrder.vehicle.plate_number}}</span>
		            <span class="width50"><b>车辆品牌</b>{{selectOrder.vehicle.brand}}</span>
			        </p>
			        <p>
		            <span class="width50"><b>车辆类型</b>{{selectOrder.vehicle.type}}</span>
		            <span class="width50"><b>车辆长度</b>{{selectOrder.vehicle.length}}m³</span>
			        </p>
			        <p>
		            <span class="width50"><b>车辆载重</b>{{selectOrder.vehicle.load}}</span>
		            <span class="width50"><b>装货体积</b>{{selectOrder.vehicle.volume}}m³</span>
			        </p>
			      </van-cell-group> 
			      <h5 class="mar5">我的货源</h5>
			      <van-cell-group class="pad5">
			        <p>
			          {{selectOrder.order_time}} <span style="background: #2391e2; border-radius: 2px; color: #fff; font-size: 12px; padding: 0 2px;">{{selectOrder.type == 1 ? '整车' : '拼车'}}</span>
			        </p>
			        <p>
			           {{selectOrder.cargo_area}} - {{selectOrder.consignee_area}}
			        </p> 
			      </van-cell-group>
			      <van-cell-group class="pad5">
			        <p>
			            <span class="width50"><b>货物类型</b>{{selectOrder.cargo_type}}</span>
			            <span class="width50"><b>货物重量</b>{{selectOrder.cargo_weight}}{{selectOrder.freight_unit}}</span>
			        </p>
			        <p>
			            <span class="width50"><b>货物件数</b>{{selectOrder.cargo_num}}</span>
			            <span class="width50"><b>货物体积</b>{{selectOrder.cargo_volume}}m³</span>
			        </p>
			        <p> 
			        </p>
			      </van-cell-group>
			      <div class="checkbtn mart10" style="text-align: left;" >
			      	<span @click=" orderDetailSmall = true; ">查看我的货源详情</span> 
			     	</div>
	        </div>

	        <div v-show="isShowOrderDetail" class="checkbtn checkbtn-bottom">
	        	<span @click=" isShowOrderDetail = false; ">收起订单详情
	        		<img src="../../assets/images/icon_more_up.png"/>
	        	</span>
	        </div>
	      </div>
      </div>
		</van-popup>
		<!-- 货源详情 -->
    <van-popup v-model="orderDetailSmall" position="right" :overlay="true" class="set-popup">
  		<van-nav-bar
          title="货源详情"
          left-text=""
          left-arrow
          @click-left=" orderDetailSmall = false "
        />
      <div v-if="selectOrder" class="order-info mar5">
				<h5 class="mar5">配送类型&nbsp;&nbsp;&nbsp;&nbsp;{{selectOrder.type == 1 ? '整车' : '拼车'}}</h5>
		    <van-cell-group class="pad5">
		      <p class="color-black marl15">{{selectOrder.cargo_owner_name}} <span class="marl10">{{selectOrder.cargo_owner_cellphone}}</span>
		      </p>
		      <p><i class="round"></i>{{selectOrder.cargo_city}}</p>
		      <p class="marl15">{{selectOrder.cargo_address}}</p>
		    </van-cell-group>
		    <van-cell-group class="pad5">
		      <p class="color-black marl15">{{selectOrder.consignee}} <span class="marl10">{{selectOrder.consignee_cellphone}}</span>
		      </p>
		      <p><i class="round red"></i>{{selectOrder.consignee_city}}</p>
		      <p class="marl15">{{selectOrder.consignee_address}}</p>
		    </van-cell-group>
		    <van-cell-group class="pad5">
		      <p>
		          <span class="width50"><b>货物类型</b>{{selectOrder.cargo_type}}</span>
		          <span class="width50"><b>货物重量</b>{{selectOrder.cargo_weight}}{{selectOrder.freight_unit}}</span>
		      </p>
		      <p>
		          <span class="width50"><b>货物件数</b>{{selectOrder.cargo_num}}</span>
		          <span class="width50"><b>货物体积</b>{{selectOrder.cargo_volume}}m³</span>
		      </p>
		      <p>
			    <span class="width50">
			      <b>期望运价</b>
			      <span class="colore08d3e">{{selectOrder.freight}}/{{selectOrder.freight_unit}}</span>
			    </span>
		      </p>
		    </van-cell-group>
		    <van-cell-group class="pad5">
		        <p>
		            <span class="width50"><b>车辆类型</b>{{selectOrder.vehicle_type}}</span>
		            <span class="width50"><b>车辆长度</b>{{selectOrder.vehicle_length}}米</span>
		        </p>
		    </van-cell-group>
		    <van-cell-group class="pad5">
		        <p><b>支付方式</b>{{selectOrder.payer == 1 ? '发货人' : '收货人'}}付款</p>
		    </van-cell-group>
		    <van-cell-group class="pad5">
		        <p><b>货主备注</b>{{selectOrder.status_note}}</p>
		    </van-cell-group>
		    <van-cell-group class="pad5">
		      <img 
		        style="margin-right: 5px;"
		        v-if="selectOrder.cargo_images"
		        v-for="itemImg in JSON.parse(selectOrder.cargo_images)"
		        :src="itemImg"
		        @click="checkBigImg([itemImg])"
		        width="80px"
		        height="80px"/>
		    </van-cell-group>
		  </div>
    </van-popup>
		<div v-show="isLoadingAll" class="fullScreen-loding"><van-loading type="spinner"/></div>
  </div>
</template>

<script>
	// ImagePreview和其他组件不同，不是通过HTML结构的方式来使用，而是通过函数调用的方式。使用前需要先引入它。
	import { ImagePreview } from 'vant';
	export default {
		data(){
			return{
				isFirstVisit: true, // true为第一次访问，需要添加一个等待效果，false则不需要
        isLoadingAll: false,
				userData: JSON.parse(this.getCookie('userData')), 
				isLoading:  				 false,
				showCarMenu: 				 false,
				showDateMenu: 			 false,
				infoShow: 					 false,
				selectOrder: 		     false,
				isShowOrderDetail:   false,
				orderDetailSmall:    false,
				carModelActiveName:  '全部', //货车类型被选中的名称
				dateModelActiveName: '最近三个月订单', //日期类型被选中的名称
				carModelData: [],
				dateModelData:[],
				dataList: 					 [],  //列表数据
				listPrompt: 				 '点击或者上拉加载更多', //提示
				searchParams: {
					time_option: 'last_three_month', //时间选择 传time_options 里面的name字段 默认为最近3个月
					type: 0,				//1整车, 2拼车
					with_consignee: 1,  // 0 我发的，我收的， 1我发的/我送的， 2 我收的
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
				// ---------------- 用户类型为车主时，查询状态变为1 否则为 2
				this.userData.type == 1 ? this.searchParams.with_consignee = 1 : this.searchParams.with_consignee = 1;

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
			/*
			 * 显示订单详情
			 */
			showOrderInfo(item){
				this.infoShow = true; 
				this._getQueryOrderInfo(item)
			},
			_getQueryOrderInfo(item){
				this.isLoadingAll = true;
				this.selectOrder = null;
				this.axios.get(`${this.commonJs.basePath}/v1/order/get`, {params: {id: item.id}}).then( (response) => {
	  			this.selectOrder = response.data.data; 
	  			this.isLoadingAll = false;
	  		}).catch( (error) => {
	  			this.$toast(error)
	  			this.isLoadingAll = false;
	  		}); 
			},
			/*
			 * 查看大图
			 */
			checkBigImg(imgArray){ 
				ImagePreview({images: imgArray, showIndex: false});
			}
		},
		mounted(){
			this.getQueryList();
		},
	};
</script>

<style>

</style>
