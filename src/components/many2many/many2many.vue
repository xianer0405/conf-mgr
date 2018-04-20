<template>
  <div class="many-to-many">
    <div class="conf-list">
      <h1 class='title'>多对多转播列表({{confList && confList.length}})</h1>
      <div class="members-wrapper" :key="index" v-show="currIndex === index" v-for="(item, index) in confList">
        <scroll class="scroll-wrapper" v-show="confMembers" :data="confMemberIds">
          <ul class="members" v-show="currConf && !confReady">
            <div class="loading-container">
              <loading title="正在加载会议状态..."></loading>
            </div>
          </ul>
          <ul class="members" v-show="currConf && confReady">
            <li class="member" :key="index" v-for="(item, index) in confMembers">
              <div class="member-wrapper" draggable="true">
                <image-view ref="imageView" :showIcons="showIconsOfMembers[index]" :imageUrl="item.attachment ? item.attachment.fileUrl :defaultImageUrl"></image-view>
              </div>
            </li>
          </ul>
        </scroll>
        <div class="add-btn-wrapper" @click.stop="openAddModal">
          <i class="icon icon-add"></i>
        </div>
      </div>
      <div class="conf-oper">
        <i class="icon icon-finish"></i>
        <h1 class="text">结束转播</h1>
      </div>
    </div>
    <div class="conf-vmp">
      <h1 class='title'>转播-画面合成控制</h1>
      <div class="vmp-container">
        <div class="layout-view-wrapper">
          <div class="layout-view layout-view-one" v-show="currentLayout === layout.ONE">
            <div class="layout-member layout-member-1">
              <div class="member-text">
                画面1
              </div>
            </div>
          </div>
          <div class="layout-view layout-view-two" v-show="currentLayout === layout.TWO">
            <div class="layout-member layout-member-1">
              <div class="member-text">
                画面1
              </div>
            </div>
            <div class="layout-member layout-member-2">
              <div class="member-text">
                画面2
              </div>
            </div>
          </div>
          <div class="layout-view layout-view-three" v-show="currentLayout === layout.THREE">
            <div class="layout-left">
              <div class="layout-member layout-member-1">
                <div class="member-text">
                  画面1
                </div>
              </div>
            </div>
            <div class="layout-right">
              <div class="layout-member layout-member-2">
                <div class="member-text">
                  画面2
                </div>
              </div>
              <div class="layout-member layout-member-3">
                <div class="member-text">
                  画面3
                </div>
              </div>
            </div>
          </div>
          <div class="layout-view layout-view-four" v-show="currentLayout === layout.FOUR">
            <div class="layout-left">
              <div class="layout-member layout-member-1">
                <div class="member-text">
                  画面1
                </div>
              </div>
              <div class="layout-member layout-member-3">
                <div class="member-text">
                  画面3
                </div>
              </div>
            </div>
            <div class="layout-left">
              <div class="layout-member layout-member-2">
                <div class="member-text">
                  画面2
                </div>
              </div>
              <div class="layout-member layout-member-4">
                <div class="member-text">
                  画面4
                </div>
              </div>
            </div>
          </div>
          <div class="layout-view layout-view-five" v-show="currentLayout === layout.FIVE">
            <div class="layout-left">
              <div class="layout-left-top">
                <div class="layout-member layout-member-1">
                  <div class="member-text">
                    画面1
                  </div>
                </div>
              </div>
              <div class="layout-left-bottom">
                <div class="layout-member layout-member-4">
                  <div class="member-text">
                    画面4
                  </div>
                </div>
                <div class="layout-member layout-member-5">
                  <div class="member-text">
                    画面5
                  </div>
                </div>
              </div>
            </div>
            <div class="layout-right">
              <div class="layout-member layout-member-2">
                <div class="member-text">
                  画面2
                </div>
              </div>
              <div class="layout-member layout-member-3">
                <div class="member-text">
                  画面3
                </div>
              </div>
              <div class="layout-member layout-member-6">
                <div class="member-text">
                  ---
                </div>
              </div>
            </div>
          </div>
          <div class="layout-view layout-view-six" v-show="currentLayout === layout.SIX">
            <div class="layout-left">
              <div class="layout-left-top">
                <div class="layout-member layout-member-1">
                  <div class="member-text">
                    画面1
                  </div>
                </div>
              </div>
              <div class="layout-left-bottom">
                <div class="layout-member layout-member-4">
                  <div class="member-text">
                    画面4
                  </div>
                </div>
                <div class="layout-member layout-member-5">
                  <div class="member-text">
                    画面5
                  </div>
                </div>
              </div>
            </div>
            <div class="layout-right">
              <div class="layout-member layout-member-2">
                <div class="member-text">
                  画面2
                </div>
              </div>
              <div class="layout-member layout-member-3">
                <div class="member-text">
                  画面3
                </div>
              </div>
              <div class="layout-member layout-member-6">
                <div class="member-text">
                  画面6
                </div>
              </div>
            </div>
          </div>
        </div>
        <ul class="layouts">
          <li @click="chooseLayout(item)" class="layout-item" :key="index" v-for="(item, index) in layoutOption">
            <input type="radio" name="layout" :value="item.layout" :id="item.layout" v-model="currentLayout">
            <i class="icon" :class="currentLayout === item.layout ? 'icon-radio-checked' : 'icon-radio'"></i>
            <label :for="item.layout">{{item.text}}</label>
          </li>
        </ul>
      </div>
      <div class="vmp-oper">
        <button class='btn refresh' type='button'>刷新</button>
        <button class='btn submit' type='button'>确认</button>
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
  import ImageView from 'base/image-view/image-view'
  import AddMember from 'components/add-member/add-member'
  import {loadConfs, endConf, deleteMember, addMembers} from 'api/conf'
  import {loadDevices} from 'api/device'
  import {IMAGE_ICONS} from 'common/js/config'

  const CONF_TYPE = 3
  const VMP_LAYOUT = {
    ONE: 1,
    TWO: 2,
    THREE: 23,
    FOUR: 4,
    FIVE: 35,
    SIX: 6
  }

  export default {
    data() {
      return {
        memberOperFlag: false,
        confReady: false,
        currIndex: -1,
        currConf: null,
        confMembers: null,
        confMemberIds: [],
        confList: [],
        totalCount: 0,
        showIconsTmpl: ['icon-flag', 'icon-mic', 'icon-volume-o', 'icon-delete'],
        showIconsOfMembers: [],
        defaultImageUrl: require('../../common/image/1.jpg'),
        currentLayout: 1,
        layout: VMP_LAYOUT,
        layoutOption: [
          {layout: VMP_LAYOUT.ONE, text: '一画面'},
          {layout: VMP_LAYOUT.TWO, text: '二画面'},
          {layout: VMP_LAYOUT.THREE, text: '三画面'},
          {layout: VMP_LAYOUT.FOUR, text: '四画面'},
          {layout: VMP_LAYOUT.FIVE, text: '五画面'},
          {layout: VMP_LAYOUT.SIX, text: '六画面'}
        ]
      }
    },
    methods: {
      chooseLayout(item) {
        this.currentLayout = item.layout
      },
      openAddModal() {
        this.$refs.addMemberModal.show()
      },
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
      initConfState() {
        this.confReady = false
        this.confMembers = null
        this._refreshCurrConf(this.confList[this.currIndex])
        this._initShowIcons()
      },
      _refreshCurrConf(newCurrConf) {
        this.currConf = newCurrConf
        const deviceIds = this.currConf.members
        this._loadConfMembers(deviceIds)
      },
      _resetCurrConf() {
        this.currIndex = 1
        this.confReady = false
        this.currConf = null
        this.confMembers = null
        this.confMemberIds = []
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
        if (iconParam.iconType === IMAGE_ICONS.FLAG) {
          newIcon = IMAGE_ICONS.FLAG_SELECTED
        }
        if (iconParam.iconType === IMAGE_ICONS.FLAG_SELECTED) {
          newIcon = IMAGE_ICONS.FLAG
        }
        return newIcon
      },
      _initShowIcons() {
        let members = this.currConf.members
        const ids = members.split(',')
        const memberIds = ids.map((item) => {
          return parseInt(item)
        })
        console.log(memberIds)
        for (let i = 0; i < memberIds.length; i++) {
          this.showIconsOfMembers[i] = [...this.showIconsTmpl]
        }
        console.log(`this.showIconsOfMembers=${JSON.stringify(this.showIconsOfMembers)}`)
      },
      _loadConfList() {
        const param = {confType: CONF_TYPE, skip: 0, limit: 20}
        loadConfs(param).then((res) => {
          if (res.success) {
            this.confList = res.bizData.page.list
            this.totalCount = res.bizData.page.total
            this.currIndex = 0
          }
        })
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
    components: {
      Scroll,
      Modal,
      ImageView,
      Loading,
      AddMember
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"
  @import "~common/stylus/common.styl"

  .many-to-many
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
      position: relative
      float: left
      height: 80%
      width: 350px
      margin-right: 100px
      clear-fix()
      .conf-oper
        @extends $conf-oper
        position: absolute
        top: 50%
        width: 140px
        text-align: center
      .members-wrapper
        display: inline-block
        height: 100%
        width: 90%
        border: 1px solid #e2e9ed
        text-align: left
        vertical-align: top
        background: #fff
        .scroll-wrapper
          display: inline-block
          vertical-align: middle
          .members
            position: relative
            display: inline-block
            margin-left: 10px
            padding-top: 10px
            .member-wrapper
              display: inline-block
              width: 140px
              height: 90px
              margin-bottom: 30px
              background: #f3f5fd
        .add-btn-wrapper
          @extends $conf-oper
          margin-left: 30px
          .icon
            color: #9CA5B0
            background: #f3f5fd + 50%
            &:hover
              background: #f3f5fd
    .conf-vmp
      height: 80%
      padding-bottom: 60px
      overflow:hidden
      .vmp-container
        height: 80%
        margin-right: 130px
        .layout-view-wrapper
          float: left
          height: 100%
          width: 100%
          overflow: hidden
          .layout-view
            display: inline-block
            width: 100%
            height: 100%
            background: #fff
            box-sizing: border-box
            font-size: 0
            .layout-member
              display: inline-block
              position: relative
              box-sizing: border-box
              border: 1px solid #e2e9ed
              font-size: $font-size-medium
              color: #999
              .member-text
                display: inline-block
                position: absolute
                top: 50%
                left: 50%
                transform: translate3d(-50%, -50%, 0)
            .layout-left, .layout-right
              display: inline-block
              width: 50%
              height: 100%
              // border: 1px solid #e2e9ed
              box-sizing: border-box
            &.layout-view-one
              .layout-member
                width: 100%
                height: 100%
            &.layout-view-two
              .layout-member
                width: 50%
                height: 100%
                border: 1px solid #e2e9ed
              .layout-member-1
                border-right: 0
            &.layout-view-three
              .layout-left
                .layout-member
                  width: 100%
                  height: 100%
              .layout-right
                .layout-member
                  width: 100%
                  height: 50%
              .layout-member-1
                border-right: 0
              .layout-member-2
                border-bottom: 0
            &.layout-view-four
              .layout-left, .layout-right
                .layout-member
                  width: 100%
                  height: 50%
              .layout-member-1, .layout-member-3
                border-right: 0
              .layout-member-1, .layout-member-2
                border-bottom: 0
            &.layout-view-five, &.layout-view-six
              .layout-member-1, .layout-member-4, .layout-member-5
                border-right: 0
              .layout-member-1, .layout-member-2, .layout-member-3
                border-bottom: 0
              .layout-left-top,.layout-left-bottom
                display: inline-block
                box-sizing: border-box
              .layout-left
                width: 66.6%
                height: 100%
                .layout-left-top
                  width: 100%
                  height: 66.6%
                  .layout-member
                    width: 100%
                    height: 100%
                .layout-left-bottom
                  width: 100%
                  height: 33.3%
                  .layout-member
                    width: 50%
                    height: 100%
              .layout-right
                width: 33.3%
                height: 100%
                .layout-member
                  width: 100%
                  height: 33.3%
        .layouts
          float: right
          margin-right: -130px
          width: 120px
          height: 100%
          .layout-item
            line-height: 40px
            text-align: left
            font-size: $font-size-medium
            color: #081025
            cursor: pointer
            input[type=radio]
              visibility: hidden
              &:checked + .icon-radio-checked
                color: $color-text-highlight
            label
              margin-left: 6px
              font-weight: bold
            label, .icon
              cursor: pointer
      .vmp-oper
        height: 10%
        margin-top: 40px
        padding-right: 130px
        text-align: right
        .btn
          width: 70px
          line-height: 30px
          text-align: center
          background-color: #fcfafb
          border: 1px solid #969696
          border-radius: 20px
          cursor: pointer
          outline: none
          &:hover
            background-color: #f3f5fd
          &.submit
            margin-left: 20px
            color: #fff
            background-color: #15d273
            border: 1px solid transparent
            &.submit:hover
              background-color: #15E47C
</style>
