const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const axios = require('axios');
const timeout = require('connect-timeout');
const app = express();
const cors = require('cors');
const port = 8081;

app.use(
	cors({
		origin: '*',
	})
);

let data = {
	html: [],
	rank: [],
	thumb: [],
	thumbnail: [],
	artist: [],
	baseTitle: [],
	remixLink: [],
	socialMedia: [],
	socialMediaLink: [],
	headerLogo: [],
};

let customData = {
	html: [],
};

app.get(
	'/',
	(
		// req: Request<P, ResBody, ReqBody, ReqQuery, Locals>,
		// res: Response<ResBody, Locals>
		req,
		res
	) => {
		res.json('Hello please navigate to /scrape');
	}
);

app.get('/scrape', (req, res) => {
	// url = req.query.url;
	url = 'https://hypem.com/popular';
	var $;
	const exampleUrl = url === 'https://hypem.com/popular';

	axios
		.get(url)
		.then((response) => {
			const html = response.data;
			const $ = cheerio.load(html);

			if (!!exampleUrl) {
				$('.section-player', html).each((idx, el) => {
					data.rank.push({
						value: $(el).find('.rank').text(),
						id: idx,
					});
					data.thumb.push({
						value: $(el).find('.thumb').attr('href'),
						id: idx,
					});
					data.thumbnail.push({
						value: $(el)
							.find('.thumb')
							.attr('style')
							.match(/\((.*?)\)/)[1]
							.replace(/('|")/g, ''),
						id: idx,
					});
					data.artist.push({
						value: $(el)
							.find('.track_name > .artist')
							.text(),
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
						value: $(el)
							.find('.meta > .download > a')
							.text(),
						id: idx,
					});
					data.socialMediaLink.push({
						value: $(el)
							.find('.meta > .download > a')
							.attr('href'),
						id: idx,
					});
					data.headerLogo.push({
						title: $('#header')
							.find('.logo-txt')
							.attr('title'),
						href: $('#header')
							.find('.logo-txt')
							.attr('href'),
					});
					data.html.push(html);

					let jsonObj = JSON.stringify(data);

					if (data.socialMediaLink.length >= 20) {
						res.setHeader(
							'Content-Type',
							'application/json'
						);
						res.status(200);
						res.json(jsonObj);
					}
				});
			} else {
				customData.push({ html: $.html() });
				let jsonObj = JSON.stringify(data);
				res.send(jsonObj);
				res.status(200).end();
			}
		})
		.catch((err) => console.log('Error:', err));
});

function haltOnTimedout(req, res, next) {
	if (!req.timedout) next();
}

app.use(timeout(60000));
app.use(haltOnTimedout);

app.listen(process.env.PORT || port || '8081');
exports = module.exports = app;
