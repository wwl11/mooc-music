<template>
  <div class="player" v-show="playList.length">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
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
          <div
            class="middle"
            @touchstart.prevent="onMiddleTouchStart"
            @touchmove.prevent="onMiddleTouchMove"
            @touchend.prevent="onMiddleTouchEnd"
          >
            <div class="middle-l" :style="middleLStyle">
              <div class="cd-wrapper" ref="cdWrapperRef">
                <div class="cd" ref="cdRef">
                  <img
                    :src="currentSong.pic"
                    class="image"
                    :class="cdCls"
                    ref="cdImageRef"
                  />
                </div>
              </div>
              <div class="playing-lyric-wrapper">
                <div class="playing-lyric">{{ playingLyric }}</div>
              </div>
            </div>
            <scroll class="middle-r" ref="lyricScrollRef" :style="middleRStyle">
              <div class="lyric-wrapper">
                <div v-if="currentLyric" ref="lyricListRef">
                  <p
                    class="text"
                    :class="{ current: currentLineNum === index }"
                    v-for="(line, index) in currentLyric.lines"
                    :key="line.num"
                  >
                    {{ line.txt }}
                  </p>
                </div>
                <div class="pure-music" v-show="pureMusicLyric">
                  <p>{{ pureMusicLyric }}</p>
                </div>
              </div>
            </scroll>
          </div>

          <div class="bottom">
            <div class="dot-wrapper">
              <span
                class="dot"
                :class="{ active: currentShow === 'cd' }"
              ></span>
              <span
                class="dot"
                :class="{ active: currentShow === 'lyric' }"
              ></span>
            </div>
            <div class="progress-wrapper">
              <span class="time time-l">{{ formatTime(currentTime) }}</span>
              <div class="progress-bar-wrapper">
                <progress-bar
                  ref="barRef"
                  :progress="progress"
                  @progress-changing="onProgressChanging"
                  @progress-change="onProgressChange"
                ></progress-bar>
              </div>
              <span class="time time-r">{{
                formatTime(currentSong.duration)
              }}</span>
            </div>
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
                  :class="getFavoriteIcon(currentSong)"
                ></i>
              </div>
            </div>
          </div>
        </template></div
    ></transition>

    <mini-player :progress="progress" :togglePlay="togglePlay"></mini-player>
    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    ></audio>
  </div>
</template>

<script>
import { computed, watch, ref } from "@vue/runtime-core";
import { useStore } from "vuex";
import useMode from "./use-mode.js";
import useFavorite from "./use-favorite";
import progressBar from "./progress-bar.vue";
import { formatTime } from "@/assets/js/util";
import { PLAY_MODE } from "@/assets/js/constant";
import useCd from "./use-cd.js";
import useLyric from "./use-lyric";
import scroll from "../base/scroll/scroll.vue";
import useMiddleInteractive from "./use-middle-interactvie";
import miniPlayer from "./mini-player.vue";
import { nextTick } from "@vue/runtime-core";
import useAnimation from "./use-animation";
import usePlayHistory from "./use-play-history";

export default {
  name: "player",
  components: {
    progressBar,
    scroll,
    miniPlayer,
  },
  setup() {
    //data
    const store = useStore();
    const songReady = ref(false);
    const currentTime = ref(0);
    let progressChanging = false;
    const barRef = ref(null);

    //vuex
    const fullScreen = computed(() => store.state.fullScreen);
    const currentSong = computed(() => store.getters.currentSong);
    const playing = computed(() => store.state.playing);
    const currentIndex = computed(() => store.state.currentIndex);
    const playMode = computed(() => store.state.playMode);

    // hooks
    const { modeIcon, changeMode } = useMode();

    const { getFavoriteIcon, toggleFavorite } = useFavorite();

    const { cdCls, cdRef, cdImageRef } = useCd();

    const {
      currentLyric,
      currentLineNum,
      playLyric,
      lyricScrollRef,
      lyricListRef,
      stopLyric,
      pureMusicLyric,
      playingLyric,
    } = useLyric({
      songReady,
      currentTime,
    });

    const {
      middleLStyle,
      middleRStyle,
      currentShow,
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd,
    } = useMiddleInteractive();

    const { cdWrapperRef, enter, afterEnter, leave, afterLeave } =
      useAnimation();

    const { savePlay } = usePlayHistory();

    // computed
    const playList = computed(() => store.state.playList);

    const playIcon = computed(() => {
      return playing.value ? "icon-pause" : "icon-play";
    });

    const progress = computed(() => {
      return currentTime.value / currentSong.value.duration;
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
      currentTime.value = 0;
      songReady.value = false;

      const audioEl = audioRef.value;
      audioEl.src = newSong.url;
      audioEl.play();
      store.commit("setPlayingState", true);
    });

    watch(playing, (newPlaying) => {
      if (!songReady.value) {
        return;
      }
      const audioEl = audioRef.value;
      if (newPlaying) {
        audioEl.play();
        playLyric();
      } else {
        audioEl.pause();
        stopLyric();
      }
    });

    // 监听重新打开全屏播放器 保证进度条是最新状态
    watch(fullScreen, async (newFullScreen) => {
      if (newFullScreen) {
        //因为涉及到dom的渲染 所以需要等待nextTick
        await nextTick();
        barRef.value.setOffset(progress.value);
      }
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
      }
    }

    //循环播放
    function loop() {
      const audioEl = audioRef.value;
      audioEl.currentTime = 0;
      audioEl.play();
      store.commit("setPlayingState", true);
    }

    function ready() {
      if (songReady.value) {
        return;
      }
      songReady.value = true;
      playLyric();
      savePlay(currentSong.value);
    }

    function error() {
      songReady.value = true;
    }

    function updateTime(e) {
      //正在拖拽进度条时 audio自带的改变进度条的回调不执行
      if (!progressChanging) {
        currentTime.value = e.target.currentTime;
      }
    }

    function onProgressChanging(progress) {
      //将设置的正在拖拽进度条状态设置为true
      progressChanging = true;
      currentTime.value = currentSong.value.duration * progress;
      //拖动进度条 先调用playLyric 再调用stopLyric
      //最后松开的时候再调用一次playLyric
      playLyric();
      stopLyric();
    }

    function onProgressChange(progress) {
      audioRef.value.currentTime = currentTime.value =
        currentSong.value.duration * progress;

      progressChanging = false;
      if (!playing.value) {
        store.commit("setPlayingState", true);
      }
      playLyric();
    }

    function end() {
      currentTime.value = 0;
      if (playMode.value === PLAY_MODE.loop) {
        loop();
      } else {
        next();
      }
    }

    return {
      fullScreen, //是否展开
      currentSong, //当前歌曲
      playList, //歌曲列表
      audioRef, //音频dom
      goBack, //返回方法
      playIcon, //播放或者暂停按钮图标
      togglePlay, //播放状态切换
      pause, //暂停
      prev, //切换上一首歌曲
      next, //切换下一首歌曲
      ready, //歌曲加载完毕
      disableCls, //是否禁用按钮
      error, //音频加载出错
      modeIcon, //播放歌曲模式图标
      changeMode, //切换播放歌曲模式
      getFavoriteIcon, //是否收藏图标显示
      toggleFavorite, //切换该歌曲收藏状态
      currentTime, //歌曲播放的实时进度
      progress, //歌曲播放进度百分比
      updateTime, //audio原生进度更新回调
      formatTime, //格式化时间函数
      onProgressChanging, //拖动进度条的回调
      onProgressChange, //松开进度条的回调
      end, //歌曲结束回调
      cdCls, //cd是否旋转
      cdRef, //cd内层
      cdImageRef, //cd外层
      currentLyric, //当前歌曲歌词
      currentLineNum, //当前播放的歌词行数
      lyricScrollRef, //歌词scroll
      lyricListRef, //歌词列表
      pureMusicLyric, // 纯音乐歌词
      playingLyric, // 当前播放歌词文本
      middleLStyle, // cd模块拖拽样式
      middleRStyle, // 歌词模块拖拽样式
      currentShow, // 当前显示cd还是歌词
      onMiddleTouchStart, // 中间区域点击回调
      onMiddleTouchMove, // 中间区域拖拽回调
      onMiddleTouchEnd, // 中间区域松开回调
      barRef, // 进度条dom
      cdWrapperRef,
      enter,
      afterEnter,
      leave,
      afterLeave,
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
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            img {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }
            .playing {
              animation: rotate 20s linear infinite;
            }
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;

          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;

            &.current {
              color: $color-text;
            }
          }
        }

        .pure-music {
          margin: 150px auto;
          z-index: 999;
          text-align: center;
          line-height: 32px;
          color: $color-text-l;
          font-size: $font-size-medium;
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper {
        text-align: center;
        font-size: 0;

        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;

          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }

      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0 auto;
        padding: 10px 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
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
    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.6s;
      .top,
      .bottom {
        transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }
    &.normal-enter-from,
    &.normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }
}
</style>
