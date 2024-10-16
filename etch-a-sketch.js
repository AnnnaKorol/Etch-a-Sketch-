const GRIDSIDE = 600;
let squarePerSide = 16;

const sketchArea = document.querySelector("#sketch-area");                //main container
const sliderContainer = document.querySelector("#slider-container");      // container that shows divs 16 x 16
const slider = document.querySelector("#slider");                          // slider o---0-----o  value - midle meaning.
const sliderValue = document.querySelector("#slider-value");               //paragraph that shows the sliderValue


sliderValue.textContent = `${slider.value} x ${slider.value} (Resolution)`;  //add the meaning to the paragraph that shows the sliderValue
sketchArea.style.width = sketchArea.style.height = `${GRIDSIDE}px`;          //


function setBackgroundColor() {                                                //color of one div after overing by mouse the gridboard
  this.style.backgroundColor = "black";                                     
}


function createGrideCells(squarePerSide) {                                    // the number that was provided by user
  const numberOfSquares = (squarePerSide * squarePerSide);                   //this number provided by used * by itself (e.g. 30*30)
  const widthOrHeight = `${(GRIDSIDE / squarePerSide) - 2}px`;               // GRIDSIDE(600) : the number that was provided by user - 2 px for margins

  for (let i = 0; i < numberOfSquares; i++) {
    const gridCell = document.createElement("div");                        //create one div in the main div container 

    gridCell.style.width = gridCell.style.height = widthOrHeight;          // width and height for the one div in the main div container 
    gridCell.classList.add("cell");                                       // add class to this one div (e.g. <div class = "cell">)

    sketchArea.appendChild(gridCell);                                      //add this one div to the main container                             

    gridCell.addEventListener("mouseover", setBackgroundColor)                //when we over the grid with the mouse, the divs become interactive. 
  }
}

function removeGridCells() {                                              // очистки всех дочерних элементов внутри контейнера, который называется sketchArea.
  while (sketchArea.firstChild) {                                         //Эта строка проверяет, есть ли у контейнера sketchArea хотя бы один дочерний элемент. firstChild — это первый дочерний элемент контейнера.
    sketchArea.removeChild(sketchArea.firstChild);                        //Если в sketchArea есть элементы (клетки), условие будет истинным, и цикл while продолжит работу. Если клеток нет, цикл остановится.
  }
}

slider.oninput = function () {                                          //slider.oninput, ты связываешь слайдер с функцией, которая будет выполняться при каждом изменении положения ползунка. Это позволяет, например, динамически обновлять значения на экране без необходимости нажимать кнопку или отправлять форму.
  let txt = `${this.value} x ${this.value} (Resolution)`;               // text that provide the slider size
  sliderValue.textContent = txt;                                        // add this text to the paragraph  
  removeGridCells();                                                    // 
  createGrideCells(this.value);
}




createGrideCells(12);


