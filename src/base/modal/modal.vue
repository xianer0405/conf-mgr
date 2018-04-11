<template>
  <transition name="in">
    <div class="modal" v-if="showFlag" @click.stop="hideByClickShadow">
      <div class="modal-container" @click.stop>
        <div class="header" v-if="modalType !== 1">
          <h1 class="title">{{title}}</h1>
          <div class="icon-wrapper" @click.stop="hide">
            <i class="icon icon-close" v-if="modalType !== 1"></i>
          </div>
        </div>
        <div class="content" v-if="modalType === 1">
          <i class="icon" :class="iconCls"></i>
          <div class="content-wrapper tip-wrapper">
            <slot>{{message}}</slot>
          </div>
        </div>
        <div class="content" v-if="modalType !== 1">
          <div class="content-wrapper">
            <slot>提示消息</slot>
          </div>
        </div>
        <div class="bottom" v-if="modalType !== 1">
          <span class="btn cancel" v-if="modalType === 3" @click.stop="hide">取&nbsp;&nbsp;消</span>
          <span class="btn submit" @click.stop="hide">确&nbsp;&nbsp;认</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: '提示'
      },
      modalType: {
        type: Number,
        default: 1 /* 1:提示类， 2：确认类 3：确认取消类 */
      },
      autoHide: {
        type: Boolean,
        default: true
      },
      autoHideTime: {
        type: Number,
        default: 2000 /* 单位： 毫秒 */
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
      show(msg) {
        if (msg) {
          this.message = msg
        }
        this.showFlag = true
        if (this.timer) {
          clearTimeout(this.timer)
        }
        if (this.autoHide && this.modalType !== 3) {
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
        this.messageType = 1
        this.showFlag = false
      },
      hideByClickShadow() {
        if (this.modalType === 1) {
          this.showFlag = false
        }
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
    font-size: $font-size-medium
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
    margin-top: -110px
    text-align: center
    font-size: $font-size-medium
    background-color: rgba(150,150,150, 0.1)
    &.in-enter-active, &.in-leave-active
      transition: all .3s ease
    &.in-enter, &.in-leave-to
      opacity: 0
    .modal-container
      position: absolute
      top: 50%
      left: 50%
      min-width: 100px
      min-height: 40px
      transform: translate3d(-50%, -50%, 0)
      background-color: #fff
      border-radius: 4px
      box-shadow: 2px 2px 3px #cecece
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
      .content
        position: relative
        min-height:60px
        line-height: 60px
        padding: 10px 20px
        text-align: center
        .content-wrapper
          margin-left: 18px
          &.tip-wrapper
            text-align: left
            text-ellipsis()
        .icon
          position: absolute
          font-size: 18px
          top:50%
          left: 10px
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
