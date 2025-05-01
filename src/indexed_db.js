// keyStore.js
import { openDB } from 'idb';

const DB_NAME = 'crypto-db';
const STORE_NAME = 'keys';

async function getDb() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    }
  });
}

export async function storeKey(name, jwk) {
  const db = await getDb();
  await db.put(STORE_NAME, jwk, name);
}

export async function getKey(name) {
  const db = await getDb();
  return await db.get(STORE_NAME, name);
}
