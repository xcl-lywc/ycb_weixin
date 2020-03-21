<!-- 
  物流运输---进行中
 -->
<template>
  <div class="pendingOrder">
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
            <span class="orange" v-if="money">{{money.real_cost}}</span>
            <span class="orange">元</span>
          </van-col>
          <van-col span="5">
            <van-button size="large" type="primary" @click="buyInsurance">微信支付</van-button>
          </van-col>
        </van-row>
      </div>
    </div>
  </div>
</template>

<script>
  import md5 from 'js-md5';
  export default {
    data() {
      return {
        money: {
          insurance_cost: 0,
          real_cost: 0,
        },
        buyInsuranceForm:{
          id: this.$route.params.id, //order id , 订单ID
          tradeType: 'JSAPI',        //
          insurance_type: '1' ,        // 保险类型, 来自于配置 字符串 [1,2,3]
          cargo_value: null,            //货物价值
        },
        wxParams:{
          nonceStr: null,
          prepayId: null,
          payKay:   null,
          appId:'wxda24e6b9d1edd41b',
        }
      };
    },
    created(){ 
    },
    methods:{  
      /*
       * 计算保险
       */
      calcInsurance(){
        this.axios.post(`${this.commonJs.basePath}/v1/order/calc-insurance`, this.buyInsuranceForm).then((response) => {
          this.money = response.data.data;
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
            debugger
            this.$toast(response.data.message); 
            this.wxParams.nonceStr = response.data.data.noncestr;
            this.wxParams.prepayId = response.data.data.prepayid;
            this.wxParams.payKay = response.data.data.payment_id;
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
        debugger
        var self = this;
        var timestamp = "'" + new Date().getTime() + "'";
        var sign = '';
        var signA = "appId=" + self.wxParams.appId + "&nonceStr=" + self.wxParams.nonceStr + "&package=prepay_id=" + self.wxParams.prepayId + "&signType=MD5&timeStamp=" + timestamp;
        var signB = signA + "&key=" + self.wxParams.payKay;
        sign = md5(signB).toUpperCase();
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest', {
            "appId": self.wxParams.appId, // 公众号名称，由商户传入
            "timeStamp": timestamp, // 时间戳，自1970年以来的秒数
            "nonceStr": self.wxParams.nonceStr, // 随机串
            "package": "prepay_id="+self.wxParams.prepayId,
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
      }
    },
    mounted(){ 
      
    },
  };
</script>

<style lang="less">
  .pending-deliver-detail #allmap{
    height: calc(100vh - 4.5rem)!important;
  }
  .dialog-confirm{
    text-align: center;
  }
  .buy-radio{
    .van-radio__input{
      font-size: 14px;
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
</style>
