import NightBreaks from "../models/Shift Type/nightBreaks.js";
import MorningBreaks from "../models/Shift Type/morningBreaks.js";
import AfternoonBreaks from "../models/Shift Type/afternoonBreaks.js";
import User from "../models/user.js";
import { create } from "qrcode";

class GenerateWeeklyBreaks {
  constructor() {
    this.breakTypes = ["SCREEN_BREAK_1", "LUNCH", "SCREEN_BREAK_2"];
  }
  async morningBreaks() {
    try {
      // Fetch all the active users
      const users = await User.find({ status: "ACTIVE" });

      // Define start and end dates for the week
      const today = new Date();
      const startOfWeek = new Date(
        today.setDate(today.getDate() - today.getDay())
      ); // Start of the week (Sunday)
      const endOfWeek = new Date(today.setDate(startOfWeek.getDate() + 6)); // End of the week (Saturday)

      // Array to store created morning breaks
      let createdMorningBreaks = [];

      // Generate weekly breaks for each user
      for (let user of users) {
        let totalBreakDuration = 0;
        for (let i = 0; i < this.breakTypes.length; i++) {
          let breakDuration = 0;

          // Assign break durations based on the break type

          switch (this.breakTypes[i]) {
            case "SCREEN_BREAK_1":
              breakDuration = 10; // SB 1 has 10 mins duration
              break;
            case "LUNCH":
              breakDuration = 30; // Lunch break has 30 mins duration
              break;
            case "SCREEN_BREAK_2":
              breakDuration = 10; // SB 2 has 10 mins duration
              break;
          }

          totalBreakDuration += breakDuration; // Calculate total break duration for the week

          try {
            // Create a record in the database
            const morningbreaks = await MorningBreaks.create({
              user_id: user._id,
              username: user.username,
              start_date: startOfWeek,
              end_date: endOfWeek,
              status: "PENDING",
              break_type: this.breakTypes[i],
              break_duration: breakDuration,
              time_period: "MORNING",
            });
            createdMorningBreaks.push(morningbreaks);
          } catch (createError) {
            console.error(
              `Error creating morning break record for ${user.username}:`,
              createError
            );
          }
        }
      }

      return createdMorningBreaks;
    } catch (error) {
      console.error("Error in morningBreaks function:", error);
    }
  }

  async afternoonBreaks() {
    try {
      // fetch all the active users
      const users = await User.find({ status: "ACTIVE" });

      // defining break types and weekly start/end dates
      const today = new Date(); // get today's date
      const startOfWeek = new Date(
        today.setDate(today.getDate() - today.getDay())
      ); // get the start of the week
      const endOfWeek = new Date(
        today.setDate(today.getDate() - today.getDay() + 6)
      ); // get the end of the week

      // Array to store created afternoon breaks
      const createdAfternoonBreaks = [];

      // Generate weekly breaks for each user
      for (let user of users) {
        let totalBreakDuration = 0;
        for (let i = 0; i < this.breakTypes.length; i++) {
          let breakDuration = 0;
          switch (this.breakTypes[i]) {
            case "SCREEN_BREAK_1":
              breakDuration = 10; // SB 1 has 10 mins duration
              break;
            case "LUNCH":
              breakDuration = 30; // Lunch break has 30 mins duration
              break;
            case "SCREEN_BREAK_2":
              breakDuration = 10; // SB 2 has 10 mins duration
              break;
          }
          totalBreakDuration += breakDuration; // calculate total break duration for the week

          try {
            // create a record in th database
            await AfternoonBreaks.create({
              user_id: user._id,
              username: user.username,
              start_date: startOfWeek,
              end_date: endOfWeek,
              status: "PENDING",
              break_type: this.breakTypes[i],
              break_duration: breakDuration,
              time_period: "AFTERNOON",
            });
            createdAfternoonBreaks.push({
              user_id: user._id,
              username: user.username,
              start_date: startOfWeek,
              end_date: endOfWeek,
              status: "PENDING",
              break_type: this.breakTypes[i],
              break_duration: breakDuration,
              time_period: "AFTERNOON",
            });
          } catch (createError) {
            console.error(
              `Error creating afternoon break record for ${user.username}:`,
              createError
            );
          }
        }
      }

      return createdAfternoonBreaks;
    } catch (error) {
      console.log(error);
    }
  }
  async nightBreaks() {
    try {
      // fetch all the active users
      const users = await User.find({ status: "ACTIVE" });

      // defining break types and weekly start/end dates
      const today = new Date(); // get today's date
      const startOfWeek = new Date(
        today.setDate(today.getDate() - today.getDay())
      ); // get the start of the week
      const endOfWeek = new Date(
        today.setDate(today.getDate() - today.getDay() + 6)
      ); // get the end of the week

      // Array to store created night breaks
      const createdNightBreaks = [];

      // Generate weekly breaks for each user
      for (let user of users) {
        let totalBreakDuration = 0;

        for (let i = 0; i < this.breakTypes.length; i++) {
          let breakDuration = i === 1 ? 30 : 10; // Lunch break has 60 mins duration, other breaks have 30 mins duration

          try {
            // create a record in th database
            const nightbreaks = await NightBreaks.create({
              user_id: user._id,
              username: user.username,
              start_date: startOfWeek,
              end_date: endOfWeek,
              status: "PENDING",
              break_type: this.breakTypes[i],
              break_duration: breakDuration,
              time_period: "NIGHT",
            });

            createdNightBreaks.push(nightbreaks);
          } catch (createError) {
            console.error(
              `Error creating night break record for ${user.username}:`,
              createError
            );
          }
        }
      }

      return createdNightBreaks;
    } catch (error) {
      console.log(error);
    }
  }
}

export default GenerateWeeklyBreaks;
