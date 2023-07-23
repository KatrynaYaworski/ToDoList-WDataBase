const listContainer = document.querySelector(".task-list-container");
const clearButton = document.querySelector(".clear-list-btn");
const form = document.querySelector("form");
const listItem = document.querySelector("li");

const getList = () => {
  axios
    .get("http://localhost:4004/list")
    .then(displayList)
    .catch((error) => console.log(`Error with retrieving the list`, error));
};

const addTask = (e) => {
  e.preventDefault();
  const input = document.querySelector("input");
  body = {
    text: input.value,
    isCompleted: false,
  };
  input.value = "";
  axios
    .post("http://localhost:4004/list", body)
    .then(getList)
    .catch((error) => console.log(`Error with adding a task`, error));
};

const crossOffTask = (id) => {
  axios
    .put(`http://localhost:4004/list/${id}`)
    .then(getList)
    .catch((error) => console.log(`Error with crossing off a task`, error));
};

const deleteItem = (id) => {
  axios
    .delete(`http://localhost:4004/list/?id=${id}`)
    .then(getList)
    .catch((error) => console.log(`Error with deleting a task`, error));
};

const clearAll = () => {
  axios
    .delete(`http://localhost:4004/list`)
    .then(getList)
    .catch((error) => console.log(`Error with clearing list`, error));
};

function displayList(res) {
  listContainer.innerHTML = "";
  let data = res.data;
  data.forEach((element) => {
    let btnAndListContainer = document.createElement("div");
    btnAndListContainer.className = "btn-and-list-container";
    let listItem = document.createElement("li");
    let deleteBtn = document.createElement("i");
    listItem.textContent = element.text;
    deleteBtn.className = "fa-regular fa-trash-can";
    deleteBtn.style = "color: #8c2222;"
    btnAndListContainer.append(deleteBtn, listItem);
    listContainer.appendChild(btnAndListContainer);
    if (element.is_completed) {
      listItem.style.textDecoration = "line-through";
    }
    listItem.addEventListener("click", () => crossOffTask(element.id));
    deleteBtn.addEventListener("click", () => deleteItem(element.id));
  });
  clearButton.addEventListener("click", clearAll);
}

form.addEventListener("submit", addTask);

getList();

//clear needs no query
//delete needs query
