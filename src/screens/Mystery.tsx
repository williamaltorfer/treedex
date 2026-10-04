export function Mystery({
  photoUrl,
  onDone,
  title = 'Not sure yet!',
  message = "We couldn't confidently identify this one from the photo — it might still be a real tree, just not a clear enough shot for us to be sure. It's saved as a mystery tree.",
}: {
  photoUrl: string
  onDone: () => void
  title?: string
  message?: string
}) {
  return (
    <main>
      <h1>{title}</h1>
      <img className="preview" src={photoUrl} alt="Unidentified tree" />
      <p>{message}</p>
      <p>Try another photo — a different angle, or the bark instead of a leaf, can help.</p>
      <button className="identify-btn" onClick={onDone}>
        Back to dex
      </button>
    </main>
  )
}
