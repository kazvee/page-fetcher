const request = require('request');
const fs = require('fs');

// Accept two CLI arguments
const URL = process.argv[2];
const localFilePath = process.argv[3];

// Make an HTTP request and wait for the response
request(URL, (error, response, body) => {
  if (error) {
    console.error("Error! ☹️", error);
  }

  // Write the file
  fs.writeFile(localFilePath, body, err => {
    if (err) {
      console.error("Error! ☹️", err);
    }

    // Get the file stats
    fs.stat(localFilePath, (err, stats) => {
      if (err) {
        console.error("Error! ☹️", err);
      }

      // Access file size via the `stats` object
      console.log(`Downloaded and saved ${stats.size} bytes to ${localFilePath}`);

      // Count the characters in the file. Guidance suggests 1 character = 1 byte
      // const data = fs.readFileSync(localFilePath, 'utf-8');
      // console.log(`Character count: ${data.length}`);

    });

  });

});

// Send:
// node fetcher.js http://www.example.edu/ ./stopTryingToMakeFetchHappen.html
// Expected output:
// Downloaded and saved 1256 bytes to ./stopTryingToMakeFetchHappen.html