/* JSHint quality control options
   ============================================================== */
/*globals $:false*/
/*jslint devel: true*/
/*jshint esversion: 6*/

/* LEGEND, COMMENTS
   ============================================================== */
// HC = Hard coded

/* VARIABLES
   ============================================================== */
let database = require('./server/sqltest/sqltest');
const express = require('express');
const app = express();
// =====================================================================================================================

/* SERVER
   ============================================================== */
app.use(express.static('public')); // Will handle every static file placed in the public directory

app.get('/dynamic_request_fetchDB', function(request, response) {
  let toWrite = "";
  database.queryDatabase(); // select every question from the database and store it in dbResults array
  database.dataLoading.then(function(resolve) {
    toWrite = resolve.join(); // since response needs to return a string, join() the results
    response.writeHead(200, {'Content-Type': 'application/javascript'});
    response.write(toWrite);
    response.end();
  })
  .catch(function (error) {
    console.log("Empty rows returned from queryDatabase. Error " + error.message);
  });
});
// =====================================================================================================================

/* PORT
   ============================================================== */
// Specify port
var port = process.env.PORT || 1337;
// Listen to port
app.listen(port, function() {
  "use strict";
  console.log("Server running at http://localhost:%d", port);
});
// =====================================================================================================================
