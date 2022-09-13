<template>
  <div class="music-list">
    <div class="back" @click="goBack">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <div class="bg-image" :style="bgImageStyle" ref="bgImage">
      <div class="play-btn-wrapper" :style="playBtnStyle">
        <div class="play-btn" v-show="songs.length > 0" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" :style="filterStyle"></div>
    </div>
    <scroll
      class="list"
      :style="scrollStyle"
      v-loading="loading"
      v-no-result="noResult"
      :probe-type="3"
      @scroll="onScroll"
    >
      <div class="song-list-wrapper">
        <song-list :songs="songs" @select="selectItem"></song-list>
      </div>
    </scroll>
  </div>
</template>

<script>
import SongList from "@/components/base/song-list/song-list";
import Scroll from "@/components/base/scroll/scroll";
import { mapActions } from "vuex";

const RESERVED_HEIGHT = 40;

export default {
  name: "music-list",
  components: {
    SongList,
    Scroll,
  },
  props: {
    songs: {
      type: Array,
      default: [],
    },
    title: String,
    pic: String,
    loading: Boolean,
    noResultText: {
      type: String,
      default: "抱歉，没有找到可播放的歌曲",
    },
  },
  data() {
    return {
      imageHeight: 0,
      scrollY: 0,
      maxTranslateY: 0,
    };
  },
  computed: {
    noResult() {
      return !this.loading && !this.songs.length;
    },
    bgImageStyle() {
      const scrollY = this.scrollY;
      let zIndex = 0;
      let paddingTop = "70%";
      let height = 0;
      let tanslateZ = 0;

      if (scrollY > this.maxTranslateY) {
        zIndex = 10;
        paddingTop = 0;
        height = `${RESERVED_HEIGHT}px`;
        tanslateZ = 1;
      }

      let scale = 1;
      if (scrollY < 0) {
        scale = 1 + Math.abs(scrollY / this.imageHeight);
      }

      return {
        zIndex,
        paddingTop,
        height,
        backgroundImage: `url(${this.pic})`,
        transform: `scale(${scale})translateZ(${tanslateZ}px)`,
      };
    },
    scrollStyle() {
      return {
        top: `${this.imageHeight}px`,
      };
    },
    filterStyle() {
      let blur = 0;
      const scrollY = this.scrollY;
      const imageHeight = this.imageHeight;
      if (scrollY >= 0) {
        blur =
          Math.min(this.maxTranslateY / imageHeight, scrollY / imageHeight) *
          20;
      }

      return {
        backdropFilter: `blur(${blur}px)`,
      };
    },
    playBtnStyle() {
      let display = "";
      if (this.scrollY >= this.maxTranslateY) {
        display = "none";
      }
      return { display };
    },
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight;
    //可滚动最大距离
    this.maxTranslateY = this.imageHeight - RESERVED_HEIGHT;
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    onScroll(pos) {
      this.scrollY = -pos.y;
    },
    selectItem({ song, index }) {
      this.selectPlay({
        list: this.songs,
        index,
      });
    },
    random() {
      console.log("随机播放");
      this.randomPlay(this.songs);
    },
    ...mapActions(["selectPlay", "randomPlay"]),
  },
};
</script>

<style lang="scss" scoped>
.music-list {
  position: relative;
  height: 100%;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 20;
    transform: translateZ(2px);
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    z-index: 20;
    width: 80%;
    transform: translateZ(2px);
    @include no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }

  .bg-image {
    position: relative;
    width: 100%;
    transform-origin: top;
    background-size: cover;
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
    .play-btn {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 20px;
      border: 1px solid $color-theme;
      padding: 10px 20px;
      border-radius: 10px;
      font-size: 14px;
      color: $color-theme;
      z-index: 999;

      .icon-play {
        vertical-align: middle;
      }

      span {
        margin-left: 5px;
        vertical-align: middle;
      }
    }
  }
  .list {
    position: absolute;
    bottom: 0;
    width: 100%;
    // background: $color-background;
    .song-list-wrapper {
      padding: 20px 30px;
      background: $color-background;
    }
  }
}
</style>
