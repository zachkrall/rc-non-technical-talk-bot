// I decided to not do it this way...


let debug = false;

// Enable importing .env file in development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
  debug = true;
}

const sign_up = process.env.GOOGLE_SHEET;

const today = debug ? "20190708" : moment().format("YYYYMMDD");

let tomorrow = moment(today)
               .add(1, 'days')
               .format("YYYYMMDD")
               .toString()
               + "T173000";

const reminder = {

  next_event: async function () {

    let rsvp = "";

    axios
    .get(process.env.RECURSE_CALENDAR)
    .then( (res)=>{

      let data = ical2json.convert(res.data)["VCALENDAR"][0]["VEVENT"];

      for( let i=0; i<data.length; i++ ){
        if (
          data[i]['DTSTART;TZID=America/New_York'] === tomorrow
          && data[i]["SUMMARY"] === "Non-technical Talks"
        ){
            rsvp = data[i]["URL"];
        }
      }

    });

    return {
      "rsvp": rsvp
    }

  },

  message: async function () {

    let next_event = await reminder.next_event();

    let message = `Beep Boop! :robot:
Hello, human-friends! Non-technical talks are happening tomorrow at 5:30 pm in the presentation space!

Interested in coming? [RSVP to the calendar event](${next_event.rsvp})!
Wanna give a talk? [Sign up here](${sign_up})!

**What are Non-technical talks?**
Non-technical talks happen twice a month at RC. They are an opportunity to share what you are passionate or excited about with your fellow Recursers!

**What are Non-Technical Talks?**
Non-technical Talks are a great way to share your hobbies, interests, recent discoveries, etc with fellow Recusers while also practicing your public speaking skills.
If you feel like your topic is borderline technical, we'd like to encourage you to give that talk anyway.

**How to Prepare**
Talks can be up to 7-10 minutes long (depending on the number of speakers), followed by a few optional minutes of Q&A. Slides are not required, you can present however you feel the most comfortable!

*\`~☆.*。*~.・★

If you have questions or a looking for feedback regarding a talk idea, you can contact @**Zach Krall**! Looking forward to seeing you on Tuesday!
`;

    return message;
  }

}

module.exports = reminder;
