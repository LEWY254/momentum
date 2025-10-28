import Dexie,{type EntityTable} from "dexie"
import {type Bubble} from "@/ui/ChatBot/chatbot.ts"
export interface MetaData{
 date_created:string;
 date_updated:string;
}
export interface Note{
  id?: number,
  note_id:string,
  note_content:string
  metadata:MetaData
}
export interface Conversation{
  id?: number,
  conversation_id:string,
  conversation_content:Bubble[]
  conversation_title:string
  metadata:MetaData
}
const db=new Dexie("momentumDB") as Dexie & {
  Notes: EntityTable<Note,"id">;
  Conversations: EntityTable<Conversation,"id">
}

db.version(1).stores({
  Notes:"++id,note_id,note_content,metadata",
  Conversations:"++id,conversation_id,conversation_content,conversation_title,metadata"
})

export {db}
