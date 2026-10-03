import { speak, speechSupported } from '../speech'

export function ReadAloudButton({ text }: { text: string }) {
  if (!speechSupported) return null
  return (
    <button className="read-aloud-btn" onClick={() => speak(text)} aria-label="Read aloud">
      🔊
    </button>
  )
}
