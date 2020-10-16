
import { createApp, ref, h } from 'vue'
import MainToast from './main.vue'

let app = ref(null)
function createTeleport() {
  if (app.value) return app.value
  createApp({
    setup: () => ({ app }),
    render: () => h(MainToast, { ref: 'app' })
  }).mount(document.createElement('div'))
  return app.value
}

function show(msg) {
  createTeleport().show(msg)
}

function hide(msg) {
  createTeleport().hide()
}


export default { show, hide }