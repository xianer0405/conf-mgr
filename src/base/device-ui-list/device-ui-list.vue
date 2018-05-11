<template>
  <scroll class="listview"
          ref="listView"
          :data="devices"
          :pullUpLoad="true"
          :pullDownRefresh="true"
          :refreshDelay="refreshDelay"
          @pullingUp="pullingUp"
          @pullingDown="pullingDown">
    <ul class="device-list" v-show="devices && devices.length">
      <li class="item"
          ref="device"
          :class="{active: currentIndex === index}"
          :key="index"
          v-for="(item, index) in devices"
          @click="selectItem(index)">
        <span :title="item.deviceName" class="text">{{item.deviceName}}</span>
        <i class="icon icon-enter"></i>
      </li>
    </ul>
    <ul class="device-list" v-show="devices && !devices.length">
      <li class="item">当前无设备记录</li>
    </ul>
    <div v-show="!devices" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'

  export default {
    props: {
      devices: {
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
        refreshDelay: 1000,
        pullingUpCount: 0,
        pullingDownCount: 0
      }
    },
    methods: {
      selectItem(index) {
        this.$emit('select', index)
      },
      pullingUp() {
        console.log('pullingUp')
        this.pullingUpCount++
        console.log(this.pullingUpCount)
        this.$emit('pullUpLoad')
      },
      pullingDown() {
        console.log('pullingDown')
        this.pullingDownCount++
        console.log(this.pullingDownCount)
        this.$emit('pullingDown')
      },
      scrollToElement(index) {
        this.$refs.listView.scrollToElement(this.$refs.device[index])
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
    .device-list
      padding: 10px 20px 10px 20px
      background: #fff
      .item
        padding-left: 10px
        margin: 10px 0
        line-height: 36px
        background: #F3F5FD
        transition: background .2s
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