const API_URL = "https://evening-atoll-40460.herokuapp.com";
let booksContainer = document.querySelector('.books-container');
let bookName = document.createElement('h2');
let authorsName = document.getElementsByClassName("letters-content")
let seeMoreButton = document.querySelector('.see_more');
let bookModalClose = document.querySelector('.book-modal-close');
let indexBooks = 10;

let dataBooks;
let dataAuthors;

const getBooks = async() => {
    const response = await fetch(`${API_URL}/books`);
    const dataBooks = await response.json();
    
    return dataBooks;
}

const getBook = async(id) => {
    const response = await fetch(`${API_URL}/books/${id}`);
    const dataBook = await response.json();
    
    return dataBook;
}

const getAuthors = async() => {
    const response = await fetch(`${API_URL}/authors`);
    const dataAuthors = await response.json();
    
    return dataAuthors;
}

const mergeBooksAuthors = async (books, authors) => {
    let tmp = [];
    let returnTab = [];

    //Merge books / author
    books.forEach(book => {
        authors.forEach(author => {
            if(book.authors){
                book.authors.forEach(element => {
                    if(element == author.id) {
                        tmp.push({
                            title: book.title,
                            author: [author.name]
                        })
                    }
                });
            }
        });
    });
    // console.log(books)
    // books.map(obj => 
    //     {
    //         if(obj.authors)
    //         obj.authors.forEach(element => {
    //             // console.log(element)
    //             authors.find(o => o.id == element);
    //         });
            
    //     });
    // console.log(books);
    // let temp;
    // let newTab = [];
    // for(let i=0; i<tmp.length-1; i++){
    //     if(tmp[i].title === tmp[i+1].title){
    //         temp = tmp[i].author;
    //         const index = tmp.indexOf(tmp[i]);
    //         if (index > -1) {
    //             tmp.splice(index, 1);
    //         }
    //         newTab.push({title: tmp[i].title, author: [tmp[i+1], temp]})
    //     }
    //     else {
    //         newTab.push(tmp[i]);
    //     }
    //     temp = [];
    // }

    return tmp;
}

const getAuthorsForBook = (book) => {

    let authors = [];
    book.authors.forEach(bookAuthor => {
        dataAuthors.forEach(author => {
            if(bookAuthor == author.id) {
                authors.push(author.name)
            }
        });
    });

    return authors;
}

const getBookRating = (book) => {

    let starOutline = `<ion-icon name="heart-outline"></ion-icon>`;
    let starFilled = `<ion-icon name="heart"></ion-icon>`;
    let starDefault = `<ion-icon name="heart-dislike-outline"></ion-icon>`;
    let rating = "";

    switch (book) {
        case 0 :
            rating = starOutline+starOutline+starOutline+starOutline+starOutline;
            break;
        case 1 :
            rating = starFilled+starOutline+starOutline+starOutline+starOutline;
            break;
        case 2 :
            rating = starFilled+starFilled+starOutline+starOutline+starOutline;
            break;
        case 3 :
            rating = starFilled+starFilled+starFilled+starOutline+starOutline;
            break;
        case 4 :
            rating = starFilled+starFilled+starFilled+starFilled+starOutline;
            break;
        case 5 :
            rating = starFilled+starFilled+starFilled+starFilled+starFilled;
            break;
        default:
            rating = starDefault;
    }

    return rating;
}

const displayModalBook = (book) => {
    let bookModal = document.querySelector(".books-modal-container");
    let modalContainer = document.querySelector('.books-modal-container .content .book');
    let authors = [];
    let rating = getBookRating(book.rating);

    //Display modal
    bookModal.classList.add('active');

    if(book.authors) {
        authors = getAuthorsForBook(book);
    }
   
    modalContainer.innerHTML = `
    <div class="left">
        <div class="thumbnail">
            <img src="${book.image[0].thumbnails.large.url}"/>
        </div>
    </div>

    <div class="right">
        <div class="title">
            <h2>${book.title}</h2>
        </div>
        <div class="authors">
            <h3>${authors}</h3>
        </div>
        <div class="summary">
            ${book.notes}
        </div>
        <div class="topics">
            <b>Sujets:</b> ${book.topics}
        </div>
        <div class="rating">
            ${rating}
        </div>
        <div class="buy">
            <a href="${book.place}">Acheter</a>
        </div>
    </div>
    `;
}

const closeModalBook = () => {
    let bookModal = document.querySelector(".books-modal-container");
    bookModal.classList.remove('active');
}

//Open a book modal
booksContainer.addEventListener("click", async(e) => {
    let book = await getBook(e.target.dataset.id);
    displayModalBook(book[0]);
});

//Close a book modal
bookModalClose.addEventListener("mouseup", () => {
    closeModalBook();
});

seeMoreButton.addEventListener("click", () => {
    if(dataBooks.length > indexBooks) {
        indexBooks = indexBooks+10;
        booksContainer.innerHTML = ""
        printBooks(dataBooks, dataAuthors);
    }
    else {
        seeMoreButton.classList.add("hidden");
    }
        
});

const printBooks = async (books, dataAuthors) => {

    for(let i=0; i<indexBooks; i++){
        let rating = getBookRating(books[i].rating);
        let authors = [];

        if(books[i].authors){
            authors = getAuthorsForBook(books[i]);
        }

        booksContainer.innerHTML += 
        `<article class="book-content" data-id=${books[i].id}>
            <div class="thumbnail">
                <img src="${books[i].image[0].thumbnails.large.url}"/>
            </div>
            <div class="title">
                <h2>${books[i].title}</h2>
            </div>
            <div class="author">
                <h3>${authors}</h3>
            </div>
            <div class="rating">
                ${rating}
            </div>
        </article>`;

    }
    
}

const printAuthors = async (authors) => {
    for( i=0; i< authorsName.length; i++ )
    {
        authors.forEach(element => {
            if(authorsName[i].id.charAt(authorsName[i].id.length - 1) == element.name.charAt(0)){
                authorsName[i].innerHTML += "<h6>" + element.name +"</h6>";
            }
        });
    }
}

const main = async () => {
    stickyNav();
    dataAuthors = await getAuthors();
    dataBooks = await getBooks();

    await printAuthors(dataAuthors);
    await printBooks(dataBooks, dataAuthors);

    const searchBar = document.getElementById('searchBar');

    searchBar.addEventListener('keyup', (e) => {
        const searchString = e.target.value.toLowerCase();
        console.log(searchString)

        const filteredCharacters = dataBooks.filter((character) => {
            return (
                character.title.toLowerCase().includes(searchString)
            );
        });
        displayCharacters(filteredCharacters);
    });

    const displayCharacters = (characters) => {
        const htmlString = characters.map((book) => {
                return(
                `<article class="book-content">
                <div class="thumbnail">
                    <img src="${book.image[0].thumbnails.full.url}"/>
                </div>
                <div class="title">
                    <h2>${book.title}</h2>
                </div>
                <div class="topics">
                    <div>
                    ${book.topics}
                    </div>
                </div>
                </article>`);
            })
            .join('');
        booksContainer.innerHTML = htmlString;
    };


    
    // const books = await mergeBooksAuthors(dataBooks, dataAuthors);
    
    
    // console.log(books);

}

const stickyNav = () => {
    window.onscroll = function() {myFunction()};
    var navbar = document.querySelector("nav");
    var sticky = navbar.offsetTop;
    function myFunction() {
        if (window.pageYOffset >= sticky) {
            navbar.classList.add("sticky")
        } else {
            navbar.classList.remove("sticky");
        }
    }
}

main();

