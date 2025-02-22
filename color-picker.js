import { Colors } from './colors.js'
import { createDivColorIconHeart } from './favorites.js'
import { getBackgroundImage } from './images.js'
import { createDivTooltip } from './tooltips.js'

class ColorPicker {
  createDivColorText(innerText) {
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

  createDivColorIconFullscreen(divColorWidgetWindow, color, divColor, callable) {
    const divColorIcon = document.createElement('div')
    divColorIcon.className = 'color-icon'
    divColorIcon.style.backgroundImage = getBackgroundImage(color, 'fullscreen')
    divColorIcon.style.top = '10px'
    divColorIcon.style.right = '10px'
    createDivTooltip(divColorIcon, 'fullscreen')
    divColorIcon.addEventListener('click', () => {
      if (divColor.className === 'color') {
        const divColor = this.createDivColor(divColorWidgetWindow, color, callable)
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

  createDivColorIconCheckmark(divColorWidgetWindow, color, divColor, callable) {
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

  createDivColor(divColorWidgetWindow, color, callable) {
    const divColor = document.createElement('div')
    divColor.className = 'color'
    divColor.style.backgroundColor = color.formattedHSL
    divColor.style.color = color.formattedText
    divColor.appendChild(this.createDivColorText(color.formattedHex))
    divColor.appendChild(this.createDivColorText(color.formattedRGB))
    divColor.appendChild(this.createDivColorText(color.formattedHSL))
    divColor.appendChild(this.createDivColorText(color.formattedHSV))
    divColor.appendChild(this.createDivColorText(color.formattedCMYK))
    divColor.appendChild(this.createDivColorText(`grayscale: ${color.grayscale}`))
    divColor.appendChild(createDivColorIconHeart(color))
    divColor.appendChild(this.createDivColorIconFullscreen(divColorWidgetWindow, color, divColor, callable))
    divColor.appendChild(this.createDivColorIconCheckmark(divColorWidgetWindow, color, divColor, callable))
    const children = divColor.children
    for (let index = 0; index < children.length; index++) {
      children[index].style.display = 'block'
    }

    return divColor
  }

  updateColorWidget(divColorWidgetWindow, hoveredColor, divInnerRow, divCanvasRow, callable) {
    const divColor = this.createDivColor(divColorWidgetWindow, hoveredColor, callable)
    divColor.style.height = '400px'
    divColor.style.width = '100%'
    divInnerRow.replaceChildren()
    divInnerRow.appendChild(divColor)
    divInnerRow.appendChild(divCanvasRow)
  }

  createColorWidget(pickedColor, callable) {
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

    const divColor = this.createDivColor(divColorWidgetWindow, pickedColor, callable)
    divColor.style.height = '400px'
    divColor.style.width = '100%'

    divInnerRow.appendChild(divColor)
    divInnerRow.appendChild(divCanvasRow)

    let hoveredColor = Colors.copy(pickedColor)

    let mouseDownColors = false
    let touchDownColors = false
    let mouseDownHues = false
    let touchDownHues = false

    let xColors = this.getCanvasWidth(canvasColors) / 2
    let yColors = this.getCanvasHeight(canvasColors) / 2
    let xHues = this.getCanvasWidth(canvasHues) / 2
    let yHues = this.getCanvasHeight(canvasHues) / 2

    canvasColors.addEventListener('mousedown', () => { mouseDownColors = true })
    canvasColors.addEventListener('mouseup', () => { mouseDownColors = false })
    canvasColors.addEventListener('mousemove', (event) => {
      const potentialColorXY = this.getImageDataColors(event, canvasColors, mouseDownColors, false, pickedColor)
      const potentialColor = potentialColorXY[0]
      if (mouseDownColors && Colors.notEqual(potentialColor, hoveredColor)) {
        xColors = potentialColorXY[1]
        yColors = potentialColorXY[2]
        hoveredColor = potentialColor
        this.updateColorWidget(divColorWidgetWindow, hoveredColor, divInnerRow, divCanvasRow, callable)
      }
    })
    canvasColors.addEventListener('touchstart', () => { touchDownColors = true })
    canvasColors.addEventListener('touchend', () => { touchDownColors = false })
    canvasColors.addEventListener('touchmove', (event) => {
      const potentialColorXY = this.getImageDataColors(event, canvasColors, false, touchDownColors, pickedColor)
      const potentialColor = potentialColorXY[0]
      if (touchDownColors && Colors.notEqual(potentialColor, hoveredColor)) {
        xColors = potentialColorXY[1]
        yColors = potentialColorXY[2]
        hoveredColor = potentialColor
        this.updateColorWidget(divColorWidgetWindow, hoveredColor, divInnerRow, divCanvasRow, callable)
      }
    })
    canvasColors.addEventListener('click', (event) => {
      const potentialColorXY = this.getImageDataColors(event, canvasColors, true, false, pickedColor)
      const potentialColor = potentialColorXY[0]
      xColors = potentialColorXY[1]
      yColors = potentialColorXY[2]
      hoveredColor = potentialColor
      this.updateColorWidget(divColorWidgetWindow, hoveredColor, divInnerRow, divCanvasRow, callable)
    })

    canvasHues.addEventListener('touchstart', () => { touchDownHues = true })
    canvasHues.addEventListener('touchend', () => { touchDownHues = false })
    canvasHues.addEventListener('mousemove', (event) => {
      const potentialHueXY = this.getImageDataHues(event, canvasHues, mouseDownHues, false, pickedColor)
      if (mouseDownHues) {
        pickedColor = potentialHueXY[0]
        xHues = potentialHueXY[1]
        yHues = potentialHueXY[2]
        const potentialColorXY = this.getImageDataColorsXY(canvasColors, xColors, yColors, pickedColor)
        hoveredColor = potentialColorXY[0]
        xColors = potentialColorXY[1]
        yColors = potentialColorXY[2]
        this.updateColorWidget(divColorWidgetWindow, hoveredColor, divInnerRow, divCanvasRow, callable)
      }
    })
    canvasHues.addEventListener('mousedown', () => { mouseDownHues = true })
    canvasHues.addEventListener('mouseup', () => { mouseDownHues = false })
    canvasHues.addEventListener('touchmove', (event) => {
      const potentialHueXY = this.getImageDataHues(event, canvasHues, false, touchDownHues, pickedColor)
      if (touchDownHues) {
        pickedColor = potentialHueXY[0]
        xHues = potentialHueXY[1]
        yHues = potentialHueXY[2]
        const potentialColorXY = this.getImageDataColorsXY(canvasColors, xColors, yColors, pickedColor)
        hoveredColor = potentialColorXY[0]
        xColors = potentialColorXY[1]
        yColors = potentialColorXY[2]
        this.updateColorWidget(divColorWidgetWindow, hoveredColor, divInnerRow, divCanvasRow, callable)
      }
    })
    canvasHues.addEventListener('click', (event) => {
      const potentialHueXY = this.getImageDataHues(event, canvasHues, true, false, pickedColor)
      pickedColor = potentialHueXY[0]
      xHues = potentialHueXY[1]
      yHues = potentialHueXY[2]
      const potentialColorXY = this.getImageDataColorsXY(canvasColors, xColors, yColors, pickedColor)
      hoveredColor = potentialColorXY[0]
      xColors = potentialColorXY[1]
      yColors = potentialColorXY[2]
      this.updateColorWidget(divColorWidgetWindow, hoveredColor, divInnerRow, divCanvasRow, callable)
    })

    const buttonColorWidget = document.createElement('button')
    buttonColorWidget.className = 'theme'
    buttonColorWidget.innerText = 'Color Widget'
    buttonColorWidget.addEventListener('click', () => {
      document.body.appendChild(divColorWidgetWindow)
      document.body.style.overflow = 'hidden'
      this.resizeCanvasColors(canvasColors, pickedColor, this.getCanvasWidth(canvasColors) / 2, this.getCanvasHeight(canvasColors) / 2, true)
      this.resizeCanvasHues(canvasHues, pickedColor, this.getCanvasWidth(canvasHues) / 2, this.getCanvasHeight(canvasHues) / 2, true)
      const potentialHueXY = this.findImageDataHues(canvasHues, pickedColor)
      hoveredColor = potentialHueXY[0]
      xHues = potentialHueXY[1]
      yHues = potentialHueXY[2]
      const potentialColorXY = this.findImageDataColors(canvasColors, pickedColor)
      hoveredColor = potentialColorXY[0]
      xColors = potentialColorXY[1]
      yColors = potentialColorXY[2]
      this.updateColorWidget(divColorWidgetWindow, hoveredColor, divInnerRow, divCanvasRow, callable)
    })

    window.addEventListener('resize', () => {
      this.resizeCanvasColors(canvasColors, pickedColor, xColors, yColors)
      const xyHues = this.resizeCanvasHues(canvasHues, pickedColor, xHues, yHues)
      xHues = xyHues[0]
      yHues = xyHues[1]
    })

    return buttonColorWidget
  }

  getCanvasHeight(canvas) {
    return canvas.getBoundingClientRect().height
  }

  getCanvasWidth(canvas) {
    return canvas.getBoundingClientRect().width
  }

  getDPR() {
    return window.devicePixelRatio
  }

  resizeCanvasColors(canvas, pickedColor, x, y, initial = false) {
    const context = canvas.getContext('2d')
    const height = this.getCanvasHeight(canvas)
    const width = this.getCanvasWidth(canvas)
    const dpr = this.getDPR()

    const xPct = Math.round((x / (canvas.width / dpr)) * 100) / 100
    const yPct = Math.round((y / (canvas.height / dpr)) * 100) / 100

    canvas.height = height * dpr
    canvas.width = width * dpr
    context.scale(dpr, dpr)

    const x1 = initial ? x : xPct * width
    const y1 = initial ? y : yPct * height

    this.drawCanvasColors(canvas, x1, y1, pickedColor, pickedColor)

    return [x1, y1]
  }

  resizeCanvasHues(canvas, pickedColor, x, y, initial = false) {
    const context = canvas.getContext('2d')
    const height = this.getCanvasHeight(canvas)
    const width = this.getCanvasWidth(canvas)
    const dpr = this.getDPR()

    const xPct = Math.round((x / (canvas.width / dpr)) * 100) / 100
    const yPct = Math.round((y / (canvas.height / dpr)) * 100) / 100

    canvas.height = height * dpr
    canvas.width = width * dpr
    context.scale(dpr, dpr)

    const x1 = initial ? x : xPct * width
    const y1 = initial ? y : yPct * height

    this.drawCanvasHues(canvas, x1, y1, pickedColor, pickedColor)

    return [x1, y1]
  }

  drawCanvasColors(canvas, x, y, pickedColor, hoveredColor) {
    const context = canvas.getContext('2d')
    context.clearRect(0, 0, this.getCanvasWidth(canvas), this.getCanvasHeight(canvas))

    const colorGradient = context.createLinearGradient(0, 0, this.getCanvasWidth(canvas), 0)
    colorGradient.addColorStop(0.01, '#ffffff')
    colorGradient.addColorStop(0.99, Colors.createHSL(`${pickedColor.hsl.h}`, '100', '50').formattedHex)
    context.fillStyle = colorGradient
    context.fillRect(0, 0, this.getCanvasWidth(canvas), this.getCanvasHeight(canvas))

    const blackGradient = context.createLinearGradient(0, 0, 0, this.getCanvasHeight(canvas))
    blackGradient.addColorStop(0.01, '#00000000')
    blackGradient.addColorStop(0.99, '#000000')
    context.fillStyle = blackGradient
    context.fillRect(0, 0, this.getCanvasWidth(canvas), this.getCanvasHeight(canvas))

    context.lineWidth = 2
    context.strokeStyle = hoveredColor.formattedText
    context.strokeRect(x - 6, y - 6, 12, 12)
  }

  drawCanvasHues(canvas, x, y, pickedColor, hoveredColor) {
    const context = canvas.getContext('2d')
    context.clearRect(0, 0, this.getCanvasWidth(canvas), this.getCanvasHeight(canvas))

    const colorGradient = context.createLinearGradient(0, 0, 0, this.getCanvasHeight(canvas))
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
    context.fillRect(0, 0, this.getCanvasWidth(canvas), this.getCanvasHeight(canvas))

    context.lineWidth = 2
    context.strokeStyle = hoveredColor.formattedText
    context.strokeRect(2, y - 6, this.getCanvasWidth(canvas) - 4, 12)
  }

  getImageDataColors(event, canvas, mouseDown, touchDown, pickedColor) {
    if (mouseDown || touchDown) {
      const context = canvas.getContext('2d')

      const dpr = this.getDPR()
      const bounding = canvas.getBoundingClientRect()
      const x = (mouseDown ? event.clientX : event.touches[0].clientX) - bounding.left
      const y = (mouseDown ? event.clientY : event.touches[0].clientY) - bounding.top
      const data = context.getImageData(x * dpr, y * dpr, 1, 1).data
      const hoveredColor = Colors.createRGB(`${data[0]}`, `${data[1]}`, `${data[2]}`)
      this.drawCanvasColors(canvas, x, y, pickedColor, hoveredColor)

      return [hoveredColor, x, y]
    }

    return [pickedColor, this.getCanvasWidth(canvas) / 2, this.getCanvasHeight(canvas) / 2]
  }

  getImageDataColorsXY(canvas, x, y, pickedColor) {
    this.drawCanvasColors(canvas, x, y, pickedColor, pickedColor)
    const context = canvas.getContext('2d')
    const dpr = this.getDPR()
    const data = context.getImageData(x * dpr, y * dpr, 1, 1).data
    const hoveredColor = Colors.createRGB(`${data[0]}`, `${data[1]}`, `${data[2]}`)

    return [hoveredColor, x, y]
  }

  getImageDataHues(event, canvas, mouseDown, touchDown, pickedColor) {
    if (mouseDown || touchDown) {
      const context = canvas.getContext('2d')

      const dpr = this.getDPR()
      const bounding = canvas.getBoundingClientRect()
      const x = (mouseDown ? event.clientX : event.touches[0].clientX) - bounding.left
      const y = (mouseDown ? event.clientY : event.touches[0].clientY) - bounding.top
      const data = context.getImageData(x * dpr, y * dpr, 1, 1).data
      const hoveredColor = Colors.createRGB(`${data[0]}`, `${data[1]}`, `${data[2]}`)
      this.drawCanvasHues(canvas, x, y, pickedColor, hoveredColor)

      return [hoveredColor, x, y]
    }

    return [pickedColor, this.getCanvasWidth(canvas) / 2, this.getCanvasHeight(canvas) / 2]
  }

  findImageDataColors(canvas, pickedColor) {
    const context = canvas.getContext('2d')
    const dpr = this.getDPR()
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
        this.drawCanvasColors(canvas, x / dpr, y / dpr, pickedColor, hoveredColor)
        return [hoveredColor, x / dpr, y / dpr]
      }
    }

    return [pickedColor, this.getCanvasWidth(canvas) / 2, this.getCanvasHeight(canvas) / 2]
  }

  findImageDataHues(canvas, pickedColor) {
    const context = canvas.getContext('2d')
    const dpr = this.getDPR()
    const x = canvas.width / 2

    for (let y = 0; y <= canvas.height; y++) {
      const data = context.getImageData(x, y, 1, 1).data
      const hoveredColor = Colors.createRGB(`${data[0]}`, `${data[1]}`, `${data[2]}`)
      if (hoveredColor.hsl.h === pickedColor.hsl.h) {
        this.drawCanvasHues(canvas, x / dpr, y / dpr, pickedColor, hoveredColor)
        return [hoveredColor, x / dpr, y / dpr]
      }
    }

    return [pickedColor, this.getCanvasWidth(canvas) / 2, this.getCanvasHeight(canvas) / 2]
  }
}

export { ColorPicker }
