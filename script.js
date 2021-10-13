var uid = new ShortUniqueId();
// variables 
let colors = ["pink", "blue", "green", "black"];
let defaultColor = "black";
let cFilter = "";
let locked = false;
let isLocked = false;
let deleteMode = false;
// elements
let input = document.querySelector(".input_container_text");
let colorContainer = document.querySelector(".color-group_container");
let mainContainer = document.querySelector(".main-container");
let lockContainer = document.querySelector(".lock-container");
let unlockContainer = document.querySelector(".unlock-container");
let plusContainer = document.querySelector(".plus-container");
let deleteContainer = document.querySelector(".multiply-container");
let colorChooser = document.querySelector(".color_container")
let allColorElements = document.querySelectorAll(".color_picker");
let modal = document.querySelector(".modal");

// event listeners
input.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && input.value) {
        console.log(uid()+" "+input.value);
        let id = uid();
        modal.style.display = "none";
        createTask(id, input.value, true, defaultColor);
        input.value = "";
        // let p = document.createElement("p");
        // let taskText = document.getElementsByClassName("text");
        // let taskId = document.getElementsByTagName("h3");
        // p.textContent = uid();
        // taskId.textContent = uid();
        // p.textContent = input.value;
        // taskText.textContent = input.value;
        // div.appendChild(p);
        // main_body.append(div);
    }
})

// color filtering
colorContainer.addEventListener("click", function(e){
    let element = e.target;
    if(element != colorContainer){
        let filteredCardColor = element.classList[1];
        filterCards(filteredCardColor);
    }
})

colorChooser.addEventListener("click", function(e){
    let element = e.target;
    if (element != colorContainer) {
        let filteredCardColor = element.classList[1];
        defaultColor = filteredCardColor;
        // border change 
        for (let i = 0; i < allColorElements.length; i++) {
            // remove  from all
            allColorElements[i].classList.remove("selected");
        }
        // add
        element.classList.add("selected")
    }
})


lockContainer.addEventListener("click", function(e){
    let numberOfElements = document.querySelectorAll(".task_main-container>div");
    for(let i=0;i<numberOfElements.length;i++){
        numberOfElements[i].contentEditable = false;
    }
    lockContainer.classList.add("active");
    unlockContainer.classList.remove("active");
})

unlockContainer.addEventListener("click", function(e){
    let numberOfElements = document.querySelectorAll(".task_main-container>div");
    for(let i=0;i<numberOfElements.length;i++){
        numberOfElements[i].contentEditable = true;
    }
    lockContainer.classList.remove("active");
    unlockContainer.classList.add("active");
})

plusContainer.addEventListener("click", function(e){
    plusContainer.classList.add("active");
    deleteContainer.classList.remove("active");
    deleteMode = false;
    modal.style.display = "flex";
})

deleteContainer.addEventListener("click", function(e){
    plusContainer.classList.remove("active");
    deleteContainer.classList.add("active");
    deleteMode = true;

})


function createTask(id, task, flag, color){
    let taskContainer = document.createElement("div");
    taskContainer.setAttribute("class", "task_container");
    mainContainer.append(taskContainer);
    taskContainer.innerHTML =`<div class="task_header ${color}"></div>
                            <div class="task_main-container">
                                <h3 class="task_id">#${id}</h3>
                                <div class="text" contentEditable="true">${task}</div>
                            </div>`;
    
    // addeventListener for color change
    let taskHeader = taskContainer.querySelector(".task_header");
    let inputTask = taskContainer.querySelector(".task_main-container>div")

    // addEventListener for delete task                   
     taskContainer.addEventListener("click", function(e){
        if(deleteMode){
            // delete ui, storage
            let tasksString = localStorage.getItem("tasks");
            let tasksArr = JSON.parse(tasksString);
            for(let i=0;i<tasksArr.length;i++){
                if(tasksArr[i].id == id){
                    tasksArr.splice(i, 1);
                    break;
                }
            }
            localStorage.setItem("tasks", JSON.stringify(tasksArr));
            taskContainer.remove();
            // let taskString = localStorage.getItem("tasks");
            // taskContainer.querySelector(".task_id").textContent;
            // local storage remove
        }
    })
                            


    taskHeader.addEventListener("click", function(e){
        // class -> change
        // get all the classes on an element
        console.log(taskHeader.classList);
        let cColor = taskHeader.classList[1]; 

        // let cColor = window.getComputedStyle(taskHeader).backgraoundColor;
        // next color
        // element.style.backgroundColor = nextColor;

        console.log("cColor: ", cColor);
        let idx = colors.indexOf(cColor);
        let nextIdx = (idx+1)%colors.length;
        let nextColor = colors[nextIdx];
        taskHeader.classList.remove(cColor);
        taskHeader.classList.add(nextColor);
        
        //  id -> localstorage search -> tell -> color update 
        // console.log("parent", taskHeader.parentNode);
        // console.log("taskcontainer", taskHeader.parentNode.children[1]);
        let idWalaWElem = taskHeader.parentNode.children[1].children[0];
        let id = idWalaWElem.textContent;
        id = id.split("#")[1];
        // coonsole.log("id", id);
        let tasksString = localStorage.getItem("tasks");
        let tasksArr = JSON.parse(tasksString);
        // {id: "nDCn8Q", task: "ffdsjbdshf", color: "pink} , {}
        for(let i=0;i<tasksArr.length;i++){
            if(tasksArr[i].id == id){
                tasksArr[i].color = nextColor;
                break;
            }
        }
        localStorage.setItem("tasks", JSON.stringify(tasksArr));
    });

    inputTask.addEventListener("blur", function(e){
        let content = inputTask.textContent;
        let tasksString = localStorage.getItem("tasks");
        let tasksArr = JSON.parse(tasksString);
        for(let i=0;i<tasksArr.length;i++){
            if(tasksArr[i].id == id){
                tasksArr[i].task = content;
                break;
            }
        }
        localStorage.setItem("tasks", JSON.stringify(tasksArr));
    })

    // local storage add
    if(flag == true){  // if tasks are already present add to ui
        let tasksString = localStorage.getItem("tasks");
        let tasksArr = JSON.parse(tasksString) || [];
        let taskObject = {
            id: id,
            task: task,
            color: color
        }
        tasksArr.push(taskObject);
        localStorage.setItem("tasks", JSON.stringify(tasksArr));
    }
    defaultColor = "black";
}

(function (){
    // localStorage
    let tasksArr = JSON.parse(localStorage.getItem("tasks")) || [];
    for(let i=0;i<tasksArr.length;i++){
        let {id, task, color} = tasksArr[i];
        createTask(id, task, false, color);
    }
    // get to ui
    modal.style.display = "none";
})()

function filterCards(filterColor){
    let allTaskCards = document.querySelectorAll(".task_container");
    if(cFilter != filterColor){
        for(let i=0;i<allTaskCards.length;i++){
            // header color ->
            let taskHeader = allTaskCards[i].querySelector(".task_header");
            let taskColor = taskHeader.classList[1];
           
            if(taskColor == filterColor){
                allTaskCards[i].style.display = "block";
            }
            else{
                // hide
                allTaskCards[i].style.display = "none";
            }
        }
        cFilter = filterColor;
    }
    else{
        cFilter = "";
        for(let i=0;i<allTaskCards.length;i++){
            allTaskCards[i].style.display = "block";
        }
    }
}



// let colorBtns = document.querySelectorAll(".color");
// for(let i=0;i<colorBtns.length;i++){

//     colorBtns[i].addEventListener("click", function(e){
//         let filteredCardColor = colorBtns[i].classList[1];
//         filterCards(filteredCardColor);
//     })
// }

// function filterCards(filterColor){
//     let allTaskCards = document.querySelectorAll(".task_container");
//     for(let i=0;i<allTaskCards.length;i++){
//         // header color ->
//         let taskHeader = allTaskCards[i].querySelector(".task_header");
//         let taskColor = taskHeader.classList[1];
//         if(taskColor == filterColor){
//             // show
//             allTaskCards[i].style.display = "block";
//         }
//         else{
//             // hide
//             allTaskCards[i].style.display = "none";
//         }
//     }
// }





// let select = document.querySelector(".color-group_container");
//         select.addEventListener("click", function(e){
//             // value -> present -> input.value
//             let category = e.target.classList[1];
//             console.log(e.target.classList);
//             let colorLists = document.querySelectorAll(".task_container");
//             console.log(colorLists[0].children[0].classList);
//             if(!category){
//                 // show all
//                 for(let i=0;i<colorLists.length;i++){
                    
//                     let cColor = colorLists[i].classList[1];
//                     colorLists[i].style.display = "block";
//                 }
//             }
//             else{
//                 // selection
//                 for(let i=0;i<colorLists.length;i++){
                    
//                     let cCategory = colorLists[i].children[0].classList[1];
//                     if(cCategory != category){
//                         // dissapear from page
//                         colorLists[i].style.display = "none";
//                     }
//                     else{
//                         // show it -> visible
//                         colorLists[i].style.display = "block";
//                     }
//                 }
//             }
//         })
     