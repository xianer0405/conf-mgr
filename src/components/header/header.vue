<template>
  <header class="header">
    <div class="logo left">
      <img src="../../common/image/logoWhite.png" alt="KARL STORZ - CONF">
      <!-- <h1 class="logo-txt">KAEL STORZ - CONF</h1> -->
    </div>
    <div class="right">
      <ul class="menu">
        <router-link tag="li" to="/config" class="item">
          <i class="icon icon-shezhi"></i>
          <span class="text">系统设置</span>
        </router-link>
        <li class="item user">
          <i class="icon icon-people"></i>
          <span class="text">admin</span>
          <ul class="user-oper">
            <li class="item">修改密码</li>
            <li class="item">退出</li>
          </ul>
        </li>
      </ul>
    </div>
  </header>
</template>

<script type="text/ecmascript-6">
  export default {
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"

  .header
    min-width: 600px
    height: 60px
    line-height: 60px
    padding: 0 100px
    background: $color-highlight-background
    color: $color-text
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
            .user-oper
              position: absolute;
              top: -500px;
              right: 0
              width: 150px
              background: $color-normal-background
              font-size: $font-size-medium
              color: #969696
              box-shadow: 0 3px 5px rgba(0,0,0,.25);
              border: 1px solid #f5f5f5;
              border-top: none;
          &.user:hover
              .user-oper
                top: 60px;
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
