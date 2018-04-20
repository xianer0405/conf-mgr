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
            <image-view @iconClick="memberOper" ref="sourceImageView"  :kid="soureMember.id" :showIcons="showIcons" :imageUrl="soureMember.attachment ? soureMember.attachment.fileUrl : defaultImageUrl"></image-view>
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
                  <image-view ref="imageView" :kid="item.id" @iconClick="memberOper" :showIcons="showIconsOfWatchers[index]" :imageUrl="item.attachment ? item.attachment.fileUrl :defaultImageUrl"></image-view>
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
    <modal ref="modal"></modal>
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
  import {loadDevices} from 'api/device'
  import {IMAGE_ICONS} from 'common/js/config'

  const CONF_TYPE = 2

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
        showIcons: ['icon-mic'],
        showIconsTmpl: ['icon-volume-o', 'icon-delete'],
        showIconsOfWatchers: [],
        defaultImageUrl: require('../../common/image/1.jpg'),
        memberOperFlag: false
      }
    },
    computed: {
      /* 根据当前成员计算出转播方成员 */
      soureMember() {
        if (this.confMembers) {
          console.log(JSON.stringify(this.confMembers[this.confMemberIds[0]]))
          return this.confMembers[this.confMemberIds[0]]
        } else {
          return null
        }
      },
      /* 根据当前成员计算出观看方成员 */
      watcherMembers() {
        if (this.confMembers) {
          console.log('========confMembers===========')
          console.log(JSON.stringify(this.confMembers))
          console.log('========confMemberIds===========')
          console.log(JSON.stringify(this.confMemberIds))
          const watcherIds = this.confMemberIds.slice(1)
          console.log('========watcherIds===========')
          console.log(JSON.stringify(watcherIds))
          let watchers = []
          for (let i of watcherIds) {
            watchers.push(this.confMembers[i])
          }
          console.log('========watchers===========')
          console.log(JSON.stringify(watchers))
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
            this.$refs.modal.info('操作成功!')
            this._loadConfList()
            this._resetCurrConf()
          } else {
            this.$refs.modal.info('失败成功!')
          }
        })
      },
      memberOper(operParam) {
        if (this.memberOperFlag) {
          return false
        }
        this.memberOperFlag = true
        const confId = this.currConf.confId
        const confType = this.currConf.confType
        const deviceId = operParam.kid
        const type = operParam.iconType === IMAGE_ICONS.VOL_IN || operParam.iconType === IMAGE_ICONS.VOL_IN_OFF ? 1 : 2 // 表示输入或输出
        const mute = operParam.iconType === IMAGE_ICONS.VOL_IN || operParam.iconType === IMAGE_ICONS.VOL_OUT // 是否静音
        if (operParam.iconType === IMAGE_ICONS.DELETE_MEMEBER) {
          const confReq = {confId, deviceIds: deviceId, confType}
          this.deleteMemberReq = confReq
          this.$refs.deleteMemberModal.show()
        } else {
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
          console.log('volumeMute finally ')
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
              newShowIcons = that.showIconsTmpl.slice()
              newShowIcons[operParam.iconIdx] = newIcon
              const watcherIds = that.confMemberIds.slice(1)
              const imageViewIndex = watcherIds.indexOf(volumeReq.deviceId)
              console.log(this.showIconsOfWatchers)
              // console.log('=======================')
              this.$set(this.showIconsOfWatchers, imageViewIndex, newShowIcons)
              // console.log(this.showIconsOfWatchers)
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
      _refreshCurrConf(newCurrConf) {
        this.currConf = newCurrConf
        const deviceIds = this.currConf.members
        this._loadConfMembers(deviceIds)
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
        this.confMembers = null
        this.confMemberIds = []
      },
      _initShowIcons() {
        // showIconsOfWatchers
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
            this.confMembers = res.bizData.map
            this.confMemberIds = deviceIds.split(',').map((item) => {
              return parseInt(item)
            })
            this.confReady = true
            console.log(this.confMembers)
          }
        })
      },
      _loadConfList() {
        const param = {confType: CONF_TYPE, skip: 0, limit: 20}
        loadConfs(param).then((res) => {
          if (res.success) {
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
      this._loadConfList()
      if (this.timer) {
        clearTimeout(this.timer)
      } else {
        this.timer = setTimeout(() => {
          this._loadConfList()
        }, 5000)
      }
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
                background: #f3f5fd + 50%
                &:hover
                  background: #f3f5fd
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
