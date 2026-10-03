import { openDB, type IDBPDatabase } from 'idb'
import type { Catch, Profile } from './types'

const DB_NAME = 'treedex'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase> | null = null

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        db.createObjectStore('catches', { keyPath: 'id' })
        db.createObjectStore('profiles', { keyPath: 'id' })
      },
    })
  }
  return dbPromise
}

export async function addCatch(c: Catch) {
  const db = await getDb()
  await db.put('catches', c)
}

export async function updateCatch(c: Catch) {
  const db = await getDb()
  await db.put('catches', c)
}

export async function deleteCatch(id: string) {
  const db = await getDb()
  await db.delete('catches', id)
}

export async function getAllCatches(): Promise<Catch[]> {
  const db = await getDb()
  const all = await db.getAll('catches')
  return all.sort((a, b) => b.capturedAt - a.capturedAt)
}

export async function addProfile(p: Profile) {
  const db = await getDb()
  await db.put('profiles', p)
}

export async function deleteProfile(id: string) {
  const db = await getDb()
  await db.delete('profiles', id)
}

export async function getAllProfiles(): Promise<Profile[]> {
  const db = await getDb()
  return db.getAll('profiles')
}

export async function requestPersistentStorage() {
  if (navigator.storage?.persist) {
    try {
      return await navigator.storage.persist()
    } catch {
      return false
    }
  }
  return false
}
