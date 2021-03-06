<template>
  <div class="scroll" ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'

  export default {
    props: {
      /**
       * 1 滚动的时候会派发scroll事件，会截流。
       * 2 滚动的时候实时派发scroll事件，不会截流。
       * 3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
       */
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      scrollX: {
        type: Boolean,
        default: false
      },
      listenScroll: {
        type: Boolean,
        default: false
      },
      data: {
        type: Array,
        default: null
      },
      beforeScroll: {
        type: Boolean,
        default: false
      },
      refreshDelay: {
        type: Number,
        default: 20
      },
      bounce: {
        type: Boolean,
        default: true
      },
      preventDefault: {
        type: Boolean,
        default: true
      },
      scrollbar: {
        type: Object,
        default: function() {
          return {
            fade: true,
            interactive: true
          }
        }
      },
      pullUpLoad: {
        type: null,
        default: false
      },
      pullDownRefresh: {
        type: null,
        default: false
      }
    },
    data() {
      return {
        isPullUpLoad: false,
        pullUpDirty: true,
        beforePullDown: true,
        isPullingDown: false
      }
    },
    created() {
      this.pullDownInitTop = -30
    },
    watch: {
      data() {
        setTimeout(() => {
          this.forceUpdate(true)
        }, this.refreshDelay)
      },
      preventDefault() {
        console.log(`this.preventDefault=${this.preventDefault}`)
        this._initScroll()
        this.refresh()
      }
    },
    mounted() {
      setTimeout(() => {
        this._initScroll()
      }, 20)
    },
    methods: {
      forceUpdate(dirty) {
        if (this.pullUpLoad && this.isPullUpLoad) {
          this.isPullUpLoad = false
          this.scroll.finishPullUp()
          this.pullUpDirty = dirty
          this.refresh()
        } if (this.pullDownRefresh && this.isPullingDown) {
          this.isPullingDown = false
          this.scroll.finishPullDown()
          this.refresh()
        } else {
          this.refresh()
        }
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      },
      disable() {
        this.scroll && this.scroll.disable()
      },
      enable() {
        this.scroll && this.scroll.enable()
      },
      _initPullUpLoad() {
        this.scroll.on('pullingUp', () => {
          this.isPullUpLoad = true
          this.$emit('pullingUp')
        })
      },
      _initPullDownRefresh() {
        this.scroll.on('pullingDown', () => {
          this.beforePullDown = false
          this.isPullingDown = true
          this.$emit('pullingDown')
        })
      },
      _initScroll() {
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click,
          bounce: this.bounce,
          scrollbar: this.scrollbar,
          mouseWheel: {
            speed: 10
          },
          preventDefault: this.preventDefault,
          pullUpLoad: this.pullUpLoad,
          pullDownRefresh: this.pullDownRefresh
        })
        // 是否派发滚动事件
        if (this.listenScroll) {
          this.scroll.on('scroll', (pos) => {
            this.$emit('scroll', pos)
          })
        }

        // 是否派发列表滚动开始的事件
        if (this.beforeScroll) {
          this.scroll.on('beforeScrollStart', () => {
            this.$emit('beforeScroll')
          })
        }

        if (this.pullUpLoad) {
          this._initPullUpLoad()
        }

        if (this.pullDownRefresh) {
          this._initPullDownRefresh()
        }
      }
    },
    components: {
      BScroll
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .scroll
    position: relative
    padding-right: 20px
    height: 100%
    overflow: hidden
    background: #fff
    cursor: pointer
</style>
