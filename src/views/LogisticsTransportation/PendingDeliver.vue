<!-- 
	物流运输---进行中
 -->
<template>
  <div class="pendingOrder">
		<!-- 导航栏 -->
		<van-nav-bar
			title="进行中"
			left-text=""
			left-arrow
			@click-left="onClickLeft"
			fixed
		/>
		<!-- 选择分类 -->
		<van-tabbar style="top: 45px;">
			<van-tabbar-item icon="" @click="showPopup = true; popupType = 'cargo' ">{{cargo_area_name}}<span class="select-arrow"></span></van-tabbar-item>
			<van-tabbar-item icon="" @click="showPopup = true; popupType = 'consignee' ">{{consignee_area_name}}<span class="select-arrow"></span></van-tabbar-item>
			<van-tabbar-item icon="" @click="showPopup = true; popupType = 'status' ">{{status_name}}<span class="select-arrow"></span></van-tabbar-item>
		</van-tabbar>
		<!-- 列表 -->
		<van-pull-refresh v-model="isLoading" @refresh="onRefresh" class="mart96"> 
			<div class="car-content">
				<ul @click="showOrderInfo(item)" class="car-list car-list-bt5" v-for="item in dataList">
					<li>
						<p class="fl">{{item.order_time}}</p>
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
							class="fr">
							<span class="fr" >{{item.status_desc}}</span> 
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
		<!-- 底部弹出层 -->
		<van-popup v-model="showPopup" position="bottom">
			<!-- 出发地 -->
			<van-picker
				v-if="popupType == 'cargo'"
				show-toolbar
				title="选择地址"
				:columns="area_list"
				@cancel="showAddress = false"
				@confirm="((val, index) => {onConfirmAddress(val,index, 'cargo_area_name', 'cargo_area_code')})"
				@change="onChangeArea"
				value-key="name"
			/>
			<!-- 收货地 -->
			<van-picker
				v-if="popupType == 'consignee'"
				show-toolbar
				title="选择地址"
				:columns="area_list"
				@cancel="showPopup = false"
				@confirm="((val, index) => {onConfirmAddress(val,index, 'consignee_area_name', 'consignee_area_code')})"
				@change="onChangeArea"
				value-key="name"
			/>
			<!-- 订单状态 -->
			<van-picker
				v-if="popupType == 'status'"
				show-toolbar  
				value-key="desc"
				:columns="orderStaus"
				@cancel="showPopup = false"
				@confirm="onConfirmDate"
				@change=""
			/>
		</van-popup> 
		<!-- 订单详情 -->
    <van-popup v-model="infoShow" position="right" :overlay="true" class="set-popup pending-deliver-detail">
        <van-nav-bar
          title="订单详情"
          left-text=""
          left-arrow
          @click-left=" infoShow = false "
        />
        <div v-if="selectOrder" class="order-info mar5">
            <van-cell-group class="pad5">
                <p>{{selectOrder.status_desc}}</p>
                <p>订单编号{{selectOrder.id}}</p>
            </van-cell-group>
            <div v-show="!isShowOrderDetail" class="checkbtn"><span @click=" isShowOrderDetail = true; ">查看订单详情<img
                    src="../../assets/images/icon_more_down.png"/></span></div>

            <!-- 满足条件显示，地图和联系电话 -->
            <div v-show="!isShowOrderDetail">
              <div id="allmap" :class="selectOrder.status != 7 ? 'class1' : 'class2'"></div>
              <van-cell-group class="pad5">
                <p>
                  <span class="width50"><b>司机名字</b>{{selectOrder.vehicle_owner.name}}</span>
                  <span class="width50 phone">
      						<a v-if="selectOrder.cargo_owner_cellphone"
                         :href="`sms:${selectOrder.vehicle_owner.cellphone}`"><van-icon
                              name="pending-evaluate"/></a>
      						<a v-if="selectOrder.cargo_owner_cellphone"
                         :href="`tel:${selectOrder.vehicle_owner.cellphone}`"><van-icon name="phone"/></a>
    							</span>
                </p>
                <!-- 待装货 -->
                <van-button v-show="selectOrder.status == 7" class="mart15" size="large" type="primary" @click="shipment">确认出货</van-button>
              </van-cell-group>  
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
				      	<span @click=" orderDetailSmall = true; ">查看我的货源</span> 
				     	</div>
            </div>

            <div v-show="isShowOrderDetail" class="checkbtn checkbtn-bottom"><span
                    @click=" isShowOrderDetail = false; ">收起订单详情<img
                    src="../../assets/images/icon_more_up.png"/></span></div>
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
	export default {
		data() {
			return {
				orderDetailSmall: false,
				infoShow:     false,
				isFirstVisit: true, // true为第一次访问，需要添加一个等待效果，false则不需要
				isShowOrderDetail: false, //订单详情
        isLoadingAll: false,
				isLoading:  				 false,
				showPopup: 					 false,
				popupType:           'cargo', //cargo为出发地数据，consignee为收货地数据，status为订单状态数据
				cargo_area_name: 		 '出发地',
				consignee_area_name: '收货地',
				status_name:         '订单状态', 
				orderStaus: 				 [],
				area_list:   				 [ { values:[] }, { values:[] }, { values:[] } ],
				dataList: 					 [],  //列表数据
				listPrompt: 				 '点击或者上拉加载更多', //提示
				selectOrder: 				 null,
				searchParams: {
					cargo_area_code:  	 '', //货物省市区代码
					consignee_area_code: '', //收货省市区代码
					with_consignee: 		 '', //0 我发的，我收的， 1我发的， 2 我收的
					status: 						 '', //订单状态， status_option中的name值
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
	    	
	    	this.axios.get(`${this.commonJs.basePath}/v1/users/order/process-list`, {params: this.searchParams}).then( (response) => {
	  			this.dataList = this.dataList.concat(response.data.data.data.data);

	  			this.listPrompt = '点击或者上拉加载更多';
	  			// ----- 列表原来有数据，但再次查询出来的没有数据，执行以下语句
	  			if(this.dataList.length && !response.data.data.data.data.length) this.listPrompt = '没有更多啦';
	  			this.orderStaus = response.data.data.status_options;
	  			this.isLoadingAll = false;
	  		}).catch( (error) => {
	  			this.$toast(error)
	  			this.isLoadingAll = false;
	  		});
	     }, 
			/* 
			 *下拉刷新重新加载数据
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
				this.status_name = item.desc;
				this.showPopup = false;
				this.isFirstVisit = true;
				this._dataReset(); 
			},
			/* 
			省市区选项改变时触发
			*/
			onChangeArea(picker,value,index) { 
				if(index === 0){
					this.axios.get(`${this.commonJs.basePath}/v1/area/children`,{params: {parent_area_code:value[0].code ,scope: 1}}).then( (response) => {
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
					}).catch( (error) => {}); 
					// 重查二级时，清空三级数据
					picker.setColumnValues(2,[])
				}
				if(index === 1){
					this.axios.get(`${this.commonJs.basePath}/v1/area/children`,
						{params: {parent_area_code:value[0].code,scope:'2',city_code:value[1].code}}).then( (response) => {
						if(response.data.errcode === 0){
							var arr = [];
							if(JSON.stringify(response.data.data)=='[]'){
								arr = response.data.data;
							}else{
								arr = response.data.data;
								arr.unshift({code:'',name:"全部",})
							}
							picker.setColumnValues(2,arr)// 重设市的选项
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
						// --------------------- 默认添加一个全部对象 ----------------
						response.data.data.splice(0, 0, {name:'全部' , city_code: -1, code: -1, district_code: -1, id: -1, province_code:-1});
						this.area_list[0].values = response.data.data; 
					}else{
						this.$toast.fail(response.data.message);  
					}
				}).catch( (error) => {
					//this.$toast.fail(error); 
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
				选择并确认出发地与收货地地址
			*/
			onConfirmAddress(value,index, textKeyName, codeKeyName){
				// 将数据数组倒序，用来判断最后一层是否有数据
				let valueReverseData = value.reverse();
				
				// 由于forEach不能使用break退出循环，所以只能用try catch来抛出异常
				try{
					valueReverseData.forEach((item,index) => {
						if(item){
							if(item.name == '全部'){ //当前层，选中的是全部，那么就取上一层的数据
								if(index == valueReverseData.length -1){ //第一级
									this.searchParams[codeKeyName] = '';
									this[textKeyName] = textKeyName == 'cargo_area_name' ? '出发地' : '收货地';
								}else{
									this.searchParams[codeKeyName] = valueReverseData[index + 1].code;
									this[textKeyName] = valueReverseData[index + 1].name;
								}
								
							}else{
								this.searchParams[codeKeyName] = item.code;
								this[textKeyName] = item.name;
							}
							throw new Error('break');
						}
					})
				}catch(e){} 
				 
				this._dataReset();
				this.showPopup = false;
				this.isFirstVisit = true;
			},
			/*
       * 显示订单详情
       */
      showOrderInfo(item) {
        // ----状态为2，跳转支付页面
         
        this.infoShow = true;
        this._getQueryOrderInfo(item);
        // this.phoneForm.order_id = item.id;
         
          
      },
      _getQueryOrderInfo(item) {
          this.axios.get(`${this.commonJs.basePath}/v1/order/get`, {params: {id: item.id}}).then(
              (response) => {
                  this.selectOrder = response.data.data;
                  // ---------------------- 获取地图信息 --------------------
                  this.$nextTick(() => {
                  	
                      this._startEndAddress(response.data.data.cargo_area_code, response.data.data.consignee_area_code);
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
       * 获取起始地址
       */
      _startEndAddress(startCode, endCode) {
        let start, end;
        // -------------- 一次调用获取开始地址 -------------------
        this._getQueryAreaCodeDetailByCode(startCode).then((response) => {
            start = response.data.province_code_name;
            // -------------- 二次调用获取结束地址 -------------------
            this._getQueryAreaCodeDetailByCode(endCode).then((response2) => {
                end = response2.data.province_code_name;
                // ----- 调用地图 -----
                this.showMap(start, end);
            }).catch((error) => {
                this.$toast(error)
            });

        }).catch((error) => {
            this.$toast(error)
        });
      },
      /*
       * 显示地图
       */
      showMap(start, end) { 
        // 百度地图API功能
        var map = new BMap.Map("allmap");
        map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);

        var transit = new BMap.DrivingRoute(map, {
            renderOptions: {
                map: map,
                enableDragging: true //起终点可进行拖拽
            },
        });
        transit.search(start, end);
      },
      /*
       * 确认出货
       */
      shipment(){
      	this.$dialog.confirm({
				  title: '',
				  confirmButtonText: '是',
				  cancelButtonText:  '否',
				  message: '是否需要购买保险',
				  className: 'dialog-confirm'
				}).then(() => { 
				  // this.$router.push({name: 'buyInsurance', params: {id: this.selectOrder.id}});
					// this.$router.push({name: 'wxPayPage', params: {id: "1-"+this.selectOrder.id}});
					window.location.href = window.location.origin + "/#/pay/1-"+this.selectOrder.id;
				}).catch(() => {
				  this._comfirmLoaded();
				});
      }, 
      /*
       * 确认装货, 不购买保险,
       */
      _comfirmLoaded(){ 
      	this.axios.post(`${this.commonJs.basePath}/v1/order/comfirm-loaded`, {id: this.selectOrder.id}).then((response) => {
          this.$toast('出货成功');
          this.infoShow = false;
          this.isFirstVisit = true;
          this._dataReset();
        }).catch((error) => {
          this.$toast(error);
          this.infoShow = false;
        });
      }
		},
		mounted(){
			this.getQueryList();
			this.getOneAreaList();
			
		},
	};
</script>

<style>
	.pending-deliver-detail #allmap.class1{
    height: calc(100vh - 3.4rem)!important;
	}
	.pending-deliver-detail #allmap.class2{
    height: calc(100vh - 4.5rem)!important;
	}
	.dialog-confirm{
		text-align: center;
	}
</style>
