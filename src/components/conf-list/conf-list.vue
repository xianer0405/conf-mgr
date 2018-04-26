<template>
  <scroll class="listview" :data="confs" :refreshDelay="refreshDelay">
    <ul class="conf-list" v-show="confs && confs.length">
      <li class="item"
          :class="{active: currentIndex === index}"
          :key="index"
          v-for="(item, index) in confs"
          @click="selectItem(index)">
        <span :title="item.confName" class="text">{{item.confName}}</span>
        <i class="icon icon-enter"></i>
      </li>
    </ul>
    <ul class="conf-list" v-show="confs && !confs.length">
      <li class="item">当前无转播记录</li>
    </ul>
    <div v-show="!confs" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'

  export default {
    props: {
      confs: {
        type: Array,
        default: null
      },
      currentIndex: {
        type: Number,
        default: -1
      }
    },
    data() {
      return {
        refreshDelay: 1000
      }
    },
    methods: {
      selectItem(index) {
        this.$emit('select', index)
      }
    },
    components: {
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"
  @import "~common/stylus/mixin"

  .listview
    position: relative
    background: #fff
    .conf-list
      padding: 10px 20px 10px 20px
      background: #fff
      .item
        padding-left: 10px
        margin: 10px 0
        line-height: 36px
        background: #F3F5FD
        no-wrap()
        &:hover, &.active
          background: #1AE47D
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
  .bscroll-vertical-scrollbar
    top: 15px !important
    bottom: 15px !important
</style>