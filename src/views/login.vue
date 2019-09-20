<template>
  <div id="loginPage" :class="{pcBg:$store.getters.isPC}">
    <!-- pc头部 -->
    <Header class="login-header" v-show="$store.getters.isPC">
      <img class="logo" src="../../static/logo.png" alt="">
       <div class="right-block">
         <!-- <div class="searchInput">
           <input type="text"> <Icon type="ios-search"> </Icon>
         </div> -->
         <router-link to="/loginAdmin">控制台</router-link>
         <a href="">文档</a>
       </div>
    </Header>
    <!-- 移动端头部 -->
    <Header class="login-header" style="text-align:center" v-show="!$store.getters.isPC">{{currentView=='pcA'?'注册':currentView=='pcB'?'登录':'找回密码'}}</Header>
    <img class="logo_mob" v-show="!$store.getters.isPC" src="../../static/logo_mob.png">

    <Content class="login-content">
      <Carousel  v-show="$store.getters.isPC" v-model="value2" :height="331" loop>
        <CarouselItem>
            <div class="demo-carousel">1</div>
        </CarouselItem>
        <CarouselItem>
            <div class="demo-carousel">2</div>
        </CarouselItem>
        <CarouselItem>
            <div class="demo-carousel">3</div>
        </CarouselItem>
        <CarouselItem>
            <div class="demo-carousel">4</div>
        </CarouselItem>
      </Carousel>
    <div class="selector" v-show="$store.getters.isPC">
      <button @click="changeSelector(item.flag)" v-for="item in selector" :class="{active:item.flag == titleName}"><span>{{item.chTitle}}</span> <span>{{item.enTitle}}</span> </button>
    </div>
    <div class="selector-block" v-show="$store.getters.isPC" style="padding: 113px 0 72px">
       <div class="loginBox" style="width: 546px;height: 455px">
         <div class="bg">
           <img style="width:151px;height:36px;" class="logo" src="../../static/logo.png" alt=""/>
           <p class="fs12" style="color:#aacd06">帮助合作伙伴构建基于通链云的业务实践和解决方案</p>
           <p class="fs11" style="color:#fff">Help Partners Build Business Practices and SolutionsBased on The Through Chain Cloud</p>
           <p class="btm">Copyright © 2018 Tonc.io</p>
         </div>
         <component v-bind:is="currentView"></component >
       </div>
    </div>
     <!-- 移动端使用 -->
     <div class="selector_mob" v-show="!$store.getters.isPC">
       <component @mob_select=changeSelector v-bind:is="currentView"></component >
     </div>
    </Content>
    <!-- 底部 -->
    <Footer class="login-foot" v-show="$store.getters.isPC">
      <div class="foot-block">
        <div style="overflow:hidden">
          <dl class="withImg">
            <dt style="margin-bottom:0">售前咨询热线</dt>
            <dt>+86-028-6764 6941</dt>
            <dd>专业技术咨询</dd>
            <dd>全方位产品解读</dd>
            <dd>成熟解决方案</dd>
            <dd>成功客户案例分享</dd>
          </dl>
          <dl class="">
            <dt>产品介绍</dt>
            <dd><a href="">渠道管控</a></dt>
            <dd><a href="">品牌防伪</a></dd>
            <dd><a href="">产品溯源</a></dd>
            <dd><a href="">会员积分系统</a></dd>
            <dd><a href="">通链云</a></dd>
          </dl>
          <dl class="">
            <dt>客户案例</dt>
            <dd><a href="">快速消费品</a></dt>
            <dd><a href="">渠道流通</a></dd>
            <dd><a href="">奢侈品</a></dd>
            <dd><a href="">区块链</a></dd>
            <dd><a href="">以太坊</a></dd>
          </dl>
          <dl class="">
            <dt>产品价格</dt>
            <dd><a href="">免费版</a></dt>
            <dd><a href="">专业版</a></dd>
            <dd><a href="">企业版</a></dd>
          </dl>
          <dl class="">
            <dt>inward咨询</dt>
            <dd><a href="">公司动态</a></dt>
            <dd><a href="">行业资讯</a></dd>
          </dl>
          <dl class="">
            <dt>关注通链云</dt>
            <dd><a href="">通链云微信</a></dt>
            <dd> <img class="code" src="../../static/code.gif" alt=""> </dd>
            <dd><a href="">通链云微博</a></dd>
            <dd><a href="">客户服务中心</a></dd>
          </dl>
        </div>
        <hr/>
        <div class="aboutMe">
         <a class="link">关于我们</a>
         <span>帮助合作伙伴构建基于通链云的业务实践和解决方案</span>
         <p>Copyright © 2017 Tonchain Network Tech., All Rights Reserved 通链网络科技 版权所有　　蜀ICP备17011603号-1</p>
         <p>成都高新区益州大道中段722号4栋10楼1012号　　　服务热线：+86-028-6764 6941</p>
        </div>
      </div>
    </Footer>
  </div>

</template>
<script>
import registerCom from './login_register.vue'
import loginCom from './login_sub.vue'
import findPwdCom from './login_findPwd.vue'

export default {
  components: {
    'pcA':registerCom,
    'pcB':loginCom,
    'pcC':findPwdCom
  },
  computed:{
    currentView:function(){
      return `pc${this.titleName}`
    }
  },
  data() {
    return {
      titleName:'B',
      selector: [{
        chTitle: '免费注册',
        enTitle: 'Free Registrat',
        flag:'A'
      },{
        chTitle: '在线登录',
        enTitle: 'Online Login',
        flag:'B'
      },{
        chTitle: '找回密码',
        enTitle: 'Find Password',
        flag:'C'
      }],
      value2:0
    }
  },
  methods: {
    changeSelector(index) {
      this.titleName = index
    }
  }
}
</script>

<style lang='less' scoped>
/deep/ .wrap{
  height: 100%
}
.fs12 {
  font-size: 12px;
}
.fs11 {
  font-size: 11px
}
/deep/ .codeBtn {
  width:95px;
  float:right;
  padding: 0 5px;
  height: 27px;
  color: #1F3F52;
  font-size: 12px;
  background: #accd15;
  text-align: center;
  &:hover {
    color: #fff;
  }
  &[disabled] {
    background: #999;
    color: #666
  }
}
.inputTag {
  position: absolute;
  top: 0;
  left: 0;
  width: 29px;
  height: 27px;
  color: #fff;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  background: #accd15;
  font-size: 21px;
  text-align: center;
  line-height: 27px;
}
.form-input {
  width: 280px;
  height: 27px;
  border: 1px solid #ccd1d5;
  color: #000;
  border-radius: 3px;
}
.bottomBtn {
  position: absolute;
  text-align: right;
  width: 279px;
  bottom: 0;
  padding: 20px 0;
  border-top: 1px solid #accd15;
  button {
    width: 118px;
    padding: 6px 0;
    border-radius: 3px;
    text-align: center;
    color: #fff;
    background: #00334a;
    cursor: pointer;
  }
}
.link {
  color: #9B9EA0;
  &:hover {
    color: #accd15;
  }
}
.pcBg {
  background: #accd15;
}
.mob_btn{
  font-size: 16px
}

#loginPage {

  .logo_mob {
    display: block;
    width:30%;
    margin: 10% auto 15%;
  }
  .login-header {
    height: 42px;
    background: #00486b;
    border-bottom: 1px solid #00486b;
    color: #fff;
    line-height: 42px;
    border-bottom: 1px solid #accd15;
    .logo {
      width: 122px;
      vertical-align: middle;
    }
    .right-block{
      float: right;
      a {
        float: right;
        color: #fff;
        margin-left: 30px;
      }
      .searchInput {
        display: inline-block;
        height: 26px;
        padding: 0 5px;
        color: #fff;
        background: #203f54;
        margin-top: 7px;
        input {
          float: left;
          height: 26px;
          color: #fff;
          background: transparent;
        }
        i {
          float: right;
          font-size: 18px;
          margin-top: 4px;
          border-left: 1px solid #fff;
          padding: 0 5px 0 10px;
        }
      }
    }
  }
  .login-content {
    .ivu-carousel {
      background: #506b9e;
      text-align: center;
      color: #fff;
      font-size: 28px
    }
    .selector {
      text-align: center;
      background: #808082;
      height: 76px;

      button {
        border-left:1px solid #fff ;
        border-right: none;
        border-top: none;
        border-bottom: none;
        background: transparent;
        width: 301px;
        height: 76px;

        &:hover,&.active {
          cursor: pointer;
          background: #accd15
        }
      }
      span {
        display: block;
        color: #fff
      }
    }
    /deep/ .selector_mob {
      width:90%;
      margin: 0 auto;

     .loginBox_mob {
        padding:10px 0;
        margin: 5% auto;
        border-bottom: 1px solid #eee;

        i {font-size: 25px;margin-right:5px }
        input {
          width: calc(100% - 136px);
        }
      }
      a {
        font-size: 14px;
        color: #999
      }
      button:not(.codeBtn) {
        display: block;
        width:85%;
        margin: 15% auto 20%;
        font-size: 15px;
      }
    }
    /deep/ .selector-block {
      .loginBox {
        margin: 0 auto;
        border-radius: 5px;
        background: #f8f8f8;
        .bg {
          text-align: center;
          position: relative;
          float: left;
          width: 219px;
          height: 100%;
          border-bottom-left-radius: 5px;
          border-top-left-radius: 5px;
          background: url('../../static/bgimg.jpg') center center;
          .logo {
            margin-top: 99px;
            margin-bottom: 111px;
          }
          p {
            padding: 0 25px;
            margin-bottom: 20px;
          }
          .btm {
            position: absolute;
            bottom: 0;
            width: 100%;
            background: #00334a;
            border-top: 1px solid #aacd06;
            margin-bottom: 0;
            padding: 7px 0 3px;
            color: #fff;
            border-bottom-left-radius: 5px;
          }
        }
        .formBox {
          position: relative;
          float: right;
          padding: 56px 24px 25px;
          width: 327px;
          height: 100%;
          label {
            display: block;
            color: #CCD1D5;
            margin-bottom: 3px;
            span { color: #757475; margin-right: 3px}
          }
          .inputBox {
            position: relative;
            margin-bottom: 10px;
            i {
              .inputTag;
            }
            input {
              text-indent: 29px;
              .form-input;
            }
          }
          .submitBtn {
            .bottomBtn;
          }
        }
      }
    }
  }
  .login-foot {
    background: #00334a;
    color: #9B9EA0;
    padding:24px 0;
    .foot-block {
      width: 906px;
      margin: 0 auto;
      dl {
        float: left;
        margin-left: 60px;
        .code {
          width: 78px;
        }
      }
      dt {
        color: #fff;
        font-size: 15px;
        margin-bottom: 10px;
      }
      dd {
        font-size: 12px;
        margin-bottom: 8px;
        a {
          .link;
        }
      }
      .aboutMe {
        font-size: 12px;
        span,a { display: inline-block; font-size: 14px; margin: 15px 0;}
      }
    }
  }
}
</style>
