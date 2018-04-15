// Service Worker Registration
let swReg;

// Update UI for subscribed state
const setSubscribedStatus = state => {
  if (state) {
    document.getElementById('subscribe').className = 'hidden';
    document.getElementById('unsubscribe').className = '';
  } else {
    document.getElementById('subscribe').className = '';
    document.getElementById('unsubscribe').className = 'hidden';
  }
};

// Register Service Worker
if (navigator.serviceWorker) {
  navigator.serviceWorker
    .register('sw.js')
    .then(registration => {
      // Reference register globally
      swReg = registration;

      // Check if subscription exists, update UI accordingly
      swReg.pushManager.getSubscription().then(setSubscribedStatus);
    })
    .catch(console.error);
}

fetch('http://localhost:3333')
  .then(res => res.text())
  .then(console.log);
