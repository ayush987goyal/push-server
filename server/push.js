const webpush = require('web-push');
const urlsafeBase64 = require('urlsafe-base64');
const Storage = require('node-storage');

// Vapid keys
const vapid = require('./vapid.json');

// Configure web-push
webpush.setVapidDetails('mailto:ayush987goyal@gmail.com', vapid.publicKey, vapid.privateKey);

// Subscriptions
const store = new Storage(`${__dirname}/db`);
let subscriptions = store.get('subscriptions') || [];

// Create URL safe vapid  public key
module.exports.getKey = () => urlsafeBase64.decode(vapid.publicKey);

// Store a new subscription
module.exports.addSubscription = subscription => {
  // Add to subscriptions array
  subscriptions.push(subscription);

  // Persist subscriptions
  store.put('subscriptions', subscriptions);
};

// Send notification to all registered subscriptions
module.exports.send = message => {
  subscriptions.forEach((subscription, i) => {
    webpush.sendNotification(subscription, message);
  });
};
