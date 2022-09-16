import Scroll from '../base/scroll/scroll'
import { computed, h,mergeProps, nextTick, ref, renderSlot, watch, withCtx } from 'vue'
import { useStore } from 'vuex'

//重写高阶组件实现scroll组件渲染时自动执行refresh方法

export default {
  name: 'wrap-scroll',
  props: Scroll.props,
  emits: Scroll.emits,
  render(ctx) {
    return h(Scroll,mergeProps({ref: 'scrollRef'},ctx.$props,{
      onScroll: (e)=> {
        ctx.$emit('scroll',e)
      }
    }),{
      default: withCtx(()=> {
        return [renderSlot(ctx.$slots,'default')]
      })
    })
  },
  setup(){
    const scrollRef = ref(null)
    const scroll = computed(()=> {
      return scrollRef.value.scroll
    })

    const store = useStore()
    const playList = computed(()=> store.state.playList)

    watch(playList,async ()=>{
      await nextTick()
      scroll.value.refresh()
    })

    return {
      scrollRef,
      scroll
    }
  }
}
