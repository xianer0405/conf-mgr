<template>
  <div class="image-view" ref="imageView" draggable="false">
    <div class="img-wrapper" ref="imgWrapper">
      <img :src='imageUrl' alt="">
      <span v-show="title" class="title">&nbsp;{{title}}</span>
    </div>
    <div class="icons-wrapper" v-show="showIcons.length">
      <i class="icon"
         :class="item"
         v-for="(item, index) in showIcons"
         :key="index"
         @click="iconClick(item, index)"></i>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">

  export default {
    props: {
      title: {
        type: String,
        default: ''
      },
      kid: {
        type: [Number],
        default: 0
      },
      imageUrl: {
        type: String,
        default: require('../../common/image/2.jpg')
      },
      showIcons: {
        type: Array,
        default: function() {
          return ['icon-volume-o']
        }
      }
    },
    methods: {
      iconClick(icon, index) {
        const param = {iconIdx: index, iconType: icon, kid: this.kid}
        console.log(param)
        this.$emit('iconClick', param)
      },
      updateShowIcons(newShowIcons) {
        this.showIcons = newShowIcons.slice()
      },
      _initImage() {
        // const imageObj = require(this.imageUrl)
        // console.log(imageObj)
        // console.log(this.imageUrl)
      }
    },
    mounted () {
      this._initImage()
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"
  @import "~common/stylus/mixin.styl"

  .image-view
    position: relative
    display: inline-block
    width: 100%
    height: 100%;
    margin-bottom: 30px
    background: #F3F5FD
    .img-wrapper
      width: 100%
      height: 100%
      img
        width: 100%
        height: 100%
        max-height: 219px
      .title
        position: absolute
        top: 0
        left: 0
        width: 100%
        line-height: 20px
        color: #e8e8e8
        text-align: left
        background: rgba(0, 0, 0, 0.2)
        no-wrap()
    .icons-wrapper
      position: absolute
      width: 100%
      line-height: 24px
      text-align: left
      background: #F3F5FD
      &:hover
        cursor: pointer
        background: #f3f5fd - 5%
      .icon
        padding: 0 5px
        font-size: 16px
        vertical-align: -2px
        &:hover
          color: #3c78e6
</style>
