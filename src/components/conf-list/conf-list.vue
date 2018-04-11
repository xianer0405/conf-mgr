<template>
  <scroll class="wrapper" :data="confs" :refreshDelay="refreshDelay">
    <ul class="conf-list" v-show="confs.length">
      <li class="item"
          :class="{active: currIndex === index}"
          :key="index"
          v-for="(item, index) in confs"
          @click="selectItem(item, index)">
        <span class="text">{{item.name}}</span>
        <i class="icon icon-enter"></i>
      </li>
      <li class="item" v-show="!confs.length">当前无转播记录</li>
    </ul>
    <ul class="conf-list" v-show="!confs.length">
      <li class="item">当前无转播记录</li>
    </ul>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'

  export default {
    props: {
      confs: {
        type: Array,
        default: function() {
          return []
        }
      }
    },
    data() {
      return {
        currIndex: -1,
        refreshDelay: 1000
      }
    },
    methods: {
      selectItem(item, index) {
        this.currIndex = index
        this.$emit('select', item)
      }
    },
    components: {
      Scroll
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"

  .wrapper
    position: relative
    height: 100%
    overflow: hidden
    background: #fff
    cursor: pointer
    .conf-list
      padding: 10px 30px 10px 20px
      background: #fff
      .item
        padding-left: 10px
        margin: 10px 0
        line-height: 36px
        background: #F3F5FD
        &:hover, &.active
          background: #1AE47D
</style>