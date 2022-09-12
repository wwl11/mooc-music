<template>
  <div class="no-result">
    <div class="no-result-content">
      <div class="icon"></div>
      <p class="text">{{ title }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "no-result",
  data() {
    return {
      title: "抱歉，没有结果",
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
</style>
