<template>
  <div class="one-to-one">
    <div class="conf-list">
      <h1 class='title'>一对一转播列表</h1>
      <conf-list :currentIndex="currIndex" :confs="confList" @select="selectChange"></conf-list>
    </div>
    <div class="conf-detail">
      <h1 class='title'>转播-{{currConf ? currConf.name : '未选择'}}</h1>
      <div class="members" v-show="currConf">
        <div class="member-wrapper">
          <image-view :showIcons="showIcons" :imageUrl="currConf.imageUrl1"></image-view>
        </div>
        <div class="member-wrapper">
          <image-view :showIcons="showIcons" :imageUrl="currConf.imageUrl2"></image-view>
        </div>
        <div class="conf-oper" @click.stop="endConf">
          <i class="icon icon-finish"></i>
          <h1 class="text">结束转播</h1>
        </div>
      </div>
      <div class="members" v-show="!currConf">
        <h1 class="tip">请选择要操作的转播</h1>
      </div>
    </div>
    <modal ref="modal"></modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import Modal from 'base/modal/modal'
  import ConfList from 'components/conf-list/conf-list'
  import ImageView from 'base/image-view/image-view'
  import {searchDevice} from 'api/device'
  const DEFAULT_CURRINDEX = 0
  export default {
    data() {
      return {
        currConf: null,
        currIndex: -1,
        confList: [],
        showIcons: ['icon-mic', 'icon-volume-o']
      }
    },
    methods: {
      endConf() {
        this.$refs.modal.info('操作成功!')
      },
      selectChange(index) {
        this.currIndex = index
        console.log(this.currIndex)
      },
      _loadConfList() {
        searchDevice({name: '设备'}).then((res) => {
          if (res.success) {
            this.confList = res.bizData.list
            if (this.confList.length) {
              this.selectChange(DEFAULT_CURRINDEX)
            }
          }
        })
      }
    },
    watch: {
      currIndex() {
        this.currConf = this.confList[this.currIndex]
        /* mock code */
        if (this.currIndex % 2 === 0) {
          this.currConf.imageUrl1 = require('../../common/image/1.jpg')
          this.currConf.imageUrl2 = require('../../common/image/2.jpg')
        } else {
          this.currConf.imageUrl1 = require('../../common/image/kobe.jpg')
          this.currConf.imageUrl2 = require('../../common/image/kobe.gif')
        }
      }
    },
    created() {
      this._loadConfList()
    },
    components: {
      ConfList,
      ImageView,
      Modal
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"
  @import "~common/stylus/common.styl"

  .one-to-one
    margin: 10px 0
    width: 100%
    height: 100%
    color: #333
    font-size: $font-size-medium
    .title
      line-height: 60px
      font-size: $font-size-medium-x
      font-weight: bolder
      vertical-align: middle
    .conf-list
      float: left
      height: 80%
      width: 350px
      margin-right: 100px
      clear-fix()
    .conf-detail
      height: 80%
      padding-bottom: 60px
      overflow:hidden
      .members
        overflow: auto
        height: 100%
        padding: 20px 30px
        min-height: 330px
        background: #fff
        text-align: center
        .conf-oper
          @extends $conf-oper
        .member-wrapper
          display: inline-block
          width: 300px
          &:first-child
            margin-right: 30px
        .tip
          margin-top: 20%
          font-size: 20px
          color: #ccc
  @media screen and (max-width: 1314px)
    .one-to-one
      .conf-detail
        .members
          text-align: left
          .member-wrapper
            display: inline-block
            width: 300px
            &:first-child
              margin-right: 0
          .conf-oper
            position: absolute
            display block
            margin-top: -20px
            margin-left: 100px
  @media screen and (min-width: 1920px)
    .one-to-one
      .conf-detail
        .members
          .member-wrapper
            width: 420px
            &:first-child
              margin-right: 100px
          .conf-oper
            margin-top: 100px
  /* @media screen and (min-width: 1367px) and (max-width: 1480px)
    $minHeight = 550px
    $contentHeight = $minHeight - 60
    .one-to-one
      min-height: $minHeight
      .conf-list, .conf-detail
        height: $contentHeight
      .conf-detail
        .members
          .member-wrapper
            width: 300px
            &:first-child
              margin-right: 30px
  @media screen and (min-width: 1481px) and (max-width: 1919px)
    $minHeight = 550px
    $contentHeight = $minHeight - 60
    .one-to-one
      min-height: $minHeight
      .conf-list, .conf-detail
        height: $contentHeight
      .conf-detail
        .members
          .member-wrapper
            width: 360px
            &:first-child
              margin-right: 40px */
</style>
