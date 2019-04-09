const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
let addToy = false

// YOUR CODE HERE
document.addEventListener('DOMContentLoaded', function(){
  let allToys;
  const toyCollection = document.querySelector("#toy-collection")
  
  fetch("http://localhost:3000/toys")
  .then(res => res.json())
  .then(function(toys){
    allToys = toys 
    renderAllToys()
  })

//Helper Functions 
function renderSingleToy(toy){
  return `
    <div class="card" data-id="${toy.id}">
      <h2>${toy.name}</h2>
      <img src=${toy.image} class="toy-avatar" />
      <p>${toy.likes} Likes </p>
      <button class="like-btn">Like <3</button>
      <button class="destroy-btn" id="fButton">F**K THIS TOY</button>
    </div>
  `
}

function renderAllToys(){
  //using forEach
  // allToys.forEach(function(toys){
  //   toyCollection.innerHTML += renderSingleToy(toys)
  // })

  // using map
  const mappedHTMLToys = allToys.map(renderSingleToy)
  toyCollection.innerHTML = mappedHTMLToys.join("")
}

toyForm.addEventListener('submit',function(e){
  e.preventDefault();
  const toyNameValue = document.querySelector('input[name="name"]').value
  const toyImageValue = document.querySelector('input[name="image"]').value
  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: toyNameValue,
      image: toyImageValue,
      likes: 0
    })
  }).then(res => res.json())
  .then(toy => toyCollection.innerHTML = renderSingleToy(toy) + toyCollection.innerHTML)
})



  toyCollection.addEventListener('click', function(e){
    const toyId = e.target.parentElement.dataset.id
    if(e.target.className === "like-btn"){
      let currentLikeText = e.target.previousElementSibling.innerText
      let likeCount = parseInt(currentLikeText.split(" ")[0])
      likeCount ++
      currentLikeText = likeCount
      fetch(`http://localhost:3000/toys/${toyId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "likes": currentLikeText
          })
      })
      .then(res => res.json())
      .then(function(toy){
        const dataID = document.querySelector(`[data-id="${toyId}"]`)
        dataID.querySelector("p").innerText = currentLikeText + " Likes"
      })
    }

    //delete button action 
    if(e.target.id === "fButton"){
      fetch(`http://localhost:3000/toys/${toyId}`, {
        method: 'DELETE'
      })
        .then(res => res.json())
        .then(function (toy) {
          const toyDiv = document.querySelector(`[data-id= "${toyId}"]`)
          toyDiv.remove();
        })
    }

  }) // close of event lister

}) // end of DOM Loaded


addBtn.addEventListener('click', () => {
  // hide & seek with the form
  addToy = !addToy
  if (addToy) {
    toyForm.style.display = 'block'
    // submit listener here
  } else {
    toyForm.style.display = 'none'
  }
})

// OR HERE!

