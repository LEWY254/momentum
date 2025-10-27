import Dexie,{EntityTable} from "dexie"

export interface MetaData{
 date_created: Date(),
 date_updated: Date()
}
export interface Note{
  note_id:string,
  note_content:string
  metadata:metadata
}

const db=new Dexie("momentumDB") as Dexie & {
  Notes: EntityTable<id,Note>
}

db.version(1).stores({
  Notes:"++id,note_id,note_content,metadata"
})

export {db}
