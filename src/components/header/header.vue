<template>
  <header class="header">
    <div class="logo left">
      <img v-if="!mainLogo && ready" :src="defaultLogoPath" alt="KARL STORZ - CONF">
      <img v-if="mainLogo" style="width: 117; height: 40px" :src="imagePathConvert(mainLogo.configAttachment)" alt="mainLogo.configValue">
    </div>
    <div class="right">
      <ul class="menu">
        <router-link tag="li" to="/config" class="item">
          <i class="icon icon-shezhi"></i>
          <span class="text">系统设置</span>
        </router-link>
        <li class="item user">
          <ul class="user-oper">
            <li class="item" @click.stop="openModifyPasswordModal">修改密码</li>
            <li class="item" @click.stop="openLogoutModal">退出</li>
          </ul>
          <i class="icon icon-people"></i>
          <span class="text">{{loginUser && loginUser.loginId}}</span>
        </li>
      </ul>
    </div>
    <modal ref="modifyPasswordModal"
           :title="modifyPasswordTitle"
           :autoHide="false"
           :modalType="4"
           @confirm="submitModifyPassword">
      <div class="modifypass-form">
        <div class="form-item">
          <label class="form-lbl">当前密码:</label>
          <input type='password' class='password' v-model="currentPassword">
          <span class="form-required-mask">*</span>
        </div>
        <div class="form-item">
          <label class="form-lbl">新密码:</label>
          <input type='password' class='new-password' v-model="newPassword">
          <span class="form-required-mask">*</span>
        </div>
        <div class="form-item">
          <label class="form-lbl">确认密码:</label>
          <input type='password' class='confirm-password' v-model="confirmPassword">
          <span class="form-required-mask">*</span>
        </div>
      </div>
    </modal>
    <modal @confirm="logout" :modalType="3" :autoHide="false" ref="logoutModal">
      <p>确认退出吗?</p>
    </modal>
    <modal ref="tipModal"></modal>
  </header>
</template>

<script type="text/ecmascript-6">
  import Modal from 'base/modal/modal'
  import {loadMainLogo} from 'api/sysconfig'
  import {logout} from 'api/login'
  import {getLoginUser, modifyPassword} from 'api/sysuser'
  import {getQueryString, pathConvert} from 'common/js/util'
  import { env } from 'common/js/config'

  const isProd = env === 'prod'

  const loginUrl = env === 'prod' ? '../index.html' : '../../'
  export default {
    data() {
      return {
        modifyPasswordTitle: '修改密码',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        ready: false,
        mainLogo: null,
        loginUser: {},
        defaultLogoPath: '../../common/image/logoWhite.png'
      }
    },
    methods: {
      imagePathConvert(imagePath) {
        return pathConvert(isProd, imagePath)
      },
      submitModifyPassword() {
        if (!this.checkModifyPassForm()) {
          return false
        }
        const param = {
          sysUserId: this.loginUser.id,
          newPass: this.newPassword,
          oldPass: this.currentPassword
        }
        modifyPassword(param).then((res) => {
          if (res.success) {
            this.$refs.tipModal.show('修改密码成功')
          } else {
            this.$refs.tipModal.show(res.msg || '修改密码失败')
          }
        }).finally(() => {
          this.$refs.modifyPasswordModal.hide()
        })
      },
      checkModifyPassForm() {
        if (!this.currentPassword) {
          this.$refs.tipModal.show('当前密码不能为空!')
          return false
        }
        if (!this.newPassword) {
          this.$refs.tipModal.show('新密码不能为空!')
          return false
        }
        if (this.newPassword.length < 6 || this.newPassword.length > 16) {
          this.$refs.tipModal.show('密码长度为6-16个字符!')
          return false
        }
        if (this.confirmPassword !== this.newPassword) {
          this.$refs.tipModal.show('确认密码与新密码不一致!')
          return false
        }
        return true
      },
      openModifyPasswordModal() {
        this.$refs.modifyPasswordModal.show()
      },
      openLogoutModal() {
        this.$refs.logoutModal.show()
      },
      logout() {
        let userId = 0
        if (this.loginUser) {
          userId = this.loginUser.id
        }
        logout({userId}).then((res) => {
          console.log(res)
        }).finally(() => {
          window.location.href = loginUrl
        })
      },
      _loadMainLogo() {
        loadMainLogo().then((res) => {
          if (res.success) {
            var mainLogo = res.bizData.entity
            if (mainLogo && mainLogo.configAttachment) {
              this.mainLogo = mainLogo
            }
          }
          setTimeout(() => {
            this.ready = true
          }, 300)
        })
      },
      _loadUserInfo() {
        const id = getQueryString('id')
        getLoginUser({userId: id}).then((res) => {
          if (res.success) {
            this.loginUser = res.bizData.sysUser
          } else {
            this.$refs.tipModal.show('用户未登录或Session过期，将自动跳转到登录界面')
            setTimeout(() => {
              window.location.href = loginUrl
            }, 2000)
          }
        }).catch((err) => {
          this.$refs.tipModal.error('用户未登录或Session过期，将自动跳转到登录界面')
          console.log('getLoginUser error' + err)
          setTimeout(() => {
            window.location.href = loginUrl
          }, 2000)
        })
      }
    },
    mounted () {
      this._loadUserInfo()
      this._loadMainLogo()
    },
    components: {
      Modal
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"

  .modifypass-form
    width: 400px
    font-size: 14px
    text-align: left
    .form-item
      line-height: 40px
      .form-lbl
        display: inline-block
        margin-right: 15px
        width: 120px
        text-align: right
      .form-required-mask
        position: absolute
        margin-left: 5px
        color: red
      input
        width: 160px
        height: 24px
        padding-left: 5px
        padding-right: 20px
        border: 1px solid #eaeef3
        border-radius: 3px
        background-color: #f3f5fd
        outline: none
        -webkit-transition: border-color ease-in-out 0.15s
        transition: border-color ease-in-out 0.15s
        &:focus
          border-color: #c6c6c6
  .header
    min-width: 600px
    height: 60px
    line-height: 60px
    padding: 0 100px
    background: $color-highlight-background
    .left
      float: left
      .logo-txt
        // content: url('./logoWhite.png')
        // height: 60px
        font-size: $font-size-large-xxx
        line-height: 60px
        // vertical-align: middle
        font-weight: 900
      img
        height: 40px
        vertical-align: middle
    .right
      float: right
      .menu
        list-style-type: none
        .item
          display: inline-block
          height: 60px
          line-height: 60px
          padding: 0 10px
          cursor: pointer
          color: $color-text-l
          .text
            font-size: $font-size-medium
            vertical-align: middle
          &.user
            position: relative
            z-index: 2
            .user-oper
              position: absolute
              top: -500px
              right: 0
              height: 50px
              line-height: 50px
              width: 165px
              background: $color-normal-background
              font-size: $font-size-medium
              color: #969696
              box-shadow: 0 3px 5px rgba(0, 0, 0, .25)
              border: 1px solid #f5f5f5
              border-top: none
              .item
                height: 50px
                line-height: 50px
                width: 60px
                color: #969696
                text-align: center
          &.user:hover
            .user-oper
              top: 60px
              border-top: 2px solid $color-border-d
              font-size: $font-size-medium
              .item:hover
                background: #F6F7FD
                color: #3c78e6
          .icon
            font-size: $font-size-large-x
            vertical-align: middle
            padding: 2px
            margin-right: 5px
          .text, .icon
            transition: all 0.3s ease
          &.router-link-active, &:hover
            color: $color-text
            .icon
              background: $color-normal-background
              color:$color-text-highlight
              border-radius: 100%
</style>
