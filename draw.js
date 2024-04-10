const canvas = document.querySelector("canvas");
const toolBtns = document.querySelectorAll(".tool");
const fillColor = document.querySelector("#fill-color");
const ctx = canvas.getContext('2d');
const sizeSlider = document.querySelector("#size-slider");
const colorBtns = document.querySelectorAll(".colors .option");
let selectedColor = "#278cbf";
const colorPicker = document.querySelector("#color-picker");
const canvasClearBtns = document.querySelectorAll(".clear-canvas"),
saveImg = document.querySelectorAll(".Save-img");

let prevmouseX, prevmouseY, snapshot;
let isDrawing = false;
let selectedTool = "brush"; //Default tool
let brushWidth = 1;

window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
});

canvas.willReadFrequently = true;

const drawRect = (e) => {
    //Drawing rectangle
    if (!fillColor.checked) {
        ctx.strokeRect(e.offsetX, e.offsetY, prevmouseX - e.offsetX, prevmouseY - e.offsetY);
    } else {
        ctx.fillRect(e.offsetX, e.offsetY, prevmouseX - e.offsetX, prevmouseY - e.offsetY);
    }
}

//drawing Circle
const drawCircle = (e) => {
    ctx.beginPath(); //creating new path
    //getting rad acc to mouse pointer
    let rad = Math.sqrt(Math.pow((prevmouseX - e.offsetX), 2) + Math.pow((prevmouseY - e.offsetY), 2));
    ctx.arc(prevmouseX, prevmouseY, rad, 0, 2 * Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

const drawTri = (e) => {
    ctx.beginPath(); //creating new path
    ctx.moveTo(prevmouseX, prevmouseY);
    ctx.lineTo(e.offsetX, e.offsetY); //firstline
    ctx.lineTo(prevmouseX * 2 - e.offsetX, e.offsetY); //bottomLine
    ctx.closePath();
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

const drawSquare = (e) => {
    //Drawing square
    const size = Math.min(Math.abs(e.offsetX - prevmouseX), Math.abs(e.offsetY - prevmouseY));
    const x = prevmouseX < e.offsetX ? prevmouseX : prevmouseX - size;
    const y = prevmouseY < e.offsetY ? prevmouseY : prevmouseY - size;
    !fillColor.checked ? ctx.strokeRect(x, y, size, size) : ctx.fillRect(x, y, size, size);
}

const startDraw = (e) => {
    //Start drawing
    prevmouseX = e.offsetX;
    prevmouseY = e.offsetY; //Saving current mouse position
    isDrawing = true;
    ctx.lineWidth = brushWidth;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = selectedColor;
    ctx.fillStyle = selectedColor;
}

const endDraw = () => {
    //End drawing
    isDrawing = false;
    ctx.beginPath(); //Reset the drawing path
}

const drawing = (e) => {
    if (!isDrawing) return;
    ctx.putImageData(snapshot, 0, 0);
    if (selectedTool === 'brush' || selectedTool === 'eraser') {
        ctx.strokeStyle = selectedTool === 'eraser' ? '#fff' : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    } else if (selectedTool === 'rectangle') {
        drawRect(e);
    } else if (selectedTool === 'circle') {
        drawCircle(e);
    } else if (selectedTool === 'triangle') {
        drawTri(e);
    } else if (selectedTool === 'square')
        drawSquare(e);
}

//Event listener for tool buttons
toolBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        //Handle tool selection
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
        console.log(selectedTool); //Log the ID of the clicked tool button
    });
});

sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value); //resizing brush

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
        ctx.fillStyle = selectedColor; //Update fill style when color changes
    });
});

colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

canvasClearBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
});

saveImg.forEach(btn => {
    btn.addEventListener("click", () => {
        const link = document.createElement("a");
        link.download = `${Date.now()}.jpg`;
        link.href = canvas.toDataURL();
        link.click();
    });
});


// Event listeners for canvas drawing
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", endDraw);
