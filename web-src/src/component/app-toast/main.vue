<template>
  <teleport to="body">
    <transition name="fade">
      <div v-show="visible" class="toast">{{ msg }}</div>
    </transition>
  </teleport>
</template>

<style lang="scss" scoped>
.toast {
  background-color: rgba(0, 0, 0, 0.7);
  padding: 10px 30px;
  font-size: 16px;
  color: #fff;
  position: fixed;
  left: 50%;
  top: 20%;
  z-index: 999;
  border-radius: 4px;
  text-align: center;
  transform: translateX(-50%);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s, transform 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-100px);
}
</style>

<script>
import { defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
  setup() {
    const state = reactive({
      msg: '',
      visible: false,
    })
    let tick = null
    function show(msg = '', duration = 2.5) {
      clear()
      state.msg = msg
      state.visible = true
      tick = setTimeout(() => {
        hide()
      }, duration * 1000)
    }
    function hide() {
      clearTimeout(tick)
      state.visible = false
    }
    function clear() {
      clearTimeout(tick)
      tick = null
    }
    return {
      ...toRefs(state),
      show,
      hide,
    }
  },
})
</script>