const weekdays = new Array(7);
weekdays[0] = "Sunday";
weekdays[1] = "Monday";
weekdays[2] = "Tuesday";
weekdays[3] = "Wednesday";
weekdays[4] = "Thursday";
weekdays[5] = "Friday";
weekdays[6] = "Saturday";

export const Weekdays = {
  weekdays,
  getWeekdayStringFromDate: (date) => weekdays[date.getDay()],
};
