<template>
  <div class="one-to-one">
    <div class="conf-list">
      <h1 class='title'>一对一转播列表</h1>
      <conf-list :confs="confList" @select="confChange"></conf-list>
    </div>
    <div class="conf-detail">
      <h1 class='title'>转播-{{currConfName}}</h1>
      <div class="members">
        <div class="member-wrapper">
          <image-view></image-view>
        </div>
        <div class="member-wrapper">
          <image-view></image-view>
        </div>
        <div class="conf-oper">
          <i class="icon icon-record"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import ConfList from 'components/conf-list/conf-list'
  import ImageView from 'base/image-view/image-view'
  import {searchDevice} from 'api/device'

  export default {
    data() {
      return {
        currConfName: '转播名称',
        confList: []
      }
    },
    methods: {
      confChange(conf) {
        this.currConfName = conf.name
        console.log(conf)
      },
      _loadConfList() {
        searchDevice({name: '设备'}).then((res) => {
          if (res.success) {
            this.confList = res.bizData.list
          }
        })
      }
    },
    created() {
      this._loadConfList()
    },
    components: {
      ConfList,
      ImageView
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable.styl"

  $minHeight = 430px
  $contentHeight = $minHeight - 60
  .one-to-one
    margin: 10px 0
    width: 100%
    min-height: $minHeight
    color: #333
    font-size: $font-size-medium
    .title
      line-height: 60px
      font-size: $font-size-medium-x
      font-weight: bolder
      vertical-align: middle
    .conf-list
      float: left
      margin-right: 100px
      height: $contentHeight
      width: 350px
      min-width:200px
      clear-fix()
    .conf-detail
      overflow:hidden
      .members
        height: 100%;
        padding: 20px 30px;
        min-height: 330px;
        background: #fff;
        text-align: center
        .conf-oper
          margin-top: 50px
          .icon
            padding: 12px;
            font-size: 28px;
            color: #fff;
            background-color: red;
            border: 1px solid red;
            border-radius: 100%;
        .member-wrapper
          display: inline-block
          width: 300px
          &:first-child
            margin-right: 30px
  @media screen and (max-width: 1365px)
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
  /* @media screen and (min-width: 1920px)
    $minHeight = 730px
    $contentHeight = $minHeight - 60
    .one-to-one
      min-height: $minHeight
      .conf-list, .conf-detail
        height: $contentHeight
      .conf-detail
        .members
          .member-wrapper
            width: 500px
            &:first-child
              margin-right: 100px
          .conf-oper
            margin-top: 100px
  @media screen and (min-width: 1367px) and (max-width: 1480px)
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
