<template>
  <div class="image-view" ref="imageView">
    <div class="img-wrapper" ref="imgWrapper">
      <img src="../../common/image/1.jpg" alt="">
    </div>
    <div class="icons-wrapper">
      <i class="icon icon-people"></i>
      <i class="icon icon-shezhi"></i>
      <i class="icon icon-xiaoxi"></i>
      <i class="icon icon-record"></i>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      width: {
        type: Number,
        default: 300
      },
      height: {
        type: Number,
        default: 200
      },
      imageUrl: {
        type: String,
        default: '../../common/image/1.jpg'
      }
    },
    methods: {
      _init() {
        // const wrapperWidth = this.$refs.imgWrapper.clientWidth
        // this.$refs.imgWrapper.firstChild.style.width = wrapperWidth + 'px'
      }
    },
    mounted () {
      this._init()
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"

  .image-view
    position: relative
    display: inline-block
    width: 100%
    margin-bottom: 30px
    background: #F3F5FD
    .img-wrapper
      width: 100%
      img
        width: 100%
    .icons-wrapper
      position: absolute
      width: 100%
      line-height: 24px
      text-align: left
      font-size: 16px
      background: #F3F5FD
      cursor: pointer
      .icon
        padding: 0 5px
        &:hover
          color: #3c78e6
</style>
