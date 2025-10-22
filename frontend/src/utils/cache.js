// src/utils/cache.js
let authCache = {
  user: null,
  lastCheck: null,
  CACHE_TTL: 10 * 60 * 1000, // 10 minutos
};

export const clearAuthCache = () => {
  authCache.user = null;
  authCache.lastCheck = null;
  console.log('✅ [CACHE] Cache limpiado');
};

export const updateAuthCache = (userData) => {
  authCache.user = userData;
  authCache.lastCheck = Date.now();
  console.log('✅ [CACHE] Cache actualizado');
};

export const getAuthCache = () => {
  if (authCache.user && authCache.lastCheck && 
      (Date.now() - authCache.lastCheck) < authCache.CACHE_TTL) {
    return authCache.user;
  }
  return null;
};