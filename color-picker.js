import { Colors } from './colors.js'
import { createDivColorIconHeart } from './favorites.js'
import { getBackgroundImage } from './images.js'
import { createDivTooltip } from './tooltips.js'

function createDivColorText(innerText) {
  const divColorText = document.createElement('div')
  divColorText.className = 'color-text'
  divColorText.innerText = innerText
  createDivTooltip(divColorText, 'copy')
  divColorText.addEventListener('click', () => {
    navigator.clipboard.writeText(divColorText.innerText)

    const h4Copied = document.createElement('h4')
    h4Copied.innerText = 'Copied to clipboard'

    const divCopied = document.createElement('div')
    divCopied.className = 'copied'
    divCopied.appendChild(h4Copied)
    document.body.appendChild(divCopied)
    setTimeout(function () {
      divCopied.style.opacity = '1'
    }, 10)
    setTimeout(function () {
      divCopied.style.opacity = '0'
    }, 3000)
    setTimeout(function () {
      document.body.removeChild(divCopied)
    }, 3800)
  })

  return divColorText
}

function createDivColorIconFullscreen(divColorWidgetWindow, color, divColor, callable) {
  const divColorIcon = document.createElement('div')
  divColorIcon.className = 'color-icon'
  divColorIcon.style.backgroundImage = getBackgroundImage(color, 'fullscreen')
  divColorIcon.style.top = '10px'
  divColorIcon.style.right = '10px'
  createDivTooltip(divColorIcon, 'fullscreen')
  divColorIcon.addEventListener('click', () => {
    if (divColor.className === 'color') {
      const divColor = createDivColor(divColorWidgetWindow, color, callable)
      divColor.className = 'color-fullscreen'
      document.body.appendChild(divColor)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.removeChild(divColor)
      document.body.style.overflow = 'auto'
    }
  })
  divColor.addEventListener('dblclick', () => {
    if (divColor.className === 'color-fullscreen') {
      document.body.removeChild(divColor)
      document.body.style.overflow = 'auto'
    }
  })

  return divColorIcon
}

function createDivColorIconCheckmark(divColorWidgetWindow, color, divColor, callable) {
  const divColorIcon = document.createElement('div')
  divColorIcon.className = 'color-icon'
  divColorIcon.style.backgroundImage = getBackgroundImage(color, 'checkmark')
  divColorIcon.style.bottom = '10px'
  divColorIcon.style.right = '10px'
  createDivTooltip(divColorIcon, 'load color')
  divColorIcon.addEventListener('click', () => {
    document.body.removeChild(divColorWidgetWindow)
    if (divColor.className === 'color-fullscreen') {
      document.body.removeChild(divColor)
    }
    document.body.style.overflow = 'auto'
    callable(color)
  })

  return divColorIcon
}

function createDivColor(divColorWidgetWindow, color, callable) {
  const divColor = document.createElement('div')
  divColor.className = 'color'
  divColor.style.backgroundColor = color.formattedHSL
  divColor.style.color = color.formattedText
  divColor.appendChild(createDivColorText(color.formattedHex))
  divColor.appendChild(createDivColorText(color.formattedRGB))
  divColor.appendChild(createDivColorText(color.formattedHSL))
  divColor.appendChild(createDivColorText(color.formattedHSV))
  divColor.appendChild(createDivColorText(color.formattedCMYK))
  divColor.appendChild(createDivColorText(`grayscale: ${color.grayscale}`))
  divColor.appendChild(createDivColorIconHeart(color))
  divColor.appendChild(createDivColorIconFullscreen(divColorWidgetWindow, color, divColor, callable))
  divColor.appendChild(createDivColorIconCheckmark(divColorWidgetWindow, color, divColor, callable))
  const children = divColor.children
  for (let index = 0; index < children.length; index++) {
    children[index].style.display = 'block'
  }

  return divColor
}

function updateColorWidget(divColorWidgetWindow, hoveredColor, divInnerRow, divCanvasRow, callable) {
  const divColor = createDivColor(divColorWidgetWindow, hoveredColor, callable)
  divColor.style.height = '400px'
  divColor.style.width = '100%'
  divInnerRow.replaceChildren()
  divInnerRow.appendChild(divColor)
  divInnerRow.appendChild(divCanvasRow)
}

function createColorWidget(pickedColor, callable) {
  const canvasColors = document.createElement('canvas')
  canvasColors.style.touchAction = 'none'
  canvasColors.style.height = '400px'
  canvasColors.style.width = '100%'
  canvasColors.style.minWidth = '0px'
  canvasColors.height = 200
  canvasColors.width = 200

  const canvasHues = document.createElement('canvas')
  canvasHues.style.touchAction = 'none'
  canvasHues.style.height = '400px'
  canvasHues.style.width = '20%'
  canvasHues.style.minWidth = '0px'
  canvasHues.height = 200
  canvasHues.width = 200

  const divCanvasRow = document.createElement('div')
  divCanvasRow.style.display = 'flex'
  divCanvasRow.style.justifyContent = 'center'
  divCanvasRow.style.alignItems = 'center'
  divCanvasRow.style.width = '100%'
  divCanvasRow.appendChild(canvasColors)
  divCanvasRow.appendChild(canvasHues)

  const divInnerRow = document.createElement('div')
  divInnerRow.className = 'inner-row'
  divInnerRow.style.gap = '0px'
  divInnerRow.style.border = '2px solid var(--color)'

  const divColorWidgetWindow = document.createElement('div')
  divColorWidgetWindow.className = 'color-fullscreen'
  divColorWidgetWindow.appendChild(divInnerRow)
  divColorWidgetWindow.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
  divColorWidgetWindow.addEventListener('dblclick', () => {
    document.body.removeChild(divColorWidgetWindow)
    document.body.style.overflow = 'auto'
  })

  const divColor = createDivColor(divColorWidgetWindow, pickedColor, callable)
  divColor.style.height = '400px'
  divColor.style.width = '100%'

  divInnerRow.appendChild(divColor)
  divInnerRow.appendChild(divCanvasRow)

  let hoveredColor = Colors.copy(pickedColor)

  let mouseDownColors = false
  let touchDownColors = false
  let mouseDownHues = false
  let touchDownHues = false

  let xColors = getCanvasWidth(canvasColors) / 2
  let yColors = getCanvasHeight(canvasColors) / 2
  let xHues = getCanvasWidth(canvasHues) / 2
  let yHues = getCanvasHeight(canvasHues) / 2

  canvasColors.addEventListener('mousedown', () => { mouseDownColors = true })
  canvasColors.addEventListener('mouseup', () => { mouseDownColors = false })
  canvasColors.addEventListener('mousemove', (event) => {
    const potentialColorXY = getImageDataColors(event, canvasColors, mouseDownColors, false, pickedColor)
    const potentialColor = potentialColorXY[0]
    if (mouseDownColors && Colors.notEqual(potentialColor, hoveredColor)) {
      xColors = potentialColorXY[1]
      yColors = potentialColorXY[2]
      hoveredColor = potentialColor
      updateColorWidget(divColorWidgetWindow, hoveredColor, divInnerRow, divCanvasRow, callable)
    }
  })
  canvasColors.addEventListener('touchstart', () => { touchDownColors = true })
  canvasColors.addEventListener('touchend', () => { touchDownColors = false })
  canvasColors.addEventListener('touchmove', (event) => {
    const potentialColorXY = getImageDataColors(event, canvasColors, false, touchDownColors, pickedColor)
    const potentialColor = potentialColorXY[0]
    if (touchDownColors && Colors.notEqual(potentialColor, hoveredColor)) {
      xColors = potentialColorXY[1]
      yColors = potentialColorXY[2]
      hoveredColor = potentialColor
      updateColorWidget(divColorWidgetWindow, hoveredColor, divInnerRow, divCanvasRow, callable)
    }
  })
  canvasColors.addEventListener('click', (event) => {
    const potentialColorXY = getImageDataColors(event, canvasColors, true, false, pickedColor)
    const potentialColor = potentialColorXY[0]
    xColors = potentialColorXY[1]
    yColors = potentialColorXY[2]
    hoveredColor = potentialColor
    updateColorWidget(divColorWidgetWindow, hoveredColor, divInnerRow, divCanvasRow, callable)
  })

  canvasHues.addEventListener('touchstart', () => { touchDownHues = true })
  canvasHues.addEventListener('touchend', () => { touchDownHues = false })
  canvasHues.addEventListener('mousemove', (event) => {
    const potentialHueXY = getImageDataHues(event, canvasHues, mouseDownHues, false, pickedColor)
    if (mouseDownHues) {
      pickedColor = potentialHueXY[0]
      xHues = potentialHueXY[1]
      yHues = potentialHueXY[2]
      const potentialColorXY = getImageDataColorsXY(canvasColors, xColors, yColors, pickedColor)
      hoveredColor = potentialColorXY[0]
      xColors = potentialColorXY[1]
      yColors = potentialColorXY[2]
      updateColorWidget(divColorWidgetWindow, hoveredColor, divInnerRow, divCanvasRow, callable)
    }
  })
  canvasHues.addEventListener('mousedown', () => { mouseDownHues = true })
  canvasHues.addEventListener('mouseup', () => { mouseDownHues = false })
  canvasHues.addEventListener('touchmove', (event) => {
    const potentialHueXY = getImageDataHues(event, canvasHues, false, touchDownHues, pickedColor)
    if (touchDownHues) {
      pickedColor = potentialHueXY[0]
      xHues = potentialHueXY[1]
      yHues = potentialHueXY[2]
      const potentialColorXY = getImageDataColorsXY(canvasColors, xColors, yColors, pickedColor)
      hoveredColor = potentialColorXY[0]
      xColors = potentialColorXY[1]
      yColors = potentialColorXY[2]
      updateColorWidget(divColorWidgetWindow, hoveredColor, divInnerRow, divCanvasRow, callable)
    }
  })
  canvasHues.addEventListener('click', (event) => {
    const potentialHueXY = getImageDataHues(event, canvasHues, true, false, pickedColor)
    pickedColor = potentialHueXY[0]
    xHues = potentialHueXY[1]
    yHues = potentialHueXY[2]
    const potentialColorXY = getImageDataColorsXY(canvasColors, xColors, yColors, pickedColor)
    hoveredColor = potentialColorXY[0]
    xColors = potentialColorXY[1]
    yColors = potentialColorXY[2]
    updateColorWidget(divColorWidgetWindow, hoveredColor, divInnerRow, divCanvasRow, callable)
  })

  const buttonColorWidget = document.createElement('button')
  buttonColorWidget.className = 'theme'
  buttonColorWidget.innerText = 'Color Widget'
  buttonColorWidget.addEventListener('click', () => {
    document.body.appendChild(divColorWidgetWindow)
    document.body.style.overflow = 'hidden'
    resizeCanvasColors(canvasColors, pickedColor, getCanvasWidth(canvasColors) / 2, getCanvasHeight(canvasColors) / 2, true)
    resizeCanvasHues(canvasHues, pickedColor, getCanvasWidth(canvasHues) / 2, getCanvasHeight(canvasHues) / 2, true)
    const potentialHueXY = findImageDataHues(canvasHues, pickedColor)
    hoveredColor = potentialHueXY[0]
    xHues = potentialHueXY[1]
    yHues = potentialHueXY[2]
    const potentialColorXY = findImageDataColors(canvasColors, pickedColor)
    hoveredColor = potentialColorXY[0]
    xColors = potentialColorXY[1]
    yColors = potentialColorXY[2]
    updateColorWidget(divColorWidgetWindow, hoveredColor, divInnerRow, divCanvasRow, callable)
  })

  window.addEventListener('resize', () => {
    resizeCanvasColors(canvasColors, pickedColor, xColors, yColors)
    const xyHues = resizeCanvasHues(canvasHues, pickedColor, xHues, yHues)
    xHues = xyHues[0]
    yHues = xyHues[1]
  })

  return buttonColorWidget
}

function getCanvasHeight(canvas) {
  return canvas.getBoundingClientRect().height
}

function getCanvasWidth(canvas) {
  return canvas.getBoundingClientRect().width
}

function getDPR() {
  return window.devicePixelRatio
}

function resizeCanvasColors(canvas, pickedColor, x, y, initial = false) {
  const context = canvas.getContext('2d')
  const height = getCanvasHeight(canvas)
  const width = getCanvasWidth(canvas)
  const dpr = getDPR()

  const xPct = Math.round((x / (canvas.width / dpr)) * 100) / 100
  const yPct = Math.round((y / (canvas.height / dpr)) * 100) / 100

  canvas.height = height * dpr
  canvas.width = width * dpr
  context.scale(dpr, dpr)

  const x1 = initial ? x : xPct * width
  const y1 = initial ? y : yPct * height

  drawCanvasColors(canvas, x1, y1, pickedColor, pickedColor)

  return [x1, y1]
}

function resizeCanvasHues(canvas, pickedColor, x, y, initial = false) {
  const context = canvas.getContext('2d')
  const height = getCanvasHeight(canvas)
  const width = getCanvasWidth(canvas)
  const dpr = getDPR()

  const xPct = Math.round((x / (canvas.width / dpr)) * 100) / 100
  const yPct = Math.round((y / (canvas.height / dpr)) * 100) / 100

  canvas.height = height * dpr
  canvas.width = width * dpr
  context.scale(dpr, dpr)

  const x1 = initial ? x : xPct * width
  const y1 = initial ? y : yPct * height

  drawCanvasHues(canvas, x1, y1, pickedColor, pickedColor)

  return [x1, y1]
}

function drawCanvasColors(canvas, x, y, pickedColor, hoveredColor) {
  const context = canvas.getContext('2d')
  context.clearRect(0, 0, getCanvasWidth(canvas), getCanvasHeight(canvas))

  const colorGradient = context.createLinearGradient(0, 0, getCanvasWidth(canvas), 0)
  colorGradient.addColorStop(0.01, '#ffffff')
  colorGradient.addColorStop(0.99, Colors.createHSL(`${pickedColor.hsl.h}`, '100', '50').formattedHex)
  context.fillStyle = colorGradient
  context.fillRect(0, 0, getCanvasWidth(canvas), getCanvasHeight(canvas))

  const blackGradient = context.createLinearGradient(0, 0, 0, getCanvasHeight(canvas))
  blackGradient.addColorStop(0.01, '#00000000')
  blackGradient.addColorStop(0.99, '#000000')
  context.fillStyle = blackGradient
  context.fillRect(0, 0, getCanvasWidth(canvas), getCanvasHeight(canvas))

  context.lineWidth = 2
  context.strokeStyle = hoveredColor.formattedText
  context.strokeRect(x - 6, y - 6, 12, 12)
}

function drawCanvasHues(canvas, x, y, pickedColor, hoveredColor) {
  const context = canvas.getContext('2d')
  context.clearRect(0, 0, getCanvasWidth(canvas), getCanvasHeight(canvas))

  const colorGradient = context.createLinearGradient(0, 0, 0, getCanvasHeight(canvas))
  colorGradient.addColorStop(0.01, Colors.createHSL('0', '100', '50').formattedHex)
  colorGradient.addColorStop(0.10, Colors.createHSL('35', '100', '50').formattedHex)
  colorGradient.addColorStop(0.20, Colors.createHSL('71', '100', '50').formattedHex)
  colorGradient.addColorStop(0.30, Colors.createHSL('107', '100', '50').formattedHex)
  colorGradient.addColorStop(0.40, Colors.createHSL('143', '100', '50').formattedHex)
  colorGradient.addColorStop(0.50, Colors.createHSL('179', '100', '50').formattedHex)
  colorGradient.addColorStop(0.60, Colors.createHSL('215', '100', '50').formattedHex)
  colorGradient.addColorStop(0.70, Colors.createHSL('251', '100', '50').formattedHex)
  colorGradient.addColorStop(0.80, Colors.createHSL('287', '100', '50').formattedHex)
  colorGradient.addColorStop(0.90, Colors.createHSL('323', '100', '50').formattedHex)
  colorGradient.addColorStop(0.99, Colors.createHSL('359', '100', '50').formattedHex)
  context.fillStyle = colorGradient
  context.fillRect(0, 0, getCanvasWidth(canvas), getCanvasHeight(canvas))

  context.lineWidth = 2
  context.strokeStyle = hoveredColor.formattedText
  context.strokeRect(2, y - 6, getCanvasWidth(canvas) - 4, 12)
}

function getImageDataColors(event, canvas, mouseDown, touchDown, pickedColor) {
  if (mouseDown || touchDown) {
    const context = canvas.getContext('2d')

    const dpr = getDPR()
    const bounding = canvas.getBoundingClientRect()
    const x = (mouseDown ? event.clientX : event.touches[0].clientX) - bounding.left
    const y = (mouseDown ? event.clientY : event.touches[0].clientY) - bounding.top
    const data = context.getImageData(x * dpr, y * dpr, 1, 1).data
    const hoveredColor = Colors.createRGB(`${data[0]}`, `${data[1]}`, `${data[2]}`)
    drawCanvasColors(canvas, x, y, pickedColor, hoveredColor)

    return [hoveredColor, x, y]
  }

  return [pickedColor, getCanvasWidth(canvas) / 2, getCanvasHeight(canvas) / 2]
}

function getImageDataColorsXY(canvas, x, y, pickedColor) {
  drawCanvasColors(canvas, x, y, pickedColor, pickedColor)
  const context = canvas.getContext('2d')
  const dpr = getDPR()
  const data = context.getImageData(x * dpr, y * dpr, 1, 1).data
  const hoveredColor = Colors.createRGB(`${data[0]}`, `${data[1]}`, `${data[2]}`)

  return [hoveredColor, x, y]
}

function getImageDataHues(event, canvas, mouseDown, touchDown, pickedColor) {
  if (mouseDown || touchDown) {
    const context = canvas.getContext('2d')

    const dpr = getDPR()
    const bounding = canvas.getBoundingClientRect()
    const x = (mouseDown ? event.clientX : event.touches[0].clientX) - bounding.left
    const y = (mouseDown ? event.clientY : event.touches[0].clientY) - bounding.top
    const data = context.getImageData(x * dpr, y * dpr, 1, 1).data
    const hoveredColor = Colors.createRGB(`${data[0]}`, `${data[1]}`, `${data[2]}`)
    drawCanvasHues(canvas, x, y, pickedColor, hoveredColor)

    return [hoveredColor, x, y]
  }

  return [pickedColor, getCanvasWidth(canvas) / 2, getCanvasHeight(canvas) / 2]
}

function findImageDataColors(canvas, pickedColor) {
  const context = canvas.getContext('2d')
  const dpr = getDPR()
  let x = 0
  let y = canvas.height / 2

  for (x = 0; x <= canvas.width; x++) {
    const data = context.getImageData(x, y, 1, 1).data
    const hoveredColor = Colors.createRGB(`${data[0]}`, `${data[1]}`, `${data[2]}`)
    if (hoveredColor.hsv.s === pickedColor.hsv.s) {
      break
    }
  }

  for (y = 0; y <= canvas.height; y++) {
    const data = context.getImageData(x, y, 1, 1).data
    const hoveredColor = Colors.createRGB(`${data[0]}`, `${data[1]}`, `${data[2]}`)
    if (hoveredColor.hsv.v === pickedColor.hsv.v) {
      drawCanvasColors(canvas, x / dpr, y / dpr, pickedColor, hoveredColor)
      return [hoveredColor, x / dpr, y / dpr]
    }
  }

  return [pickedColor, getCanvasWidth(canvas) / 2, getCanvasHeight(canvas) / 2]
}

function findImageDataHues(canvas, pickedColor) {
  const context = canvas.getContext('2d')
  const dpr = getDPR()
  const x = canvas.width / 2

  for (let y = 0; y <= canvas.height; y++) {
    const data = context.getImageData(x, y, 1, 1).data
    const hoveredColor = Colors.createRGB(`${data[0]}`, `${data[1]}`, `${data[2]}`)
    if (hoveredColor.hsl.h === pickedColor.hsl.h) {
      drawCanvasHues(canvas, x / dpr, y / dpr, pickedColor, hoveredColor)
      return [hoveredColor, x / dpr, y / dpr]
    }
  }

  return [pickedColor, getCanvasWidth(canvas) / 2, getCanvasHeight(canvas) / 2]
}

export { createColorWidget }
