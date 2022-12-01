import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//全局引入图片懒加载
import lazyPlugin from 'vue3-lazy'
//全局引入自定义加载指令
import loadingDirective from './components/base/loading/directive'
import noResultDirective from './components/base/no-result/directive'
import { PLAY_KEY,FAVORITE_KEY } from './assets/js/constant'
import { load, saveAll } from '@/assets/js/array-store'
import { processSongs } from '@/service/song'


// 引入全局样式文件
import '@/assets/scss/index.scss'

//更新收藏歌单和历史播放里的歌曲的url
const favoriteSongs = load(FAVORITE_KEY)
if (favoriteSongs.length > 0) {
  processSongs(favoriteSongs).then((songs) => {
    store.commit('setFavoriteList', songs)
    saveAll(songs, FAVORITE_KEY)
  })
}

const historySongs = load(PLAY_KEY)
if (historySongs.length > 0) {
  processSongs(historySongs).then((songs) => {
    store.commit('setPlayHistory', songs)
    saveAll(songs, PLAY_KEY)
  })
}

createApp(App).use(store).use(router).use(lazyPlugin,{
  loading: require('@/assets/img/default.png')
}).directive('loading',loadingDirective).directive('no-result',noResultDirective).mount('#app')
