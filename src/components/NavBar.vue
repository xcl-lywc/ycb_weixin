/*********************导航组件***********************/
  Author: xieyuanyuan
  Date:   2018-09-28
/************************************************/
<template>
  <div>  
    <van-tabbar v-model="$store.state.activeMenuIndex">  
      <van-tabbar-item v-for="(item,index) in urls" :key="index" :to="{path: item.path}">
          <span slot-scope="props">
            {{item.meta.navName}}
          </span>
          <img
            slot="icon"
            slot-scope="props"
            :src="!props.active ? iconImgs[item.meta.iconImg] : iconImgs[item.meta.iconImgChecked]"
          >
      </van-tabbar-item> 
    </van-tabbar> 
  </div>
</template>

<script> 
  export default {
    data () {
      return { 
        active: 0,
        urls: this._buildNavUrls(),
        iconImgs:{ //只能这样获取图片
          icon_tab1:require('../assets/images/icon_tab1.png'),
          icon_tab1_checked:require('../assets/images/icon_tab1_checked.png'),
          icon_ctab2:require('../assets/images/icon_ctab2.png'),
          icon_ctab2_check:require('../assets/images/icon_ctab2_check.png'),
          icon_ctab3:require('../assets/images/icon_ctab3.png'),
          icon_tab5:require('../assets/images/icon_tab5.png'),
          icon_tab5_checked:require('../assets/images/icon_tab5_checked.png'),
        },
        
      }
    },
    computed: {
      userDataComputed() { 
        return this.$store.state.userData; 
      }
    },
    watch: {
      /*
       * 监听到用户信息用变化时，重新调用导航数据
       */
      userDataComputed(newVal, oldVal) {
        this.urls = this._buildNavUrls();
      },
      /*
       * 监听地址变化
       */
      $route(to,from){  
        if(!this.urls) return false;  
        this.urls.forEach((item, index) => {  
          to.path.indexOf(item.path) != -1 ? this.$store.state.activeMenuIndex = index : ''; 
        }) 
      }
    },
    created () {   
    },
    mounted () { 
    },
    methods: {
      /*
       * 栏目
       */ 
      _buildNavUrls () {   
        if(!this.getCookie('userData')) return false;
        let routes = this.$router.options.routes,
            urls = [];
        routes.forEach((route) => {
          // debugger
            let meta = route.meta;
            // ----------- 类型为orgManage类型，并且是显示状态和，有权限的情况 ------
            if (meta && meta.showInNav) {
              // debugger
              if(meta.user_type){
                meta.user_type.forEach((item) => {
                   // 根据不同的类型显示不同的页面 
                  if(item == JSON.parse(this.getCookie('userData')).type){
                    urls.push(route);
                  }
                })
              }
              
            }
        }); 
        return urls;
      },
      changeMenu(menu,s,ss){ 
      },
    }
  }
</script>
