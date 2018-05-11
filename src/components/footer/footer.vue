<template>
  <footer class='footer'>
    <ul class='menu'>
      <router-link tag='li'
                   class='item'
                   :key='index'
                   :to='item.path'
                   @click.native="selectItem(item)"
                   v-for='(item,index) in menuList'>
        <span class='flag'></span>
        <span class='count' v-if="item.showCount">{{item.confCount}}</span>
        <div class='icon-wrapper'>
          <i class='icon' :class='item.iconClass'></i>
        </div>
        <span class='text'>{{item.text}}</span>
      </router-link>
    </ul>
  </footer>
</template>

<script type='text/ecmascript-6'>
  export default {
    props: {
      confCounts: {
        type: Array,
        default: function() {
          return []
        }
      }
    },
    data() {
      return {
        menuList: [ {
          path: '/create',
          text: '创建新转播',
          iconClass: 'icon-xinjianhuiyi'
        }, {
          path: '/one2one',
          text: '一对一转播',
          iconClass: 'icon-people',
          showCount: true,
          confCount: 0,
          confType: 1
        }, {
          path: '/one2many',
          text: '一对多转播',
          iconClass: 'icon-duoren',
          showCount: true,
          confCount: 0,
          confType: 2
        }, {
          path: '/many2many',
          text: '多对多转播',
          iconClass: 'icon-qunzuduoren',
          showCount: true,
          confCount: 0,
          confType: 3
        }, {
          path: '/push2third/false',
          text: '推送第三方',
          iconClass: 'icon-upload'
        }, {
          path: '/record/true',
          text: '录像管理',
          iconClass: 'icon-record',
          disabled: true,
          linkUrl: 'http://www.baidu.com',
          linkTitle: 'MediaSite系统'
        }, {
          path: '/link2or1/true',
          text: '连接OR1.NET',
          iconClass: 'icon-yun',
          disabled: true,
          linkUrl: 'http://61.151.156.60:8400/kscc/',
          linkTitle: 'OR1.NET系统'
        }
        ]
      }
    },
    watch: {
      confCounts() {
        this.$set(this.menuList[1], 'confCount', this.confCounts[0].confCount)
        this.$set(this.menuList[2], 'confCount', this.confCounts[1].confCount)
        this.$set(this.menuList[3], 'confCount', this.confCounts[2].confCount)
      }
    },
    methods: {
      selectItem(item) {
        this.$emit('routerChange', item)
      }
    }
  }
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
  @import '~common/stylus/variable.styl'

  .footer
    position: fixed
    bottom: 0
    left: $global-gap = 100px
    right: $global-gap = 100px
    min-width: 600px
    border-top: 3px solid $color-border-l
    background: $color-base-background
    @media screen and (min-width: 1367px) and (max-width: 1480px)
      left: $global-gap
      right: $global-gap
    @media screen and (min-width: 1481px) and (max-width: 1919px)
      left: $global-gap-x
      right: $global-gap-x
    @media screen and (min-width: 1920px)
      left: $global-gap-xx
      right: $global-gap-xx
    .menu
      margin: 15px 0
      display: flex
      justify-content: space-between
      height: 80px;
      .item
        position: relative
        display: flex
        flex-direction: column
        align-content: center
        margin: 0 25px
        min-width: 100px
        height: 100%;
        text-align: center
        cursor: pointer
        .icon-wrapper
          flex: 1;
          margin-top: 15px
          .icon
            padding: 12px
            font-size: $font-size-large-icon
            color: $color-text-d
            background-color: $color-normal-background
            border: 1px solid $color-border-d
            border-radius: 100%
        .text
          font-size: $font-size-medium-x
          font-weight: 500
          color: $color-text-d
        .count
          position: absolute
          right: 14px
          top: 5px
          width: 16px
          height: 16px
          line-height: 16px
          font-size: 12px
          color: #fff
          background: #15d273
          border-radius: 100%
        .flag
          position: absolute
          top: -18px
          left: 50%
          margin-left: -25px
          &:before
            display: none
            content: ''
            position: absolute
            top: 3px
            left: 20px
            width: 1px
            height: 5px
            border: 4px solid transparent
            border-top: 7px solid #3c78e6
            transition: all 0.3s ease
        .text, .icon, .flag
          transition: all 0.3s ease
        &.router-link-active, &:hover
          .icon
            color: $color-text
            background-color: $color-highlight-background
            border: 1px solid transparent
            box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6)
          .text
            color: $color-text-highlight
        &.router-link-active
          .flag
            width: 50px
            height: 3px
            background: #3c78e6
            &:before
              display: inline-block
</style>
