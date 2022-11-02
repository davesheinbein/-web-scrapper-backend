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
			let data = {
				html: [],
				rank: [],
				thumb: [],
				artist: [],
				baseTitle: [],
				remixLink: [],
				socialMedia: [],
				socialMediaLink: [],
				headerLogo: [
					{
						title: $('#header')
							.find('.logo-txt')
							.attr('title'),
						href: $('#header')
							.find('.logo-txt')
							.attr('href'),
					},
				],
			};

			$('.section-player').each((idx, el) => {
				data.rank.push({
					value: $(el).find('.rank').text(),
					id: idx,
				});
				data.thumb.push({
					value: $(el).find('.thumb').attr('href'),
					id: idx,
				});
				data.artist.push({
					value: $(el).find('.track_name > .artist').text(),
					id: idx,
				});
				data.baseTitle.push({
					value: $(el)
						.find('.track_name > .track .base-title')
						.text(),
					id: idx,
				});
				data.remixLink.push({
					value: $(el)
						.find('.track_name > .track .remix-link')
						.text(),
					id: idx,
				});
				data.socialMedia.push({
					value: $(el).find('.meta > .download > a').text(),
					id: idx,
				});
				data.socialMediaLink.push({
					value: $(el)
						.find('.meta > .download > a')
						.attr('href'),
					id: idx,
				});
			});

			data.html.push($.html());

			let jsonObj = JSON.stringify(data);

			console.log('🚀 ~ data', data);
			// if (data.socialMediaLink.length >= 20) {
			console.log('🚀 ~ data', data);
			res.setHeader('Content-Type', 'application/json');
			res.status(200);
			// res.end({ jsonObj });
			res.json(jsonObj);
			// res.send({ hypeMachineData });
			// }
		} else {
			res.send($.html());
			res.status(200).end();
		}
	});
});

app.listen(process.env.PORT || port || '8081');
// console.log(`listening on port ${port}`);
exports = module.exports = app;
