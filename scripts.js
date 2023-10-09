// imports used for calling information from data.js
import { BOOKS_PER_PAGE, authors, genres, books } from "./data.js";

// Object with HTML elements needed for selection and manipulation
const selectors = {
  cssSelector: document.documentElement.style,
  oneBook: document.querySelectorAll(".preview"),
  bookView: document.querySelector("[data-list-active]"),
  bookCloseView: document.querySelector("[data-list-close]"),
  bookImageView: document.querySelector("[data-list-image]"),
  bookTitleView: document.querySelector("[data-list-title]"),
  bookSubtitleView: document.querySelector("[data-list-subtitle]"),
  bookDescriptionView: document.querySelector("[data-list-description]"),
  viewBlur: document.querySelector("[data-list-blur]"),
  buttonSearch: document.querySelector("[data-header-search]"),
  buttonSetting: document.querySelector("[data-header-settings]"),
  searchCancel: document.querySelector("[data-search-cancel]"),
  searchBegin: document.querySelector('[form="search"]'),
  searchForm: document.querySelector("[data-search-form]"),
  searchMenu: document.querySelector("[data-search-overlay]"),
  searchTitle: document.querySelector("[data-search-title"),
  searchAuthors: document.querySelector("[data-search-authors]"),
  noResultsMessage: document.querySelector("[data-list-message]"),
  searchFormDiv: document.querySelector('[id="search"]'),
  settingsCancel: document.querySelector("[data-settings-cancel]"),
  settingsForm: document.querySelector("[data-settings-overlay]"),
  settingsSave: document.querySelector("[data-settings-form]"),
  dataListItems: document.querySelector("[data-list-items]"),
  dataListButton: document.querySelector("[data-list-button]"),
  searchGenres: document.querySelector("[data-search-genres]"),
  themeSettings: document.querySelector("[data-settings-theme]"),
  themeChoice: document.querySelector("[data-settings-theme]"),
};

// Theme colors for light mode
const day = {
  dark: "10, 10, 20",
  light: "255, 255, 255",
};

// Theme colours for dark mode
const night = {
  dark: "255, 255, 255",
  light: "10, 10, 20",
};

// This function adds the .preview class to all book
// buttons and then adds a click event listener and function

const bookButton = () => {
  selectors.oneBook = document.querySelectorAll(".preview"); // .preview located in css
  for (let button of selectors.oneBook) {
    button.addEventListener("click", viewBook);
  }
};

// This function will open up a preview of the targeted book
const viewBook = (event) => {
  const { target } = event;
  if (selectors.bookView.open === false) {
    selectors.bookView.showModal();
  } else if (target === selectors.bookCloseView) {
    selectors.bookView.close();
  }
  for (const book of books) {
    if (
      target.getAttribute("data-preview") === book.id ||
      target.parentNode.parentNode.getAttribute("data-preview") === book.id ||
      target.parentNode.getAttribute("data-preview") === book.id
    ) {
      selectors.bookImageView.src = book.image;
      selectors.viewBlur.src = book.image;
      selectors.bookTitleView.textContent = book.title;
      selectors.bookSubtitleView.textContent = `${
        authors[book.author]
      } (${new Date(book.published).getFullYear()})`;
      selectors.bookDescriptionView.textContent = book.description;
    }
  }
};

// page and frag variable for use in createPreviewsFragment() function
let page = 0;
const frag = document.createDocumentFragment();

// This Function populates the web page with books upon loading.
const createPreviewsFragment = (
  books,
  start = page * BOOKS_PER_PAGE,
  end = (page + 1) * BOOKS_PER_PAGE
) => {
  const pulled = books.slice(start, end);
  page += 1;
  for (const book of pulled) {
    const { author: authorId, id, image, title } = book;

    const preview = document.createElement("button");
    preview.classList = "preview";
    preview.setAttribute("data-preview", id);
    preview.innerHTML = ` 
             <img 
                 class="preview__image" 
                 src="${image}" 
             /> 
              
             <div class="preview__info"> 
                 <h3 class="preview__title">${title}</h3> 
                 <div class="preview__author">${authors[authorId]}</div> 
             </div> 
         `;

    frag.appendChild(preview);
  }
  return frag;
};

//This function toggles the theme settings window
const settingsEvents = (event) => {
  const { target } = event;
  if (selectors.settingsForm.open === false) {
    selectors.settingsForm.showModal();
  } else if (target === selectors.settingsCancel) {
    selectors.settingsForm.close();
  }
};

// This function updates the theme depending on user preference
const themeUpdate = (event) => {
  event.preventDefault();
  const css = selectors.themeChoice.value;
  if (css === "day") {
    selectors.cssSelector.setProperty("--color-dark", day.dark);
    selectors.cssSelector.setProperty("--color-light", day.light);
  } else if (css === "night") {
    selectors.cssSelector.setProperty("--color-dark", night.dark);
    selectors.cssSelector.setProperty("--color-light", night.light);
  }
  document.querySelector("[data-settings-overlay]").close();
};

// selector to set the theme to the same as user device
selectors.themeSettings.value =
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").books
    ? "day"
    : "night";

// selector to change the theme when the user saves their
//choice
selectors.settingsSave.addEventListener("submit", themeUpdate);

// This function adds more books to the HTML via 'show more' button.
const moreBooks = (event) => {
  selectors.dataListItems.appendChild(createPreviewsFragment(books));
  bookButton();
  selectors.dataListButton.textContent = `Show more (${
    books.length - BOOKS_PER_PAGE * page
  })`;
  if (books.length - page * BOOKS_PER_PAGE <= 0) {
    selectors.dataListButton.disabled = true;
    selectors.dataListButton.textContent = `Show more (0)`;
  } else {
    selectors.dataListButton.disabled = false;
  }
};

// This Function toggles the search window
const searchFunctions = (event) => {
  const { target } = event;
  if (selectors.searchMenu.open === false) {
    selectors.searchMenu.showModal();
    document.querySelector("[data-search-title]").focus();
  } else if (target === selectors.searchCancel) {
    selectors.searchMenu.close();
  }
};

// This function alters the html using the search parameters created by the user.
const createSearchHTML = (event) => {
  event.preventDefault();
  selectors.searchMenu.close();
  const formData = new FormData(selectors.searchFormDiv);
  const filters = Object.fromEntries(formData);
  const results = [];
  for (const book of books) {
    const titleMatch =
      filters.title.trim() === "" ||
      book.title.toLowerCase().includes(filters.title.toLowerCase());
    const authorMatch =
      filters.author === "All Authors" || book.author.includes(filters.author);
    const genreMatch =
      filters.genre === "All Genres" || book.genres.includes(filters.genre);
    if (titleMatch && authorMatch && genreMatch) {
      results.push(book);
    }
  }
  if (results.length < 1) {
    selectors.noResultsMessage.classList.add("list__message_show");
  } else {
    selectors.noResultsMessage.classList.remove("list__message_show");
  }
  if (results.length <= 36) {
    selectors.dataListButton.disabled = true;
    selectors.dataListButton.textContent = `Show more (0)`;
  } else {
    selectors.dataListButton.disabled = false;
    selectors.dataListButton.textContent = `Show more (${results.length - 36})`;
  }
  selectors.dataListItems.replaceChildren(
    createPreviewsFragment(results, 0, 36)
  );
  bookButton();
  window.scrollTo({ top: 0, behavior: "smooth" });
};
console.log("ShabbeerPetersenWasHere");

// variable booksPerPage used to load first 36 books
const booksPerPage = [0, BOOKS_PER_PAGE];

// This variable works with the more button to determine
//how many books remain after loading the first 36
const PAGE = 1;

if (!books && !Array.isArray(books)) throw new Error("Source required");
if (!booksPerPage && booksPerPage.length < 2)
  throw new Error("Range must be an array with two numbers");

// Adds the first 36 books to webpage
selectors.dataListItems.appendChild(
  createPreviewsFragment(books, booksPerPage[0], booksPerPage[1])
);

// Iterate through all books to check which is being clicked.
selectors.oneBook = document.querySelectorAll(".preview");
for (let button of selectors.oneBook) {
  button.addEventListener("click", viewBook);
}
selectors.bookCloseView.addEventListener("click", viewBook);

// Search button click events
selectors.buttonSearch.addEventListener("click", searchFunctions);
selectors.searchCancel.addEventListener("click", searchFunctions);

// Theme button click events
selectors.buttonSetting.addEventListener("click", settingsEvents);
selectors.settingsCancel.addEventListener("click", settingsEvents);

// events for 'show more' button and calculation of remaining books loadable
selectors.dataListButton.innerHTML =
  /* html */
  `<span>Show more</span> 
    <span class="list__remaining">${
      books.length - [PAGE * BOOKS_PER_PAGE] > 0
        ? books.length - [PAGE * BOOKS_PER_PAGE]
        : 0
    }</span>`;

selectors.dataListButton.addEventListener("click", moreBooks);

// This code creates the search options for genres
const genresList = document.createDocumentFragment();
const presetGenre = "All Genres";
selectors.searchGenres.innerHTML = `<option>${presetGenre}</option>`;
selectors.searchGenres.appendChild(genresList);
for (const [genreID, genreName] of Object.entries(genres)) {
  const genreOption = document.createElement("option");
  genreOption.innerText = `${genreName}`;
  genreOption.value = genreID;
  genresList.appendChild(genreOption);
}
selectors.searchGenres.appendChild(genresList);

// This code creates the search options for authors
const authorList = document.createDocumentFragment();
const presetAuthor = "All Authors";
selectors.searchAuthors.innerHTML = `<option>${presetAuthor}</option>`;
for (const [id, name] of Object.entries(authors)) {
  const authorOption = document.createElement("option");
  authorOption.innerText = `${name}`;
  authorOption.value = id;
  authorList.appendChild(authorOption);
}
selectors.searchAuthors.appendChild(authorList);

// this event listener will preventDefault upon submission,
// then creates an array of filtered books and displays
// them on the webpage
selectors.searchForm.addEventListener("submit", createSearchHTML);
