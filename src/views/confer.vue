<template>
  <div class="confer">
    <m-header></m-header>
    <div class="contanier">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
    <m-footer @routerChange="routerChange" :confCounts="confCounts"></m-footer>
    <modal @messageClick="modalClick" ref="modal" :autoHide="false"></modal>
  </div>
</template>

<script>
  import MHeader from 'components/header/header'
  import MFooter from 'components/footer/footer'
  import Splitter from 'base/splitter/splitter'
  import Modal from 'base/modal/modal'
  import {queryConfCount} from 'api/conf'
  import {getQueryString} from 'common/js/util'

  const QUERY_INTERVAL = 10000

  export default {
    data() {
      return {
        path: '当前位置：',
        confCounts: []
      }
    },
    created() {
      this.forbiddenBrowserBack()
      this._initConfListener()
    },
    methods: {
      routerChange(route) {
        if (route.disabled) {
          this.autoLink(route)
          setTimeout(() => {
            this.$router.back()
          }, 4000)
          this.$bus.$emit('disabled-route-change', route)
        } else {
          this.$bus.$emit('conf-refresh', route)
        }
      },
      modalClick(event) {
        console.log(event)
        if (event.target.className === 'link-third') {
          this.clearIntervalAndTimer()
          this.$refs.modal.hide()
          this.$router.back()
        }
      },
      autoLink(route) {
        if (route.linkUrl) {
          let second = 3
          let message = `${second--}秒后将自动跳转到<a class="link-third" style="color: #3c78e6" href="${route.linkUrl}" target="_blank">${route.linkTitle}</a>`
          this.$refs.modal.show(message)
          this.interval = setInterval(() => {
            message = `${second--}秒后将自动跳转到<a class="link-third" style="color: #3c78e6" href="${route.linkUrl}" target="_blank">${route.linkTitle}</a>`
            this.$refs.modal.show(message)
          }, 1000)
          this.timer1 = setTimeout(() => {
            if (this.interval) {
              clearInterval(this.interval)
            }
          }, 2000)
          this.timer2 = setTimeout(() => {
            window.open(route.linkUrl)
            this.$refs.modal.hide()
          }, 3000)
        } else {
          this.$refs.modal.show('功能暂时不可用')
        }
      },
      clearIntervalAndTimer() {
        console.log('clearIntervalAndTimer')
        if (this.interval) {
          clearInterval(this.interval)
        }
        if (this.timer1) {
          clearTimeout(this.timer1)
        }
        if (this.timer2) {
          clearTimeout(this.timer2)
        }
      },
      destroyed () {
        this.clearIntervalAndTimer()
      },
      forbiddenBrowserBack() {
        history.pushState(null, null, document.URL)
        window.addEventListener('popstate', function () {
          history.pushState(null, null, document.URL)
        })
      },
      queryConfCount() {
        if (this.confCountTimer) {
          clearTimeout(this.confCountTimer)
        }
        this._queryConfCount()
      },
      _queryConfCount() {
        const creatorId = getQueryString('id')
        queryConfCount({creatorId}).then((res) => {
          if (res.success) {
            this.confCounts = res.bizData.list
          }
          this.confCountTimer = setTimeout(() => {
            this._queryConfCount()
          }, QUERY_INTERVAL)
        }).catch((err) => {
          console.log(err)
          this.confCountTimer = setTimeout(() => {
            this._queryConfCount()
          }, QUERY_INTERVAL)
        })
      },
      _initConfListener() {
        const that = this
        this.$bus.$on('conf-change', function(arg) {
          console.log('footer.vue conf-change' + arg)
          that.queryConfCount()
        })

        // this.$bus.$emit('confcount-refresh', this.confType)
        this.$bus.$on('confcount-refresh', function(arg) {
          console.log('confer.vue confcount-refresh' + arg)
          that.queryConfCount()
        })
      }
    },
    mounted() {
      this.queryConfCount()
    },
    components: {
      MHeader,
      MFooter,
      Splitter,
      Modal
    }
  }
</script>

<style lang="stylus" scoped>
  @import '~common/stylus/variable'

  .confer
    height: 100%
    margin: 0
    background: $color-base-background
    .contanier
      position: absolute
      top: 60px
      bottom: 115px
      left: $global-gap
      right: $global-gap
      @media screen and (min-width: 1367px) and (max-width: 1480px)
        left: $global-gap
        right: $global-gap
      @media screen and (min-width: 1481px) and (max-width: 1919px)
        left: $global-gap-x
        right: $global-gap-x
      @media screen and (min-width: 1920px)
        left: $global-gap-xx
        right: $global-gap-xx
</style>
