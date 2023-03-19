// Function definitions
const request = require('request');


/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */

// Waterfall loop of call backs
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};



/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function(callback) {
  request('https://api.ipify.org?format=json', (error, response, body) => {      // input URL, site send back (error, response, body)
    if (error) return callback(error, null);                                      //return CB (error, null)

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);    // CB return (Status code, null)
      return;
    }

    const ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};


/**
 * Makes a single API request to retrieve the lat/lng for a given IPv4 address.
 * Input:
 *   - The ip (ipv4) address (string)
 *   - A callback (to pass back an error or the lat/lng object)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The lat and lng as an object (null if error). Example:
 *     { latitude: '49.27670', longitude: '-123.13000' }
 */
const fetchCoordsByIP = function(ip, callback) {
  request(`http://ipwho.is/${ip}`, (error, response, body) => {

    if (error) {
      callback(error, null);
      return;
    }

    const parsedBody = JSON.parse(body);

    if (!parsedBody.success) {
      const message = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
      callback(Error(message), null);
      return;
    }

    const { latitude, longitude } = parsedBody;

    callback(null, {latitude, longitude});
  });
};
/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;

  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
      return;
    }

    const passes = JSON.parse(body).response;
    callback(null, passes);
  });
};


module.exports = { nextISSTimesForMyLocation  };







// older version
 
//   const request = require('request');
//   request('https://api.ipify.org?format=json', (error, response, body) => {
    
//     if (error) {
//       return callback(error, null);
//     }
//     if (response.statusCode !== 200) {
//       callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
//       return;
//     }
//     const result = JSON.parse(body).ip;
//     callback(null, result);
//   });
// };

// const fetchCoordsByIp = function(ip, callback) {
//   const request = require('request');
//   // |     callback         |
//   request("http://ipwho.is/", (error, response, body) => {
    
//     if (error) {                                              // errors are first then you parse body
//       callback(error, null);
//       return;
//     }
//     if (response.statusCode !== 200) {
//       callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
//       return;
//     }
//     const parsedBody = JSON.parse(body);           // makes it an object

//     // check if "success" is true or not
//     if (!parsedBody.success) {
//       const message = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
//       callback(Error(message), null);
//       return;
//     }

//     const { latitude, longitude } = parsedBody;      // can store values together since they are object
//     const object = { latitude, longitude };          // store the objects inside a small object to return
    
//     callback(null, object);                             // send back the object to the function in index.js

//   });
// };

// const fetchISSFlyOverTimes = function(coords, callback) {
//   const request = require('request');
//   request(`https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
//     if (error) {
//       callback(error, null);
//       return;
//     }
//     if (response.statusCode !== 200) {
//       callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
//       return;
//     }
//     const newBody = JSON.parse(body);
//     callback(null, newBody.response);
    
//   });
//   //console.log(request)
// };


// const request = require('request');


// const nextISSTimesForMyLocation = function(callback) {
//   fetchMyIP((error, ip) => {
//     if (error) {
//       return callback(error, null);
//     }

//     fetchCoordsByIP(ip, (error, loc) => {
//       if (error) {
//         return callback(error, null);
//       }

//       fetchISSFlyOverTimes(loc, (error, nextPasses) => {
//         if (error) {
//           return callback(error, null);
//         }

//         callback(null, nextPasses);
//       });
//     });
//   });
// };


// const fetchMyIP = function(callback) {
//   request('https://api.ipify.org?format=json', (error, response, body) => {
//     if (error) return callback(error, null);

//     if (response.statusCode !== 200) {
//       callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
//       return;
//     }

//     const ip = JSON.parse(body).ip;
//     callback(null, ip);
//   });
// };

// const fetchCoordsByIP = function(ip, callback) {
//   request(`http://ipwho.is/${ip}`, (error, response, body) => {

//     if (error) {
//       callback(error, null);
//       return;
//     }

//     const parsedBody = JSON.parse(body);

//     if (!parsedBody.success) {
//       const message = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
//       callback(Error(message), null);
//       return;
//     }

//     const { latitude, longitude } = parsedBody;

//     callback(null, {latitude, longitude});
//   });
// };

// const fetchISSFlyOverTimes = function(coords, callback) {
//   const url = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;

//   request(url, (error, response, body) => {
//     if (error) {
//       callback(error, null);
//       return;
//     }

//     if (response.statusCode !== 200) {
//       callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
//       return;
//     }

//     const passes = JSON.parse(body).response;
//     callback(null, passes);
//   });
// };







// module.exports = { fetchMyIP,  fetchISSFlyOverTimes };