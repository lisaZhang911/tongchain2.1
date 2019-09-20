<template>
  <div class="buttons">
    <Button class="btn btn-confirm" type="primary" @click="confirm" :disabled="disabled">{{ btnText }}</Button>
    <Button class="btn btn-back" v-show="btnBack" @click="back">返回上一步</Button>
  </div>
</template>

<script>
  export default {
    props: {
      btnText: {
        type: String,
        default: ''
      },
      btnBack: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      confirm() {
        this.$emit('confirm')
      },
      back() {
        this.$router.back()
      }
    }
  }
</script>

<style scoped>
  .buttons {
    float: right;
    margin-top: -1px;
  }

  .buttons .btn {
    width: 175px;
    color: #fff;
    border-radius: 0;
    border-bottom-left-radius: 25px;
    border-bottom-right-radius: 25px;
  }

  .buttons .btn-confirm {
    border-color: #E84D79;
    background: #E84D79;
  }

  .buttons .btn-back {
    border-color: #04B2CA;
    background: #04B2CA;
    margin-left: 30px;
  }

  @media (max-width: 768px) {
    .buttons {
      float: none;
      width: 100%;
      padding-top: 12px;
      text-align: center;
    }
    .buttons .btn {
      font-size: 14px;
      width: 100%;
      border-radius: 32px;
    }
    .buttons .btn-back {
      margin: 12px 0 0 0;
    }
  }
</style>
