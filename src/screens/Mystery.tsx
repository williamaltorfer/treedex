export function Mystery({
  photoUrl,
  onDone,
  title = 'Mystery tree!',
  message = "We couldn't match this one to the Chicago list yet. It's saved as a mystery tree.",
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
