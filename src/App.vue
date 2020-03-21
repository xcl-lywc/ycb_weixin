<template>
  <div id="app" :class="[isIos ? 'xn-ios':'']">
      <transition :name="transitionName">
        <!-- 根据需要显示不同的布局情况 -->
        <component :is="layout"></component>
      </transition>
  </div>  
</template>
<script>
  import BlankLayout from "./layout/BlankLayout.vue";
  import NavLayout from "./layout/NavLayout.vue";

  export default {
    props: {
      layout: {
        type: String,
        default: "nav-layout"
      }
    },
    components: {
      "nav-layout":   NavLayout,
      "blank-layout": BlankLayout
    },
    data() {
      return {
        isIos:false,
        transitionName:'',
      };
    },
    mounted(){
      this.getDevice();
    },
    methods: {
      getDevice(){
          if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
              this.isIos = true;
          }
      },
    },
    watch: {//使用watch 监听$router的变化
      $route(to, from) {
        // debugger
        if(to.meta.showDirection){
          this.transitionName = `slide-${to.meta.showDirection}`
        }else{
          this.transitionName = ''
        }
      }
    } 
  }
</script>
<style lang="less">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
 
} 
</style>
<style>
    * {
        /*margin: 0;
        padding: 0;
        -webkit-overflow-scrolling: touch;
        -webkit-tap-highlight-color: transparent;
        font-family: arial;
        color: #333;
        -webkit-user-select: none;*/
    }

    html {
        /*font-family: arail;
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
        line-height: 1;
        font-size: 20px;
        height:100%;
        overflow-x: hidden;*/
    }
    body{
        /*position: relative;
        overflow-x: hidden;
        background: #f0f2f5;
        min-height:100%;
        display: flex;
        flex-direction: column;*/
    }
    #app{
        display: flex;
        flex:1;
        flex-direction: column;
        background: #f0f2f5;
    }
    img {
        display: block;
    }
    ul,ol{
        list-style: none;
    }
    a{
        text-decoration: none;
        outline: none;
    }
    .slide-right-enter-active,
    .slide-right-leave-active,
    .slide-left-enter-active,
    .slide-left-leave-active,
    .slide-bottom-enter-active,
    .slide-bottom-leave-active,
    .slide-top-enter-active,
    .slide-top-leave-active {
        will-change: transform;
        transition: all .5s;
        position: absolute;
        width:100%;
        left:0;
    }
    .slide-bottom-enter-active,
    .slide-bottom-leave-active,
    .slide-top-enter-active,
    .slide-top-leave-active {
      top: 0;
    }
    .slide-right-enter {
        transform: translateX(100%);
    }
    .slide-right-leave-active {
        transform: translateX(-100%);
    }
    .slide-left-enter {
        transform: translateX(100%);
    }
    .slide-left-leave-active {
        transform: translateX(-100%);
    }
    .slide-bottom-enter {
        transform: translateY(100%);
    }
    .slide-bottom-leave-active {
        transform: translateY(-100%);
    }
    .slide-top-enter {
        transform: translateY(-100%);
    }
    .slide-top-leave-active {
        transform: translateY(100%);
    }
</style> 