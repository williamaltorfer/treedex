import { getAllCatches, getAllProfiles, addCatch, addProfile } from './db'
import type { Catch, Profile } from './types'

interface BackupFile {
  version: 1
  exportedAt: number
  profiles: Profile[]
  catches: (Omit<Catch, 'photo'> & { photoBase64: string; photoType: string })[]
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve((reader.result as string).split(',')[1] ?? '')
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

function base64ToBlob(base64: string, type: string): Blob {
  const bytes = atob(base64)
  const arr = new Uint8Array(bytes.length)
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i)
  return new Blob([arr], { type })
}

export async function exportBackup() {
  const [profiles, catches] = await Promise.all([getAllProfiles(), getAllCatches()])
  const encodedCatches = await Promise.all(
    catches.map(async (c) => {
      const { photo, ...rest } = c
      return { ...rest, photoBase64: await blobToBase64(photo), photoType: photo.type || 'image/jpeg' }
    }),
  )
  const backup: BackupFile = { version: 1, exportedAt: Date.now(), profiles, catches: encodedCatches }

  const blob = new Blob([JSON.stringify(backup)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `treedex-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export async function importBackup(file: File) {
  const text = await file.text()
  const backup: BackupFile = JSON.parse(text)

  for (const p of backup.profiles) {
    await addProfile(p)
  }
  for (const c of backup.catches) {
    const { photoBase64, photoType, ...rest } = c
    await addCatch({ ...rest, photo: base64ToBlob(photoBase64, photoType) })
  }

  return { profiles: backup.profiles.length, catches: backup.catches.length }
}
