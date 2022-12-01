const mutations = {
  setPlayingState(state,playing) {
    state.playing = playing
  },
  setSequenceList(state,list) {
    state.sequenceList = list
  },
  setPlayList(state,list) {
    state.playList = list
  },
  setPlayMode(state,mode) {
    state.playMode = mode
  },
  setCurrentIndex(state,index) {
    state.currentIndex = index
  },
  setFullScreen(state,fullScreen) {
    state.fullScreen = fullScreen
  },
  setFavoriteList(state,list) {
    state.favoriteList = list
  },
  //给歌曲添加歌词
  addSongLyric(state,{song,lyric}){
    state.sequenceList.map((item)=>{
      if(item.mid === song.mid){
        item.lyric = lyric
      }
      return item
    })
  },
  setPlayHistory(state, songs) {
    state.playHistory = songs
  }
}

export default mutations
