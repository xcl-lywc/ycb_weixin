import Vue from "vue";
import Router from "vue-router";

/* index */
import Index from "./views/Index.vue";

/* 登陆 */
import Login from "./views/Login.vue";

/* 微信登陆获取信息 */
import WXLogin from "./views/WXLogin.vue";

/* 首页 */
import Home from "./views/Home.vue";

/* 城市定位 */
import AlphabeticSearch from "./components/AlphabeticSearch.vue";

/* 微信支付 */
import WXPayPage from "./views/PayPage.vue";

/* 微信支付-购买保险 */
// import BuyInsurance from "./views/BuyInsurance.vue";


/* 交易行情与匹配列表 */
import TradeMatchIndex from "./views/TradeMatch/Index.vue";
//首页---交易行情
import TradeQuotation from "./views/TradeMatch/TradeQuotation.vue";
//货主---发货---车源匹配列表
import MatchList from "./views/TradeMatch/MatchSourceList.vue";

/* 车主---找货 */
import FindGoodsIndex from "./views/carOwner/FindGoods/Index.vue";
import GoodsRoute from "./views/carOwner/FindGoods/GoodsRoute.vue";
import EditRoute from "./views/carOwner/FindGoods/EditRoute.vue";
import OrderDetail from "./views/carOwner/FindGoods/OrderDetail.vue";

/* 车主---货源信息 */
import GoodsSourceIndex from "./views/carOwner/GoodsSource/Index.vue";
import SourceInformation from "./views/carOwner/GoodsSource/SourceInformation.vue";
import SourceDetails from "./views/carOwner/GoodsSource/SourceDetails.vue";

/* 货主---发货 */
import DeliverGoods from "./views/cargoOwner/DeliverGoods.vue";

/* 货主---车源信息 */
import CarSource from "./views/cargoOwner/CarSourceInfo.vue";

/* 我的 */
//我的---物流运输
import My from "./views/My.vue";
import TransportationIndex from "./views/LogisticsTransportation/Index.vue";
import PendingOrder from "./views/LogisticsTransportation/PendingOrder.vue";
import PendingDeliver from "./views/LogisticsTransportation/PendingDeliver.vue";
import ToSend from "./views/LogisticsTransportation/ToSend.vue";
import Completed from "./views/LogisticsTransportation/Completed.vue";
import UserDetail from "./views/LogisticsTransportation/UserDetail.vue";
import MatchingVehicleSource from "./views/LogisticsTransportation/MatchingVehicleSource.vue";
import EditOrder from "./views/LogisticsTransportation/EditOrder.vue";
// 车主---- 我的 --- 物流运输 ---- 进行中
import CarPendingDeliver from "./views/LogisticsTransportation/CarPendingDeliver.vue";



// user_type 用户类别 1为我是车主，2为我是货主
// type为NavLayout表示需要底部导航，为BlankLayout则为不需要底部导航

Vue.use(Router);
export default new Router({ 
  // mode: 'history',  //去掉url中的#
  // base: '/dist',    //可在/后添加一个文件名
  routes: [
  	{ path: "/", redirect: "/login" },
		{ 
			path: "/pay/:id",
			name: "wxPayPage",
			component: WXPayPage,
			meta: {
				showInNav: false,
				navName: "微信支付",
				type: 'wxPayPage',
				showDirection: 'right',  
			},
		},
//     {
//       path: "/pay",
//       name: "payTradeMatchIndex",
//       component: TradeMatchIndex,
//       meta: {
//         showInNav: false,
//         navName: "支付页面",
//         type: 'BlankLayout',      
//       },
//       children: [
// 				{ 
// 					path: "wxpay/:id",
// 		      name: "wxPayPage",
// 		      component: WXPayPage,
// 		      meta: {
// 		        showInNav: false,
// 		        navName: "微信支付",
// 		        type: 'BlankLayout',
// 		        showDirection: '',  
// 		      },
// 				},
// 				{ 
// 					path: "buy_insurance/:id",
// 		      name: "buyInsurance",
// 		      component: BuyInsurance,
// 		      meta: {
// 		        showInNav: false,
// 		        navName: "微信支付",
// 		        type: 'BlankLayout',
// 		        showDirection: 'right',  
// 		      },
// 				},
// 			]
// 		},
		
		//车主、货主首页
    {
      path: "/home",
      name: "home",
      component: TradeMatchIndex,
      meta: {
        showInNav: true,
        navName: "首页",
        type: 'NavLayout',
        iconImg: 'icon_tab1',
        iconImgChecked: "icon_tab1_checked",
        showDirection: '',  
        user_type: [1,2],      
      },
      children: [
      	{
					path: "",
					name: "home",
					component: Home,
					meta: {
						showInNav: true,
						navName: "首页",
						type: 'NavLayout',
						iconImg: 'icon_tab5',
						iconImgChecked: 'icon_tab5_checked',
						user_type: [1,2],
					},
				},
				{
					path: "trade_quotation",
					name: "tradeQuotation",
					component: TradeQuotation,
					meta: {
						showInNav: true,
						navName: "交易详情",
						showDirection: '', 
						type: 'tradeQuotation',
					},
				},
      ],
    },
		//货源信息(车主)
		{
      path: "/source_information",
			// name: "sourceInformation",
			component: GoodsSourceIndex,
      meta: {
        showInNav: true,
        navName: "货源信息",
        type: 'NavLayout',
        iconImg: 'icon_ctab2',
        iconImgChecked: 'icon_ctab2_check',
        user_type: [1],
      },
			children:[
				{
					path: "",
					name: "sourceInformation",
					component: SourceInformation,
					meta: {
						showInNav: true,
						navName: "货源信息",
						type: 'NavLayout',
						iconImg: 'icon_ctab2',
						iconImgChecked: 'icon_ctab2_check',
						user_type: [1],
					},
				},
				{
					path: "source_details/:id",
					name: "sourceDetails",
					component: SourceDetails,
					meta: {
						showInNav: true,
						navName: "货源信息详情",
						showDirection: '', 
						type: 'sourceDetails',
					},
				},
			]
    }, 
		//车源信息(货主)
    {
      path: "/car_source",
      name: "carSource",
      component: CarSource,
      meta: {
        showInNav: true,
        navName: "车源信息",
        type: 'NavLayout',
        iconImg: 'icon_ctab2',
        iconImgChecked: 'icon_ctab2_check',
				user_type: [2],
      },
    },
		//发货(货主)
    {
      path: "/deliver_goods",
      name: "tradeMatchIndex",
      component: TradeMatchIndex,
      meta: {
        showInNav: true,
        navName: "发货",
        type: 'NavLayout',
        iconImg: 'icon_ctab3',
        iconImgChecked: 'icon_ctab3',
        showDirection: 'bottom',
				user_type: [2],
      },
			children: [
				{
					path: "",
					name: "deliverGoods",
					component: DeliverGoods,
					meta: {
						showInNav: true,
						navName: "发货",
						type: 'NavLayout',
						iconImg: 'icon_ctab3',
						iconImgChecked: 'icon_ctab3',
						showDirection: 'bottom',
						user_type: [2],
					},
				},
				{
					path: "match_list/:id",
					name: "matchList",
					component: MatchList,
					meta: {
						showInNav: true,
						navName: "车源匹配",
						showDirection: '', 
						type: 'NavLayout',
						user_type: [2],
					},
				},
			],
    },
		//找货(车主)
		{
			path: "/find_goods",
			// name: "goodsRoute",
			component: FindGoodsIndex,
			meta: {
				showInNav: true,
				navName: "找货",
				type: 'findGoods',
				iconImg: 'icon_ctab3',
				iconImgChecked: 'icon_ctab3',
				showDirection: '',
				user_type: [1],
			},
			children: [
				{
					path: "",
					name: "goodsRoute",
					component: GoodsRoute,
					meta: {
						showInNav: true,
						navName: "找货-我的路线、发布路线",
						type: 'goodsRoute',
						iconImg: 'icon_ctab3',
						iconImgChecked: 'icon_ctab3',
						showDirection: '',
						user_type: [1],
					},
				},
				{
					path: "edit_route",
					name: "editRoute",
					component: EditRoute,
					meta: {
						showInNav: true,
						navName: "找货-编辑路线",
						type: 'editRoute',
						showDirection: '',
						user_type: [1],
					},
				},
				{
					path: "order_detail/:id",
					name: "orderDetail",
					component: OrderDetail,
					meta: {
						showInNav: true,
						navName: "找货-订单详情",
						type: 'orderDetail',
						showDirection: '',
						user_type: [1],
					},
				},
			],
		},
		//我的(车主、货主)
    {
      path: "/my",
      // name: "transportation",
      component: TransportationIndex,
      meta: {
        showInNav: true,
        navName: "我的",
        type: 'NavLayout',
        iconImg: 'icon_tab5',
        iconImgChecked: 'icon_tab5_checked',
        user_type: [1,2],
      },
			children: [
				{
					path: "",
					name: "my",
					component: My,
					meta: {
						showInNav: true,
						navName: "我的",
						type: 'NavLayout',
						iconImg: 'icon_tab5',
						iconImgChecked: 'icon_tab5_checked',
						user_type: [1,2],
					},
				},
				{
					path: "pending_order",
					name: "pendingOrder",
					component: PendingOrder,
					meta: {
						showInNav: true,
						navName: "待接单",
						type: 'NavLayout',
					},
				},
				{
					path: "pending_deliver",
					name: "pendingDeliver",
					component: PendingDeliver,
					meta: {
						showInNav: true,
						navName: "进行中",
						type: 'NavLayout',
					},
				},
				{
					path: "car_pending_deliver",
					name: "carPendingDeliver",
					component: CarPendingDeliver,
					meta: {
						showInNav: true,
						navName: "进行中",
						type: 'NavLayout',
					},
				}, 
				{
					path: "completed",
					name: "completed",
					component: Completed,
					meta: {
						showInNav: true,
						navName: "已交付",
						type: 'NavLayout',
					},
				},
				{
					path: "to_send",
					name: "toSend",
					component: ToSend,
					meta: {
						showInNav: true,
						navName: "已送达",
						type: 'NavLayout',
					},
				},
				{
					path: "user_detail",
					name: "userDetail",
					component: UserDetail,
					meta: {
						showInNav: true,
						navName: "个人信息",
						type: 'BlankLayout',
						showDirection: 'right',
					},
				},
				{
					path: "matchingvehiclesource/:id",
					name: "matchingVehicleSource",
					component: MatchingVehicleSource,
					meta: {
						showInNav: true,
						navName: "车源信息",
						type: 'BlankLayout', 
					},
				},
				{
					path: "edit_order/:id",
					name: "editOrder",
					component: EditOrder,
					meta: {
						showInNav: true,
						navName: "编辑货源",
						type: 'BlankLayout', 
					},
				},
				
				
			]
    },
    //登陆
		{
      path: "/login",
      name: "login",
      component: Login,
      meta: {
        showInNav: false,
        navName: "登录",
        type: 'BlankLayout',
      },
    },
    //登陆
		{
      path: "/wxlogin",
      name: "WXLogin",
      component: WXLogin,
      meta: {
        showInNav: false,
        navName: "微信登录",
        type: 'BlankLayout',
      },
    },
    
    //城市定位
		{
      path: "/alphabetic_search",
      name: "alphabeticSearch",
      component: AlphabeticSearch,
      meta: {
        showInNav: false,
        navName: "城市搜索",
        type: 'alphabeticSearch',
        showDirection: 'bottom',
      },
      children:[]
    }, 
  ],
  linkActiveClass: "active"
});
