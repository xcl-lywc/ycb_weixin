<!-- 
	使用微信登录时，需要单独在查询一下用户信息然后跳转到指定的首页
 -->
<template> 
</template>

<script>
	export default {
		data() {
			return {
			};
		},
		created(){
			this.getQueryUserInfo();
		},
		methods:{
			/*
			 * 获取用户信息
			 */
			getQueryUserInfo(){
				this.axios.get(`${this.commonJs.basePath}/v1/users/info`, '').then( (response) => {
	  			this.setCookie('userData',JSON.stringify(response.data.data));
					this.$store.state.userData = response.data.data;
					this.commonJs._getHeaders(response.data.data);
					// -------  获取车主自己的车辆信息 
			    if(response.data.data.type == 1) this.getCarDetail();
				this.$router.push({path: '/home' });
				// window.location.href = window.location.origin + '/home';
	  		}).catch( (error) => {
	  			this.$toast(error)
	  		});
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
		},
		mounted(){
		},
	};
</script>

<style lang="less">
</style>
