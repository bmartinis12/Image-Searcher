// variables 

let searchBtn = document.querySelector('#search-addon');
let searchInput = document.querySelector('.search-input');
let picturesDiv = document.querySelector('.pictures');
let dropDown = document.querySelector('.dropdown-menu');
let pageNum = document.querySelector('.page-num');
let next = document.querySelector('.next');
let previous = document.querySelector('.previous');

// Fetch photo data 

async function getImages(input, page) {
    return await fetch(`/pictures/${input}?page=${page}`)
        .then((response) => response.json())
        .then((data) => data);
}

// enter search query 

searchBtn.addEventListener('click', async function(){
    let currPage = 1;
    let input = searchInput.value;

    if(!input || input == ''){
        alert('Please enter a vaild search query.');
        input = '';
        picturesDiv.innerHTML = '';
        return;
    }

    let data = await getImages(input, currPage);
    if(data.errors){
        alert(`There has been an error. Sorry for the inconvenience! \n ${data.errors}`);
        input = '';
        picturesDiv.innerHTML = '';
        return;
    }

    await saveSearch(input);
    pageNum.textContent = `${currPage}/${Math.ceil(data.total_pages)}`;
    addPhotos(data.results);

    // next button 

    next.addEventListener('click', async function(){
        if(currPage == data.total_pages){
            return;
        }
        currPage++;
        data = await getImages(input, currPage);
        pageNum.textContent = `${currPage}/${Math.ceil(data.total_pages)}`;
        addPhotos(data.results);
    })

    // previous button 

    previous.addEventListener('click', async function(){
        if(currPage == 1){
            return;
        }
        currPage--;
        data = await getImages(input, currPage);
        pageNum.textContent = `${currPage}/${Math.ceil(data.total_pages)}`;
        addPhotos(data.results);
    })
})

// function to add photos to webpage 
function addPhotos(data) {
    picturesDiv.innerHTML = '';
    data.forEach(pic => {
        let picHTML = `
            <a class='pic-link' target='_blank' href='${pic.links.html}'>
                <img src='${pic.urls.thumb}' alt='${pic.alt_description}'>
            </a>
        `;
        picturesDiv.innerHTML += picHTML;
    })
}

// on page load 

document.addEventListener('DOMContentLoaded', async function(){
    let searches = fetch('/searches')
        .then((response) => response.json())
        .then((data) => {
            data.forEach(search => {
                let html = `
                    <li><a class="dropdown-item">${search.searchQuery}</a></li>
                `
                dropDown.innerHTML += html;
            })
        });
});

// click on one of the recently searched queries

dropDown.addEventListener('click', function(event){
    searchInput.value = event.target.textContent;  
    searchBtn.click();       
})

// function to add search to database 

async function saveSearch(input) {
    await fetch('/searches', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            search: input
        })
    }).then((response) => response.text())
    .then((data) => data);
}
