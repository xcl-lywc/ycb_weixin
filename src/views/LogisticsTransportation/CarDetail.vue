
<!--
	车辆基本信息 type: 1为车主，2为货主
 -->
<template>
  <div class="pendingOrder">
		<!-- 导航栏 -->
		<van-nav-bar
			:title="userData.type == 1 ? '司机认证' : '个人货主认证'"
			left-arrow
			fixed
			@click-left="$emit('closeCarDetail')"
		/>
		<van-steps style="margin-top: 45px;" :active="stepActive">
		  <van-step>司机信息</van-step>
		  <van-step>车辆信息</van-step>
		</van-steps>
		<div class="mart10">
			<van-cell-group>
		  	<van-field
					label="车牌号"
					v-model="carForm.plate_number"
					placeholder="请输入车牌号"
					clearable
					:disabled="disableAttrib"
					>
					<template slot="label" >
						车牌号
						<span v-if="!disableAttrib" @click=" carShow = true; selectType = 'carNumberFirstValue' ">{{carNumberFirstValue}}<i class="select-arrow"></i></span>
					</template>
				</van-field>
		  	<van-field
		  		@click=" carShow = true; selectType = 'type' "
		  		:readonly="true"
					label="车型"
					v-model="carForm.type"
					:disabled="disableAttrib"
					placeholder="请选择车型"
					clearable>
				</van-field>
		  	<van-field
		  		@click=" carShow = true; selectType = 'length' "
		  		:readonly="true"
					label="车长"
					v-model="carForm.length"
					:disabled="disableAttrib"
					placeholder="请选择车长"
					clearable/>
		  	<van-field
					label="载重"
					v-model="carForm.load"
					:disabled="disableAttrib"
					placeholder="请输入载重"
					clearable/>
		  	<van-field
					label="装货体积"
					v-model="carForm.volume"
					:disabled="disableAttrib"
					placeholder="请输入装货体积(单位m³)"
					clearable/>
		  	<van-field
					label="车辆品牌"
					v-model="carForm.brand"
					:disabled="disableAttrib"
					placeholder="请输入车辆品牌"
					clearable/>
		  	<van-field
		  		@click=" carShow = true; selectType = 'factory_year' "
		  		label="出厂年份"
		  		:readonly="true"
		  		v-model="carForm.factory_year"
					:disabled="disableAttrib"
					placeholder="请选择出厂年份"
					clearable/>
	  	  <van-cell  class="mart10">
	  	 		上传注册车辆行驶证
		      <div class="mar5">
		      	<van-uploader
		      		:disabled="disableAttrib ? true : false"
		      		:after-read="((val) => {onFileUpload (val, 'vehicle_license')})"
		      		>
						  <img
		      			v-if="carForm.vehicle_license"
		      			:src="carForm.vehicle_license"
		      			width="80px"
		      			height="80px"/>
						  <van-icon v-else name="photograph" />
						</van-uploader>
		      </div>
	  	  </van-cell>
	  	  <van-cell>
	  	 		上传车辆运营证
		      <div class="mar5">
		      	<van-uploader
		      		:disabled="disableAttrib ? true : false"
		      		:after-read="((val) => {onFileUpload (val, 'vehicle_operating_license')})"
		      		>
						  <img
		      			v-if="carForm.vehicle_operating_license"
		      			:src="carForm.vehicle_operating_license"
		      			width="80px"
		      			height="80px"/>
						  <van-icon v-else name="photograph" />
						</van-uploader>
		      </div>
	  	  </van-cell>
	  	  <van-cell>
	  	 		上传车辆保险卡
		      <div class="mar5">
		      	<van-uploader
		      		:disabled="disableAttrib ? true : false"
		      		:after-read="((val) => {onFileUpload (val, 'vehicle_insurance_card')})"
		      		>
		      		<img
		      			v-if="carForm.vehicle_insurance_card"
		      			:src="carForm.vehicle_insurance_card"
		      			width="80px"
		      			height="80px"/>
						  <van-icon v-else name="photograph" />
						</van-uploader>
		      </div>
	  	  </van-cell>
			</van-cell-group>
			<div v-if="!disableAttrib" class="mart10 marb15">
				<van-button size="large" type="primary" @click="saveForm">提交申请</van-button>
			</div>
		</div>
		<!-- 选择 -->
		<van-popup
			close-on-click-overlay
			v-model="carShow"
			position="bottom"
			:overlay="true"
			:overlay-style="{background: 'transparent'}">
			<!-- 车牌号 -->
			<van-picker
				v-show="selectType == 'carNumberFirstValue'"
				:show-toolbar="true"
				:columns="configMesg.car_number.first"
				@confirm="((val) => { ( onCarSelectChange(val, 'carNumberFirstValue') ) })" />
			<!-- 车型 -->
			<van-picker
				v-show="selectType == 'type'"
				:show-toolbar="true"
				:columns="configMesg.vehicle_types"
				@confirm="((val) => { ( onCarSelectChange(val, 'type') ) })" />
			<!-- 车长 -->
			<van-picker
				v-show="selectType == 'length'"
				:show-toolbar="true"
				:columns="configMesg.vehicle_lengths"
				@confirm="((val) => { ( onCarSelectChange(val, 'length') ) })" />
			<!-- 车辆出厂年份 -->
			<van-datetime-picker
				v-show="selectType == 'factory_year'"
				v-model="hideYear"
			  type="date"
			  :min-date="minDate"
			  @confirm="((val) => { ( onCarSelectChange(val, 'factory_year') ) })"
			/>
		</van-popup>
		<div v-show="isLoading" class="fullScreen-loding"><van-loading type="spinner"/></div>
  </div>
</template>

<script>
	export default {
		data(){
			return{
				isLoading:   false,
	      minDate: 		 new Date(1991, 1, 1),
				userData:    JSON.parse(this.getCookie('userData')),
				configMesg:  JSON.parse(sessionStorage.getItem('configMesg')),
				areaDetail:  null, //地址详细信息
				stepActive:  1,    //步骤条选中节点
				carShow: 		 false,
				selectType:  null,  //下拉选项类型
				carForm:{
					plate_number:   					 null, // 车牌号
					type: 										 null, //	车辆类型
					length: 									 null, // 车辆长度, 米
					load: 										 null, // 车辆载重, 吨
					volume:                    null, // 装货体积, 立方米
					brand: 										 null, // 车辆品牌
					factory_year: 						 null, // 车辆出厂年份
					vehicle_license: 				 	 null, // 车辆行驶证
					vehicle_operating_license: null, // 车辆运营证
					vehicle_insurance_card: 	 null, // 车辆保险卡
				},
				carNumberFirstValue: 			 JSON.parse(sessionStorage.getItem('configMesg')).car_number.first[0],
				hideYear: 								 new Date(), // 隐藏的时间
			};
		},
		computed :{
			disableAttrib :function () {
				const status = this.userData.ext_info.status
				return status ==2 || status ==3
			}
		},
		methods:{
			getCarDetail(){
				this.isLoading = true;
				this.axios.get(`${this.commonJs.basePath}/v1/vehicle/get`, '').then((response) => {
					this.carForm = response.data.data;
					this.isLoading = false;
				}).catch((error) => {
						this.$toast(error);
						this.isLoading = false;
				})
			},
			/*
			 * 根据区域编号获取区域详细信息
			 */
			getRegionAddressByAreaCode(){
				this.axios.get(`${this.commonJs.basePath}/v1/area/info`,
					{params: {area_code: this.userData.ext_info.area_code}}).then((response) => {
						this.areaDetail = response.data.data;
				}).catch((error) => {
						this.$toast(error);
				})
			 },
			/*
			 * 牌照首字改变
			 * @params {string} val 被选中的值
			 * @params {string} keyName  保存在数据库的key
			 */
			onCarSelectChange(val,keyName){
				switch(keyName){
					case 'factory_year':
						this.carForm[keyName] = this.commonJs._convertDate(val, 'yyyy-MM-dd')
						break;
					case 'carNumberFirstValue':
					  this[keyName] = val;
					  break;
					default:
						this.carForm[keyName] = val;
						break;
				}
				this.carShow = false;
			},
			/*
			 * 附件上传，
			 * @params {object} 附件
			 * @params {string} keyName 保存在数据库的key
			 */
			onFileUpload(val,keyName){
				this._fileUpload(val,keyName);
			},
			_fileUpload(val,keyName){
				this.isLoading = true;
				let param = new FormData(); //创建form对象

        param.append('file',val.file,val.file.name)
				let config = {
          headers:{'Content-Type':'multipart/form-data'}
        };

				this.axios.get(`${this.commonJs.basePath}/v1/file/token/get`, {params: {file: val.file}}).then((response) => {
          param.append('token',response.data.data.uptoken);

					this._fileQiniu(param,config,keyName, response.data.data.base_url);
				}).catch((error) => {
						this.$toast(error);
						this.isLoading = false;
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
				this.axios.post(`${this.commonJs.filePath}`, param, config).then((response) => {
					this.carForm[keyName] = `${base_url}${response.data.key}`;
					this.isLoading = false;
				}).catch((error) => {
					this.$toast(error);
					this.isLoading = false;
				})
			},
			/*
			 * 保存车辆信息
			 */
			saveForm(){
				this.carForm.plate_number = this.carNumberFirstValue + this.carForm.plate_number;
				this.axios.post(`${this.commonJs.basePath}/v1/vehicle/add`, this.carForm).then((response) => {
					this.$router.push({path: '/my'})
					this.$toast('提交成功');
				}).catch((error) => {
						this.$toast(error);
				})
			}
		},
		mounted(){
			// this.getRegionAddressByAreaCode();
			this.getCarDetail();
		},
	};
</script>

<style>
.van-field--disabled .van-field__control{
	color: #000!important;
}
</style>
