<template>
  <div class="rtmp-to-third">
    <div class="device-list">
      <h1 class='title'>设备列表({{totalCount}})</h1>
      <device-ui-list
        ref="deviceScroll"
        :currentIndex="currIndex"
        :devices="deviceList"
        @select="selectChange"
        @pullUpLoad="pullUpLoad"
        @pullingDown="pullDownRefresh"></device-ui-list>
    </div>
    <div class="push-wrapper">
      <h1 class='title'>推送列表</h1>
      <div class="push-container">
        <ul class="push-list">
          <li class="push-item" :key="index" v-for="(item, index) in rtmpList">
            <label for="">第{{index+1}}路:</label>
            <input @focus="rtmpInputFocus(item)" v-model='item.rtmpUrl' type='text' class='push-url' placeholder='输入RTMP推送地址'>
            <button class='btn push' type='button' @click.stop="pushRtmpStream(item, index)" v-html="item.state === 1 ? '推送中' : '推&nbsp;送'"></button>
            <button class='btn stop' v-if="item.state === 1" type='button' @click.stop="stopRtmpPush(item, index)">结&nbsp;束</button>
            <button class='btn stop disabled' v-else disabled="true" type='button' @click.stop="stopRtmpPush(item, index)">结&nbsp;束</button>
            <button class='btn showQRCode' type='button' @click.stop="shareQRCode(item, index)">分&nbsp;享</button>
          </li>
        </ul>
      </div>
    </div>
    <modal ref="shareModal" :autoHide="false" :modalType="2" :showHeader="false" :showBottom="false" :showIcon="false">
      <div class="qrcode-wrapper">
        <qrcode-vue className="qrcode" :size="160" :value="qrcodeVal"></qrcode-vue>
        <span class="qrcode-text">{{qrCodeText}}</span>
      </div>
    </modal>
    <modal ref="modal">
    </modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import QrcodeVue from 'qrcode.vue';
  import Modal from 'base/modal/modal'
  import Loading from 'base/loading/loading'
  import DeviceUiList from 'base/device-ui-list/device-ui-list'
  import {listDevices} from 'api/device'
  import {loadRtmpList, rtmpOper} from 'api/rtmppush'

  const pageCount = 10
  export default {
    data() {
      return {
        currIndex: -1,
        deviceList: null,
        totalCount: 0,
        currentPageNum: 1,
        rtmpList: [],
        qrCodeText: '',
        showQRCodeFlag: false,
        qrcodeVal: ''
      }
    },
    methods: {
      rtmpInputFocus(item) {
        if (item.state === 1 && this.deviceList.length) {
          const fIndex = this.deviceList.findIndex((val) => {
            return val.id === item.deviceId
          })
          if (fIndex !== -1) {
            if (this.currIndex !== -1) {
              this.currIndex = fIndex
              this.$refs.deviceScroll.scrollToElement(this.currIndex)
            }
          }
        }
      },
      pushRtmpStream(item, index) {
        const {id, rtmpUrl} = item
        if (!rtmpUrl) {
          this.$refs.modal.info('请输入RTMP协议的推送地址!')
          return false
        }
        if (this.currIndex === -1) {
          this.$refs.modal.info('请选择推流的设备!')
          return false
        }
        const device = this.deviceList[this.currIndex]
        if (!device || !device.id) {
          this.$refs.modal.info('请选择推流的设备!')
          return false
        }
        const deviceId = device.id
        const deviceChnId = 3
        const cmd = 1
        let param = {id, deviceId, deviceChnId, rtmpUrl, cmd}
        console.log(param)
        rtmpOper(param).then((res) => {
          if (res.success) {
            this.$refs.modal.info('RTMP码流推送成功!')
            this._loadRtmpList()
          } else {
            this.$refs.modal.info('RTMP码流推送失败!')
          }
        })
      },
      shareQRCode(item, index) {
        this.$refs.shareModal.show()
        this.qrcodeVal = item.m3u8Url
        this.qrCodeText = item.name
        this.showQRCodeFlag = true
      },
      stopRtmpPush(item, index) {
        const cmd = 0
        const {id, deviceId, deviceChnId} = item
        let param = {id, deviceId, deviceChnId, cmd}
        console.log(param)
        rtmpOper(param).then((res) => {
          if (res.success) {
            this.$refs.modal.info('停止推送RTMP码流成功!')
            this._loadRtmpList()
          } else {
            this.$refs.modal.info('停止推送RTMP码流失败!')
          }
        })
      },
      selectChange(index) {
        this.currIndex = index
      },
      prev() {
        if (this.currentPageNum === 1) {
          return
        }
        this.currentPageNum--
        const skip = (this.currentPageNum - 1) * pageCount
        this._loadDevices(skip)
      },
      pullUpLoad() {
        setTimeout(() => {
          this.next()
        }, 800)
      },
      pullDownRefresh() {
        this._initParam()
        this._loadDevices()
      },
      next() {
        const totalPages = Math.ceil(this.totalCount / pageCount)
        if (this.currentPageNum === totalPages) {
          return
        }
        this.currentPageNum++
        const skip = (this.currentPageNum - 1) * pageCount
        this._loadDevices(skip)
      },
      _loadDevices(skip) {
        skip = skip || 0
        const param = {name: '', skip: skip, limit: pageCount}
        listDevices(param).then((res) => {
          if (res.success) {
            this.totalCount = res.bizData.page.total
            let list = res.bizData.page.list
            list = list.length ? list : []
            this.deviceList = this.deviceList && this.deviceList.length ? this.deviceList.concat(list) : list
          }
        })
      },
      _loadRtmpList() {
        loadRtmpList().then((res) => {
          if (res.success) {
            let list = res.bizData.list
            this.rtmpList = list.length ? list : []
          }
        })
      },
      _initParam() {
        this.currIndex = -1
        this.deviceList = null
        this.totalCount = 0
        this.currentPageNum = 1
      }
    },
    created() {
      this._initParam()
      setTimeout(() => {
        this._loadDevices()
        this._loadRtmpList()
      }, 500)
    },
    components: {
      DeviceUiList,
      Modal,
      Loading,
      QrcodeVue
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin.styl'

  .qrcode-wrapper
    position: relative
    padding-top: 10px
    background: #fff
    .qrcode-text
      position: absolute
      left: 0
      bottom: -3px
      width: 100%
      line-height: 20px
      color: #000
  .rtmp-to-third
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
    input[type='text']
      width: 300px
      height: 32px
      padding-left: 6px
      vertical-align: middle
      color:#000
      box-sizing: border-box
      border: 1px solid #EAEEF3
      border-radius: 3px
      background-color: #F3F5FD
      outline:none
      placeholder-color(#CDCED3)
      transition: border-color ease-in-out .15s
      &:focus
        border-color: #c6c6c6
    .device-list
      float: left
      height: 80%
      width: 350px
      margin-right: 100px
      clear-fix()
    .push-wrapper
      position: relative
      overflow:hidden
      height: 80%
      padding-bottom: 50px
      .push-container
        position: absolute
        top: 50%
        margin-top: 40px
        transform: translateY(-50%)
        .push-list
          .push-item
            margin: 10px
          .btn
            width: 70px
            margin: 0 5px
            line-height: 30px
            text-align: center
            background-color: #fcfafb
            border: 1px solid #969696
            border-radius: 20px
            cursor: pointer
            outline: none
            &:hover
              background-color: #d4e2ff
            &.push
              margin-left: 20px
              color: #fff
              background-color: #15d273
              border: 1px solid transparent
              &.push:hover
                background-color: #15E47C
            &.disabled
              background-color: #f3f5fd
              curso: default
</style>
