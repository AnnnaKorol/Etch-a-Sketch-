const gridWidth = getComputedStyle(document.body).getPropertyValue(
  "--grid-width"
);
const accentColor = getComputedStyle(document.body).getPropertyValue(
  "--accent-color"
);
const inactiveColor = getComputedStyle(document.body).getPropertyValue(
  "--inactive-color"
);

const container = document.querySelector(".container");
const sketchArea = document.querySelector("#sketch-area"); //main container
const slider = document.querySelector("#slider"); // slider o---0-----o  value - midle meaning.
const sliderValue = document.querySelector("#slider-value");
const gridToggle = document.querySelector("#grid-toggle");

let squaresPerSide = 16; //paragraph that shows the sliderValue
let gridVisible = false;

let isDrawing = false;

function toggleGrid() {
  gridVisible = !gridVisible;
  gridToggle.style.color = gridVisible ? accentColor : inactiveColor;

  removeGridSquares();
  createGridSquares();
}

function setBackgroundColor(e) {
  //color of one div after overing by mouse the gridboard
if(e.type === "mousedown") {
 isDrawing = true;
 e.target.style.backgroundColor = "black";
} else if(e.type === "mouseover" && isDrawing) {
e.target.style.backgroundColor = "black"
}
else isDrawing = false;
}

function createGridSquares() {
  // the number that was provided by user
  const numberOfSquares = squaresPerSide * squaresPerSide; //this number provided by used * by itself (e.g. 30*30)

  for (let i = 0; i < numberOfSquares; i++) {
    const gridCell = document.createElement("div"); //create one div in the main div container
    let widthOrHeight = 0;

    if (gridVisible) {
      widthOrHeight = `${parseInt(gridWidth) / squaresPerSide - 2}px`;
      gridCell.style.border = "1px solid whitesmoke";
    } else if (!gridVisible) {
      widthOrHeight = `${parseInt(gridWidth) / squaresPerSide - 2}px`;
      gridCell.style.border = "1px solid white";
    }

    gridCell.style.width = gridCell.style.height = widthOrHeight; // width and height for the one div in the main div container
    gridCell.addEventListener("mousedown", (e) => setBackgroundColor(e)); //when we over the grid with the mouse, the divs become interactive.
    gridCell.addEventListener("mouseover", (e) => setBackgroundColor(e)); //when we over the grid with the mouse, the divs become interactive.
    gridCell.addEventListener("mouseup", (e) => setBackgroundColor(e)); //when we over the grid with the mouse, the divs become interactive.

    gridCell.addEventListener("dragstart", (e) => {
      e.preventDefault()
    });

    sketchArea.appendChild(gridCell); //add this one div to the main container
  }
}

function removeGridSquares() {
  // очистки всех дочерних элементов внутри контейнера, который называется sketchArea.
  while (sketchArea.firstChild) {
    //Эта строка проверяет, есть ли у контейнера sketchArea хотя бы один дочерний элемент. firstChild — это первый дочерний элемент контейнера.
    sketchArea.removeChild(sketchArea.firstChild); //Если в sketchArea есть элементы (клетки), условие будет истинным, и цикл while продолжит работу. Если клеток нет, цикл остановится.
  }
}

slider.oninput = function () {
  squaresPerSide = this.value;
  //slider.oninput, ты связываешь слайдер с функцией, которая будет выполняться при каждом изменении положения ползунка. Это позволяет, например, динамически обновлять значения на экране без необходимости нажимать кнопку или отправлять форму.
 sliderValue.textContent =`${this.value} x ${this.value} (Resolution)`; // text that provide the slider size
 removeGridSquares(); //
 createGridSquares();
};

gridToggle.addEventListener("click", toggleGrid);

createGridSquares();
