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
	const exampleUrl = url === 'https://hypem.com/popular';
	request(url, function (error, response, html) {
		if (!error) {
			$ = cheerio.load(html);
		}
		if (!!exampleUrl) {
			// console.log('Using sample Url');
			// console.log('🚀 ~ $.html', $.html);
			let rank = [];
			let thumb = [];
			let artist = [];
			let baseTitle = [];
			let remixLink = [];
			let socialMedia = [];
			let socialMediaLink = [];
			let headerLogo = [
				{
					title: $('#header')
						.find('.logo-txt')
						.attr('title'),
					href: $('#header').find('.logo-txt').attr('href'),
				},
			];

			let hypeMachineData = {
				html: $.html(),
				rank,
				thumb,
				artist,
				baseTitle,
				remixLink,
				socialMedia,
				socialMediaLink,
				headerLogo,
			};

			let jsonObj = JSON.stringify(hypeMachineData);
			// console.log('🚀 ~ jsonObj AAA', jsonObj);

			$('.section-player').each((idx, el) => {
				rank.push({
					value: $(el).find('.rank').text(),
					id: idx,
				});
				thumb.push({
					value: $(el).find('.thumb').attr('href'),
					id: idx,
				});
				artist.push({
					value: $(el).find('.track_name > .artist').text(),
					id: idx,
				});
				baseTitle.push({
					value: $(el)
						.find('.track_name > .track .base-title')
						.text(),
					id: idx,
				});
				remixLink.push({
					value: $(el)
						.find('.track_name > .track .remix-link')
						.text(),
					id: idx,
				});
				socialMedia.push({
					value: $(el).find('.meta > .download > a').text(),
					id: idx,
				});
				socialMediaLink.push({
					value: $(el)
						.find('.meta > .download > a')
						.attr('href'),
					id: idx,
				});
			});
			if (jsonObj.length > 0) {
				res.setHeader('Content-Type', 'application/json');
				res.status(200);
				// res.end({ jsonObj });
				res.json(jsonObj);
				// res.send({ hypeMachineData });
			}
		} else {
			res.send($.html());
			res.status(200).end();
		}
	});
});

app.listen(process.env.PORT || port || '8081');
// console.log(`listening on port ${port}`);
exports = module.exports = app;
