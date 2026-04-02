const https = require("https");

function send_dispatch_channel({ channelName, title, description, fields }) {
  const data = JSON.stringify({ channelName, title, description, fields });

  const req = https.request(
    {
      hostname: "tls-dev.avanteconnected.com",
      path: "/dispatch/bot/channel/send",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
      },
    },
    (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        console.log("Status:", res.statusCode, body);
      });
    }
  );

  req.on("error", (err) => console.error("Error:", err.message));
  req.write(data);
  req.end();
}

module.exports = send_dispatch_channel;