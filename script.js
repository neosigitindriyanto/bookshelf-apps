const book = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-todo";
const STORAGE_KEY = "BOOKSHELF_APPS";

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function addBook() {
  const bookTitle = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = document.getElementById("inputBookYear").value;
  const checkBox = document.getElementById("inputBookIsComplete").checked;
  const generatedID = generateID();
  const bookObject = generateBoookObject(generatedID, bookTitle, author, year, checkBox);
  book.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateID() {
  return +new Date();
}

function generateBoookObject(id, title, author, year, checkBox) {
  return {
    id,
    title,
    author,
    year,
    checkBox,
  };
}

document.addEventListener(RENDER_EVENT, function () {
  console.log(book);

  const uncompletedList = document.getElementById("incompleteBookshelfList");
  uncompletedList.innerHTML = "";

  const completedList = document.getElementById("completeBookshelfList");
  completedList.innerHTML = "";

  for (const bookItem of book) {
    const bookElement = makeList(bookItem);
    if (!bookItem.checkBox) {
      uncompletedList.append(bookElement);
    } else {
      completedList.append(bookElement);
    }
  }
});

function makeList(bookObject) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = bookObject.title;
  const textAuthor = document.createElement("p");
  textAuthor.innerText = bookObject.author;
  const textYear = document.createElement("p");
  textYear.innerText = bookObject.year;

  const textContainer = document.createElement("article");
  textContainer.classList.add("book_item", "card", "card-body", "mb-3");
  textContainer.append(textTitle, textAuthor, textYear);

  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  textContainer.append(container);
  container.setAttribute("id", `book-${bookObject.id}`);

  if (bookObject.checkBox) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("green", "btn-success", "btn", "mb-2");
    undoButton.innerText = "Belum Selesai ";
    undoButton.addEventListener("click", function () {
      undoList(bookObject.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Hapus Buku";
    deleteButton.classList.add("red", "btn-danger", "btn");
    deleteButton.addEventListener("click", function () {
      const text = "Apakah anda ingin menghapus ?";
      if (confirm(text) == true) {
        removeList(bookObject.id);
        alert("Data terhapus");
      }
    });

    const action = document.createElement("div");
    action.classList.add("action");
    textContainer.append(undoButton, deleteButton);
  } else {
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Hapus Buku";
    deleteButton.classList.add("red", "btn-danger", "btn");
    deleteButton.addEventListener("click", function () {
      const text = "Apakah anda ingin menghapus ?";
      if (confirm(text) == true) {
        removeList(bookObject.id);
        alert("Data terhapus");
      }
    });

    const finishButton = document.createElement("button");
    finishButton.innerText = "Selesai Dibaca";
    finishButton.classList.add("green", "btn-success", "btn", "mb-2");

    const action = document.createElement("div");
    action.classList.add("action");
    textContainer.append(deleteButton, finishButton);

    finishButton.addEventListener("click", function () {
      addList(bookObject.id);
    });
    textContainer.append(finishButton, deleteButton);
  }

  return textContainer;
}

function addList(bookId) {
  const bookTarget = findbook(bookId);

  if (bookTarget == null) return;

  bookTarget.checkBox = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findbook(bookId) {
  for (const bookItem of book) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function removeList(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  book.splice(bookTarget, 1);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoList(bookId) {
  const bookTarget = findbook(bookId);

  if (bookTarget == null) return;

  bookTarget.checkBox = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
  for (const index in book) {
    if (book[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(book);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const books of data) {
      book.push(books);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.getElementById("searchSubmit").addEventListener("click", function (event) {
  event.preventDefault();
  const searchBook = document.getElementById("searchBookTitle").value.toLowerCase();
  const bookList = document.querySelectorAll(".book_item > h3");
  for (books of bookList) {
    if (searchBook === books.innerText.toLowerCase()) {
      books.parentElement.style.display = "block";
    } else {
      books.parentElement.style.display = "none";
    }
    if (searchBook === "") {
      books.parentElement.style.display = "block";
    }
  }
});
