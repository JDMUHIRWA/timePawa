// import NightBreaks from "../models/Shift Type/nightBreaks.js";
// import MorningBreaks from "../models/Shift Type/morningBreaks.js";
// import AfternoonBreaks from "../models/Shift Type/afternoonBreaks.js";
// import User from "../models/user.js";

// class GenerateWeeklyBreaks {
//   constructor() {
//     this.breakTypes = ["SCREEN_BREAK_1", "LUNCH", "SCREEN_BREAK_2"];
//   }
//   async morningBreaks() {
//     // fetch all the active users
//     const users = await User.find({ status: "ACTIVE" });

//     // defining break start and end times
//     const startShiftTime = new Date();
//     startShiftTime.setHours(9, 0, 0, 0); // 9:00 AM
//     const shiftDuration = 8 * 60; // 8 hours in minutes

//     const breakWindowStart = new Date(startShiftTime);
//     breakWindowStart.setHours(10, 0, 0, 0); // 10:00 AM

//     const breakWindowEnd = new Date(startShiftTime);
//     breakWindowEnd.setHours(16, 0, 0, 0); // 4:00 PM

//     const breakDuration = this.breakTypes.reduce((sum, breakType) => {
//       return sum + (breakType === "LUNCH" ? 30 : 10); // 30 min for lunch, 10 min for others
//     }, 0);

//     const availableTime = shiftDuration - breakDuration; // available time for spacing between breaks
//     // number of breaks
//     const numberOfBreaks = this.breakTypes.length;

//     const spacingBreaks = Math.floor(availableTime / ( numberOfBreaks + 1)); // space between breaks

//     let createdBreaks = [];
//     let currentBreakStart = new Date(breakWindowStart);

//     // Generate breaks for all users dynamically
//     for (let user of users) {
//       let createdBreak = [];
//       let breakStartTime = new Date(currentBreakStart);

//       for (let i = 0; i < this.breakTypes.length; i++) {
//         const breakEndTime = new Date(breakStartTime);
//         breakEndTime.setMinutes(
//           breakStartTime.getMinutes() +
//             (this.breakTypes[i] === "LUNCH" ? 30 : 10)
//         );

//         createdBreak.push({
//           break_type: this.breakTypes[i],
//           break_start: breakStartTime.toLocaleTimeString(),
//           break_end: breakEndTime.toLocaleTimeString(),
//         });
//         // Set the break time for the next break after this break
//         breakStartTime = new Date(breakEndTime);
//         breakStartTime.setMinutes(breakStartTime.getMinutes() + spacingBreaks); // move forward by calculated spacing
//       }

//       // Save the break times for the user
//       try {
//         const breaks = await Breaks.create({
//           user_id: user._id,
//           username: user.username,
//           start_date: startShiftTime,
//           end_date: breakWindowEnd,
//           status: "PENDING",
//           breaks: createdBreak,
//         });
//         createdBreaks.push(breaks);
//       } catch (createError) {
//         console.error(
//           `Error creating break record for ${user.username}:`,
//           createError
//         );
//       }
//     }

//     return createdBreaks;
//   }

//   async afternoonBreaks() {
//     // fetch all the active users
//     const users = await User.find({ status: "ACTIVE" });

//     // defining break start and end times
//     const startShiftTime = new Date();
//     startShiftTime.setHours(16, 0, 0, 0); // 14:00 PM

//     const shiftDuration = 8 * 60; // 8 hours in minutes

//     const breakWindowStart = new Date(startShiftTime);
//     breakWindowStart.setHours(17, 0, 0, 0); // 17:00 PM

//     const breakWindowEnd = new Date(startShiftTime);
//     breakWindowEnd.setHours(23, 0, 0, 0); // 23:00 PM

//     const breakDuration = this.breakTypes.reduce((sum, breakType) => {
//       return sum + (breakType === "LUNCH" ? 30 : 10); // 30 min for lunch, 10 min for others
//     }, 0);

//     const availableTime = shiftDuration - breakDuration; // available time for spacing between breaks

//     let createdBreaks = [];
//     let currentBreakStart = new Date(breakWindowStart);

//     // Generate breaks for all users dynamically

//     for (let user of users) {
//       let createdBreak = [];
//       let breakStartTime = new Date(currentBreakStart);

//       this.breakTypes.forEach((breakType) => {
//         const breakEndTime = new Date(breakStartTime);
//         breakEndTime.setMinutes(
//           breakStartTime.getMinutes() + (breakType === "LUNCH" ? 30 : 10)
//         );

//         createdBreak.push({
//           break_type: breakType,
//           break_start: breakStartTime.toLocaleTimeString(),
//           break_end: breakEndTime.toLocaleTimeString(),
//         });

//         // Set the break time for the next user after this user's break
//         currentBreakStart = new Date(breakEndTime);
//         currentBreakStart.setMinutes(
//           currentBreakStart.getMinutes() + spacingBreaks
//         ); // move forward by calculated spacing
//       });

//       // Save the break times for the user
//       try {
//         const breaks = await Breaks.create({
//           user_id: user._id,
//           username: user.username,
//           start_date: startShiftTime,
//           end_date: breakWindowEnd,
//           status: "PENDING",
//           breaks: createdBreak,
//         });
//         createdBreaks.push(breaks);
//       } catch (createError) {
//         console.error(
//           `Error creating break record for ${user.username}:`,
//           createError
//         );
//       }
//     }
//   }

//   async nightBreaks() {
//     // fetch all the active users
//     const users = await User.find({ status: "ACTIVE" });

//     // defining break start and end times
//     const startShiftTime = new Date();
//     startShiftTime.setHours(24, 0, 0, 0); // 00:00 AM
//     const shiftDuration = 8 * 60; // 8 hours in minutes

//     const breakWindowStart = new Date(startShiftTime);
//     breakWindowStart.setHours(1, 0, 0, 0); // 1:00 AM

//     const breakWindowEnd = new Date(startShiftTime);
//     breakWindowEnd.setHours(7, 0, 0, 0); // 7:00 PM

//     const breakDuration = this.breakTypes.reduce((sum, breakType) => {
//       return sum + (breakType === "LUNCH" ? 30 : 10); // 30 min for lunch, 10 min for others
//     }, 0);

//     const availableTime = shiftDuration - breakDuration; // available time for spacing between breaks
//     const usersCount = users.length;
//     const spacingBreaks = Math.floor(availableTime / (usersCount + 1)); // space between breaks

//     let createdBreaks = [];
//     let currentBreakStart = new Date(breakWindowStart);

//     // Generate breaks for all users dynamically
//     for (let user of users) {
//       let createdBreak = [];
//       let breakStartTime = new Date(currentBreakStart);

//       this.breakTypes.forEach((breakType) => {
//         const breakEndTime = new Date(breakStartTime);
//         breakEndTime.setMinutes(
//           breakStartTime.getMinutes() + (breakType === "LUNCH" ? 30 : 10)
//         );

//         createdBreak.push({
//           break_type: breakType,
//           break_start: breakStartTime.toLocaleTimeString(),
//           break_end: breakEndTime.toLocaleTimeString(),
//         });

//         // Set the break time for the next user after this user's break
//         currentBreakStart = new Date(breakEndTime);
//         currentBreakStart.setMinutes(
//           currentBreakStart.getMinutes() + spacingBreaks
//         ); // move forward by calculated spacing
//       });

//       // Save the break times for the user
//       try {
//         const breaks = await Breaks.create({
//           user_id: user._id,
//           username: user.username,
//           start_date: startShiftTime,
//           end_date: breakWindowEnd,
//           status: "PENDING",
//           breaks: createdBreak,
//         });
//         createdBreaks.push(breaks);
//       } catch (createError) {
//         console.error(
//           `Error creating break record for ${user.username}:`,
//           createError
//         );
//       }
//     }

//     return createdBreaks;
//   }
// }

// export default GenerateWeeklyBreaks;

// const breakTypes = ["SCREEN_BREAK_1", "LUNCH", "SCREEN_BREAK_2"];
// const users = [
//   "User1",
//   "User2",
//   "User3",
//   "User4",
//   "User5",
//   "User6",
//   "User7",
//   "User8",
//   "User9",
//   "User10",
// ];

// const shiftduration = 8 * 60; // Shift duration in minutes

// const shiftstart = new Date();
// shiftstart.setHours(9, 0, 0, 0); // Shift start at 9:00 AM

// const breakstartwindow = new Date(shiftstart);
// breakstartwindow.setHours(10, 0, 0, 0); // Break start window at 10:00 AM

// const breakendwindow = new Date(shiftstart);
// breakendwindow.setHours(16, 0, 0, 0); // Break end window at 4:00 PM

// const breakDuration = breakTypes.reduce((sum, breakType) => {
//   return sum + (breakType === "LUNCH" ? 30 : 10); // LUNCH gets 30 mins, others 10 mins
// }, 0);

// const availabletime = shiftduration - breakDuration;

// const spacing = 60;

// let createdbreaks = [];
// let nextbreak = new Date(breakstartwindow);

// for (let user of users) {
//   let createdbreak = [];
//   let currentbreakstart = new Date(breakstartwindow);

//   for (let i = 0; i < breakTypes.length; i++) {
//     let breakendTime = new Date(currentbreakstart);
//     breakendTime.setMinutes(
//       currentbreakstart.getMinutes() + (breakTypes[i] === "LUNCH" ? 30 : 10)
//     );
//     createdbreak.push({
//       username: user,
//       break_type: breakTypes[i],
//       break_start: currentbreakstart.toLocaleTimeString(),
//       break_end: breakendTime.toLocaleTimeString(),
//     });

//     currentbreakstart = new Date(breakendTime);
//     currentbreakstart.setMinutes(breakendTime.getMinutes() + spacing);
//   }

//   nextbreak = new Date(currentbreakstart);
//   nextbreak.setMinutes(nextbreak.getMinutes() - spacing);

//   createdbreaks.push(createdbreak);
// }

// console.log(createdbreaks);

// function createBreakSchedule(shiftStart, shiftEnd, numUsers, breaks) {
//   // Helper function to convert time string (e.g., "9:00 AM") to minutes since midnight
//   function timeToMinutes(timeStr) {
//     const [time, modifier] = timeStr.split(" ");
//     let [hours, minutes] = time.split(":").map(Number);

//     if (modifier === "PM" && hours !== 12) hours += 12;
//     if (modifier === "AM" && hours === 12) hours = 0;

//     return hours * 60 + minutes;
//   }

//   // Helper function to convert minutes since midnight to time string
//   function minutesToTime(minutes) {
//     const hours = Math.floor(minutes / 60) % 24;
//     const mins = minutes % 60;
//     const modifier = hours >= 12 ? "PM" : "AM";

//     const displayHours = hours % 12 === 0 ? 12 : hours % 12;
//     const displayMinutes = mins.toString().padStart(2, "0");

//     return `${displayHours}:${displayMinutes} ${modifier}`;
//   }

//   // Convert shift times to minutes
//   const shiftStartMinutes = timeToMinutes(shiftStart);
//   const shiftEndMinutes = timeToMinutes(shiftEnd);

//   // Calculate the break window (exclude first and last hour)
//   const breakWindowStart = shiftStartMinutes + 60; // Start 1 hour after shift starts
//   const breakWindowEnd = shiftEndMinutes - 60; // End 1 hour before shift ends

//   // Initialize the schedule for all users
//   const schedule = [];

//   for (let i = 0; i < numUsers; i++) {
//     schedule.push({ user: `User ${i + 1}`, breaks: [] });
//   }

//   // Assign breaks sequentially for each break type
//   breaks.forEach((breakType) => {
//     const breakDuration = breakType.duration; // Duration in minutes
//     let currentBreakStart = breakWindowStart; // Start at beginning of break window

//     for (let i = 0; i < numUsers; i++) {
//       const currentBreakEnd = currentBreakStart + breakDuration;

//       // Ensure break does not exceed the break window
//       if (currentBreakEnd > breakWindowEnd) {
//         console.error(
//           "Not enough time to schedule all breaks within the window."
//         );
//         break;
//       }

//       // Assign the break to the current user
//       schedule[i].breaks.push({
//         break: breakType.name,
//         start: minutesToTime(currentBreakStart),
//         end: minutesToTime(currentBreakEnd),
//       });

//       // Move to the next break time
//       currentBreakStart = currentBreakEnd;
//     }
//   });

//   return schedule;
// }

// // Example input
// const shiftStart = "9:00 AM";
// const shiftEnd = "5:00 PM";
// const numUsers = 5;
// const breaks = [
//   { name: "Screen Break 1", duration: 10 },
//   { name: "Lunch Break", duration: 30 },
//   { name: "Screen Break 2", duration: 10 },
// ];

// // Generate the schedule
// const schedule = createBreakSchedule(shiftStart, shiftEnd, numUsers, breaks);

// // Print the output
// console.log(JSON.stringify(schedule, null, 2));

// const breakTypes = ["SCREEN_BREAK_1", "LUNCH", "SCREEN_BREAK_2"];
// const users = [
//   "User1",
//   "User2",
//   "User3",
//   "User4",
//   "User5",
//   "User6",
//   "User7",
//   "User8",
//   "User9",
//   "User10",
// ];

// const shiftduration = 8 * 60; // Shift duration in minutes

// const shiftstart = new Date();
// shiftstart.setHours(9, 0, 0, 0); // Shift start at 9:00 AM

// const breakstartwindow = new Date(shiftstart);
// breakstartwindow.setHours(10, 0, 0, 0); // Break start window at 10:00 AM

// const breakendwindow = new Date(shiftstart);
// breakendwindow.setHours(16, 0, 0, 0); // Break end window at 4:00 PM

// const breakDuration = breakTypes.reduce((sum, breakType) => {
//   return sum + (breakType === "LUNCH" ? 30 : 10); // LUNCH gets 30 mins, others 10 mins
// }, 0);

// const availabletime = shiftduration - breakDuration;

// const spacing = 60;

// let createdbreaks = [];

// for (let user of users) {
//     let breakend = new Date

//     createdbreak.push({
//       username: user,
//       break_type: breakTypes[i],
//       break_start: currentbreakstart.toLocaleTimeString(),
//       break_end: breakendTime.toLocaleTimeString(),
//     });

//   createdbreaks.push(createdbreak);
// }

// console.log(createdbreaks);

const typesBreak = ["SCREEN_BREAK_1", "LUNCH", "SCREEN_BREAK_2"];
const myusers = [
  "User1",
  "User2",
  "User3",
  "User4",
  "User5",
  "User6",
  "User7",
  "User8",
  "User9",
  "User10",
];

const screenBreakStart = new Date();
screenBreakStart.setHours(12, 0, 0, 0); // Set start time to 10:00 AM

const screenBreakEnd = new Date();
screenBreakEnd.setHours(11, 30, 0, 0); // Set end time to 11:30 AM

// Calculate the difference in milliseconds
const screenBreakWindow = screenBreakEnd - screenBreakStart;

// Convert the difference to minutes
const screenBreakMinutes = screenBreakWindow / (1000 * 60);

const durationofBreak = 10;

const breaksPerUser = myusers.length / (screenBreakMinutes / durationofBreak);
const userBreaks = breaksPerUser.toFixed(0);

let breaksCreated = [];
let breakStartTime = new Date(screenBreakStart);
let breakEndTime = new Date(screenBreakStart);
breakEndTime.setMinutes(screenBreakStart.getMinutes() + durationofBreak);
let i = 1;
for (let myuser of myusers) {
  const userStart = breakStartTime;
  const userEnd = breakEndTime;
  const userDetails = {
    username: myuser,
    break_start: userStart,
    break_end: userEnd,
  };
  console.log("Userdetails: ", userDetails);
  if (i == userBreaks) {
    i = 1;
    breakStartTime.setMinutes(breakStartTime.getMinutes() + durationofBreak);
    breakEndTime.setMinutes(breakEndTime.getMinutes() + durationofBreak);
  } else {
    i = i + 1;
  }
}

console.log(breaksCreated);