import {news} from './news.js';

const createNews = (news, body) =>`
	<li class="news_item">
        <h1>${news}</h1>
        ${body}	
	</li>
`;


const renderNews = news =>{
	const markup = `
	    ${news.map(el => createNews(el.headline, el.desc)).join('')}
	`;
	document.querySelector('.news_body').insertAdjacentHTML('afterbegin', markup);
}


renderNews(news);