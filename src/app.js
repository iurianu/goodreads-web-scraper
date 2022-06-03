
const feedDisplay = document.querySelector('#feed')

fetch('http://localhost:8000/results')
	.then(response => {return response.json()})
	.then(data => {
		data.forEach(bookinfo => {

			const title 	= bookinfo.title
			const author 	= bookinfo.authorlist.map(( item ) => { return `&nbsp;${item.author}` })
			const isbn 		= bookinfo.isbn
			const pages 	= bookinfo.bookpages.map(( item ) => { return `&nbsp;${item.allpages}` })
			const image     = bookinfo.image
			const genre 	= bookinfo.genrelist.map(( item ) => { return `&nbsp;${item.genre}` })
			
			function series(){
				if (bookinfo.series == undefined) { return (` `) } 
				else { return (`<h3>Series: <span>${bookinfo.series}</span></h3>`) }
			}
			function description() {
				const textcontent = bookinfo.textlist[1]
				if (textcontent == undefined || textcontent == '') { 
					return (` `) 
				} 
				else { return (`<blockquote><h4>Description: </h4><p>${textcontent.text}</p></blockquote>`) }		
			}

			const content = `<section class="col-8 py-5 position-relative">
								<h2 class="pb-3"><span class="title d-block">` + title + `</span></h2>`
								+ series() +
								`<h4>Author: <span class="authors">` + author[0] + `</span></h4>`
								+ description() +
								`<fieldset class="p-3 position-absolute">
									<p>ISBN: ` + isbn + `</p>
									<p>Genre:` + genre[0] + `</p>
									<p>Pages: <span itemprop="bookPagesNumber">` + pages + `</span></p>
								</fieldset>
							</section>
							<figure class="col-4"><img src="` + image + `"></figure>`
			feedDisplay.insertAdjacentHTML("beforeend", content)
		})
	})
	.catch(err => console.log(err))

	