importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyAdLEzrfhGr4bj3Em0PQsX0vpLjDMvCbWI",
  authDomain: "zygo-4d41c.firebaseapp.com",
  projectId: "zygo-4d41c",
  storageBucket: "zygo-4d41c.firebasestorage.app",
  messagingSenderId: "466218238375",
  appId: "1:466218238375:web:7019c7793d51d16b56b682",
  measurementId: "G-FKC3HGGS19",
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
    const promiseChain = clients
        .matchAll({
            type: "window",
            includeUncontrolled: true
        })
        .then(windowClients => {
            for (let i = 0; i < windowClients.length; i++) {
                const windowClient = windowClients[i];
                windowClient.postMessage(payload);
            }
        })
        .then(() => {
            const title = payload.notification.title;
            const options = {
                body: payload.notification.score
              };
            return registration.showNotification(title, options);
        });
    return promiseChain;
});
self.addEventListener('notificationclick', function (event) {
    console.log('notification received: ', event)
});