import * as Dialog from '@radix-ui/react-dialog'
import { ArrowLeft, X } from 'lucide-react'
import { ChangeEvent, FormEvent, useContext, useState } from 'react'
import { toast } from 'sonner'
import { NotesContext } from '../context/NotesContext'

let speecheRecognition: SpeechRecognition | null = null

export function NewNoteCard() {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
  const [content, setContent] = useState('')
  const [isRecording, setIsRecording] = useState(false)

  const { addNote } = useContext(NotesContext)

  function handleStartEditor() {
    setShouldShowOnboarding(false)
  }

  function handleContentChanged(e: ChangeEvent<HTMLTextAreaElement>) {
    setContent(e.target.value)

    if (e.target.value === '') {
      setShouldShowOnboarding(true)
    }
  }

  function handleSaveNote(e: FormEvent) {
    e.preventDefault()

    addNote(content)

    setContent('')

    setShouldShowOnboarding(true)

    toast.success('Nota criada com sucesso!')
  }

  function handleStartRecording() {
    const isSpeechRecognitionAPIAvailable =
      'SpeechRecognition' in window || 'webkitSpeechRecognition' in window

    if (!isSpeechRecognitionAPIAvailable) {
      alert('Infelizmente seu navegador não suporta a API de gravação')
      return
    }

    setIsRecording(true)
    setShouldShowOnboarding(false)

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition

    speecheRecognition = new SpeechRecognitionAPI()

    speecheRecognition.lang = 'pt-BR'
    speecheRecognition.continuous = true
    speecheRecognition.maxAlternatives = 1
    speecheRecognition.interimResults = true

    speecheRecognition.onresult = (e) => {
      const transcription = Array.from(e.results).reduce((text, result) => {
        return text.concat(result[0].transcript)
      }, '')

      setContent(transcription)
    }

    speecheRecognition.onerror = (e) => {
      console.error(e)
    }

    speecheRecognition.start()
  }

  function handleStopRecording() {
    setIsRecording(false)

    if (!content) {
      setShouldShowOnboarding(true)
    }

    speecheRecognition?.stop()
  }

  function buttonBack() {
    if (isRecording) {
      speecheRecognition?.stop()
      setIsRecording(false)
    }

    setContent('')

    setShouldShowOnboarding(true)
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md flex flex-col bg-slate-700 text-left p-5 gap-3 outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
        <span className="text-sm font-medium text-slate-200">
          Adicionar nota
        </span>
        <p className="text-sm leading-6 text-slate-400">
          Grave uma nota em áudio que será convertida para texto
          automaticamente.
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none">
          <div className="flex cursor-pointer mb-6">
            {!shouldShowOnboarding && (
              <button
                onClick={buttonBack}
                className="absolute left-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100"
              >
                <ArrowLeft />
              </button>
            )}
            <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
              <X className="size-5" />
            </Dialog.Close>
          </div>
          <form className="flex-1 flex flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-300">
                Adicionar nota
              </span>
              {shouldShowOnboarding ? (
                <p className="text-sm leading-6 text-slate-400">
                  Comece{' '}
                  <button
                    type="button"
                    onClick={handleStartRecording}
                    className="font-medium text-lime-400 hover:underline"
                  >
                    gravando uma nota
                  </button>{' '}
                  em audio ou se preferir{' '}
                  <button
                    type="button"
                    onClick={handleStartEditor}
                    className="font-medium text-lime-400 hover:underline"
                  >
                    utilize apenas texto
                  </button>
                  .
                </p>
              ) : (
                <textarea
                  value={content}
                  autoFocus
                  className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                  onChange={handleContentChanged}
                />
              )}
            </div>

            {isRecording && shouldShowOnboarding === false ? (
              <button
                type="button"
                onClick={handleStopRecording}
                className="w-full flex justify-center items-center gap-2 bg-slate-800 py-4 text-center text-sm text-slate-100 outline-none font-medium hover:enabled:bg-slate-900"
              >
                <div className="size-3 rounded-full bg-red-500 animate-pulse" />
                Gravando... (clique para interromper)
              </button>
            ) : (
              <button
                disabled={!content}
                type="button"
                onClick={handleSaveNote}
                className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:enabled:bg-lime-500"
              >
                Salvar nota
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
