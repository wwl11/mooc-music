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
  name: "my-tab",
  data() {
    return {
      tabs: [
        { text: "推荐", pagePath: "/recommend" },
        { text: "歌手", pagePath: "/singer" },
        { text: "排行", pagePath: "/top-list" },
        // { text: "搜索", pagePath: "/search" },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.tabbar {
  display: flex;
  height: 44px;
  line-height: 44px;
  font-size: $font-size-medium;

  .tabbar-item {
    flex: 1;
    text-align: center;

    .tab-link {
      padding-bottom: 5px;
      color: $color-text-l;
    }

    &.router-link-active {
      .tab-link {
        color: $color-theme;
        border-bottom: 2px solid $color-theme;
      }
    }
  }
}
</style>
