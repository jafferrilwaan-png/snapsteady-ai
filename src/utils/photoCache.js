// Local Photo Cache using LocalStorage / IndexedDB for real offline photo caching
const DB_KEY = 'snapsteady_cached_photos';

export const getCachedPhotos = () => {
  try {
    const raw = localStorage.getItem(DB_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to read photo cache:', e);
    return [];
  }
};

export const savePhotoToCache = (dataUrl, metadata = {}) => {
  try {
    const photos = getCachedPhotos();
    const newPhoto = {
      id: 'photo_' + Date.now(),
      dataUrl,
      timestamp: new Date().toISOString(),
      timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      lux: metadata.lux || 400,
      stability: metadata.stability || 95,
      zoom: metadata.zoom || '1.0x'
    };
    
    // Keep up to 20 most recent high-res snaps in localStorage
    const updated = [newPhoto, ...photos].slice(0, 20);
    localStorage.setItem(DB_KEY, JSON.stringify(updated));
    return newPhoto;
  } catch (e) {
    console.error('Failed to save to photo cache:', e);
    // If quota exceeded, trim down to 5 and retry
    try {
      const photos = getCachedPhotos().slice(0, 5);
      const newPhoto = {
        id: 'photo_' + Date.now(),
        dataUrl,
        timestamp: new Date().toISOString(),
        timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        lux: metadata.lux || 400,
        stability: metadata.stability || 95,
        zoom: metadata.zoom || '1.0x'
      };
      localStorage.setItem(DB_KEY, JSON.stringify([newPhoto, ...photos]));
      return newPhoto;
    } catch (err) {
      console.warn('Cache quota reached:', err);
      return null;
    }
  }
};

export const deleteCachedPhoto = (id) => {
  try {
    const photos = getCachedPhotos().filter((p) => p.id !== id);
    localStorage.setItem(DB_KEY, JSON.stringify(photos));
    return photos;
  } catch (e) {
    console.error('Failed to delete photo:', e);
    return [];
  }
};

export const clearPhotoCache = () => {
  try {
    localStorage.removeItem(DB_KEY);
    return [];
  } catch (e) {
    console.error('Failed to clear photo cache:', e);
    return [];
  }
};
