<template>
  <div class="loading">
    <div class="loading-content">
      <img src="./loading.gif" width="24" height="24" alt="" />
      <p class="desc">{{ title }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "loading",
  data() {
    return {
      title: "正在载入...",
    };
  },
  methods: {
    setTitle(title) {
      this.title = title;
    },
  },
};
</script>

<style lang="scss" scoped>
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  .loading-content {
    text-align: center;
    .desc {
      line-height: 20px;
      font-style: $font-size-small;
      color: $color-text-l;
    }
  }
}
</style>
