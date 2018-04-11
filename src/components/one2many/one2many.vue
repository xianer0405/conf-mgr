<template>
  <div class="one-to-many">
    <div class="conf-list">
      <h1 class='title'>一对多转播列表</h1>
      <conf-list :currentIndex="currIndex" :confs="confList" @select="selectChange"></conf-list>
    </div>
    <div class="conf-detail">
      <h1 class='title'>转播-{{currConf ? currConf.name : '未选择'}}</h1>
      <div class="members" v-show="currConf">
        <div class="shower-wrapper members-wrapper">
          <div class="member-wrapper">
            <image-view @iconClick="memberOper" :kid="1" :showIcons="showIcons" :imageUrl="currConf.imageUrl2"></image-view>
          </div>
          <div class="conf-oper" @click.stop="endConf">
            <i class="icon icon-finish"></i>
            <h1 class="text">结束转播</h1>
          </div>
        </div>
        <div class="watchers-wrapper members-wrapper">
          <scroll class="scroll-wrapper">
            <ul class="watchers">
              <li class="watcher">
                <div class="member-wrapper">
                  <image-view :kid="2" @iconClick="memberOper" :showIcons="showIconsOfWatcher" :imageUrl="currConf.imageUrl2"></image-view>
                </div>
              </li>
              <li class="watcher">
                <div class="member-wrapper">
                  <image-view :kid="3" @iconClick="memberOper" :showIcons="showIconsOfWatcher" :imageUrl="currConf.imageUrl1"></image-view>
                </div>
              </li>
              <li class="watcher">
                <div class="member-wrapper">
                  <image-view @iconClick="memberOper" :showIcons="showIconsOfWatcher" :imageUrl="currConf.imageUrl1"></image-view>
                </div>
              </li>
              <li class="watcher">
                <div class="member-wrapper">
                  <image-view @iconClick="memberOper" :showIcons="showIconsOfWatcher" :imageUrl="currConf.imageUrl1"></image-view>
                </div>
              </li>
              <li class="watcher">
                <div class="member-wrapper">
                  <!-- <image-view width="300" :showIcons="showIcons" :imageUrl="currConf.imageUrl1"></image-view> -->
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
    <modal ref="modal"></modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Modal from 'base/modal/modal'
  import ConfList from 'components/conf-list/conf-list'
  import ImageView from 'base/image-view/image-view'
  import {searchDevice} from 'api/device'
  const DEFAULT_CURRINDEX = 0
  // const CONF_TYPE = 2

  export default {
    data() {
      return {
        currConf: null,
        currIndex: -1,
        confList: [],
        showIcons: ['icon-mic'],
        showIconsOfWatcher: ['icon-volume-o', 'icon-delete']
      }
    },
    methods: {
      memberOper(param) {
        this.$refs.modal.info(JSON.stringify(param))
      },
      openAddModal() {
        this.$refs.modal.info('添加观看成员!')
      },
      endConf() {
        this.$refs.modal.info('操作成功!')
      },
      selectChange(index) {
        this.currIndex = index
        console.log(this.currIndex)
      },
      _loadConfList() {
        searchDevice({name: '设备'}).then((res) => {
          if (res.success) {
            this.confList = res.bizData.list
            if (this.confList.length) {
              this.selectChange(DEFAULT_CURRINDEX)
            }
          }
        })
      }
    },
    watch: {
      currIndex() {
        this.currConf = this.confList[this.currIndex]
        /* mock code */
        if (this.currIndex % 2 === 0) {
          this.currConf.imageUrl1 = require('../../common/image/1.jpg')
          this.currConf.imageUrl2 = require('../../common/image/2.jpg')
        } else {
          this.currConf.imageUrl1 = require('../../common/image/kobe.jpg')
          this.currConf.imageUrl2 = require('../../common/image/kobe.gif')
        }
      }
    },
    created() {
      this._loadConfList()
    },
    components: {
      ConfList,
      ImageView,
      Modal,
      Scroll
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
      line-height: 60px
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
      padding-bottom: 60px
      overflow:hidden
      .members
        overflow: auto
        height: 100%
        padding: 20px 20px
        min-height: 330px
        background: #fff
        .tip
          margin-top: 20%
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
                height: 100px
                margin-bottom: 20px
                background: #f3f5fd
            .add-btn-wrapper
              @extends $conf-oper
              .icon
                color: #9CA5B0
                background: #f3f5fd + 50%
                &:hover
                  background: #f3f5fd
              margin-left: 40px
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
