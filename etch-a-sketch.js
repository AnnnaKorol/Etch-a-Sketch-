//The grid width, accent colors depends on  culculation in the code
const gridWidth = getComputedStyle(document.body).getPropertyValue(
  "--grid-width"
);
const accentColor = getComputedStyle(document.body).getPropertyValue(
  "--accent-color"
);
const inactiveColor = getComputedStyle(document.body).getPropertyValue(
  "--inactive-color"
);

// Add all buttons and sketch area to JS
const sketchArea = document.querySelector("#sketch-area");
const slider = document.querySelector("#slider");
const sliderValue = document.querySelector("#slider-value");
const gridSwitching = document.querySelector("#grid-switching");
const penColorPicker = document.querySelector("#pen-color");
const randomColorSwitching = document.querySelector("#rainbow");
const shadingSwitching = document.querySelector("#gradient");
const eraserSwitching = document.querySelector("#eraser");
const clearSketchButton = document.querySelector("#clear");

// When click buttons, then........
shadingSwitching.addEventListener("click", toggleShading);
randomColorSwitching.addEventListener("click", toggleUseOfRandomColors);
eraserSwitching.addEventListener("click", toggleEraser);
gridSwitching.addEventListener("click", gridLineVisibilitySwitching);
clearSketchButton.addEventListener("click", confirmClear);

let squaresPerSide = 14;

let gridLinesVisible = false;
let drawing = false;
let randomizingColors = false;
let shading = false;
let erasing = false;
let squarePainted = false;

let penColor = "#000000";
let colorPickerColor = "#000000";
let shadeAmountHex = "00";

//Grid button logic:
function gridLineVisibilitySwitching() {
  gridLinesVisible = gridLinesVisible ? false : true;
  gridSwitching.style.color = gridLinesVisible ? accentColor : inactiveColor; //gridLines = accentColor, no-gridLines = inactiveColor
  if (gridLinesVisible) {
    widthOrHeight = `${Math.floor(parseInt(gridWidth) / squaresPerSide) - 2}px`;
    sketchArea.childNodes.forEach((square) => {
      square.style.border = "1px solid whitesmoke";
    });
  } else if (!gridLinesVisible) {
    widthOrHeight = `${Math.floor(parseInt(gridWidth) / squaresPerSide)}px`;
    sketchArea.childNodes.forEach((square) => {
      square.style.border = "none";
    }); //childNodes позволяет получить все дочерние узлы элемента, включая текст и комментарии, что полезно для работы с полной структурой DOM-элементов. свойство children возвращает только элементы (без текстовых и комментариев)
  }
  sketchArea.childNodes.forEach((square) => {
    square.style.width = square.style.height = widthOrHeight;
  });
}

//Drawing on the Sketch area works if the mouse pressed down
function setSquareBackgroundColor(e) {
  let currentShade = "0";
  let color = "";

  if (e.type === "mousedown") {
    drawing = true;
    //if the random color button clicked, then penColor create a random colors
    if (randomizingColors) penColor = createRandomColor(); //"Если переменная randomizingColors истинна (то есть имеет значение true), тогда переменной penColor присваивается случайный цвет, созданный функцией createRandomColor()
    // By default e.target.style.background = ""
    if (shading) {
      if (e.target.style.backgroundColor != "") {
        // e.target.style.backgroundColor returns an rgba string
        // it needs to be converted and broken into penColor and shadingPercentage(opacity)
        // eg. "rgba(0, 0, 0, 0.7)"
        penColor = convertRGBAToHexA(e.target.style.backgroundColor);
        color = e.target.style.backgroundColor;
        currentShade = color.substring(color.length - 4, color.length - 1);
        penColor = penColor.substring(0, 7) + createShading(currentShade);
      } else penColor = penColor.substring(0, 7) + "1A";
    }
    e.target.style.backgroundColor = penColor;
  } else if (e.type === "mouseover" && drawing) {
    if (randomizingColors) penColor = createRandomColor();
    if (shading) {
      if (e.target.style.backgroundColor != "") {
        penColor = convertRGBAToHexA(e.target.style.backgroundColor);
        color = e.target.style.backgroundColor;
        currentShade = color.substring(color.length - 4, color.length - 1);
        penColor = penColor.substring(0, 7) + createShading(currentShade);
      } else penColor = penColor.substring(0, 7) + "1A";
    }
    e.target.style.backgroundColor = penColor;
  } else drawing = false;
}











function createGridSquares() {
  const numOfSquares = squaresPerSide * squaresPerSide;
  let widthOrHeight = 0;

  for (let i = 0; i < numOfSquares; i++) {
    const gridSquare = document.createElement("div");

    if (gridLinesVisible) {
      widthOrHeight = `${Math.floor(parseInt(gridWidth) / squaresPerSide )- 2}px`; //parseInt(строка, системаСчисления)-преобразования строки в целое число. Она извлекает числа из начала строки и игнорирует любые символы, которые идут после числа. Если строка не начинается с числа, результат будет NaN (Not a Number — не число): parseInt("abc123"); // Вернет NaN
      gridSquare.style.border = "1px solid whitesmoke";
    } else if (!gridLinesVisible) {
      widthOrHeight = `${Math.floor(parseInt(gridWidth) / squaresPerSide)}px`;
      gridSquare.style.border = "none";
    }
    gridSquare.style.width = gridSquare.style.height = widthOrHeight;

    gridSquare.addEventListener("mousedown", (e) =>
      setSquareBackgroundColor(e)
    );
    gridSquare.addEventListener("mouseover", (e) =>
      setSquareBackgroundColor(e)
    );
    gridSquare.addEventListener("mouseup", (e) => setSquareBackgroundColor(e));

    gridSquare.addEventListener("dragstart", (e) => {
      e.preventDefault();
    });

    sketchArea.appendChild(gridSquare);
  }
}






function removeGridSquares() {
  while (sketchArea.firstChild) {
    sketchArea.removeChild(sketchArea.firstChild);
  }
}

penColorPicker.addEventListener("input", (e) => {
  penColor = colorPickerColor = e.target.value;
  if (shading) toggleShading();
  if (randomizingColors) toggleUseOfRandomColors();
  if (erasing) toggleEraser();
});

function toggleUseOfRandomColors() {
  randomizingColors = randomizingColors ? false : true;
  if (randomizingColors && erasing) toggleEraser();
  randomColorSwitching.style.color = randomizingColors
    ? accentColor
    : inactiveColor;
  penColor = !randomizingColors ? colorPickerColor : penColor;
}

//Random color HEX to create, use the function:
function createRandomColor() {
  let newColor = "#";
  let possibleChars = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
  ]; // Массив возможных символов для HEX цвета
  for (let i = 0; i < 6; i++) {
    // Цикл для добавления 6 случайных символов
    let randomIndex = Math.floor(Math.random() * possibleChars.length); // Генерация случайного индекса для выбора символа(Генерирует случайное число от 0 до длины массива possibleChars (16 элементов).)Округляет случайное число вниз, чтобы получить целочисленный индекс для доступа к элементам массива possibleChars
    newColor += possibleChars[randomIndex]; // Добавление символа к строке newColor
  }
  return newColor; //Вернет что-то вроде "#A3F5B7"
}

function toggleShading() {
  shading = shading ? false : true;
  if (shading && erasing) toggleEraser();
  shadingSwitching.style.color = shading ? accentColor : inactiveColor;
  penColor = !shading ? colorPickerColor : penColor;
}

function createShading(currentShade) {
  let shadePercentage = currentShade * 100;
  if (shadePercentage < 100) shadePercentage += 10;

  shadeAmountHex = Math.round((shadePercentage / 100) * 255).toString(16);
  return shadeAmountHex;
}

function toggleEraser() {
  erasing = erasing ? false : true;
  if (erasing) {
    if (randomizingColors) toggleUseOfRandomColors();
    if (shading) toggleShading();
  }
  eraserSwitching.style.color = erasing ? accentColor : inactiveColor;
  penColor = erasing ? "" : colorPickerColor;
}

function clearSketch() {
  removeGridSquares();
  createGridSquares();
}

function confirmClear() {
  if (confirm("Your Sketch Wound Be Deleted!")) clearSketch();
}

function convertRGBAToHexA(rgba, forceRemoveAlpha = false) {
  return (
    "#" +
    rgba
      .replace(/^rgba?\(|\s+|\)$/g, "") // Get's rgba / rgb string values
      .split(",") // splits them at ","
      .filter((string, index) => !forceRemoveAlpha || index !== 3)
      .map((string) => parseFloat(string)) // Converts to numbers
      .map((number, index) => (index === 3 ? Math.round(number * 255) : number)) // Converts alpha to 255 number
      .map((number) => number.toString(16)) // Converts numbers to hex
      .map((string) => (string.length === 1 ? "0" + string : string)) // Adds 0 when length of one number is 1
      .join("")
  ); // Puts the array to together to create a string
}

//If the slider change, then clean the previous settings and provide new ones.                         // Rule: <input type="text" id="myInput" oninput="myFunction()">
slider.oninput = function () {
  //function myFunction() {
  squaresPerSide = this.value; //let text = document.getElementById("myInput").value;
  sliderValue.textContent = `${this.value} x ${this.value} (Resolution)`; //document.getElementById("demo").textContent = "You wrote: " + text;
  removeGridSquares(); // Delete old squares
  createGridSquares(); // Add new squares
};
sliderValue.textContent = `${slider.value} x ${slider.value} (Resolution)`;

createGridSquares();
