import { PLAY_MODE } from "@/assets/js/constant"

const state = {
  //播放列表
  sequenceList: [],
  //真实播放列表
  playList: [],
  playing: false,
  playMode: PLAY_MODE.sequence,
  currentIndex: 0,
  fullScreen: false,
}

export default state
