import { computed, watch, ref } from "vue";
import { useStore } from "vuex";
import { getLyric } from "@/service/song";
import Lyric from "lyric-parser";

export default function useLyric({songReady,currentTime}) {
  const currentLyric = ref(null)
  const currentLineNum = ref(0)
  const pureMusicLyric = ref(0)
  const playingLyric = ref('')
  const lyricScrollRef = ref(null);
  const lyricListRef = ref(null);

  const store = useStore()
  const currentSong = computed(()=> store.getters.currentSong)

  watch(currentSong,async (newSong)=>{
    if(!newSong.url || !newSong.id) {
      return
    }

    stopLyric()
    currentLyric.value = null
    currentLineNum.value = 0
    pureMusicLyric.value = ''
    playingLyric.value = ''

    const lyric = await getLyric(newSong)

    //进行前端缓存 避免频繁获取同一首歌歌词
    //通过mutation来给歌曲列表中的歌曲添加歌词
    store.commit('addSongLyric',{
      song: newSong,
      lyric
    })

    //因为getLyric过程是异步的 如果在请求过程中又点击了下一首歌曲 会出现currentSong对应的歌词和获取到的歌词不对应的情况
    //此时获取的歌词没有意义 所以可以直接return
    if(currentSong.value.lyric !== lyric) {
      return
    }

    currentLyric.value = new Lyric(lyric, handleLyric)

    const hasLyric = currentLyric.value.lines.length
    if(hasLyric) {
      if(songReady.value){
        playLyric()
      }
    }else {
      console.log('纯音乐');
      playingLyric.value = pureMusicLyric.value = lyric.replace(/\[(\d{2}):(\d{2}):(\d{2})\]/g,'')
    }



  })

  function playLyric() {
    //播放歌词
    const currentLyricVal = currentLyric.value
    if(currentLyricVal) {
      //当前播放时间
      currentLyricVal.seek(currentTime.value*1000)
    }
  }

  function stopLyric() {
    //歌曲暂停歌词也暂停
    const currentLyricVal = currentLyric.value
    if(currentLyricVal) {
      currentLyricVal.stop()
    }
  }

  function handleLyric({lineNum,txt}) {
    currentLineNum.value = lineNum
    playingLyric.value = txt
    const scrollComp = lyricScrollRef.value
    const listEl = lyricListRef.value
    if(!listEl) {
      return
    }
    //当歌词播放超过5行时开始滚动
    if(lineNum > 5) {
      const lineEl = listEl.children[lineNum - 5]
      scrollComp.scroll.scrollToElement(lineEl,1000)
    }else {
      scrollComp.scroll.scrollTo(0,0,1000)
    }
  }

  return {
    currentLyric,
    currentLineNum,
    lyricScrollRef,
    lyricListRef,
    pureMusicLyric,
    playingLyric,
    playLyric,
    stopLyric
  }
}
