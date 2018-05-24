<template>
  <div class="rtmp-config">
    <div class="list-content">
      <div class="table">
        <div class="table-column-group">
          <div class="table-column seq-column"></div>
          <div class="table-column deviecchn-column"></div>
          <div class="table-column rtmpaddr-column"></div>
          <div class="table-column liveaddr-column"></div>
          <div class="table-column state-column"></div>
          <div class="table-column oper-column"></div>
        </div>
        <div class="table-header-group">
          <ul class="table-row">
            <li class="table-cell">序号</li>
            <li class="table-cell">推送通道</li>
            <li class="table-cell">RTMP地址</li>
            <li class="table-cell">直播地址</li>
            <li class="table-cell">推流状态</li>
            <li class="table-cell">操作</li>
          </ul>
        </div>
        <div class="table-row-group">
          <ul class="table-row" :key="index" v-for="(item, index) in rtmpConfigList">
            <li class="table-cell">{{item.id}}</li>
            <li class="table-cell " :title="item.deviceChnId">{{deviceChnName(item)}}</li>
            <li class="table-cell rtmpurl-cell" :title="item.rtmpUrl">{{item.rtmpUrl}}</li>
            <li class="table-cell m3u8url-cell">{{item.m3u8Url}}</li>
            <li class="table-cell">{{rtmpState(item)}}</li>
            <li class="table-cell">
              <a href="#" class="edit" @click.stop="openEditFormModal(item)">编辑</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <modal ref="editModal"
           title="编辑推送信息"
           :autoHide="false"
           :modalType="4"
           @confirm="submitForm"
           @cancel="cancelForm">
      <div class="edit-form">
        <div class="form-item">
          <label class="form-lbl">名称:</label>
          <input type='hidden' class='rtmp-id' name="rtmpId" v-model="currentRtmpConfig.id">
          <input type='text' class='rtmp-name' name="rtmpname" v-model="currentRtmpConfig.name">
          <span class="form-required-mask">*</span>
        </div>
        <div class="form-item">
          <label class="form-lbl">推流通道:</label>
          <select class="device-chnid" v-model="currentRtmpConfig.deviceChnId">
            <option value="3">合成通道</option>
            <option value="6">四选二A</option>
            <option value="7">四选二B</option>
            <option value="8">DVIIN上</option>
            <option value="9">DVIIN下</option>
          </select>
          <span class="form-required-mask">*</span>
        </div>
        <div class="form-item" :title="currentRtmpConfig.rtmpUrl">
          <label class="form-lbl">RTMP地址:</label>
          <input type='text' class='rtmpurl' name="rtmpurl" v-model="currentRtmpConfig.rtmpUrl">
          <span class="form-required-mask">*</span>
        </div>
        <div class="form-item" :title="currentRtmpConfig.m3u8Url">
          <label class="form-lbl">直播地址:</label>
          <input type='text' class='m3u8url' name="m3u8url" v-model="currentRtmpConfig.m3u8Url">
          <span class="form-required-mask">*</span>
        </div>
        <div class="form-item">
          <label class="form-lbl">推流状态:</label>
          <select readonly class="state" v-model="currentRtmpConfig.state">
            <option v-if="currentRtmpConfig.state === '-1'" value="-1">未绑定</option>
            <option v-if="currentRtmpConfig.state === '0'" value="0">已绑定</option>
            <option v-if="currentRtmpConfig.state === '1'" value="1">推送中</option>
          </select>
        </div>
      </div>
    </modal>
    <modal ref="tipModal">
    </modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import Modal from 'base/modal/modal'
  import {loadRtmpList, updateRtmpConfig} from 'api/rtmppush'

  export default {
    data() {
      return {
        rtmpConfigList: [],
        currentRtmpConfig: {}
      }
    },
    methods: {
      deviceChnName(rtmpConfig) {
        if (rtmpConfig) {
          let deviceChnName = rtmpConfig.deviceChnId
          switch (rtmpConfig.deviceChnId) {
          case 3:
            deviceChnName = '合成通道'
            break
          case 6:
            deviceChnName = '四选二A'
            break
          case 7:
            deviceChnName = '四选二B'
            break
          case 8:
            deviceChnName = 'DVIIN上'
            break
          case 9:
            deviceChnName = 'DVIIN下'
            break
          default:
            break
          }
          return deviceChnName
        }
      },
      rtmpState(rtmpConfig) {
        if (rtmpConfig) {
          return rtmpConfig.state === -1 ? '未绑定' : rtmpConfig.state === 0 ? '已绑定' : '推送中'
        }
      },
      submitForm() {
        console.log('submitDeviceForm')
        if (!this.checkForm()) {
          return false
        }
        if (this.currentRtmpConfig) {
          if (this.currentRtmpConfig.id) {
            updateRtmpConfig(this.currentRtmpConfig).then((res) => {
              if (res.success) {
                this.$refs.tipModal.show('修改推流配置成功')
                this._loadRtmpConfig()
              } else {
                this.$refs.tipModal.show('修改推流配置失败')
              }
            }).catch((err) => {
              console.log(err)
            }).finally(() => {
              this.$refs.editModal.hide()
            })
          } else {
            this.$refs.tipModal.show('加载推流信息失败，刷新界面后重试!')
          }
        } else {
          this.$refs.tipModal.show('加载推流信息失败，刷新界面后重试!')
        }
      },
      checkForm() {
        if (!this.currentRtmpConfig.name) {
          this.$refs.tipModal.show('名称不能为空!')
          return false
        }
        if (!this.currentRtmpConfig.rtmpUrl) {
          this.$refs.tipModal.show('推送地址不能为空!')
          return false
        }
        if (!this.currentRtmpConfig.m3u8Url) {
          this.$refs.tipModal.show('直播地址不能为空!')
          return false
        }
        return true
      },
      cancelForm() {
        this.currentRtmpConfig = {}
      },
      openEditFormModal(rtmpConfig) {
        if (rtmpConfig) {
          const {id, name, deviceChnId, rtmpUrl, m3u8Url, state} = rtmpConfig
          /* this.currentDevice = Object.assign({}, device)
          this.currentDevice.attachment = null */
          this.currentRtmpConfig = {id, name, deviceChnId, rtmpUrl, m3u8Url, state}
          this.$refs.editModal.show()
        } else {
          this.$refs.tipModal.show('加载RTMP配置失败!')
        }
      },
      _loadRtmpConfig() {
        loadRtmpList().then((res) => {
          if (res.success) {
            const data = res.bizData
            this.rtmpConfigList = data.list ? data.list : []
          }
        })
      }
    },
    mounted () {
      this._loadRtmpConfig()
    },
    components: {
      Modal
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin.styl'
  .edit-form
    width: 400px
    font-size: 14px
    text-align: left
    .form-item
      line-height: 40px
      .form-lbl
        display: inline-block
        margin-right: 15px
        width: 120px
        text-align: right
      .form-required-mask
        position: absolute
        margin-left: 5px
        color: red
      select
        width: 186px
        height: 24px
        border-color: #eaeef3
        background-color: #f3f5fd
      input
        width: 160px
        height: 24px
        padding-left: 5px
        padding-right: 20px
        border: 1px solid #eaeef3
        border-radius: 3px
        background-color: #f3f5fd
        outline: none
        -webkit-transition: border-color ease-in-out 0.15s
        transition: border-color ease-in-out 0.15s
        &:focus
          border-color: #c6c6c6
      input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill
        background-color: #f3f5fd !important
        color: rgb(0, 0, 0) !important
  .rtmp-config
    padding-top: 40px
    .list-content
      height: 320px
      .table
        display:table
        width: 100%
        font-size: 14px
        color: #081025
        border-collapse:collapse
        border:1px solid #ccc
        background: #fff
        cursor: pointer
        .table-column-group
          display:table-column-group
        .table-column
          display:table-column
          width: 100px
          &.seq-column
            width: 50px
          &.deviecchn-column
            width: 30px
          &.rtmpaddr-column
            width: 140px
            max-width: 140px
          &.liveaddr-column
            width: 140px
            max-width: 140px
          &.state-column
            width: 60px
          &.oper-column
            width: 80px
        .table-row-group
          display:table-row-group
        .table-row
          display:table-row
          line-height: 28px
        .table-row-group,.table-footer-group
          & .table-row:hover
            background:#f6f6f6
        .table-cell
          display: table-cell
          padding:0 10px
          border:1px solid #ccc
          no-wrap()
          &.devicechn-cell
            max-width: 30px
          &.rtmpurl-cell, &.m3u8url-cell
            max-width: 220px
          &.oper-cell > a
            color: #5476B2
        .table-header-group
          display:table-header-group
          line-height: 28px
          background: #f6f7fd
          .table-cell
            font-weight: 800
</style>
