const webpush = require('web-push');
const urlsafeBase64 = require('urlsafe-base64');
const Storage = require('node-storage');

// Vapid keys
const vapid = require('./vapid.json');

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
