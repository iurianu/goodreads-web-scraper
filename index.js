const PORT = 8000
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())

// Cartea amagirilor (Emil Cioran)
const ISBN = '973-50-1461-0' 
// const ISBN = '978-973-50-1461-2' -> broken

// Lettres persanes (Montesquieu)
//const ISBN = '9782-2-530-8222-4'

// Dreamlands (H.P. Lovecraft)
//const ISBN = '978-1-78428-829-7'

// The Final Empire (Brandon Sanderson)
//const ISBN = '978-0-575-08991-4'

const url = 'https://www.goodreads.com/book/isbn/' + ISBN

app.get('/', function(req, res) {
	res.json('This is my webscraper')
})

app.get('/results', (req, res) => {

	axios(url)
		.then(response => {

			const html = response.data
			const $ = cheerio.load(html)

			const isbn = ISBN

			const bookinfo = [],
				  authorlist = [],
				  genrelist = [],
				  bookpages = [],
				  textlist = []

			$('.mainContentFloat', html).each(function() {

				const title = $(this).find('#bookTitle').text()

				function series() {
					const getseries = $(this).find('#bookSeries').text()
					if (typeof getseries != null) {
						getseries.split('(')[1].split(')')[0]
					} else {
						return false
					}
				}				

				const description = $(this).find('#description span')
				const image = $(this).find('#coverImage').attr('src')
				const authors = $(this).find('.authorName')
				const genres = $(this).find('.rightContainer').find('.left')
				const details = $(this).find('#details')
				const pages = $(this).find('#details').find('[itemprop="numberOfPages"]')
				pages.each(function() {
					const allpages = $(this).text().split(' ')[0]
					bookpages.push({ 
						allpages
					})
				})
				description.each(function() {
					const text = $(this).text()
					textlist.push({
						text
					})
				})
				authors.each(function() {
					const author = $(this).find('span[itemprop="name"]').text()
					authorlist.push( {
						author
					})
				})
				genres.each(function() {
					const genre = $(this).find('a').text()
					genrelist.push( {
						genre
					})
				})
				
				bookinfo.push( {
					title,
					series,
					authorlist,
					isbn,
					bookpages,
					genrelist,
					textlist,
					image
				})
			})
			res.json(bookinfo)

		}).catch(err => console.log('link is broken'))
	
})

app.listen(PORT, () => console.log(`scraper running on PORT ${PORT}`))

// https://www.goodreads.com/book/isbn/978-0-575-08991-4