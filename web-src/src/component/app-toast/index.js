import { createVNode, render } from 'vue'
import MainToast from './main.vue'

let instance
function createTeleport() {
  if (!instance) {
    instance = createVNode(MainToast)
    render(instance, document.createElement('div'))
    document.body.appendChild(instance.el)
  }
  console.log('instance', instance)
  return instance
}

function show(msg) {
  createTeleport().component.ctx.show(msg)
}

function hide() {
  createTeleport().component.ctx.hide()
}

export default { show, hide }
