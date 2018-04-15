const http = require('http');
const push = require('./push');

http
  .createServer((request, response) => {
    // Enable CORS
    response.setHeader('Access-Control-Allow-Origin', '*');

    // Get request vars
    const { url, method } = request;

    // Subscribe
    if (method === 'POST' && url.match(/^\/subscribe\/?/)) {
      let body = [];

      request.on('data', chunk => body.push(chunk)).on('end', () => {
        // Parse subscription body to object
        let subscription = JSON.parse(body.toString());

        // Store subscription for push notifications
        push.addSubscription(subscription);

        // Respond
        response.end('Subscribed');
      });

      // Public Key
    } else if (url.match(/^\/key\/?/)) {
      //Respond with public key from push module
      response.end(push.getKey());

      // Push Notification
    } else if (method === 'POST' && url.match(/^\/push\/?/)) {
      let body = [];

      request.on('data', chunk => body.push(chunk)).on('end', () => {
        response.end('Push Sent');
      });

      // Not Found
    } else {
      response.statusCode = 404;
      response.end('Error: Unkown Request');
    }
  })
  .listen(3333, () => {
    console.log('Server Running');
  });
