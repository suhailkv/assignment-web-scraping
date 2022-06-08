const data = require("./helper/data");
// const bodyParser = require("body-parser");

// app.use(bodyParser.json());
const express = require("express");
const app = express();
app.get("/getTimeStories", (req, resp) => {
  const https = require("https");
  const url = "https://time.com/";
  https
    .get(url, (res) => {
      console.log(res.statusCode);
      res.setEncoding("utf8");
      let response = "";

      res.on("data", (data) => {
        response += data;
      });

      res.on("end", function jsonData() {
        let latestStories = [];
        const storyExtractor = response.match(
          /<h3 class="latest-stories__item-headline">(.*?)</g
        );
        if (storyExtractor != null) {
          storyExtractor.forEach((content) => {
            latestStories.push({ title: content.split(">")[1].slice(0, -1) });
          });
        }

        let links = [];
        const linkExtractor = response.match(/latest-stories__item">\n(.*)">/g);
        if (linkExtractor != null) {
          linkExtractor.forEach((content) => {
            links.push(url + content.split('"')[2]);
          });
        }

        const newObj = latestStories.map((story, link) => ({
          ...story,
          link: links[link],
        }));
        resp.send(newObj);
      });
    })
    .on("error", function (err) {
      console.log(err);
    });
});

app.listen(3000, () => {
  console.log("server working perfectly");
});
