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
  // Notification promises
  let notifications = [];

  // Loop subscriptions
  subscriptions.forEach((subscription, i) => {
    let p = webpush.sendNotification(subscription, message).catch(status => {
      // Check for '410 - Gone' status and mark for deletion
      if (status.statusCode === 410) subscriptions[i]['delete'] = true;

      // return any value
      return null;
    });

    // Push notifications promise to array
    notifications.push(p);
  });

  // clean subscriptions marked for deletion
  Promise.all(notifications).then(() => {
    subscriptions = subscriptions.filter(subscription => !subscription.delete);

    // Persist cleaned subscriptions
    store.put('subscriptions', subscriptions);
  });
};
