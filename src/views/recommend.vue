<template>
  <div class="recommend" v-loading="loading">
    <scroll class="recommend-content">
      <div>
        <div class="slider-wrapper">
          <div class="slider-content">
            <slider v-if="sliders.length" :sliders="sliders"></slider>
          </div>
        </div>
        <div class="recommend-list">
          <h1 class="list-title" v-show="!loading">热门歌单推荐</h1>
          <ul>
            <li v-for="item in albums" class="item" :key="item.id">
              <div class="icon">
                <img v-lazy="item.pic" width="60" height="60" />
              </div>
              <div class="text">
                <h2 class="name">
                  {{ item.username }}
                </h2>
                <p class="title">
                  {{ item.title }}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import { getRecommend } from "@/service/recommend";
import slider from "@/components/base/slider/slider";
import scroll from "@/components/base/scroll/scroll";

export default {
  name: "recommend",
  components: {
    slider,
    scroll,
  },
  data() {
    return {
      sliders: [],
      albums: [],
    };
  },
  computed: {
    loading() {
      return !this.sliders.length && !this.albums.length;
    },
  },
  async created() {
    const result = await getRecommend();
    this.sliders = result.sliders;
    this.albums = result.albums;
  },
};
</script>

<style lang="scss" scoped>
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  overflow: scroll;
  .recommend-content {
    height: 100%;
    overflow: hidden;
    .slider-wrapper {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 40%;
      overflow: hidden;
      .slider-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 999;
      }
    }
    .recommend-list {
      .list-title {
        line-height: 50px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }

      ul {
        .item {
          box-sizing: border-box;
          padding: 15px;
          display: flex;

          .icon > img {
            width: 60px;
            height: 60px;
          }

          .text {
            margin-left: 20px;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;

            .name {
              font-size: $font-size-medium;
            }

            .title {
              color: $color-text-d;
              font-size: $font-size-medium;
            }
          }
        }
      }
    }
  }
}
</style>
