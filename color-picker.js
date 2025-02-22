import { Colors } from './colors.js'
import { createDivColorIconHeart } from './favorites.js'
import { getBackgroundImage } from './images.js'
import { createDivTooltip } from './tooltips.js'

class ColorPicker {
  canvasColors = document.createElement('canvas')
  canvasHues = document.createElement('canvas')

  callable = null

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

  createDivColorIconFullscreen(divColorWidgetWindow, color, divColor) {
    const divColorIcon = document.createElement('div')
    divColorIcon.className = 'color-icon'
    divColorIcon.style.backgroundImage = getBackgroundImage(color, 'fullscreen')
    divColorIcon.style.top = '10px'
    divColorIcon.style.right = '10px'
    createDivTooltip(divColorIcon, 'fullscreen')
    divColorIcon.addEventListener('click', () => {
      if (divColor.className === 'color') {
        const divColor = this.createDivColor(divColorWidgetWindow, color)
        divColor.className = 'color-fullscreen'
        divColor.style.height = '100%'
        divColor.style.width = '100%'
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

  createDivColorIconCheckmark(divColorWidgetWindow, color, divColor) {
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
      this.callable(color)
    })

    return divColorIcon
  }

  createDivColor(divColorWidgetWindow, color) {
    const divColor = document.createElement('div')
    divColor.className = 'color'
    divColor.style.backgroundColor = color.formattedHSL
    divColor.style.color = color.formattedText
    divColor.style.height = '400px'
    divColor.style.width = '100%'
    divColor.appendChild(this.createDivColorText(color.formattedHex))
    divColor.appendChild(this.createDivColorText(color.formattedRGB))
    divColor.appendChild(this.createDivColorText(color.formattedHSL))
    divColor.appendChild(this.createDivColorText(color.formattedHSV))
    divColor.appendChild(this.createDivColorText(color.formattedCMYK))
    divColor.appendChild(this.createDivColorText(`grayscale: ${color.grayscale}`))
    divColor.appendChild(createDivColorIconHeart(color))
    divColor.appendChild(this.createDivColorIconFullscreen(divColorWidgetWindow, color, divColor))
    divColor.appendChild(this.createDivColorIconCheckmark(divColorWidgetWindow, color, divColor))
    const children = divColor.children
    for (let index = 0; index < children.length; index++) {
      children[index].style.display = 'block'
    }

    return divColor
  }

  createColorWidget() {
    this.canvasColors.style.touchAction = 'none'
    this.canvasColors.style.height = '400px'
    this.canvasColors.style.width = '100%'
    this.canvasColors.style.minWidth = '0px'
    this.canvasColors.height = 200
    this.canvasColors.width = 200

    this.canvasHues.style.touchAction = 'none'
    this.canvasHues.style.height = '400px'
    this.canvasHues.style.width = '20%'
    this.canvasHues.style.minWidth = '0px'
    this.canvasHues.height = 200
    this.canvasHues.width = 200

    const divCanvasRow = document.createElement('div')
    divCanvasRow.style.display = 'flex'
    divCanvasRow.style.justifyContent = 'center'
    divCanvasRow.style.alignItems = 'center'
    divCanvasRow.style.width = '100%'
    divCanvasRow.appendChild(this.canvasColors)
    divCanvasRow.appendChild(this.canvasHues)

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

    this.canvasColors.addEventListener('mousedown', () => { this.mouseDownColors = true })
    this.canvasColors.addEventListener('mouseup', () => { this.mouseDownColors = false })
    this.canvasColors.addEventListener('touchstart', () => { this.touchDownColors = true })
    this.canvasColors.addEventListener('touchend', () => { this.touchDownColors = false })

    this.canvasHues.addEventListener('mousedown', () => { this.mouseDownHues = true })
    this.canvasHues.addEventListener('mouseup', () => { this.mouseDownHues = false })
    this.canvasHues.addEventListener('touchstart', () => { this.touchDownHues = true })
    this.canvasHues.addEventListener('touchend', () => { this.touchDownHues = false })

    this.canvasColors.addEventListener('mousemove', (event) => {
      if (this.mouseDownColors) {
        this.getImageDataColors(event)
        divInnerRow.replaceChildren()
        divInnerRow.appendChild(this.createDivColor(divColorWidgetWindow, this.hoveredColor))
        divInnerRow.appendChild(divCanvasRow)
      }
    })
    this.canvasColors.addEventListener('touchmove', (event) => {
      if (this.touchDownColors) {
        this.getImageDataColors(event)
        divInnerRow.replaceChildren()
        divInnerRow.appendChild(this.createDivColor(divColorWidgetWindow, this.hoveredColor))
        divInnerRow.appendChild(divCanvasRow)
      }
    })
    this.canvasColors.addEventListener('click', (event) => {
      this.mouseDownColors = true
      this.getImageDataColors(event)
      divInnerRow.replaceChildren()
      divInnerRow.appendChild(this.createDivColor(divColorWidgetWindow, this.hoveredColor))
      divInnerRow.appendChild(divCanvasRow)
      this.mouseDownColors = false
    })

    this.canvasHues.addEventListener('mousemove', (event) => {
      if (this.mouseDownHues) {
        this.getImageDataHues(event)
        this.getImageDataColorsXY()
        divInnerRow.replaceChildren()
        divInnerRow.appendChild(this.createDivColor(divColorWidgetWindow, this.hoveredColor))
        divInnerRow.appendChild(divCanvasRow)
      }
    })
    this.canvasHues.addEventListener('touchmove', (event) => {
      if (this.touchDownHues) {
        this.getImageDataHues(event)
        this.getImageDataColorsXY()
        divInnerRow.replaceChildren()
        divInnerRow.appendChild(this.createDivColor(divColorWidgetWindow, this.hoveredColor))
        divInnerRow.appendChild(divCanvasRow)
      }
    })
    this.canvasHues.addEventListener('click', (event) => {
      this.mouseDownHues = true
      this.mouseDownColors = true
      this.getImageDataHues(event)
      this.getImageDataColorsXY()
      divInnerRow.replaceChildren()
      divInnerRow.appendChild(this.createDivColor(divColorWidgetWindow, this.hoveredColor))
      divInnerRow.appendChild(divCanvasRow)
      this.mouseDownColors = false
      this.mouseDownHues = false
    })

    divInnerRow.appendChild(this.createDivColor(divColorWidgetWindow, this.pickedColor))
    divInnerRow.appendChild(divCanvasRow)
    document.body.appendChild(divColorWidgetWindow)
    document.body.style.overflow = 'hidden'
    this.resizeCanvasHues(true)
    this.resizeCanvasColors(true)
    this.findImageDataHues()
    this.findImageDataColors()
    divInnerRow.replaceChildren()
    divInnerRow.appendChild(this.createDivColor(divColorWidgetWindow, this.hoveredColor))
    divInnerRow.appendChild(divCanvasRow)

    window.addEventListener('resize', () => {
      this.resizeCanvasColors()
      this.resizeCanvasHues()
    })

    return divColorWidgetWindow
  }

  createColorWidgetButton(pickedColor, callable) {
    this.pickedColor = pickedColor
    this.callable = callable

    const buttonColorWidget = document.createElement('button')
    buttonColorWidget.className = 'theme'
    buttonColorWidget.innerText = 'Color Widget'
    buttonColorWidget.addEventListener('click', () => {
      this.createColorWidget()
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

  resizeCanvasColors(initial = false) {
    const context = this.canvasColors.getContext('2d')
    const height = this.getCanvasHeight(this.canvasColors)
    const width = this.getCanvasWidth(this.canvasColors)
    const dpr = this.getDPR()

    const xPct = Math.round((this.xColors / (this.canvasColors.width / dpr)) * 100) / 100
    const yPct = Math.round((this.yColors / (this.canvasColors.height / dpr)) * 100) / 100

    this.canvasColors.height = height * dpr
    this.canvasColors.width = width * dpr
    context.scale(dpr, dpr)

    const x1 = initial ? this.xColors : xPct * width
    const y1 = initial ? this.yColors : yPct * height
    this.xColors = x1
    this.yColors = y1
    this.drawCanvasColors(this.canvasColors)
  }

  resizeCanvasHues(initial = false) {
    const context = this.canvasHues.getContext('2d')
    const height = this.getCanvasHeight(this.canvasHues)
    const width = this.getCanvasWidth(this.canvasHues)
    const dpr = this.getDPR()

    const xPct = Math.round((this.xHues / (this.canvasHues.width / dpr)) * 100) / 100
    const yPct = Math.round((this.yHues / (this.canvasHues.height / dpr)) * 100) / 100

    this.canvasHues.height = height * dpr
    this.canvasHues.width = width * dpr
    context.scale(dpr, dpr)

    const x1 = initial ? this.xHues : xPct * width
    const y1 = initial ? this.yHues : yPct * height
    this.xHues = x1
    this.yHues = y1
    this.drawCanvasHues(this.canvasHues)
  }

  drawCanvasColors() {
    const context = this.canvasColors.getContext('2d')
    context.clearRect(0, 0, this.getCanvasWidth(this.canvasColors), this.getCanvasHeight(this.canvasColors))

    const colorGradient = context.createLinearGradient(0, 0, this.getCanvasWidth(this.canvasColors), 0)
    colorGradient.addColorStop(0.01, '#ffffff')
    colorGradient.addColorStop(0.99, Colors.createHSL(`${this.pickedColor.hsl.h}`, '100', '50').formattedHex)
    context.fillStyle = colorGradient
    context.fillRect(0, 0, this.getCanvasWidth(this.canvasColors), this.getCanvasHeight(this.canvasColors))

    const blackGradient = context.createLinearGradient(0, 0, 0, this.getCanvasHeight(this.canvasColors))
    blackGradient.addColorStop(0.01, '#00000000')
    blackGradient.addColorStop(0.99, '#000000')
    context.fillStyle = blackGradient
    context.fillRect(0, 0, this.getCanvasWidth(this.canvasColors), this.getCanvasHeight(this.canvasColors))

    context.lineWidth = 2
    context.strokeStyle = this.hoveredColor.formattedText
    context.strokeRect(this.xColors - 6, this.yColors - 6, 12, 12)
  }

  drawCanvasHues() {
    const context = this.canvasHues.getContext('2d')
    context.clearRect(0, 0, this.getCanvasWidth(this.canvasHues), this.getCanvasHeight(this.canvasHues))

    const colorGradient = context.createLinearGradient(0, 0, 0, this.getCanvasHeight(this.canvasHues))
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
    context.fillRect(0, 0, this.getCanvasWidth(this.canvasHues), this.getCanvasHeight(this.canvasHues))

    context.lineWidth = 2
    context.strokeStyle = this.pickedColor.formattedText
    context.strokeRect(2, this.yHues - 6, this.getCanvasWidth(this.canvasHues) - 4, 12)
  }

  getImageDataColors(event) {
    if (this.mouseDownColors || this.touchDownColors) {
      const context = this.canvasColors.getContext('2d')
      const dpr = this.getDPR()
      const bounding = this.canvasColors.getBoundingClientRect()
      const x = (this.mouseDownColors ? event.clientX : event.touches[0].clientX) - bounding.left
      const y = (this.mouseDownColors ? event.clientY : event.touches[0].clientY) - bounding.top
      const data = context.getImageData(x * dpr, y * dpr, 1, 1).data
      this.hoveredColor = Colors.createRGB(`${data[0]}`, `${data[1]}`, `${data[2]}`)
      this.xColors = x
      this.yColors = y
      this.drawCanvasColors(this.canvasColors)
    }
  }

  getImageDataColorsXY() {
    this.drawCanvasColors(this.canvasColors)
    const context = this.canvasColors.getContext('2d')
    const dpr = this.getDPR()
    const data = context.getImageData(this.xColors * dpr, this.yColors * dpr, 1, 1).data
    this.hoveredColor = Colors.createRGB(`${data[0]}`, `${data[1]}`, `${data[2]}`)
  }

  getImageDataHues(event) {
    if (this.mouseDownHues || this.touchDownHues) {
      const context = this.canvasHues.getContext('2d')
      const dpr = this.getDPR()
      const bounding = this.canvasHues.getBoundingClientRect()
      const x = (this.mouseDownHues ? event.clientX : event.touches[0].clientX) - bounding.left
      const y = (this.mouseDownHues ? event.clientY : event.touches[0].clientY) - bounding.top
      const data = context.getImageData(x * dpr, y * dpr, 1, 1).data
      this.pickedColor = Colors.createRGB(`${data[0]}`, `${data[1]}`, `${data[2]}`)
      this.xHues = x
      this.yHues = y
      this.drawCanvasHues(this.canvasHues)
    }
  }

  findImageDataColors() {
    const context = this.canvasColors.getContext('2d')
    const dpr = this.getDPR()
    let x = 0
    let y = this.canvasColors.height / 2

    for (x = 0; x <= this.canvasColors.width; x++) {
      const data = context.getImageData(x, y, 1, 1).data
      const hoveredColor = Colors.createRGB(`${data[0]}`, `${data[1]}`, `${data[2]}`)
      if (hoveredColor.hsv.s === this.pickedColor.hsv.s) {
        break
      }
    }

    for (y = 0; y <= this.canvasColors.height; y++) {
      const data = context.getImageData(x, y, 1, 1).data
      const hoveredColor = Colors.createRGB(`${data[0]}`, `${data[1]}`, `${data[2]}`)
      if (hoveredColor.hsv.v === this.pickedColor.hsv.v) {
        this.hoveredColor = hoveredColor
        this.xColors = x / dpr
        this.yColors = y / dpr
        this.drawCanvasColors(this.canvasColors)
        break
      }
    }
  }

  findImageDataHues() {
    const context = this.canvasHues.getContext('2d')
    const dpr = this.getDPR()
    const x = this.canvasHues.width / 2

    for (let y = 0; y <= this.canvasHues.height; y++) {
      const data = context.getImageData(x, y, 1, 1).data
      const hoveredColor = Colors.createRGB(`${data[0]}`, `${data[1]}`, `${data[2]}`)
      if (hoveredColor.hsl.h === this.pickedColor.hsl.h) {
        this.xHues = x / dpr
        this.yHues = y / dpr
        this.drawCanvasHues(this.canvasHues)
        break
      }
    }
  }
}

export { ColorPicker }
