<template>
  <teleport to="body">
    <transition name="fade">
      <div v-show="visible" class="toast">{{ msg }}</div>
    </transition>
  </teleport>
</template>

<style lang="scss" scoped>
.toast {
  background-color: rgba(0, 0, 0, 0.6);
  padding: 8px 20px;
  font-size: 14px;
  color: #fff;
  position: fixed;
  left: 50%;
  top: 40px;
  z-index: 999;
  border-radius: 4px;
  text-align: center;
  transform: translateX(-50%);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity ease-out 0.1s, transform ease-out 0.1s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -30px);
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
    function show(msg = '', duration = 2) {
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