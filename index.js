const axios = require('axios');
const ical2json = require('ical2json');
const moment = require('moment');
const zulip = require('zulip-js');

// Import Environment Variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Zulip API Config Settings
const config = {
  username: process.env.ZULIP_USERNAME,
  apiKey: process.env.ZULIP_API_KEY,
  realm: process.env.ZULIP_REALM
};

// Posting to stream settings
// const params = {
//   to: '397 Bridge',
//   type: 'stream',
//   subject: 'non-technical talks'
// };

// Pull username formatting for tagging in Zulip
const user = {
  host: `@**Zach Krall (he) (S1'19)**`,
  host_email: 'zach@zachkrall.com',
  all: `@*Currently at RC*`
};

// Set up nice calendar variables
const today    = moment()
                 .format("YYYYMMDD")
                 .toString();
const weekday  = moment(today)
                 .format('dddd');
const tomorrow = moment(today)
                 .add(1, 'days')
                 .format("YYYYMMDD")
                 .toString();
const time     = "T173000"; // this is some crazy time formatting thing
const timezone = "DTSTART;TZID=America/New_York";


(async () => {

  let res = await axios.get(process.env.RECURSE_CALENDAR);
  let events = ical2json.convert(res.data)["VCALENDAR"][0]["VEVENT"];

  if (weekday === "Monday") {

    // Gramatically correct date formatting for message string
    let date = "tomorrow, " + moment(tomorrow).format("dddd, MMMM Do") + ",";

    const cal = events.filter(e => {

      // Parameters that return TRUE/FALSE
      const matchTime  = e[timezone] === tomorrow+time;
      const matchTitle = e["SUMMARY"] === "Non-technical Talks";

      // if date of event is tomorrow
      // and title matches Non-Technical Talks
      // then we can keep this object
      // otherwise, remove it from array
      return matchTime && matchTitle;

    });

    const client = await zulip(config);

    if( cal.length == 1 ){
      // we only want to post a message to Zulip
      // if there is an event inside myEvent ...

      // if multiple events are found ... that's
      // a problem and we shouldn't run the bot
      return client.messages.send({
        to: params.to,
        type: params.type,
        subject: params.subject,
        content: long_message(date, cal[0]["URL"])
      });

    } else if ( cal.length > 1 ){
      // Send event host an email if this doesn't run correctly.
      return client.messages.send({
        to: user.host_email,
        type: 'private',
        subject: 'Non-Technical Talk Bot',
        content: 'Error: More than one event found!'
      });
    }

  } else if (weekday === "Tuesday") {

      const cal = events.filter(e => {

        // same as above
        const matchTime  = e[timezone] === today+time;
        const matchTitle = e["SUMMARY"] === "Non-technical Talks";
        return matchTime && matchTitle;

      });

      const client = await zulip(config);

      if( cal.length == 1 ){

        return client.messages.send({
          to: params.to,
          type: params.type,
          subject: params.subject,
          content: short_message("Today", cal[0]["URL"])
        });

      } else if ( cal.length > 1 ){

        return client.messages.send({
          to: user.host_email,
          type: 'private',
          subject: 'Non-Technical Talk Bot',
          content: 'Error: More than one event found!'
        });
      }

  }

  // This should only run if nothing matches above
  return console.log('No matching events found...');
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

If you have questions or are looking for feedback regarding a talk idea, you can contact ${user.host}! (Please, don't contact me directly... I'm shy) Looking forward to seeing you soon! Beep boop!

${user.all}`;

}

function short_message (date, rsvp_link) {

  return `Hello! Just a reminder that Non-technical talks are happening ${date} at 5:30 pm in the presentation space!

:calendar: Interested in coming? [RSVP to the calendar event](${rsvp_link})!
:speech_balloon: Wanna give a talk? [Sign up here](${process.env.GOOGLE_SHEET})!

If you have questions or are looking for feedback regarding a talk idea, you can contact ${user.host}! Looking forward to seeing you soon! Beep boop!`;

}
