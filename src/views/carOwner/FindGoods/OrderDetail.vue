<!--
	找货-订单详情
 -->

<template>
  <div class="orderDetail">
		<div id="allmap"></div>
		<!-- 订单详情 -->
		<div class="order-detail" v-if="myOrederDetail">
			<!-- 上半部分 -->
			<div class="order-detail-top">
				<!-- 导航栏 -->
				<van-nav-bar
					title="订单详情"
					left-arrow @click-left="$router.back(-1)"
					fixed>
				</van-nav-bar>
				<!-- <div class="detail-box"> -->
				<!-- <div style="height: 56px;"></div> -->
				<!-- 状态与订单编号 -->
				<ul class="plate state-number">
					<li class="f-c-b">{{myOrederDetail.status_desc}}</li>
					<li class="f-s13">{{'订单编号 '+myOrederDetail.id}}</li>
				</ul>
				<!-- 详情 -->
				<div class="detail-content" v-if="isShowDetailInfo">
					<h4 class="detailItem-title">我的路线</h4>
					<ul class="plate route">
						<li class="fl left-route-content">
							<p class="address">{{myOrederDetail.cargo_city+' - '+myOrederDetail.consignee_city}}</p>
							<p class="price">期望运价<span>1.0</span>车 约<span>{{myOrederDetail.freight}}</span>{{"元/"+myOrederDetail.freight_unit}}</p>
						</li>
					</ul>

					<h4 class="detailItem-title">货源信息</h4>
					<div class="plate">
						<van-cell-group>
							<ul class="receive-send">
								<li class="fl receive-send-icon_"></li>
								<li class="fl receive-send-info_">
									<p>{{myOrederDetail.consignee+" "+(myOrederDetail.cargo_owner_cellphone?myOrederDetail.cargo_owner_cellphone:'')}}</p>
									<p class="info-text-color">{{myOrederDetail.cargo_area}}</p>
									<p class="info-text-color">{{myOrederDetail.cargo_address}}</p>
								</li>
							</ul>
						</van-cell-group>
						<van-cell-group>
							<ul class="receive-send">
								<li class="fl receive-send-icons_"></li>
								<li class="fl receive-send-info_">
									<p>{{myOrederDetail.cargo_owner_name+" "+(myOrederDetail.consignee_cellphone?myOrederDetail.consignee_cellphone:'')}}</p>
									<p class="info-text-color">{{myOrederDetail.consignee_area}}</p>
									<p class="info-text-color">{{myOrederDetail.consignee_address}}</p>
								</li>
							</ul>
						</van-cell-group>
						<van-cell-group>
							<ul class="rows">
								<li class="columns fl half-width">货物类型<span class="text-info">{{myOrederDetail.cargo_type}}</span></li>
								<li class="columns fl half-width">货物重量
									<span class="text-info" v-if='myOrederDetail.cargo_weight_max=="0"&&myOrederDetail.cargo_weight_min=="0"'>{{myOrederDetail.cargo_weight+"吨"}}</span>
									<span class="text-info" v-else>{{myOrederDetail.cargo_weight_max+"~"+myOrederDetail.cargo_weight_min+"吨"}}</span>
								</li>
								<li class="columns fl half-width">货物件数<span class="text-info">{{myOrederDetail.cargo_num+"件"}}</span></li>
								<li class="columns fl half-width">货物体积<span class="text-info">{{myOrederDetail.cargo_volume+"m³"}}</span></li>
								<li class="columns fl half-width">货物运价<span class="text-info text-info-color">{{myOrederDetail.freight+"元/"+myOrederDetail.freight_unit}}</span></li>
							</ul>
						</van-cell-group>
						<van-cell-group>
							<ul class="rows">
								<li class="columns fl half-width">车辆类型<span class="text-info">{{myOrederDetail.vehicle_type}}</span></li>
								<li class="columns fl half-width">车辆长度<span class="text-info">{{myOrederDetail.vehicle_length=="不限"?myOrederDetail.vehicle_length:myOrederDetail.vehicle_length+"米"}}</span></li>
							</ul>
						</van-cell-group>
						<van-cell-group>
							<ul class="rows">
								<li class="columns fl">支付方式
									<span class="text-info" v-if="myOrederDetail.payer==1">发货人支付</span>
									<span class="text-info" v-else>收货人支付</span>
								</li>
							</ul>
						</van-cell-group>
						<van-cell-group>
							<ul class="rows">
								<li class="columns fl" v-if="myOrederDetail.cargo_images!=''">
									<span class="fl">货物照片</span>
									<img class="text-info img-info fl" v-if="myOrederDetail.cargo_images!='[]'" v-for="item in JSON.parse(myOrederDetail.cargo_images)" :src="item" alt="" @click="seePic(item)">
									<span class="text-info fl" v-if="myOrederDetail.cargo_images=='[]'">暂无</span>
								</li>
								<li class="columns fl" v-if="myOrederDetail.cargo_images==''">
									<span class="fl">货物照片</span>
									<span class="text-info fl">暂无</span>
								</li>
							</ul>
						</van-cell-group>
						<van-cell-group>
							<ul class="rows">
								<li class="columns fl">货主备注<span class="text-info">{{myOrederDetail.note}}</span></li>
							</ul>
						</van-cell-group>
					</div>
				</div>
				<!-- 按钮 -->
				<p class="view-order-details" @click="see" v-if="isShowSee">
					查看订单详情
					<span class="select-arrow"></span>
				</p>
				<p class="view-order-details" @click="pack" v-if="isShowPack">
					收起订单详情
					<span class="select-arrow-up"></span>
				</p>
				<!-- </div> -->
			</div>
			<!-- 一键导航 -->
			<!-- <div class="i-Call">
				<van-button size="small" type="primary" @click="">一键导航</van-button>
			</div> -->
			<!-- 下半部分 -->
			<div class="order-detail-bottom">
				<!-- 信息 -->
				<ul class="plate info">
					<li>
						<span class="fl">发单人姓名</span>
						<span class="fl f-c-b marl10">{{myOrederDetail.publish_user_name}}</span>
						<p class="fr"><a :href="'tel:'+myOrederDetail.publish_user_cellphone"><van-icon name="phone"/></a></p>
						<p class="fr marr20"><a :href="'sms:'+myOrederDetail.publish_user_cellphone"><van-icon name="other-pay"/></a></p>
					</li>
					<li>
						<span class="fl">发货人姓名</span>
						<span class="fl f-c-b marl10">{{myOrederDetail.cargo_owner_name}}</span>
						<p class="fr"><a :href="'tel:'+myOrederDetail.cargo_owner_cellphone"><van-icon name="phone"/></a></p>
						<p class="fr marr20"><a :href="'sms:'+myOrederDetail.cargo_owner_cellphone"><van-icon name="other-pay"/></a></p>
					</li>
					<li>
						<span class="fl">收货人姓名</span>
						<span class="fl f-c-b marl10">{{myOrederDetail.consignee}}</span>
						<p class="fr"><a :href="'tel:'+myOrederDetail.consignee_cellphone"><van-icon name="phone"/></a></p>
					</li>
				</ul>
				<!-- 按钮 -->
				<div class="order-btn">
					<van-button v-if="myOrederDetail.status_desc=='运输中'" size="large" type="primary" @click="deliverOrderShow  = true">交 付 订 单</van-button>
					<van-button v-if="myOrederDetail.status_desc=='待装货'" size="large" type="primary" @click="comfirmTransit">确 认 装 货</van-button>
				</div>
			</div>
		</div>
		<!-- 提交订单 -->
		<van-popup v-model="deliverOrderShow" position="right" :overlay="true" class="set-popup">
			<van-nav-bar
				title="订单详情"
				left-text=""
				left-arrow
				@click-left=" deliverOrderShow = false "
			/>
			<div class="order-info mar5">
				<van-cell-group>
					<van-field
						v-model="deliverOrderForm.verify_code"
						center
						clearable
						placeholder="交易码"
					>
						<van-button slot="button" size="small" type="primary" @click="obtainValidateCard">获取</van-button>
					</van-field>
				</van-cell-group>
				<p class="mar5">交易码已由平台发送至收货人，请联系收货人索取，如果收货人未收到交易码请点击再次获取或联系客服</p>
				<van-cell class="mart10">
					上传入库单（必传）
					<div class="mar5">
						<img 
              style=" display: inline-block; margin-right: 5px;"
              v-for="(item, index) in deliverOrderForm.warehouse_receipt_images"
              :src="item"
              width="80px"
              height="80px"/>
            <van-uploader
                :after-read="((val) => {onFileUpload (val, 'warehouse_receipt_images')})">
                <van-icon name="photograph"/>
            </van-uploader> 
					</div>
				</van-cell>
				<van-cell class="mart10">
					上传货物入库照片（必传）
					<div class="mar5">
						<img
              style=" display: inline-block; margin-right: 5px;"
              v-for="(item, index) in deliverOrderForm.warehouse_cargo_images"
              :src="item"
              width="80px"
              height="80px"/> 
            <van-uploader
                    :after-read="((val) => {onFileUpload (val, 'warehouse_cargo_images')})"> 
                <van-icon name="photograph"/>
            </van-uploader>
					</div>
				</van-cell>
				<van-cell-group class="mart10 pad5">
					<p class="">货主评价</p>
					<p><b>装货速度</b>
						<van-rate v-model="deliverOrderForm.load_speed_star"/>
					</p>
					<p><b>装货速度</b>
						<van-rate v-model="deliverOrderForm.cargo_owner_attitude_star"/>
					</p>
				</van-cell-group>
				<van-cell-group>
					<van-field v-model="deliverOrderForm.comment" type="textarea" placeholder="说两句..."/>
				</van-cell-group>
				<van-button class="mart15" size="large" type="primary" @click="saveDeliverOrderForm">确认订单</van-button>
			</div>
		</van-popup>
		<!-- 查看照片 -->
		<van-popup v-model="showPic" style="width: 80%;"><img :src="imageItem" alt="" width="100%"></van-popup>
		<div v-show="loading" class="fullScreen-loding"><van-loading type="spinner"/></div>
	</div>
</template>

<script>
	export default {
		data(){
			return{
				showPic:false,//是否查看
				imageItem:null,//图片
				loading:false,//是否处于加载状态
				index:this.$route.params.index,
				isShowDetailInfo:false,
				isShowSee:true,
				isShowPack:false,
				myOrederDetail:null,//我的接单详情
				appId:'wxda24e6b9d1edd41b',
				nonceStr:null,
				prepayId:null,
				payKay:null,
				deliverOrderShow: false, //交付订单弹框属性
				deliverOrderForm: {     //交付订单表单
					verify_code: null,//验证码, 验证码类型为comfirm_rate
					order_id: null,//订单ID
					vehicle_owner_id: null,//接单车主ID
					warehouse_receipt_images: [],//入库单相片 json 数组 [src1, src2]
					warehouse_cargo_images: [],//货物入库相片 json 数组 [src1, src2]
					load_speed_star: null,//装货速度， 选 1 2 3 4 5
					cargo_owner_attitude_star: null,//货主态度 选 1 2 3 4 5
					comment: null, //点评
				},
				phoneForm: {   //获取手机验证码
						cellphone: null,
						use_type: 'comfirm_rate',
						verify_code: null,
						order_id: null
				},
			};
		},
		mounted() {
			this.getMyOrderDetail();
			this.$nextTick(()=>{
				this.showMap();
			})

		},
		methods:{
			
			/* 
			查看货物图片
			*/
			seePic(img){
				this.showPic = true;
				this.imageItem = img;
			},

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
	
			/* 查看与收起详情 */
			see(){
				this.isShowDetailInfo = true;
				this.isShowSee = false;
				this.isShowPack = true;
			},
			pack(){
				this.isShowDetailInfo = false;
				this.isShowSee = true;
				this.isShowPack = false;
			},

			/*
				获取我的接单详情
			*/
			getMyOrderDetail(){
				this.loading = true;
				this.axios.get(`${this.commonJs.basePath}/v1/order/get`,this._myOrderDetailParams()).then( (response) => {
					this.myOrederDetail = response.data.data;
					/* if(this.myOrederDetail.status_desc=='待支付'){
						// this.$router.push({name:'wxPayPage',params:{id:"0-"+this.myOrederDetail.id,}})
						window.location.href = window.location.origin + "/#/pay/0-"+this.myOrederDetail.id;
					} */
					// ---------------------- 获取地图信息 --------------------
					this.$nextTick(() => {
							this._startEndAddress(response.data.data.cargo_area_code, response.data.data.consignee_area_code);
					});
					this.loading = false;
				}).catch( (error) => {
					this.$toast(error);
					this.loading = false;
				});
			},
			_myOrderDetailParams(){
				return {
					params: {
						id:this.$route.params.id,
					}
				}
			},

			/*
			 交付订单
			 */
			orderPay(){
				this.$router.push({name:'wxPayPage',params:{id:this.myOrederDetail.id,}})
			},
			
			/* 
			 车主--确认出货
			 */
			comfirmTransit(){
				this.axios.post(`${this.commonJs.basePath}/v1/order/comfirm-transit`,{id:this.myOrederDetail.id}).then( (response) => {
					this.$toast(response.data.message);
					this.getMyOrderDetail();
				}).catch( (error) => {
					this.$toast(error);
				});
			},
			
			/*
			* 发送短信获取验证码
			*/
			obtainValidateCard() {
				this.phoneForm.order_id = this.myOrederDetail.id;
				this.phoneForm.cellphone = this.myOrederDetail.consignee_cellphone;
				this.axios.get(`${this.commonJs.basePath}/v1/verify-code/get`, {params: this.phoneForm}).then(
					(response) => {
					this.$toast('获取成功')
						// console.debug(JSON.stringify(this.myOrederDetail))
				}).catch((error) => {
					this.$toast(error)
				});
			},
		
			/*
			 * 附件上传，
			 * @params {object} 附件
			 * @params {string} keyName 保存在数据库的key
			 */
			onFileUpload(val, keyName) {
				this._fileUpload(val, keyName);
			},
			_fileUpload(val, keyName) {
				this.isLoadingAll = true;
				let param = new FormData(); //创建form对象

				param.append('file', val.file, val.file.name)
				let config = {
						headers: {'Content-Type': 'multipart/form-data'}
				};

				this.axios.get(`${this.commonJs.basePath}/v1/file/token/get`, {params: {file: val.file}}).then((response) => {
						param.append('token', response.data.data.uptoken);

						this._fileQiniu(param, config, keyName, response.data.data.base_url);
				}).catch((error) => {
						this.$toast(error);
				});

				// this.axios.get(`${this.commonJs.basePath}/v1/file/token/get`, {params: {file: val.file}}).then((response) => {
				//  this.deliverOrderForm[keyName] = response.data.data.base_url;
				// }).catch((error) => {
				//    this.$toast(error);
				// })
			},
			/*
			 * 通过七牛技术上传附件
			 * @params {object} param 附件参数
			 * @params {object} config 请求头
			 * @params {string} keyName 字段名
			 * @params {string} base_url 附件地址头
			 */
			_fileQiniu(param, config, keyName, base_url) {
				this.axios.post(`${this.commonJs.filePath}`, param, config).then((response) => {
					this.deliverOrderForm[keyName].push(`${base_url}${response.data.key}`);
					this.isLoadingAll = false;
				}).catch((error) => {
					this.$toast(error);
					this.isLoadingAll = false;
				})
			},
			
			/*
			 * 提交交付订单
			 */
			saveDeliverOrderForm() { 

				this.axios.post(`${this.commonJs.basePath}/v1/order/rate`, this._deliverOrderParams()).then((response) => {
					this.$toast('提交成功,一秒后跳转到我的页面');
					setTimeout(() => {
						this.$router.push({'path': '/my'})
					}, 1000)
				}).catch((error) => {
					this.$toast(error);
				})
			},
			_deliverOrderParams(){
        return {
          vehicle_owner_id: this.myOrederDetail.vehicle_owner_id,
          order_id: this.myOrederDetail.id,
          warehouse_cargo_images: JSON.stringify(this.deliverOrderForm.warehouse_cargo_images),
          warehouse_receipt_images:JSON.stringify(this.deliverOrderForm.warehouse_receipt_images),
          verify_code: this.deliverOrderForm.verify_code,
          load_speed_star: this.deliverOrderForm.load_speed_star,
          cargo_owner_attitude_star: this.deliverOrderForm.cargo_owner_attitude_star,
          comment: this.deliverOrderForm.comment,
        } 
      },
		}
	};
</script>

<style lang="less" scoped>
	#allmap{
		height: calc(~'100vh - 0rem');
		width: 100vw;
	}
	/*
	收发信息style
	*/
	.receive-send{
		width: 100%;
		overflow: hidden;
		border-bottom: 1px solid #f7f7f7;
	}
	.receive-send .receive-send-icon_{
		width: 12px;
		height: 12px;
		border: 4px solid #2bcb84;
		border-radius: 50%;
		box-sizing: border-box;
		margin:8% 16px;
	}
	.receive-send .receive-send-icons_{
		width: 12px;
		height: 12px;
		border: 4px solid #f44;
		border-radius: 50%;
		box-sizing: border-box;
		margin:8% 16px;
	}
	.receive-send .receive-send-info_{
		font-size: 13px;
		width: 80%;
		margin: 4px 0;
	}
	.receive-send .receive-send-info_ p{
		padding: 2px 0;
		overflow: hidden;
	}
	.receive-send .receive-send-info_ .info-text-color{
		color: #999999;
	}
	/* 订单详情的style */
	.order-detail{
		overflow: hidden;
		.plate{
			width: 95%;
			overflow: hidden;
			margin: 0 auto;
			border-radius: 5px;
			background: #fff;
			margin-bottom: 10px;
			padding: 8px;
			box-sizing: border-box;
			color: #999;
		}
		.f-c-b{
			color: #222222;
		}
		.f-s13{
			font-size: 13px;
		}
	}
	/* 一键导航 */
	.i-Call{
		position: fixed;
    right: 5%;
    top: 60%;
    z-index: 99;
		button{
			border-radius: 5px;
		}
	}
	/* 上半部分 */
	.order-detail-top{
		position: fixed;
		top: 0;
		width: 100%;
		overflow: hidden;
		z-index: 100;
		background: #F7F7F7;
		.detail-box{
			overflow-y: scroll;
			height: 100vh;
		}
		.state-number{
			margin-top: 56px;
			li{
				padding: 4px 0;
				overflow: hidden;
			}
		}
		.view-order-details{
			text-align: center;
			width: 100%;
			color: #2391e2;
			padding: 0 0 10px 0;
			.select-arrow{
				border-right-color: #2391e2;
				border-bottom-color: #2391e2;
				width: 8px;
				height: 8px;
			}
			.select-arrow-up{
				width: 8px;
				height: 8px;
				display: inline-block;
				transform: rotate(45deg);
				border: 0.02rem solid transparent;
				border-top-color: #2391e2;
				border-left-color: #2391e2;
				margin-left: 0.1rem;
				margin-bottom: -2px;
			}
		}
		.detail-content{
			overflow: auto;
			height: 72vh;
			.detailItem-title{
				color: #2391e2;
				padding: 0px 0 5px 5%;
				text-align: left;
				font-size: 14px;
				font-weight: normal;
			}
			.detailItem-title-color{
				color: #666;
			}
			.rows{
				overflow: hidden;
				width: 100%;
				padding: 8px;
				font-size: 13px;
				color: #9c9999;
				.columns{
					padding-bottom: 4px;
					.text-info{
						margin-left: 10px;
						color: #333;
					}
					.img-info{
						margin-left: 10px;
						width: 80px;
					}
					.text-info-color{
						color: #fc9000;
						font-size: 12px;
					}
				}
				.half-width{
					width: 50%;
				}
			}
			.route{
				padding: 8px;
				color: #999;
				box-sizing: border-box;
				.left-route-content{
					overflow: hidden;
					p{
						margin:8px 0;
						span{
							color: #e4ba6c;
						}
					}
					.address{
						color: #222;
					}
					.price{
						font-size: 12px;
					}
				}
			}
		}
	}
	/* 下半部分 */
	.order-detail-bottom{
		margin-top: 10px;
		position: fixed;
		bottom: 0;
		width: 100%;
		overflow: hidden;
		z-index: 99;
		background: #F7F7F7;
		.order-btn{
			margin: 20px auto;
			width: 90%;
		}
		.info{
			li{
				padding: 10px 15px;
				overflow: hidden;
				border-bottom: 1px solid #e8e8e8;
			}
		}
	}

</style>
