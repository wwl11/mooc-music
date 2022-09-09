<template>
  <div ref="rootRef">
    <slot></slot>
  </div>
</template>

<script>
import useScroll from "./use-scroll.js";
import { ref, defineProps, defineEmits } from "vue";

export default {
  name: "scroll",
  props: {
    click: {
      type: Boolean,
      default: true,
    },
    probeType: {
      type: Number,
      default: 0,
    },
  },
  // emits: ["scorll"],
  setup(props, { emit }) {
    const rootRef = ref(null);
    const scroll = useScroll(rootRef, props, emit);

    return {
      rootRef,
      scroll,
    };
  },
};
</script>

<style>
</style>
