import BScroll from "better-scroll";
import  ObserveDom  from "@better-scroll/observe-dom";

import { onMounted,onUnmounted, ref } from "vue";

BScroll.use(ObserveDom)

export default function useScroll(warpperRef,options){
  const scroll = ref(null)

  onMounted(()=>{
    scroll.value = new BScroll(warpperRef.value,{
      observeDOM:true,
      ...options
    })
  })

  onUnmounted(()=>{
    scroll.value.destroy()
  })
}
