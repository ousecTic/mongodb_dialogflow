require("dotenv").config();
const express = require("express");
const app = express();

const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;
const Song = require("./models/Song");

const { WebhookClient } = require("dialogflow-fulfillment");

//middleware

app.use(express.json());

//main code =====================

let seventies = new Song({
  decade: "1970s",
  artist: "Debby Boone",
  song: "You Light Up My Life",
  weeksAtOne: 10
});

seventies
  .save()
  .then(() => console.log("add to database"))
  .catch(err => console.log(err));

app.post("/", async (request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log("Dialogflow Request headers:" + JSON.stringify(request.headers));
  console.log("Dialogflow Request body: " + JSON.stringify(request.body));

  async function welcome(agent) {
    return Song.find({ song: "You Light Up My Life" })
      .then(songs => {
        console.log(songs[0].song);
        agent.add(
          `Welcome to my agent! Would you like to listen ${songs[0].song}`
        );
      })
      .catch(err => {
        agent.add(`There is some problem`);
      });
  }
  async function fallback(agent) {
    agent.add("I didn't understand");
    agent.add("I am sorry, can you try again?");
  }
  let intentMap = new Map();
  intentMap.set("Default Welcome Intent", welcome);
  intentMap.set("Default Fallback Intent", fallback);
  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});

//===============================

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(response => console.log("MongoDb is connected"))
  .catch(err => console.log(err));

app.listen(PORT, () => {
  console.log(`Server has started at port ${PORT}`);
});
