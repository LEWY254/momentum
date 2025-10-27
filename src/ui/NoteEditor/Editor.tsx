import {MDXEditor,MDXEditorMethods,headingsPlugin,quotePlugin,listsPlugin,thematicBreakPlugin,toolbarPlugin,imagePlugin,linkPlugin,UndoRedo,tablePlugin,codeMirrorPlugin,sandpackPlugin,markdownShortcutPlugin,searchPlugin} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import "Editor.css"
import {useState, useRef} from "react"
import {db} from "@/lib/store/db.ts"
import {useLiveQuery} from "dixie"
import {v4 as randId} from "uuid"
const mdxRef=useRef<MDXEditorMethods>(null)
export default function Editor(){
  async function loadNotes(void):string{
    let notes=useLiveQuery(()=>db.Notes.toArray())
    return JSON.parse(notes) 
  }
    return(
        <>
        <div className="editor-container">
            <p>Editor</p>
            <MDXEditor
            contentEditableClassName="editor-styles"
            ClassName="tool-bar-styles"
            ref={mdxRef}
            markdown=loadNotes().note_content 
            plugins={
                [headingsPlugin(),
                  quotePlugin(),
                  listsPlugin(),
                  thematicBreakPlugin(),
                  toolbarPlugin(),
                  imagePlugin(),
                  linkPlugin(),
                  UndoRedo(),
                  tablePlugin()
                  ,codeMirrorPlugin()
                  ,sandpackPlugin()
                  ,markdownShortcutPlugin()
                  ,searchPlugin()
                ]
                }>
            </MDXEditor>
        </div>
        </>
    )
}

const MD={
  insert:(text:string):void=>{mdxRef.current?.insertMarkdown}
  set:(text:string):void=>{mdxRef.current?.setMarkdown(text)}
  get:(void):string=>{mdxRef.current?.getMarkdown()}
  save:async(void){await db.Notes.add({
    uuid(),MD.get(),{new Date(),new Date()}
  })}
}

