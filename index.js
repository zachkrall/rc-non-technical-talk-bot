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

const user = {
  host: `@**Zach Krall (he) (S1'19)**`,
  all: `@*Currently at RC*`
};

// Set up nice calendar variables
const weekday  = moment().format('dddd');
const today    = moment().format("YYYYMMDD").toString();
const tomorrow = moment(today)
                 .add(1, 'days')
                 .format("YYYYMMDD")
                 .toString();

const time = "T173000";

// wrapped all inside the same get request 😰
axios
.get(process.env.RECURSE_CALENDAR)
.then( (res)=>{

  let data = ical2json.convert(res.data)["VCALENDAR"][0]["VEVENT"];

  if ( weekday === "Monday" ){

    let event_data;
    let nice_date = "tomorrow, " + moment(tomorrow).format("dddd, MMMM Do") + ",";

    for( let i=0; i<data.length; i++ ){
      // If there is an event scheduled for tomorrow
      // (Because this script runs every day and events run twice
      // a week, this may not always be true )
      if (
        data[i]['DTSTART;TZID=America/New_York'] === tomorrow+time
        && data[i]["SUMMARY"] === "Non-technical Talks"
      ){
        event_data = data[i];
      }
    }

    zulip(config).then((client) => {
      client.messages.send({
            to: params.to,
            type: params.type,
            subject: params.subject,
            content: long_message(nice_date, event_data["URL"])
      })
    }).then(console.log);

  } else if ( weekday === "Tuesday" ) {

    let event_data;

    for( let i=0; i<data.length; i++ ){
      // If there is an event scheduled for today
      if (
        data[i]['DTSTART;TZID=America/New_York'] === today+time
        && data[i]["SUMMARY"] === "Non-technical Talks"
      ){
          event_data = data[i];
      }
    }

    zulip(config).then((client) => {
      client.messages.send({
            to: params.to,
            type: params.type,
            subject: params.subject,
            content: short_message("Today", event_data["URL"])
      })
    }).then(console.log);

  } else {

    console.log("Today is not a day I am suppose to be awake for.");
    process.exit();

  }

});


function long_message (date, rsvp_link) {

  return `Hello, friends! Non-technical talks are happening ${date} at 5:30 pm in the presentation space!

Interested in coming? [RSVP to the calendar event](${rsvp_link})!
Wanna give a talk? [Sign up here](${process.env.GOOGLE_SHEET})!

**What are Non-technical talks?**
Non-technical talks happen twice a month at RC. They are an opportunity to share what you are passionate or excited about with your fellow Recursers!

**What are Non-Technical Talks?**
Non-technical Talks are a great way to share your hobbies, interests, recent discoveries, etc with fellow Recusers while also practicing your public speaking skills.
If you feel like your topic is borderline technical, we'd like to encourage you to give that talk anyway.

**How to Prepare**
Talks can be up to 7-10 minutes long (depending on the number of speakers), followed by a few optional minutes of Q&A. Slides are not required, you can present however you feel the most comfortable!

*\`~☆.*。*~.・★

If you have questions or a looking for feedback regarding a talk idea, you can contact ${user.host}! (Please, don't contact me directly... I'm shy) Looking forward to seeing you soon! Beep boop!

${user.all}`;

}

function short_message (date, rsvp_link) {

  return `Hello! Just a reminder that Non-technical talks are happening ${date} at 5:30 pm in the presentation space!

Interested in coming? [RSVP to the calendar event](${rsvp_link})!
Wanna give a talk? [Sign up here](${process.env.GOOGLE_SHEET})!

If you have questions or a looking for feedback regarding a talk idea, you can contact ${user.host}! Looking forward to seeing you soon! Beep boop!`;

}
