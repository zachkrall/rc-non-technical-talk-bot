const axios = require('axios');
const ical2json = require('ical2json');
const moment = require('moment');
const path = require('path');
const zulip = require('zulip-js');

// YIKES! This is kind of messy right now.

// TO DO:
// [ ] only call axios get request when data is needed
// [ ] create tests?
// [ ] async / await
// [ ] put message generation into a module?


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const config = {
  username: process.env.ZULIP_USERNAME,
  apiKey: process.env.ZULIP_API_KEY,
  realm: process.env.ZULIP_REALM
};

const params = {
  to: '397 Bridge',
  type: 'stream',
  subject: 'non-technical talks'
};

// const params = {
//   to: 'zach@zachkrall.com',
//   type: 'private',
//   subject: 'non-technical talks'
// };

const user = {
  host: `@**Zach Krall (he) (S1'19)**`,
  all: `@*Currently at RC*`
};

// Set up nice calendar variables
const weekday  = moment().format('dddd');
const today    = moment().format("YYYYMMDD").toString();
// const weekday = "Tuesday";
// const today = "20190709";

const tomorrow = moment(today)
                 .add(1, 'days')
                 .format("YYYYMMDD")
                 .toString();

const time = "T173000";

(async () => {

  var res = await axios.get(process.env.RECURSE_CALENDAR);
  let events = ical2json.convert(res.data)["VCALENDAR"][0]["VEVENT"];

  if (weekday === "Monday") {

    let nice_date = "tomorrow, " + moment(tomorrow).format("dddd, MMMM Do") + ",";

    // If there is an event scheduled for tomorrow
    // (Because this script runs every day and events run twice
    // a week, this may not always be true )
    const myEvent = events.filter(currentEvent => {

      const isMatchingTime = currentEvent['DTSTART;TZID=America/New_York'] === tomorrow+time;
      const isCorrectTitle = currentEvent["SUMMARY"] === "Non-technical Talks";

      return isMatchingTime && isCorrectTitle;
    });

    const client = await zulip(config);

    return client.messages.send({
      to: params.to,
      type: params.type,
      subject: params.subject,
      content: long_message(nice_date, myEvent["URL"])
    });
  }

  if (weekday === "Tuesday") {

    const myEvent = events.filter(currentEvent => {

      const isToday = currentEvent['DTSTART;TZID=America/New_York'];
      const isCorrectTitle = currentEvent["SUMMARY"] === "Non-technical Talks";

      return isToday && isCorrectTitle;
    });

    const client = await zulip(config);

    return client.messages.send({
      to: params.to,
      type: params.type,
      subject: params.subject,
      content: short_message("Today", myEvent["URL"])
    });
  }

  console.log("Today is not a day I am suppose to be awake for.");
  process.exit();
})();

function long_message (date, rsvp_link) {

  return `Hello, friends! Non-technical talks are happening ${date} at 5:30 pm in the presentation space!

:calendar: Interested in coming? [RSVP to the calendar event](${rsvp_link})!
:speech_balloon: Wanna give a talk? [Sign up here](${process.env.GOOGLE_SHEET})!

**What are Non-Technical Talks?**
Non-technical Talks are a great way to share your hobbies, interests, recent discoveries, etc with fellow Recusers while also practicing your public speaking skills.
If you feel like your topic is borderline technical, we'd like to encourage you to give that talk anyway.

**How to Prepare**
:clock: Talks can be up to 7-10 minutes long (depending on the number of speakers)
:raising_hand: You can have an optional Q&A of around 2 minutes
:laptop: Slides are not required, you can present however you feel the most comfortable!

*\`~☆.*。*~.・★

If you have questions or a looking for feedback regarding a talk idea, you can contact ${user.host}! (Please, don't contact me directly... I'm shy) Looking forward to seeing you soon! Beep boop!

${user.all}`;

}

function short_message (date, rsvp_link) {

  return `Hello! Just a reminder that Non-technical talks are happening ${date} at 5:30 pm in the presentation space!

:calendar: Interested in coming? [RSVP to the calendar event](${rsvp_link})!
:speech_balloon: Wanna give a talk? [Sign up here](${process.env.GOOGLE_SHEET})!

If you have questions or a looking for feedback regarding a talk idea, you can contact ${user.host}! Looking forward to seeing you soon! Beep boop!`;

}
