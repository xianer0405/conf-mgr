<template>
  <div class="confer">
    <m-header></m-header>
    <div class="contanier">
      <router-view></router-view>
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
      padding: 0 100px
      padding-bottom: 120px
</style>
