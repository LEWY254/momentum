import {MDXEditor,type MDXEditorMethods,headingsPlugin,quotePlugin,listsPlugin,thematicBreakPlugin,toolbarPlugin,imagePlugin,linkPlugin,UndoRedo,tablePlugin,codeMirrorPlugin,sandpackPlugin,markdownShortcutPlugin,searchPlugin,} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import "Editor.css"
import {useState, useRef} from "react"
import {db} from "@/lib/store/db.ts"
import {useLiveQuery} from "dexie-react-hooks"
import {v4 as randId} from "uuid"
import {type Note} from "@/lib/store/db.ts"
const mdxRef=useRef<MDXEditorMethods>(null)

export default function Editor(){
  async function loadNotes():Promise<Note[]>{
    let notes=useLiveQuery(()=>db.Notes.toArray())
    return notes?notes:[]
  }
    return(
        <>
        <div className="editor-container">
            <p>Editor</p>
            <MDXEditor
            contentEditableClassName="editor-styles"
            className="tool-bar-styles"
            ref={mdxRef}
            markdown="#"
            plugins={
                [headingsPlugin(),
                  quotePlugin(),
                  listsPlugin(),
                  thematicBreakPlugin(),
                  toolbarPlugin(),
                  imagePlugin(),
                  linkPlugin(),
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
  insert:(text:string):void=>{mdxRef.current?.insertMarkdown},
  set:(text:string):void=>{mdxRef.current?.setMarkdown(text)},
  get:()=>{mdxRef.current?.getMarkdown()},
  save:()=>{
    await db.Notes.add({
    uuid(),MD.get(),{new Date(),new Date()}
  })}
}

function saveNote(){}
function insertNote(){}
function setNote(){}
function getNote(){}
