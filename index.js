const taskContainer = document.querySelector(".task_container");
const openTaskModal = document.querySelector(".open-task-modal");
const searchBar = document.getElementById("searchBar");

let globalTaskData = [];

const generateHTML = (taskdata) =>
  `<div  id=${taskdata.id} class="col-md-6 col-lg-4 my-4">
    <div class="card">
        <div class="card-header gap-2 d-flex justify-content-end">
          <button class="btn btn-outline-info" name=${taskdata.id} onclick="editCard.apply(this, arguments)">
            <i class="fas fa-pencil-alt" name=${taskdata.id}></i>
          </button>
          <button class="btn btn-outline-danger" name=${taskdata.id} onclick="deleteCard.apply(this, arguments)">
            <i class="fas fa-trash-alt" name=${taskdata.id}></i>
          </button>
        </div>
        <div class="card-body">
            <img 
                src=${taskdata.image}
                alt="image"
                class="card-img"
            />
          <h5 class="card-title mt-4">${taskdata.title}</h5>
          <p class="card-text">
           ${taskdata.description}
          </p>
          <span class="badge bg-primary">${taskdata.type}</span>
        </div>
        <div class="card-footer">
          <button class="btn btn-outline-primary" name=${taskdata.id} data-bs-toggle ="modal" data-bs-target="#openTaskModal" onclick="openTask.apply(this, arguments)">Open Task</button>
        </div>
      </div> 
</div>`;

const openTaskModalHTML = (taskdata) => {
  const date = new Date(parseInt(`${taskdata.id}`));
  return `<div id=${taskdata.id}>
  <img src=${taskdata.image} alt="Task Image" class="card-img mb-3" />
  <strong class="text-sm text-muted ">Created on ${date.toDateString()}</strong>
  <h2 class="card-title mt-3">${taskdata.title}</h2>
  <p class="leadgit">${taskdata.description}</p>
  </div>`;
};

const insertToDOM = (content) => 
  taskContainer.insertAdjacentHTML("beforeend",content);

const saveToLocalStorage = () => 
  localStorage.setItem("taskyCA",JSON.stringify({cards:globalTaskData}));


const addNewCard = () => {
    //get task data
    const taskdata = {
        id: `${Date.now()}`,
        title:document.getElementById("taskTitle").value,
        image:document.getElementById("imageURL").value,
        type:document.getElementById("taskType").value,
        description:document.getElementById("taskDescription").value,
    };

    globalTaskData.push(taskdata);

    //update the localstorage

    saveToLocalStorage();
    
    //generate HTML code

    const newCard = generateHTML(taskdata);
    //Inject it to DOM

    insertToDOM(newCard);

    //clear the form

    document.getElementById("taskTitle").value="";
    document.getElementById("imageURL").value="";
    document.getElementById("taskType").value="";
    document.getElementById("taskDescription").value="";
    
};

const loadExistingCards = () => {

//check localstorage
const getData = localStorage.getItem("taskyCA");

//parse JSON data, if exist

if(!getData) return;

const taskCards = JSON.parse(getData);

globalTaskData = taskCards.cards


globalTaskData.map((taskdata) => {
//generate HTML code for those data
const newCard = generateHTML(taskdata);

  //inject it to DOM
insertToDOM(newCard);


});

return;

};

const deleteCard = (event) => {
  const targetID = event.target.getAttribute("name");
  const elementType = event.target.tagName;

  const removeTask = globalTaskData.filter((task) => task.id !== targetID);

  globalTaskData = removeTask;
  
  saveToLocalStorage();


  //access DOM to remove card
  if(elementType === "BUTTON"){
    return taskContainer.removeChild(
      event.target.parentNode.parentNode.parentNode
    );

  }else{
    return taskContainer.removeChild(
      event.target.parentNode.parentNode.parentNode.parentNode
    );
  }    
};


const editCard = (event) => {
  const elementType = event.target.tagName;

  let taskTitle;
  let taskType;
  let taskDescription;
  let parentElement;
  let submitButton;

  if(elementType === "BUTTON"){
    parentElement = event.target.parentNode.parentNode;
  }else{
    parentElement = event.target.parentNode.parentNode.parentNode;
  }    

  taskTitle = parentElement.childNodes[3].childNodes[3];
  taskDescription = parentElement.childNodes[3].childNodes[5];
  taskType = parentElement.childNodes[3].childNodes[7];
  submitButton = parentElement.childNodes[5].childNodes[1];

  taskTitle.setAttribute("contenteditable","True");
  taskDescription.setAttribute("contenteditable","True");
  taskType.setAttribute("contenteditable","True");
  submitButton.setAttribute("onclick","saveEdit.apply(this, arguments)");
  submitButton.innerHTML = "Save Changes";
  

};

const saveEdit = (event) => {
  const targetID = event.target.getAttribute("name");
  const elementType = event.target.tagName;
  let parentElement;

  if(elementType === "BUTTON"){
    parentElement = event.target.parentNode.parentNode;
  }else{
    parentElement = event.target.parentNode.parentNode.parentNode;
  } 

  const taskTitle = parentElement.childNodes[3].childNodes[3];
  const taskDescription = parentElement.childNodes[3].childNodes[5];
  const taskType = parentElement.childNodes[3].childNodes[7];
  const submitButton = parentElement.childNodes[5].childNodes[1];

  const updatedData = {
    title : taskTitle.innerHTML,
    type : taskType.innerHTML,
    description : taskDescription.innerHTML,
  };

  const globaldata = globalTaskData.map((task) => {
    if(task.id === targetID){
      return { ...task, ...updatedData};
    }
    return task;
  });

  globalTaskData = globaldata;


  saveToLocalStorage();

  taskTitle.setAttribute("contenteditable","False");
  taskDescription.setAttribute("contenteditable","False");
  taskType.setAttribute("contenteditable","False");
  submitButton.innerHTML = "Open Task";
};

searchBar.addEventListener("keyup", function (e) {
  if (!e) e = window.event;
  while (taskContainer.firstChild) {
    taskContainer.removeChild(taskContainer.firstChild);
  }
  const searchString = e.target.value;
  const filteredCharacters = globalTaskData.filter(function (character) {
    return (
      character.title.toLowerCase().includes(searchString) ||
      character.description.toLowerCase().includes(searchString) ||
      character.type.toLowerCase().includes(searchString)
    );
  });
  filteredCharacters.map(function (cardData) {
    taskContainer.insertAdjacentHTML("beforeend", generateHTML(cardData));
  });
});

const openTask = (event) => {
  const searchId = event.target.getAttribute("name");
  const targetID = event.target.getAttribute("name");

  const getTask = globalTaskData.filter((taskdata) => {
    return taskdata.id === targetID;
  });
  openTaskModal.innerHTML = openTaskModalHTML(getTask[0]);
  
 };

