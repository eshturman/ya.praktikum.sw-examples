const CACHE_NAME = 'v1'
const URLS = [
    '/',
    '/index.html',
    '/favicon.ico',
    '/bundle.js',
]

this.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => {
                console.log('install');
                return cache.addAll(URLS);
            })
            .catch((err) => {
                console.log('!!!!!!', err);
                throw err;
            })
    )
})

this.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(res => {
                const fetchRequest = event.request.clone();

                return new Promise((resolve) => {
                    fetch(fetchRequest)
                        .then(response => {
                                if(!response || response.status !== 200 || response.type !== 'basic') {
                                    return resolve(response);
                                }

                                const responseToCache = response.clone();

                                caches.open(CACHE_NAME)
                                    .then(cache => {
                                        cache.put(event.request, responseToCache);
                                    });

                                return resolve(response);
                            }
                        )
                        .catch(err => {
                            if (res) {
                                return resolve(res);
                            } else {
                                throw err;
                            }
                        })
                })
            })
    );
});
