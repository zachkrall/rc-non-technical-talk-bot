# Non-Technical Talk Bot

<a href='http://www.recurse.com' title='Made with love at the Recurse Center'><img src="https://cloud.githubusercontent.com/assets/2883345/11325206/336ea5f4-9150-11e5-9e90-d86ad31993d8.png" height="20px"/></a>

## What is "Non-Technical Talk Bot"
Non-Technical Talk Bot is a reminder bot that automatically posts a reminder message the day before "Non-Technical Talks" are scheduled and the day of. 

"Non-Technical Talks" are events at [the Recurse Center](https://recurse.com) where Recursers are able to present on hobbies, interests, recent discoveries, or other non-programming realted aspects of their lives. 

## Installation

To start, clone the repo locally to your machine using
```zsh
git clone https://github.com/zachkrall/rc-non-technical-talk-bot.git
```

Install Node dependencies by running
```zsh
npm install
```

To allow for access to the Zulip API, The Recurse Center calendar, and the Google Sheet for signing up, make a copy of the file `.env.example`
```zsh
cp .env.example .env
```

### Environment Variables

The following environment variables need to be set:
* **ZULIP_USERNAME**, this is the username (email address ending with @recurse.zulipchat.com) assigned to Non-Technical Talk Bot (NTTB).
* **ZULIP_API_KEY**, The API token assigned to NTTB 
* **ZULIP_REALM**, The URL pointing to our Zulip group (https://recurse.zulipchat.com)
* **GOOGLE_SHEET**, the private edit access link for the Google Sheet used for signing up for a presentation slot.
* **RECURSE_CALENDAR**, your Recurse Calendar subscription URL. This can be found [here](https://www.recurse.com/settings/calendar). If you have your subscriptions set to "Only events I'm attending," then add `&scope=all` to the end of your subscription URL.

### Updating `index.js`

Right now, Non-Technical Talk Bot tags the event host in each message that it sends. To update the host of Non-Technical Talks, change the following object on [Line 38](https://github.com/zachkrall/rc-non-technical-talk-bot/blob/master/index.js#L38) of index.js
```js
const user = {
    host: `@**[Name] [Pronouns] [Batch]**`,
    all: `@*Currently at RC*`
}
```
If you are unsure of how to properly format your name so that it is tagged correctly, you can copy and paste from the unformatted mark down in a message on Zulip.
