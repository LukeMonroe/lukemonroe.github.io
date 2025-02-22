import { Colors } from './colors.js'
import { createDivColorIconHeart } from './favorites.js'
import { getBackgroundImage } from './images.js'
import { createDivTooltip } from './tooltips.js'

class ColorPicker {
  pickedColor = Colors.random()
  hoveredColor = Colors.random()

  mouseDownColors = false
  touchDownColors = false
  mouseDownHues = false
  touchDownHues = false

  xColors = 0
  yColors = 0
  xHues = 0
  yHues = 0

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

  updateColorWidget(divColorWidgetWindow, divInnerRow, divCanvasRow, callable) {
    const divColor = this.createDivColor(divColorWidgetWindow, this.hoveredColor, callable)
    divColor.style.height = '400px'
    divColor.style.width = '100%'
    divInnerRow.replaceChildren()
    divInnerRow.appendChild(divColor)
    divInnerRow.appendChild(divCanvasRow)
  }

  createColorWidget(pickedColor, callable) {
    this.pickedColor = pickedColor

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

    const divColor = this.createDivColor(divColorWidgetWindow, this.pickedColor, callable)
    divColor.style.height = '400px'
    divColor.style.width = '100%'

    divInnerRow.appendChild(divColor)
    divInnerRow.appendChild(divCanvasRow)

    canvasColors.addEventListener('mousedown', () => { this.mouseDownColors = true })
    canvasColors.addEventListener('mouseup', () => { this.mouseDownColors = false })
    canvasColors.addEventListener('mousemove', (event) => {
      if (this.mouseDownColors) {
        this.getImageDataColors(event, canvasColors)
        this.updateColorWidget(divColorWidgetWindow, divInnerRow, divCanvasRow, callable)
      }
    })
    canvasColors.addEventListener('touchstart', () => { this.touchDownColors = true })
    canvasColors.addEventListener('touchend', () => { this.touchDownColors = false })
    canvasColors.addEventListener('touchmove', (event) => {
      if (this.touchDownColors) {
        this.getImageDataColors(event, canvasColors)
        this.updateColorWidget(divColorWidgetWindow, divInnerRow, divCanvasRow, callable)
      }
    })
    canvasColors.addEventListener('click', (event) => {
      this.mouseDownColors = true
      this.getImageDataColors(event, canvasColors)
      this.updateColorWidget(divColorWidgetWindow, divInnerRow, divCanvasRow, callable)
      this.mouseDownColors = false
    })

    canvasHues.addEventListener('touchstart', () => { this.touchDownHues = true })
    canvasHues.addEventListener('touchend', () => { this.touchDownHues = false })
    canvasHues.addEventListener('mousemove', (event) => {
      if (this.mouseDownHues) {
        this.getImageDataHues(event, canvasHues)
        this.getImageDataColorsXY(canvasColors)
        this.updateColorWidget(divColorWidgetWindow, divInnerRow, divCanvasRow, callable)
      }
    })
    canvasHues.addEventListener('mousedown', () => { this.mouseDownHues = true })
    canvasHues.addEventListener('mouseup', () => { this.mouseDownHues = false })
    canvasHues.addEventListener('touchmove', (event) => {
      if (this.touchDownHues) {
        this.getImageDataHues(event, canvasHues)
        this.getImageDataColorsXY(canvasColors)
        this.updateColorWidget(divColorWidgetWindow, divInnerRow, divCanvasRow, callable)
      }
    })
    canvasHues.addEventListener('click', (event) => {
      this.mouseDownHues = true
      this.mouseDownColors = true
      this.getImageDataHues(event, canvasHues)
      this.getImageDataColorsXY(canvasColors)
      this.updateColorWidget(divColorWidgetWindow, divInnerRow, divCanvasRow, callable)
      this.mouseDownColors = false
      this.mouseDownHues = false
    })

    document.body.appendChild(divColorWidgetWindow)
    document.body.style.overflow = 'hidden'
    this.resizeCanvasHues(canvasHues, true)
    this.resizeCanvasColors(canvasColors, true)
    this.findImageDataHues(canvasHues)
    this.findImageDataColors(canvasColors)
    this.updateColorWidget(divColorWidgetWindow, divInnerRow, divCanvasRow, callable)

    window.addEventListener('resize', () => {
      this.resizeCanvasColors(canvasColors)
      this.resizeCanvasHues(canvasHues)
    })

    return divColorWidgetWindow
  }

  createColorWidgetButton(pickedColor, callable) {
    const buttonColorWidget = document.createElement('button')
    buttonColorWidget.className = 'theme'
    buttonColorWidget.innerText = 'Color Widget'
    buttonColorWidget.addEventListener('click', () => {
      this.createColorWidget(pickedColor, callable)
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

  resizeCanvasColors(canvas, initial = false) {
    const context = canvas.getContext('2d')
    const height = this.getCanvasHeight(canvas)
    const width = this.getCanvasWidth(canvas)
    const dpr = this.getDPR()

    const xPct = Math.round((this.xColors / (canvas.width / dpr)) * 100) / 100
    const yPct = Math.round((this.yColors / (canvas.height / dpr)) * 100) / 100

    canvas.height = height * dpr
    canvas.width = width * dpr
    context.scale(dpr, dpr)

    const x1 = initial ? this.xColors : xPct * width
    const y1 = initial ? this.yColors : yPct * height
    this.xColors = x1
    this.yColors = y1
    this.drawCanvasColors(canvas)
  }

  resizeCanvasHues(canvas, initial = false) {
    const context = canvas.getContext('2d')
    const height = this.getCanvasHeight(canvas)
    const width = this.getCanvasWidth(canvas)
    const dpr = this.getDPR()

    const xPct = Math.round((this.xHues / (canvas.width / dpr)) * 100) / 100
    const yPct = Math.round((this.yHues / (canvas.height / dpr)) * 100) / 100

    canvas.height = height * dpr
    canvas.width = width * dpr
    context.scale(dpr, dpr)

    const x1 = initial ? this.xHues : xPct * width
    const y1 = initial ? this.yHues : yPct * height
    this.xHues = x1
    this.yHues = y1
    this.drawCanvasHues(canvas)
  }

  drawCanvasColors(canvas) {
    const context = canvas.getContext('2d')
    context.clearRect(0, 0, this.getCanvasWidth(canvas), this.getCanvasHeight(canvas))

    const colorGradient = context.createLinearGradient(0, 0, this.getCanvasWidth(canvas), 0)
    colorGradient.addColorStop(0.01, '#ffffff')
    colorGradient.addColorStop(0.99, Colors.createHSL(`${this.pickedColor.hsl.h}`, '100', '50').formattedHex)
    context.fillStyle = colorGradient
    context.fillRect(0, 0, this.getCanvasWidth(canvas), this.getCanvasHeight(canvas))

    const blackGradient = context.createLinearGradient(0, 0, 0, this.getCanvasHeight(canvas))
    blackGradient.addColorStop(0.01, '#00000000')
    blackGradient.addColorStop(0.99, '#000000')
    context.fillStyle = blackGradient
    context.fillRect(0, 0, this.getCanvasWidth(canvas), this.getCanvasHeight(canvas))

    context.lineWidth = 2
    context.strokeStyle = this.hoveredColor.formattedText
    context.strokeRect(this.xColors - 6, this.yColors - 6, 12, 12)
  }

  drawCanvasHues(canvas) {
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
    context.strokeStyle = this.pickedColor.formattedText
    context.strokeRect(2, this.yHues - 6, this.getCanvasWidth(canvas) - 4, 12)
  }

  getImageDataColors(event, canvas) {
    if (this.mouseDownColors || this.touchDownColors) {
      const context = canvas.getContext('2d')
      const dpr = this.getDPR()
      const bounding = canvas.getBoundingClientRect()
      const x = (this.mouseDownColors ? event.clientX : event.touches[0].clientX) - bounding.left
      const y = (this.mouseDownColors ? event.clientY : event.touches[0].clientY) - bounding.top
      const data = context.getImageData(x * dpr, y * dpr, 1, 1).data
      this.hoveredColor = Colors.createRGB(`${data[0]}`, `${data[1]}`, `${data[2]}`)
      this.xColors = x
      this.yColors = y
      this.drawCanvasColors(canvas)
    }
  }

  getImageDataColorsXY(canvas) {
    this.drawCanvasColors(canvas)
    const context = canvas.getContext('2d')
    const dpr = this.getDPR()
    const data = context.getImageData(this.xColors * dpr, this.yColors * dpr, 1, 1).data
    this.hoveredColor = Colors.createRGB(`${data[0]}`, `${data[1]}`, `${data[2]}`)
  }

  getImageDataHues(event, canvas) {
    if (this.mouseDownHues || this.touchDownHues) {
      const context = canvas.getContext('2d')
      const dpr = this.getDPR()
      const bounding = canvas.getBoundingClientRect()
      const x = (this.mouseDownHues ? event.clientX : event.touches[0].clientX) - bounding.left
      const y = (this.mouseDownHues ? event.clientY : event.touches[0].clientY) - bounding.top
      const data = context.getImageData(x * dpr, y * dpr, 1, 1).data
      this.pickedColor = Colors.createRGB(`${data[0]}`, `${data[1]}`, `${data[2]}`)
      this.xHues = x
      this.yHues = y
      this.drawCanvasHues(canvas)
    }
  }

  findImageDataColors(canvas) {
    const context = canvas.getContext('2d')
    const dpr = this.getDPR()
    let x = 0
    let y = canvas.height / 2

    for (x = 0; x <= canvas.width; x++) {
      const data = context.getImageData(x, y, 1, 1).data
      const hoveredColor = Colors.createRGB(`${data[0]}`, `${data[1]}`, `${data[2]}`)
      if (hoveredColor.hsv.s === this.pickedColor.hsv.s) {
        break
      }
    }

    for (y = 0; y <= canvas.height; y++) {
      const data = context.getImageData(x, y, 1, 1).data
      const hoveredColor = Colors.createRGB(`${data[0]}`, `${data[1]}`, `${data[2]}`)
      if (hoveredColor.hsv.v === this.pickedColor.hsv.v) {
        this.hoveredColor = hoveredColor
        this.xColors = x / dpr
        this.yColors = y / dpr
        this.drawCanvasColors(canvas)
        break
      }
    }
  }

  findImageDataHues(canvas) {
    const context = canvas.getContext('2d')
    const dpr = this.getDPR()
    const x = canvas.width / 2

    for (let y = 0; y <= canvas.height; y++) {
      const data = context.getImageData(x, y, 1, 1).data
      const hoveredColor = Colors.createRGB(`${data[0]}`, `${data[1]}`, `${data[2]}`)
      if (hoveredColor.hsl.h === this.pickedColor.hsl.h) {
        this.xHues = x / dpr
        this.yHues = y / dpr
        this.drawCanvasHues(canvas)
        break
      }
    }
  }
}

export { ColorPicker }
