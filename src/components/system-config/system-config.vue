<template>
  <div class="system-config">
    <header class="header">
      <ul class="menu">
        <router-link key="1" to='/config/area' tag='li' class="menu-item">
          <span class="menu-text">Logo设置</span>
        </router-link>
        <router-link key="2" to='/config/sysuser'  tag='li' class="menu-item">
          <span class="menu-text">用户设置</span>
        </router-link>
        <router-link key="3" to='/config/device' tag='li' class="menu-item">
          <span class="menu-text">设备设置</span>
        </router-link>
      </ul>
    </header>
    <div class="config-wrapper">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"
  .system-config
    padding-top: 17px
    font-size: 16px
    color: #949599
    .header
      height: 40px
      line-height: 40px
      .menu
        .menu-item
          display: inline-block
          cursor: pointer
          &:hover
            color: #3c78e6
          .menu-text
            display: inline-block
            line-height: 16px
            padding: 0 22px
            border-right: 1px solid #e2e9ed
          &:first-child > .menu-text
            padding-left: 0
          &:last-child > .menu-text
            padding-right: 0
            border-right: 0
          &.router-link-active
            color: #3c78e6
</style>
