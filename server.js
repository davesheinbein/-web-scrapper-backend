const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const app = express();
const cors = require('cors');

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

app.listen('8081');
console.log('on port 8081');
exports = module.exports = app;
