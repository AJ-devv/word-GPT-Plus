import { createApp } from 'vue'
import App from './App.vue'
import { i18n } from './i18n'
import router from './router'
import ElementUI from 'element-plus'
import 'element-plus/dist/index.css'

window.Office.onReady(() => {
  const app = createApp(App)

  const debounce = <T extends (...args: any[]) => void>(
    fn: T,
    delay = 300
  ): T => {
    let timer: ReturnType<typeof setTimeout>
    return ((...args: any[]) => {
      clearTimeout(timer)
      timer = setTimeout(() => fn(...args), delay)
    }) as T
  }

  const _ResizeObserver = window.ResizeObserver
  window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
    constructor(callback: ResizeObserverCallback) {
      callback = debounce(callback, 16)
      super(callback)
    }
  }
  ;(globalThis as any).handleGptComment = async () => {
    await Word.run(async context => {
      const selection = context.document.getSelection()
      selection.load('text')
      await context.sync()

      const selectedText = selection.text

      if (!selectedText || selectedText.trim() === '') {
        console.log('No text selected.')
        return
      }

      const comment = 'GPT suggests reviewing this clause.'
      selection.insertComment(comment)
      await context.sync()
    })
  }

  app.use(i18n)
  app.use(router)
  app.use(ElementUI)
  app.mount('#app')
})
