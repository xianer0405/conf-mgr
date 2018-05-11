<template>
  <transition name="in">
    <div class="modal" v-if="showFlag" @click.stop="hideByClickShadow">
      <div class="modal-container" @click.stop>
        <div class="header" v-if="modalType !== 1 && showHeader">
          <h1 class="title">{{title}}</h1>
          <div class="icon-wrapper" @click.stop="hide">
            <i class="icon icon-close" v-if="modalType !== 1"></i>
          </div>
        </div>
        <div class="content-wrapper" v-if="modalType === 1">
          <i class="icon" :class="iconCls" v-if="showIcon"></i>
          <div class="content tip">
            <slot>
              <div @click.stop="messageClick($event)" v-html="message"></div>
            </slot>
          </div>
        </div>
        <div class="content-wrapper" v-if="modalType !== 1">
          <div class="content">
            <slot>提示消息</slot>
          </div>
        </div>
        <div class="bottom" v-if="modalType !== 1 && showBottom">
          <span class="btn cancel" v-if="modalType === 3 || modalType === 4" @click.stop="cancel">取&nbsp;&nbsp;消</span>
          <span class="btn submit" @click.stop="confirm">确&nbsp;&nbsp;认</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      showIcon: {
        type: Boolean,
        default: true
      },
      showHeader: {
        type: Boolean,
        default: true
      },
      showBottom: {
        type: Boolean,
        default: true
      },
      title: {
        type: String,
        default: '提示'
      },
      modalType: {
        type: Number,
        default: 1 /* 1:提示类， 2：确认类 3：确认取消类 4：Form表单类型 */
      },
      autoHide: {
        type: Boolean,
        default: true
      },
      autoHideTime: {
        type: Number,
        default: 1500 /* 单位： 毫秒 */
      }
      /* ,
      position: {
        type: Number,
        default: 1 1: center(屏幕中心) 2: top(顶部中间) 3: bottom(底部中间)
      } */
    },
    data() {
      return {
        showFlag: false,
        message: '',
        messageType: 1 // 1 :info 2:warninng 3:error
      }
    },
    computed: {
      iconCls() {
        return this.messageType === 1 ? 'icon-info' : this.messageType === 2 ? 'icon-warn' : 'icon-error'
      }
    },
    methods: {
      messageClick(event) {
        this.$emit('messageClick', event)
      },
      cancel() {
        this.$emit('cancel')
        this.showFlag = false
      },
      confirm() {
        this.$emit('confirm')
        if (this.modalType !== 4) {
          this.showFlag = false
        }
      },
      show(msg) {
        if (msg) {
          this.message = msg
        }
        this.showFlag = true
        if (this.timer) {
          clearTimeout(this.timer)
        }
        if (this.autoHide && this.modalType !== 3 && this.modalType !== 4) {
          this._autoHide()
        }
      },
      info(msg) {
        this.messageType = 1
        this.show(msg)
      },
      warn(msg) {
        this.messageType = 2
        this.show(msg)
      },
      error(msg) {
        this.messageType = 3
        this.show(msg)
      },
      hide() {
        this.$emit('cancel')
        this.showFlag = false
        this.messageType = 1
      },
      hideByClickShadow() {
        this.showFlag = false
      },
      _autoHide() {
        this.timer = setTimeout(() => {
          this.showFlag = false
        }, this.autoHideTime)
      },
      _initModal() {
      }
    },
    mounted () {
      setTimeout(() => {
        this._initModal()
      }, 17)
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"
  @import "~common/stylus/mixin.styl"

  .modal
    text-align: center
    position: fixed
    z-index: 3
    top: 0
    left: 0
    right: 0
    bottom: 0
    margin-top: -110px
    text-align: center
    font-size: 15px
    background-color: rgba(150,150,150, 0.4)
    &.in-enter-active, &.in-leave-active
      transition: all .3s ease
    &.in-enter, &.in-leave-to
      opacity: 0
    .modal-container
      position: absolute
      top: 50%
      left: 50%
      margin-top: -1px
      min-width: 260px
      min-height: 40px
      transform: translate3d(-50%, -50%, 0)
      background-color: #fff
      border-radius: 4px
      /* box-shadow: 2px 2px 3px #cecece */
      box-shadow: 3px 3px 15px rgba(0,0,0,.5);
      .header
        line-height: 40px
        overflow:hidden
        padding: 10px
        border-bottom: 1px solid #ddd
        .title
          float: left
        .icon-wrapper
          float: right
          line-height: 36px
          padding: 2px
          cursor:pointer
      .content-wrapper
        position: relative
        min-height:60px
        line-height: 60px
        padding: 10px 20px
        text-align: center
        /* .content
          margin-left: 18px */
        .tip
          display: inline-block;
          margin-left: 30px;
          vertical-align: middle;
          text-align: center
          text-ellipsis()
        .icon
          position: absolute
          top:50%
          font-size: 18px
          transform: translate3d(0, -50%, 0)
          color: #3c78e6
      .bottom
        line-height: 40px
        padding: 10px
        border-top: 1px solid #ddd
        .btn
          display: inline-block
          line-height: normal
          width: 40px
          line-height: 24px
          margin: 0 10px
          padding: 0 5px
          border-radius: 3px
          border:1px solid #ddd
          cursor: pointer
          &.submit
            color: #fff
            background-color:#3c78e6
            &:hover
              background-color: #286090
              border:1px solid #3c78e6
          &.cancel:hover
            background-color: #ddd
            border:1px solid #ccc
</style>
