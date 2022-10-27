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
			console.log('Using sample Url');
			// console.log('🚀 ~ $.html', $.html);
			let rank = [];
			let thumb = [];
			let artist = [];
			let baseTitle = [];
			let remixLink = [];
			let socialMedia = [];
			let socialMediaLink = [];
			$('.section-player').each((idx, el) => {
				rank.push({
					value: $(el).find('.rank').text(),
					id: idx,
				});
				thumb.push({
					value: $(el).find('.thumb').attr('href'),
					id: idx,
				});
				$(el)
					.find('.track_name')
					.each((idx, elm) => {
						artist.push({
							value: $(elm).find('.artist').text(),
							id: idx,
						});
						$(elm)
							.find('.track')
							.each((idx, elme) => {
								baseTitle.push({
									value: $(elme).find('.base-title').text(),
									id: idx,
								});
								remixLink.push({
									value: $(elme).find('.remix-link').text(),
									id: idx,
								});
							});
					});
				$(el)
					.find('.meta')
					.each((idx, elmen) => {
						socialMedia.push({
							value: $(elmen).find('.download > a').text(),
							id: idx,
						});
						socialMediaLink.push({
							value: $(elmen)
								.find('.download > a')
								.attr('href'),
							id: idx,
						});
					});
				console.log('🚀 ~ rank', rank);
				console.log('🚀 ~ thumb', thumb);
				console.log('🚀 ~ artist', artist);
				console.log('🚀 ~ baseTitle', baseTitle);
				console.log('🚀 ~ remixLink', remixLink);
				console.log('🚀 ~ socialMedia', socialMedia);
				console.log(
					'🚀 ~ socialMediaLink',
					socialMediaLink
				);
			});
		}
		res.send($.html());
	});
});

app.listen(process.env.PORT || port || '8081');
// console.log(`listening on port ${port}`);
exports = module.exports = app;
