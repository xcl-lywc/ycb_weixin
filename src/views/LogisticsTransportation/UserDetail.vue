<!--
	个人基本信息 type: 1为车主，2为货主
 -->
<template>
  <div  class="pendingOrder">
		<div v-if="userData">
			<!-- 导航栏 -->
			<van-nav-bar
				:title="userData.type == 1 ? '司机认证' : $store.state.cargoOwnerType == 1 ? '个人货主认证' : '企业货主认证'"
				left-text=""
				left-arrow
				@click-left="$router.push({path: '/my'})"
			/>
			<van-steps v-if="userData.type == 1" :active="stepActive">
			  <van-step>司机信息</van-step>
			  <van-step>车辆信息</van-step>
			</van-steps>
			<div class="mart10">
				<!-- 车主 -->
				<div v-if="userData.type == 1">
					<!-- userData.ext_info.status 认证状态:1未认证, 2 审核中 3已经认证 4 认证未通过 -->
					<van-cell-group>
						<van-field
				  		label="姓名"
				  		v-model="userData.ext_info.name"
				  		placeholder="请输入姓名"
							:disabled="userData.ext_info.status != 1"  />
						<van-field
				  		label="身份证号"
				  		v-model="userData.ext_info.id_card_num"
				  		placeholder="请输入身份证号码"
							:disabled="userData.ext_info.status != 1"  />
						<van-field
						  v-if="userData.type == 1"
						  @click=" carShow = true; selectType = 'vehicle_types' "
				  		:readonly="true"
				  		label="准驾车型"
				  		v-model="userData.ext_info.vehicle_types"
				  		placeholder="请选择准驾车型"
							:disabled="userData.ext_info.status != 1"  />
						<van-field
							@click=" carShow = true; selectType = 'areaDetail' "
				  		:readonly="true"
				  		label="所在区域"
				  		v-model="areaDetail"
				  		placeholder="请选择省市区"
							:disabled="userData.ext_info.status != 1"  />
						<van-field
				  		label="详细地址"
				  		v-model="userData.ext_info.address"
				  		placeholder="请输入详细地址"
							:disabled="userData.ext_info.status != 1"  />
					</van-cell-group>
					<van-cell-group class="mart10">
						<van-cell>
			  	 		上传货主真实头像
				      <div class="mar5">
				      	<van-uploader
				      		:disabled="userData.ext_info.status != 1"
				      		:after-read="((val) => {onFileUpload (val, 'selfie')})"
				      		>
				      		<img
				      			v-if="userData.ext_info.selfie"
				      			:src="userData.ext_info.selfie"
				      			width="80px"
				      			height="80px"/>
								  <van-icon v-else name="photograph" />
								</van-uploader>
				      </div>
			  	  </van-cell>
			  	  <van-cell>
			  	 		上传货主本人身份证正面照
				      <div class="mar5">
				      	<van-uploader
				      		:disabled="userData.ext_info.status != 1"
				      		:after-read="((val) => {onFileUpload (val, 'id_card_num_a')})"
				      		>
				      		<img
				      			v-if="userData.ext_info.id_card_num_a"
				      			:src="userData.ext_info.id_card_num_a"
				      			width="80px"
				      			height="80px"/>
								  <van-icon v-else name="photograph" />
								</van-uploader>
				      </div>
			  	  </van-cell>
			  	  <van-cell v-if="userData.type == 1" >
			  	 		上传与身份证一致的驾驶证
				      <div class="mar5">
				      	<van-uploader
				      		:disabled="userData.ext_info.status != 1"
				      		:after-read="((val) => {onFileUpload (val, 'driving_license')})"
				      		>
				      		<img
				      			v-if="userData.ext_info.driving_license"
				      			:src="userData.ext_info.driving_license"
				      			width="80px"
				      			height="80px"/>
								  <van-icon v-else name="photograph" />
								</van-uploader>
				      </div>
			  	  </van-cell>
			  	  <van-cell v-if="userData.type == 1" >
			  	 		上传驾驶证持有人从业资格证照
				      <div class="mar5">
				      	<van-uploader
				      		:disabled="userData.ext_info.status != 1"
				      		:after-read="((val) => {onFileUpload (val, 'job_cert')})"
				      		>
				      		<img
				      			v-if="userData.ext_info.job_cert"
				      			:src="userData.ext_info.job_cert"
				      			width="80px"
				      			height="80px"/>
								  <van-icon v-else name="photograph" />
								</van-uploader>
				      </div>
			  	  </van-cell>
					</van-cell-group>
				</div>
				<!-- 货主 -->
				<div v-if="userData.type == 2">
					<!-- userData.ext_info.status 认证状态:1未认证, 2 审核中 3已经认证 4 认证未通过 -->
					<!-- cargoOwnerType 1为个体货主 2为企业货主 -->
					<div v-if="$store.state.cargoOwnerType == 1">
						<van-cell-group>
							<van-field
					  		label="姓名"
					  		v-model="userData.ext_info.name"
					  		placeholder="请输入姓名"
								:disabled="userData.ext_info.status != 1"  />
							<van-field
					  		label="身份证号"
					  		v-model="userData.ext_info.id_card_num"
					  		placeholder="请输入身份证号码"
								:disabled="userData.ext_info.status != 1"  />
							<van-field
								@click=" carShow = true; selectType = 'areaDetail' "
					  		:readonly="true"
					  		label="所在区域"
					  		v-model="areaDetail"
					  		placeholder="请选择省市区"  
					  		:disabled="userData.ext_info.status != 1"/>
							<van-field
					  		label="详细地址"
					  		v-model="userData.ext_info.address"
					  		placeholder="请输入详细地址"
								:disabled="userData.ext_info.status != 1"  />
						</van-cell-group>
						<van-cell-group class="mart10">
							<van-cell>
				  	 		上传货主真实头像
					      <div class="mar5">
					      	<van-uploader
					      		:disabled="userData.ext_info.status != 1"
					      		:after-read="((val) => {onFileUpload (val, 'selfie')})"
					      		>
					      		<img
					      			v-if="userData.ext_info.selfie"
					      			:src="userData.ext_info.selfie"
					      			width="80px"
					      			height="80px"/>
									  <van-icon v-else name="photograph" />
									</van-uploader>
					      </div>
				  	  </van-cell>
				  	  <van-cell>
				  	 		上传货主本人身份证正面照
					      <div class="mar5">
					      	<van-uploader
					      		:disabled="userData.ext_info.status != 1"
					      		:after-read="((val) => {onFileUpload (val, 'id_card_num_a')})"
					      		>
					      		<img
					      			v-if="userData.ext_info.id_card_num_a"
					      			:src="userData.ext_info.id_card_num_a"
					      			width="80px"
					      			height="80px"/>
									  <van-icon v-else name="photograph" />
									</van-uploader>
					      </div>
				  	  </van-cell>
						</van-cell-group>
					</div>
					<div v-if="$store.state.cargoOwnerType == 2">
						<van-cell-group>
							<van-field
					  		label="公司名称"
					  		v-model="userData.ext_info.name"
					  		placeholder="请输入公司名称"
								:disabled="userData.ext_info.status != 1"  />
							<van-field
								@click=" carShow = true; selectType = 'areaDetail' "
					  		:readonly="true"
					  		label="公司区域"
					  		v-model="areaDetail"
					  		placeholder="请选择省市区"
								:disabled="userData.ext_info.status != 1"  />
							<van-field
					  		label="详细地址"
					  		v-model="userData.ext_info.address"
					  		placeholder="请输入详细地址"
								:disabled="userData.ext_info.status != 1"  />
							<van-field
					  		label="企业法定代表"
					  		v-model="userData.ext_info.legal_name"
					  		placeholder="请输入企业法定代表姓名"
								:disabled="userData.ext_info.status != 1"  />
							<van-field
					  		label="企业联系电话"
					  		v-model="userData.ext_info.company_phone"
					  		placeholder="请输入企业联系电话"
								:disabled="userData.ext_info.status != 1"  />
							<van-field
					  		label="联系人"
					  		v-model="userData.ext_info.company_contact_name"
					  		placeholder="请输入联系人"
								:disabled="userData.ext_info.status != 1"  />
							<van-field
					  		label="联系人电话"
					  		v-model="userData.ext_info.company_contact_cellphone"
					  		placeholder="请输入联系人电话"
								:disabled="userData.ext_info.status != 1"  />
						</van-cell-group>
						<van-cell-group class="mart10">
							<van-cell>
				  	 		上传企业营业执照
					      <div class="mar5">
					      	<van-uploader
					      		:disabled="userData.ext_info.status != 1"
					      		:after-read="((val) => {onFileUpload (val, 'business_license')})"
					      		>
					      		<img
					      			v-if="userData.ext_info.business_license"
					      			:src="userData.ext_info.business_license"
					      			width="80px"
					      			height="80px"/>
									  <van-icon v-else name="photograph" />
									</van-uploader>
					      </div>
				  	  </van-cell>
						</van-cell-group>
					</div>
				</div>


				<div v-if="userData.type == 1" class="mart10 marb15">
					<van-button size="large" type="primary" @click=" saveVehicleOwnerInfo ">下一步</van-button>
				</div>
				<!-- 类型为货主 并且是在未认证的状态下 -->
				<div v-if="userData.type == 2 && userData.ext_info.status == 1" class="mart10 marb15">
					<van-button size="large" type="primary" @click=" saveCargoOwnerInfo ">提交申请</van-button>
				</div>
			</div>
		</div>
		<!-- 车辆信息 -->
		<van-popup class="set-popup" v-model="carPopupShow" position="right" :overlay="false">
		  <car-detail @closeCarDetail=" carPopupShow = false; "></car-detail>
		</van-popup>

		<!-- 选择 -->
		<van-popup
			close-on-click-overlay
			v-model="carShow"
			position="bottom"
			:overlay="true"
			:overlay-style="{background: 'transparent'}">
			<!-- 车型 -->
			<van-picker
				v-show="selectType == 'vehicle_types'"
				:show-toolbar="true"
				:columns="configMesg.driving_license_types || ''"
				@confirm="((val) => { ( onCarSelectChange(val, 'vehicle_types') ) })" />
			<!-- 所在区域 -->
			<van-picker
				v-if="selectType == 'areaDetail'"
				show-toolbar
				:columns="area_list"
				@cancel="showAddress = false"
				@confirm="((val, index) => {onConfirmAddress(val,index, 'cargo_area_name', 'cargo_area_code')})"
				@change="onChangeArea"
				value-key="name"/>
		</van-popup>
		<div v-show="isLoading" class="fullScreen-loding"><van-loading type="spinner"/></div>
  </div>
</template>

<script>
	import carDetail from './CarDetail.vue'
	export default {
		components:{
			'car-detail': carDetail,
		},
		data(){
			return{
				isLoading: 		false,
				userData: 		JSON.parse(this.getCookie('userData')),
				configMesg:   JSON.parse(sessionStorage.getItem('configMesg')),
				areaDetail:  	'', //地址详细信息
				stepActive: 	0,   //步骤条选中节点
				carPopupShow: false, // 车辆信息显示节点
				carShow: 		  false,
				selectType:  	null,  //下拉选项类型
				area_list:    [ { values:[] }, { values:[] }, { values:[] } ],
			};
		},
		watch:{ 
		},
		computed:{
		},
		methods:{
			getUserInfo(){
				this.isLoading = true;
				this.userData = null;
	  		this.axios.post(`${this.commonJs.basePath}/v1/users/info`, '').then( (response) => {
					this.userData = response.data.data;
					this.getRegionAddressByAreaCode(response.data.data);
					this.setCookie('userData', JSON.stringify(response.data.data));
					this.$store.state.userData = response.data.data;
					this.isLoading = false;
	  		}).catch( (error) => {
	  			this.isLoading = false;
	  			this.$toast(error)
	  		});
	  	},
			/*
			 * 根据区域编号获取区域详细信息
			 */
			getRegionAddressByAreaCode(userDataI){
				this.axios.get(`${this.commonJs.basePath}/v1/area/info`,
					{params: {area_code: userDataI.ext_info.area_code}}).then((response) => {
						let responseData = response.data.data;
						this.areaDetail = `${responseData.province_code_name ? responseData.province_code_name :'' }${responseData.city_code_name ? responseData.city_code_name : ''}${responseData.city_code_name ? responseData.city_code_name : ''}`;

				}).catch((error) => {
						this.$toast(error);
				})
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
			
			/*
				选择并确认出发地与收货地地址
			*/
			onConfirmAddress(value,index){
				// ----------- 获取最后一个地址code -------
				if(value[value.length-1] != undefined){
					this.userData.ext_info.area_code = value[value.length-1].code;
				}
				// --------- 获取地址详情 --------
				this.areaDetail = '';
				value.forEach( (item) => {
					this.areaDetail += item.name;
				});
				this.carShow = false;
			},
			/*
			 * 牌照首字改变
			 * @params {string} val 被选中的值
			 * @params {string} keyName  保存在数据库的key
			 */
			onCarSelectChange(val,keyName){
				this.userData.ext_info[keyName] = val;
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
					this.userData.ext_info[keyName] = `${base_url}${response.data.key}`;
					this.isLoading = false;
				}).catch((error) => {
						this.$toast(error);
						this.isLoading = false;
				})
			},
			/*
			 * 提交车主信息
			 * 当用户还是在未认证的情况下，需要保存当前填写的用户信息
			 */
			saveVehicleOwnerInfo(){
				// this._submitVehicleOwnerInfo()
				this.userData.ext_info.status == 1 ? this._submitVehicleOwnerInfo() : this.carPopupShow = true;
			},
			_submitVehicleOwnerInfo(){
				if(this._formValidate(this._submitVehicleOwnerParams())){
					this.isLoading = true;
					this.axios.post(`${this.commonJs.basePath}/v1/vehicle-owner/update`, this._submitVehicleOwnerParams())
					.then((response) => {
						this.isLoading = false;
						this.getUserInfo();
						this.carPopupShow = true;
					}).catch((error) => {
						this.isLoading = false;
						this.$toast(error);
					})
				}
			},
			_submitVehicleOwnerParams(){
				return {
					name	: this.userData.ext_info.name,
					id_card_num	 : this.userData.ext_info.id_card_num,
					vehicle_types	 : this.userData.ext_info.vehicle_types,
					area_code	 : this.userData.ext_info.area_code,
					address	 : this.userData.ext_info.address,
					selfie: this.userData.ext_info.selfie,
					id_card_num_a	 : this.userData.ext_info.id_card_num_a,
					id_card_num_b	 : this.userData.ext_info.id_card_num_a,
					driving_license : this.userData.ext_info.driving_license,
					job_cert	: this.userData.ext_info.job_cert,
				}
			},
			/*
			 * 验证表单
			 */
			_formValidate(formData){
				for(let key in formData){
					// ---------- 只要有一个为null 就返回 -----
					if(!formData[key]){
						this._promptMesg(key);
						return false;
					}else if(key == 'id_card_num'){ //身份证号码二次验证
						if(!this._identityCodeValid(formData[key])){
							this._promptMesg(key);
							return false;
						}
					}
				}
				return true;
			},
			/*
			 * 验证身份证是否有效
			 */
			_identityCodeValid(code) {
        var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
        var tip = "";
        var pass= true;

        if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
            tip = "身份证号格式错误";
            pass = false;
        }

       else if(!city[code.substr(0,2)]){
            tip = "地址编码错误";
            pass = false;
        }
        else{
            //18位身份证需要验证最后一位校验位
            if(code.length == 18){
                code = code.split('');
                //∑(ai×Wi)(mod 11)
                //加权因子
                var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
                //校验位
                var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
                var sum = 0;
                var ai = 0;
                var wi = 0;
                for (var i = 0; i < 17; i++)
                {
                    ai = code[i];
                    wi = factor[i];
                    sum += ai * wi;
                }
                var last = parity[sum % 11];
                if(parity[sum % 11] != code[17]){
                    tip = "校验位错误";
                    pass =false;
                }
            }
        }
        return pass;
      },
      /*
       *  用户提示信息
       */
      _promptMesg(keyName){
      	switch(keyName){
      		case 'name':
      			this.$toast(this.userData.type == 2 && this.$store.state.cargoOwnerType == 2 ? '公司名称不能为空' : '名字不能为空');
      			break;
      		case 'id_card_num':
      			this.$toast('请输入有效的身份证号');
      			break;
      		case 'vehicle_types':
      			this.$toast('准驾车型不能为空');
      			break;
      		case 'area_code':
      			this.$toast('所在区域不能为空');
      			break;
      		case 'address':
      			this.$toast('详细地址不能为空');
      			break;
      		case 'selfie':
      			this.$toast(this.userData.type == 1 ? '请上传驾驶证持有人真实头像' : '请上传货主真实头像');
      			break;
      		case 'id_card_num_a':
      			this.$toast(this.userData.type == 1 ? '请上传驾驶证持有人身份证正面照' : '请上传货主本人身份证正面照');
      			break;
      		case 'id_card_num_b':
      			this.$toast('请上传驾驶证持有人身份证正面照');
      			break;
      		case 'driving_license':
      			this.$toast('请上传与身份证一致的驾驶证');
      			break;
      		case 'job_cert':
      			this.$toast('请上传驾驶证持有人从业资格证照');
      			break;
      		case 'legal_name':
      			this.$toast('请输入法人姓名');
      			break;
      		case 'company_phone':
      			this.$toast('请输入企业联系电话');
      			break;
      		case 'company_contact_name':
      			this.$toast('请输入联系人姓名');
      			break;
      		case 'company_contact_cellphone':
      			this.$toast('请输入联系人电话');
      			break;
      		case 'business_license':
      			this.$toast('请上传营业执照');
      			break;
      	}

      },
      /*
			 * 提交货主信息
			 * 当用户还是在未认证的情况下，需要保存当前填写的用户信息
			 */
      saveCargoOwnerInfo(){
      	if(this._formValidate(this._submitCargoOwnerParams())){
					this.isLoading = true;
					this.axios.post(`${this.commonJs.basePath}/v1/cargo-owner/update`, this._submitCargoOwnerParams())
					.then((response) => {
						this.isLoading = false;
						this.getUserInfo();
					}).catch((error) => {
						this.isLoading = false;
						this.$toast(error);
					})
				}
      },
      _submitCargoOwnerParams(){
    		let personal = { // 个人表单
					type: 			 	 		this.$store.state.cargoOwnerType, //认证类型 1 个人 2 公司
					cargo_owner_type: this.$store.state.cargoOwnerType, //1公司 2个人
					name: 			 	 		this.userData.ext_info.name,
					id_card_num: 	 		this.userData.ext_info.id_card_num,
					area_code: 	 	 		this.userData.ext_info.area_code,
					address: 	   	 		this.userData.ext_info.address,
					selfie: 		 	 		this.userData.ext_info.selfie,
					id_card_num_a: 		this.userData.ext_info.id_card_num_a,
				}
				let enterprise = { // 企业表单
					type: 			 	 						 this.$store.state.cargoOwnerType, //认证类型 1 个人 2 公司
					cargo_owner_type: 				 this.$store.state.cargoOwnerType, //1公司 2个人
					name: 			 	 						 this.userData.ext_info.name,
					area_code: 	 	 						 this.userData.ext_info.area_code,
					address: 	   	 						 this.userData.ext_info.address,
					legal_name: 	   	 				 this.userData.ext_info.legal_name,
					company_phone: 	   	 			 this.userData.ext_info.company_phone,
					company_contact_name: 	   this.userData.ext_info.company_contact_name,
					company_contact_cellphone: this.userData.ext_info.company_contact_cellphone,
					business_license: 		 	   this.userData.ext_info.business_license,
				}
				return this.$store.state.cargoOwnerType == 1 ? personal : enterprise;
			},
		},
		mounted(){
			// ------------ 未认证（1）的情况下就，重新查询一遍数据 ------ 
			if(this.userData.ext_info.status == 1) this.getUserInfo();
			this.getOneAreaList();
			this.getRegionAddressByAreaCode(this.userData);

		},
	};
</script>

<style>
/* 弹出层style */
.van-popup--right.set-popup{
	width: 100%;
}
</style>
