<template>
  <div v-if="isRouterAlive">
    <nav-bar></nav-bar>
    <router-view></router-view>
  </div>
</template>

<script>
  import NavBar from "../components/NavBar.vue"
  export default {
    components: {
      "nav-bar": NavBar, 
    },
    data() {
      return {
        isRouterAlive: true, //刷新当前页面状态
      };
    },
    watch: {
      /*
       * 监听到用户信息用变化时，重新调用导航数据
       */
      userDataComputed(newVal, oldVal) {
        this.isRouterAlive = false
        this.$nextTick(() => (this.isRouterAlive = true))
      }, 
    },
    computed: {
      userDataComputed() { 
        return this.$store.state.userData; 
      }
    },
    created () {
      // this.getUserInfo();
    },
    methods: {
      
      
    }
  }
</script>

<style scoped lang="less">
   
</style>
