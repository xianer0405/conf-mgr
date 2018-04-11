<template>
  <div class="confer">
    <m-header></m-header>
    <div class="contanier">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
    <m-footer @routerChange="routerChange"></m-footer>
    <modal ref="modal">
      操作成功!操作成功!操作成功!操作成功!操作成功!操作成功!
    </modal>
  </div>
</template>

<script>
  import MHeader from 'components/header/header'
  import MFooter from 'components/footer/footer'
  import Splitter from 'base/splitter/splitter'
  import Modal from 'base/modal/modal'

  export default {
    data() {
      return {
        path: '当前位置：'
      }
    },
    created() {
      this.forbiddenBrowserBack()
    },
    methods: {
      routerChange(route) {
        console.log('confer.vue routerChange')
        if (route.disabled) {
          this.$refs.modal.show()
        }
      },
      forbiddenBrowserBack() {
        history.pushState(null, null, document.URL)
        window.addEventListener('popstate', function () {
          history.pushState(null, null, document.URL)
        })
      }
    },
    mounted() {
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
