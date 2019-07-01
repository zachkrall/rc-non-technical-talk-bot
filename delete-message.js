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

zulip(config).then(
  (client) => {
    return client.messages.update({
      message_id: "169367809",
      content: "[deleted]"
    });
  }
).then(console.log);
