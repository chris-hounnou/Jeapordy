let categories = [];
let catId = [];
let clueArray = [];
let clue = [];
let title, response, question, answer, text, newTh, NUM_CATEGORIES, target;

async function getCategoryIds() {
  const response = await axios.get('http://jservice.io/api/categories?count=10');
  NUM_CATEGORIES = _.sampleSize(response.data, 6);

  for (let num of NUM_CATEGORIES) {
    let categoryID = num.id;
    catId.push(categoryID);
  }
  return catId;
}

async function getCategory(catId) {
  for (let ID of catId) {
    response = await axios.get('http://jservice.io/api/clues?category=' + ID);

    for (let i = 0; i < response.data.length; i++) {
      question = response.data[i].question;
      answer = response.data[i].answer;
      title = response.data[i].category.title;

      clueArray = _.sampleSize(clueArray, 5);
      clueArray.push({ question, answer });
    }

    clue = {
      title: title,
      clueArray: clueArray,
      showing: null
    }
    categories.push(clue);
  }
  return categories;
}

async function fillTable(categories) {
  for (let cat of categories) {
    let newTh = document.createElement("TH");
    let text = document.createTextNode(cat.title);
    newTh.appendChild(text);
    document.querySelector("thead").appendChild(newTh);

    let newTr = document.createElement("TR");
    document.querySelector("tbody").appendChild(newTr);

    cat.clueArray.forEach(function (clue) {
      let newTd = document.createElement("TD");
      newTd.innerText = "?";
      newTd.id = 'td';
      newTd.addEventListener('click', handleClick);
      newTr.appendChild(newTd);
    })
  }
}

function handleClick(e) {
  let target = e.currentTarget;
  if (target.innerHTML === "?") {
    let catIndex = Array.from(target.parentNode.parentNode.children).indexOf(target.parentNode);
    let clueIndex = Array.from(target.parentNode.children).indexOf(target);
    target.innerHTML = categories[catIndex].clueArray[clueIndex].question;
  } else if (target.innerHTML !== "?") {
    target.innerHTML = categories[catIndex].clueArray[clueIndex].answer;
  }
}

async function setupAndStart() {
  await getCategoryIds();
  await getCategory(catId);
  fillTable(categories);
}

/** On click of restart button, restart game. */
const startButton = document.querySelector('#start');
start.addEventListener('click', function () {
  location.reload();
});

/** On page load, setup and start & add event handler for clicking clues */
document.addEventListener('DOMContentLoaded', setupAndStart);
