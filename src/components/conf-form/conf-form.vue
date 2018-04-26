<template>
  <div class='conf-form' @click.stop='hideSubPage'>
    <div class='conf-info'>
      <h1 class='title'>转播信息</h1>
      <div class='form-item'>
        <span class="require-prefix">*</span>
        <label class='lbl' for='conf-name'>转播名称</label>
        <input v-model="confName" type='text' class='conf-name' placeholder='请输入转播名称'>
      </div>
      <div class='form-item'>
        <label class='lbl'>会议类型</label>
        <div class='conf-types'>
          <div class='conf-type'>
            <input v-model="confType" value="1" type='radio' name='type' id='ont2one'>
            <label class='text' for='ont2one'>一对一转播</label>
          </div>
          <div class='conf-type'>
            <input v-model="confType" value="2" type='radio' name='type' id='ont2many'>
            <label class='text' for='ont2many'>一对多转播</label>
          </div>
          <div class='conf-type'>
            <input v-model="confType" value="3" type='radio' name='type' id='many2many'>
            <label class='text' for='many2many'>多对多转播</label>
          </div>
        </div>
      </div>
    </div>
    <div class='conf-members'>
      <h1 class='title'>转播成员</h1>
      <div class='form-item' @click.stop="hideSearchResult()">
        <div class="search-wrapper" v-show="confType === '2'">
          <span class="require-prefix">*</span>
          <input @focus='search' v-model='sourceSearchInput' type='text' class='search' placeholder='搜索转播方'>
          <i @click='clearSourceSearchInpput' class='icon icon-close' v-show='sourceSearchInput'></i>
          <!-- <i class='icon icon-add'></i> -->
          <ul class='ul-list search-result' v-show='sourceSearchedList.length'>
            <li class='item'
                :key='index'
                v-for='(item, index) in sourceSearchedList'>
                <span class='name'>{{item.name}}</span>
                <i class='icon' :class="sourceSearchedItemIconCls(item)" @click='selectSourceSearchedItem(item)'></i>
            </li>
          </ul>
        </div>

        <div class="search-wrapper" @click.stop="hideSourceSearchResult()">
          <span class="require-prefix">*</span>
          <input @focus='search' v-model='searchInput' type='text' class='search' placeholder='搜索转播成员'>
          <i @click='clearSearchInpput' class='icon icon-close' v-show='searchInput'></i>
          <!-- <i class='icon icon-add'></i> -->
          <ul class='ul-list search-result' v-show='searchedList.length'>
            <li class='item'
                :key='index'
                v-for='(item, index) in searchedList'>
                <span class='name'>{{item.name}}</span>
                <i v-if="item.id > 0" class='icon' :class="searchedItemIconCls(item)" @click='selectSearchedItem(item)'></i>
            </li>
          </ul>
        </div>
      </div>
      <ul class='ul-list members' @click.stop>
        <li class='item'
            :key='index'
            v-for='(item, index) in selectedMemebers'>
            <i class='icon' :class="item.source ? 'icon-record' : 'icon-people'"></i>
            <span class='name'>{{item.name}}</span>
            <i @click='delItem(index)' class='icon icon-close'></i>
        </li>
      </ul>
    </div>
    <div class='form-oper' @click.stop>
      <button @click="resetForm" class='btn reset' type='button'>重置表单</button>
      <button @click="createConf" class='btn submit' type='button'>创建转播</button>
    </div>
    <modal ref="modal">
    </modal>
  </div>
</template>

<script type='text/ecmascript-6'>
  import {uploadLoginLogo} from 'api/system'
  import Modal from 'base/modal/modal'
  import {createConf} from 'api/conf'
  import {searchDevice} from 'api/device'

  const INVALID_ID = -1
  const CONF_TYPES = {
    ONE2ONE: 1,
    ONE2MANY: 2,
    MANY2MANY: 3
  }

  export default {
    name: 'conf-form',
    data() {
      return {
        confName: '',
        confType: 1,
        sourceSearchInput: '',
        sourceSearchedList: [],
        searchInput: '',
        searchedList: [],
        selectedMemebers: []
      }
    },
    watch: {
      searchInput(newInput) {
        this.execSearch(newInput, 'search')
      },
      sourceSearchInput(newInput) {
        this.execSearch(newInput, 'sourceSearch')
      },
      confType(newType) {
        this.selectedMemebers = []
      }
    },
    components: {
      Modal
    },
    methods: {
      createConf() {
        if (!this.confName) {
          this.$refs.modal.warn('转播名称不能为空!')
          return
        }
        if (this.selectedMemebers.length <= 0) {
          this.$refs.modal.warn('转播成员不能为空!')
          return
        }
        if (this.selectedMemebers.length <= 1) {
          this.$refs.modal.warn('只有一个成员，无法创建转播!')
          return
        }
        let deviceIds = this.selectedMemebers.map((item) => {
          return item.id
        }).join(',')
        const confReqParam = {confName: this.confName, confType: this.confType, deviceIds}
        createConf(confReqParam).then((res) => {
          if (res.success) {
            this.$refs.modal.info('创建转播成功!')
          } else {
            this.$refs.modal.error(res.msg || '创建转播失败!')
          }
        })
      },
      resetForm() {
        this.confName = ''
        this.confType = CONF_TYPES.ONE2ONE
        this.sourceSearchInput = ''
        this.searchInput = ''
        this.selectedMemebers = []
      },
      selectSourceSearchedItem(newSource) {
        let copyedSelectedMemebers = this.selectedMemebers.slice()
        let fIndex = copyedSelectedMemebers.findIndex((val) => {
          return val.id === newSource.id
        })
        // 列表中是否存在转播方成员
        let fSIndex = copyedSelectedMemebers.findIndex((val) => {
          return val.source
        })
        if (fSIndex !== -1) {
          if (fIndex === -1) {
            copyedSelectedMemebers.splice(fSIndex, 1)
          } else {
            copyedSelectedMemebers[fSIndex].source = false
          }
        }
        // 当前元素是否在列表中
        fIndex = copyedSelectedMemebers.findIndex((val) => {
          return val.id === newSource.id
        })
        if (fIndex !== -1) {
          copyedSelectedMemebers.splice(fIndex, 1)
        }
        newSource.source = true
        copyedSelectedMemebers.unshift(newSource)
        this.selectedMemebers = copyedSelectedMemebers
      },
      searchedItemIconCls(item) {
        if (this.selectedMemebers.length) {
          const fIndex = this.selectedMemebers.findIndex((value) => {
            return item.id === value.id
          })
          if (fIndex !== -1) {
            return 'icon-radio-checked'
          }
        }
        return 'icon-add'
      },
      sourceSearchedItemIconCls(item) {
        if (this.selectedMemebers.length) {
          const fIndex = this.selectedMemebers.findIndex((value) => {
            return item.id === value.id
          })
          if (fIndex !== -1) {
            return 'icon-radio-checked'
          }
        }
        return 'icon-add'
      },
      selectSearchedItem(item) {
        const index = this.selectedMemebers.findIndex((value) => {
          return item.id === value.id
        })
        if (index === -1) {
          if (this.confType === CONF_TYPES.ONE2ONE && this.selectedMemebers.length === 2) {
            return
          }
          this.selectedMemebers.push(item)
        } else {
          this.selectedMemebers.splice(index, 1)
        }
      },
      delItem(index) {
        this.selectedMemebers.splice(index, 1)
      },
      clearSearchInpput() {
        this.searchInput = ''
      },
      clearSourceSearchInpput() {
        this.sourceSearchInput = ''
      },
      hideSubPage() {
        this.clearSearchInpput()
        this.clearSourceSearchInpput()
      },
      sourceSearch() {
        let sourceSearchInput = this.sourceSearchInput
        this.execSearch(sourceSearchInput, 'sourceSearch')
      },
      search() {
        let searchInput = this.searchInput
        this.execSearch(searchInput, 'search')
      },
      execSearch(searchInput, type) {
        if (searchInput) {
          // this.searchedList = this._searchMembers()
          let searchParam = {name: searchInput}
          searchDevice(searchParam).then((res) => {
            if (res.success) {
              if (type === 'sourceSearch') {
                this.sourceSearchedList = res.bizData.list
                if (this.sourceSearchedList.length === 0) {
                  this.sourceSearchedList.push({id: INVALID_ID, name: '没有搜到相关记录'})
                }
              } else {
                this.searchedList = res.bizData.list
                if (this.searchedList.length === 0) {
                  this.searchedList.push({id: INVALID_ID, name: '没有搜到相关记录'})
                }
              }
            }
          })
        } else {
          if (type === 'sourceSearch') {
            this.sourceSearchedList = []
          } else {
            this.searchedList = []
          }
        }
      },
      hideSearchResult() {
        this.clearSearchInpput()
      },
      hideSourceSearchResult() {
        this.clearSourceSearchInpput()
      },
      upload() {
        const fileId = 'logoImage'
        const logoText = document.getElementById('logoText').value
        uploadLoginLogo(fileId, {
          'logoText': logoText
        }).then((res) => {
          console.log(res)
        }).catch((err) => {
          console.log(err)
        })
      },
      _clearSearchedList() {
        this.searchedList = []
      }
    }
  }
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
  @import '~common/stylus/variable.styl'
  @import '~common/stylus/mixin.styl'

  .conf-form
    margin: 10px 0
    width: 100%
    min-height: 430px
    color: #333
    font-size: $font-size-medium
    .require-prefix
      position: absolute
      margin-top: 12px
      margin-left: -10px
      color: red
    input[type='text']
      width: 260px
      height: 36px
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
        // box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6)
    .form-item
      min-height: 50px
      margin-bottom: 10px
      .lbl
        margin-right: 20px
      .conf-types
        display: inline-block
        vertical-align: top
        .conf-type
          margin-bottom: 20px
          .text
            vertical-align: middle
            cursor: pointer
          input
            vertical-align: middle
    .title
      line-height: 50px
      font-size: $font-size-medium-x
      font-weight: 600
      vertical-align: middle
    .conf-info
      float: left
      width: 50%
      clear-fix()
    .conf-members
      overflow: hidden
      min-height: 380px
      .search-wrapper
        margin-bottom: 5px
      .search
        padding-right:36px
      .icon
        vertical-align: middle
        color: #cdced3
        font-size: 14px
        cursor: pointer
        &:hover
          color: $color-text-highlight
        &.icon-close
          position: absolute
          margin-left: -25px
          margin-top: 12px
        &.icon-add
          font-size: 16px
          margin-left: 6px
        &.icon-radio-checked
          color: $color-text-highlight
        &.icon-record
          color: #3c78e6
        &.icon-record, &.icon-people
          font-size: 16px
          left: 6px
        &.icon-people:hover
          color: #cdced3
      .ul-list
        width: 260px
        box-sizing: border-box
        background-color: #fff
        border: 1px solid #EAEEF3
        border-radius: 3px
        overflow:auto
        color: #cdced3
        .item
          padding-left: 6px
          line-height: 30px
          border-bottom: 1px solid #ddd
          cursor: pointer
          text-ellipsis()
          .icon
            position: absolute
            margin-top: 8px
            right: 4px
          &:hover
            background-color: #EAEEF3
        &.members
          position: relative
          height:180px
          .item
            padding-left:30px
        &.search-result
          position: absolute
          max-height: 280px
          z-index: 1
          border:1px solid #c6c6c6
          border-top-left-radius: 0
          border-top-right-radius: 0
    .form-oper
      height: 50px
      line-height: 50px
      text-align: left
      margin-left: 50%
      .btn
        width: 80px
        line-height: 35px
        text-align: center
        background-color: #fcfafb
        border: 1px solid #969696
        border-radius: 20px
        // font-weight:800
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
