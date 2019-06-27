// Use this to delete messages the bot sends by accident.

// const zulip = require('zulip-js');
//
// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').config();
// }
//
// const config = {
//   username: process.env.ZULIP_USERNAME,
//   apiKey: process.env.ZULIP_API_KEY,
//   realm: process.env.ZULIP_REALM
// };
//
// zulip(config).then(
//   (client) => {
//     return client.messages.update({
//       message_id: "",
//       content: ""
//     });
//   }
// ).then(console.log);
