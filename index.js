// Function calling
const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes } = require('./iss');

// let ipAdd = '';
// let latitudeValue = 0;
// let longitudeValue = 0;

fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }

  console.log('It worked! Returned IP:' , ip);
  //let ipAdd = ip;      // 104.163.183.140
});



fetchCoordsByIP(ip, (error, coordinates) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }

  console.log('It worked! Returned coordinates:' , coordinates);
  
});


const myCoords = { latitude: '45.5016889', longitude: '-73.567256' };

fetchISSFlyOverTimes(myCoords, (error, passTimes) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }

  console.log('It worked! Returned flyover times:' , passTimes);
});
















// const { fetchMyIP, fetchCoordsByIp, fetchISSFlyOverTimes } = require('./iss');
// const { nextISSTimesForMyLocation } = require('./iss');


// const nextISSTimesForMyLocation = function (callback) {
//   fetchMyIP((error, ip) => {
//     if (error) {
//       return callback(error)
//     }

//     fetchCoordsByIp(ip, (error, position) => {
//       if (error) {
//         return callback(error, null);
//       }
      
//       fetchISSFlyOverTimes(position, (error, passTimes) => {
//         if (error) {
//           return callback(error, null);
//         }

//           callback(null, passTimes);


//       });
//     });
//   });
// };






// const printPassTimes = function(passTimes) {
//   for (const pass of passTimes) {
//     const datetime = new Date(0);
//     datetime.setUTCSeconds(pass.risetime);
//     const duration = pass.duration;
//     console.log(`Next pass at ${datetime} for ${duration} seconds!`);
//   }
// };

// nextISSTimesForMyLocation((error, passTimes) => {
//   if (error) {
//     return console.log("It didn't work!", error);
//   }
//   console.log(`hello`)
//   printPassTimes(passTimes);
// });

// nextISSTimesForMyLocation()



