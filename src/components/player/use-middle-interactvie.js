import { ref } from "vue";

export default function useMiddleInteractive() {
  const currentShow = ref('cd')
  const middleLStyle = ref(null)
  const middleRStyle = ref(null)

  const touch = {}
  let currentView = 'cd'

  function onMiddleTouchStart(e){
    touch.startX = e.touches[0].pageX
    touch.startY = e.touches[0].pageY
    touch.directionLock = ''
  }

  function onMiddleTouchMove(e) {
    //拖拽时根据拖拽程度修改currentShow
    const deltaX = e.touches[0].pageX - touch.startX
    const deltaY = e.touches[0].pageY - touch.startY

    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    //方向锁 防止切换currenShow时发生纵向滚动
    if(!touch.directionLock) {
      touch.directionLock = absDeltaX >= absDeltaY ? 'h' : 'v'
    }

    if(touch.directionLock === 'v') {
      return
    }


    const left = currentView === 'cd' ? 0 : -window.innerWidth
    const offsetWidth =Math.min(0,Math.max(-window.innerWidth,left + deltaX))
    touch.percent = Math.abs(offsetWidth/window.innerWidth)

    if(currentView === 'cd'){
      if(touch.percent > 0.2) {
        currentShow.value = 'lyric'
      }else {
        currentShow.value = 'cd'
      }
    }

    if(currentView === 'lyric') {
      if(touch.percent < 0.8) {
        currentShow.value = 'cd'
      }else {
        currentShow.value = 'lyric'
      }
    }

    middleLStyle.value = {
      opacity: 1 - touch.percent,
    }

    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px,0,0)`,
    }
  }

  function onMiddleTouchEnd() {
    //松开手指修改currentView
    let offsetWidth
    let opacity
    if(currentShow.value === 'cd'){
      currentView = 'cd'
      offsetWidth = 0
      opacity = 1
    } else {
      currentView = 'lyric',
      offsetWidth = -window.innerWidth
      opacity = 0
    }

    const duration = 300
    middleLStyle.value = {
      opacity,
      transitionDuration: `${duration}ms`
    }

    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px,0,0)`,
      transitionDuration: '${duration}ms'
    }
  }

  return {
    middleLStyle,
    middleRStyle,
    currentShow,
    onMiddleTouchStart,
    onMiddleTouchMove,
    onMiddleTouchEnd
  }
}
