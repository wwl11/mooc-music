<template>
  <div class="player">
    <div class="normal-player" v-show="fullScreen">
      <template v-if="currentSong">
        <div class="background">
          <img :src="currentSong.pic" alt="" />
        </div>
        <div class="top">
          <div class="back" @click="goBack">
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{ currentSong.name }}</h1>
          <h2 class="subtitle">{{ currentSong.singer }}</h2>
        </div>
        <div class="bottom">
          <div class="operators">
            <div class="icon i-left">
              <i :class="modeIcon" @click="changeMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i :class="playIcon" @click="togglePlay"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i
                @click="toggleFavorite(currentSong)"
                :class="getFavotiteIcon(currentSong)"
              ></i>
            </div>
          </div>
        </div>
      </template>
    </div>
    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="ready"
      @error="error"
    ></audio>
  </div>
</template>

<script>
import { computed, watch, ref } from "@vue/runtime-core";
import { useStore } from "vuex";
import useMode from "./use-mode.js";
import useFavorite from "./use-favorite";

export default {
  name: "player",
  setup() {
    //data
    const store = useStore();
    const songReady = ref(false);

    //vuex
    const fullScreen = computed(() => store.state.fullScreen);
    const currentSong = computed(() => store.getters.currentSong);
    const playing = computed(() => store.state.playing);
    const currentIndex = computed(() => store.state.currentIndex);

    // hooks
    const { modeIcon, changeMode } = useMode();

    const { getFavotiteIcon, toggleFavorite } = useFavorite();

    // computed
    const playList = computed(() => store.state.playList);

    const playIcon = computed(() => {
      return playing.value ? "icon-pause" : "icon-play";
    });

    const disableCls = computed(() => {
      return songReady.value ? "" : "disable";
    });

    const audioRef = ref(null);

    //watch
    watch(currentSong, (newSong) => {
      if (!newSong.id || !newSong.url) {
        return;
      }
      songReady.value = false;

      const audioEl = audioRef.value;
      audioEl.src = newSong.url;
      audioEl.play();
    });

    watch(playing, (newPlaying) => {
      if (!songReady.value) {
        return;
      }
      const audioEl = audioRef.value;
      newPlaying ? audioEl.play() : audioEl.pause();
    });

    //methods
    function goBack() {
      store.commit("setFullScreen", false);
    }

    function togglePlay() {
      if (!songReady.value) {
        return;
      }
      store.commit("setPlayingState", !playing.value);
    }

    function pause() {
      if (!songReady.value) {
        return;
      }
      store.commit("setPlayingState", false);
    }

    function prev() {
      const list = playList.value;
      if (!songReady.value || !list.length) {
        return;
      }

      if (list.length === 1) {
        loop();
      } else {
        let index = currentIndex.value - 1;
        if (index === -1) {
          index = list.length - 1;
        }
        store.commit("setCurrentIndex", index);
        if (!playing.value) {
          store.commit("setPlayingState", true);
        }
      }
    }

    function next() {
      const list = playList.value;

      if (!songReady.value || !list.length) {
        return;
      }

      if (list.length === 1) {
        loop();
      } else {
        let index = currentIndex.value + 1;
        if (index === list.length) {
          index = 0;
        }
        store.commit("setCurrentIndex", index);
        if (!playing.value) {
          store.commit("setPlayingState", true);
        }
      }
    }

    //循环播放
    function loop() {
      const audioEl = audioRef.value;
      audioEl.currentTime = 0;
      audioEl.play();
    }

    function ready() {
      if (songReady.value) {
        return;
      }
      songReady.value = true;
    }

    function error() {
      songReady.value = true;
    }

    return {
      fullScreen,
      currentSong,
      audioRef,
      goBack,
      playIcon,
      togglePlay,
      pause,
      prev,
      next,
      ready,
      disableCls,
      error,
      modeIcon,
      changeMode,
      getFavotiteIcon,
      toggleFavorite,
    };
  },
};
</script>

<style lang="scss" scoped>
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
      img {
        width: 100%;
        height: 100%;
      }
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
      }
      .icon-back {
        display: block;
        padding: 9px;
        font-size: $font-size-large-x;
        color: $color-theme;
        transform: rotate(-90deg);
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .operators {
        display: flex;
        align-items: center;

        .icon {
          flex: 1;
          color: $color-theme;

          &.disable {
            color: $color-theme-d;
          }

          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }

        .i-center {
          padding: 0 20px;
          text-align: center;

          i {
            font-size: 40px;
          }
        }

        .i-right {
          text-align: left;
        }

        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
  }
}
</style>
