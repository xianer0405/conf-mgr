<template>
  <div class="null-view">
      <h1 class="title">
          暂不支持该功能
      </h1>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .null-view
    height: 100%
    width: 100%
    background: $color-base-background
    text-align: center
    .title
      position: absolute
      left: 50%
      top: 50%
      transform: translate3d(-50%, -50%, 0)
      margin-top: -60px
      font-size: $font-size-large-xxx
      color: $color-text-ll
</style>
