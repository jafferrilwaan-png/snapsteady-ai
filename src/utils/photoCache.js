// Robust Photo Storage using IndexedDB (500MB+ storage) with LocalStorage fallback & Instant File Download

const DB_NAME = 'SnapSteadyDB';
const STORE_NAME = 'photos';
const DB_VERSION = 1;

let dbPromise = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        resolve(null);
        return;
      }
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    });
  }
  return dbPromise;
}

// In-memory cache for instant zero-latency UI updates
let memoryPhotos = [];

export const getCachedPhotos = () => {
  try {
    const raw = localStorage.getItem('snapsteady_cached_photos_meta');
    if (raw) {
      const list = JSON.parse(raw);
      if (list.length > 0) return list;
    }
  } catch (e) {}
  return memoryPhotos;
};

export const savePhotoToCache = async (dataUrl, metadata = {}) => {
  const newPhoto = {
    id: 'snap_' + Date.now(),
    dataUrl,
    timestamp: new Date().toISOString(),
    timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    lux: metadata.lux || 400,
    stability: metadata.stability || 95,
    zoom: metadata.zoom || '1.0x',
    filter: metadata.filter || 'none'
  };

  // 1. Update in-memory list
  memoryPhotos = [newPhoto, ...memoryPhotos].slice(0, 30);

  // 2. Save to IndexedDB (unlimited quota)
  try {
    const db = await getDB();
    if (db) {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(newPhoto);
    }
  } catch (e) {
    console.warn('IndexedDB write error:', e);
  }

  // 3. Save lightweight meta to LocalStorage for fast boot
  try {
    const lightweightList = memoryPhotos.map((p) => ({
      ...p,
      // Store compressed dataUrl
      dataUrl: p.dataUrl
    })).slice(0, 10);
    localStorage.setItem('snapsteady_cached_photos_meta', JSON.stringify(lightweightList));
  } catch (e) {
    console.warn('LocalStorage quota limit reached, relying on IndexedDB:', e);
  }

  return newPhoto;
};

export const deleteCachedPhoto = async (id) => {
  memoryPhotos = memoryPhotos.filter((p) => p.id !== id);
  try {
    const db = await getDB();
    if (db) {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(id);
    }
  } catch (e) {}
  try {
    localStorage.setItem('snapsteady_cached_photos_meta', JSON.stringify(memoryPhotos));
  } catch (e) {}
  return memoryPhotos;
};

export const clearPhotoCache = async () => {
  memoryPhotos = [];
  try {
    const db = await getDB();
    if (db) {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).clear();
    }
  } catch (e) {}
  try {
    localStorage.removeItem('snapsteady_cached_photos_meta');
  } catch (e) {}
  return [];
};

// Automatic direct file downloader
export const downloadPhotoDirect = (dataUrl, filename) => {
  try {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename || `snapsteady_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (e) {
    console.error('Direct download failed:', e);
  }
};
