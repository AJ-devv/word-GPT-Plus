import { createApp } from 'vue'
import App from './App.vue'
import { i18n } from './i18n'
import router from './router'
import ElementUI from 'element-plus'
import 'element-plus/dist/index.css'

// Setup ResizeObserver patch (both browser + Word)
const debounce = <T extends (...args: any[]) => void>(fn: T, delay = 16): T => {
  let timer: ReturnType<typeof setTimeout>
  return ((...args: any[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }) as T
}
const _ResizeObserver = window.ResizeObserver
window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    super(debounce(callback, 16))
  }
}

// 🧠 Global fallback (if Office is not available or still loading)
function bootstrapApp() {
  const app = createApp(App)
  app.use(i18n)
  app.use(router)
  app.use(ElementUI)
  app.mount('#app')
}

// ✅ Detect if Office is available and ready
if (window.Office && typeof window.Office.onReady === 'function') {
  window.Office.onReady().then(() => {
    console.log('✅ Office.js is ready. Mounting app...')
    bootstrapApp()
  }).catch(err => {
    console.error('❌ Office.onReady error:', err)
    bootstrapApp() // fallback just in case
  })
} else {
  // 🧪 Running in browser locally or Office is not available yet
  console.warn('⚠️ Office.js not detected. Mounting in browser mode.')
  bootstrapApp()
}

// 🧩 Optional: Global helper for inserting a Word comment
(globalThis as any).handleGptComment = async () => {
  try {
    await Word.run(async context => {
      const selection = context.document.getSelection()
      selection.load('text')
      await context.sync()
      if (selection.text.trim()) {
        selection.insertComment('GPT suggests reviewing this clause.')
        await context.sync()
      }
    })
  } catch (err) {
    console.warn('🛑 handleGptComment failed:', err)
  }
}
