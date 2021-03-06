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
          <image-view :title="confMembers[0].deviceName"
                      :kid="confMemberIds[0]"
                      @iconClick="memberOper"
                      :showIcons="showIconsArray[0]"
                      :imageUrl="confMembers[0].attachment ? imagePathConvert(confMembers[0].attachment.fileUrl) : defaultImageUrl"></image-view>
        </div>
        <div class="member-wrapper" v-if="confReady">
          <image-view :title="confMembers[1].deviceName"
                      :kid="confMemberIds[1]"
                      @iconClick="memberOper"
                      :showIcons="showIconsArray[1]"
                      :imageUrl="confMembers[1].attachment ? imagePathConvert(confMembers[1].attachment.fileUrl) : defaultImageUrl"></image-view>
        </div>
        <div class="conf-oper" @click.stop="openEndConfModal">
          <i class="icon icon-finish"></i>
          <h1 class="text">结束转播</h1>
        </div>
      </div>
      <div class="members" v-show="!currConf">
        <h1 class="tip">请选择要操作的转播</h1>
      </div>
    </div>
    <modal @confirm="endConf" :modalType="3" :autoHide="false" ref="endConfModal">
      <p>确认结束当前转播吗?</p>
    </modal>
    <modal ref="modal"></modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import Modal from 'base/modal/modal'
  import Loading from 'base/loading/loading'
  import ConfList from 'components/conf-list/conf-list'
  import ImageView from 'base/image-view/image-view'
  import {loadConfs, endConf, volumeMute, switchMatrixToLocal, recordConfig} from 'api/conf'
  import {loadDevices, loadDevicesVolumeState} from 'api/device'
  import {IMAGE_ICONS, env} from 'common/js/config'
  import {getQueryString, pathConvert} from 'common/js/util'

  const isProd = env === 'prod'

  const CONF_TYPE = 1

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
        showIconsArray: [],
        defaultImageUrl: require('../../common/image/1.jpg'),
        memberOperFlag: false
      }
    },
    computed: {
    },
    methods: {
      imagePathConvert(imagePath) {
        return pathConvert(isProd, imagePath)
      },
      openEndConfModal() {
        this.$refs.endConfModal.show()
      },
      endConf() {
        const deviceIds = this.confMemberIds.slice().join(',')
        const {confId, confType} = this.currConf
        endConf({confId, confType}).then((res) => {
          if (res.success) {
            this.$refs.modal.info('操作成功!')
            this._loadConfList()
            this._resetCurrConf()
            this._switcchMatrixToLocal(deviceIds)
            this._recordConfifg(deviceIds)
            this.$bus.$emit('conf-change', confId)
          } else {
            this.$refs.modal.info('失败成功!')
          }
        })
      },
      _recordConfifg(deviceIds) {
        recordConfig({deviceIds, cmd: 0}).then((res) => {
          console.log(res)
        }).catch((err) => {
          console.log(err)
        })
      },
      _switcchMatrixToLocal(deviceIds) {
        console.log('切换本地矩阵输出本地源')
        switchMatrixToLocal({deviceIds}).then((res) => {
          console.log(res)
        }).catch((err) => {
          console.log(err)
        })
      },
      memberOper(param) {
        if (this.memberOperFlag) {
          return false
        }
        this.memberOperFlag = true
        const confId = this.currConf.confId
        const deviceId = param.kid
        const type = param.iconType === IMAGE_ICONS.VOL_IN || param.iconType === IMAGE_ICONS.VOL_IN_OFF ? 1 : 2 // 表示输入或输出
        const mute = param.iconType === IMAGE_ICONS.VOL_IN || param.iconType === IMAGE_ICONS.VOL_OUT // 是否静音
        const volumeReq = {confId, deviceId, type, mute}
        volumeMute(volumeReq).then((res) => {
          if (res.success) {
            let newIcon = this._reverseIcon(param)
            const newShowIcons = this.showIcons.slice()
            newShowIcons[param.iconIdx] = newIcon
            // 数组数据修改的模式
            if (volumeReq.deviceId === this.confMemberIds[0]) {
              this.$set(this.showIconsArray, 0, newShowIcons)
            } else {
              this.$set(this.showIconsArray, 1, newShowIcons)
            }
            this.$refs.modal.info('操作成功!')
          } else {
            this.$refs.modal.error('操作失败!')
          }
        }).finally(() => {
          console.log('volumeMute finally ')
          this.memberOperFlag = false
        })
      },
      initConfState() {
        this.confReady = false
        this.currConf = this.confList[this.currIndex]
        console.log(this.currConf)
        this.confMemberIds = this.currConf.members.split(',').map((val) => {
          return parseInt(val)
        })
        const deviceIds = this.currConf.members
        this._initShowIcons()
        this._loadConfMembers(deviceIds)
        this._loadVolumeState(deviceIds)
      },
      selectChange(index) {
        this.currIndex = index
        console.log(this.currIndex)
      },
      _reverseIcon(iconParam) {
        let newIcon = ''
        if (iconParam.iconType === IMAGE_ICONS.VOL_IN) {
          newIcon = IMAGE_ICONS.VOL_IN_OFF
        }
        if (iconParam.iconType === IMAGE_ICONS.VOL_IN_OFF) {
          newIcon = IMAGE_ICONS.VOL_IN
        }
        if (iconParam.iconType === IMAGE_ICONS.VOL_OUT) {
          newIcon = IMAGE_ICONS.VOL_OUT_OFF
        }
        if (iconParam.iconType === IMAGE_ICONS.VOL_OUT_OFF) {
          newIcon = IMAGE_ICONS.VOL_OUT
        }
        return newIcon
      },
      _resetCurrConf() {
        this.currIndex = -1
        this.confReady = false
        this.currConf = null
      },
      _initShowIcons() {
        this.showIconsArray[0] = [...this.showIcons]
        this.showIconsArray[1] = [...this.showIcons]
      },
      _loadConfMembers(deviceIds) {
        loadDevices({deviceIds}).then((res) => {
          if (res.success) {
            this.confMembers = res.bizData.list
            this.confReady = true
            console.log(this.confMembers)
          }
        })
      },
      _loadVolumeState(deviceIds) {
        loadDevicesVolumeState({deviceIds}).then((res) => {
          console.log(res)
          const that = this
          if (res.success) {
            let states = res.bizData.list
            states.forEach(function(state, index) {
              if (state) {
                const newShowIcons = that.showIcons.slice()
                if (state.mute) {
                  newShowIcons[1] = IMAGE_ICONS.VOL_OUT_OFF
                } else {
                  newShowIcons[1] = IMAGE_ICONS.VOL_OUT
                }
                if (state.silence) {
                  newShowIcons[0] = IMAGE_ICONS.VOL_IN_OFF
                } else {
                  newShowIcons[0] = IMAGE_ICONS.VOL_IN
                }
                that.$set(that.showIconsArray, index, newShowIcons)
              }
            })
          }
        })
      },
      _loadConfList() {
        const creatorId = getQueryString('id')
        const param = {creatorId, confType: CONF_TYPE, skip: 0, limit: 20}
        loadConfs(param).then((res) => {
          if (res.success) {
            let currConfId = null
            if (this.currIndex !== -1) {
              currConfId = this.confList[this.currIndex].confId
            }
            let list = res.bizData.page.list
            if (currConfId && list && list.length) {
              const fIndex = list.findIndex((item) => {
                return item.confId === currConfId
              })
              this.currIndex = fIndex
              if (this.currIndex === -1) {
                this._resetCurrConf()
              }
            }
            this.confList = list ? list : []
            this.totalCount = res.bizData.page.total
          }
        })
      },
      _initConfListener() {
        const that = this
        this.$bus.$on('conf-refresh', function(arg) {
          console.log(arg)
          if (arg && arg.confType === CONF_TYPE) {
            that._loadConfList()
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
      this._initConfListener()
    },
    activated () {
      /* setTimeout(() => {
        this._loadConfList()
      }, 1000) */
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
      line-height: 50px
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
      padding-bottom: 50px
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
