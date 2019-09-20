<template>
  <div class="welcome mobile-padding">
    <div style="font-size: 38px; letter-spacing: 2px;">欢迎使用</div>
    <div style="font-size: 39px; letter-spacing: 2px; font-weight: bold;">通链云管理控制台系统-v{{ version }}</div>
    <br />
    <div style="font-size: 22px; letter-spacing: 1px;">今天是 {{ year }}年 {{ month }}月{{ day }}日</div>
    <div style="font-size: 22px; letter-spacing: 1px;">星期{{ week }}</div>
    <br />
    <br />
    <br />
    <div style="font-size: 20px;">WELCOME TO USE</div>
    <div style="font-size: 20px; font-weight: bold;">T-CHAIN CLOUD MANAGEMENT CONSOLE SYSTEM -V{{ version }}</div>
    <br />
    <div style="font-size: 15px;">It's {{ eMonth }} {{ day }}, {{ year }}.</div>
    <div style="font-size: 15px;">{{ eWeek }}</div>

    <div class="noticeModal" v-show="noticeModal&&audit==0">
      <p>请尽快进行实名认证。</p>
      <i-button type="primary" @click="goVerifyPage">前往认证</i-button>
    </div>
  </div>
</template>

<script>
  import app from '@/utils/app'
  import date from '@/utils/date'
  import { mapActions,mapGetters } from 'vuex'

  export default {
    data() {
      return {
        audit:-1,
        noticeModal:true,
        user_type:localStorage.getItem('user_type'),
        // user_type:-1,
        version: app.version,
        year: date.year(),
        month: date.month(),
        eMonth: date.eMonth(),
        day: date.day(),
        week: date.week(),
        eWeek: date.eWeek()
      }
    },
    watch:{
      enterp_BaseInfo:function(val){
        this.audit=val.audit
      }
    },
    computed:{
      ...mapGetters([
        'enterp_BaseInfo'
      ])
    },
    methods: {
      ...mapActions([
        'queryEnterBaseInfo'
      ]),
      goVerifyPage(){
        this.noticeModal=false
        this.$router.replace('/setting/upEnterpInfo')
      }
    },
    created() {
      // console.log(0, this.$store.getters.mock)
      // this.$store.dispatch('setMock')
      setTimeout(() => {
        // console.log(1, this.$store.getters.mock)
      }, 0)
    },
    mounted() {
      //提示企业注册实名信息
      if(this.user_type==0){
        // 获取企业基础信息
        this.queryEnterBaseInfo({})
      }
    }
  }
</script>

<style lang='less'>
  .welcome {
    font-weight: lighter;
    color: #fff;
    background: #ABCD04;
  }
  .ivu-notice-notice{
    top:45px
  }
  .noticeModal{
    font-weight: 600;
    padding: 20px;
    border-radius: 10px;
    color: #666;
    font-size: 14px;
    width:300px;
    height:150px;
    background: #fff;
    position: fixed;
    top: 15%;
    left:50%;
    margin-left: -150px;
    box-shadow: 0 1px 6px rgba(0,0,0,.2);

    button{
      position: absolute;
      right:20px;
      bottom: 20px;
    }
  }
  @media (max-width: 768px) {
    .welcome {
      text-align: center;
    }
  }
</style>
