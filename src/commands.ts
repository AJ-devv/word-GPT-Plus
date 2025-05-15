/// <reference types="office-js" />
;(globalThis as any).handleGptComment = async () => {
  await Word.run(async context => {
    const selection = context.document.getSelection()
    selection.load('text')
    await context.sync()

    const text = selection.text
    if (!text || text.trim() === '') {
      console.log('No text selected.')
      return
    }

    selection.insertComment('GPT suggests reviewing this clause.')
    await context.sync()
  })
}
