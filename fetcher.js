const request = require('request');
const fs = require('fs');
const readline = require('readline');

// Accept two CLI arguments
const URL = process.argv[2];
const localFilePath = process.argv[3];

// Handle user prompt & response using readline module
const CLI = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const fetcherApp = (URL, localFilePath) => {

  // Make an HTTP request and wait for the response
  request(URL, (error, response, body) => {

    // Inform the console user connection being attempted
    console.log("Trying to connect...");

    // Handle errors during the request
    if (error) {
      console.error("Error! ☹️", error);
      return;
    }

    // Specific handling for any HTTP request errors
    if (response.statusCode !== 200) {
      console.error(`Error! ☹️ Request failed with Status Code: ${response.statusCode}. Please check the URL provided.`);
      return;
    }

    // Advise user if the file path is invalid
    if (!localFilePath) {
      console.error(`Error! Filepath: ${localFilePath} is invalid. ☹️`);
      return;
    }

    // Write the file
    fs.writeFile(localFilePath, body, error => {
      if (error) {
        console.error("Error! ☹️", error);
      }

      // Get the file stats
      fs.stat(localFilePath, (error, stats) => {
        if (error) {
          console.error("Error! ☹️", error);
          return;
        }

        // Access file size via the `stats` object
        console.log(`Downloaded and saved ${stats.size} bytes to ${localFilePath}! 😀`);

        // Count the characters in the file. Guidance suggests 1 character = 1 byte
        // const data = fs.readFileSync(localFilePath, 'utf-8');
        // console.log(`Character count: ${data.length}`);

      });
    });
  });
};

// Handle if file already exists
if (fs.existsSync(localFilePath)) {

  // Ask user if they want to overwrite or not
  CLI.question(`File already exists! Would you like to overwrite current ${localFilePath}? 🤔 Enter "Y" or "Ctrl + Z" to exit. \n`, (response) => {
    if (response !== "Y") {
      // User does not want to overwrite
      // Close the readline interfact
      CLI.close();
      // Exit the process
      process.exit();
    } else {
      // Overwrite the file
      fetcherApp(URL, localFilePath);
      // Close the readline interface
      CLI.close();
    }
  });
} else {
  // Create the file
  fetcherApp(URL, localFilePath);
  // Close the readline interface
  CLI.close();
}


// node fetcher.js http://www.example.edu/ ./stopTryingToMakeFetchHappen.html
// Expected output:
// Downloaded and saved 1256 bytes to ./stopTryingToMakeFetchHappen.html! 😀

// node fetcher.js https://www.example.com/nonexistent-page ./index.html
// Error! ☹️ Request failed with Status Code: 404. Please check the URL provided.