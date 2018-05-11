<template>
  <div class="add-memeber" v-show="showFlag" @click.stop="hide">
    <div class="add-member-wrapper" @click.stop="hideSearchResult()">
      <div class="header">
        <h1 class="title">添加成员</h1>
        <div class="icon-wrapper" @click.stop="hide">
          <i class="icon icon-close"></i>
        </div>
      </div>
      <div class="content-wrapper">
        <div class="search-wrapper">
          <div class="input-wrapper">
            <label class="lbl-search" for="search">搜索成员：</label>
            <input @focus='search' v-model='searchInput' type='text' id="search" class='search' placeholder='输入设备名称进行搜索'>
            <i @click='clearSearchInpput' class='icon icon-close' v-show='searchInput'></i>
          </div>
          <ul class='ul-list search-result' v-show='searchedList.length' @click.stop>
            <li ref="searchedItem" class='item'
                :key='index'
                v-for='(item, index) in searchedList'>
                <span class='name'>{{item.name}}</span>
                <i v-if="item.id > 0" class='icon' :class="iconClass(item)" @click.stop='selectSearchedItem(item, index)'></i>
            </li>
          </ul>
        </div>
        <ul class='ul-list selected-members' @click.stop>
          <li class='item'
              :key='index'
              v-for='(item, index) in selectedMemebers'>
              <i class='icon icon-people'></i>
              <span class='name'>{{item.name}}</span>
              <i @click='delSelectedItem(index)' class='icon icon-close'></i>
          </li>
        </ul>
      </div>
      <div class="footer">
        <span class="btn cancel" @click.stop="hide">取&nbsp;&nbsp;消</span>
        <span class="btn submit" @click.stop="confirm">确&nbsp;&nbsp;认</span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {searchDevice} from 'api/device'
  const INVALID_ID = -1

  export default {
    data() {
      return {
        showFlag: false,
        searchInput: '',
        searchedList: [],
        selectedMemebers: []
      }
    },
    watch: {
      searchInput(newInput) {
        this.execSearch(newInput)
      }
    },
    methods: {
      iconClass(item) {
        if (this.selectedMemebers.length) {
          const fIndex = this._findIndex(item)
          if (fIndex !== -1) {
            return 'icon-radio-checked'
          }
        }
        return 'icon-add'
      },
      confirm() {
        const selectedMemebers = this.selectedMemebers.slice()
        this.$emit('add-confirm', selectedMemebers)
        this.showFlag = false
        this.reset()
      },
      show() {
        this.showFlag = true
      },
      hide() {
        this.showFlag = false
        this.reset()
      },
      reset() {
        this.searchInput = ''
        this.searchedList = []
        this.selectedMemebers = []
      },
      search() {
        let searchInput = this.searchInput
        this.execSearch(searchInput)
      },
      execSearch(searchInput) {
        if (searchInput) {
          let searchParam = {name: searchInput}
          searchDevice(searchParam).then((res) => {
            console.log(res)
            if (res.success) {
              this.searchedList = res.bizData.list
              if (this.searchedList.length === 0) {
                this.searchedList.push({id: INVALID_ID, name: '没有搜到相关记录'})
              }
            }
          })
        } else {
          this.searchedList = []
        }
      },
      clearSearchInpput() {
        this.searchInput = ''
      },
      hideSearchResult() {
        this.searchInput = ''
      },
      selectSearchedItem(selectedItem, index) {
        const fIndex = this._findIndex(selectedItem)
        if (fIndex === -1) {
          this.selectedMemebers.push(selectedItem)
        } else {
          this.selectedMemebers.splice(fIndex, 1)
        }
      },
      delSelectedItem(index) {
        this.selectedMemebers.splice(index, 1)
      },
      _findIndex(item) {
        const fIndex = this.selectedMemebers.findIndex((selectedItem) => {
          return selectedItem.id === item.id
        })
        return fIndex
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import '~common/stylus/mixin.styl'

  .add-memeber
    text-align: center
    font-size: $font-size-medium
    position: fixed
    z-index: 3
    top: 0
    left: 0
    right: 0
    bottom: 0
    margin-top: -110px
    text-align: center
    font-size: $font-size-medium
    background-color: rgba(150,150,150, 0.4)
    &.in-enter-active, &.in-leave-active
      transition: all .3s ease
    &.in-enter, &.in-leave-to
      opacity: 0
    .add-member-wrapper
      position: absolute
      top: 50%
      left: 50%
      min-width: 500px
      min-height: 360px
      transform: translate3d(-50%, -50%, 0)
      background-color: #fff
      border-radius: 4px
      box-shadow: 2px 2px 3px #cecece
      .header
        line-height: 40px
        overflow:hidden
        padding: 0 10px
        border-bottom: 1px solid #ddd
        .title
          float: left
        .icon-wrapper
          float: right
          line-height: 36px
          padding: 2px
          cursor:pointer
      .footer
        line-height: 39px
        padding: 10px
        border-top: 1px solid #ddd
        .btn
          display: inline-block
          line-height: normal
          width: 60px
          line-height: 24px
          margin: 0 10px
          padding: 5px
          border-radius: 3px
          border:1px solid #ddd
          cursor: pointer
          &.submit
            color: #fff
            background-color:#3c78e6
            &:hover
              background-color: #286090
              border:1px solid #3c78e6
          &.cancel:hover
            background-color: #ddd
            border:1px solid #ccc
      .content-wrapper
        padding-top: 20px
        padding-left: 50px
        height: 301px
        .input-wrapper
          text-align: left
          .lbl-search
            display: inline-block
            width: 80px
        .ul-list
          width: 260px
          margin-left: 84px
          box-sizing: border-box
          background-color: #fff
          border: 1px solid #EAEEF3
          border-radius: 3px
          overflow:auto
          color: #cdced3
          .item
            padding-left: 6px
            line-height: 30px
            text-align: left;
            border-bottom: 1px solid #ddd
            cursor: pointer
            no-wrap()
            .icon
              position: absolute
              margin-top: 8px
              padding: 0 5px
              right: 4px
            &:hover
              background-color: #EAEEF3
          &.selected-members
            position: relative
            margin-top: 20px
            height:220px
            .item
              padding-left:30px
          &.search-result
            position: absolute
            max-height: 240px
            z-index: 1
            border:1px solid #c6c6c6
            border-top-left-radius: 0
            border-top-right-radius: 0
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
          &.icon-people
            font-size: 16px
            left: 6px
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
</style>
