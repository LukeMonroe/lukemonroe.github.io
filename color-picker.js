import { Colors } from './colors.js'
import { createDivColorIconHeart } from './favorites.js'
import { getBackgroundImage } from './images.js'
import { createDivTooltip } from './tooltips.js'

class ColorPicker {
  divColorWidgetWindow = null
  divColor = null
  divColorFullscreen = null
  canvasHues = null
  canvasColors = null
  callable = null
  pickedColor = null
  hoveredHue = null
  hoveredColor = null

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

  createDivColorIconFullscreen(color) {
    const divColorIcon = document.createElement('div')
    divColorIcon.className = 'color-icon'
    divColorIcon.style.backgroundImage = getBackgroundImage(color, 'fullscreen')
    divColorIcon.style.top = '10px'
    divColorIcon.style.right = '10px'
    createDivTooltip(divColorIcon, 'fullscreen')
    divColorIcon.addEventListener('click', () => {
      if (this.divColorFullscreen === null) {
        this.createDivColorFullscreen(color)
      } else {
        document.body.removeChild(this.divColorFullscreen)
        this.divColorFullscreen = null
      }
    })

    return divColorIcon
  }

  createDivColorIconCheckmark(color) {
    const divColorIcon = document.createElement('div')
    divColorIcon.className = 'color-icon'
    divColorIcon.style.backgroundImage = getBackgroundImage(color, 'checkmark')
    divColorIcon.style.bottom = '10px'
    divColorIcon.style.right = '10px'
    createDivTooltip(divColorIcon, 'load color')
    divColorIcon.addEventListener('click', () => {
      document.body.removeChild(this.divColorWidgetWindow)
      if (this.divColorFullscreen !== null) {
        document.body.removeChild(this.divColorFullscreen)
      }
      this.divColorWidgetWindow = null
      this.divColorFullscreen = null
      document.body.style.overflow = 'auto'
      this.callable(color)
    })

    return divColorIcon
  }

  updateDivColor(color) {
    this.divColor.className = 'cp-color'
    this.divColor.style.backgroundColor = color.formattedHex
    this.divColor.style.color = color.formattedText
    this.divColor.replaceChildren()
    this.divColor.appendChild(this.createDivColorText(color.formattedHex))
    this.divColor.appendChild(this.createDivColorText(color.formattedRGB))
    this.divColor.appendChild(this.createDivColorText(color.formattedHSL))
    this.divColor.appendChild(this.createDivColorText(color.formattedHSV))
    this.divColor.appendChild(this.createDivColorText(color.formattedCMYK))
    this.divColor.appendChild(this.createDivColorText(`grayscale: ${color.grayscale}`))
    this.divColor.appendChild(createDivColorIconHeart(color))
    this.divColor.appendChild(this.createDivColorIconFullscreen(color))
    this.divColor.appendChild(this.createDivColorIconCheckmark(color))
    const children = this.divColor.children
    for (let index = 0; index < children.length; index++) {
      children[index].style.display = 'block'
    }
  }

  createDivColorFullscreen(color) {
    this.divColorFullscreen = document.createElement('div')
    this.divColorFullscreen.className = 'color-fullscreen'
    this.divColorFullscreen.style.backgroundColor = color.formattedHex
    this.divColorFullscreen.style.color = color.formattedText
    this.divColorFullscreen.style.height = '100%'
    this.divColorFullscreen.style.width = '100%'
    this.divColorFullscreen.replaceChildren()
    this.divColorFullscreen.appendChild(this.createDivColorText(color.formattedHex))
    this.divColorFullscreen.appendChild(this.createDivColorText(color.formattedRGB))
    this.divColorFullscreen.appendChild(this.createDivColorText(color.formattedHSL))
    this.divColorFullscreen.appendChild(this.createDivColorText(color.formattedHSV))
    this.divColorFullscreen.appendChild(this.createDivColorText(color.formattedCMYK))
    this.divColorFullscreen.appendChild(this.createDivColorText(`grayscale: ${color.grayscale}`))
    this.divColorFullscreen.appendChild(createDivColorIconHeart(color))
    this.divColorFullscreen.appendChild(this.createDivColorIconFullscreen(color))
    this.divColorFullscreen.appendChild(this.createDivColorIconCheckmark(color))
    this.divColorFullscreen.addEventListener('dblclick', () => {
      document.body.removeChild(this.divColorFullscreen)
      this.divColorFullscreen = null
    })
    const children = this.divColorFullscreen.children
    for (let index = 0; index < children.length; index++) {
      children[index].style.display = 'block'
    }

    document.body.appendChild(this.divColorFullscreen)
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
    divInnerRow.appendChild(this.divColor)
    divInnerRow.appendChild(divCanvasRow)

    this.divColorWidgetWindow.className = 'color-fullscreen'
    this.divColorWidgetWindow.appendChild(divInnerRow)
    this.divColorWidgetWindow.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
    this.divColorWidgetWindow.addEventListener('click', (event) => {
      if (!divInnerRow.contains(event.target)) {
        document.body.removeChild(this.divColorWidgetWindow)
        document.body.style.overflow = 'auto'
        this.divColorWidgetWindow = null
      }
    })

    this.canvasColors.addEventListener('mousedown', () => { this.mouseDownColors = true })
    this.canvasColors.addEventListener('mouseup', () => { this.mouseDownColors = false })
    this.canvasColors.addEventListener('touchstart', () => { this.touchDownColors = true })
    this.canvasColors.addEventListener('touchend', () => { this.touchDownColors = false })
    this.canvasColors.addEventListener('mousemove', (event) => { this.getImageDataColors(event) })
    this.canvasColors.addEventListener('touchmove', (event) => { this.getImageDataColors(event) })
    this.canvasColors.addEventListener('click', (event) => {
      this.mouseDownColors = true
      this.getImageDataColors(event)
      this.mouseDownColors = false
    })

    this.canvasHues.addEventListener('mousedown', () => { this.mouseDownHues = true })
    this.canvasHues.addEventListener('mouseup', () => { this.mouseDownHues = false })
    this.canvasHues.addEventListener('touchstart', () => { this.touchDownHues = true })
    this.canvasHues.addEventListener('touchend', () => { this.touchDownHues = false })
    this.canvasHues.addEventListener('mousemove', (event) => { this.getImageDataHues(event) })
    this.canvasHues.addEventListener('touchmove', (event) => { this.getImageDataHues(event) })
    this.canvasHues.addEventListener('click', (event) => {
      this.mouseDownHues = true
      this.mouseDownColors = true
      this.getImageDataHues(event)
      this.mouseDownColors = false
      this.mouseDownHues = false
    })

    this.updateDivColor(this.hoveredHue)
    document.body.appendChild(this.divColorWidgetWindow)
    document.body.style.overflow = 'hidden'
    this.setupCanvases()

    window.addEventListener('resize', () => {
      if (this.divColorWidgetWindow !== null) {
        this.resizeCanvasColors()
        this.resizeCanvasHues()
      }
    })
    window.addEventListener('orientationchange', () => {
      if (this.divColorWidgetWindow !== null) {
        this.resizeCanvasColors()
        this.resizeCanvasHues()
      }
    })
  }

  createColorWidgetButton(pickedColor, callable) {
    const buttonColorWidget = document.createElement('button')
    buttonColorWidget.className = 'theme'
    buttonColorWidget.innerText = 'Color Picker'
    buttonColorWidget.addEventListener('click', () => {
      this.divColorWidgetWindow = document.createElement('div')
      this.divColor = document.createElement('div')
      this.divColorFullscreen = null
      this.canvasHues = document.createElement('canvas')
      this.canvasColors = document.createElement('canvas')
      this.pickedColor = pickedColor
      this.hoveredHue = Colors.copy(pickedColor)
      this.hoveredColor = Colors.copy(pickedColor)
      this.callable = callable

      this.mouseDownColors = false
      this.touchDownColors = false
      this.mouseDownHues = false
      this.touchDownHues = false

      this.xColors = 0
      this.yColors = 0
      this.xHues = 0
      this.yHues = 0

      this.createColorWidget()
    })

    return buttonColorWidget
  }

  createColorWidgetIcon(pickedColor, callable) {
    const divColorIcon = document.createElement('div')
    divColorIcon.className = 'color-icon'
    divColorIcon.style.backgroundImage = getBackgroundImage(Colors.copy(pickedColor), 'corner-triangle')
    divColorIcon.style.bottom = '10px'
    divColorIcon.style.left = '10px'
    createDivTooltip(divColorIcon, 'color picker')
    divColorIcon.addEventListener('click', () => {
      this.divColorWidgetWindow = document.createElement('div')
      this.divColor = document.createElement('div')
      this.divColorFullscreen = null
      this.canvasHues = document.createElement('canvas')
      this.canvasColors = document.createElement('canvas')
      this.pickedColor = Colors.copy(pickedColor)
      this.hoveredHue = Colors.copy(pickedColor)
      this.hoveredColor = Colors.copy(pickedColor)
      this.callable = callable

      this.mouseDownColors = false
      this.touchDownColors = false
      this.mouseDownHues = false
      this.touchDownHues = false

      this.xColors = 0
      this.yColors = 0
      this.xHues = 0
      this.yHues = 0

      this.createColorWidget()
    })

    return divColorIcon
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
    const dpr = this.getDPR()
    context.clearRect(0, 0, this.getCanvasWidth(this.canvasColors), this.getCanvasHeight(this.canvasColors))

    const colorGradient = context.createLinearGradient(0, 0, this.getCanvasWidth(this.canvasColors), 0)
    colorGradient.addColorStop(0.01, '#ffffff')
    colorGradient.addColorStop(0.99, Colors.createHSL(`${this.hoveredHue.hsl.h}`, '100', '50').formattedHex)
    context.fillStyle = colorGradient
    context.fillRect(0, 0, this.getCanvasWidth(this.canvasColors), this.getCanvasHeight(this.canvasColors))

    const blackGradient = context.createLinearGradient(0, 0, 0, this.getCanvasHeight(this.canvasColors))
    blackGradient.addColorStop(0.01, '#00000000')
    blackGradient.addColorStop(0.99, '#000000')
    context.fillStyle = blackGradient
    context.fillRect(0, 0, this.getCanvasWidth(this.canvasColors), this.getCanvasHeight(this.canvasColors))

    this.xColors = this.xColors < 1 ? 1 : this.xColors
    this.xColors = this.xColors > this.getCanvasWidth(this.canvasColors) - 1 ? this.getCanvasWidth(this.canvasColors) - 1 : this.xColors
    this.yColors = this.yColors < 1 ? 1 : this.yColors
    this.yColors = this.yColors > this.getCanvasHeight(this.canvasColors) - 1 ? this.getCanvasHeight(this.canvasColors) - 1 : this.yColors

    context.lineWidth = 2
    context.strokeStyle = this.hoveredColor.formattedText
    context.strokeRect(this.xColors - 6, this.yColors - 6, 12, 12)

    const data = context.getImageData(this.xColors * dpr, this.yColors * dpr, 1, 1).data
    this.hoveredColor = Colors.createRGB(`${data[0]}`, `${data[1]}`, `${data[2]}`)
    this.updateDivColor(this.hoveredColor)
  }

  drawCanvasHues() {
    const context = this.canvasHues.getContext('2d')
    const dpr = this.getDPR()
    context.clearRect(0, 0, this.getCanvasWidth(this.canvasHues), this.getCanvasHeight(this.canvasHues))

    const colorGradient = context.createLinearGradient(0, 0, 0, this.getCanvasHeight(this.canvasHues))
    colorGradient.addColorStop(0.01, Colors.createHSL('0', '100', '50').formattedHex)
    colorGradient.addColorStop(0.10, Colors.createHSL('36', '100', '50').formattedHex)
    colorGradient.addColorStop(0.20, Colors.createHSL('72', '100', '50').formattedHex)
    colorGradient.addColorStop(0.30, Colors.createHSL('108', '100', '50').formattedHex)
    colorGradient.addColorStop(0.40, Colors.createHSL('144', '100', '50').formattedHex)
    colorGradient.addColorStop(0.50, Colors.createHSL('180', '100', '50').formattedHex)
    colorGradient.addColorStop(0.60, Colors.createHSL('216', '100', '50').formattedHex)
    colorGradient.addColorStop(0.70, Colors.createHSL('252', '100', '50').formattedHex)
    colorGradient.addColorStop(0.80, Colors.createHSL('288', '100', '50').formattedHex)
    colorGradient.addColorStop(0.90, Colors.createHSL('324', '100', '50').formattedHex)
    colorGradient.addColorStop(0.99, Colors.createHSL('360', '100', '50').formattedHex)
    context.fillStyle = colorGradient
    context.fillRect(0, 0, this.getCanvasWidth(this.canvasHues), this.getCanvasHeight(this.canvasHues))

    this.yHues = this.yHues < 1 ? 1 : this.yHues
    this.yHues = this.yHues > this.getCanvasHeight(this.canvasHues) - 1 ? this.getCanvasHeight(this.canvasHues) - 1 : this.yHues

    context.lineWidth = 2
    context.strokeStyle = this.hoveredHue.formattedText
    context.strokeRect(2, this.yHues - 6, this.getCanvasWidth(this.canvasHues) - 4, 12)

    const data = context.getImageData((this.getCanvasWidth(this.canvasHues) / 2) * dpr, this.yHues * dpr, 1, 1).data
    this.hoveredHue = Colors.createRGB(`${data[0]}`, `${data[1]}`, `${data[2]}`)
  }

  getImageDataColors(event) {
    if (this.mouseDownColors || this.touchDownColors) {
      const bounding = this.canvasColors.getBoundingClientRect()
      this.xColors = (this.mouseDownColors ? event.clientX : event.touches[0].clientX) - bounding.left
      this.yColors = (this.mouseDownColors ? event.clientY : event.touches[0].clientY) - bounding.top
      this.drawCanvasColors(this.canvasColors)
    }
  }

  getImageDataHues(event) {
    if (this.mouseDownHues || this.touchDownHues) {
      const bounding = this.canvasHues.getBoundingClientRect()
      this.xHues = (this.mouseDownHues ? event.clientX : event.touches[0].clientX) - bounding.left
      this.yHues = (this.mouseDownHues ? event.clientY : event.touches[0].clientY) - bounding.top
      this.drawCanvasHues(this.canvasHues)
      this.drawCanvasColors(this.canvasColors)
    }
  }

  setupCanvases() {
    this.resizeCanvasHues(true)
    this.resizeCanvasColors(true)

    const contextHues = this.canvasHues.getContext('2d')
    const contextColors = this.canvasColors.getContext('2d')
    const dpr = this.getDPR()

    let x = this.canvasHues.width / 2
    let y = 0
    for (let y = 0; y <= this.canvasHues.height; y++) {
      const data = contextHues.getImageData(x, y, 1, 1).data
      const hoveredHue = Colors.createRGB(`${data[0]}`, `${data[1]}`, `${data[2]}`)
      if (Math.round(hoveredHue.hsv.h) === Math.round(this.pickedColor.hsv.h)) {
        this.xHues = x / dpr
        this.yHues = y / dpr
        this.drawCanvasHues()
        break
      }
    }

    x = 0
    y = this.canvasColors.height / 2
    for (x = 0; x <= this.canvasColors.width; x++) {
      const data = contextColors.getImageData(x, y, 1, 1).data
      const hoveredColor = Colors.createRGB(`${data[0]}`, `${data[1]}`, `${data[2]}`)
      if (Math.round(hoveredColor.hsv.s) === Math.round(this.pickedColor.hsv.s)) {
        break
      }
    }

    for (y = 0; y <= this.canvasColors.height; y++) {
      const data = contextColors.getImageData(x, y, 1, 1).data
      const hoveredColor = Colors.createRGB(`${data[0]}`, `${data[1]}`, `${data[2]}`)
      if (Math.round(hoveredColor.hsv.v) === Math.round(this.pickedColor.hsv.v)) {
        this.xColors = x / dpr
        this.yColors = y / dpr
        this.drawCanvasColors()

        let data = contextColors.getImageData(this.xColors * dpr, this.yColors * dpr, 1, 1).data
        let hoveredColorActual = Colors.createRGB(`${data[0]}`, `${data[1]}`, `${data[2]}`)
        if (Colors.notEqual(hoveredColorActual, this.pickedColor)) {
          for (let x1 = this.xColors - 8; x1 < this.xColors + 8; x1 += 0.1) {
            for (let y1 = this.yColors - 8; y1 < this.yColors + 8; y1 += 0.1) {
              data = contextColors.getImageData(x1 * dpr, y1 * dpr, 1, 1).data
              hoveredColorActual = Colors.createRGB(`${data[0]}`, `${data[1]}`, `${data[2]}`)
              if (Colors.equal(hoveredColorActual, this.pickedColor)) {
                this.xColors = x1
                this.yColors = y1
                this.drawCanvasColors()
                break
              }
            }
            if (Colors.equal(hoveredColorActual, this.pickedColor)) {
              break
            }
          }
        }
        break
      }
    }
  }
}

export { ColorPicker }