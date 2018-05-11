<template>
  <div class="one-to-many">
    <div class="conf-list">
      <h1 class='title'>一对多转播列表({{confList && confList.length}})</h1>
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
        <div class="shower-wrapper members-wrapper" v-if="soureMember">
          <div class="member-wrapper">
            <image-view @iconClick="memberOper"
                        ref="sourceImageView"
                        :title="soureMember.deviceName"
                        :kid="soureMember.id"
                        :showIcons="showIcons"
                        :imageUrl="soureMember.attachment ? soureMember.attachment.fileUrl : defaultImageUrl"></image-view>
          </div>
          <div class="conf-oper" @click.stop="openEndConfModal">
            <i class="icon icon-finish"></i>
            <h1 class="text">结束转播</h1>
          </div>
        </div>
        <div class="watchers-wrapper members-wrapper">
          <scroll class="scroll-wrapper" :data="watcherMembers" v-if="watcherMembers.length">
            <ul class="watchers">
              <li class="watcher" :key="index" v-for="(item, index) in watcherMembers">
                <div class="member-wrapper">
                  <image-view ref="imageView"
                              :title="item.deviceName"
                              :kid="item.id" @iconClick="memberOper"
                              :showIcons="showIconsOfWatchers[index]"
                              :imageUrl="item.attachment ? item.attachment.fileUrl :defaultImageUrl"></image-view>
                </div>
              </li>
            </ul>
          </scroll>
          <div class="add-btn-wrapper" @click.stop="openAddModal">
            <i class="icon icon-add"></i>
          </div>
        </div>
      </div>
      <div class="members" v-show="!currConf">
        <h1 class="tip">请选择要操作的转播</h1>
      </div>
    </div>
    <add-member @add-confirm="addMembers" ref="addMemberModal"></add-member>
    <modal ref="tipModal"></modal>
    <modal @confirm="deleteMember" @cancel="cancelDelete" :modalType="3" :autoHide="false" ref="deleteMemberModal">
      <p>确认删除该成员吗?</p>
    </modal>
    <modal @confirm="endConf" :modalType="3" :autoHide="false" ref="endConfModal">
      <p>确认结束当前转播吗?</p>
    </modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Modal from 'base/modal/modal'
  import Loading from 'base/loading/loading'
  import ConfList from 'components/conf-list/conf-list'
  import ImageView from 'base/image-view/image-view'
  import AddMember from 'components/add-member/add-member'
  import {loadConfs, volumeMute, endConf, deleteMember, addMembers} from 'api/conf'
  import {loadDevices, loadDevicesVolumeState} from 'api/device'
  import {IMAGE_ICONS} from 'common/js/config'
  import {getQueryString} from 'common/js/util'

  const CONF_TYPE = 2

  export default {
    data() {
      return {
        currConf: null,
        currIndex: -1,
        confReady: false,
        memberStateReady: false,
        confList: null,
        confMembers: null,
        confMemberIds: [],
        totalCount: 0,
        showIcons: ['icon-mic'],
        showIconsTmpl: ['icon-mic', 'icon-volume-o', 'icon-delete'],
        showIconsOfWatchers: [],
        defaultImageUrl: require('../../common/image/1.jpg'),
        memberOperFlag: false
      }
    },
    computed: {
      /* 根据当前成员计算出转播方成员 */
      soureMember() {
        if (this.confMembers && this.confMembers.length) {
          return this.confMembers[0]
        } else {
          return null
        }
      },
      /* 根据当前成员计算出观看方成员 */
      watcherMembers() {
        if (this.confMembers && this.confMembers.length) {
          let watchers = this.confMembers.slice(1)
          return watchers
        } else {
          return []
        }
      }
    },
    methods: {
      addMembers(selectedMembers) {
        if (this.memberOperFlag) {
          return false
        }
        this.memberOperFlag = true
        const confId = this.currConf.confId
        const confType = this.currConf.confType
        const deviceIds = selectedMembers.map((item) => {
          return item.id
        }).join(',')
        console.log(deviceIds)
        const confReq = {confId, deviceIds, confType}
        const that = this
        addMembers(confReq).then((res) => {
          if (res.success) {
            // 重新获取成员
            const updatedConf = res.bizData.entity
            that.confList[this.currIndex] = updatedConf
            that._refreshCurrConf(this.confList[this.currIndex])
            that.$refs.modal.info('操作成功!')
          } else {
            that.$refs.modal.info('操作失败!')
          }
        }).finally(() => {
          console.log('volumeMute finally ')
          that.memberOperFlag = false
        })
      },
      openEndConfModal() {
        this.$refs.endConfModal.show()
      },
      endConf() {
        const {confId, confType} = this.currConf
        endConf({confId, confType}).then((res) => {
          if (res.success) {
            this.$refs.tipModal.info('操作成功!')
            this._loadConfList()
            this._resetCurrConf()
            this.$bus.$emit('conf-change', confId)
          } else {
            this.$refs.tipModal.info('失败成功!')
          }
        })
      },
      memberOper(operParam) {
        if (!this.memberStateReady) {
          this.$refs.tipModal.error('正在加载转播状态!')
          return false
        }
        if (this.memberOperFlag) {
          this.$refs.tipModal.error('上一个操作未完成，请稍候再试!')
          return false
        }
        this.memberOperFlag = true
        const confId = this.currConf.confId
        const confType = this.currConf.confType
        const deviceId = operParam.kid
        if (operParam.iconType === IMAGE_ICONS.DELETE_MEMEBER) {
          const confReq = {confId, deviceIds: deviceId, confType}
          this.deleteMemberReq = confReq
          this.$refs.deleteMemberModal.show()
        } else {
          const type = operParam.iconType === IMAGE_ICONS.VOL_IN || operParam.iconType === IMAGE_ICONS.VOL_IN_OFF ? 1 : 2 // 表示输入或输出
          const mute = operParam.iconType === IMAGE_ICONS.VOL_IN || operParam.iconType === IMAGE_ICONS.VOL_OUT // 是否静音
          const volumeReq = {confId, deviceId, type, mute}
          this.volumeOper(volumeReq, operParam)
        }
      },
      openAddModal() {
        this.$refs.addMemberModal.show()
      },
      initConfState() {
        this.confReady = false
        this.confMembers = null
        this._refreshCurrConf(this.confList[this.currIndex])
        this._initShowIcons()
      },
      selectChange(index) {
        this.currIndex = index
      },
      cancelDelete() {
        this.memberOperFlag = false
      },
      deleteMember() {
        const that = this
        const confReq = this.deleteMemberReq
        deleteMember(confReq).then((res) => {
          if (res.success) {
            // 重新获取成员
            const updatedConf = res.bizData.entity
            that.confList[this.currIndex] = updatedConf
            this._refreshCurrConf(this.confList[this.currIndex])
            that.$refs.modal.info('操作成功!')
          } else {
            that.$refs.modal.info('操作失败!')
          }
        }).finally(() => {
          that.memberOperFlag = false
        })
      },
      volumeOper(volumeReq, operParam) {
        const that = this
        volumeMute(volumeReq).then((res) => {
          if (res.success) {
            const newIcon = this._reverseIcon(operParam)
            let newShowIcons
            if (volumeReq.deviceId === that.confMemberIds[0]) {
              this.$set(this.showIcons, operParam.iconIdx, newIcon)
            } else {
              const watcherIds = that.confMemberIds.slice(1)
              const imageViewIndex = watcherIds.indexOf(volumeReq.deviceId)
              if (this.showIconsOfWatchers.length) {
                newShowIcons = this.showIconsOfWatchers[imageViewIndex].slice()
              } else {
                newShowIcons = that.showIconsTmpl.slice()
              }
              newShowIcons[operParam.iconIdx] = newIcon
              console.log(this.showIconsOfWatchers)
              this.$set(this.showIconsOfWatchers, imageViewIndex, newShowIcons)
              console.log(this.showIconsOfWatchers)
            }
            this.$refs.tipModal.info('操作成功!')
          } else {
            this.$refs.tipModal.error('操作失败!')
          }
        }).finally(() => {
          console.log('volumeMute finally ')
          this.memberOperFlag = false
        })
      },
      _refreshCurrConf(newCurrConf) {
        this.currConf = newCurrConf
        const deviceIds = this.currConf.members
        this._loadConfMembers(deviceIds)
        this._loadVolumeState(deviceIds)
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
        this.memberStateReady = false
        this.currConf = null
        this.confMembers = null
        this.confMemberIds = []
      },
      _initShowIcons() {
        let members = this.currConf.members
        const memberIds = members.split(',')
        if (memberIds) {
          const watcherIds = memberIds.slice(1).map((item) => {
            return parseInt(item)
          })
          console.log(watcherIds)
          for (let i = 0; i < watcherIds.length; i++) {
            this.showIconsOfWatchers[i] = [...this.showIconsTmpl]
          }
          console.log(`this.showIconsOfWatchers=${JSON.stringify(this.showIconsOfWatchers)}`)
        }
      },
      _loadConfMembers(deviceIds) {
        loadDevices({deviceIds}).then((res) => {
          if (res.success) {
            this.confMembers = res.bizData.list
            this.confMemberIds = deviceIds.split(',').map((item) => {
              return parseInt(item)
            })
            this.confReady = true
            console.log(this.confMembers)
          }
        })
      },
      _loadVolumeState(deviceIds) {
        this.memberStateReady = false
        loadDevicesVolumeState({deviceIds}).then((res) => {
          const that = this
          if (res.success) {
            let states = res.bizData.list
            const sourceState = states[0]
            if (sourceState) {
              let newIcon = IMAGE_ICONS.VOL_IN
              if (sourceState.silence) {
                newIcon = IMAGE_ICONS.VOL_IN_OFF
              }
              that.$set(that.showIcons, 0, newIcon)
            }
            const statesOfWatchers = states.slice(1)
            statesOfWatchers.forEach((state, index) => {
              if (state) {
                const newShowIcons = that.showIconsTmpl.slice()
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
                that.$set(that.showIconsOfWatchers, index, newShowIcons)
              }
            })
          }
          that.memberStateReady = true
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
      this._loadConfList()
      this._initConfListener()
    },
    components: {
      ConfList,
      ImageView,
      Modal,
      Scroll,
      Loading,
      AddMember
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"
  @import "~common/stylus/common.styl"

  .one-to-many
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
    .conf-list
      float: left
      height: 80%
      width: 350px
      margin-right: 100px
      clear-fix()
    .conf-detail
      height: 80%
      padding-bottom: 50px
      overflow:hidden
      .members
        position: relative
        overflow: auto
        height: 100%
        padding: 20px 20px
        min-height: 330px
        background: #fff
        .tip
          margin-top: 20%
          text-align: center;
          font-size: 20px
          color: #ccc
        .members-wrapper
          display: inline-block
          height: 100%
          width: 49%
          vertical-align: top
          .scroll-wrapper
            display: inline-block
            vertical-align: middle;
          &.shower-wrapper
            text-align: center
            .member-wrapper
              display: inline-block
              width: 300px
              min-height: 219px
            .conf-oper
              @extends $conf-oper
          &.watchers-wrapper
            text-align: left
            .watchers
              display: inline-block
              margin-left: 50px
              margin-bottom: 30px
              .watcher
                margin-bottom: 10px
              .member-wrapper
                display: inline-block
                width: 140px
                height: 90px
                margin-bottom: 30px
                background: #f3f5fd
            .add-btn-wrapper
              @extends $conf-oper
              margin-left: 40px
              .icon
                color: #9CA5B0
                background: #f3f5fd
                &:hover
                  background: #dee3f9
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
  @media screen and (min-width: 1367px)  and (max-width: 1440px)
    .one-to-many
      .conf-detail > .members > .members-wrapper.shower-wrapper
        .member-wrapper
          width: 360px
      .conf-detail .members .members-wrapper.watchers-wrapper .watchers
          .member-wrapper
            width: 200px
            height: 100px
            margin-bottom: 30px
  @media screen and (min-width: 1441px)  and (max-width: 1679px)
    .one-to-many
      .conf-detail .members .members-wrapper.shower-wrapper
        .member-wrapper
          width: 400px
      .conf-detail .members .members-wrapper.watchers-wrapper .watchers
          .member-wrapper
            width: 220px
            height: 120px
            margin-bottom: 40px
  @media screen and (min-width: 1680px)  and (max-width: 1920px)
    .one-to-many
      .conf-detail .members .members-wrapper.shower-wrapper
        .member-wrapper
          width: 450px
      .conf-detail .members .members-wrapper.watchers-wrapper .watchers
          .member-wrapper
            width: 260px
            height: 160px
            margin-bottom: 45px
          /* .conf-oper
            margin-top: 100px */
</style>
