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
      <div class="add-wrapper" @click.stop="openSysUserFormModal()">
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
            <li class="table-cell">{{item.phone ? item.phone : '--'}}</li>
            <li class="table-cell">{{item.email ? item.email: '--'}}</li>
            <li class="table-cell">{{item.dept ? item.dept: '--'}}</li>
            <li class="table-cell">{{item.formatedCreateTime ? item.formatedCreateTime : '--'}}</li>
            <li class="table-cell oper-cell">
              <a href="#" class="edit" @click.stop="openSysUserFormModal(item)">编辑</a>
              <a href="#" class="delete" @click.stop="openDeleteModal(item)">删除</a>
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
           :title="sysUserFormTitle"
           :autoHide="false"
           :modalType="4"
           @confirm="submitSysUserForm"
           @cancel="cancelSysUserForm">
      <div class="add-form">
        <div class="form-item">
          <label class="form-lbl">登录ID:</label>
          <input type='text' name="loginId" v-model="currentSysUser.loginId">
          <input type='hidden' class='login-id' name="sysUserId" v-model="currentSysUser.id">
          <span class="form-required-mask">*</span>
        </div>
        <div class="form-item">
          <label class="form-lbl">用户姓名:</label>
          <input type='text' class='username' name="username" v-model="currentSysUser.username" autocomplete="off">
          <span class="form-required-mask">*</span>
        </div>
        <div class="form-item">
          <label class="form-lbl">用户类型:</label>
          <select class="sysuser-type" name="sysUserType" v-model="currentSysUser.type">
            <option value="2" selected>操作员</option>
            <option value="1">管理员</option>
          </select>
        </div>
        <div class="form-item" v-show="!currentSysUser.id">
          <label class="form-lbl">用户密码:</label>
          <input type='password' class='password' name="password" v-model="currentSysUser.password" autocomplete="off">
          <span class="form-required-mask">*</span>
        </div>
        <div class="form-item">
          <label class="form-lbl">联系电话:</label>
          <input type='text' class='phone' name="phone" v-model="currentSysUser.phone">
        </div>
        <div class="form-item">
          <label class="form-lbl">电子邮箱:</label>
          <input type='text' class='email' name="email" v-model="currentSysUser.email">
        </div>
        <div class="form-item">
          <label class="form-lbl">所在部门:</label>
          <input type='text' class='dept' name="dept" v-model="currentSysUser.dept">
        </div>
      </div>
    </modal>
    <modal @confirm="deleteSysUser" @cancel="cancelDelete" :modalType="3" :autoHide="false" ref="deleteSysUserModal">
      <p>确认删除该用户吗?</p>
    </modal>
    <modal ref="tipModal"></modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import Modal from 'base/modal/modal'
  import {listSysUser, deleteSysUser, addSysUser, updateSysUser} from 'api/sysuser'

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
        totalCount: 0,
        currentSysUser: {},
        sysUserFormTitle: ''
      }
    },
    methods: {
      openSysUserFormModal(sysUser) {
        if (sysUser) {
          this.sysUserFormTitle = '编辑'
          const {id, loginId, username, password, phone, email, dept, type} = sysUser
          this.currentSysUser = {id, loginId, username, password, phone, email, dept, type}
        } else {
          this.sysUserFormTitle = '新增'
          this.currentSysUser = {type: 2}
        }
        this.$refs.addModal.show()
      },
      submitSysUserForm() {
        if (!this.checkSysUserForm()) {
          return false
        }
        if (this.currentSysUser) {
          if (this.currentSysUser.id) {
            updateSysUser(this.currentSysUser).then((res) => {
              if (res.success) {
                this.$refs.tipModal.show('修改用户信息成功')
                this._refreshSysUser()
              } else {
                this.$refs.tipModal.show('修改用户失败')
              }
            }).catch((err) => {
              console.log(err)
            }).finally(() => {
              this.$refs.addModal.hide()
            })
          } else {
            addSysUser(this.currentSysUser).then((res) => {
              if (res.success) {
                this.$refs.tipModal.show('添加用户成功')
                this._refreshSysUser()
              } else {
                this.$refs.tipModal.show('添加用户失败')
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
      checkSysUserForm() {
        if (!this.currentSysUser.loginId) {
          this.$refs.tipModal.show('登录ID不能为空!')
          return false
        }
        if (!this.currentSysUser.username) {
          this.$refs.tipModal.show('用户姓名不能为空!')
          return false
        }
        if (!this.currentSysUser.password) {
          this.$refs.tipModal.show('登录密码不能为空!')
          return false
        }
        return true
      },
      cancelSysUserForm() {
        this.sysUserFormTitle = ''
        this.currentSysUser = {}
      },
      openDeleteModal(sysUser) {
        this.toDeleteSysUser = sysUser
        this.$refs.deleteSysUserModal.show()
      },
      cancelDelete() {
        this.toDeleteSysUser = null
      },
      deleteSysUser() {
        if (!this.toDeleteSysUser) {
          return
        }
        const toDeleteSysUser = this.toDeleteSysUser
        /* console.log(toDeleteSysUser)
        const {id, username} = {toDeleteSysUser}
        console.log(id, username)
        const {id: sysUserId} = {toDeleteSysUser} */
        const param = {sysUserId: toDeleteSysUser.id}
        console.log(param)
        deleteSysUser(param).then((res) => {
          if (res.success) {
            this.$refs.tipModal.show(`用户[${toDeleteSysUser.username}]删除成功!`)
            this._refreshSysUser()
          } else {
            this.$refs.tipModal.show(`用户[${toDeleteSysUser.username}]删除失败!`)
          }
        }).finally(() => {
          this.toDeleteSysUser = null
        })
      },
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
      _refreshSysUser() {
        const skip = (this.currentPageNum - 1) * pageCount
        this._doSearch(this.searchKey, skip, pageCount)
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
      select
        width: 188px
        height: 24px
        padding-left: 5px
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
</style>
