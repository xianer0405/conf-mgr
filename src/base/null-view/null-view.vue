<template>
  <div class="null-view">
      <h1 class="title">
          {{title}}
      </h1>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        title: '该功能暂时不可用'
      }
    },
    mounted () {
      console.log('mounted' + this.$route.params)
      this._initTitle()
    },
    methods: {
      _initTitle() {
        console.log('_initTitle' + this.$route.params)
        if (this.$route.params.isThird === 'true') {
          this.title = '该功能由第三方系统提供'
        } else {
          this.title = '该功能暂时不可用'
        }
      },
      _initListener() {
        const that = this
        this.$bus.$on('disabled-route-change', function(arg) {
          that._initTitle()
        })
      }
    },
    created () {
      this._initListener()
    }
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
