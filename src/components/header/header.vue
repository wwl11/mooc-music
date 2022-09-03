<template>
  <div class="header">
    <img src="./boy.png" class="icon"/>
    <h1 class="text">Chicken Music</h1>
  </div>
</template>

<script>
export default {
  name: 'm-header'
}
</script>

<style lang="scss" scoped>
  .header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    background-color: $color-background;

    .img {
      width: 30px;
    }
    .text {
      margin-left: 8px;
      color: $color-theme;
      font-size: $font-size-large;
    }
  }
</style>
