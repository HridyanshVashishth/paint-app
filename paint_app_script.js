const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("colorPicker");
const brushSize = document.getElementById("brushSize");
const sizeDisplay = document.getElementById("sizeDisplay");
const bgColor = document.getElementById("bgColor");
const clearBtn = document.getElementById("clearBtn");
const downloadBtn = document.getElementById("downloadBtn");
const brushTool = document.getElementById("brushTool");
const eraserTool = document.getElementById("eraserTool");

let painting = false;
let tool = "brush";
let brushColor = colorPicker.value;

// Set initial background
ctx.fillStyle = bgColor.value;
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Update size display
brushSize.addEventListener("input", (e) => {
  sizeDisplay.textContent = e.target.value + "px";
});

function startPosition(e) {
  painting = true;
  draw(e);
}

function endPosition() {
  painting = false;
  ctx.beginPath();
}

function draw(e) {
  if (!painting) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ctx.lineWidth = brushSize.value;
  ctx.lineCap = "round";
  ctx.strokeStyle = tool === "brush" ? brushColor : bgColor.value;

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}

// Mouse events
canvas.addEventListener("mousedown", startPosition);
canvas.addEventListener("mouseup", endPosition);
canvas.addEventListener("mousemove", draw);

// Touch events for mobile
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  const mouseEvent = new MouseEvent("mousedown", {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  canvas.dispatchEvent(mouseEvent);
});

canvas.addEventListener("touchend", (e) => {
  e.preventDefault();
  const mouseEvent = new MouseEvent("mouseup", {});
  canvas.dispatchEvent(mouseEvent);
});

canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  const mouseEvent = new MouseEvent("mousemove", {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  canvas.dispatchEvent(mouseEvent);
});

colorPicker.addEventListener("change", (e) => brushColor = e.target.value);

bgColor.addEventListener("change", () => {
  ctx.fillStyle = bgColor.value;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
});

brushTool.addEventListener("click", () => {
  tool = "brush";
  brushTool.classList.add("active");
  eraserTool.classList.remove("active");
});

eraserTool.addEventListener("click", () => {
  tool = "eraser";
  eraserTool.classList.add("active");
  brushTool.classList.remove("active");
});

clearBtn.addEventListener("click", () => {
  ctx.fillStyle = bgColor.value;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
});

downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "drawing.png";
  link.href = canvas.toDataURL();
  link.click();
});

// Responsive canvas sizing
function resizeCanvas() {
  if (window.innerWidth < 768) {
    canvas.width = Math.min(600, window.innerWidth - 60);
    canvas.height = canvas.width * 0.625; // Maintain aspect ratio
  } else {
    canvas.width = 800;
    canvas.height = 500;
  }
  // Redraw background after resize
  ctx.fillStyle = bgColor.value;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Initial sizing