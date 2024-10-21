//!The grid width, accent colors depends on  calculation in the code
const gridWidth = getComputedStyle(document.body).getPropertyValue(
  "--grid-width"
);
const accentColor = getComputedStyle(document.body).getPropertyValue(
  "--accent-color"
);
const inactiveColor = getComputedStyle(document.body).getPropertyValue(
  "--inactive-color"
);


//!Add all buttons and sketch area to JS
const sketchArea = document.querySelector("#sketch-area");
const slider = document.querySelector("#slider");
const sliderValue = document.querySelector("#slider-value");
const gridSwitching = document.querySelector("#grid-switching");
const penColorPicker = document.querySelector("#pen-color");
const randomColorSwitching = document.querySelector("#rainbow");
const shadingSwitching = document.querySelector("#gradient");
const eraserSwitching = document.querySelector("#eraser");
const clearSketchButton = document.querySelector("#clear");

//!When click buttons, then........
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

//!Grid button logic:
function gridLineVisibilitySwitching() {
  gridLinesVisible = gridLinesVisible ? false : true;
  gridSwitching.style.color = gridLinesVisible ? accentColor : inactiveColor; //gridLines = accentColor, no-gridLines = inactiveColor
  if (gridLinesVisible) {
    widthOrHeight = `${Math.round(parseInt(gridWidth) / squaresPerSide - 2)}px`;
    sketchArea.childNodes.forEach((square) => {
      square.style.border = "1px solid whitesmoke";
    });
  } else if (!gridLinesVisible) {
    widthOrHeight = `${Math.round(parseInt(gridWidth) / squaresPerSide)}px`;  
    sketchArea.childNodes.forEach((square) => {
      square.style.border = "none";
    }); //childNodes позволяет получить все дочерние узлы элемента, включая текст и комментарии, что полезно для работы с полной структурой DOM-элементов. свойство children возвращает только элементы (без текстовых и комментариев)
  }
  sketchArea.childNodes.forEach((square) => {
    square.style.width = square.style.height = widthOrHeight;
  });
}

//!Drawing on the Sketch area works if the mouse pressed down
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










 //!Create Grid
function createGridSquares() {                            
  const numOfSquares = squaresPerSide * squaresPerSide;    //1)calculate the total number of squares to be created in the grid. 
  let widthOrHeight = 0;                                   
  for (let i = 0; i < numOfSquares; i++) {                 //2)Cycle to create squares: This loop is run numOfSquares once, and each time a new square is created. That is, the loop repeats as many times as there should be squares in the grid.
    const gridSquare = document.createElement("div");      //*a small square is a container div called qreadSquare.


    if (gridLinesVisible) {                                                  //Grid visible -  add an indentation (отступ) is added to the width and height of each square to display the border (1px). Размер квадрата рассчитывается как общая ширина сетки (gridWidth), делённая на количество квадратов на стороне (squaresPerSide). 
      widthOrHeight = `${Math.floor(parseInt(gridWidth) / squaresPerSide - 2)}px`; //parseInt(строка, системаСчисления)-преобразования строки в целое число. Она извлекает числа из начала строки и игнорирует любые символы, которые идут после числа. Если строка не начинается с числа, результат будет NaN (Not a Number — не число): parseInt("abc123"); // Вернет NaN
      gridSquare.style.border = "1px solid whitesmoke";


    } else if (!gridLinesVisible) {
      widthOrHeight = `${Math.floor(parseInt(gridWidth) / squaresPerSide)}px`; //Grid NOT visible - no indentation (отступ) is needed.
      gridSquare.style.border = "none";
    }




    //!Mause actions: 
    gridSquare.style.width = gridSquare.style.height = widthOrHeight;  //устанавливаются размеры квадрата 

    gridSquare.addEventListener("mousedown", (e) =>                     //при нажатии мыши: - вызывается функция setSquareBackgroundColor(e) для изменения фона квадрата
      setSquareBackgroundColor(e)
    );
    gridSquare.addEventListener("mouseover", (e) =>                     //наведении на квадрат  - вызывается функция setSquareBackgroundColor(e) для изменения фона квадрата
      setSquareBackgroundColor(e)
    );
    gridSquare.addEventListener("mouseup", (e) => setSquareBackgroundColor(e)); //отпускании кнопки мыши - вызывается функция setSquareBackgroundColor(e) для изменения фона квадрата

    gridSquare.addEventListener("dragstart", (e) => {                          //предотвратить перетаскивание квадрата.
      e.preventDefault();
    });

    sketchArea.appendChild(gridSquare);                                  //Добавление квадрата в контейнер: В конце каждого цикла новый квадрат добавляется в контейнер sketchArea:
  }
}





//удаления всех дочерних элементов внутри контейнера sketchArea. То есть цикл будет работать до тех пор, пока в контейнере остаются какие-то элементы.
function removeGridSquares() {                                      
  while (sketchArea.firstChild) {
    sketchArea.removeChild(sketchArea.firstChild);
  }
}


//------------------------------------------------------------------------//


//!Color change button
penColorPicker.addEventListener("input", (e) => {   //Когда пользователь выбирает новый цвет,  
  penColor = colorPickerColor = e.target.value;     //значение этого цвета (e.target.value) присваивается двум переменным: penColor и colorPickerColor. делает так, что выбранный цвет становится текущим цветом пера для рисования и сохраняется как значение из цветового пикера.
  if (shading) toggleShading();                      // (If shading == true, вызывается функция toggleShading(), чтобы отключить этот режим.) Если активны другие режимы (например, затенение,                                               
  if (randomizingColors) toggleUseOfRandomColors(); //(if randomizingColor == true, вызывается функция toggleUseOfRandomColors())             случайные цвета 
  if (erasing) toggleEraser();                        //(Если включён режим ластика (erasing), то функция toggleEraser() отключает его.)      или ластик), они будут отключены, когда пользователь выберет новый цвет.
});




//------------------------------------------------------------------------//
//Функция toggleUseOfRandomColors() управляет включением/выключением режима случайных цветов, отключает ластик при включении случайных цветов, изменяет цвет индикатора переключения этого режима и корректирует текущий цвет пера в зависимости от состояния режима случайных цветов.

//!Randomizing Color button
function toggleUseOfRandomColors() {
  randomizingColors = randomizingColors ? false : true;    //Если randomizingColors в данный момент имеет значение true (режим случайных цветов включён), она становится false (выключен), и наоборот. 
  if (randomizingColors && erasing) toggleEraser();        //Если режим случайных цветов включён (randomizingColors === true) и одновременно активен режим ластика (erasing === true), то вызывается функция toggleEraser(), чтобы отключить ластик. 
  randomColorSwitching.style.color = randomizingColors     //Если режим случайных цветов включён, цвет элемента становится accentColor (активный цвет). Если режим выключен, цвет становится inactiveColor (неактивный цвет). Это может быть сделано для того, чтобы визуально подсветить активность режима.
    ? accentColor
    : inactiveColor;
  penColor = !randomizingColors ? colorPickerColor : penColor;  //Если режим случайных цветов выключен (randomizingColors === false), цвет пера (penColor) возвращается к значению, выбранному в элементе выбора цвета (colorPickerColor). Если же режим случайных цветов включён, цвет пера остаётся неизменным
}


//Randomizing Color button
//1) If the random color is active, the random color is  enable. 
//2) if randomizingColors and erasing active, erasing should be disable.
//3) If the button randomizingColors is active, the color of the button is accentColor, if not - inactiveColor
//4) if random color is disable, penColor(colorchangebutton) use the color that was selected previously.

//------------------------------------------------------------------------//


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

//------------------------------------------------------------------------//
//Функция toggleShading() управляет режимом затенения при рисовании, а также взаимодействует с другими режимами, такими как режим ластика. 

function toggleShading() {
  shading = shading ? false : true;                                          //Если режим затенения включён (shading === true), то его отключают, присваивая false. Если затенение выключено, оно включается, присваивая true.
  if (shading && erasing) toggleEraser();                                    //Если режим затенения включается (shading === true) и одновременно включён режим ластика (erasing === true), то вызывается функция toggleEraser(), чтобы отключить ластик. 
  shadingSwitching.style.color = shading ? accentColor : inactiveColor;      //Цвет элемента интерфейса, который управляет затенением (shadingSwitching), меняется в зависимости от состояния режима затенения. Если затенение включено, элемент получает цвет accentColor (активный цвет), если выключено — inactiveColor (неактивный цвет).
  penColor = !shading ? colorPickerColor : penColor;                         //Если режим затенения выключен, цвет пера (penColor) устанавливается в цвет, выбранный через цветовой пикер (colorPickerColor). Если затенение включено, цвет пера не меняется, потому что режим затенения предполагает наложение полупрозрачных слоёв одного и того же цвета на элементы (это создаёт эффект затенения).
}
//Функция переключает состояние режима затенения. При включённом режиме затенения каждый раз, когда рисуете по одному и тому же месту, цвет будет становиться темнее или насыщеннее (в зависимости от механизма затенения).
//Если затенение отключено, цвет пера будет тот, который выбран в цветовой палитре. Если затенение включено, цвет пера остаётся неизменным так как затенение работает на основе постепенного изменения прозрачности текущего цвета.

//------------------------------------------------------------------------//


//Функция createShading(currentShade) увеличивает яркость текущего оттенка на 10% (если она меньше 100%), затем переводит это значение в шестнадцатеричный формат, который используется для представления цвета в режиме затенения.

function createShading(currentShade) {
  let shadePercentage = currentShade * 100;                                 //На основе текущего оттенка (currentShade), который, вероятно, выражен в диапазоне от 0 до 1 (где 0 — это самый тёмный оттенок, а 1 — самый светлый), функция вычисляет процент затемнения. Значение currentShade умножается на 100, чтобы получить процентное представление этого оттенка. Например: Если currentShade = 0.5, то shadePercentage = 50, что означает 50% яркости цвета.

  if (shadePercentage < 100) shadePercentage += 10;                         //Если текущий процент затемнения меньше 100 (то есть не максимальная яркость), его увеличивают на 10%. Это сделано для того, чтобы при каждом вызове функции цвет становился немного светлее, имитируя эффект постепенного наложения оттенка. Если shadePercentage изначально 50, после этой строки оно станет 60.

  shadeAmountHex = Math.round((shadePercentage / 100) * 255).toString(16);  //shadePercentage / 100 — это перевод процента в десятичную дробь. Например, если shadePercentage = 60, это даст значение 0.6...0.6 * 255 — вычисление значения яркости на основе процентного отношения к максимальной яркости (255). В данном примере это даст 153, поскольку 255 — это максимальное значение яркости для RGB в 8-битной системе. Math.round() округляет результат до ближайшего целого числа.
  return shadeAmountHex;
}

//------------------------------------------------------------------------//


function toggleEraser() {
  erasing = erasing ? false : true;                                          //Если ластик уже включён (erasing === true), он отключается, присваивая false. Если ластик выключен, он включается, присваивая true.
  if (erasing) {
    if (randomizingColors) toggleUseOfRandomColors();                         //Если включён режим случайных цветов (randomizingColors === true), вызывается функция toggleUseOfRandomColors(), чтобы его отключить.
    if (shading) toggleShading();                                             //Если включён режим затенения (shading === true), вызывается функция toggleShading(), чтобы его отключить. Ластик и затенение также несовместимы.
  }
  eraserSwitching.style.color = erasing ? accentColor : inactiveColor;        //Эта строка меняет цвет элемента интерфейса, который отвечает за управление ластиком (eraserSwitching). Если ластик включён, его цвет становится accentColor, чтобы визуально показать активное состояние ластика. Если ластик выключен, цвет становится inactiveColor, чтобы показать, что режим ластика не активен.
  penColor = erasing ? "" : colorPickerColor;                                 //Когда включён режим ластика (erasing === true), цвет пера (penColor) устанавливается в пустую строку (""), что, вероятно, означает прозрачный цвет, с которым происходит стирание (перо как бы "рисует" прозрачным цветом). Если ластик выключен, перо снова получает цвет, выбранный через цветовой пикер (colorPickerColor).
}

//1) if the eraser active, the randomazingColors and shading should be disable.
//2) if the eraser button is active  -> accentColor, if not --> inactiveColor
//3) if erazing active, the penColor should be transparant as it make no color in the square. 

//------------------------------------------------------------------------//

//Функция clearSketch() выполняет перезапуск сетки для рисования, удаляя все существующие квадраты и создавая новую чистую сетку. 

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
