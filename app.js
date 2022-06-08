const https = require("https");
const http = require("http");
const url = "https://time.com/";

var server = http.createServer(function (req, resp) {
  // 2 - creating server

  if (req.url == "/getTimeStories") {
    https
      .get(url, (res) => {
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
          const linkExtractor = response.match(
            /latest-stories__item">\n(.*)">/g
          );
          if (linkExtractor != null) {
            linkExtractor.forEach((content) => {
              links.push(url + content.split('"')[2]);
            });
          }

          const newData = latestStories.map((story, link) => ({
            ...story,
            link: links[link],
          }));
          resp.writeHead(200, { "Content-Type": "application/json" });
          resp.write(JSON.stringify(newData));
          resp.end();
        });
      })
      .on("error", function (err) {
        console.log(err);
      });
  } else {
    resp.write(JSON.stringify({ message: "Error occured" }));
    resp.end();
  }
});

server.listen(3000);
