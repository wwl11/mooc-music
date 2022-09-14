import { get } from "./base"

//获取歌曲
export function processSongs(songs) {
  if(!songs.length) {
    return Promise.resolve(songs)
  }

  return get('/api/getSongsUrl',{
    mid: songs.map((song)=>{
      return song.mid
    })
  }).then((result)=>{
    const map = result.map
    return songs.map((song)=>{
      song.url = map[song.mid]
      return song
    }).filter((song)=>{
      //过滤掉无法播放的url
      return song.url.indexOf('vkey')>-1
    })
  })
}


const lyricMap = {}
//获取歌词
export function getLyric(song) {
  //判断该歌曲是否已缓存歌词
  if(song.lyric) {
    return Promise.resolve(song.lyric)
  }
  const mid = song.mid
  const lyric = lyricMap[mid]
  if(lyric) {
    return Promise.resolve(lyric)
  }

  return get('/api/getLyric',{
    mid
  }).then((result)=>{
    const lyric = result? result.lyric : '[00:00:00]该歌曲暂时无法获取歌词'
    lyricMap[mid] = lyric
    return lyric
  })
}
