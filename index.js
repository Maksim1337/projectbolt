/* VARIABLES
   ============================================================== */
var http = require('http');
const url = require('url');
var fs = require('fs'); // file system
// =====================================================================================================================

/* SERVER
   ============================================================== */
var server = http.createServer(function (request, response) {
    // Handle HTML
    if(request.url === "/") {
      fs.readFile('index.html', function(err, data) {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);
        response.end();
      });
    }
    // Handle scripts
    if(request.url === "/mainScript.js") {
      fs.readFile('mainScript.js', function(err, data) {
        response.writeHead(200, {'Content-Type': 'application/javascript'});
        response.write(data);
        response.end();
      });
    }
    // Handle images
    if(request.url === "/images/thunder.png") {
      fs.readFile('images/thunder.png', function(err, data) {
        if(!err){
          response.writeHead(200, {'Content-Type': 'image/png'});
          response.write(data);
          response.end();
        }
      });
    }
    // Handle CSS
    if(request.url === "/styles/style_index.css") {
      fs.readFile("styles/style_index.css", function(err, data) {
        response.writeHead(200, {'Content-Type': 'text/css'});
        response.write(data);
        response.end();
      })
    }
});
// =====================================================================================================================

/* PORT
   ============================================================== */
// Specify port
var port = process.env.PORT || 1337;
// Listen to port
server.listen(port);
// =====================================================================================================================

console.log("Server running at http://localhost:%d", port);