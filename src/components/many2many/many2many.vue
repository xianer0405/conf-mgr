<template>
  <div class="many-to-many">
    <div class="conf-list">
      <h1 class='title'>多对多转播列表({{confList && confList.length}})</h1>
      <div class="members-wrapper" >
        <div class="loading-container" v-show="!confList">
          <loading title="正在加载会议列表..."></loading>
        </div>
        <div class="noresult-container" v-show="!confList.length">
          <p class="">当前无转播记录</p>
        </div>
        <div class="scroll-wrapper"
             :key="index"
             v-show="currIndex === index"
             v-for="(item, index) in confList">
          <scroll class="conf-scroll" :data="confMemberIds" :preventDefault="scrollPreventDefault" :scrollbar="scrollbar">
            <ul class="members">
              <li class="member" :key="index" v-for="(item, index) in confMembers">
                <div :title="item.deviceName" class="member-wrapper" draggable="true" @dragstart="drag(item, $event)">
                  <image-view ref="imageView"
                              :kid="item.id"
                              :showIcons="showIconsOfMembers[index]"
                              :imageUrl="item.attachment ? item.attachment.fileUrl :defaultImageUrl"
                              @iconClick="memberOper">
                  </image-view>
                </div>
              </li>
            </ul>
          </scroll>
        </div>
        <div class="add-btn-wrapper" v-show="confList.length" @click.stop="openAddModal">
          <i class="icon icon-add"></i>
        </div>
        <div class="next-btn-wrapper" title="切换会议" v-show="confList.length" @click.stop="nextConf">
          <i class="icon icon-next"></i>
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
          <div class="layout-view layout-view-null" v-show="currentLayout === -1">
            <div class="layout-member">
              <div class="member-text">
                未开启画面合成
              </div>
            </div>
          </div>
          <div class="layout-view layout-view-1" v-show="currentLayout === layout.ONE">
            <div class="layout-member layout-member-1" data-layoutindex="1"
                 @dragleave.prevent="dragleave($event)"
                 @dragover.prevent="dragover($event)"
                 @drop.prevent="drop($event)">
              <div class="member-text">
                画面1
              </div>
            </div>
          </div>
          <div class="layout-view layout-view-2" v-show="currentLayout === layout.TWO">
            <div class="layout-member layout-member-1" data-layoutindex="1"
                 @dragleave.prevent="dragleave($event)"
                 @dragover.prevent="dragover($event)"
                 @drop.prevent="drop($event)">
              <div class="member-text">
                画面1
              </div>
            </div>
            <div class="layout-member layout-member-2" data-layoutindex="2"
                 @dragleave.prevent="dragleave($event)"
                 @dragover.prevent="dragover($event)"
                 @drop.prevent="drop($event)">
              <div class="member-text">
                画面2
              </div>
            </div>
          </div>
          <div class="layout-view layout-view-23" v-show="currentLayout === layout.THREE">
            <div class="layout-left">
              <div class="layout-member layout-member-1" data-layoutindex="1"
                   @dragleave.prevent="dragleave($event)"
                   @dragover.prevent="dragover($event)"
                   @drop.prevent="drop($event)">
                <div class="member-text">
                  画面1
                </div>
              </div>
            </div>
            <div class="layout-right">
              <div class="layout-member layout-member-2" data-layoutindex="2"
                   @dragleave.prevent="dragleave($event)"
                   @dragover.prevent="dragover($event)"
                   @drop.prevent="drop($event)">
                <div class="member-text">
                  画面2
                </div>
              </div>
              <div class="layout-member layout-member-3" data-layoutindex="3"
                   @dragleave.prevent="dragleave($event)"
                   @dragover.prevent="dragover($event)"
                   @drop.prevent="drop($event)">
                <div class="member-text">
                  画面3
                </div>
              </div>
            </div>
          </div>
          <div class="layout-view layout-view-5" v-show="currentLayout === layout.FOUR">
            <div class="layout-left">
              <div class="layout-member layout-member-1" data-layoutindex="1"
                   @dragleave.prevent="dragleave($event)"
                   @dragover.prevent="dragover($event)"
                   @drop.prevent="drop($event)">
                <div class="member-text">
                  画面1
                </div>
              </div>
              <div class="layout-member layout-member-3" data-layoutindex="3"
                   @dragleave.prevent="dragleave($event)"
                   @dragover.prevent="dragover($event)"
                   @drop.prevent="drop($event)">
                <div class="member-text">
                  画面3
                </div>
              </div>
            </div>
            <div class="layout-left">
              <div class="layout-member layout-member-2" data-layoutindex="2"
                   @dragleave.prevent="dragleave($event)"
                   @dragover.prevent="dragover($event)"
                   @drop.prevent="drop($event)">
                <div class="member-text">
                  画面2
                </div>
              </div>
              <div class="layout-member layout-member-4" data-layoutindex="4"
                   @dragleave.prevent="dragleave($event)"
                   @dragover.prevent="dragover($event)"
                   @drop.prevent="drop($event)">
                <div class="member-text">
                  画面4
                </div>
              </div>
            </div>
          </div>
          <div class="layout-view layout-view-35" v-show="currentLayout === layout.FIVE">
            <div class="layout-left">
              <div class="layout-left-top">
                <div class="layout-member layout-member-1" data-layoutindex="1"
                     @dragleave.prevent="dragleave($event)"
                     @dragover.prevent="dragover($event)"
                     @drop.prevent="drop($event)">
                  <div class="member-text">
                    画面1
                  </div>
                </div>
              </div>
              <div class="layout-left-bottom">
                <div class="layout-member layout-member-4" data-layoutindex="4"
                     @dragleave.prevent="dragleave($event)"
                     @dragover.prevent="dragover($event)"
                     @drop.prevent="drop($event)">
                  <div class="member-text">
                    画面4
                  </div>
                </div>
                <div class="layout-member layout-member-5" data-layoutindex="5"
                     @dragleave.prevent="dragleave($event)"
                     @dragover.prevent="dragover($event)"
                     @drop.prevent="drop($event)">
                  <div class="member-text">
                    画面5
                  </div>
                </div>
              </div>
            </div>
            <div class="layout-right">
              <div class="layout-member layout-member-2" data-layoutindex="2"
                   @dragleave.prevent="dragleave($event)"
                   @dragover.prevent="dragover($event)"
                   @drop.prevent="drop($event)">
                <div class="member-text">
                  画面2
                </div>
              </div>
              <div class="layout-member layout-member-3" data-layoutindex="3"
                   @dragleave.prevent="dragleave($event)"
                   @dragover.prevent="dragover($event)"
                   @drop.prevent="drop($event)">
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
          <div class="layout-view layout-view-6" v-show="currentLayout === layout.SIX">
            <div class="layout-left">
              <div class="layout-left-top">
                <div class="layout-member layout-member-1" data-layoutindex="1"
                     @dragleave.prevent="dragleave($event)"
                     @dragover.prevent="dragover($event)"
                     @drop.prevent="drop($event)">
                  <div class="member-text">
                    画面1
                  </div>
                </div>
              </div>
              <div class="layout-left-bottom">
                <div class="layout-member layout-member-4" data-layoutindex="4"
                     @dragleave.prevent="dragleave($event)"
                     @dragover.prevent="dragover($event)"
                     @drop.prevent="drop($event)">
                  <div class="member-text">
                    画面4
                  </div>
                </div>
                <div class="layout-member layout-member-5" data-layoutindex="5"
                     @dragleave.prevent="dragleave($event)"
                     @dragover.prevent="dragover($event)"
                     @drop.prevent="drop($event)">
                  <div class="member-text">
                    画面5
                  </div>
                </div>
              </div>
            </div>
            <div class="layout-right">
              <div class="layout-member layout-member-2" data-layoutindex="2"
                   @dragleave.prevent="dragleave($event)"
                   @dragover.prevent="dragover($event)"
                   @drop.prevent="drop($event)">
                <div class="member-text">
                  画面2
                </div>
              </div>
              <div class="layout-member layout-member-3" data-layoutindex="3"
                   @dragleave.prevent="dragleave($event)"
                   @dragover.prevent="dragover($event)"
                   @drop.prevent="drop($event)">
                <div class="member-text">
                  画面3
                </div>
              </div>
              <div class="layout-member layout-member-6" data-layoutindex="6"
                   @dragleave.prevent="dragleave($event)"
                   @dragover.prevent="dragover($event)"
                   @drop.prevent="drop($event)">
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
        <!-- <button class='btn drag-switch' type='button' @click.stop="dragSwitch" v-html="dragText">开启拖拽</button> -->
        <button class='btn refresh' type='button'>刷新</button>
        <button class='btn submit' type='button'>确认</button>
      </div>
    </div>
    <add-member ref="addMemberModal" @add-confirm="addMembers"></add-member>
    <modal ref="deleteMemberModal" @confirm="deleteMember" @cancel="cancelDelete" :modalType="3" :autoHide="false" >
      <p>确认删除该成员吗?</p>
    </modal>
    <modal ref="endConfModal" @confirm="endConf" :modalType="3" :autoHide="false">
      <p>确认结束当前转播吗?</p>
    </modal>
    <modal ref="tipModal"></modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Modal from 'base/modal/modal'
  import Loading from 'base/loading/loading'
  import ImageView from 'base/image-view/image-view'
  import AddMember from 'components/add-member/add-member'
  import {loadConfs, loadVmp, endConf, deleteMember, addMembers, volumeMute} from 'api/conf'
  import {addClass, findBySelector, dataAttr} from 'common/js/dom'
  import {loadDevices} from 'api/device'
  import {IMAGE_ICONS} from 'common/js/config'

  const CONF_TYPE = 3
  const VMP_LAYOUT = {
    ONE: 1,
    TWO: 2,
    THREE: 23,
    FOUR: 5,
    FIVE: 35,
    SIX: 6
  }

  export default {
    data() {
      return {
        scrollbar: {
          fade: false,
          interactive: true
        },
        scrollPreventDefault: false,
        memberOperFlag: false,
        confReady: false,
        currIndex: -1,
        currConf: null,
        confMembers: [],
        confMemberIds: [],
        vmp: null,
        confList: [],
        totalCount: 0,
        showIconsTmpl: ['icon-flag', 'icon-mic', 'icon-volume-o', 'icon-delete'],
        showIconsOfMembers: [],
        defaultImageUrl: require('../../common/image/1.jpg'),
        currentLayout: -1,
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
      memberOper(operParam) {
        // this.$refs.tipModal.show(JSON.stringify(operParam))
        /* if (this.memberOperFlag) {
          return false
        } */
        // this.memberOperFlag = true
        const confId = this.currConf.confId
        const confType = this.currConf.confType
        const deviceId = operParam.kid

        // 删除成员
        if (operParam.iconType === IMAGE_ICONS.DELETE_MEMEBER) {
          const confReq = {confId, deviceIds: deviceId, confType}
          this.deleteMemberReq = confReq
          this.$refs.deleteMemberModal.show()
        }
        // 发言人 或 取消发言人
        if (operParam.iconType === IMAGE_ICONS.FLAG || operParam.iconType === IMAGE_ICONS.FLAG_SELECTED) {
        }
        // 音量调节  静音或哑音
        if (operParam.iconType === IMAGE_ICONS.VOL_IN || operParam.iconType === IMAGE_ICONS.VOL_IN_OFF || operParam.iconType === IMAGE_ICONS.VOL_OUT || operParam.iconType === IMAGE_ICONS.VOL_OUT_OFF
        ) {
          const type = operParam.iconType === IMAGE_ICONS.VOL_IN || operParam.iconType === IMAGE_ICONS.VOL_IN_OFF ? 1 : 2 // 表示输入或输出
          const mute = operParam.iconType === IMAGE_ICONS.VOL_IN || operParam.iconType === IMAGE_ICONS.VOL_OUT // 是否静音
          const volumeReq = {confId, deviceId, type, mute}
          this.volumeOper(volumeReq, operParam)
        }
      },
      speakerOper() {

      },
      volumeOper(volumeReq, operParam) {
        volumeMute(volumeReq).then((res) => {
          if (res.success) {
            const newIcon = this._reverseIcon(operParam)
            const imageViewIndex = this.confMemberIds.indexOf(volumeReq.deviceId)
            let newShowIcons = []
            if (this.showIconsOfMembers.length) {
              newShowIcons = this.showIconsOfMembers[imageViewIndex].slice()
            } else {
              newShowIcons = this.showIconsTmpl.slice()
            }
            newShowIcons[operParam.iconIdx] = newIcon
            this.$set(this.showIconsOfMembers, imageViewIndex, newShowIcons)
            console.log(`this.showIconsOfMembers=${this.showIconsOfMembers}`)
            this.$refs.tipModal.info('操作成功!')
          } else {
            this.$refs.tipModal.error('操作失败!')
          }
        }).finally(() => {
          this.memberOperFlag = false
        })
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
            that.$refs.tipModal.info('操作成功!')
          } else {
            that.$refs.tipModal.info('操作失败!')
          }
        }).finally(() => {
          console.log('volumeMute finally ')
          that.memberOperFlag = false
        })
      },
      setVmpMember(dom, data) {
        dom.firstChild.innerText = data.deviceName
        dataAttr(dom, 'data-memberid', data.id)
        addClass(dom, 'member-fill')
      },
      nextConf() {
        if (this.currIndex === this.confList.length - 1) {
          this.currIndex = 0
          return
        }
        if (this.currIndex === 0) {
          this.currIndex = this.confList.length - 1
          return
        }
        this.currIndex = this.currIndex + 1
      },
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
            that.$refs.tipModal.info('操作成功!')
          } else {
            that.$refs.tipModal.info('操作失败!')
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
      endConf() {
        if (!this.currConf) {
          this.$refs.tipModal.show('请选中要操作的会议')
          return
        }
        const {confId, confType} = this.currConf
        endConf({confId, confType}).then((res) => {
          if (res.success) {
            this.$refs.tipModal.info('操作成功!')
            this._loadConfList()
            this._resetCurrConf()
          } else {
            this.$refs.tipModal.info('失败成功!')
          }
        })
      },
      initConfState() {
        this.confReady = false
        this.confMembers = []
        this._refreshCurrConf(this.confList[this.currIndex])
        this._initShowIcons()
      },
      drag(member, event) {
        console.log(JSON.stringify(member))
        console.log(JSON.stringify(event.currentTarget))
        this.dragMember = {
          member
        }
      },
      dragover(event) {
        event.preventDefault()
        return false
      },
      dragleave(event) {
        // removeClass(event.currentTarget, 'member-fill')
      },
      drop(event) {
        event.preventDefault()
        this.setVmpMember(event.currentTarget, this.dragMember.member)
        this.dragMember = null
      },
      loadVmp() {
        const that = this
        setTimeout(() => {
          loadVmp().then((res) => {
            that.vmp = res
            let layout = that.vmp.layout
            that.currentLayout = layout
            // const layoutViewCls = `.layout-view-${that.currentLayout} > .layout-member[data-layoutindex]`
            // let layoutMemberEles = findBySelector(layoutViewCls)
            for (let i = 0; i < that.vmp.members.length; i++) {
              const memberData = that.vmp.members[i]
              const chnIdx = memberData.chnIdx
              let layoutViewCls = `.layout-view-${this.currentLayout} .layout-member[data-layoutindex="${chnIdx
              }"]`
              let memberEle = findBySelector(layoutViewCls)
              that.setVmpMember(memberEle[0], memberData)
            }
          })
        }, 800)
      },
      _refreshCurrConf(newCurrConf) {
        this.currConf = newCurrConf
        const deviceIds = this.currConf.members
        this._loadConfMembers(deviceIds)
        this.loadVmp()
      },
      _resetCurrConf() {
        this.currIndex = 1
        this.confReady = false
        this.currConf = null
        this.confMembers = []
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
            this.confList = this.confList ? this.confList : []
            this.totalCount = res.bizData.page.total
            if (this.confList.length) {
              this.currIndex = 0
            }
          }
        })
      },
      _loadConfMembers(deviceIds) {
        loadDevices({deviceIds}).then((res) => {
          if (res.success) {
            let confMap = res.bizData.map
            for (var key in confMap) {
              console.log(confMap[key])
              this.confMembers.push(confMap[key])
            }
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
      setTimeout(() => {
        this._loadConfList()
      }, 1000)
      /* 暂时注释掉会议轮询功能 */
      /* if (this.timer) {
        clearTimeout(this.timer)
      } else {
        this.timer = setTimeout(() => {
          this._loadConfList()
        }, 5000)
      } */
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
        position: relative
        display: inline-block
        height: 100%
        width: 90%
        border: 1px solid #e2e9ed
        text-align: left
        vertical-align: top
        background: #fff
        .scroll-wrapper
          display: inline-block
          height: 100%
          vertical-align: middle
          .conf-scroll
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
                &:hover
                  cursor: move
        .add-btn-wrapper, .next-btn-wrapper
          position: absolute
          right: 50px
          cursor: pointer
          .icon
            padding: 12px
            font-size: 28px
            color: #9CA5B0
            background: #f3f5fd
            border-radius: 100%
            &:hover
              background: #dee3f9
        .next-btn-wrapper
          bottom: 20px
        .add-btn-wrapper
          top: 50%
          margin-top: -20px
        .loading-container, .noresult-container
          position: absolute
          width: 100%
          top: 50%
          transform: translateY(-50%)
        .noresult-container
          font-size: $font-size-medium
          color: $color-text-l
          text-align: center
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
              &:hover
                cursor: pointer
              &.member-fill > .member-text
                color: #333
                font-weight: 800
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
              box-sizing: border-box
            &.layout-view-1, &.layout-view-null
              .layout-member
                width: 100%
                height: 100%
            &.layout-view-2
              .layout-member
                width: 50%
                height: 100%
              .layout-member-1
                border-right: 0
            &.layout-view-23
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
            &.layout-view-5
              .layout-left, .layout-right
                .layout-member
                  width: 100%
                  height: 50%
              .layout-member-1, .layout-member-3
                border-right: 0
              .layout-member-1, .layout-member-2
                border-bottom: 0
            &.layout-view-35, &.layout-view-6
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
          &.drag-switch
            float: left
</style>
