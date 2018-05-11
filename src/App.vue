<template>
  <div class="login" @keydown.enter="login">
    <div class="login-container">
      <header class="logo">
        <!-- <img src="./common/image/logoWhite.png" height="71" width="209" alt="logo"> -->
        <img v-if="!loginLogo.configAttachment && ready" src="./common/image/logoWhite.png" height="71" width="209" alt="KARL STORZ - CONF">
        <img v-else :src="loginLogo.configAttachment" :alt="loginLogo.configValue" height="71" width="209">
      </header>
      <form class="login-form">
        <div class="form-item">
          <label for="username" class="form-lbl">用户名：</label>
          <input class="username" v-model="username"/>
        </div>
        <div class="form-item">
          <label for="password" class="form-lbl">密&nbsp;&nbsp;&nbsp;&nbsp;码：</label>
          <input class="password" type="password" v-model="password"/>
        </div>
        <div class="form-item msg-container" :class="{'error': msg}">
          <span class="title"><i class=""></i>{{msg}}</span>
          <span class="title">&nbsp;</span>
        </div>
        <div class="form-item">
          <button type="button" class="login-btn" @click="login">登录</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {login} from 'api/login'
  import {ERR_OK} from 'common/js/config'
  import {loadLoginLogo} from 'api/sysconfig'

  export default {
    name: 'App',
    data() {
      return {
        username: '',
        password: '',
        msg: '',
        loginLogo: {},
        ready: false
      }
    },
    methods: {
      login(e) {
        // 调用API，查询用户数据
        login(this.username, this.password).then((res) => {
          if (res.code !== ERR_OK) {
            this.msg = res.msg
            setTimeout(() => {
              this.msg = ''
            }, 3000)
          } else {
            const loginUser = res.bizData.sysUser
            window.location.href = './views/confer.html?id=' + loginUser.id
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      _loadLoginLogo() {
        loadLoginLogo().then((res) => {
          if (res.success) {
            var loginLogo = res.bizData.entity
            if (loginLogo && loginLogo.configAttachment) {
              this.loginLogo = loginLogo
            }
          }
          setTimeout(() => {
            this.ready = true
          }, 300)
        }).catch(() => {
          console.log('loadLoginLogo catch')
          this.ready = true
        })
      }
    },
    mounted () {
      this._loadLoginLogo()
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"

  .login
    position: relative;
    width: 100%;
    height: 100%;
    background: $color-background
    .login-container
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      width: 320px;
      height: 300px;
      text-align: center
      color: #fff;
      .login-form
        margin: 20px 0
        padding: 0 20px
        font-size: $font-size-medium
        .form-item
          display: inline-block
          height: 50px
          line-height: 50px
          width: 100%
          border-radius: 3px
          .form-lbl
            display: inline-block
            width: 60px
            height: 30px
            line-height: 30px
          .username, .password
            padding-left: 8px
            width: 200px
            height: 30px
            line-height: 30px
            outline: none
            border-radius: 10px
            box-sizing: border-box
            background: $color-background-l
            color: $color-text
          .login-btn
            width: 269px
            height: 30px
            border-radius: 10px
            border-style: none
            background: $color-background-l
            color: $color-text
            cursor: pointer
            outline: none
            &:hover
              background: $color-background-d
        .msg-container
          height: 30px
          line-height: 30px
          padding-left: 12px
          text-align: left
          .title
            color: rgba(255, 0, 0, 0.8)
            dislay: inline-block
            line-height: 30px
            line-height: 30px
          &.error > span
            dislay: none
</style>
