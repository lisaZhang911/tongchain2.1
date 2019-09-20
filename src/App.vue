<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <!-- <HelloWorld/> -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    //do something after mounting vue instance
  }
}
</script>

<style lang='less'>
  /* *:not(.ivu-select-dropdown) {
    box-shadow: initial !important;
  } */
  html,
  body {
    height: 100%;
  }
  ul,li {
    list-style: none
  }
  button {
    background: transparent;
    border: none;
    outline: none;
  }
  textarea {
    outline: none;
    padding: 5px;
    width:100%
  }
  input {
    outline: none;
    border: 0;
    appearance: none
  }
  .pointLabel {
    font-weight: bold;
    font-size: 13px
  }
  .delet_notice{
    font-weight: bold;
    font-size: 14px;
  }
  .form_input_wid300{
    width:300px
  }
  .mb24 {
    margin-bottom: 24px
  }
  .tablePos {
    margin-bottom: 40px;
  }
  .originalSelect{
    width:100%;
    background: transparent;
    border:1px solid #dcdee2;
    height: 32px;
    padding: 0 5px;
    border-radius: 20px;
    font-size: 12px
  }
  .mob_datePicker {
    .weui-cells{
      font-size: 15px;
    }
    .weui-cell {
      padding: 6px 15px
    }
  }
  .mob_table.ivu-table-wrapper{
    // margin-bottom: 50px;
  }
  .backIcon{
    float: left;
    color: #999;

    i {
      font-size: 30px;
    }
  }
  .required:before {
    content: "*";
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 12px;
    color: #ed3f14;
  }
  .mobForm {
    position: fixed;
    z-index: 6;
    width: 100%;
    height: 100%;
    background: #fff;
    top: 0px;
    left:0;
    overflow-y: scroll;

    .title {
      text-align: center;
      font-weight: normal;
      font-size: 15px;
    }
    .mobForm_item {
      font-size: 14px;
    }
    .mobForm_title {
      padding: 7px 0;

      button {
        float: right;
        position: absolute;
        right:15px;
        top:11px;
      }
    }
    .mobForm_item {
      background: #fff;
      padding: 15px 7px;
      border-bottom: 1px solid #ececec;

      span {
        margin-right: 13px;
      }
      input {
        font-size: 13px;
        border: 0;
        width:70%;
      }
    }
  }
  .denp_btn{
    width:100%;
    margin-top: 3%
  }
  .optionBlock{
    float: left;
    margin-left:0.5%;
  }
  .mob_addBtn {
    position: fixed;
    z-index: 5;
    left: 50%;
    margin-left: -20%;
    bottom: 10px;
    width: 40%;
    height: 30px;
    background: #2d8cf0;
    color: #fff;
    font-size: 15px;
    border-radius: 3px;
    border: none;
    outline: none;
  }
  .searchParam {
    .optionBlock {
      h3 {
        margin:20px 0;
        font-weight:normal;
      }
    }
  }
  .mob_searchParam{
    overflow: hidden;
    padding: 3%;

    .filterBox {
      padding: 10px;
      width:240px;
      min-height: 100%;
      background: #fff;
      position: absolute;
      top:0;
      right:-240px;
      z-index: 6;
      transition: right .6s;

      .itemBox {
        margin-bottom: 15px;

        h5 {
          font-size: 14px;
          font-weight: normal;
          margin-bottom: 5px;
          color: #333;
        }
        .label {
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          margin-left: 10px;
          margin-bottom: 10px;
          display: inline-block;
          width: 95px;
          padding: 0 10px;
          height: 28px;
          line-height: 28px;
          text-align: center;
          border: 1px solid #e3e3e3;
          border-radius: 30px;

          &.active{
            color:#04B2CA;
            border:1px solid #04B2CA;
          }
        }
      }
      .buttonWrap {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 240px;
        height: 40px;

        button {
          float:left;
          width:50%;
          height: 40px;
          border:none;
          border-radius: 0;
          font-size: 15px;
          outline: none;
        }
        button.reset{
            border-top:1px solid #efefef
        }
      }
    }
    .slide {
      right:0;
    }
    .mob_searchLink{
      float: left;
      width:85%;
      height:30px;
      border:1px solid #dfdfdf;
      border-radius: 4px;
      background: #fff;

      a {
        display: flex;
        justify-content:center;
        align-items:Center;
        height: 30px;
        color: #9c9c9c;

        i {
          font-size: 20px;
        }
      }
    }
    .setting {
      float:right;
      display: flex;
      justify-content:center;
      align-items:Center;
      width:30px;
      height:30px;
      border:none;
      background: transparent;
      font-size: 25px;
      color: #9c9c9c;
      outline: none;
    }
  }
  #app {
    height: 100%;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    color: #888;
  }

  .table-view {
    overflow: auto;
  }

  .header {
    height: 115px;
    margin-top: 20px;
  }

  .subheadings {
    margin-bottom: 15px;
  }

  .subheading {
    font-size: 14px;
    color: #00638C;
  }

  #btn1,
  #btn2,
  #btn3,
  #btn4 {
    min-width: 60px;
    height: 30px;
    margin-right: 5px;
  }

  #btn1 {
    color: #04B2CA;
    border-color: #04B2CA;
  }

  #btn2,#btn3 {
    color: #80848f;
    border-color: #80848f;
  }
  #btn4{
    color: red;
    border-color: red;
    font-weight: bold
  }
  .ivu-loading-bar {
    top: 64px !important;
  }

  .ivu-loading-bar-inner {
    background: #ABCD04 !important;
  }

  .ivu-table th {
    height: 60px !important;
    color: #00638C !important;
    background: #FFF !important;
  }

  .ivu-table td {
    height: 50px !important;
  }

  .ivu-table .row-odd td {
    background: #F6F6F6 !important;
  }

  .ivu-table .row-odd:hover td,
  .ivu-table .row-even:hover td {
    background: #E1FEFE !important;
  }

  .page {
    text-align: center;
    height: 60px;
    line-height: 60px;
    margin-bottom: 23px;
  }

  .page li {
    background: #EEEFF3;
  }

  .page .ivu-page {
    float: right !important;
  }

  .page .ivu-page .ivu-page-item-active {
    background: #04B2CA !important;
  }

  .ivu-input {
    // border-color: #bbbec4;
    border-radius: 32px;
  }

  .ivu-input-group-append {
    color: #00638C !important;
    background: #ADCD00 !important;
    border: none !important;
    border-bottom-right-radius: 32px !important;
    border-top-right-radius: 32px !important;
  }

  .ivu-form-item-error-tip {
    // top: 10% !important;
    // color: #ADCD00 !important;
  }

  .ivu-select-selection {
    border-radius: 30px !important;
  }

  .select,
  .ivu-select-dropdown,
  .ivu-select-item {
    /* width: auto !important; */
  }

  .ivu-select-item-selected,
  .ivu-select-item-selected:hover {
    background: #adcd00 !important;
  }

  .ivu-input:hover,
  .ivu-input:focus,
  .ivu-select-selection:hover,
  .ivu-select:focus .ivu-select-selection {
    border-color: #adcd00 !important;
  }

  .tip {
    color: #ADCD00;
  }
.modalForm.detailPage_item {
  margin-top: 40px;
  margin-left: 20px;

  label {
    display: inline-block;
    font-size: 13px;
    width: 100px;
    text-align: left;
  }
  input {
    width:300px;
  }
}
.modalForm {
  margin-bottom: 24px
}
.modalForm label {
  color: #515a6e;
  box-sizing: border-box;
  display: inline-block;
  padding-right: 5px;
}
.modalForm label:nth-of-type(2),
.modalForm div:nth-of-type(2n){
  // margin-left: 10px
}
.modalForm input {
  width:74%;
  border-radius: 15px;
  border: 1px solid #dcdee2;
  padding: 5px 10px;
  outline: none
}
.modalForm textarea,
.txtAreForm textarea {
  padding: 10px;
  font-size: 15px;
  letter-spacing: 1px;
}
/* 为啥要这个样式 */
.modelDetail input,
.modelDetail textarea {
  border-bottom: 1px solid #999
}
.txtAreForm {overflow: hidden}
.txtAreForm label{
  width: 66px;padding-right: 5px;
  text-align: right;
}
.txtAreForm label,
.txtAreForm textarea {
  float: left
}
.demo-upload-list{
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-left: 4px;
    margin-top: 14px;
}
.demo-upload-list img{
    width: 100%;
    height: 100%;
}
.demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
}
.demo-upload-list:hover .demo-upload-list-cover{
    display: block;
}
.demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
}
.custom /deep/ .ivu-input-wrapper,
.custom /deep/ .ivu-select{
  width:74%
}

  @media (max-width: 768px) {
    #app{
      font-size: 14px
    }
    #btn1,#btn2,#btn3{
      margin-right: 5px
    }
    .custom /deep/ .ivu-form-item-label{
      display: block;
      float: none;
    }
    .custom /deep/ .ivu-input-wrapper,
    .custom /deep/ .ivu-select{
      width:100%
    }
    .modalForm input{
      width:100%
    }
    .modalForm.detailPage_item input {
      width: 87%
    }
    .ivu-table .row-odd:hover td {
      background: #F6F6F6 !important;
    }
    .ivu-table .row-even:hover td {
      background: #FFF !important;
    }
    .mobile-padding {
      padding: 10px;
    }
    .table-view {
      overflow: hidden;
      margin-bottom: 20px;
    }
    .table-content {
      min-width: auto !important;
    }
    .ivu-form-item-error-tip {
      top: 100% !important;
    }
    .uploadBtn {
      padding-left: 6px;
      margin-top: 10px
    }
  }
</style>
