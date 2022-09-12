import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//全局引入图片懒加载
import lazyPlugin from 'vue3-lazy'
//全局引入自定义加载指令
import loadingDirective from './components/base/loading/directive'
import noResultDirective from './components/base/no-result/directive'

// 引入全局样式文件
import '@/assets/scss/index.scss'

createApp(App).use(store).use(router).use(lazyPlugin,{
  loading: require('@/assets/img/default.png')
}).directive('loading',loadingDirective).directive('no-result',noResultDirective).mount('#app')
