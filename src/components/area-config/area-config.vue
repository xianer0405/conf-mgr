<template>
  <div class="area-config">
    <div class="list-content">
      <div class="table">
        <div class="table-column-group">
          <div class="table-column seq-column"></div>
          <div class="table-column type-column"></div>
          <div class="table-column text-column"></div>
          <div class="table-column upload-column"></div>
          <div class="table-column oper-column"></div>
        </div>
        <div class="table-header-group">
          <ul class="table-row">
            <li class="table-cell">序号</li>
            <li class="table-cell">类别</li>
            <li class="table-cell">文字描述</li>
            <li class="table-cell">LOGO上传</li>
            <li class="table-cell">修改时间</li>
          </ul>
        </div>
        <div class="table-row-group">
          <ul class="table-row" :key="index" v-for="(item, index) in sysConfigList">
            <li class="table-cell">{{item.id}}</li>
            <li class="table-cell">{{item.configName}} </li>
            <li class="table-cell">{{item.configValue}}</li>
            <li class="table-cell upload-cell">
              <i class="icon icon-image" title="点击预览" @click.stop="imagePreview(item.id)"></i>
              <label class="lbl-upload" :for="'logoUpload'+item.id">上传</label>
              <input accept="image/png,image/jpeg,image/jpg,image/gif" type="file" name="" :id="'logoUpload' + item.id" @change="uploadLogoImage(item.id, $event)">
            </li>
            <li class="table-cell">{{item.formatedCreateTime}}</li>
          </ul>
        </div>
      </div>
    </div>
    <modal ref="previewModal" :autoHide="false" :modalType="2" :showHeader="false" :showBottom="false" :showIcon="false">
      <div class="preview-wrapper">
        <img style="max-width: 300px" class="logo-preivew" :src="imagePreviewUrl" v-show="imagePreviewUrl"/>
      </div>
    </modal>
    <modal ref="tipModal">
    </modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import Modal from 'base/modal/modal'
  import {listSysConfig, uploadLogoImage} from 'api/sysconfig'

  export default {
    data() {
      return {
        sysConfigList: [],
        imagePreviewUrl: ''
      }
    },
    methods: {
      imagePreview(sysConfigId) {
        console.log(sysConfigId)
        const fIndex = this.findIndex(sysConfigId)
        if (fIndex === -1) {
          return
        }
        const config = this.sysConfigList[fIndex]
        this.imagePreviewUrl = config.configAttachment
        console.log(this.imagePreviewUrl)
        this.$refs.previewModal.show()
      },
      uploadLogoImage(sysConfigId, event) {
        const fileId = 'logoUpload' + sysConfigId
        uploadLogoImage(fileId, {
          'sysConfigId': sysConfigId
        }).then((res) => {
          if (res.success) {
            const fIndex = this.findIndex(sysConfigId)
            const config = this.sysConfigList[fIndex]
            config.configAttachment = res.bizData.entity.configAttachment
            this.$refs.tipModal.show('上传成功')
          } else {
            this.$refs.tipModal.show(res.msg || '上传失败')
          }
        }).catch((err) => {
          this.$refs.tipModal.show('操作失败')
          console.log(err)
        })
      },
      findIndex(sysConfigId) {
        const fIndex = this.sysConfigList.findIndex((item) => {
          return item.id === sysConfigId
        })
        return fIndex
      },
      _loadSysConfig() {
        listSysConfig().then((res) => {
          if (res.success) {
            const data = res.bizData
            this.sysConfigList = data.list ? data.list : []
          }
        })
      }
    },
    mounted () {
      this._loadSysConfig()
    },
    components: {
      Modal
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin.styl'

  .area-config
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
          &.name-column
            width: 120px
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
              border-radius: 5px
              color: #5476B2
              background: #e6e7fd
              cursor: pointer
            input[type=file]
              display: none
          &.oper-cell > a
            color: #5476B2
        .table-header-group
          display:table-header-group
          line-height: 28px
          background: #f6f7fd
          .table-cell
            font-weight: 800
</style>
