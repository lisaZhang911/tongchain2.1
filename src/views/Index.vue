<template>
  <div class="index">
    <div class="top">
      <Icon color="#ADCD00" v-show="!$store.getters.isPC" type="md-reorder" size="31" @click.native='handdleNav()'/>
      <div style="font-size: 18px;" @click="goWelcome()" v-show="$store.getters.isPC">

      </div>
      <div class="title" :style="$store.getters.isPC || 'display: table-cell;'">
        <!-- <img style="width:110px;float:left" src="../static/logo.png" alt=""> -->
        <span style="display: inline-block;" v-show="$store.getters.isPC">欢迎使用</span> <span style="display: inline-block; color: #ADCD00;">{{staticTitle}}</span>
      </div>
      <div class="user">
        <!-- <Input class="search" icon="ios-search-strong" placeholder="Search" v-show="$store.getters.isPC" /> -->
        <span class="date-time" v-show="$store.getters.isPC">{{ dateTime }}</span>
        <!-- <Avatar class="avatar" icon="person" src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=4170304738,2895518923&fm=27&gp=0.jpg" v-show="$store.getters.isPC" /> -->
        <span class="name" v-show="$store.getters.isPC">欢迎您，{{userName}}</span>
        <Icon class='logout' type="md-exit" size="24" style="cursor:pointer" @click="logout"></Icon>
      </div>
    </div>
    <div class="main">
      <div class="nav" :class="isShowNavIcon && arrClass">
        <Menu class="menu" ref="menu" :active-name="activeName" :open-names="openNames" :accordion="true" @on-select="selectNav">
          <!-- <Submenu v-show="user_type==4 || user_type==3 && authory.indexOf(6)>-1" name="produce"> -->
          <Submenu v-show="user_type==4 || user_type==3" name="produce">
            <template slot="title">
              产品管理
            </template>
            <MenuItem name="/produce/1-1/view_and_add_product">查看 / 添加产品</MenuItem>
            <MenuItem name="/produce/1-1/prodCatg">产品类别</MenuItem>
          </Submenu>
          <Submenu
            name="security"
            v-show="user_type!=0 && user_type!=2 && user_type!=5">
            <template slot="title">
              渠道管控 / 产品防伪
            </template>
            <!-- v-show="user_type==4 || user_type ==1 || user_type==3 && authory.indexOf(9)>-1" -->
            <Submenu
              v-show="user_type==4 || user_type ==1 || user_type==3"
              name="1-2">
              <template slot="title">
                代理商管理
              </template>
              <MenuItem
                name="/security/1-2/view_and_add_agent">查看 / 添加代理商</MenuItem>
              <MenuItem
                v-show="user_type!=1"
                name="/security/1-2/agentCatg">代理商类别</MenuItem>
            </Submenu>
            <Submenu
              name="1-3"
              v-show="user_type!=5 && user_type!=2 && user_type!=0">
              <template slot="title">
               绑码/收货/发货管理
              </template>
              <!-- v-show="user_type==4 || user_type==3 && authory.indexOf(2)>-1" -->
              <MenuItem
                v-show="user_type==4 || user_type==3"
                name="/security/1-3/bindings_anti-counterfeit_source_code">产品绑定防伪溯源码</MenuItem>
                <!-- v-show="user_type==4 || user_type==1 || user_type==3 && authory.indexOf(1)>-1" -->
              <MenuItem
                v-show="user_type==4 || user_type==1 || user_type==3"
                name="/security/1-3/product_delivery">产品发货</MenuItem>
                <!-- v-show="user_type==4 || user_type==1 || user_type==3 && authory.indexOf(0)>-1" -->
              <MenuItem
                v-show="user_type==4 || user_type==1 || user_type==3"
                name="/security/1-3/product_collection">产品收货</MenuItem>
              <MenuItem v-show="user_type==4||user_type==1||user_type==3" name="/security/1-3/binding_code_and_receipt_and_delivery_record_query">绑码 / 收货 / 发货记录</MenuItem>
             <!-- <MenuItem v-show="user_type==4||user_type==3&&authory.indexOf(12)>-1" name="/security/1-3/binding_code_and_receipt_and_delivery_record_query">绑码 / 收货 / 发货记录</MenuItem> -->
             <MenuItem v-show="user_type==4 || user_type==3" name="/security/1-3/product_circulation_tracking">产品流通情况追踪</MenuItem>
            </Submenu>
            <Submenu v-show="user_type==4 || user_type==3" name="1-4">
              <template slot="title">
                防伪标签管理
              </template>
              <MenuItem name="/security/1-4/anti-counterfeit_code_label_replacement">标签更换</MenuItem>
              <MenuItem name="/security/1-4/label_replacement_record_query">标签更换记录查询</MenuItem>
            </Submenu>
          </Submenu>
          <Submenu
            name="trace"
            v-show="user_type!=1 && user_type!=0 && user_type!=5">
            <template slot="title">产品溯源</template>
            <!-- <Submenu name="1-10" v-show="user_type==4 || user_type==3 && authory.indexOf(8)>-1"> -->
            <Submenu name="1-10" v-show="user_type==4 || user_type==3">
              <template slot="title">溯源相关信息管理</template>
              <MenuItem name="/trace/1-10/trace_info/1">原材料信息管理</MenuItem>
              <MenuItem name="/trace/1-10/trace_info/2">质检报告信息管理</MenuItem>
              <MenuItem name="/trace/1-10/trace_info/3">生产环境信息管理</MenuItem>
            </Submenu>
            <!-- v-show="user_type==4 || user_type==3 && authory.indexOf(8)>-1" -->
            <MenuItem
              v-show="user_type==4 || user_type==3"
              name="/trace/1-6/trace_catalogue">溯源事件管理</MenuItem>
              <!-- v-show="user_type==4 || user_type==3 && authory.indexOf(10)>-1" -->
            <MenuItem
              v-show="user_type==4 || user_type==3"
              name="/trace/1-7/proList">溯源事件记录员管理</MenuItem >
            <Submenu name="1-8" v-show="user_type==4 || user_type==2 || user_type==3">
              <template slot="title">产品溯源操作</template>
              <!-- v-show="user_type==4 || user_type==3 && authory.indexOf(2)>-1" -->
              <MenuItem
                v-show="user_type==4 || user_type==3"
                name="/trace/1-8/bind1">产品绑定防伪溯源码</MenuItem>
                <!-- v-show="user_type==4 || user_type==3 && authory.indexOf(7)>-1" -->
              <MenuItem
                v-show="user_type==4 || user_type==3"
                name="/trace/1-8/lotNumber">生产环节溯源</MenuItem>
                <!-- v-show="user_type==4 || user_type==2 || user_type==3 && authory.indexOf(4)>-1" -->
              <MenuItem
                v-show="user_type==4 || user_type==2 || user_type==3"
                name="/trace/1-8/trace_circulate">流通环节溯源</MenuItem>
            </Submenu>
            <MenuItem v-show="user_type==4 || user_type==3" name="/trace/1-9/product_circulation_tracking">产品溯源信息查询</MenuItem>
            <Submenu v-show="user_type==4" name="1-1">
              <template slot="title">
                溯源标签管理
              </template>
              <MenuItem name="/trace/1-1/anti-counterfeit_code_label_replacement">标签更换</MenuItem>
              <MenuItem name="/trace/1-1/label_replacement_record_query">标签更换记录查询</MenuItem>
            </Submenu>
          </Submenu>
          <Submenu v-show="user_type==5" name="codeSecu">
            <template slot="title">防伪码</template>
            <MenuItem name="/codeSecu/securityCode">查询/生成防伪码</MenuItem >
            <MenuItem name="/codeSecu/print">查询印刷格式</MenuItem >
          </Submenu>
          <Submenu name="setting">
            <template slot="title">系统设置</template>
            <MenuItem v-show="user_type==5" name="/setting/dataBase" >数据库配置</MenuItem >
            <MenuItem v-show="user_type==0||user_type==3||user_type==4" name="/setting/upEnterpInfo" >企业实名认证</MenuItem >
            <MenuItem v-show="user_type==5 || user_type==4 || user_type==3" name="/setting/workOrder">工单管理</MenuItem >
            <MenuItem
              v-show="user_type==5 || user_type==4 || user_type==3"
              name="/setting/sysInfo">系统消息</MenuItem >
            <MenuItem name="/setting/password_modification">密码修改</MenuItem>
          </Submenu>
          <MenuItem v-show="user_type==4" name="/manager">企业管理员</MenuItem >
          <MenuItem v-show="user_type==5" name="/enterpManage_p">企业管理</MenuItem >
          <MenuItem v-show="user_type==4" name="/enterprise/enterpManage">企业信息</MenuItem >
          <MenuItem v-show="user_type==5" name="/security/Code_prefix">防伪码前缀</MenuItem >
        </Menu>
      </div>
      <div ref="content" class="content" :style="$route.path === '/welcome' ? 'background: #ABCD04;' : 'background: #EEEFF3;'" @click="noneNav()" @scroll="noneNav()">
        <router-view id="router-view" :class="{paddingMob:!$store.getters.isPC, padding:$store.getters.isPC}"></router-view>
      </div>
    </div>
  </div>
</template>
<script>
  import app from '@/utils/app'
  import date from '@/utils/date'
  import { mapActions } from 'vuex'

  export default {
    data() {
      return {
        path:'add',
        authory:'',
        staticTitle: `通链云管理控制台系统-v${app.version}`,
        userName: localStorage.getItem('user_name'),
        title: localStorage.getItem('title'),
        user_type: -1,
        dateTime: '',
        routePath: this.$route.path,
        width: 0,
        height: 0,
        ratio: 0,
        isShowNavIcon: true,
        arrClass: ['absolute']
      }
    },
    watch: {
      width() {
        this.initNav()
      },
      height() {
        this.getRatio()
      },
      '$route': 'routingChange'
    },
    created() {
      app.title('通链云管理控制台系统')
      this.dateTime = date.year() + '年  ' + date.month() + '月' + date.day() + '日  ' + date.hour() + '时' + date.min() + '分' + date.sec() + '秒'
      setInterval(() => {
        let objDate = new Date()
        let strDate = Date()
        let time = Date().split(' ')[4]
        let year = strDate.split(' ')[3]
        let month = objDate.getMonth() + 1
        let day = strDate.split(' ')[2]
        let hour = time.split(':')[0]
        let min = time.split(':')[1]
        let sec = time.split(':')[2]
        this.dateTime = year + '年  ' + month + '月' + day + '日  ' + hour + '时' + min + '分' + sec + '秒'
      }, 1000)
      this.activeName = this.routePath
      this.openNames = this.routePath.split('/')
      this.openNames.shift()
      this.getWidth()
      this.getHeight()
      window.onresize = () => {
        return(() => {
          this.getWidth()
          this.getHeight()
          if(this.isShowNavIcon === true) {
            this.arrClass.splice(1, 1)
          } else {
            this.arrClass.splice(1, 1, 'slide')
          }
        })()
      }
      this.$on('varHeight', () => {
        this.getRatio()
      })
    },
    mounted() {
      this.$set(this,'authory', localStorage.getItem('authory') || null);
      this.$set(this,'user_type', localStorage.getItem('user_type'))
    },
    methods: {
      ...mapActions([
        'logout_'
      ]),
      logout(){
        const load = this.$Message.loading({
                      content: '退出中...',
                      duration: 0
                  });
        this.logout_().then(() => {
          setTimeout(load,300)
          this.$router.replace('/login')
        }).catch(() => {
          setTimeout(load,300)
          this.$Message.error('退出失败');
        })
      },
      getWidth() {
        window.width = document.body.clientWidth
        this.width = window.width
      },
      getHeight() {
        window.height = document.body.clientHeight
        this.height = window.height
      },
      getRatio() {
        this.$nextTick(() => {
          if(this.$store.getters.isPC) {
            this.ratio = document.getElementById('router-view').clientHeight / this.$refs['content'].clientHeight
          } else {
            this.ratio = (document.getElementById('router-view').clientHeight + 94) / this.$refs['content'].clientHeight
          }
        })
      },
      initNav() {
        if(this.width > 768) {
          this.isShowNavIcon = false
          // this.$store.commit('SET_IS_PC', true)
        } else {
          this.isShowNavIcon = true
          // this.$store.commit('SET_IS_PC', false)
        }
      },
      handdleNav() {
        if(this.arrClass.includes('slide')) {
          this.arrClass.splice(1, 1)
        } else {
          this.arrClass.splice(1, 1, 'slide')
        }
      },
      selectNav(name) {
        this.$router.push(name)
        this.arrClass.splice(1, 1)
      },
      noneNav() {
        this.arrClass.splice(1, 1)
      },
      goWelcome() {
        this.$router.push('/welcome')
      },
      routingChange(to) {
        this.activeName = to.path
        this.openNames = to.path.split('/')
        this.openNames.shift()
        this.$nextTick(() => {
          this.$refs['menu'].updateActiveName()
          this.$refs['menu'].updateOpened()
          this.getRatio()
        })
      }
    }
  }
</script>
<style scoped>
.menuItemSty{
  display: block;
  padding: 14px 24px;
}
a.menuItemSty:hover{
  background: #adcd00;
  color: red
}
  .index {
    height: 100%;
  }
  .index .top {
    display: table;
    width: 100%;
    height: 64px;
    padding: 0 32px;
    background: #00496C;
  }

  .index .top * {
    display: table-cell;
    vertical-align: middle;
    color: #fff;
  }

  .index .top .title {
    font-size: 14px;
    text-align: center;
  }

  .index .top .user {
    width: 628px;
    display: table-cell;
    text-align: right;
  }

  .index .top .user * {
    display: inline-block;
  }

  .index .top .user .search {
    width: 160px;
    margin-right: 24px;
  }

  .index .top .user .date-time {
    height: 32px;
    line-height: 32px;
    border-radius: 32px;
    padding: 0 16px;
    margin-right: 24px;
  }

  .index .top .user .avatar {
    width: 56px;
    height: 56px;
    border-radius: 56px;
    margin-left: 24px;
  }

  .index .top .user .name {
    margin: 0 40px 0 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .index .top .user .logout {
    color: #ADCD00;
    transform: scaleX(-1);
  }

  .index .main {
    position: relative;
    height: calc(100% - 64px);
  }

  .index .main .absolute {
    position: absolute;
    left: -240px;
    z-index: 2;
  }

  .index .main .slide {
    left: 0;
  }

  .index .main .nav,
  .index .main .content {
    float: left;
  }

  .index .main .nav,
  .index .main .nav * {
    color: #ccc;
    background: #333;
  }

  .index .main .nav {
    max-width: 240px;
    width: 100%;
    height: 100%;
    border-right: 1px solid #DDD;
    overflow-x: hidden;
    overflow-y: auto;
    transition: left .6s;
    z-index: 6;
  }

  .index .main .content {
    position: relative;
    width: calc(100% - 240px);
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .index .main .content .padding {
    padding: 30px 30px 50px;
  }
  .index .main .content .paddingMob {
    padding: 0 10px 20px;
    height: 100%;
    overflow-y: scroll;
  }

  .index .main .content .footer {
    display: table;
    width: 100%;
    height: 130px;
  }

  .index .main .content .bottom {
    position: absolute;
    bottom: 0;
  }

  @media (max-width: 1024px) {
    .index .top .title {
      display: none;
    }
    .index .top .user {
      width: auto;
    }
  }

  @media (max-width: 768px) {
    .index .top {
      padding: 0 12px;
    }
    .index .main .content {
      width: 100%;
    }
  }
</style>
<style>
  .index .search .ivu-input-icon {
    left: 0 !important;
    color: #fff !important;
  }

  .index .search .ivu-input-icon-normal+.ivu-input {
    padding-left: 32px !important;
    border-radius: 32px !important;
    border-color: #506988 !important;
    color: #fff !important;
    background: #506988 !important;
  }

  .index .search .ivu-input-icon-normal+.ivu-input::-webkit-input-placeholder {
    color: #fff !important;
  }

  .index .search .ivu-input-icon-normal+.ivu-input::-moz-placeholder {
    color: #fff !important;
  }

  .index .search .ivu-input-icon-normal+.ivu-input:-moz-placeholder {
    color: #fff !important;
  }

  .index .search .ivu-input-icon-normal+.ivu-input:-ms-input-placeholder {
    color: #fff !important;
  }

  .index .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
    color: #ADCD00;
    border-color: #ADCD00 !important;
    background: transparent
  }

  .index .ivu-menu-submenu-title:hover,
  .index .ivu-menu-item:hover {
    color: #fff !important;
    background: #ADCD00 !important;
  }
</style>
