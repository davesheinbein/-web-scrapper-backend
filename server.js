const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const app = express();
const cors = require('cors');
const port = 8081;

app.use(
	cors({
		origin: '*',
	})
);

app.get('/scrape', function (req, res) {
	url = req.query.url;
	var $;
	request(url, function (error, response, html) {
		if (!error) {
			$ = cheerio.load(html);
		}
		res.send($.html());
	});
});

app.listen(port || '8081');
// console.log(`listening on port ${port}`);
exports = module.exports = app;
