import BScroll from "better-scroll";
import  ObserveDom  from "@better-scroll/observe-dom";

import { onMounted,onUnmounted, ref ,onActivated,onDeactivated} from "vue";

BScroll.use(ObserveDom)

export default function useScroll(warpperRef,options,emit){
  const scroll = ref(null)

  onMounted(()=>{
    const scrollVal = scroll.value = new BScroll(warpperRef.value,{
      observeDOM:true,
      ...options
    })

    //判断是否传入probeType值 不传入则为0 没有滚动事件
    if(options.probeType>0){
      scrollVal.on('scroll',(pos)=>{
        //通过事件派发
        emit('scroll',pos)
      })
    }
  })

  onUnmounted(()=>{
    scroll.value.destroy()
  })

  onActivated(()=>  {
    scroll.value.enable()
    scroll.value.refresh()
  })

  onDeactivated(()=>{
    scroll.value.disable()
  })

  return scroll
}
