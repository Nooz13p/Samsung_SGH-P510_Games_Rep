// Build replaces the token with all local emitted files and a content-derived version.
const VERSION='__CACHE_VERSION__';
const FILES=__PRECACHE_FILES__;
const CACHE='p510-'+VERSION;
const ROOT=new URL('./',self.location).href;
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES.map(path=>new URL(path,ROOT).href))).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('p510-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;event.respondWith(caches.open(CACHE).then(async cache=>{const hit=await cache.match(event.request,{ignoreVary:true});if(hit)return hit;try{return await fetch(event.request);}catch(e){if(event.request.mode==='navigate'){const page=await cache.match(new URL('index.html',ROOT).href);if(page)return page;}throw e;}}));});
