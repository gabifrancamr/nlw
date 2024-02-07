import { ReactNode, createContext, useEffect, useState } from 'react'
import { NoteCardProps } from '../components/Note-card'
import { v4 as uuidv4 } from 'uuid'

interface NotesContextType {
  notes: NoteCardProps[]
  addNote: (noteText: string) => void
  deleteNote: (noteId: string) => void
}

export const NotesContext = createContext({} as NotesContextType)

interface NotesContextProviderProps {
  children: ReactNode
}

const NOTES_STORAGE_KEY = 'notesItems'

export function NotesContextProvider({ children }: NotesContextProviderProps) {
  const [notes, setNotes] = useState<NoteCardProps[]>(() => {
    const storageNoteItems = localStorage.getItem(NOTES_STORAGE_KEY)

    if (storageNoteItems) {
      return JSON.parse(storageNoteItems)
    } else {
      return []
    }
  })

  function addNote(noteText: string) {
    const newNote: NoteCardProps = {
      note: {
        id: uuidv4(),
        date: new Date(),
        content: noteText,
      },
    }

    setNotes((state) => [...state, newNote])
  }

  function deleteNote(noteId: string) {
    console.log(noteId)
    const noteExist = notes.findIndex((item) => item.note.id === noteId)

    if (noteExist >= 0) {
      const newNotes = notes.filter((item) => item.note.id !== noteId)

      setNotes(newNotes)
    }
  }

  useEffect(() => {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes))
  }, [notes])

  return (
    <NotesContext.Provider value={{ notes, addNote, deleteNote }}>
      {children}
    </NotesContext.Provider>
  )
}
