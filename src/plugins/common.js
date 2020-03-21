import vue from 'vue';
const Vue = new vue();
export default {
  basePath: `${window.location.origin}/api`,
  filePath: `http://up-z2.qiniu.com`,
  pagination:{     //elementUi中的分页所需数据
    pageDefault:1,        //初始页码
    prePageDefault: 50,   //初始条数
  }, 
  /*
  * 将时间转换为某年某月某日 00：00：00
  * @params {string/number} timeSetback 时间戳
  * @params {string} format 时间格式
  */
  _convertDate(time, format){
      return time ? new Date(time).Format(format) : '无';
   },
  /*
   * 将请求头数据给清空
   */
  axiosHeaderData(){
    // 创建vue实例之前将之前axios中的headers数据给清空，避免造成非法请求
    Vue.axios.defaults.headers.common['app-version'] = ''; //客户端版本号
    Vue.axios.defaults.headers.common['model'] = '';//手机型号
    Vue.axios.defaults.headers.common['system-version'] = ''; //系统版本号
    Vue.axios.defaults.headers.common['system-platform'] = ''; //平台 可选 [iOS, Android]
    Vue.axios.defaults.headers.common['user-type'] = '';
    Vue.axios.defaults.headers.common['request-token'] = '';
    Vue.axios.defaults.headers.common['request-timestamp'] = '';
  },
  /*
     * 登录成功储存headers
     */
  _getHeaders(data){
    let requestTimestamp = JSON.stringify(parseInt(new Date().getTime()/1000));
    Vue.axios.defaults.headers.common['app-version'] = '1.0'; //客户端版本号
    Vue.axios.defaults.headers.common['model'] = 'WX';//手机型号
    Vue.axios.defaults.headers.common['system-version'] = '6.0'; //系统版本号
    Vue.axios.defaults.headers.common['system-platform'] = 'Android'; //平台 可选 [iOS, Android]
    Vue.axios.defaults.headers.common['user-type'] = data.type;
    Vue.axios.defaults.headers.common['request-token'] = Vue.md5(Vue.md5(requestTimestamp).substring(0,10) + 'y-c-b-2-0-1-7');
    Vue.axios.defaults.headers.common['request-timestamp'] = requestTimestamp;
  },
  /*
   * 滚动条在Y轴上的滚动距离
   */
  getScrollTop(){
　　var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
　　if(document.body){
　　　　bodyScrollTop = document.body.scrollTop;
　　}
　　if(document.documentElement){
　　　　documentScrollTop = document.documentElement.scrollTop;
　　}
　　scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
　　return scrollTop;
   },
  /*
   * 文档的总高度
   */
  getScrollHeight(){
　　var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
　　if(document.body){
　　　　bodyScrollHeight = document.body.scrollHeight;
　　}
　　if(document.documentElement){
　　　　documentScrollHeight = document.documentElement.scrollHeight;
　　}
　　scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
　　return scrollHeight;
   },
  /*
   * 浏览器视口的高度
   */
  getWindowHeight(){
　　var windowHeight = 0;
　　if(document.compatMode == "CSS1Compat"){
　　　　windowHeight = document.documentElement.clientHeight;
　　}else{
　　　　windowHeight = document.body.clientHeight;
　　}
　　return windowHeight;
   },
}

/*
*   格式化日期格式
*/
Date.prototype.Format = function (fmt) { 
  var o = {
      "M+": this.getMonth() + 1, //月份 
      "d+": this.getDate(), //日 
      "h+": this.getHours(), //小时 
      "m+": this.getMinutes(), //分 
      "s+": this.getSeconds(), //秒 
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
      "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}