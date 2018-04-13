<template>
  <div class="one-to-one">
    <div class="conf-list">
      <h1 class='title'>一对一转播列表({{totalCount}})</h1>
      <conf-list :currentIndex="currIndex" :confs="confList" @select="selectChange"></conf-list>
    </div>
    <div class="conf-detail">
      <h1 class='title'>转播-{{currConf ? currConf.confName : '未选择'}}</h1>
      <div class="members" v-show="currConf && !confReady">
        <div class="loading-container">
          <loading title="正在加载会议状态..."></loading>
        </div>
      </div>
      <div class="members" v-show="currConf && confReady">
        <div class="member-wrapper" v-if="confReady">
          <image-view :kid="confMemberIds[0]" @iconClick="memberOper" :showIcons="showIcons" :imageUrl="confMembers[confMemberIds[0]].attachment.fileUrl"></image-view>
        </div>
        <div class="member-wrapper" v-if="confReady">
          <image-view :kid="confMemberIds[1]" @iconClick="memberOper" :showIcons="showIcons" :imageUrl="confMembers[confMemberIds[1]].attachment.fileUrl"></image-view>
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
  import Loading from 'base/loading/loading'
  import ConfList from 'components/conf-list/conf-list'
  import ImageView from 'base/image-view/image-view'
  import {loadConfs} from 'api/conf'
  import {loadDevices} from 'api/device'

  export default {
    data() {
      return {
        currConf: null,
        currIndex: -1,
        confReady: false,
        confList: null,
        confMembers: null,
        confMemberIds: [],
        totalCount: 0,
        showIcons: ['icon-mic', 'icon-volume-o'],
        defaultImageUrl: require('../../common/image/1.jpg')
      }
    },
    computed: {
    },
    methods: {
      memberOper(param) {
        this.$refs.modal.info(JSON.stringify(param))
        /* const confId = this.currConf.confId
        const deviceId = param.kid
        const type = param.iconType === this.showIcons[0] ? 1 : 2 */
      },
      initConfState() {
        this.confReady = false
        this.currConf = this.confList[this.currIndex]
        console.log(this.currConf)
        this.confMemberIds = this.currConf.members.split(',')
        const deviceIds = this.currConf.members
        this._loadConfMembers(deviceIds)
      },
      endConf() {
        this.$refs.modal.info('操作成功!')
      },
      selectChange(index) {
        this.currIndex = index
        console.log(this.currIndex)
      },
      _loadConfMembers(deviceIds) {
        loadDevices({deviceIds}).then((res) => {
          if (res.success) {
            this.confMembers = res.bizData.map
            this.confReady = true
            console.log(this.confMembers)
          }
        })
      },
      _loadConfList() {
        const param = {confType: 1, skip: 0, limit: 10}
        loadConfs(param).then((res) => {
          if (res.success) {
            console.log(res)
            this.confList = res.bizData.page.list
            this.totalCount = res.bizData.page.total
          }
        })
      }
    },
    watch: {
      currIndex() {
        if (this.currIndex >= 0) {
          this.initConfState()
        } else {
          this.currConf = null
        }
      }
    },
    created() {
      setTimeout(() => {
        this._loadConfList()
      }, 1000)
    },
    components: {
      ConfList,
      ImageView,
      Modal,
      Loading
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
      no-wrap()
    .conf-list
      float: left
      height: 80%
      width: 350px
      margin-right: 100px
      clear-fix()
    .conf-detail
      position: relative
      overflow:hidden
      height: 80%
      padding-bottom: 60px
      .members
        overflow: auto
        height: 100%
        padding: 20px 30px
        min-height: 330px
        background: #fff
        text-align: center
        .conf-oper
          @extends $conf-oper
          margin-top: 60px
        .member-wrapper
          display: inline-block
          width: 300px
          height: 160px
          &:first-child
            margin-right: 30px
        .tip
          margin-top: 20%
          font-size: 20px
          color: #ccc
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
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
