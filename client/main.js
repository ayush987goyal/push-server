// Service Worker Registration
let swReg;

// Push server URL
const serverUrl = 'http://localhost:3333';

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

// Get public key from server
const getApplicationServerKey = () => {
  return (
    fetch(`${serverUrl}/key`)
      // Parse response body as arrayBuffer
      .then(res => res.arrayBuffer())
      // return arrayBuffer as new Uint8Array
      .then(key => new Uint8Array(key))
  );
};

// Unsubscribe from push service
const unsubscribe = () => {
  // Unsubscribe and update UI
  swReg.pushManager.getSubscription().then(subscription => {
    subscription.unsubscribe().then(() => {
      setSubscribedStatus(false);
    });
  });
};

// Subscribe for push notifications
const subscribe = () => {
  // Check registration is availabel
  if (!swReg) return console.error('SW Registration Not Found');

  getApplicationServerKey().then(applicationServerKey => {
    swReg.pushManager
      .subscribe({ userVisibleOnly: true, applicationServerKey })
      .then(res => res.toJSON())
      .then(subscription => {
        // Pass subscription to server
        fetch(`${serverUrl}/subscribe`, { method: 'POST', body: JSON.stringify(subscription) })
          .then(setSubscribedStatus)
          .catch(unsubscribe);
      })
      .catch(console.error);
  });
};
