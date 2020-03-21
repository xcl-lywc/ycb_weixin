import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// import './assets/styles/overwriteVant.less';
import './assets/styles/common.less';
import md5 from 'js-md5';
Vue.prototype.md5 = md5;
// import * as qiniu from 'qiniu-is'
// Vue.use(qiniu);

//调用微信API
import wx from 'weixin-js-sdk'
Vue.prototype.wx = wx

// 全局引入公共js 
import commonJs from './plugins/common.js'
Vue.prototype.commonJs = commonJs;

import Vant from 'vant';
import 'vant/lib/vant-css/index.css';
Vue.use(Vant); 
// mintui 只因用自己想要的组件
// import Mint from 'mint-ui';
// Vue.use(Mint);
// import 'mint-ui/lib/style.css'; 

Vue.config.productionTip = false;
//设置cookie

Vue.prototype.setCookie = function(c_name,value,expiredays) {
  var exdate=new Date()
  exdate.setDate(exdate.getDate()+expiredays)
  document.cookie=c_name+ "=" +escape(value)+
    ((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
};

//获取cookie
Vue.prototype.getCookie=function(c_name) {
  if (document.cookie.length>0)
  {
    var  c_start=document.cookie.indexOf(c_name + "=")
    if (c_start!=-1)
    {
      c_start=c_start + c_name.length+1
     var c_end=document.cookie.indexOf(";",c_start)
      if (c_end==-1) c_end=document.cookie.length
      return unescape(document.cookie.substring(c_start,c_end))
    }
  }
  return ""
};
Vue.prototype.delCookie=function(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = Vue.prototype.getCookie(name);
   if (cval != null)
   document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
 }

// 全局引入axios 
import axios from 'axios'
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';
Vue.prototype.axios = axios;
/******************axios拦截器****************/
if(Vue.prototype.getCookie("userData")) {
  let data = JSON.parse(Vue.prototype.getCookie("userData")), 
      requestTimestamp = JSON.stringify(parseInt(new Date().getTime()/1000));
  Vue.prototype.axios.defaults.headers.common['app-version'] = '1.0'; //客户端版本号
  Vue.prototype.axios.defaults.headers.common['model'] = 'WX';//手机型号
  Vue.prototype.axios.defaults.headers.common['system-version'] = '6.0'; //系统版本号
  Vue.prototype.axios.defaults.headers.common['system-platform'] = 'Android'; //平台 可选 [iOS, Android]
  Vue.prototype.axios.defaults.headers.common['user-type'] = data.type;
  Vue.prototype.axios.defaults.headers.common['request-token'] = md5(md5(requestTimestamp).substring(0,10) + 'y-c-b-2-0-1-7');
  Vue.prototype.axios.defaults.headers.common['request-timestamp'] = requestTimestamp;
}
// 处理请求异常
Vue.prototype.axios.interceptors.response.use(function (response) {
  //请求成功的拦截 
  if(response.data.errcode == 0){ //请求成功
    return response;
  }else if(!response.data.hasOwnProperty('errcode')){
    return response;
  }else{
    return Promise.reject(response.data.message);
  }
  
}, function (error) {
});


// 实例化
new Vue({
  router,
  store,
  render: function (createElement) {
    let routeMeta = this.$route.meta
    let props = {}
    // 控制是否显示 带导航的布局 || 空白布局
    if (routeMeta && routeMeta.showInNav && routeMeta.type == 'NavLayout') {
      props.layout = 'nav-layout'
    } else {
      props.layout = 'blank-layout'
    }
    return createElement(App, {props})
  }
}).$mount("#app");
