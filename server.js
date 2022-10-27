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
			// console.log('🚀 ~ html', html);
			// console.log('🚀 ~ $.html', $.html);
			// console.log(
			// 	'🚀 ~ .section-player',
			// 	$('.section-player')
			// );
			$('.section-player').each((idx, el) => {
				const item = $(el).text();
				const rank = $(el).find('.rank').text();
				// const track = $(el).find('.track_name').text();
				const thumb = $(el).find('.thumb').attr('href');
				$(el)
					.find('.track_name')
					.each((idx, elm) => {
						const artist = $(elm).find('.artist').text();
						$(elm)
							.find('.track')
							.each((idx, elme) => {
								const baseTitle = $(elme)
									.find('.base-title')
									.text();
								const remixLink = $(elme)
									.find('.remix-link')
									.text();
								console.log('🚀 ~ remixLink', remixLink);
								console.log('🚀 ~ baseTitle', baseTitle);
							});
						console.log('🚀 ~ artist', artist);
					});
				$(el)
					.find('.meta')
					.each((idx, elmen) => {
						const socialMedia = $(elmen)
							.find('.download > a')
							.text();
						const socialMediaLink = $(elmen)
							.find('.download > a')
							.attr('href');
						console.log('🚀 ~ socialMedia', socialMedia);
						console.log(
							'🚀 ~ socialMediaLink',
							socialMediaLink
						);
					});
				// console.log('🚀 ~ item', item);
				console.log('🚀 ~ rank', rank);
				console.log('🚀 ~ thumb', thumb);
			});
		}
		res.send($.html());
	});
});

app.listen(process.env.PORT || port || '8081');
// console.log(`listening on port ${port}`);
exports = module.exports = app;
