<template>
  <div class="device-list">
    <header class="list-header">
      <div class="search-wrapper">
        <!-- <label for="search-device">搜索</label> -->
        <input v-model="searchInput"
               @keyup.enter="searchDevice"
               class="search-input"
               type="text"
               name="searchInput"
               placeholder="根据名称模糊搜索">
        <i class="icon icon-search" @click.stop="searchDevice"></i>
      </div>
      <div class="add-wrapper" @click.stop="openDeviceFormModal()">
        <i class="icon icon-add"></i>
        <a href="#" class="add-link">添加</a>
      </div>
    </header>
    <div class="list-content">
      <div class="table">
        <div class="table-column-group">
          <div class="table-column seq-column"></div>
          <div class="table-column name-column"></div>
          <div class="table-column ip-column"></div>
          <div class="table-column location-column"></div>
          <div class="table-column select-column"></div>
          <div class="table-column select-column"></div>
          <div class="table-column select-column"></div>
          <div class="table-column upload-column"></div>
          <div class="table-column oper-column"></div>
        </div>
        <div class="table-header-group">
          <ul class="table-row">
            <li class="table-cell">序号</li>
            <li class="table-cell">设备名称</li>
            <li class="table-cell">设备IP</li>
            <li class="table-cell">设备位置</li>
            <li class="table-cell">图像设置</li>
            <li class="table-cell">码率设置</li>
            <li class="table-cell">帧率设置</li>
            <li class="table-cell">图片上传</li>
            <li class="table-cell">操作</li>
          </ul>
        </div>
        <div class="table-row-group" v-show="!deviceList.length && listReady">
          <ul class="table-row noresult-row">
            <li class="table-cell">没有搜索到相关记录</li>
            <li class="table-cell"></li>
            <li class="table-cell"></li>
            <li class="table-cell"></li>
            <li class="table-cell"></li>
            <li class="table-cell"></li>
            <li class="table-cell"></li>
            <li class="table-cell"></li>
            <li class="table-cell"></li>
          </ul>
        </div>
        <div class="table-row-group" v-show="deviceList.length">
          <ul class="table-row" :key="index" v-for="(item, index) in deviceList">
            <li class="table-cell">{{item.id}}</li>
            <li class="table-cell">{{item.deviceName}}</li>
            <li class="table-cell">{{item.deviceIp}}</li>
            <li class="table-cell">{{item.location}}</li>
            <li class="table-cell select-cell">
              <select class="mediaparameter" @change="setMediaparameter(item, index, $event)" :value="getMediaParameter(index)">
                <option value="2">HD</option>
                <option value="3">Spies</option>
                <option value="1">人像模式</option>
              </select>
            </li>
            <li class="table-cell select-cell">
              <select class="bitrate" @change="setBitrate(item, index, $event)" :value="getBitrate(index)">
                <option value="1048">1048Kb</option>
                <option value="2048">2048Kb</option>
                <option value="4096">4096Kb</option>
                <option value="6144">6144Kb</option>
                <option value="7168">8128Kb</option>
                <option value="8128">8192Kb</option>
                <option value="16284">16384Kb</option>
                <option value="20480">20480Kb</option>
                <option value="30720">30720Kb</option>
                <option value="51200">51200Kb</option>
                <option value="61440">61440Kb</option>
                <option value="81280">81280Kb</option>
              </select>
            </li>
            <li class="table-cell select-cell">
              <select class="framerate" @change="setFramerate(item, index, $event)" :value="getFramerate(index)">
                <option value="5">5fps</option>
                <option value="10">10fps</option>
                <option value="15">15fps</option>
                <option value="20">20fps</option>
                <option value="30">30fps</option>
                <option value="40">40fps</option>
                <option value="50">50fps</option>
                <option value="60">60fps</option>
              </select>
            </li>
            <li class="table-cell upload-cell">
              <i class="icon icon-image" title="预览"  @click.stop="imagePreview(item.id)"></i>
              <label class="lbl-upload" :for="'imageUpload'+item.id">上&nbsp;传</label>
              <input type="file" name="" :id="'imageUpload' + item.id" @change="uploadDeviceImage(item.id, $event)">
            </li>
            <li class="table-cell oper-cell">
              <a href="#" class="edit" @click.stop="openDeviceFormModal(item)">编辑</a>
              <a href="#" class="edit" @click.stop="openDeleteModal(item)">删除</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="list-bottom">
      <span class="total-count">共{{totalCount}}条记录</span>
      <span class="total-count">第{{currentPageNum}}页</span>
      <span class="prev page-btn" :class="prevCls()" @click.stop="prev">上一页</span>
      <span class="next page-btn" :class="nextCls()" @click.stop="next">下一页</span>
    </div>
    <modal ref="addModal"
           :title="deviceFormTitle"
           :autoHide="false"
           :modalType="4"
           @confirm="submitDeviceForm"
           @cancel="cancelDeviceForm">
      <div class="add-form">
        <div class="form-item">
          <label class="form-lbl">设备名称:</label>
          <input type='text' class='device-name' name="deviceName" v-model="currentDevice.deviceName">
          <input type='hidden' class='device-id' name="deviceId" v-model="currentDevice.id">
          <span class="form-required-mask">*</span>
        </div>
        <div class="form-item">
          <label class="form-lbl">IP地址:</label>
          <input type='text' class='ipaddress' name="ipaddress" v-model="currentDevice.deviceIp">
          <span class="form-required-mask">*</span>
        </div>
        <div class="form-item">
          <label class="form-lbl">WEB端口号:</label>
          <input type='text' class='web-port' name="webPort" v-model="currentDevice.devicePort">
          <span class="form-required-mask">*</span>
        </div>
        <div class="form-item">
          <label class="form-lbl">用户名:</label>
          <input type='text' class='device-account' name="deviceAccount" v-model="currentDevice.deviceUsername" autocomplete="off">
          <span class="form-required-mask">*</span>
        </div>
        <div class="form-item">
          <label class="form-lbl">密码:</label>
          <input type='text' class='device-password' name="devicePassword" v-model="currentDevice.devicePassword">
          <span class="form-required-mask">*</span>
        </div>
        <div class="form-item">
          <label class="form-lbl">FTP端口号:</label>
          <input type='text' class='ftp-port' name="ftpPort" v-model="currentDevice.ftpPort">
        </div>
        <div class="form-item">
          <label class="form-lbl">新视通账户:</label>
          <input type='text' class='conf-account' name="confAccount" v-model="currentDevice.confAccount">
        </div>
        <div class="form-item">
          <label class="form-lbl">安装位置:</label>
          <input type='text' class='location' name="location" v-model="currentDevice.location">
        </div>
      </div>
    </modal>
    <modal ref="previewModal" :autoHide="false" :modalType="2" :showHeader="false" :showBottom="false" :showIcon="false">
      <div class="preview-wrapper">
        <img style="max-width: 300px" class="logo-preivew" :src="imagePathConvert(imagePreviewUrl)" v-show="imagePreviewUrl"/>
        <span class="preview-text">{{imagePreviewText}}</span>
      </div>
    </modal>
    <modal @confirm="deleteDevice" @cancel="cancelDelete" :modalType="3" :autoHide="false" ref="deleteDeviceModal">
      <p>确认删除该设备吗?</p>
    </modal>
    <modal ref="tipModal"></modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import Modal from 'base/modal/modal'
  import {pathConvert} from 'common/js/util'
  import {env} from 'common/js/config'
  import {listDevice, deleteDevice, uploadDeviceImage, addDevice, updateDevice, getMediaParameters, getEncodeConfigs, setMediaParameter, setEncodeConfig} from 'api/device'

  const isProd = env === 'prod'

  const pageCount = 10
  export default {
    name: 'device-list',
    data() {
      return {
        listReady: false,
        searchKey: '',
        searchInput: '',
        deviceList: [],
        mediaParameterList: [],
        encodeConfigList: [],
        currentPageNum: 1,
        totalCount: 0,
        imagePreviewUrl: '',
        imagePreviewText: '',
        currentDevice: {},
        deviceFormTitle: ''
      }
    },
    watch: {
      deviceList: function (newVal) {
        if (this.deviceList.length > 0) {
          // 获取媒体参数和编码配置
          this.loadMediaParameters()
          this.loadEncodeConfigs()
        }
      }
    },
    methods: {
      imagePathConvert(imagePath) {
        return pathConvert(isProd, imagePath)
      },
      loadMediaParameters() {
        const deviceIdArr = this.deviceList.map((item) => {
          return item.id
        })
        const deviceIds = deviceIdArr.join(',')
        getMediaParameters({deviceIds}).then((res) => {
          console.log(res)
          if (res.success) {
            this.mediaParameterList = res.bizData.list
          }
        })
      },
      loadEncodeConfigs() {
        const deviceIdArr = this.deviceList.map((item) => {
          return item.id
        })
        const deviceIds = deviceIdArr.join(',')
        getEncodeConfigs({deviceIds}).then((res) => {
          console.log(res)
          if (res.success) {
            this.encodeConfigList = res.bizData.list
          }
        })
      },
      getMediaParameter(index) {
        if (this.mediaParameterList.length) {
          return this.mediaParameterList[index]
        }
      },
      getBitrate(index) {
        if (this.encodeConfigList.length) {
          if (this.encodeConfigList[index]) {
            return this.encodeConfigList[index].bitRate
          }
        }
      },
      getFramerate(index) {
        if (this.encodeConfigList.length) {
          console.log(this.encodeConfigList[index])
          if (this.encodeConfigList[index]) {
            return this.encodeConfigList[index].frameRate
          }
        }
      },
      setMediaparameter(device, index, event) {
        event.preventDefault()
        const deviceId = device.id
        const schemeId = event.target.value
        setMediaParameter({deviceId, schemeId}).then((res) => {
          if (res.success) {
            this.mediaParameterList[index] = schemeId
            this.$refs.tipModal.show('设置图像参数成功')
            return true
          } else {
            this.$refs.tipModal.show('设置图像参数失败')
            event.target.value = this.mediaParameterList[index]
            return false
          }
        })
      },
      setBitrate(device, index, event) {
        event.preventDefault()
        const bitrate = event.target.value
        const deviceId = device.id
        let encodeConfigObj = this.encodeConfigList[index]
        let newEncodeConfig = Object.assign({}, encodeConfigObj)
        newEncodeConfig.bitRate = bitrate
        const encodeConfigJson = JSON.stringify(newEncodeConfig)
        setEncodeConfig({deviceId, encodeConfigJson}).then((res) => {
          if (res.success) {
            this.$refs.tipModal.show('设置码率成功')
            encodeConfigObj.bitRate = bitrate
            return true
          } else {
            this.$refs.tipModal.show('设置码率失败')
            event.target.value = encodeConfigObj.bitRate
            return false
          }
        })
      },
      setFramerate(device, index, event) {
        event.preventDefault()
        const framerate = event.target.value
        const deviceId = device.id
        let encodeConfigObj = this.encodeConfigList[index]
        let newEncodeConfig = Object.assign({}, encodeConfigObj)
        newEncodeConfig.frameRate = framerate
        const encodeConfigJson = JSON.stringify(newEncodeConfig)
        setEncodeConfig({deviceId, encodeConfigJson}).then((res) => {
          if (res.success) {
            encodeConfigObj.frameRate = framerate
            this.$refs.tipModal.show('设置帧率成功')
            return true
          } else {
            this.$refs.tipModal.show('设置帧率失败')
            event.target.value = encodeConfigObj.frameRate
            return false
          }
        })
      },
      openDeviceFormModal(device) {
        if (device) {
          this.deviceFormTitle = '编辑'
          const {id, deviceName, deviceIp, devicePort, deviceUsername, devicePassword, ftpPort, confAccount, location} = device
          /* this.currentDevice = Object.assign({}, device)
          this.currentDevice.attachment = null */
          this.currentDevice = {id, deviceName, deviceIp, devicePort, deviceUsername, devicePassword, ftpPort, confAccount, location}
        } else {
          this.deviceFormTitle = '新增'
          this.currentDevice = {devicePort: 80, ftpPort: 21, deviceName: '', deviceIp: '', deviceUsername: 'admin', devicePassword: 'admin123'}
        }
        this.$refs.addModal.show()
      },
      submitDeviceForm() {
        console.log('submitDeviceForm')
        if (!this.checkDeviceForm()) {
          return false
        }
        if (this.currentDevice) {
          if (this.currentDevice.id) {
            updateDevice(this.currentDevice).then((res) => {
              if (res.success) {
                this.$refs.tipModal.show('修改设备成功')
                this._refreshDevice()
              } else {
                this.$refs.tipModal.show('修改设备失败')
              }
            }).catch((err) => {
              console.log(err)
            }).finally(() => {
              this.$refs.addModal.hide()
            })
          } else {
            addDevice(this.currentDevice).then((res) => {
              if (res.success) {
                this.$refs.tipModal.show('添加设备成功')
                this._refreshDevice()
              } else {
                this.$refs.tipModal.show('添加设备失败')
              }
            }).catch((err) => {
              console.log(err)
            }).finally(() => {
              this.$refs.addModal.hide()
            })
          }
        } else {
          this.$refs.addModal.hide()
          this.$refs.tipModal.show('操作失败，刷新界面后重试!')
        }
      },
      checkDeviceForm() {
        if (!this.currentDevice.deviceName) {
          this.$refs.tipModal.show('设备名称不能为空!')
          return false
        }
        if (!this.currentDevice.deviceIp) {
          this.$refs.tipModal.show('设备IP不能为空!')
          return false
        }
        if (!this.currentDevice.devicePort) {
          this.$refs.tipModal.show('WEB端口号不能为空!')
          return false
        }
        if (!this.currentDevice.deviceUsername) {
          this.$refs.tipModal.show('设备用户名不能为空!')
          return false
        }
        if (!this.currentDevice.devicePassword) {
          this.$refs.tipModal.show('设备密码不能为空!')
          return false
        }
        return true
      },
      cancelDeviceForm() {
        this.deviceFormTitle = ''
        this.currentDevice = {}
      },
      uploadDeviceImage(deviceId, event) {
        const fileId = 'imageUpload' + deviceId
        uploadDeviceImage(fileId, {
          'deviceId': deviceId
        }).then((res) => {
          if (res.success) {
            this._refreshDevice()
            this.$refs.tipModal.show('上传成功')
          } else {
            this.$refs.tipModal.show(res.msg || '上传失败')
          }
        }).catch((err) => {
          this.$refs.tipModal.show('操作失败')
          console.log(err)
        })
      },
      imagePreview(deviceId) {
        console.log(deviceId)
        const fIndex = this._findIndex(deviceId)
        if (fIndex === -1) {
          return
        }
        const device = this.deviceList[fIndex]
        this.imagePreviewUrl = device.attachment.fileUrl + '?_=' + Date.now()
        this.imagePreviewText = device.deviceName
        this.$refs.previewModal.show()
      },
      _findIndex(deviceId) {
        const fIndex = this.deviceList.findIndex((item) => {
          return item.id === deviceId
        })
        return fIndex
      },
      openDeleteModal(device) {
        this.toDeleteDevice = device
        this.$refs.deleteDeviceModal.show()
      },
      cancelDelete() {
        this.toDeleteDevice = null
      },
      deleteDevice() {
        if (!this.toDeleteDevice) {
          return
        }
        const toDeleteDevice = this.toDeleteDevice
        const param = {deviceId: toDeleteDevice.id}
        deleteDevice(param).then((res) => {
          if (res.success) {
            this.$refs.tipModal.show(`设备[${toDeleteDevice.deviceName}]删除成功!`)
            this._refreshDevice()
          } else {
            this.$refs.tipModal.show(`设备[${toDeleteDevice.deviceName}]删除失败!`)
          }
        })
      },
      prev() {
        console.log('prev')
        if (this.currentPageNum === 1) {
          return
        }
        this.currentPageNum--
        const skip = (this.currentPageNum - 1) * pageCount
        this._doSearch(this.searchKey, skip, pageCount)
      },
      next() {
        console.log('next')
        const totalPages = Math.ceil(this.totalCount / pageCount)
        if (this.currentPageNum === totalPages) {
          return
        }
        this.currentPageNum++
        const skip = (this.currentPageNum - 1) * pageCount
        this._doSearch(this.searchKey, skip, pageCount)
      },
      prevCls() {
        return this.currentPageNum === 1 ? 'disabled' : 'active'
      },
      nextCls() {
        const totalPages = Math.ceil(this.totalCount / pageCount)
        return this.currentPageNum === totalPages ? 'disabled' : 'active'
      },
      searchDevice() {
        this.currentPageNum = 1
        this.searchKey = this.searchInput
        const skip = (this.currentPageNum - 1) * pageCount
        this._doSearch(this.searchKey, skip, pageCount)
      },
      _loadDevice() {
        this.currentPageNum++
        const skip = (this.currentPageNum - 1) * pageCount
        this._doSearch('', skip, pageCount)
      },
      _refreshDevice() {
        const skip = (this.currentPageNum - 1) * pageCount
        this._doSearch(this.searchKey, skip, pageCount)
      },
      _doSearch(name, skip, limit) {
        const param = {name, skip, limit}
        listDevice(param).then((res) => {
          if (res.success) {
            const data = res.bizData.page
            this.totalCount = data.total
            this.deviceList = data.list ? data.list : []
          }
          this.listReady = true
        })
      },
      _initDevice() {
        this.listReady = false
        this.searchKey = ''
        this.searchInput = ''
        this.deviceList = []
        this.currentPageNum = 0
        this.totalCount = 0
      }
    },
    mounted () {
      this._initDevice()
      this._loadDevice()
    },
    components: {
      Modal
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin.styl'

  .add-form
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
  .device-list
    .list-header
      height: 40px
      line-height: 40px
      font-size: 14px
      text-align: right
      & > div
        display: inline-block
      .search-wrapper
        position: relative
        line-height: 40px
        margin-right: 10px
        .search-input
          height: 24px
          width: 160px
          padding-left: 5px
          padding-right: 20px
          border: 1px solid #EAEEF3
          border-radius: 3px
          background-color: #F3F5FD
          outline:none
          placeholder-color(#CDCED3)
          transition: border-color ease-in-out .15s
          &:focus
            border-color: #c6c6c6
        .icon-search
          position: absolute
          right: 5px
          top: 11px
          padding: 3px
          cursor: pointer
          &:hover
            color: #3c78e6
            transform: scale(1.1)
      .add-wrapper
        width: 58px
        line-height: 24px
        text-align: center
        border: 1px solid #EAEEF3
        border-radius: 3px
        cursor: pointer
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
          &.name-column
            width: 120px
          &.ip-column, &.location-column
            width: 100px
          &.select-column
            width: 80px
          &.upload-column
            width: 100px
          &.oper-column
            width: 80px
        .table-row-group
          display:table-row-group
        .table-row
          display:table-row
          line-height: 28px
          &.noresult-row
            & > .table-cell
              border: none
        .table-row-group,.table-footer-group
          & .table-row:hover
            background:#f6f6f6
        .table-cell
          display: table-cell
          padding:0 10px
          border:1px solid #ccc
          no-wrap()
          &.upload-cell
            .icon
              font-size: 18px
              vertical-align: middle
            .lbl-upload
              display: inline-block
              width: 60px
              margin-left: 20px
              line-height: 20px
              text-align: center
              border-radius: 30px
              color: #5476B2
              background: #e6e7fd
              cursor: pointer
            input[type=file]
              display: none
          &.oper-cell > a
            color: #5476B2
          &.select-cell
            select
              width: 80px
              border: 1px solid #e2e9ed
              &:focus
                outline: none
        .table-header-group
          display:table-header-group
          line-height: 28px
          background: #f6f7fd
          .table-cell
            font-weight: 800
    .list-bottom
      height: 40px
      line-height: 40px
      font-size: 14px
      text-align: right
      .page-btn
        padding: 3px 6px
        border: 1px solid #EAEEF3
        border-radius: 3px
        cursor: pointer
        -moz-user-select:none
        -webkit-user-select:none
        -ms-user-select:none
        -khtml-user-select:none
        user-select:none
        &.active
          &:hover
            color: #fff
            background: #3c78e6
        &.disabled
          cursor: default
          background: #e6e7fd
  .preview-wrapper
    position: relative
    background: rgb(248, 248, 248)
    .preview-text
      position: absolute
      left: 0
      bottom: 3px
      width: 100%
      line-height: 20px
</style>
