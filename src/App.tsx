import logo from './assets/Logo-nlw.svg'
import { NoteCard } from './components/Note-card'
import { NewNoteCard } from './components/New-note-card'
import { ChangeEvent, useContext, useState } from 'react'
import { NotesContext } from './context/NotesContext'

export function App() {
  const [inputValue, setInputValue] = useState('')
  const { notes } = useContext(NotesContext)

  function handleChangeInput(e: ChangeEvent<HTMLInputElement>) {
    const query = e.target.value
    setInputValue(query)
  }

  const showNotes = inputValue
    ? notes.filter((note) =>
        note.content
          .toLocaleLowerCase()
          .includes(inputValue.toLocaleLowerCase()),
      )
    : notes

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6">
      <img src={logo} alt="logo nlw expert" />
      <form className="w-full">
        <input
          onChange={handleChangeInput}
          type="text"
          placeholder="Busque suas notas..."
          className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500"
        />
      </form>

      <div className="h-px bg-slate-700" />

      <div className="grid grid-cols-3 gap-6  auto-rows-[250px]">
        <NewNoteCard />

        {showNotes.map((item) => (
          <NoteCard key={item.id} note={item} />
        ))}
      </div>
    </div>
  )
}
