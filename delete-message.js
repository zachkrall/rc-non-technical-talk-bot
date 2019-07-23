// Use this to delete messages the bot sends by accident.

const zulip = require('zulip-js');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const config = {
  username: process.env.ZULIP_USERNAME,
  apiKey: process.env.ZULIP_API_KEY,
  realm: process.env.ZULIP_REALM
};

// https://recurse.zulipchat.com/#narrow/stream/19042-397-Bridge/topic/non-technical.20talks/near/169367809

function myMessage(){

    return `Hello, friends! Non-technical talks are happening tomorrow, Tuesday, July 9th, at 5:30 pm in the presentation space!

:calendar: Interested in coming? [RSVP to the calendar event](https://www.recurse.com/calendar/6658)!
:speech_balloon: Wanna give a talk? [Sign up here](https://docs.google.com/spreadsheets/d/1FPMxayeJiP5x94Bx2MSF0bhPWGNPsWoMa4yXLSIgByE/edit)!

**What are Non-Technical Talks?**
Non-technical Talks are a great way to share your hobbies, interests, recent discoveries, etc with fellow Recusers while also practicing your public speaking skills.
If you feel like your topic is borderline technical, we'd like to encourage you to give that talk anyway.

**How to Prepare**
:clock: Talks can be up to 7-10 minutes long (depending on the number of speakers)
:raising_hand: You can have an optional Q and A of around 2 minutes
:laptop: Slides are not required, you can present however you feel the most comfortable!

If you have questions or a looking for feedback regarding a talk idea, you can contact @**Zach Krall (he) (S1'19)**! (Please, don't contact me directly... I'm shy) Looking forward to seeing you soon! Beep boop!

@*Currently at RC*`;

}

zulip(config).then(
  (client) => {

    let message = myMessage();

    return client.messages.update({
      message_id: "169881562",
      content: message
    });
  }
).then(console.log);
