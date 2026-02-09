import { Colors } from './colors.js'
import { createDivColorIconHeart } from './favorites.js'
import { getBackgroundImage } from './images.js'
import { createDivTooltip } from './tooltips.js'
import { createDivColorText } from './text.js'
import { createDivColorIconFullscreen } from './fullscreen.js'

class ImagePicker {
  divColorWidgetWindow = null
  divColor = null
  canvasColors = null
  callable = null
  pickedColor = null
  hoveredColor = null

  mouseDownColors = false
  touchDownColors = false

  xColors = 0
  yColors = 0

  canvasColorsImage = new Image()
  canvasColorsScale = 1
  canvasColorsScaleStep = 0.005
  canvasColorsScaleToggle = false
  xColorsOffset = 0
  yColorsOffset = 0
  xColorsLast = 0
  yColorsLast = 0

  createDivColorIconCheckmark(color) {
    const divColorIcon = document.createElement('div')
    divColorIcon.className = 'color-icon'
    divColorIcon.style.backgroundImage = getBackgroundImage(color, 'checkmark')
    divColorIcon.style.bottom = '10px'
    divColorIcon.style.right = '10px'
    createDivTooltip(divColorIcon, 'load')
    divColorIcon.addEventListener('click', () => {
      document.body.removeChild(this.divColorWidgetWindow)
      this.divColorWidgetWindow = null
      document.body.style.overflow = 'auto'
      this.callable(color)
    })

    return divColorIcon
  }

  createDivColorIconEyedropper(color) {
    const divColorIcon = document.createElement('div')
    divColorIcon.className = 'color-icon'
    divColorIcon.style.backgroundImage = getBackgroundImage(color, 'raindrop')
    divColorIcon.style.bottom = '10px'
    divColorIcon.style.left = '10px'
    createDivTooltip(divColorIcon, 'eyedropper')
    divColorIcon.addEventListener('click', () => {
      if (window.EyeDropper) {
        const eyeDropper = new EyeDropper()
        eyeDropper
          .open()
          .then(csr => {
            const colorEyedropped = Colors.createHex(csr.sRGBHex)
            if (colorEyedropped !== null && Colors.notEqual(colorEyedropped, this.pickedColor)) {
              this.pickedColor = colorEyedropped
              this.setupCanvases()
              this.updateDivColor(colorEyedropped)
            }
          })
          .catch(error => { })
      } else {
        alert('Eyedropper is only available on the desktop version of Chrome or Edge.')
      }
    })

    return divColorIcon
  }

  updateDivColor(color) {
    this.divColor.className = 'cp-color'
    this.divColor.style.backgroundColor = color.formattedHex
    this.divColor.style.color = color.formattedText
    this.divColor.replaceChildren()
    this.divColor.appendChild(createDivColorText(color.formattedHex))
    this.divColor.appendChild(createDivColorText(color.formattedRGB))
    this.divColor.appendChild(createDivColorText(color.formattedHSL))
    this.divColor.appendChild(createDivColorText(color.formattedHSV))
    this.divColor.appendChild(createDivColorText(color.formattedCMYK))
    this.divColor.appendChild(createDivColorText(color.formattedCRWhite))
    this.divColor.appendChild(createDivColorText(color.formattedCRBlack))
    this.divColor.appendChild(createDivColorIconHeart(color))
    this.divColor.appendChild(createDivColorIconFullscreen(color))
    this.divColor.appendChild(this.createDivColorIconCheckmark(color))
    this.divColor.appendChild(this.createDivColorIconEyedropper(color))
    const children = this.divColor.children
    for (let index = 0; index < children.length; index++) {
      children[index].style.display = 'block'
    }
  }

  createColorWidget() {
    this.canvasColors.style.touchAction = 'none'
    this.canvasColors.style.height = '300px'
    this.canvasColors.style.width = '100%'
    this.canvasColors.style.minWidth = '0px'
    this.canvasColors.height = 200
    this.canvasColors.width = 200

    this.canvasColorsImage.addEventListener('load', (event) => {
      this.setupCanvases()
      this.updateDivColor(this.pickedColor)
    })

    const buttonScaleToggle = document.createElement('button')
    buttonScaleToggle.className = 'theme'
    buttonScaleToggle.innerText = 'Drag Image'
    buttonScaleToggle.style.height = '50px'
    buttonScaleToggle.style.width = '100%'
    buttonScaleToggle.addEventListener('click', (event) => {
      buttonScaleToggle.innerText = `${this.canvasColorsScaleToggle ? 'Drag' : 'Zoom'} Image`
      this.canvasColorsScaleToggle = !this.canvasColorsScaleToggle
    })

    const inputImage = document.createElement('input')
    inputImage.type = 'file'
    inputImage.accept = 'image/*'
    inputImage.style.display = 'none'
    inputImage.addEventListener('change', (event) => {
      const image = event.target.files[0];
      if (image !== null) {
        this.canvasColorsImage.src = URL.createObjectURL(image)
      }
    })

    const buttonImage = document.createElement('button')
    buttonImage.className = 'theme'
    buttonImage.innerText = 'Choose Image'
    buttonImage.style.height = '50px'
    buttonImage.style.width = '100%'
    buttonImage.addEventListener('click', (event) => {
      inputImage.click()
    })

    const divCanvasRow = document.createElement('div')
    divCanvasRow.style.display = 'flex'
    divCanvasRow.style.flexDirection = 'column'
    divCanvasRow.style.justifyContent = 'center'
    divCanvasRow.style.alignItems = 'center'
    divCanvasRow.style.width = '100%'
    divCanvasRow.appendChild(buttonScaleToggle)
    divCanvasRow.appendChild(this.canvasColors)
    divCanvasRow.appendChild(buttonImage)
    divCanvasRow.appendChild(inputImage)

    const divInnerRow = document.createElement('div')
    divInnerRow.className = 'cp-inner-row'
    divInnerRow.style.backgroundColor = 'var(--background-color)'
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
    this.canvasColors.addEventListener('wheel', (event) => {
      event.preventDefault()
      if (!this.canvasColorsScaleToggle) {
        this.canvasColorsScale += event.deltaY * this.canvasColorsScaleStep
        this.canvasColorsScale = Math.min(Math.max(1, this.canvasColorsScale), 20)
      }
      this.drawCanvasColors(this.canvasColors)
    })
    this.canvasColors.addEventListener('click', (event) => {
      this.mouseDownColors = true
      this.getImageDataColors(event)
      this.mouseDownColors = false
    })

    this.updateDivColor(this.pickedColor)
    document.body.appendChild(this.divColorWidgetWindow)
    document.body.style.overflow = 'hidden'
    this.setupCanvases()
    this.updateDivColor(this.pickedColor)

    window.addEventListener('resize', () => {
      if (this.divColorWidgetWindow !== null) {
        this.resizeCanvasColors()
      }
    })
    window.addEventListener('orientationchange', () => {
      if (this.divColorWidgetWindow !== null) {
        this.resizeCanvasColors()
      }
    })
  }

  createImagePickerButton(pickedColor, callable) {
    const buttonColorWidget = document.createElement('button')
    buttonColorWidget.className = 'theme'
    buttonColorWidget.innerText = 'Image Picker'
    buttonColorWidget.addEventListener('click', () => {
      this.divColorWidgetWindow = document.createElement('div')
      this.divColor = document.createElement('div')
      this.canvasColors = document.createElement('canvas')
      this.pickedColor = Colors.copy(pickedColor)
      this.hoveredColor = Colors.copy(pickedColor)
      this.callable = callable

      this.mouseDownColors = false
      this.touchDownColors = false

      this.xColors = 0
      this.yColors = 0

      this.createColorWidget()
    })

    return buttonColorWidget
  }

  createImagePickerIcon(pickedColor, callable) {
    const divColorIcon = document.createElement('div')
    divColorIcon.className = 'color-icon'
    divColorIcon.style.backgroundImage = getBackgroundImage(Colors.copy(pickedColor), 'hexagon')
    divColorIcon.style.bottom = '10px'
    divColorIcon.style.left = '10px'
    createDivTooltip(divColorIcon, 'image picker')
    divColorIcon.addEventListener('click', () => {
      this.divColorWidgetWindow = document.createElement('div')
      this.divColor = document.createElement('div')
      this.canvasColors = document.createElement('canvas')
      this.pickedColor = Colors.copy(pickedColor)
      this.hoveredColor = Colors.copy(pickedColor)
      this.callable = callable

      this.mouseDownColors = false
      this.touchDownColors = false

      this.xColors = 0
      this.yColors = 0

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

  drawCanvasColors() {
    const context = this.canvasColors.getContext('2d')
    const dpr = this.getDPR()
    context.clearRect(0, 0, this.getCanvasWidth(this.canvasColors), this.getCanvasHeight(this.canvasColors))

    if (this.canvasColorsImage.src.length > 0) {
      const imageScale = Math.min(this.getCanvasWidth(this.canvasColors) / this.canvasColorsImage.naturalWidth, this.getCanvasHeight(this.canvasColors) / this.canvasColorsImage.naturalHeight)
      const imageWidth = this.canvasColorsImage.naturalWidth * imageScale
      const imageHeight = this.canvasColorsImage.naturalHeight * imageScale

      var imageX = (this.getCanvasWidth(this.canvasColors) - imageWidth) / 2
      var imageY = (this.getCanvasHeight(this.canvasColors) - imageHeight) / 2
      imageX = imageX - Math.max(0, (((imageWidth * this.canvasColorsScale) - imageWidth) / 2))
      imageY = imageY - Math.max(0, (((imageHeight * this.canvasColorsScale) - imageHeight) / 2))

      if (this.canvasColorsScaleToggle) {
        this.xColorsOffset += this.xColors - this.xColorsLast
        this.yColorsOffset += this.yColors - this.yColorsLast
      }
      this.xColorsLast = this.xColors
      this.yColorsLast = this.yColors

      context.save()
      context.translate(imageX + this.xColorsOffset, imageY + this.yColorsOffset)
      context.scale(this.canvasColorsScale, this.canvasColorsScale)
      context.drawImage(this.canvasColorsImage, 0, 0, imageWidth, imageHeight)
      context.restore()

      this.xColors = this.xColors < 1 ? 1 : this.xColors
      this.xColors = this.xColors > this.getCanvasWidth(this.canvasColors) - 1 ? this.getCanvasWidth(this.canvasColors) - 1 : this.xColors
      this.yColors = this.yColors < 1 ? 1 : this.yColors
      this.yColors = this.yColors > this.getCanvasHeight(this.canvasColors) - 1 ? this.getCanvasHeight(this.canvasColors) - 1 : this.yColors

      const data = context.getImageData(this.xColors * dpr, this.yColors * dpr, 1, 1).data
      this.hoveredColor = Colors.createRGB(`${data[0]}`, `${data[1]}`, `${data[2]}`)

      context.lineWidth = 2
      context.strokeStyle = this.hoveredColor.formattedText
      context.strokeRect(this.xColors - 6, this.yColors - 6, 12, 12)
    }

    this.updateDivColor(this.hoveredColor)
  }

  getImageDataColors(event) {
    if (this.mouseDownColors || this.touchDownColors) {
      const bounding = this.canvasColors.getBoundingClientRect()
      this.xColors = (this.mouseDownColors ? event.clientX : event.touches[0].clientX) - bounding.left
      this.yColors = (this.mouseDownColors ? event.clientY : event.touches[0].clientY) - bounding.top
      this.drawCanvasColors(this.canvasColors)
    }
  }

  setupCanvases() {
    this.resizeCanvasColors(true)

    const dpr = this.getDPR()
    const x = this.canvasColors.width / 2
    const y = this.canvasColors.height / 2

    this.xColors = x / dpr
    this.yColors = y / dpr
    this.drawCanvasColors()
  }
}

export { ImagePicker }