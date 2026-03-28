import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const client_id = "71af79e70d7f461bb0b0eea94d84aac4";
const client_secret = "xxxxxx";
const redirect_uri = "http://127.0.0.1:5500/";

app.get("/token", async (req, res) => {
  const code = req.query.code;

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirect_uri,
    }),
  });

  const data = await response.json();
  console.log("SPOTIFY RESPONSE:", data);

  res.json(data);
});

app.listen(3000, () => console.log("Server running on port 3000"));