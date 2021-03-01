const CACHE_NAME = 'v2'
const URLS = [
    '/',
    '/index.html',
    '/favicon.ico',
    '/bundle.js',
    // 'https://yandex.ru/bad-html.html',
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

this.addEventListener('activate', function(event) {
    console.log('activate');
});

this.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }

                const fetchRequest = event.request.clone();

                return fetch(fetchRequest)
                    .then(response => {
                            if(!response || response.status !== 200 || response.type !== 'basic') {
                                return response;
                            }

                            const responseToCache = response.clone();

                            caches.open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(event.request, responseToCache);
                                });

                            return response;
                        }
                    );
            })
    );
});
