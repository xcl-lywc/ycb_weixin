<!--
  车主 --- 物流运输 --- 进行中
 -->
<template>
  <div class="pendingOrder">
    <!-- 导航栏 -->
    <van-nav-bar
            title="进行中"
            left-text=""
            left-arrow
            @click-left="onClickLeft"
            fixed
    />
    <!-- 列表 -->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" class="mart45">
        <div v-if="dataList.length" class="car-content mar5">
            <ul @click="showOrderInfo(item)" class="car-list car-list-bt5" v-for="(item, index) in dataList">
                <li>
                    <p class="fl">{{item.order_time}}</p>
                    <p class="fr">
                        <span class="car-fcg">心意运价：</span>
                        <span class="car-fcy">{{item.freight+'元/吨'}}</span>
                    </p>
                    <p class="fr marr10 type">{{item.type == 1 ? '整车' : '拼车'}}</p>
                <li class="car-fw9 car-fs14">{{item.cargo_city + ' - ' + item.consignee_city}}</li>
                <li class="car-fcg">
                    {{item.desc}} 
                    <span class="fr" >{{item.status_desc}}</span> 
                </li>
                </li>
            </ul>
            <p v-if="dataList.length" @click="loadMore" class="align-center mart10">{{listPrompt}}</p>
        </div>
        <div v-if="!dataList.length && !isLoadingAll" class="no_resource">
            <img src="../../assets/images/no_resource.jpg" alt="">
            <p class="tips">暂 无 数 据</p>
        </div>
    </van-pull-refresh>
    <!-- 订单详情 -->
    <van-popup v-model="infoShow" position="right" :overlay="true" class="set-popup">
        <van-nav-bar
                title="订单详情"
                left-text=""
                left-arrow
                @click-left=" infoShow = false "
        />
        <div v-if="selectOrder" class="order-info mar5">
            <van-cell-group class="pad5">
                <p>{{selectOrder.status_desc}}</p>
                <p>订单编号{{selectOrder.id}}</p>
            </van-cell-group>
            <div v-show="!isShowOrderDetail" class="checkbtn"><span @click=" isShowOrderDetail = true; ">查看订单详情<img
                    src="../../assets/images/icon_more_down.png"/></span></div>

            <!-- 满足条件显示，地图和联系电话 -->
            <div v-show="!isShowOrderDetail">
                <div id="allmap"></div>
                <van-cell-group class="pad5">
                    <p>
                        <span class="width50"><b>发货人姓名</b>{{selectOrder.cargo_owner_name}}</span>
                        <span class="width50 phone">
            <a v-if="selectOrder.cargo_owner_cellphone"
                               :href="`sms:${selectOrder.cargo_owner_cellphone}`"><van-icon
                                    name="pending-evaluate"/></a>
            <a v-if="selectOrder.cargo_owner_cellphone"
                               :href="`tel:${selectOrder.cargo_owner_cellphone}`"><van-icon name="phone"/></a>
          </span>
                    </p>
                </van-cell-group>
                <van-cell-group class="pad5">
                    <p>
                        <span class="width50"><b>收货人姓名</b>{{selectOrder.consignee}}</span>
                        <span class="width50 phone">
            <a v-if="selectOrder.consignee_cellphone"
                               :href="`sms:${selectOrder.consignee_cellphone}`"><van-icon name="pending-evaluate"/></a>
            <a v-if="selectOrder.consignee_cellphone"
                               :href="`tel:${selectOrder.consignee_cellphone}`"><van-icon name="phone"/></a>
          </span>
                    </p>
                </van-cell-group>
                <van-cell-group class="pad5">
                    <p>
                        <span class="width50"><b>收单人姓名</b>{{selectOrder.publish_user_name}}</span>
                        <span class="width50 phone">
            <a v-if="selectOrder.publish_user_cellphone"
                               :href="`sms:${selectOrder.publish_user_cellphone}`"><van-icon
                                    name="pending-evaluate"/></a>
            <a v-if="selectOrder.publish_user_cellphone"
                               :href="`tel:${selectOrder.publish_user_cellphone}`"><van-icon name="phone"/></a>
          </span>
                    </p>
                </van-cell-group>
                <van-button class="mart10" size="large" type="primary" @click="deliverOrderShow = true;">交付订单
                </van-button>
            </div>
            <!-- 满足条件显示订单详情 -->
            <div class="order-detail-box" v-show="isShowOrderDetail">
                <h5 class="mar5">我的路线</h5>
                <van-cell-group class="pad5">
                    <p>{{selectOrder.vehicle_route.cargo_area}}-{{selectOrder.vehicle_route.consignee_area}}</p>
                    <p>期望运价
                        <span class="colore08d3e">{{selectOrder.vehicle_route.freight}}</span>元/{{selectOrder.vehicle_route.freight_unit}}
                        约<span class="colore08d3e">{{Math.round(selectOrder.vehicle_route.freight/selectOrder.load)}}</span>元/{{selectOrder.vehicle_route.freight_unit}}
                    </p>
                </van-cell-group>
                <h5 class="mar5">货源详情</h5>
                <van-cell-group class="pad5">
                    <p class="color-black marl15">{{selectOrder.cargo_owner_name}} <span class="marl10">{{selectOrder.cargo_owner_cellphone}}</span>
                    </p>
                    <p><i class="round"></i>{{selectOrder.cargo_city}}</p>
                    <p class="marl15">{{selectOrder.cargo_address}}</p>
                </van-cell-group>
                <van-cell-group class="pad5">
                    <p class="color-black marl15">{{selectOrder.consignee}} <span class="marl10">{{selectOrder.consignee_cellphone}}</span>
                    </p>
                    <p><i class="round red"></i>{{selectOrder.consignee_city}}</p>
                    <p class="marl15">{{selectOrder.consignee_address}}</p>
                </van-cell-group>
                <van-cell-group class="pad5">
                    <p>
                        <span class="width50"><b>货物类型</b>{{selectOrder.cargo_type}}</span>
                        <span class="width50"><b>货物重量</b>{{selectOrder.cargo_weight}}{{selectOrder.freight_unit}}</span>
                    </p>
                    <p>
                        <span class="width50"><b>货物件数</b>{{selectOrder.cargo_num}}</span>
                        <span class="width50"><b>货物体积</b>{{selectOrder.cargo_volume}}m³</span>
                    </p>
                    <p>
          <span class="width50">
            <b>期望运价</b>
            <span class="colore08d3e">{{selectOrder.freight}}/{{selectOrder.freight_unit}}</span>
          </span>
                    </p>
                </van-cell-group>
                <van-cell-group class="pad5">
                    <p>
                        <span class="width50"><b>车辆类型</b>{{selectOrder.vehicle_type}}</span>
                        <span class="width50"><b>车辆长度</b>{{selectOrder.vehicle_length}}米</span>
                    </p>
                </van-cell-group>
                <van-cell-group class="pad5">
                    <p><b>支付方式</b>{{selectOrder.payer == 1 ? '发货人' : '收货人'}}付款</p>
                </van-cell-group>
                <van-cell-group class="pad5">
                    <p><b>货主备注</b>{{selectOrder.status_note}}</p>
                </van-cell-group>
                <van-cell-group class="pad5">
                  <img 
                    style="margin-right: 5px;"
                    v-if="selectOrder.cargo_images"
                    v-for="itemImg in JSON.parse(selectOrder.cargo_images)"
                    :src="itemImg"
                    @click="checkBigImg([itemImg])"
                    width="80px"
                    height="80px"/>
                </van-cell-group>
            </div>

            <div v-show="isShowOrderDetail" class="checkbtn checkbtn-bottom"><span
                    @click=" isShowOrderDetail = false; ">收起订单详情<img
                    src="../../assets/images/icon_more_up.png"/></span></div>
        </div>
    </van-popup>
    <!-- 提交订单 -->
    <van-popup v-model="deliverOrderShow" position="right" :overlay="true" class="set-popup">
        <van-nav-bar
                title="订单详情"
                left-text=""
                left-arrow
                @click-left=" deliverOrderShow = false "
        />
        <div class="order-info mar5">
            <van-cell-group>
                <van-field
                        v-model="deliverOrderForm.verify_code"
                        center
                        clearable
                        placeholder="交易码"
                >
                    <van-button slot="button" size="small" type="primary" @click="obtainValidateCard">获取
                    </van-button>
                </van-field>
            </van-cell-group>
            <p class="mar5">交易码已由平台发送至收货人，请联系收货人索取，如果收货人未收到交易码请点击再次获取或联系客服</p>
            <van-cell class="mart10">
                上传入库单（必传）
                <div class="mar5">
                    <img 
                      style=" display: inline-block; margin-right: 5px;"
                      v-for="(item, index) in deliverOrderForm.warehouse_receipt_images"
                      :src="item"
                      width="80px"
                      height="80px"/>
                    <van-uploader
                        :after-read="((val) => {onFileUpload (val, 'warehouse_receipt_images')})">
                        <van-icon name="photograph"/>
                    </van-uploader>
                </div>
            </van-cell>
            <van-cell class="mart10">
                上传货物入库照片（必传）
                <div class="mar5">
                    <img
                      style=" display: inline-block; margin-right: 5px;"
                      v-for="(item, index) in deliverOrderForm.warehouse_cargo_images"
                      :src="item"
                      width="80px"
                      height="80px"/> 
                    <van-uploader
                            :after-read="((val) => {onFileUpload (val, 'warehouse_cargo_images')})"> 
                        <van-icon name="photograph"/>
                    </van-uploader>
                </div>
            </van-cell>
            <van-cell-group class="mart10 pad5">
                <p class="">货主评价</p>
                <p><b>装货速度</b>
                    <van-rate v-model="deliverOrderForm.load_speed_star"/>
                </p>
                <p><b>装货速度</b>
                    <van-rate v-model="deliverOrderForm.cargo_owner_attitude_star"/>
                </p>
            </van-cell-group>
            <van-cell-group>
                <van-field v-model="deliverOrderForm.comment" type="textarea" placeholder="说两句"/>
            </van-cell-group>
            <van-button class="mart15" size="large" type="primary" @click="saveDeliverOrderForm">确认订单</van-button>
        </div>
    </van-popup>
    <div v-show="isLoadingAll" class="fullScreen-loding"><van-loading type="spinner"/></div>
  </div>
</template>

<script>
  // ImagePreview和其他组件不同，不是通过HTML结构的方式来使用，而是通过函数调用的方式。使用前需要先引入它。
  import { ImagePreview } from 'vant';
  export default {
    data() {
      return {
        isFirstVisit: true, // true为第一次访问，需要添加一个等待效果，false则不需要
        isLoadingAll: false,
        isShowOrderDetail: false, //订单详情
        isLoading: false,
        infoShow: false, //订单详情弹框属性
        deliverOrderShow: false, //交付订单弹框属性 
        selectOrder: null, //被选中的订单数据
        dataList:    [],   //列表数据
        listPrompt: '点击或者上拉加载更多', //提示
        searchParams: {
            type: '0', //装车类型
            page: '1',
            pre_page: '15',
        },
        deliverOrderForm: {     //交付订单表单
            verify_code: null,//验证码, 验证码类型为comfirm_rate
            order_id: null,//订单ID
            vehicle_owner_id: null,//接单车主ID
            warehouse_receipt_images: [],//入库单相片 json 数组 [src1, src2]
            warehouse_cargo_images: [],//货物入库相片 json 数组 [src1, src2]
            load_speed_star: null,//装货速度， 选 1 2 3 4 5
            cargo_owner_attitude_star: null,//货主态度 选 1 2 3 4 5
            comment: null, //点评
        },
        phoneForm: {   //获取手机验证码
            cellphone: null,
            use_type: 'comfirm_rate',
            verify_code: null,
            order_id: null
        },
      };
    },
    created() {
        window.addEventListener('scroll', this.handleScroll);
    },
    methods: {
        handleScroll(ev) {
            // ------------ 滚动到最底部 ，加载更多
            if (this.commonJs.getScrollTop() + this.commonJs.getWindowHeight() == this.commonJs.getScrollHeight())
                this.loadMore();
        },
        /*
         * 加载更多
         */
        loadMore() {
            this.searchParams.page++;
            this.getQueryList();
        },
        getQueryList() { 
            if(this.isFirstVisit) {this.isLoadingAll = true; this.isFirstVisit = false;}

            if (this.dataList.length) this.listPrompt = '正在加载更多的数据...';

            this.axios.get(`${this.commonJs.basePath}/v1/vehicle/route/get`, {params: this.searchParams}).then((response) => {
                this.dataList = this.dataList.concat(response.data.data.order.data);
                this.isLoadingAll = false;
                this.listPrompt = '点击或者上拉加载更多';
                // ----- 列表原来有数据，但再次查询出来的没有数据，执行以下语句
                if (this.dataList.length && !response.data.data.order.data.length) this.listPrompt = '没有更多啦';

            }).catch((error) => {
                this.$toast(error);
                this.isLoadingAll = false;
            });
        },
        /*
        下拉刷新
        */
        onRefresh() {
            setTimeout(() => {
                this.searchParams.page = 1;
                this.listPrompt = '点击或者上拉加载更多';
                this.dataList = [];
                this.getQueryList();
                this.isLoading = false;
            }, 500);
        },
        /*
         返回个人中心
         */
        onClickLeft() {
            // this.$router.back(-1);
            this.$router.push({path: '/my'});
        },
        /*
         * 显示订单详情
         */
        showOrderInfo(item) {
          // ----状态为2，跳转支付页面
          if(item.status == 2){
            // this.$router.push({name:'wxPayPage',params:{id: item.id}}),
						window.location.href = window.location.origin + "/#/pay/0-"+item.id;
          }else if(item.status == 7){
            this.$router.push({name:'orderDetail',params:{id: item.id}});
          }else{
            this.infoShow = true;
            this._getQueryOrderInfo(item);
            this.phoneForm.order_id = item.id;
          }
            
        },
        _getQueryOrderInfo(item) {
            this.axios.get(`${this.commonJs.basePath}/v1/order/get`, {params: {id: item.id}}).then(
                (response) => {
                    this.selectOrder = response.data.data;
                    // ---------------------- 获取地图信息 --------------------
                    this.$nextTick(() => {
                        this._startEndAddress(response.data.data.cargo_area_code, response.data.data.consignee_area_code);
                    });
                }).catch((error) => {
                this.$toast(error)
            });
        },
        /*
         * 根据code获取到AreaCode对应信息
         */
        _getQueryAreaCodeDetailByCode(code) {
            return new Promise((resolve, reject) => {
                this.axios.get(`${this.commonJs.basePath}/v1/area/info`, {params: {area_code: code}}).then((response) => {
                    resolve(response.data)
                }).catch((error) => {
                    reject(error)
                });
            })
        },
        /*
         * 获取起始地址
         */
        _startEndAddress(startCode, endCode) {
            let start, end;
            // -------------- 一次调用获取开始地址 -------------------
            this._getQueryAreaCodeDetailByCode(startCode).then((response) => {
                start = response.data.province_code_name;
                // -------------- 二次调用获取结束地址 -------------------
                this._getQueryAreaCodeDetailByCode(endCode).then((response2) => {
                    end = response2.data.province_code_name;
                    // ----- 调用地图 -----
                    this.showMap(start, end);
                }).catch((error) => {
                    this.$toast(error)
                });

            }).catch((error) => {
                this.$toast(error)
            });
        },
        /*
         * 附件上传，
         * @params {object} 附件
         * @params {string} keyName 保存在数据库的key
         */
        onFileUpload(val, keyName) {
            this._fileUpload(val, keyName);
        },
        _fileUpload(val, keyName) {
            this.isLoadingAll = true;
            let param = new FormData(); //创建form对象

            param.append('file', val.file, val.file.name)
            let config = {
                headers: {'Content-Type': 'multipart/form-data'}
            };

            this.axios.get(`${this.commonJs.basePath}/v1/file/token/get`, {params: {file: val.file}}).then((response) => {
                param.append('token', response.data.data.uptoken);

                this._fileQiniu(param, config, keyName, response.data.data.base_url);
            }).catch((error) => {
                this.$toast(error);
            });

            // this.axios.get(`${this.commonJs.basePath}/v1/file/token/get`, {params: {file: val.file}}).then((response) => {
            //  this.deliverOrderForm[keyName] = response.data.data.base_url;
            // }).catch((error) => {
            //    this.$toast(error);
            // })
        },
        /*
         * 通过七牛技术上传附件
         * @params {object} param 附件参数
         * @params {object} config 请求头
         * @params {string} keyName 字段名
         * @params {string} base_url 附件地址头
         */
        _fileQiniu(param, config, keyName, base_url) {
            this.axios.post(`${this.commonJs.filePath}`, param, config).then((response) => {
                this.deliverOrderForm[keyName].push(`${base_url}${response.data.key}`);
                this.isLoadingAll = false;
            }).catch((error) => {
                this.$toast(error);
                this.isLoadingAll = false;
            })
        },
        /*
         * 提交交付订单
         */
        saveDeliverOrderForm() { 
            this.axios.post(`${this.commonJs.basePath}/v1/order/rate`, this._deliverOrderParams()).then((response) => {
                this.$toast('提交成功,一秒后跳转到我的页面');
                setTimeout(() => {
                    this.$router.push({'path': '/my'})
                }, 1000)
            }).catch((error) => {
                this.$toast(error);
            })
        },
        _deliverOrderParams(){
          return {
            vehicle_owner_id: this.selectOrder.vehicle_owner_id,
            order_id: this.selectOrder.id,
            warehouse_cargo_images: JSON.stringify(this.deliverOrderForm.warehouse_cargo_images),
            warehouse_receipt_images:JSON.stringify(this.deliverOrderForm.warehouse_receipt_images),
            verify_code: this.deliverOrderForm.verify_code,
            load_speed_star: this.deliverOrderForm.load_speed_star,
            cargo_owner_attitude_star: this.deliverOrderForm.cargo_owner_attitude_star,
            comment: this.deliverOrderForm.comment,
          } 
        },
        /*
         * 发送短信获取验证码
         */
        obtainValidateCard() {
            this.phoneForm.cellphone = this.selectOrder.consignee_cellphone;
            this.axios.get(`${this.commonJs.basePath}/v1/verify-code/get`, {params: this.phoneForm}).then(
                (response) => {
                this.$toast('获取成功') 
            }).catch((error) => {
                this.$toast(error)
            });
        },
        /*
         * 显示地图
         */
        showMap(start, end) {
            // 百度地图API功能
            var map = new BMap.Map("allmap");
            map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);

            var transit = new BMap.DrivingRoute(map, {
                renderOptions: {
                    map: map,
                    enableDragging: true //起终点可进行拖拽
                },
            });
            transit.search(start, end);
        },
        /*
         * 查看大图
         */
        checkBigImg(imgArray){ 
            ImagePreview({images: imgArray, showIndex: false});
        }
    },
    mounted() {
        this.getQueryList();
    },
  };
</script>

<style lang="less">
    #allmap {
        height: calc(~'100vh - 6rem');
        width: 100vw;
    }

    .checkbtn {
        display: inline-block;
        width: 100%;
        color: #2391e2;
        text-align: center;
        line-height: 22px;

        img {
            width: 18px;
            display: inline-block;
            margin-left: 5px;
        }
    }

    .checkbtn-bottom {
        position: fixed;
        background: #fff;
        line-height: 30px;
        bottom: 0px;

        span {
            display: inline-block;
        }
    }

    .order-detail-box {
        height: calc(~'100vh - 2.8rem');
        overflow: auto;
    }
</style>
