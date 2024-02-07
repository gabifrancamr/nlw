import logo from './assets/Logo-nlw.svg'
import { NoteCard } from './components/Note-card'
import { NewNoteCard } from './components/New-note-card'
import { useContext } from 'react'
import { NotesContext } from './context/NotesContext'

export function App() {
  const { notes } = useContext(NotesContext)
  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6">
      <img src={logo} alt="logo nlw expert" />
      <form className="w-full">
        <input
          type="text"
          placeholder="Busque suas notas..."
          className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500"
        />
      </form>

      <div className="h-px bg-slate-700" />

      <div className="grid grid-cols-3 gap-6  auto-rows-[250px]">
        <NewNoteCard />

        <NoteCard
          note={{
            id: 'jdhjdsj',
            date: new Date(),
            content: 'Hello World',
          }}
        />

        {notes.map((item) => (
          <NoteCard
            key={item.note.id}
            note={{
              id: item.note.id,
              date: item.note.date,
              content: item.note.content,
            }}
          />
        ))}
      </div>
    </div>
  )
}
