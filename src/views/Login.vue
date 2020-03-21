<template>
  <div class="login">
    <div class="login-box">
    	<img src="../assets/images/icon_login_logo.png"/>
	    <van-tabs color="#2391e2" @change="tabsChange">
				<van-tab title="我是货主" value="2"></van-tab>
				<van-tab title="我是车主" value="1"></van-tab>
			</van-tabs>
			<van-row>
				<van-cell-group>
				  <van-field
				    v-model="form.cellphone"
				    placeholder="请输入手机号"
				    type="tel" 
				     />
				  <div class="validate-div">
				  	<van-field
				    v-model="form.password"
				    placeholder="请输入密码"
				    type="password" 
				     />
				  	<van-button :disabled="isDisabled" v-show="loginMode" ref="validateBtn" class="button-validate" @click="sendCode1" size="small" type="primary">{{verificationCodePrompt}}</van-button>
				  </div>
				</van-cell-group>
			</van-row>
			<p class="switch-p marb10"><span @click="loginMode = !loginMode ">{{!loginMode ? '使用手机验证码登录' :'使用密码登录'}}</span></p>
			<van-button size="large" type="primary" @click="submitLogin">开启云车邦</van-button>
    </div>
  </div>
</template>

<script>
export default {
	data(){
		return {
			verificationCodePrompt: '获取验证码', //验证码按钮文字
			loginMode: true, //true为短信登录，false为密码登录
			isDisabled:false, //true为禁用按钮，false为不禁用
			form:{
				user_type: 2,
				cellphone: null,
				password:  null,
			}
		}
	},
	beforeCreate(){
	},
	created(){
		this._clearData();
	},
	methods:{
		/*
		 * 清空一些数据
		 */
		_clearData(){
			this.commonJs.axiosHeaderData();
			this.delCookie('userData')
		},
		sendCode1() {
			if(!this.form.cellphone){ this.$toast('请填写手机号'); return false;}
			this.$toast.loading('发送中.......');
      setTimeout(() => {
      	this.obtainValidateCard();
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
		 * 发动短信获取验证码
		 */
		obtainValidateCard(){
			this.axios.get(`${this.commonJs.basePath}/v1/verify-code/get`, this._obtainValidateCardParams()).then( (response) => {
				// this.$toast('修改成功');

			}).catch( (error) => {
				this.$toast(error)
			});
		},
		_obtainValidateCardParams(){
			return {
				params: {
					cellphone: this.form.cellphone,
					use_type:  'login',
				}
			}
		},
  	submitLogin(){
  		// if(!this.form.cellphone){ this.$toast('请填写手机号'); return false;} 
  		
  		this._clearData(); //登录前先清空数据避免数据冲突
  		let url = this.loginMode ? `${this.commonJs.basePath}/v1/users/login-verifycode` : `${this.commonJs.basePath}/v1/users/login`;
  		this.axios.post(url, this._loginParams()).then( (response) => {
		    
		    // this.$router.push({path: '/home' });
		    
		    if (response.data.data.wx_sso_id)
					this.$router.push({path: '/home' });
		    else
        	this.getweixin();
        
  		}).catch( (error) => {
  			this.$toast(error)
  		});
  	},
  	_loginParams(){
  		let form = {};
  		if(this.loginMode){
  			form = {
  				cellphone: 	 this.form.cellphone,
  				verify_code: this.form.password,
  				user_type:   this.form.user_type,
  			}
  		}else{
  			form = {
  				cellphone: this.form.cellphone,
  				password:  this.form.password,
  				user_type:   this.form.user_type,
  			}
  		}

  		return form;
  	},
  	/*
  	 * 登录成功储存headers
  	 */
  	_getHeaders(data){
  		let requestTimestamp = JSON.stringify(parseInt(new Date().getTime()/1000));
			this.axios.defaults.headers.common['app-version'] = '1.0'; //客户端版本号
			this.axios.defaults.headers.common['model'] = 'WX';//手机型号
			this.axios.defaults.headers.common['system-version'] = '6.0'; //系统版本号
			this.axios.defaults.headers.common['system-platform'] = 'Android'; //平台 可选 [iOS, Android]
			this.axios.defaults.headers.common['user-type'] = data.type;
			this.axios.defaults.headers.common['request-token'] = this.md5(this.md5(requestTimestamp).substring(0,10) + 'y-c-b-2-0-1-7');
			this.axios.defaults.headers.common['request-timestamp'] = requestTimestamp;
  	},
  	getUserInfo(){
  		this.axios.post(`${this.commonJs.basePath}/v1/users/info`, '').then( (response) => {
				this.setCookie('userData',JSON.stringify(response.data.data));
				this.$store.state.userData = response.data.data;
  		}).catch( (error) => {
  			this.$toast(error)
  		});
  	},
  	tabsChange(index, title){
  		switch(index){
  			case 0:
  				this.form.user_type = 2;
  				break;
  			case 1:
  				this.form.user_type = 1;
  				break;
  		}
  	},
  	/*
	   * 通用的一些数据
	   */
	  configMesg(){
	    this.axios.get(`${this.commonJs.basePath}/v1/config`,'').then((response) => {
	      sessionStorage.setItem('configMesg', JSON.stringify(response.data.data));
	    }).catch((error) => {
	      this.$toast(error)
	    })
	  },
	  /*
	   * 获取车主的车辆信息
	   */
	  getCarDetail(){
			this.axios.get(`${this.commonJs.basePath}/v1/vehicle/get`, '').then((response) => {
				sessionStorage.setItem('carDetail', JSON.stringify(response.data.data))
			}).catch((error) => {
					this.$toast(error);
			})
		},
    /*
		 * 请求微信
		 */
    getweixin: function () {
        var url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxda24e6b9d1edd41b&redirect_uri=https://wxapi.ycb56.com/api/v1/users/wxlogin&response_type=code&scope=snsapi_base&state=binding#wechat_redirect`;
        location.href = url;
        // this.axios.get(url, '').then((response) => {
        // }).catch((error) => {
        //     this.$toast(error);
        // })
    },
	}
};
</script>
<style lang="less">
.login{
	height: 100vh;
	overflow: hidden;
	background-color: #fff;
	.login-box{
		padding: 30px;
		padding-top: 60px;
	 	img{
	    width: 100px;
	    padding-bottom: 50px;
	 	}
	 	.van-tabs__wrap.van-hairline--top-bottom:after{
	    border-top-color: #fff;
	 	}
	 	.switch-p{
	 		margin-top: 50px;
	 		text-align: right;
	 		span{
	 		}
	 	}
	 	.validate-div{
	 		position: relative;
	 		.button-validate{
	 			position: absolute;
	 			right: 0;
	 			top: 6px;
	 		}
	 	}
	}
}
</style>
