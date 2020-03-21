<!--
	抢单支付
 -->

<template>
  <div class="payPage">
		<!-- 支付订单 -->
		<div v-if="isOrderOrInsurance=='0'">
			<!-- 订单详情 -->
			<div class="order-detail" v-if="myOrederDetail">
				<!-- 上半部分 -->
				<div class="order-detail-top">
					<!-- 导航栏 -->
					<van-nav-bar
						title="抢单支付"
						left-arrow @click-left="$router.back(-1)"
						right-text="取消订单"
						@click-right="onClickRight"
						fixed>
					</van-nav-bar>
					<div class="detail-box">
					<div style="height: 56px;"></div>
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
								<p class="address">{{myOrederDetail.vehicle_route.cargo_city+' - '+myOrederDetail.vehicle_route.consignee_city}}</p>
								<p class="price">期望运价<span>{{myOrederDetail.vehicle_num}}</span>/车 约<span>{{myOrederDetail.vehicle_route.freight}}</span>{{"元/"+myOrederDetail.vehicle_route.freight_unit}}</p>
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
					</div>
				</div>
				<!-- 中间部分 -->
				<div class="order-detail-middle" v-show="isShowMid">
					<!-- 信息 -->
					<ul class="plate info">
						<li>
							<span class="fl">合计信息费</span>
							<span class="fl f-c-b marl10" v-if="money">{{money.info_cost+'元'}}</span>
						</li>
						<li>
							<span class="">共计云车币0个,最多可抵扣1/2费用</span>
							<div style="overflow: hidden;margin-top: 5px;">
								<p class="fl">使用云车币</p>
								<p class="fl f-c-b marl10">{{userData.coin}}</p>
								<van-switch v-model="check1" @change="changeCoin" class="fr" size="22px"/>
							</div>
						</li>
						<li>
							<span class="">现有余额0.00元</span>
							<div style="overflow: hidden;margin-top: 5px;">
								<p class="fl">使用余额</p>
								<p class="fl f-c-b marl10">{{userData.balance}}</p>
								<van-switch v-model="check2" size="22px" class="fr" @change="changeBalance"/>
							</div>
						</li>
					</ul>
				</div>
				<!-- 下半部分 -->
				<div class="order-detail-bottom">
					<!-- 按钮 -->
					<div class="order-btn">
						<van-row>
							<van-col span="19">
								<span class="marl15">实付款：</span>
								<span class="orange" v-if="money">{{money.real_cost}}</span>
								<span class="orange">元</span>
							</van-col>
							<van-col span="5">
								<van-button size="large" type="primary" @click="orderPay">微信支付</van-button>
							</van-col>
						</van-row>
					</div>
				</div>
			</div>
		</div>
		<!-- 购买保险 -->
		<div class="buy-insurance" v-if="isOrderOrInsurance=='1'">
			<!-- 导航栏 -->
			<van-nav-bar
				title="购买保险"
				left-text=""
				left-arrow
				@click-left="$router.go(-1)"
				fixed
			/>
			<div class="order-info" style="margin: 50px 5px 5px 5px;">
				<van-cell-group class="pad5">
					<van-radio-group @change="calcInsurance" class="buy-radio" v-model="buyInsuranceForm.insurance_type">
						<van-radio name="1">普通货物综合险</van-radio>
						<van-radio name="2">普通货物基本险</van-radio>
						<van-radio name="3">附加防盗综合保险</van-radio>
						<van-radio name="4">易碎品综合保险</van-radio>
					</van-radio-group>
				</van-cell-group>
				<van-cell-group class="pad5" style="display: inline-block; width: 100%; padding-top:10px; box-sizing: border-box;">
					<span class="fl" >货物估值</span>
					<van-field 
						@keydown="calcInsurance" 
						style="width: 70px;padding: 0;line-height: 19px; margin: 0 5px;" 
						class="fl" 
						type="number" 
						v-model="buyInsuranceForm.cargo_value" 
						placeholder="请输入金额" />
					<span class="fl" >元&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
					<span class="fl" >保险价格 <span>{{money.insurance_cost}}</span> 元</span> 
				</van-cell-group>
			</div>
			<!-- 下半部分 -->
			<div class="order-detail-bottom">
				<!-- 按钮 -->
				<div class="order-btn">
					<van-row>
						<van-col span="19">
							<span class="marl15">实付款：</span>
							<span class="orange" v-if="money_">{{money_.real_cost}}</span>
							<span class="orange">元</span>
						</van-col>
						<van-col span="5">
							<van-button size="large" type="primary" @click="buyInsurance">微信支付</van-button>
						</van-col>
					</van-row>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import md5 from 'js-md5';
	export default {
		data(){
			return{
				isOrderOrInsurance:this.$route.params.id.split("-")[0],//1代表购买保险，0代表支付订单
				isShowMid:true,
				index:this.$route.params.index,
				isShowDetailInfo:false,
				isShowSee:true,
				isShowPack:false,
				myOrederDetail:null,//我的接单详情
				check1:true,
				check2:true,
				checked:true,
				userData:JSON.parse(this.getCookie('userData'))?JSON.parse(this.getCookie('userData')):null,
				money:null,
				use_coin:null,
				use_balance:null,
				appId:'wxda24e6b9d1edd41b',
				nonceStr:null,
				prepayId:null,
				payKay:null,
				
				money_: {
					insurance_cost: 0,
					real_cost: 0,
				},
				buyInsuranceForm:{
					id: this.$route.params.id.split("-")[1], //order id , 订单ID
					tradeType: 'JSAPI',        //
					insurance_type: '1' ,        // 保险类型, 来自于配置 字符串 [1,2,3]
					cargo_value: null,            //货物价值
				},
				wxParams:{
					nonceStr: null,
					prepayId: null,
					payKay:   null,
				}
			};
		},
		mounted() {
			this.getMyOrderDetail();


			if(this.check1==true){
				this.use_coin = 1
			}else{
				this.use_coin = 0
			}

			if(this.check2==true){
				this.use_balance = 1
			}else{
				this.use_balance = 0
			}
		},
		methods:{

			/* 查看与收起详情 */
			see(){
				this.isShowDetailInfo = true;
				this.isShowSee = false;
				this.isShowPack = true;
				this.isShowMid = false;
			},
			pack(){
				this.isShowDetailInfo = false;
				this.isShowSee = true;
				this.isShowPack = false;
				this.isShowMid = true;
			},
			/*
				查询我的单条货源信息
			*/
			getMyOrderDetail(){
				this.axios.get(`${this.commonJs.basePath}/v1/order/get`, this._myOrderDetailParams()).then( (response) => {
					this.count++;
					// this.reload();
					this.myOrederDetail = response.data.data;
					/*
					计算信息费 和真实支付金额
					*/
					let form = {
						id:this.$route.params.id.split("-")[1],
						cargo_weight:response.data.data.cargo_weight,
						use_coin:this.use_coin,//是否使用云车币 0 否 1 是
						use_balance:this.use_balance,//是否使用余额 0 否 1 是
					}
					this.axios.post(`${this.commonJs.basePath}/v1/order/calc-cost`,form).then( (response) => {
						// this.$toast(response.data.message);
						 this.money = response.data.data;
					}).catch( (error) => {
						this.$toast(error);
					});
				}).catch( (error) => {
					this.$toast(error)
				});
			},
			_myOrderDetailParams(){
				return {
					params: {
						id: this.$route.params.id.split("-")[1],
					}
				}
			},

			/* 是否使用余额和云车币 */
			changeCoin(check){
				if(check==true){
					this.use_coin = 1
					this.getMyOrderDetail();
				}else if(check==false){
					this.use_coin = 0
					this.getMyOrderDetail();
				}
			},
			changeBalance(checked){
				if(checked==true){
					this.use_balance = 1
					this.getMyOrderDetail();
				}else{
					this.use_balance = 0
					this.getMyOrderDetail();
				}
			},

			/*
			 取消订单
			 */
			onClickRight(){
				this.$dialog.confirm({
					message: '确定取消该订单！！！',
					cancelButtonText:'再想想',
				}).then(() => {
					// on confirm
					/*
					确定取消该订单
					*/
					let form = {
						id:this.$route.params.id.split("-")[1],
					}
					this.axios.post(`${this.commonJs.basePath}/v1/order/cancel`,form).then( (response) => {
						this.$toast("取消订单成功！！");
						this.$router.push({path: '/source_information'});
					}).catch( (error) => {
						this.$toast(error);
					});
				}).catch(() => {
					// on cancel
				});
			},

			/*
			 交付订单
			 */
			orderPay(){
				let form = {
					id:this.$route.params.id.split("-")[1],
					cargo_weight:this.myOrederDetail.cargo_weight,
					use_coin:this.use_coin,//是否使用云车币 0 否 1 是
					use_balance:this.use_balance,//是否使用余额 0 否 1 是
					tradeType:'JSAPI',
				}
				this.axios.post(`${this.commonJs.basePath}/v1/order/pay`,form).then( (response) => {
					if(response.data.errcode == 0){
						this.$toast(response.data.message);
						//this.appId = response.data.data.appid;
						this.nonceStr = response.data.data.noncestr;
						this.prepayId = response.data.data.prepayid;
						this.payKay = response.data.data.payment_id;
						if (typeof WeixinJSBridge == "undefined") {
							if (document.addEventListener) {
								document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false);
							} else if (document.attachEvent) {
								document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady);
								document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady);
							}
						} else {
							this.onBridgeReady();
						}

					}else{
						this.$toast('支付失败,'+response.data.message,1500);
					}
				}).catch( (error) => {
					this.$toast(error,1500);
				});
			},
			onBridgeReady() {
				var self = this;
				var timestamp = "'" + new Date().getTime() + "'";
				var sign = '';
				var signA = "appId=" + self.appId + "&nonceStr=" + self.nonceStr + "&package=prepay_id=" + self.prepayId + "&signType=MD5&timeStamp=" + timestamp;
				var signB = signA + "&key=" + self.payKay;
				sign = md5(signB).toUpperCase();
				WeixinJSBridge.invoke(
					'getBrandWCPayRequest', {
						"appId": self.appId, // 公众号名称，由商户传入
						"timeStamp": timestamp, // 时间戳，自1970年以来的秒数
						"nonceStr": self.nonceStr, // 随机串
						"package": "prepay_id="+self.prepayId,
						"signType": "MD5", // 微信签名方式：
						"paySign": sign // 微信签名
					},
					function (res) {
						//alert(JSON.stringify(res));
						if (res.err_msg == "get_brand_wcpay_request:ok") {
							self.$toast('支付成功',1500);
							self.$router.push({name:'pendingDeliver',params:{}})
						}else if (res.err_msg == "get_brand_wcpay_request:cancel") {
							self.$toast('用户取消支付',1500);
						}
						else{
							self.$toast(JSON.stringify(res),4000);
						} 
					}
				);
			},
			
			
			
			
			
			
			
			
			
			
			
			/*
			 * 计算保险
			 */
			calcInsurance(){
				this.axios.post(`${this.commonJs.basePath}/v1/order/calc-insurance`, this.buyInsuranceForm).then((response) => {
					this.money_ = response.data.data;
				}).catch((error) => {
					this.$toast(error)
				});
			},  
			/*
			 购买保险
			 */
			buyInsurance(){ 
				if(!this.buyInsuranceForm.cargo_value) {this.$toast('请输入货物估值'); return false;}
				this.axios.post(`${this.commonJs.basePath}/v1/order/buy-insurance`,this.buyInsuranceForm).then( (response) => {
					if(response.data.errcode == 0){
						this.$toast(response.data.message); 
						this.wxParams.nonceStr = response.data.data.noncestr;
						this.wxParams.prepayId = response.data.data.prepayid;
						this.wxParams.payKay = response.data.data.payment_id;
						if (typeof WeixinJSBridge == "undefined") {
							if (document.addEventListener) {
								document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady_, false);
							} else if (document.attachEvent) {
								document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady_);
								document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady_);
							}
						} else {
							this.onBridgeReady_();
						}

					}else{
						this.$toast('支付失败,'+response.data.message,1500);
					}
				}).catch( (error) => {
					this.$toast(error,1500);
				});
			},
			onBridgeReady_() {
				var self = this;
				var timestamp = "'" + new Date().getTime() + "'";
				var sign = '';
				var signA = "appId=" + self.appId + "&nonceStr=" + self.wxParams.nonceStr + "&package=prepay_id=" + self.wxParams.prepayId + "&signType=MD5&timeStamp=" + timestamp;
				var signB = signA + "&key=" + self.wxParams.payKay;
				sign = md5(signB).toUpperCase();
				WeixinJSBridge.invoke(
					'getBrandWCPayRequest', {
						"appId": self.appId, // 公众号名称，由商户传入
						"timeStamp": timestamp, // 时间戳，自1970年以来的秒数
						"nonceStr": self.nonceStr, // 随机串
						"package": "prepay_id="+self.prepayId,
						"signType": "MD5", // 微信签名方式：
						"paySign": sign // 微信签名
					},
					function (res) {
						//alert(JSON.stringify(res));
						if (res.err_msg == "get_brand_wcpay_request:ok") {
							self.$toast('支付成功',1500);
							self.$router.push({name:'sourceInformation',params:{}})
						}else if (res.err_msg == "get_brand_wcpay_request:cancel") {
							self.$toast('用户取消支付',1500);
						}
						else{
							self.$toast(JSON.stringify(res),4000);
						} 
					}
				);
			},
		}
	};
</script>


<style lang="less" scoped>
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
	/* 上半部分 */
	.order-detail-top{
		position: fixed;
		top: 0;
		width: 100%;
		overflow: hidden;
		z-index: 100;
		// background: #F7F7F7;
		.detail-box{
			overflow-y: scroll;
			height: 92vh;
			border-bottom: 1px solid #c9c9c9;
		}
		.state-number{
			li{
				padding: 4px 0;
				overflow: hidden;
			}
		}
		.view-order-details{
			text-align: center;
			width: 100%;
			color: #2391e2;
			padding: 0px 0 10px 0;
			background: #f0f2f5;
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
			background: #f0f2f5;
			overflow:hidden;
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
	/* 中间部分 */
	.order-detail-middle{
		margin-top: 165px;
		position: fixed;
		bottom: 33vh;
		width: 100%;
		overflow: hidden;
		z-index: 100;
		// background: #F7F7F7;
		.info{
			li{
				padding: 10px 15px;
				overflow: hidden;
				border-bottom: 1px solid #e8e8e8;
			}
		}
	}
	/* 下半部分 */
	.order-detail-bottom{
		position: fixed;
		bottom: 0;
		width: 100vw;
		.order-btn{
			width: 100%;
			height:8vh;
			background: #f7f7f7;
			line-height:8vh;
			.orange{
				color: orange;
			}
		}
	}

	.buy-radio{
		.van-radio__input{
			font-size: 14px;
		}
	}
</style>
