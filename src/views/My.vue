<template>
  <div class="my">
		<!-- 导航 -->
    <van-nav-bar title="我的" fixed>
			<!-- <van-icon name="info-o" slot="right" @click="showNewsP opup = true"/> -->
			<van-icon name="setting" slot="right" class="marl15" @click="showSetPopup = true"/>
		</van-nav-bar>
		<!-- 个人信息 -->
		<ul class="my-info" v-if="userData">
			<li class="fl head-image">
				<img :src="userData.ext_info.selfie" alt="头像" :onerror="defaultImg">
				<!-- <img v-else src="../assets/images/icon_avatar.png"/> -->
			</li>
			<li class="fl name-tel">
				<p class="name">{{userData.ext_info.name}}</p>
				<p class="tel">{{userData.cellphone}}</p>
			</li>  
			<!-- 用户类型是货主并且没有认证，否则直接跳转到用户信息页面 -->
			<li v-if="userData.ext_info.status == 1 && userData.type == 2" @click="cargoOwnerTypePopup = true " class="fr identification">{{userData.ext_info.status_desc}}<van-icon name="arrow"/></li>
			<li v-else @click="$router.push({path: '/my/user_detail'})" class="fr identification">{{userData.ext_info.status_desc}}<van-icon name="arrow"/></li>

		</ul>
		<!-- 物流运输 -->
		<div v-if="userData" class="transportation">
			<p class="title">物流运输</p>
			<van-tabbar v-model="active" :fixed="false" @change="onChange" class="transportation-tab">
				<van-tabbar-item v-if="userData.type == 2" icon="pending-orders" :info="userData.order.waiting_num" to="my/pending_order">待接单</van-tabbar-item>

				<van-tabbar-item v-if="userData.type == 2" icon="pending-deliver" :info="userData.order.process_num" to="my/pending_deliver">进行中</van-tabbar-item>
				<van-tabbar-item  v-if="userData.type == 1" icon="pending-deliver" :info="userData.order.process_num" to="my/car_pending_deliver">进行中</van-tabbar-item>

				<van-tabbar-item icon="completed" :info="userData.order.complete_num" to="my/completed">已交付</van-tabbar-item>

				<van-tabbar-item v-if="userData.type == 2" icon="tosend" :info="userData.order.my_recv_num" to="my/to_send">已到达</van-tabbar-item>
			</van-tabbar>
		</div>
		<!-- 设置的弹出层 -->
		<van-popup
			v-model="showSetPopup"
			position="right"
			:overlay="false"
			class="set-popup">
			<div class="setting-popup">
				<!-- 导航栏 -->
				<van-nav-bar
					title="设置"
					left-text=""
					left-arrow
					@click-left="showSetPopup = false"
				/>
				<!-- 设置内容 -->
				<div class="setting-content mart10">
					<van-cell-group>
						<van-cell title="设置密码" is-link @click="showPwdPopup = true"/>
						<van-cell title="手机绑定" is-link @click="showTelPopup = true"/>
					</van-cell-group>
					<van-cell-group class="mart5">
						<van-cell title="关于我们" is-link @click="showAboutPopup = true"/>
					</van-cell-group>
					<div class="unlogin">
						<van-button size="large" type="" @click="unlogin">退出登录</van-button>
					</div>
				</div>
			</div>
		</van-popup>
		<!-- 重置密码的弹出层 -->
		<van-popup
			v-model="showPwdPopup"
			position="right"
			:overlay="false"
			class="set-popup">
			<div class="setting-popup">
				<!-- 导航栏 -->
				<van-nav-bar
					title="设置密码"
					left-text=""
					left-arrow
					@click-left="showPwdPopup = false"
				/>
				<!-- 设置密码 -->
				<div class="set-pwd mart10">
					<van-cell-group>
						<van-field
							label="新密码"
							type="password"
							v-model="passwordForm.password"
							placeholder="请输入新密码"
							@blur="inputBlur('password')"
							clearable/>
					</van-cell-group>
					<van-cell-group>
						<van-field
							label="确认密码"
							type="password"
							v-model="passwordForm.password_confirmation"
							placeholder="请再次输入新密码"
							@blur="inputBlur('password_confirmation')"
							clearable/>
					</van-cell-group>
					<div class="confirm-btn">
						<van-button size="large" type="primary" @click="savePassword">确认</van-button>
					</div>
				</div>
			</div>
		</van-popup>
		<!-- 手机绑定的弹出层 -->
		<van-popup
			v-model="showTelPopup"
			position="right"
			:overlay="false"
			class="set-popup">
			<div v-if="userData" class="setting-popup">
				<!-- 导航栏 -->
				<van-nav-bar
					title="手机绑定"
					left-text=""
					left-arrow
					@click-left="showTelPopup = false"
				/>
				<!-- 手机绑定 -->
				<div class="tel-bind mart10">
					<van-cell-group class="text-tel">
						<van-cell :value="`已绑定手机 : ${userData.cellphone}`" />
					</van-cell-group>
					<van-cell-group>
						<van-field
							label="手机号码"
							v-model="phoneForm.cellphone"
							placeholder="输入新手机号"
							clearable/>
					</van-cell-group>
					<van-cell-group>
						<van-field
							v-model="phoneForm.verify_code"
							center
							clearable
							label="短信验证码"
							placeholder="请输入短信验证码"
						>
							<!-- <van-button slot="button" size="small" @click="sendCode1" type="primary">发送验证码</van-button> -->
							<van-button slot="button" :disabled="isDisabled" ref="validateBtn" class="button-validate" @click="sendCode1" size="small" type="primary">{{verificationCodePrompt}}</van-button>
						</van-field>
					</van-cell-group>
					<div class="modify-btn">
						<van-button size="large" type="primary" @click="updatePhone">确认修改</van-button>
					</div>
				</div>
			</div>
		</van-popup>
		<!-- 关于我们的弹出层 -->
		<van-popup
			v-model="showAboutPopup"
			position="right"
			:overlay="false"
			class="set-popup">
			<div class="setting-popup">
				<!-- 导航栏 -->
				<van-nav-bar
					title="关于我们"
					left-text=""
					left-arrow
					@click-left="showAboutPopup = false"
				/>
				<!-- 关于我们 -->
				<div class="about-we mart15">
					<h3 class="title">关于我们</h3>
					<p class="content">
						“云车邦物流信息平台”是成都德旺云车邦信息公司基于大数据技术开发的手机物流配货平台。是国内首家直接连接一手货主及司机并通过司机在线上抢单完成运输协议，无需线下沟通的车货匹配物流平台，司机通过发布物流车源信息，平台精准匹配一手货源信息、提供精准车货匹配服务。找货、配货、找车、托运，在途实时监控，一键完成，让您发货无忧！
					</p>
					<p class="company">成都德旺云车邦信息技术有限公司</p>
				</div>
			</div>
		</van-popup>
		<!-- 消息的弹出层 -->
		<van-popup
			v-model="showNewsPopup"
			position="right"
			:overlay="false"
			class="set-popup">
			<div class="news-popup">
				<!-- 导航栏 -->
				<van-nav-bar
					title="消息中心"
					left-text=""
					left-arrow
					right-text="全部已读"
					@click-left="showNewsPopup = false"
					@click-right="$toast('全部已读')"
				/>
				<!-- 消息的列表 -->
				<ul class="news-list">
					<li @click="showSysPopup = true">
						<img src="../assets/images/icon_message.png" alt="" class="fl">
						<p class="fl list-tit">系统消息</p>
					</li>
					<li @click="showNoticePopup = true">
						<img src="../assets/images/icon_message.png" alt="" class="fl">
						<p class="fl list-tit">物流通知</p>
					</li>
				</ul>
			</div>
		</van-popup>
		<!-- 系统消息的弹出层 -->
		<van-popup
			v-model="showSysPopup"
			position="right"
			:overlay="false"
			class="set-popup">
			<div class="news-popup">
				<!-- 导航栏 -->
				<van-nav-bar
					title="系统消息"
					left-text=""
					left-arrow
					@click-left="showSysPopup = false"
				/>
				<!-- 系统消息列表 -->
				<div class="news-lists">
					<p class="date">2018-09-29 09:47:32</p>
					<p class="content">你的认证请求已通过，欢迎您的加入。</p>
				</div>
				<div class="news-lists">
					<p class="date">2018-09-29 09:47:32</p>
					<p class="content">你的认证请求已通过，欢迎您的加入。</p>
				</div>
			</div>
		</van-popup>
		<!-- 物流通知的弹出层 -->
		<van-popup
			v-model="showNoticePopup"
			position="right"
			:overlay="false"
			class="set-popup">
			<div class="news-popup">
				<!-- 导航栏 -->
				<van-nav-bar
					title="物流通知"
					left-text=""
					left-arrow
					@click-left="showNoticePopup = false"
				/>
				<!-- 物流通知列表 -->
				<div class="no_resource">
					<img src="../assets/images/no_resource.jpg" alt="">
					<p class="tips">暂 无 数 据</p>
				</div>
			</div>
		</van-popup>
		<!-- 选择货主是，个人货主，还是企业货主 -->
		<van-popup 
			v-model="cargoOwnerTypePopup" 
			position="bottom" 
			:overlay="false"
			class="set-popup">
			 <!-- 车型 -->
			<van-picker  
				:show-toolbar="true" 
				:columns="cargoOwnerType" 
				@confirm="onCargoOwnerTypeChange" /> 
		</van-popup>
	</div>
</template>

<script>

	export default {
		data(){
			return{
				defaultImg: 'this.src="' + require('../assets/images/icon_avatar.png') + '"',
				userData:   null,
				active: 0,
				showSetPopup:false,
				showAboutPopup:false,
				showTelPopup:false,
				showPwdPopup:false,
				password:'',
				password_:'',
				showNewsPopup:false,
				showSysPopup:false,
				showNoticePopup:false, 
				cargoOwnerTypePopup: false, 
				passwordForm: { 
					password: null,
					password_confirmation: null,
				},
				phoneForm:{
					cellphone: null,
					use_type:  'rebind',
					verify_code: null,
				},
				verificationCodePrompt: '获取验证码', //验证码按钮文字
				isDisabled:false, //true为禁用按钮，false为不禁用
				cargoOwnerType: ['个人货主认证', '企业货主认证'], //货主类型
			};
		},
		mounted(){
			this.getUserInfo();
		},
		watch:{
			 
		},
		methods:{
			getUserInfo(){ 
				this.userData = null;
	  		this.axios.post(`${this.commonJs.basePath}/v1/users/info`, '').then( (response) => {
					this.userData = response.data.data;
					this.setCookie('userData', JSON.stringify(response.data.data));
	  		}).catch( (error) => {
	  			this.$toast(error)
	  		});
	  	},
			onChange(active){
			},
			/*
			 * 退出登录
			 */
			unlogin(){
				this.axios.get(`${this.commonJs.basePath}/v1/users/wxlogout`, '').then( (response) => {
					this.setCookie('userData','');
					this.setCookie('configMesg','');
					this.setCookie('carDetail','');
					this.$store.state.userData = null;
					
					this.commonJs.axiosHeaderData();
	  			this.$router.push({path: '/login'});
	  		}).catch( (error) => {
	  			this.$toast(error)
	  		});
			},
			inputBlur(val,val2,val3){
			},
			/*
			 * 保存新密码
			 */
			savePassword(){
				if(this.validateForm('passwordForm')){
					this.axios.post(`${this.commonJs.basePath}/v1/users/change-password`, this.passwordForm).then( (response) => {
						this.$toast('修改成功');
						this.showPwdPopup = false;

		  		}).catch( (error) => {
		  			this.$toast(error)
		  		});
				}
			},
			/*
			 * 验证文本
			 */
			validateForm(formName){
				let bool = true, prompt = null;
				for(let key in this[formName]){
					if(this[formName][key]){
						if(this[formName][key].length < 6){
							prompt = '密码长度必须大于等于6位';
							bool = false;
						}else if(key == 'password_confirmation'){
							if(this[formName].password_confirmation != this[formName].password){
								prompt = '两次密码不一致';
								bool = false;
							}
						}
					}else {
						prompt = '密码不能为空';
						bool = false;
					}
				}
				if(!bool){
					this.$toast(prompt)
				}
				return bool;
			},
			/*
			 * 发送短信
			 */
			sendCode1() {
				this.$toast.loading('发送中.......');
	      setTimeout(() => {
	      	this._obtainValidateCard();
	        let time = 60 ;
	        let timeSetInterval = setInterval(() => {
	        	time--;
	      		if(time == 0) {
							this.verificationCodePrompt = '获取验证码';
							clearInterval(timeSetInterval);
							this.isDisabled = false;
	      		}else{
	      			this.verificationCodePrompt = time + '秒后重新获取';
	      			this.isDisabled = true;
	      		}
	        },1000);
	        this.$toast.success('已发送');
	      }, 1000);
	  	},
			/*
			 * 发送短信获取验证码
			 */
			_obtainValidateCard(){
				this.axios.get(`${this.commonJs.basePath}/v1/verify-code/get`, {params: this.phoneForm}).then( (response) => {
	  		}).catch( (error) => {
	  			this.$toast(error)
	  		});
			},
			/*
			 * 修改手机号
			 */
			updatePhone(){
				this.axios.post(`${this.commonJs.basePath}/v1/users/change-cellphone`, this.phoneForm).then( (response) => {
					this.showTelPopup = false;
	  		}).catch( (error) => {
	  			this.$toast(error)
	  		});
			}, 
			/*
			 * 选择了用货主类型就跳转到用户页面
			 */
			onCargoOwnerTypeChange(val){  
				val == '个人货主认证' ?  this.$store.state.cargoOwnerType = 1 : this.$store.state.cargoOwnerType = 2;
				this.$router.push({'path': '/my/user_detail'});				
			} 
		},
	};
</script>

<style scoped>
	/* 个人信息style */
	.my-info{
		overflow: hidden;
		margin-top: 50px;
		border-bottom: 8px solid #eee;
		padding: 12px;
		background: #fff;
	}
	.my-info .head-image{
		margin-right: 5px;
	}
	.my-info .head-image img{
		width: 52px;
		height: 52px;
		border-radius: 5px;
	}
	.my-info .name-tel{
		margin-top: 10px;
	}
	.my-info .name-tel .name{
		margin-bottom: 2px;
	}
	.my-info .name-tel .tel{
		color: #999;
	}
	.my-info .identification{
		margin-top: 12px;
		font-size: 15px;
		color: #38f;
	}

	/* 物流运输style */
	.transportation{
		overflow: hidden;
		border-bottom: 8px solid #eee;
		padding: 12px 0;
		background: #fff;
	}
	.transportation .title{
		padding: 10px 0px 10px 12px;
		text-align: left;
	}

	/* 弹出层style */
	.van-popup.set-popup{
		background-color: #F7F7F7 !important;/* 弹出层背景色 */
	}
	.van-popup--right.set-popup{
		width: 100%;
		height: 100%;
	}
	.van-popup--right.set-popup .van-nav-bar__title{
		font-size: 14px;/* 导航标题字体大小 */
	}

	/* 设置的弹出层style */
	.setting-popup{
		overflow: hidden;
	}
	.setting-popup .setting-content{
		padding: 5px 0px;
	}
	.setting-popup .setting-content .van-cell__title{
		text-align: left;/* 设置单元格的标题的text-align */
	}
	.setting-popup .setting-content .unlogin{
		position: fixed;
    bottom: 1px;
    z-index: 1;
    width: 100%;
	}
	.setting-popup .setting-content .unlogin button{
		color: #de2f2f;
	}
	/* 关于我们 */
	.setting-popup .about-we{
		padding: 0px 5px;
	}
	.setting-popup .about-we .title{
		margin-bottom: 10px;
		text-align: center;
	}
	.setting-popup .about-we .content{
		margin-bottom: 10px;
    text-align: left;
    text-indent: 28px;
    color: #222;
    line-height: 24px;
	}
	.setting-popup .about-we .company{
		text-align: right;
    color: #222;
	}
	/* 手机绑定 */
	.setting-popup .tel-bind{
		background: #fff;
	}
	.setting-popup .tel-bind .text-tel .van-cell{
		color: #666;
	}
	.setting-popup .tel-bind .modify-btn{
		border-top: 40px solid #f7f7f7;
	}
	/* 设置密码 */
	.setting-popup .set-pwd .confirm-btn{
		border-top: 40px solid #f7f7f7;
	}

	/* 消息的弹出层style */
	.news-popup{
		overflow: hidden;
	}
	.news-popup .news-list{
		width: 95%;
		margin: 10px auto 0;
		background: #fff;
		overflow: hidden;
		border-radius: 5px;
	}
	.news-popup .news-list li{
		border-bottom: 1px solid #eee;
		padding: 8px 12px;
		line-height: 40px;
		height: 40px;
	}
	.news-popup .news-list li img{
		height: 30px;
		margin-top: 5px;
	}
	.news-popup .news-list li .list-tit{
		margin-left: 10px;
	}
	/* 系统消息与物流通知 */
	.news-popup .news-lists{
		width: 95%;
		margin: 10px auto 0;
		background: #fff;
		overflow: hidden;
		border-radius: 5px;
		padding: 8px;
		text-align: left;
		box-sizing: border-box;
	}
	.news-popup .news-lists .date{
		color: #999;
		font-size: 12px;
	}
	.news-popup .news-lists .content{
		margin-top: 4px;
	}

</style>
