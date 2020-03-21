<!-- 
	编辑货源
 -->

<template>
  <div class="deliverGoods">
		<!-- 导航栏 -->
    <ul class="nav">
			<li class="nav-item-l fl">
				<van-icon name="arrow-left" @click="back" size="18px" class="mart15"/>
			</li>
			<li class="nav-item-m fl">
				<button class="btn-l btn-m mart5" v-on:click="tabBtn(1)" v-bind:class="{activebg:addOrder.type==1}">整车</button>
				<button class="btn-r btn-m mart5" v-on:click="tabBtn(2)" v-bind:class="{activebg:addOrder.type==2}">拼车</button>
			</li>
			<li class="nav-item-r fl"></li>
		</ul>
		<!-- 表单内容、信息 -->
		<div class="form-content">
			<!-- 整车的表单信息 -->
			<div v-show="addOrder.type==1">
				<h4 class="formItem-title">收发信息</h4>
				<div class="plate">
					<van-cell-group>
						<ul @click="showPersonnelPopup = true" class="receive-send" v-if="isShowSendInfo">
							<li class="fl receive-send-icon"></li>
							<li class="fl receive-send-info">请输入发货人详细信息</li>
							<li class="fr receive-send-arrow"><van-icon name="arrow" /></li>
						</ul>
						<ul @click="showPersonnelPopup = true" class="receive-send" v-if="isShowSendInfo_">
							<li class="fl receive-send-icon_"></li>
							<li class="fl receive-send-info_">
								<p>{{cargo_owner_name+' '+cargo_owner_cellphone}}</p>
								<p class="info-text-color">{{cargo_area_name}}</p>
								<p class="info-text-color">{{cargo_address}}</p>
							</li>
							<li class="fr receive-send-arrow_"><van-icon name="arrow" /></li>
						</ul>
					</van-cell-group>
					<van-cell-group>
						<ul @click="showPersonnelPopup_ = true" class="receive-send" v-if="isShowReceiveInfo">
							<li class="fl receive-send-icons"></li>
							<li class="fl receive-send-info">请输入收货人详细信息</li>
							<li class="fr receive-send-arrow"><van-icon name="arrow" /></li>
						</ul>
						<ul @click="showPersonnelPopup_ = true" class="receive-send" v-if="isShowReceiveInfo_">
							<li class="fl receive-send-icons_"></li>
							<li class="fl receive-send-info_">
								<p>{{consignee+' '+consignee_cellphone}}</p>
								<p class="info-text-color">{{consignee_area_name}}</p>
								<p class="info-text-color">{{consignee_address}}</p>
							</li>
							<li class="fr receive-send-arrow_"><van-icon name="arrow" /></li>
						</ul>
					</van-cell-group>
				</div>
				
				<h4 class="formItem-title">货源信息</h4>
				<div class="plate goods">
					<van-cell-group>
						<div @click="showGoodsPopup = true" class="goods-info-title">
							<van-field
								type="text"
								v-model="goodsInfo"
								clearable
								label="货物"
								icon="arrow"
								placeholder="请输入货物详细信息"
								disabled
							/>
						</div>
					</van-cell-group>
					<van-cell-group>
						<van-field
							v-model="addOrder.vehicle_num"
							type="number"
							clearable
							label="发送车数/车"
							placeholder="请输入发送车数"
							input-align="right"
						/>
					</van-cell-group>
					<van-cell-group>
						<van-row>
							<van-col span="12">
								<div @click="showCarType = true" class="b-r">
									<van-field
										v-model="addOrder.vehicle_type"
										type="text"
										clearable
										label="车辆类型"
										icon="arrow"
										placeholder="请选择"
										disabled
									/>
								</div>
							</van-col>
							<van-col span="12">
								<div @click="showCarLength = true">
									<van-field
										v-model="vehicle_length"
										type="text"
										clearable
										label="车辆长度"
										icon="arrow"
										placeholder="请选择"
										disabled
									/>
								</div>
							</van-col>
						</van-row>
					</van-cell-group>
					<van-cell-group class="pay">
						<van-cell title="支付方式"> 
							<van-radio-group v-model="payer">
								<van-radio name="1">发货人支付</van-radio>
								<van-radio name="2">收货人支付</van-radio>
							</van-radio-group>
						</van-cell>
					</van-cell-group>
					<van-cell-group class="is-buy">
						<van-cell title="是否购买保险">
							<van-switch v-model="check" size="20px" @change="isBuyInsurance"/>
						</van-cell>
					</van-cell-group>
					<van-cell-group class="img">
						<van-cell title="上传货物照片">
							<div class="goods-image fr" @click="showPhotoPopup = true">+</div>
							<img v-if="cargo_images" v-for="item in cargo_images" :src="item" @click="showPhotoPopup = true" class="goods-image fr border-none"/>
						</van-cell>
					</van-cell-group>
				</div>
				
				<h4 class="formItem-title">备注</h4>
				<div class="plate">
					<van-cell-group>
						<van-field v-model="addOrder.note" placeholder="请输入备注信息" type="textarea" rows="3" autosize/>
					</van-cell-group>
				</div>
				
				<div class="plate martba">
					<van-button size="large" type="primary" @click="publishGoodsSource">确认发布</van-button>
				</div>
			</div>
			<!-- 拼车的表单信息 -->
			<div v-show="addOrder.type==2">
				<h4 class="formItem-title">收发信息</h4>
				<div class="plate">
					<van-cell-group>
						<ul @click="showPersonnelPopup = true" class="receive-send" v-if="isShowSendInfo">
							<li class="fl receive-send-icon"></li>
							<li class="fl receive-send-info">请输入发货人详细信息</li>
							<li class="fr receive-send-arrow"><van-icon name="arrow" /></li>
						</ul>
						<ul @click="showPersonnelPopup = true" class="receive-send" v-if="isShowSendInfo_">
							<li class="fl receive-send-icon_"></li>
							<li class="fl receive-send-info_">
								<p>{{cargo_owner_name+' '+cargo_owner_cellphone}}</p>
								<p class="info-text-color">{{cargo_area_name}}</p>
								<p class="info-text-color">{{cargo_address}}</p>
							</li>
							<li class="fr receive-send-arrow_"><van-icon name="arrow" /></li>
						</ul>
					</van-cell-group>
					<van-cell-group>
						<ul @click="showPersonnelPopup_ = true" class="receive-send" v-if="isShowReceiveInfo">
							<li class="fl receive-send-icons"></li>
							<li class="fl receive-send-info">请输入收货人详细信息</li>
							<li class="fr receive-send-arrow"><van-icon name="arrow" /></li>
						</ul>
						<ul @click="showPersonnelPopup_ = true" class="receive-send" v-if="isShowReceiveInfo_">
							<li class="fl receive-send-icons_"></li>
							<li class="fl receive-send-info_">
								<p>{{consignee+' '+consignee_cellphone}}</p>
								<p class="info-text-color">{{consignee_area_name}}</p>
								<p class="info-text-color">{{consignee_address}}</p>
							</li>
							<li class="fr receive-send-arrow_"><van-icon name="arrow" /></li>
						</ul>
					</van-cell-group>
				</div>
				
				<h4 class="formItem-title">货源信息</h4>
				<div class="plate goods">
					<van-cell-group>
						<div @click="showGoodsPopup = true" class="goods-info-title">
							<van-field
								type="text"
								v-model="goodsInfo"
								clearable
								label="货物"
								icon="arrow"
								placeholder="请输入货物详细信息"
								disabled
							/>
						</div>
					</van-cell-group>
					<van-cell-group>
						<van-row>
							<van-col span="12">
								<div @click="showCarType = true" class="b-r">
									<van-field
										v-model="addOrder.vehicle_type"
										type="text"
										clearable
										label="车辆类型"
										icon="arrow"
										placeholder="请选择"
										disabled
									/>
								</div>
							</van-col>
							<van-col span="12">
								<div @click="showCarLength = true">
									<van-field
										v-model="vehicle_length"
										type="text"
										clearable
										label="车辆长度"
										icon="arrow"
										placeholder="请选择"
										disabled
									/>
								</div>
							</van-col>
						</van-row>
					</van-cell-group>
					<van-cell-group class="pay">
						<van-cell title="支付方式">
							<van-radio-group v-model="payer">
								<van-radio name="1">发货人支付</van-radio>
								<van-radio name="2">收货人支付</van-radio>
							</van-radio-group>
						</van-cell>
					</van-cell-group>
					<van-cell-group class="is-buy">
						<van-cell title="是否购买保险">
							<van-switch v-model="check" size="20px"/>
						</van-cell>
					</van-cell-group>
					<van-cell-group class="img">
						<van-cell title="上传货物照片">
							<div class="goods-image fr" @click="showPhotoPopup = true">+</div>
							<img v-if="cargo_images" v-for="item in cargo_images" :src="item" @click="showPhotoPopup = true" class="goods-image fr border-none"/>
						</van-cell>
					</van-cell-group>
				</div>
				
				<h4 class="formItem-title">备注</h4>
				<div class="plate">
					<van-cell-group>
						<van-field v-model="addOrder.note" placeholder="请输入备注信息" type="textarea" rows="3" autosize/>
					</van-cell-group>
				</div>
				
				<div class="plate martba">
					<van-button size="large" type="primary" @click="publishGoodsSource">确认发布</van-button>
				</div>
			</div>
		</div>
		<!-- 选择车辆类型弹框 -->
		<van-dialog
			v-model="showCarType"
			:show-confirm-button = "false"
			:closeOnClickOverlay="true"
			>
			<ul class="select-menu" v-if="configData">
				<li class="fl select-menu-item" v-for="item in configData.vehicle_types" @click="assignmentVehicleTypes(item)">{{item}}</li>
				<p class="tips">（请选择其中的一种即可）</p>
			</ul>
		</van-dialog>
		<!-- 选择车辆长度弹框 -->
		<van-dialog
			v-model="showCarLength"
			:show-confirm-button = "false"
			:closeOnClickOverlay="true"
			>
			<ul class="select-menu" v-if="configData">
				<li class="fl select-menu-item" v-for="item in configData.vehicle_lengths" @click="assignmentVehicleLengths(item)">{{item}}</li>
				<p class="tips">（请选择其中的一种即可）</p>
			</ul>
		</van-dialog>
		<!-- 货物信息的弹出层 -->
		<van-popup 
			v-model="showGoodsPopup" 
			position="right" 
			:overlay="false"
			class="car-popup">
			<div class="goods-popup">
				<!-- 导航栏 -->
				<van-nav-bar
					title="货物"
					left-text=""
					right-text="确定"
					left-arrow
					@click-left="showGoodsPopup = false"
					@click-right="confirmGoodsInfo"
				/>
				<!-- 货物信息 -->
				<div class="goods-info mart15">
					<van-cell-group class="info-select">
						<van-cell title="货物类型" is-link @click="showGoodsType = true" v-model='cargo_type'/>
					</van-cell-group>
					<ul class="info-input">
						<li class="input-item">
							<span class="item-title fl">货物吨位</span>
							<div class="fl" v-show="index==0">
								<input type="text" placeholder="按实际吨位" v-model="cargo_weight"/>
								<span class="item-unit">吨</span>
								<van-button size="mini" type="primary" text="范围" v-on:click="valueChange(1)"></van-button>
							</div>
							<div class="fl" v-show="index==1">
								<input type="text" class="input-w50" v-model="cargo_weight_min"/>
								<span class="item-unit">吨</span>
								<span class="item-line">——</span>
								<input type="text" class="input-w50" v-model="cargo_weight_max"/>
								<span class="item-unit">吨</span>
								<van-button size="mini" type="primary" text="固定值" v-on:click="valueChange(0)"></van-button>
							</div>
						</li>
						<li class="input-item">
							<span class="item-title fl">货物件数</span>
							<input type="text" placeholder="按实际件数" class="fl" v-model="cargo_num"/>
							<span class="item-unit fl">件</span>
						</li>
						<li class="input-item">
							<span class="item-title fl">货物体积</span>
							<input type="text" placeholder="按实际体积" class="fl" v-model="cargo_volume"/>
							<span class="item-unit fl">m³</span>
						</li>
						<li class="input-item">
							<span class="item-title fl">货物运价</span>
							<input type="text" placeholder="请输入运价" class="fl" v-model="freight"/>
							<span class="item-unit fl">{{'元/'+freight_unit}}</span>
							<van-icon name="exchange-record" class="fl" @click="showUnit = true"/>
						</li>
					</ul>
				</div>
				
			</div>
		</van-popup>
		<!-- 选择单位弹框 -->
		<van-dialog
			v-model="showUnit"
			:show-confirm-button = "false"
			:closeOnClickOverlay="true"
			>
			<ul class="select-menu" v-if="configData">
				<li class="fl select-menu-item" v-for="item in configData.unit" @click="assignmentUnit(item)">{{'元/'+item}}</li>
				<p class="tips">（请选择其中的一种即可）</p>
			</ul>
		</van-dialog>
		<!-- 选择货物类型弹框 -->
		<van-dialog
			v-model="showGoodsType"
			:show-confirm-button="false"
			:closeOnClickOverlay="true"
			>
			<ul class="select-menu" v-if="configData">
				<li class="fl select-menu-item" v-for="item in configData.cargo_types" @click="assignmentCargoTypes(item)">{{item}}</li>
				<p class="tips">（请选择其中的一种即可）</p>
			</ul>
		</van-dialog>
		<!-- 发货人与收货人信息的弹出层 -->
		<!-- 1.发货人 -->
		<van-popup 
			v-model="showPersonnelPopup" 
			position="right" 
			:overlay="false"
			class="car-popup">
			<div class="personnel-popup">
				<!-- 导航栏 -->
				<van-nav-bar
					title="发货人详细信息"
					left-text=""
					right-text="确定"
					left-arrow
					@click-left="showPersonnelPopup = false"
					@click-right="confirmSendInfo"
				/>
				<div class="personnel-info mart15">
					<van-row>
						<van-col span="16">
							<van-cell-group>
								<van-field
									v-model="cargo_owner_name"
									required
									clearable
									label="姓名"
									placeholder="请输入姓名"
								/>

								<van-field
									v-model="cargo_owner_cellphone"
									required
									clearable
									label="联系电活"
									placeholder="请输入联系电话"
								/>
							</van-cell-group>
						</van-col>
						<van-col span="7" offset="1" class="contact-select">
							<div @click="$toast('请选择联系人')" class="contact-icon">
								<van-icon name="contact"/>
								<p class="text">请选择联系人</p>
							</div>
						</van-col>
					</van-row>
					<van-row>
						<van-col span="24">
							<van-cell-group>
								<div @click="showArea = true" class="icon-arrow">
									<van-field
										v-model="cargo_area_name"
										required
										clearable
										label="所在区域"
										icon="arrow"
										placeholder="请选择省市区"
										disabled
									/>
								</div>
							</van-cell-group>
							<van-cell-group>
								<div class="icon-location">
									<van-field
										v-model="cargo_address"
										required
										clearable
										label="详细地址"
										icon="location"
										placeholder="请输入详细地址"
									/>
								</div>
							</van-cell-group>
						</van-col>
					</van-row>
				</div>
			</div>
		</van-popup>
		<!-- 2.收货人 -->
		<van-popup 
					v-model="showPersonnelPopup_" 
					position="right" 
					:overlay="false"
					class="car-popup">
					<div class="personnel-popup">
						<!-- 导航栏 -->
						<van-nav-bar
							title="收货人详细信息"
							left-text=""
							right-text="确定"
							left-arrow
							@click-left="showPersonnelPopup_ = false"
							@click-right="confirmReceiveInfo"
						/>
						<div class="personnel-info mart15">
							<van-row>
								<van-col span="16">
									<van-cell-group>
										<van-field
											v-model="consignee"
											required
											clearable
											label="姓名"
											placeholder="请输入姓名"
										/>
		
										<van-field
											v-model="consignee_cellphone"
											required
											clearable
											label="联系电活"
											placeholder="请输入联系电话"
										/>
									</van-cell-group>
								</van-col>
								<van-col span="7" offset="1" class="contact-select">
									<div @click="$toast('请选择联系人')" class="contact-icon">
										<van-icon name="contact"/>
										<p class="text">请选择联系人</p>
									</div>
								</van-col>
							</van-row>
							<van-row>
								<van-col span="24">
									<van-cell-group>
										<div @click="showArea_ = true" class="icon-arrow">
											<van-field
												v-model="consignee_area_name"
												required
												clearable
												label="所在区域"
												icon="arrow"
												placeholder="请选择省市区"
												disabled
											/>
										</div>
									</van-cell-group>
									<van-cell-group>
										<div class="icon-location">
											<van-field
												v-model="consignee_address"
												required
												clearable
												label="详细地址"
												icon="location"
												placeholder="请输入详细地址"
											/>
										</div>
									</van-cell-group>
								</van-col>
							</van-row>
						</div>
					</div>
				</van-popup>
		<!-- 省市区弹出层 -->
		<!-- 1.发货 -->
		<van-popup v-model="showArea" position="bottom">
			<van-picker
				show-toolbar
				title="选择地址"
				:columns="area_list"
				@cancel="showArea = false"
				@confirm="onConfirmArea"
				@change="onChangeArea"
				value-key="name"
			/>
		</van-popup>
		<!-- 2.收货 -->
		<van-popup v-model="showArea_" position="bottom">
			<van-picker
				show-toolbar
				title="选择地址"
				:columns="area_list"
				@cancel="showArea_ = false"
				@confirm="onConfirmArea_"
				@change="onChangeArea"
				value-key="name"
			/>
		</van-popup>
		<!-- 上传货物照片的弹出层 -->
		<van-popup 
			v-model="showPhotoPopup" 
			position="bottom" 
			class="car-popup goods-photo">
			<div class="photo-popup">
				<van-button size="large" type="" @click="" class="marb15">
					<van-uploader 
						:after-read="((val) => {photograph(val, 'cargo_images')})" 
						accept="image/*" 
						multiple 
						capture="camera">
						拍照
					</van-uploader>
				</van-button>
				<van-button size="large" type="" @click="" class="marb15">
					<van-uploader 
						:after-read="((val) => {photoalbum(val, 'cargo_images')})" 
						accept="image/*" 
						multiple
						>
						从相册中选取
					</van-uploader>
				</van-button>
				<van-button size="large" type="" @click="showPhotoPopup = false" class="marb15">取消</van-button>
			</div>
		</van-popup>
		<div v-show="loading" class="fullScreen-loding"><van-loading type="spinner"/></div>
	</div>
</template>

<script>
	export default { 
		data(){
			return{
				loading: false,   //是否处于加载状态
				index:0,//固定值与范围值的切换
				//是否展示弹出层或弹框
				showCarType:false,
				showCarLength:false,
				showGoodsPopup:false,
				showPersonnelPopup:false,
				showPersonnelPopup_:false,
				showPhotoPopup:false,
				showUnit:false,
				showGoodsType:false,
				showArea:false,
				showArea_:false,
				area_list:[ { values:[] }, { values:[] }, { values:[] } ],//地区列表
				configData:null,//配置信息
				check:true,//是否买保险
				payer: '1',//支付方式
				//发货
				cargo_area_name:'',
				cargo_area_code:'',
				cargo_owner_name:'',
				cargo_owner_cellphone:'',
				cargo_address:'',
				isShowSendInfo:false,
				isShowSendInfo_:true,
				//收货
				consignee_area_name:'',
				consignee_area_code:'',
				consignee:'',
				consignee_cellphone:'',
				consignee_address:'',
				isShowReceiveInfo:false,
				isShowReceiveInfo_:true,
				//货物
				goodsInfo:'',
				cargo_type:'',
				cargo_weight:'',
				cargo_weight_min:'',
				cargo_weight_max:'',
				cargo_volume:'',
				cargo_num:'',
				freight:'',
				freight_unit:'吨',
				cargo_images:[],//货物照片
				vehicle_length:null,//车辆长度
				
				//发布货源
				addOrder:{
					id: null, //货源ID
					type:1,//1-整车，2-拼车
					vehicle_num:"1",//车辆数
					vehicle_length:null,//车辆长度
					vehicle_type:null,//车辆类型
					payer: null,//支付方式
					note:null,//备注
					cargo_images:null,//货物照片 
					confirm_code: '0',//确认收货验证码
					//收货人信息
					consignee:null,
					consignee_cellphone:null,
					consignee_area_code:null,
					consignee_address_xy:'0,0',
					consignee_address:null,
					//发货人信息
					cargo_owner_name:null,
					cargo_area_code:null,
					cargo_address:null,
					cargo_address_xy:'0,0',
					cargo_owner_cellphone:null,
					//货物的详细信息
					cargo_name:null,
					cargo_type:null,
					cargo_weight:null,
					cargo_weight_min:null,
					cargo_weight_max:null,
					cargo_volume:null,
					cargo_num:null,
					freight:null,
					freight_unit:'吨',
					//保险
					buy_insurance:null,
					insurance_type:null,
				},
			};
		},
		mounted() {
			this.getOrderDetail();
			this.getOneAreaList();
			this.getTwoAreaList(11);
			this.getThreeAreaList(1100);
			this.getConfigInfo();
		},
		created(){
			this.addOrder.buy_insurance = 1;
			this.addOrder.insurance_type = 1;
		},
		watch:{ 
		},
		methods:{
			/*
			 * 查询单条货源信息
			 */
			getOrderDetail(){ 
				this.axios.get(`${this.commonJs.basePath}/v1/order/get`, {params: {id: this.$route.params.id}}).then((response) => {
					this._bindData(response.data.data);
				}).catch((error) => {
						this.$toast(error);
						this.loading = false;
				})
			},
			/*
			 *  绑定初始数据
			 */
			_bindData(orderDetail){
				//发货
				this.cargo_area_name = orderDetail.cargo_area;
				this.addOrder.cargo_area_code = this.cargo_area_code = orderDetail.cargo_area_code;
				this.addOrder.cargo_owner_name = this.cargo_owner_name = orderDetail.cargo_owner_name;
				this.addOrder.cargo_owner_cellphone = this.cargo_owner_cellphone = orderDetail.cargo_owner_cellphone;
				this.addOrder.cargo_address = this.cargo_address = orderDetail.cargo_address; 
				//收货
				this.consignee_area_name = orderDetail.consignee_area;
				this.addOrder.consignee_area_code = this.consignee_area_code = orderDetail.consignee_area_code;
				this.addOrder.consignee = this.consignee = orderDetail.consignee;
				this.addOrder.consignee_cellphone = this.consignee_cellphone = orderDetail.consignee_cellphone;
				this.addOrder.consignee_address = this.consignee_address = orderDetail.consignee_address; 

				//货源信息
				this.addOrder.vehicle_num = orderDetail.vehicle_num;
				this.addOrder.vehicle_type = orderDetail.vehicle_type;
				this.addOrder.vehicle_length = orderDetail.vehicle_length;
				this.vehicle_length = orderDetail.vehicle_length;
				this.addOrder.payer = orderDetail.payer;
				this.payer = orderDetail.payer.toString();
				this.addOrder.buy_insurance = orderDetail.buy_insurance;
				this.addOrder.cargo_images = this.cargo_images = orderDetail.cargo_images ? JSON.parse(orderDetail.cargo_images) : '';
				this.addOrder.note = orderDetail.note; 

				this.goodsInfo = orderDetail.cargo_type+' '+orderDetail.cargo_weight+'吨 '+orderDetail.cargo_num+'件 '+orderDetail.cargo_volume+'m³ '+orderDetail.freight+'元/'+orderDetail.freight_unit;
				this.cargo_type = orderDetail.cargo_type;
				this.cargo_weight = orderDetail.cargo_weight;
				this.cargo_num = orderDetail.cargo_num;
				this.cargo_volume = orderDetail.cargo_volume;
				this.freight = orderDetail.freight;
				this.freight_unit = orderDetail.freight_unit;
					
				this.addOrder.cargo_type = this.cargo_type;
				this.addOrder.cargo_weight = Number(this.cargo_weight);
				this.addOrder.cargo_weight_min = orderDetail.cargo_weight_min;
				this.addOrder.cargo_weight_max = orderDetail.cargo_weight_max;
				this.addOrder.cargo_volume = Number(this.cargo_volume);
				this.addOrder.cargo_num = Number(this.cargo_num);
				this.addOrder.freight = Number(this.freight);
				this.addOrder.freight_unit = this.freight_unit;
				this.addOrder.id = orderDetail.id;

		 	},
		 	/* 
				发布货源
			 */
			publishGoodsSource(){
				
				if(this.addOrder.cargo_owner_name==null){
					this.$toast("请填写发货人相关的信息")
					return;
				}
				if(this.addOrder.consignee==null){
					this.$toast("请填写收货人相关的信息")
					return;
				}
				if(this.addOrder.cargo_type==null){
					this.$toast("请填写货物相关信息")
					return;
				}
				if(this.addOrder.type==1&&(this.addOrder.vehicle_num==''||(parseInt(this.addOrder.vehicle_num)<0||parseInt(this.addOrder.vehicle_num)>10))){
					this.$toast("请填写发送车数，数量不小于0并且不能大于10")
					return;
				}
				if(this.addOrder.vehicle_type==null){
					this.$toast("请选择车辆类型")
					return;
				}
				if(this.addOrder.vehicle_length==null){
					this.$toast("请选择车辆长度")
					return;
				}
				if(this.addOrder.cargo_images){
					 this.addOrder.cargo_images = JSON.stringify(this.addOrder.cargo_images)
				} 
				
				this.addOrder.payer = Number(this.payer);
				this.axios.post(`${this.commonJs.basePath}/v1/order/edit`,this.addOrder).then( (response) => {
					this.$toast('发货成功')
					this.$router.push({path: '/my/pending_order'})
				}).catch( (error) => {
					this.$toast(error)
				});
			},
			/* 
			 拍照 
			*/
			photograph(val,keyName){ 
				this._photograph(val,keyName);
			},
			_photograph(val,keyName) {
				this.loading = true;
				this.axios.get(`${this.commonJs.basePath}/v1/file/token/get`, {params: {file: val.file}}).then((response) => {
					this.loading = false;
				}).catch((error) => {
						this.$toast(error);
						this.loading = false;
				})
			},
			_photograph(val,keyName){
				this.loading = true;
				let param = new FormData(); //创建form对象 
				param.append('file',val.file,val.file.name)
				let config = {
					headers:{'Content-Type':'multipart/form-data'}
				};
				this.axios.get(`${this.commonJs.basePath}/v1/file/token/get`, {params: {file: val.file}}).then((response) => {
					param.append('token',response.data.data.uptoken);
					this._fileQiniu(param,config,keyName, response.data.data.base_url);
					this.loading = false;
				}).catch((error) => {
						this.$toast(error);
						this.loading = false;
				})

			},
			
			/* 
				相册
			*/
			photoalbum(val,keyName){ 
				this._photoalbum(val,keyName);
			},
			_photoalbum(val,keyName) {
				this.loading = true;
				let param = new FormData(); //创建form对象 
				param.append('file',val.file,val.file.name)
				let config = {
					headers:{'Content-Type':'multipart/form-data'}
				};
				this.axios.get(`${this.commonJs.basePath}/v1/file/token/get`, {params: {file: val.file}}).then((response) => {
					param.append('token',response.data.data.uptoken);
					this._fileQiniu(param,config,keyName, response.data.data.base_url);
					this.loading = false;
				}).catch((error) => {
						this.$toast(error);
						this.loading = false;
				})
			},
			
			/*
			* 通过七牛技术上传附件
			* @params {object} param 附件参数
			* @params {object} config 请求头
			* @params {string} keyName 字段名
			* @params {string} base_url 附件地址头
			*/
			_fileQiniu(param,config,keyName, base_url){
				this.loading = true;
				this.axios.post(`${this.commonJs.filePath}`, param, config).then((response) => {
					this.cargo_images.push(`${base_url}${response.data.key}`)
					this.addOrder.cargo_images = JSON.stringify(this.cargo_images)
					this.loading = false;
					this.showPhotoPopup = false;
				}).catch((error) => {
						this.$toast(error);
						this.loading = false;
				})
			},
			
			/* 
				是否购买保险
			 */
			isBuyInsurance(check){
				if(check==true){
					this.addOrder.buy_insurance = 1;
					this.addOrder.insurance_type = 1;
				}else if(check==false){
					this.addOrder.buy_insurance = 0;
					this.addOrder.insurance_type = 1;
				}
			},
			
			/* 
			 点击弹出层将值赋上去
			 */
			assignmentVehicleLengths(val){
				//车辆长度
				if(val=='不限'){
					this.vehicle_length = val;
					this.addOrder.vehicle_length = 0;
				}else{
					this.vehicle_length = val;
					this.addOrder.vehicle_length = Number(val);
				}
				this.showCarLength = false;
			},
			assignmentVehicleTypes(val){
				//车辆类型
				this.addOrder.vehicle_type = val;
				this.showCarType = false;
			},
			assignmentCargoTypes(val){
				//货物类型
				this.cargo_type = val;
				this.showGoodsType = false;
			},
			assignmentUnit(val){
				//单位
				this.freight_unit = val;
				this.showUnit = false;
			},
			
			/* 
				确认收发信息
			 */
			confirmSendInfo(){
				if(this.cargo_owner_name==''){
					this.$toast("请输入发货人姓名")
					return;
				}
				if(this.cargo_owner_cellphone==''){
					this.$toast("请输入发货人手机号码")
					return;
				}
				if(this.cargo_area_code==''){
					this.$toast("请选择发货人所在区域")
					return;
				}
				if(this.cargo_address==''){
					this.$toast("请输入发货人详细地址")
					return;
				}
				
				this.showPersonnelPopup = false;
				this.isShowSendInfo = false;
				this.isShowSendInfo_ = true;
				
				this.addOrder.cargo_owner_name = this.cargo_owner_name
				this.addOrder.cargo_owner_cellphone = this.cargo_owner_cellphone
				this.addOrder.cargo_address = this.cargo_address
				this.addOrder.cargo_area_code = this.cargo_area_code
			},
			confirmReceiveInfo(){
				if(this.consignee==''){
					this.$toast("请输入收货人姓名")
					return;
				}
				if(this.consignee_cellphone==''){
					this.$toast("请输入收货人手机号码")
					return;
				}
				if(this.consignee_area_code==''){
					this.$toast("请选择收货人所在区域")
					return;
				}
				if(this.consignee_address==''){
					this.$toast("请输入收货人详细地址")
					return;
				}
				
				this.showPersonnelPopup_ = false;
				this.isShowReceiveInfo = false;
				this.isShowReceiveInfo_ = true;
				
				this.addOrder.consignee = this.consignee
				this.addOrder.consignee_cellphone = this.consignee_cellphone
				this.addOrder.consignee_address = this.consignee_address
				this.addOrder.consignee_area_code = this.consignee_area_code
			},
			
			/* 
				确认货物信息
			 */
			confirmGoodsInfo(){
				if(this.cargo_type==''){
					this.$toast("请选择货物类型")
					return;
				}
				if(this.cargo_weight==''&&(this.cargo_weight_min==''&&this.cargo_weight_max=='')){
					this.$toast("请输入货物重量或重量范围")
					return;
				}
				if(this.cargo_volume==''){
					this.$toast("请输入货物体积")
					return;
				}
				if(this.cargo_num==''){
					this.$toast("请输入货物件数")
					return;
				}
				if(this.freight==''){
					this.$toast("请输入货物运价")
					return;
				}
				if(this.freight_unit==''){
					this.$toast("请选择货物单位")
					return;
				}
				
				this.showGoodsPopup = false;
				if(this.index===0){//重量为固定值
					this.goodsInfo = this.cargo_type+' '+this.cargo_weight+'吨 '+this.cargo_num+'件 '+this.cargo_volume+'m³ '+this.freight+'元/'+this.freight_unit;
					
					this.addOrder.cargo_name = this.cargo_type+' '+this.cargo_weight+'吨 '+this.cargo_num+'件 '+this.cargo_volume+'m³ '+this.freight+'元/'+this.freight_unit;
					this.addOrder.cargo_type = this.cargo_type
					this.addOrder.cargo_weight = Number(this.cargo_weight)
					this.addOrder.cargo_weight_min = '0'
					this.addOrder.cargo_weight_max = '0'
					this.addOrder.cargo_volume = Number(this.cargo_volume)
					this.addOrder.cargo_num = Number(this.cargo_num)
					this.addOrder.freight = Number(this.freight)
					this.addOrder.freight_unit = this.freight_unit
				}
				if(this.index===1){//重量为范围值
					this.goodsInfo = this.cargo_type+' '+this.cargo_weight_min+'~'+this.cargo_weight_max+'吨 '+this.cargo_num+'件 '+this.cargo_volume+'m³ '+this.freight+'元/'+this.freight_unit;
					
					this.addOrder.cargo_name = this.cargo_type+' '+this.cargo_weight_min+'~'+this.cargo_weight_max+'吨 '+this.cargo_num+'件 '+this.cargo_volume+'m³ '+this.freight+'元/'+this.freight_unit;
					this.addOrder.cargo_type = this.cargo_type
					this.addOrder.cargo_weight = '0'
					this.addOrder.cargo_weight_min = Number(this.cargo_weight_min)
					this.addOrder.cargo_weight_max = Number(this.cargo_weight_max)
					this.addOrder.cargo_volume = Number(this.cargo_volume)
					this.addOrder.cargo_num = Number(this.cargo_num)
					this.addOrder.freight = Number(this.freight)
					this.addOrder.freight_unit = this.freight_unit
				}
			},
			
			/* 
			 返回
			 */
			back(){
				this.$dialog.alert({
					message: '货源信息未填写，是否要放弃',
					confirmButtonText:'确定',
					showCancelButton:true,
					className:'tips-dialog',
				}).then(() => {
					// on confirm
					 this.$router.back(-1); 
				}).catch(() => {
					// on cancel
				});
			},
			/* 
			按钮的切换 
			 */
			tabBtn(i){
				this.addOrder.type = i;
			},
			/* 
			范围与固定值的切换 
			*/
			valueChange(i){
				this.index = i;
			},
			
			/* 
				获取配置信息
			*/
			getConfigInfo(){
				this.axios.get(`${this.commonJs.basePath}/v1/config`,{params:{version:'',area_code:''}}).then((response) =>{
					this.configData = response.data.data;
				}).catch((error) =>{
					this.$toast(error)
				});
			}, 
			
			/* 
				确认区域 发货
			*/
			onConfirmArea(value,index){
				if(value[value.length-1] == undefined){
					this.cargo_area_code = value[value.length-2].code
					this.cargo_area_name =value[value.length-3].name + ' ' + value[value.length-2].name
				}
				else if(value[value.length-1] != undefined){
					this.cargo_area_code = value[value.length-1].code
					this.cargo_area_name =value[value.length-3].name + ' ' + value[value.length-2].name+' '+ value[value.length-1].name  
				}
				this.showArea = false;
			},
			/* 
				确认区域 收货
			*/
			onConfirmArea_(value,index){
				if(value[value.length-1] == undefined){
					this.consignee_area_code = value[value.length-2].code
					this.consignee_area_name = value[value.length-3].name + ' ' + value[value.length-2].name
				}
				else if(value[value.length-1] != undefined){
					this.consignee_area_code = value[value.length-1].code
					this.consignee_area_name = value[value.length-3].name + ' ' + value[value.length-2].name+' '+ value[value.length-1].name 
				}
				this.showArea_ = false;
			},
			/*
			省市区选项改变时触发
			*/
			onChangeArea(picker,value,index) { 
				if(index === 0){
					this.axios.get(`${this.commonJs.basePath}/v1/area/children`,{params: {parent_area_code:value[0].code ,scope: 1}}).then( (response) => {
						if(response.data.errcode === 0){ 
							picker.setColumnValues(1,response.data.data)// 重设市的选项
							
							this.axios.get(`${this.commonJs.basePath}/v1/area/children`,
								{params: {parent_area_code: response.data.data[0].province_code, scope:'2', city_code: response.data.data[0].code}}).then( (response) => {
								if(response.data.errcode === 0){ 
									picker.setColumnValues(2,response.data.data)// 重设市的选项
								}else{
									this.$toast.fail(response.data.message);  
								}
							}).catch( (error) => {});

						}else{
							this.$toast.fail(response.data.message);  
						}
					}).catch( (error) => {});
				}
				if(index === 1){ 
					// value[0].code 第一级code  value[1].code第二季code
					this.axios.get(`${this.commonJs.basePath}/v1/area/children`,
						{params: {parent_area_code: value[0].code, scope:'2', city_code: value[1].code}}).then( (response) => {
						if(response.data.errcode === 0){ 
							picker.setColumnValues(2,response.data.data)// 重设市的选项
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
						this.getTwoAreaList(response.data.data[0].code); 
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
			 * 根据code获取二级地区列表 ,
			 */
			getTwoAreaList(two_level_code){
				this.axios.get(`${this.commonJs.basePath}/v1/area/children`,
					{params: {parent_area_code: two_level_code, scope: 1}}).then( (response) => {
					if(response.data.errcode === 0){ 
						this.area_list[1].values = response.data.data;
						this.getThreeAreaList(response.data.data[0])
					}else{
						this.$toast.fail(response.data.message);
					}
				}).catch( (error) => {
					//this.$toast.fail(error);
				});
			},
			/*
			 * 根据code获取三级地区列表
			 */
			getThreeAreaList(two_levelData){
				this.axios.get(`${this.commonJs.basePath}/v1/area/children`,
					{params: {parent_area_code: two_levelData.province_code, city_code: two_levelData.code, scope:'2',}}).then( (response) => {
					if(response.data.errcode === 0){ 
						this.area_list[2].values = response.data.data;
					}else{
						this.$toast.fail(response.data.message);
					}
				}).catch( (error) => {
					//this.$toast.fail(error);
				});
			},
		}
	};
</script>

<style>
	.form-content .plate.goods .goods-info-title .van-field .van-cell__title{
		max-width: 50px !important;/* 设置title最大宽度 */
	}
</style>

<style scoped>
	.mint-toast{
		z-index: 3000 !important;
	}
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
	.receive-send .receive-send-icon_{
		width: 12px;
		height: 12px;
		border: 4px solid #2bcb84;
		border-radius: 50%;
		box-sizing: border-box;
		margin:8% 16px;
	}
	.receive-send .receive-send-icons{
		width: 12px;
		height: 12px;
		border: 4px solid #f44;
		border-radius: 50%;
		box-sizing: border-box;
		margin: 16px;
	}
	.receive-send .receive-send-icons_{
		width: 12px;
		height: 12px;
		border: 4px solid #f44;
		border-radius: 50%;
		box-sizing: border-box;
		margin:8% 16px;
	}
	.receive-send .receive-send-info{
		color: #666;
    font-size: 13px;
		margin-top: 12px;
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
	.receive-send .receive-send-arrow{
		margin-right: 4%;
		margin-top: 15px;
	}
	.receive-send .receive-send-arrow_{
		margin-right: 4%;
		margin-top:7%;
	}
	.receive-send .receive-send-arrow .van-icon{
		color: #999;
		font-size: 13px;
	}
	.receive-send .receive-send-arrow_ .van-icon{
		color: #999;
		font-size: 13px;
	}
	
	/* 弹出层style */
	.van-popup.car-popup{
		background-color: #F7F7F7 !important;/* 弹出层背景色 */
	}
	.van-popup.goods-photo{
		background-color: #e8e8e8 !important/* 弹出层背景色 */
	}
	.van-popup.goods-photo .van-uploader{
		width: 100%;
	}
	.van-popup--right.car-popup{
		width: 100%;
    height: 100%;
	}
	.van-popup--bottom.car-popup{
		width: 100%;
		height: 32%;
	}
	.van-popup--right.car-popup .van-nav-bar__title{
		font-size: 14px;/* 导航标题字体大小 */
	}
	
	/* 弹框style */
	.tips-dialog{
		text-align: center;
	}
	.tips-dialog .van-dialog__message{
		line-height: 50px;
	}
	
	/* 按钮切换颜色 */
	.activebg{
		background-color: #2391e2;
		color: #fff;
	}
	/* 导航style */
	.nav{
		width: 100%;
		position: fixed;
		top: 0;
		height: 45px;
		border-bottom: 1px solid #F7F7F7;
		background: #fff;
		color: #222;
		text-align: center;
		z-index: 10;
	}
	.nav .nav-item-l{
		width: 15%;
	}
	.nav .nav-item-m{
		width: 70%;
	}
	.nav .nav-item-m .btn-l{
		border-right-width: 0;
		border-bottom-right-radius: 0;
		border-top-right-radius: 0;
	}
	.nav .nav-item-m .btn-r{
		border-bottom-left-radius: 0;
		border-top-left-radius: 0;
	}
	.nav .nav-item-r{
		width: 15%;
	}

	/* 表单信息的style */
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
	.form-content .plate .b-r{
		border-right: 1px solid #eee;/* 添加右边框 */
	}
	.form-content .plate .van-field__icon .van-icon{
		font-size: 12px;/* 设置箭头大小 */
	}
	.form-content .plate.goods .van-cell__title{
		text-align: left;/* 设置单元格的标题的text-align */
	}
	.form-content .plate .pay .van-radio .van-icon-checked{
		color: #2391e2;/* 设置单选按钮的颜色 */
	}
	.form-content .plate .is-buy .van-switch--on{
		background-color: #2391e2;/* 设置开关按钮的颜色 */
	}
	.form-content .plate .img{
		overflow: hidden;
	}
	.form-content .plate .img .goods-image{
		width: 50px;
    height: 50px;
    border: 2px dotted;
    line-height: 45px;
    text-align: center;
    font-size: 50px;
    color: #777474;
		margin: 2px 2px 0 0;
	}
	.form-content .plate .img .border-none{
		border: 2px dotted transparent;
	}
	.form-content .plate.martba{
		margin: 15px auto;/* 设置发布按钮的margin */
	}
	.form-content .formItem-title{
		color: #2391e2;
    padding: 10px 0 5px 2%;
    text-align: left;
    font-size: 14px;
    font-weight: normal;
	}

	/* 选择车辆类型与长度 style */
	.select-menu{
		overflow: hidden;
		width: 100%;
		padding: 20px 20px 10px 20px;
		box-sizing: border-box;
	}
	.select-menu .select-menu-item{
		padding: 5px 10px;
		box-sizing: border-box;
		text-align: center;
		background: #f1efef;
		margin: 0 5px 5px 0;
		color: #6d6767;
		border-radius: 4px;
		font-size: 13px;
	}
	.select-menu .tips{
		clear: both;
    font-size: 12px;
    text-align: left;
    width: 100%;
    color: #9a9696;
	}

	/* 货物照片底部弹出层style */
	.photo-popup{
		padding: 20px;
	}
	.photo-popup button{
		box-shadow: 0 4px 10px rgb(84, 92, 100, 0.5);
	}

	/* 货物信息右侧弹出层style */
	.goods-popup{
		overflow: hidden;
	}
	.goods-popup .goods-info{
		background: #fff;
		padding: 5px 10px;
	}
	.goods-popup .goods-info .van-cell__title{
		text-align: left;/* 设置单元格的标题的text-align */
	}
	.goods-popup .goods-info .info-input{
		overflow: hidden;
	}
	.goods-popup .goods-info .info-input .input-item{
		line-height: 44px;
    border-bottom: 1px solid #f7f7f7;
		height: 44px;
		font-size: 14px;
	}
	.goods-popup .goods-info .info-input .input-item .item-title{
		padding-left: 15px;
		margin-right: 8px;
	}
	.goods-popup .goods-info .info-input .input-item input{
		background: #eee;
    text-align: center;
    height: 30px;
    margin-top: 7px;
		margin-right: 5px;
	}
	.goods-popup .goods-info .info-input .input-item .item-unit{
		margin-right: 8px;
	}
	.goods-popup .goods-info .info-input .input-item button{
		margin-top: 10px;
	}
	.goods-popup .goods-info .info-input .input-item i{
		margin-top: 12px;
		font-size: 18px;
	}
	.goods-popup .goods-info .info-input .input-item .item-line{
		margin-right: 5px;
	}
	.goods-popup .goods-info .info-input .input-w50{
		width: 50px;
	} 

	/* 发货人与收货人信息右侧弹出层style */
	.personnel-popup{
		overflow: hidden;
	}
	.personnel-popup .personnel-info{
		background: #fff;
		padding: 5px 10px;
	}
	.personnel-popup .personnel-info .van-cell__title{
		text-align: left;/* 设置单元格的标题的text-align */
	}
	.personnel-popup .personnel-info .icon-arrow .van-field__icon .van-icon{
		font-size: 12px;/* 设置箭头大小 */
	}
	.personnel-popup .personnel-info .icon-location .van-field__icon .van-icon{
		color: #38f;/* 设置图标颜色 */
	}
	.personnel-popup .personnel-info .contact-select{
		margin-top: 5%;
	}
	.personnel-popup .personnel-info .contact-icon{
		text-align: center;
	}
	.personnel-popup .personnel-info .contact-select .van-icon-contact{
		color: #38f;/* 设置图标颜色 */
		font-size: 24px;/* 设置图标大小 */
	}
	.personnel-popup .personnel-info .contact-select .text{
		color: #38f;
	}
</style>
