<template>
  <div class="tabbar">
    <router-link
      class="tabbar-item"
      v-for="tab in tabs"
      :key="tab.pagePath"
      :to="tab.pagePath"
    >
      <span class="tab-link">{{ tab.text }}</span>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'my-tab',
  data() {
    return {
      tabs: [
        { text: '推荐', pagePath: '/recommend' },
        { text: '歌手', pagePath: '/singer' },
        { text: '排行', pagePath: '/top-list' },
        { text: '搜索', pagePath: '/search' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
  .tabbar {
  display: flex;
  .tabbar-item {
    flex: 1;
    text-align: center;
    line-height: 30px;

    > span {
      display: inline-block;
      height: 100%;
      padding: 0 2px;
      color: $color-text-d;
      font-size: $font-size-medium;
      &.active {
        position: relative;
        color: $color-theme;
        &::after {
          position: absolute;
          content: "";
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: $color-theme;
        }
      }
    }
  }
}
</style>
