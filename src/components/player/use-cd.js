import { computed, ref, watch } from "vue";
import { useStore } from "vuex";

export default function useCd() {
  const store = useStore()
  const playing = computed(()=> store.state.playing)

  const cdRef = ref(null)
  const cdImageRef = ref(null)

  //暂停时不旋转
  const cdCls = computed(()=> {
    return playing.value? 'playing' : ''
  })

  watch(playing,(newPlaying)=>{
    if(!newPlaying) {
      //暂停时同步cd旋转角度
      syncTransform(cdRef.value,cdImageRef.value)
    }
  })

  //实现cd旋转同步
  function syncTransform(wrapper,inner) {
    //外层旋转角度
    const wrapperTransfrom = getComputedStyle(wrapper).transform
    //内层图片旋转角度
    const innerTransfrom = getComputedStyle(inner).transform
    //同步至外层
    wrapper.style.transform = wrapperTransfrom === 'none' ? innerTransfrom : innerTransfrom.concat('',wrapperTransfrom)
  }

  return {
    cdCls,
    cdRef,
    cdImageRef
  }
}
