const http = require('http');

http
  .createServer((request, response) => {
    // Enable CORS
    response.setHeader('Access-Control-Allow-Origin', '*');

    response.end('Hello from HTTP server - updated');
  })
  .listen(3333, () => {
    console.log('Server Running');
  });
