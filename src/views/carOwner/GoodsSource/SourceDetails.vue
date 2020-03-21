<!-- 
	货源详情
 -->

<template>
  <div class="sourceDetails">
		<!-- 导航栏 -->
		<van-nav-bar title="货源详情" left-arrow @click-left="$router.back(-1)" fixed></van-nav-bar>
		<!-- 详情文本内容、信息 -->
		<div class="form-content" v-if="goodsSourceDetails">
			<div>
				<h4 class="formItem-title">收发信息</h4>
				<div class="plate">
					<van-cell-group>
						<ul class="receive-send">
							<li class="fl receive-send-icon"></li>
							<li class="fl receive-send-info">{{goodsSourceDetails.cargo_area}}</li>
							<!-- <li class="fr receive-send-arrow"><van-icon name="arrow" /></li> -->
						</ul>
					</van-cell-group>
					<van-cell-group>
						<ul class="receive-send">
							<li class="fl receive-send-icons"></li>
							<li class="fl receive-send-info">{{goodsSourceDetails.consignee_area}}</li>
							<!-- <li class="fr receive-send-arrow"><van-icon name="arrow" /></li> -->
						</ul>
					</van-cell-group>
				</div>
				
				<h4 class="formItem-title">货源信息</h4>
				<div class="plate">
					<van-cell-group>
						<ul class="rows">
							<li class="columns fl half-width">货物类型<span class="text-info">{{goodsSourceDetails.cargo_type}}</span></li>
							<li class="columns fl half-width">货物重量
								<span class="text-info" v-if='goodsSourceDetails.cargo_weight_max=="0"&&goodsSourceDetails.cargo_weight_min=="0"'>{{goodsSourceDetails.cargo_weight+"吨"}}</span>
								<span class="text-info" v-else>{{goodsSourceDetails.cargo_weight_max+"~"+goodsSourceDetails.cargo_weight_min+"吨"}}</span>
							</li>
							<li class="columns fl half-width">货物件数<span class="text-info">{{goodsSourceDetails.cargo_num+"件"}}</span></li>
							<li class="columns fl half-width">货物体积<span class="text-info">{{goodsSourceDetails.cargo_volume+"m³"}}</span></li>
							<li class="columns fl half-width">货物运价<span class="text-info text-info-color">{{goodsSourceDetails.freight+"元/"+goodsSourceDetails.freight_unit}}</span></li>
						</ul>
					</van-cell-group>
					<van-cell-group>
						<ul class="rows">
							<li class="columns fl half-width">车辆类型<span class="text-info">{{goodsSourceDetails.vehicle_type}}</span></li>
							<li class="columns fl half-width">车辆长度<span class="text-info">{{goodsSourceDetails.vehicle_length=="不限"?goodsSourceDetails.vehicle_length:goodsSourceDetails.vehicle_length+"米"}}</span></li>
						</ul>
					</van-cell-group>
					<van-cell-group>
						<ul class="rows">
							<li class="columns fl">支付方式
								<span class="text-info" v-if="goodsSourceDetails.payer==1">发货人支付</span>
								<span class="text-info" v-else>收货人支付</span>
							</li>
						</ul>
					</van-cell-group>
					<van-cell-group>
						<ul class="rows">
							<li class="columns fl" v-if="goodsSourceDetails.cargo_images!=''">
								<span class="fl">货物照片</span>
								<img class="text-info img-info fl" v-if="goodsSourceDetails.cargo_images!='[]'" v-for="item in JSON.parse(goodsSourceDetails.cargo_images)" :src="item" alt="" @click="seePic(item)">
								<span class="text-info fl" v-if="goodsSourceDetails.cargo_images=='[]'">暂无</span>
							</li>
							<li class="columns fl" v-if="goodsSourceDetails.cargo_images==''">
								<span class="fl">货物照片</span>
								<span class="text-info fl">暂无</span>
							</li>
						</ul>
					</van-cell-group>
					<van-cell-group>
						<ul class="rows">
							<li class="columns fl">货主备注<span class="text-info">{{goodsSourceDetails.note}}</span></li>
						</ul>
					</van-cell-group>
				</div>
				
				<h4 class="formItem-title formItem-title-color">司机支付信息费后可查看货主联系方式</h4>
				
				<div class="plate martba">
					<van-button size="large" type="primary" @click="confirmRobbing">确定抢单</van-button>
				</div>
			</div>
		</div>
		<!-- 查看照片 -->
		<van-popup v-model="showPic" style="width: 80%;"><img :src="imageItem" alt="" width="100%"></van-popup>
		<div v-show="loading" class="fullScreen-loding"><van-loading type="spinner"/></div>
	</div>
</template>

<script>
	export default {
		// inject:['reload'],//注入reload方法
		data(){
			return{
				showPic:false,//是否查看
				imageItem:null,//图片
				loading:false,//是否处于加载状态
				goodsSourceDetails:null,//源信息详情
			};
		},
		activated: function() {
			this.queryGoodsSourceDetails()
		},
		mounted() {
			this.queryGoodsSourceDetails();
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
				查询单条货源信息
			*/
			queryGoodsSourceDetails(){
				this.loading = true;
				this.axios.get(`${this.commonJs.basePath}/v1/order/get`, this._queryGoodsSourceDetailsParams()).then( (response) => {
					this.count++;
					// this.reload();					
					this.goodsSourceDetails = response.data.data;
					this.loading = false;
				}).catch( (error) => {
					this.$toast(error);
					this.loading = false;
				});
			},
			_queryGoodsSourceDetailsParams(){
				return {
					params: {
						id: this.$route.params.id,
					}
				}
			},
			
			/* 
				确定抢单
			 */
			confirmRobbing(){
				var orderForm = {
					id:this.$route.params.id,
				}
				this.axios.post(`${this.commonJs.basePath}/v1/order/order`,orderForm).then( (response) => {
					this.$toast('抢单成功！！'); 
					// this.$router.push({name:'wxPayPage',params:{id:"0-"+this.$route.params.id,}})
					window.location.href = window.location.origin + "/#/pay/0-"+this.$route.params.id;
				}).catch( (error) => {
					this.$toast(error)
				});
			},
		}  
	};
</script>

<style scoped>
	/* 
	 收发信息style
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
	
	/* 详情信息的style */
	.form-content{
		margin-top: 46px;
		background: #F5F5F5;
		padding-bottom: 60px;
	}
	.form-content .plate{
		width: 98%;
		overflow: hidden;
		margin: 0 auto;
		border-radius: 5px;
		background: #fff;
	}
	.form-content .plate .rows{
		overflow: hidden;
		width: 100%;
		padding: 8px;
		font-size: 13px;
		color: #9c9999;
	}
	.form-content .plate .rows .columns{
		padding-bottom: 4px;
	}
	.form-content .plate .rows .half-width{
		width: 50%;
	}
	.form-content .plate .rows .columns .text-info{
		margin-left: 10px;
		color: #333;
	}
	.form-content .plate .rows .columns .img-info{
		margin-left: 10px;
		width: 80px;
	}
	.form-content .plate .rows .columns .text-info-color{
		color: #fc9000;
		font-size: 12px;
	}
	.form-content .plate.martba{
		margin: 5px auto;/* 设置发布按钮的margin */
	}
	.form-content .formItem-title{
		color: #2391e2;
    padding: 10px 0 5px 2%;
    text-align: left;
    font-size: 14px;
    font-weight: normal;
	}
	.form-content .formItem-title-color{
		color: #666;
	}
</style>
