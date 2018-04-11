<template>
  <div class="test">
    <h1>test.vue</h1>
    <router-view></router-view>
  </div>
</template>

<script>
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
      forbiddenBrowserBack() {
        history.pushState(null, null, document.URL)
        window.addEventListener('popstate', function () {
          history.pushState(null, null, document.URL)
        })
      }
    },
    mounted() {
    }
  }
</script>

<style lang="stylus" scoped>
</style>
