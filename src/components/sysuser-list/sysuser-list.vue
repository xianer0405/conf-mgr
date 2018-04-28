<template>
  <div class="sysuser-list">
    <header class="list-header">
      <div class="search-wrapper">
        <input v-model="searchInput"
               @keyup.enter="searchSysUser"
               class="search-input"
               type="text"
               name="searchInput"
               placeholder="根据名称模糊搜索">
        <i class="icon icon-search" @click.stop="searchSysUser"></i>
      </div>
      <div class="add-wrapper" @click.stop="openAddSysUserModal">
        <i class="icon icon-add"></i>
        <a href="#" class="add-link">添加</a>
      </div>
    </header>
    <div class="list-content">
      <div class="table">
        <div class="table-column-group">
          <div class="table-column seq-column"></div>
          <div class="table-column name-column"></div>
          <div class="table-column name-column"></div>
          <div class="table-column name-column"></div>
          <div class="table-column name-column"></div>
          <div class="table-column name-column"></div>
          <div class="table-column name-column"></div>
          <div class="table-column name-column"></div>
        </div>
        <div class="table-header-group">
          <ul class="table-row">
            <li class="table-cell">序号</li>
            <li class="table-cell">登录账户</li>
            <li class="table-cell">用户名称</li>
            <li class="table-cell">手机号码</li>
            <li class="table-cell">电子邮箱</li>
            <li class="table-cell">所在部门</li>
            <li class="table-cell">创建时间</li>
            <li class="table-cell">操作</li>
          </ul>
        </div>
        <div class="table-row-group" v-show="!sysUserList.length && listReady">
          <ul class="table-row noresult-row">
            <li class="table-cell">没有搜索到相关记录</li>
            <li class="table-cell"></li>
            <li class="table-cell"></li>
            <li class="table-cell"></li>
            <li class="table-cell"></li>
            <li class="table-cell"></li>
            <li class="table-cell"></li>
            <li class="table-cell"></li>
          </ul>
        </div>
        <div class="table-row-group" v-show="sysUserList.length">
          <ul class="table-row" :key="index" v-for="(item, index) in sysUserList">
            <li class="table-cell">{{item.id}}</li>
            <li class="table-cell">{{item.loginId}}</li>
            <li class="table-cell">{{item.username}}</li>
            <li class="table-cell">{{item.phone}}</li>
            <li class="table-cell">{{item.email}}</li>
            <li class="table-cell">{{item.dept ? item.dept: '--'}}</li>
            <li class="table-cell">{{item.formatedCreateTime ? item.formatedCreateTime : '--'}}</li>
            <li class="table-cell">
              <a href="#" class="edit">编辑</a>
              <a href="#" class="delete">删除</a>
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
  </div>
</template>

<script type="text/ecmascript-6">
  import Modal from 'base/modal/modal'
  import {listSysUser} from 'api/sysuser'

  const pageCount = 10
  export default {
    name: 'sysuser-list',
    data() {
      return {
        listReady: false,
        searchKey: '',
        searchInput: '',
        sysUserList: [],
        currentPageNum: 1,
        totalCount: 0
      }
    },
    methods: {
      openAddDeviceModal() {
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
      searchSysUser() {
        this.currentPageNum = 1
        this.searchKey = this.searchInput
        const skip = (this.currentPageNum - 1) * pageCount
        this._doSearch(this.searchKey, skip, pageCount)
      },
      _loadSysUser() {
        this.currentPageNum++
        const skip = (this.currentPageNum - 1) * pageCount
        this._doSearch('', skip, pageCount)
      },
      _doSearch(name, skip, limit) {
        const param = {name, skip, limit}
        listSysUser(param).then((res) => {
          if (res.success) {
            const data = res.bizData.page
            this.totalCount = data.total
            this.sysUserList = data.list ? data.list : []
          }
          this.listReady = true
        })
      },
      _initSysUser() {
        this.listReady = false
        this.searchKey = ''
        this.searchInput = ''
        this.sysUserList = []
        this.currentPageNum = 0
        this.totalCount = 0
      }
    },
    mounted () {
      this._initSysUser()
      this._loadSysUser()
    },
    components: {
      Modal
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin.styl'

  .sysuser-list
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
              border-radius: 5px
              color: #5476B2
              background: #e6e7fd
              cursor: pointer
            input[type=file]
              display: none
          &.oper-cell > a
            color: #5476B2
          &.select-cell
            select
              width: 60px
              border: 1px solid #e2e9ed
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
        &.active
          &:hover
            color: #fff
            background: #3c78e6
        &.disabled
          cursor: default
          background: #e6e7fd
</style>
