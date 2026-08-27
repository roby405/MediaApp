const CACHE_NAME = 'media-app-shell-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg'
];

self.addEventListener("install", (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).catch(err => console.error("Cache setup failed:", err))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (url.pathname.startsWith("/opfs-media/")) {
    event.respondWith(streamOPFS(event.request, url));
    return;
  }

  if (url.pathname.startsWith("/db/")) {
    event.respondWith(fetchFile(event.request, url));
    return;
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html');
      })
    );
  }
});

async function fetchFile(request, url) {
  try {
    const search = url.pathname.replace("/db/", "");
    const parts = search.split("/");
    if (parts.length !== 2) {
      throw new Error("badly formatted request");
    }

    const type = parts[0];
    const id = parts[1];

    switch (type) {
      case "cover": {
        const cover = (await getFileFromDB(id))?.cover;
        if (!cover) {
          throw new Error("File doesn't have a cover");
        }

        return new Response(cover, {
          status: 200,
          headers: {
            "Content-Type": cover.type || "image/jpeg",
            "Cache-Control": "public, max-age=86400"
          }
        })
      }

      default: {
        return new Response("Unknown database request type", { status: 400 });
      }
    }
  } catch (err) {
    return new Response("Unknown error", { status: 400 });
  }
}

async function getFileFromDB(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("MediaDB", 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = (event) => {
      const db = event.target.result;
      try {
        const transaction = db.transaction("files", "readonly");

        const store = transaction.objectStore("files");
        const getRequest = store.get(id);

        getRequest.onsuccess = () => {
          const result = getRequest.result;

          resolve(result ? result : null);
        };

        getRequest.onerror = () => reject(request.error);
      } catch (err) {
        resolve(null);
      }
    }
  });
}

async function streamOPFS(request, url) {
  try {
    const id = url.pathname.replace("/opfs-media/", "");
    const root = await navigator.storage.getDirectory();
    const fileHandle = await root.getFileHandle(id);
    const file = await fileHandle.getFile();

    const range = request.headers.get("Range");

    if (!range) {
      return new Response(file.stream(), {
        status: 200,
        headers: {
          "Content-Type": file.type || "application/octet-stream",
          "Content-Length": file.size.toString(),
          "Cache-Control": "no-store, no-cache, must-revalidate",
          "Accept-Ranges": "bytes",
        }
      });
    }

    const rangeParts = range.replace("bytes=", "").split("-");
    const start = parseInt(rangeParts[0], 10);
    const end = rangeParts[1] ? parseInt(rangeParts[1], 10) : file.size - 1;

    if (start >= file.size || end >= file.size || start > end) {
      return new Response("range is wrong", { status: 416 });
    }

    const chunkSize = end - start + 1;
    const stream = file.slice(start, end + 1).stream();

    return new Response(stream, {
      status: 206,
      headers: {
        "Content-Type": file.type || "application/octet-stream",
        "Content-Range": `bytes ${start}-${end}/${file.size}`,
        "Content-Length": chunkSize.toString(),
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Accept-Ranges": "bytes",
      }
    });

  } catch (err) {
    console.error(`OPFS error: ${err}`);
    return new Response("No file or smth bad OPFS", { status: 404 });
  }
}