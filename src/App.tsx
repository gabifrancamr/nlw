import logo from './assets/Logo-nlw.svg'
import { NoteCard } from './components/Note-card'
import { NewNoteCard } from './components/New-note-card'
import { ChangeEvent, useState } from 'react'

interface Note {
  id: string
  date: Date
  content: string
}

export function App() {
  const [search, setSearch] = useState('')

  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem('notes')

    if (notesOnStorage) {
      return JSON.parse(notesOnStorage)
    } else {
      return []
    }
  })

  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    }

    const notesArray = [...notes, newNote]

    setNotes(notesArray)

    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    const query = e.target.value
    setSearch(query)
  }

  const filteredNotes =
    search !== ''
      ? notes.filter((note) =>
          note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
        )
      : notes

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
      <img src={logo} alt="logo nlw expert" />
      <form className="w-full">
        <input
          onChange={handleSearch}
          type="text"
          placeholder="Busque suas notas..."
          className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500"
        />
      </form>

      <div className="h-px bg-slate-700" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  auto-rows-[250px]">
        <NewNoteCard onNoteCreated={onNoteCreated} />

        {filteredNotes.map((note) => {
          return <NoteCard key={note.id} note={note}></NoteCard>
        })}
      </div>
    </div>
  )
}
