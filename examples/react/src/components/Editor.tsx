import { FC, useRef, useState } from 'react'
import type { editor } from 'monaco-editor'
import { Button } from 'antd'

export const Editor: FC = () => {
  const [editor, setEditor] = useState<editor.IStandaloneCodeEditor | null>(
    null
  )

  const monacoEl = useRef(null)

  const loadMonaco = () => {
    if (!monacoEl.current || editor) return
    import('monaco-editor').then((monaco) => {
      setEditor((editor) => {
        if (editor) return editor

        return monaco.editor.create(monacoEl.current!, {
          value: ['function x(str: string) {', '\tconsole.log("Hello world!", str);', '}'].join(
            '\n'
          ),
          language: 'typescript',
          scrollBeyondLastLine: false
        })
      })
    })
  }

  return (
    <div className="monaco-editor-container">
      <Button onClick={() => loadMonaco()}>动态加载monaco-editor</Button>
      <div ref={monacoEl}></div>
    </div>
  )
}
