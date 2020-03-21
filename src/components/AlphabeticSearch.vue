<template>
  <div class="alphabetic-list">
    <!-- <p class="back" :class="{'back-hide': isSearchInputFocus}"><van-icon @click=" $router.back(-1) " name="arrow-left"/> <span>城市选择</span></p> -->
    <div class="position-box" :class="{'position-box-big': isSearchInputFocus}">
      <div class="search-box"> 
        <van-search
          class="search"
          v-model="searchValue"
          placeholder="请输入城市中文名称或拼音"
          show-action
          @keydown="onSearchKeydown()"
          @focus="onSearchFocus()"
          @cancel="onCancel"> 
        </van-search> 
        <!-- <van-list v-show="isSearchInputFocus" class="search-result">
          <van-cell
            v-for="item in result"
            :key="item"
            :title="item"
          />
        </van-list> -->
      </div> 
      <!-- <div v-show="isSearchInputFocus" @click=" isSearchInputFocus = false " class="overlay-style"></div> -->
      <div class="position-innter" style="margin-top: 30px;">
        <h5>定位城市</h5>
        <van-button type="default" size="small">默认按钮</van-button>
      </div>
      <!-- <div class="position-innter">
        <h5>最近访问城市</h5>
        <van-button type="default" size="small">默认按钮</van-button>
        <van-button type="default" size="small">默认按钮</van-button>
        <van-button type="default" size="small">默认按钮</van-button>
        <van-button type="default" size="small">默认按钮</van-button>
        <van-button type="default" size="small">默认按钮</van-button>
        <van-button type="default" size="small">默认按钮</van-button>
      </div>
      <div class="position-innter">
        <h5>热门城市</h5>
        <van-button type="default" size="small">默认按钮默认按钮默认按钮</van-button>
        <van-button type="default" size="small">默认按钮</van-button>
        <van-button type="default" size="small">默认按钮</van-button>
        <van-button type="default" size="small">默认按钮</van-button>
        <van-button type="default" size="small">默认按钮</van-button>
        <van-button type="default" size="small">默认按钮</van-button>
      </div> -->
      <!-- 锚点 -->
      <div class="anchors">
        <!-- <van-icon name="search"/> -->
        <!-- <p>定位最近最热</p> -->
				<p>定位</p>
        <ul>
          <li v-for="(item, index) in anchorsList" class="letter-nav">
            <a :name="`#0${index + 1}`" @click="jumpPosition(item,index)">{{item}}</a>
          </li>
        </ul>
      </div>
      <div class="alphabetic-result">
        <div class="result-box" v-for="(item, index) in alphabeticList">
          <p class="title" :id="`${item.typeName}${index}`" >{{item.typeName}}</p>
          <ul>
            <li v-for="(itemOption, indexOption) in item.list" @click="transferValue(itemOption.code,itemOption.name)">{{itemOption.name}}</li>
          </ul>
        </div>
      </div> 
    </div> 
  </div>
</template>
<script type="text/javascript"> 
 export default {
  components:{ 
  },
  data(){
    return {
      searchValue: '', //搜索框中的值
      isSearchInputFocus: false, //为true将头部跟页面内容给隐藏
      result:[1,2,3,4,5],
      anchorsList: [],
      alphabeticList: [], //搜索结果
    }
  },
  watch:{ 
  },
  mounted(){
    // this.getQueryAreaData();
		this._scortAreaList(JSON.parse(sessionStorage.getItem('configMesg')).area);
  },
  methods: {
    /*
     * 监听到数据有变化，重查页面数据
     */
    onSearchKeydown(){
      this.result = [8,9,10,5];
    },
    onSearchFocus(){  
      this.isSearchInputFocus = true;
    },
    /*
     * 点击取消搜索按钮切换状态
     */
    onCancel(){
      this.isSearchInputFocus = false;
      this.result = [1,2,3,4,5]
    },
    /*
     * 根据不用的Id跳转指定的Id位置
     * @params {string} typeName 类型名臣
     * @params {string/number} index 下标
     */
    jumpPosition(typeName, index){
			this.$nextTick(() => {
        window.scrollTo(0,document.getElementById(`${typeName}${index}`).offsetTop);
      });
    },
    /*
     * 获取地区列表
     */
    getQueryAreaData(){
      this.axios.get(`${this.commonJs.basePath}/v1/area/children`, {params: {parent_area_code: 0}}).then( (response) => {
        this._scortAreaList(response.data.data);
      }).catch( (error) => {
        this.$toast(error)
      });
    },
    _scortAreaList(data){
      let titleNameList = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
      let prestoreList = [];
      titleNameList.forEach((item,index) => {
        prestoreList.push({typeName: item, list:[]});
        data.forEach((itemOption,indexOption) => {
          if(item.toLowerCase() == itemOption.py_short.substring(0,1).toLowerCase()){
            prestoreList[index].list.push(itemOption);
          }
        })
      })

      /*
       * 将没有数据的类别数据给剔除
       */
      prestoreList.forEach((item)=> {
        if(item.list.length){
          this.anchorsList.push(item.typeName);
          this.alphabeticList.push(item);
        }
      })


      console.log(this.alphabeticList);
    },
		
		/* 
		 子组件向父组件传值code和name
		 */
		transferValue(code,name){
			this.$emit('codeName',code,name)
		},
  }
};
</script>
<style lang="less">
  .position-box{
    transition: all .2s;
    position: relative;
    top: 0px;
    /*background-color: #ededed;*/
    padding: 15px 30px 15px 15px;
    .position-innter{
      border-bottom: 1px solid #e3e3e5;
      margin-bottom: 5px;
    }
    h5{
      margin-bottom: 10px;
      font-size: 15px;  
    }
    button{
      width: 20%;
      margin-right: 5%;
      margin-bottom: 5px;
      text-overflow:ellipsis;overflow:hidden;white-space:nowrap;
    }
  }
  .position-box-big{
    top: 0;
  }
  .alphabetic-list{
    .mint-indexlist-nav{
      position: fixed;
      top: 40px;
    }
    .mint-indexlist-indicator{
      position: relative;
    }
    .search-box{
      // position: relative;
			position: fixed;
			width: 100vw;
      z-index: 6;
      margin:  -15px -30px -15px -15px;
      .search{
        border-bottom: 1px solid #e3e3e5;
      }
      .search-result{

      }
    }

    .back {
        will-change: transform;
        transition: all .2s;
        width:100%;
        left:0;
    }  

    .back-hide {
      transform: translateY(-40px);
    } 
    .overlay-style{
      position: fixed;
      background-color: rgba(0,0,0,.5);
      z-index: 5;
      height: 100vh;
      width: 100vw;
      left: 0;
      top: 0;
    }
    .anchors{
      margin-top: 100px;
      width: 27px;
      position: fixed;
      right: 0;
      top: 0;
      font-size: 12px;
      text-align: center;
      color: #727272;
			line-height: 16px;
      a{
        color: #727272;
      }
    }
  }
  .alphabetic-result{
    margin:  15px -30px -15px -15px;
    color: #717171;
    p.title{
      padding-left: 15px;
      line-height: 25px;
      background-color: #ebebec;
    }
    ul{
      background-color: #fff;
      li{
        margin: 0 30px 0 15px; 
        line-height: 40px;
        border-bottom: 1px solid #e3e3e5;
      }
    }
  }
  
</style>