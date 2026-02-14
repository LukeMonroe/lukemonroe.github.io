import { Colors } from './colors.js'
import { createDivColorIconHeart, isColorLiked } from './favorites.js'
import { getBackgroundImage } from './images.js'
import { createDivTooltip } from './tooltips.js'
import { createH1, createH2, createH3, createH4, createDivColorText } from './text.js'
import { createDivColorIconFullscreen } from './fullscreen.js'

class ColorPickerPage {

  constructor(buttonNavigation, colorPicker, imagePicker) {
    this.buttonNavigation = buttonNavigation
    this.colorPicker = colorPicker
    this.imagePicker = imagePicker
    this.colorPicked = null
    this.buttonToggleInputsText = 'Show'
  }

  createDivColorRow() {
    const row = document.createElement('div')
    row.className = 'color-row'

    return row
  }

  createDivColorRowSmall() {
    const row = document.createElement('div')
    row.className = 'color-row-small'

    return row
  }

  buildColorRow(row, colors) {
    row.replaceChildren()
    colors.forEach(color => {
      row.appendChild(this.createDivColor(color, false))
    })

    return row
  }

  createDivColorIconCheckmark(color) {
    const divColorIcon = document.createElement('div')
    divColorIcon.className = 'color-icon'
    divColorIcon.style.backgroundImage = getBackgroundImage(color, 'checkmark')
    divColorIcon.style.bottom = '10px'
    divColorIcon.style.right = '10px'
    createDivTooltip(divColorIcon, 'load')
    divColorIcon.addEventListener('click', () => {
      this.updatePage(color)
    })

    return divColorIcon
  }

  updatePage(color) {
    const colors = this.getHistoryColors()
    colors.push(color)
    this.setHistoryColors(colors)
    this.createPage()
  }

  createPage() {
    localStorage.setItem('tool', 'colorPicker')

    const colors = this.getHistoryColors()
    if (colors.length === 0) {
      colors.push(Colors.random())
      this.setHistoryColors(colors)
    }
    this.colorPicked = colors[colors.length - 1]
    document.documentElement.style.setProperty('--thumb-color', this.colorPicked.formattedHex)

    const hueRow = this.createDivColorRow()
    const hueSliders = this.createInputRangeSliders(1, 90, 1, 'Separation', 12, 1, 360, 1, 'Degrees', 180, hueRow)

    const saturationRow = this.createDivColorRow()
    const saturationSlider = this.createInputRangeSlider(1, 20, 1, 'Separation', 8, saturationRow, "sat")

    const lightnessRow = this.createDivColorRow()
    const lightnessSlider = this.createInputRangeSlider(1, 20, 1, 'Separation', 8, lightnessRow, "lig")

    const divColorPicked = this.createDivColor(this.colorPicked, true)
    divColorPicked.style.height = '400px'
    divColorPicked.style.maxWidth = '800px'

    const colorRow = document.createElement('div')
    colorRow.className = 'inner-row'
    colorRow.appendChild(divColorPicked)
    colorRow.appendChild(this.createDivInputColumn())

    const variationsColumn = document.createElement('div')
    variationsColumn.className = 'inner-column'
    variationsColumn.appendChild(createH2('Variations'))
    variationsColumn.appendChild(createH3('Hue'))
    hueSliders.forEach(hueSlider => {
      variationsColumn.appendChild(hueSlider)
    })
    variationsColumn.appendChild(hueRow)
    variationsColumn.appendChild(createH3('Saturation'))
    variationsColumn.appendChild(saturationSlider)
    variationsColumn.appendChild(saturationRow)
    variationsColumn.appendChild(createH3('Lightness'))
    variationsColumn.appendChild(lightnessSlider)
    variationsColumn.appendChild(lightnessRow)

    const harmoniesColumn = document.createElement('div')
    harmoniesColumn.className = 'inner-column'
    harmoniesColumn.appendChild(createH2('Harmonies'))
    harmoniesColumn.appendChild(createH3('Complementary'))
    harmoniesColumn.appendChild(this.buildColorRow(this.createDivColorRowSmall(), Colors.complementary(this.colorPicked)))
    harmoniesColumn.appendChild(createH3('Split Complementary'))
    harmoniesColumn.appendChild(this.buildColorRow(this.createDivColorRowSmall(), Colors.splitComplementary(this.colorPicked)))
    harmoniesColumn.appendChild(createH3('Analogous'))
    harmoniesColumn.appendChild(this.buildColorRow(this.createDivColorRowSmall(), Colors.analogous(this.colorPicked)))
    harmoniesColumn.appendChild(createH3('Triadic'))
    harmoniesColumn.appendChild(this.buildColorRow(this.createDivColorRowSmall(), Colors.triadic(this.colorPicked)))
    harmoniesColumn.appendChild(createH3('Tetradic'))
    harmoniesColumn.appendChild(this.buildColorRow(this.createDivColorRowSmall(), Colors.tetradic(this.colorPicked)))
    harmoniesColumn.appendChild(createH3('Square'))
    harmoniesColumn.appendChild(this.buildColorRow(this.createDivColorRowSmall(), Colors.square(this.colorPicked)))

    const palettesColumn = document.createElement('div')
    palettesColumn.className = 'inner-column'
    palettesColumn.appendChild(createH2('Palettes'))
    palettesColumn.appendChild(this.buildColorRow(this.createDivColorRowSmall(), Colors.paletteA(this.colorPicked)))

    const historyColumn = document.createElement('div')
    historyColumn.className = 'inner-column'
    historyColumn.appendChild(createH2('History'))
    historyColumn.appendChild(this.buildColorRow(this.createDivColorRow(), this.getHistoryColors()))

    const header = document.getElementById('header')
    header.replaceChildren()
    header.appendChild(this.buttonNavigation)
    header.appendChild(createH1('Color Picker'))

    const outerColumn = document.getElementById('outer-column')
    outerColumn.replaceChildren()
    outerColumn.appendChild(colorRow)
    outerColumn.appendChild(variationsColumn)
    outerColumn.appendChild(harmoniesColumn)
    outerColumn.appendChild(palettesColumn)
    outerColumn.appendChild(historyColumn)

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 10)
  }

  getHistoryColors() {
    const colors = []
    let index = 0
    while (localStorage.getItem(`historyColor${index}`) !== null) {
      colors.push(Colors.createHex(localStorage.getItem(`historyColor${index++}`)))
    }

    return colors
  }

  setHistoryColors(colors) {
    let pos = 0
    for (let index = (colors.length > 8 ? colors.length - 8 : 0); index < colors.length; index++) {
      localStorage.setItem(`historyColor${pos++}`, colors[index].formattedHex)
    }
    for (let index = (colors.length > 8 ? 8 : colors.length); index < 16; index++) {
      localStorage.removeItem(`historyColor${index}`)
    }
  }

  createDivColor(color, picked) {
    const divMarker = document.createElement('div')
    divMarker.className = 'marker'
    divMarker.style.backgroundColor = color.formattedText

    const likeColor = createDivColorIconHeart(color)
    const divColor = document.createElement('div')
    divColor.className = 'color'
    divColor.style.backgroundColor = color.formattedHex
    divColor.style.color = color.formattedText
    divColor.appendChild(createDivColorText(color.formattedHex))
    divColor.appendChild(createDivColorText(color.formattedRGB))
    divColor.appendChild(createDivColorText(color.formattedHSL))
    divColor.appendChild(createDivColorText(color.formattedHSV))
    divColor.appendChild(createDivColorText(color.formattedCMYK))
    divColor.appendChild(createDivColorText(color.formattedCRWhite))
    divColor.appendChild(createDivColorText(color.formattedCRBlack))
    divColor.appendChild(likeColor)
    divColor.appendChild(createDivColorIconFullscreen(color))
    divColor.appendChild(this.createDivColorIconCheckmark(color))
    divColor.appendChild(this.colorPicker.createColorPickerIcon(color, (color) => { this.updatePage(color) }))
    if (Colors.equal(color, this.colorPicked)) {
      divColor.appendChild(divMarker)
    }

    divColor.style.flex = picked ? 'auto' : '1 1 0'
    divColor.addEventListener('mouseenter', () => {
      const children = divColor.children
      for (let index = 0; index < children.length; index++) {
        children[index].style.display = 'block'
      }
      divColor.style.flex = 'auto'
      divColor.style.boxShadow = `2px 2px ${divColor.style.color} inset, -2px -2px ${divColor.style.color} inset`
      divMarker.style.display = 'none'
      likeColor.style.backgroundImage = isColorLiked(color) ? getBackgroundImage(color, 'heart-filled') : getBackgroundImage(color, 'heart-empty')
    })
    divColor.addEventListener('mouseleave', () => {
      const children = divColor.children
      for (let index = 0; index < children.length; index++) {
        children[index].style.display = 'none'
      }
      divColor.style.flex = picked ? 'auto' : '1 1 0'
      divColor.style.boxShadow = 'none'
      divMarker.style.display = 'block'
    })
    divColor.addEventListener('click', () => {
      const children = divColor.children
      for (let index = 0; index < children.length; index++) {
        children[index].style.display = 'block'
      }
      divColor.style.flex = 'auto'
      divColor.style.boxShadow = `2px 2px ${divColor.style.color} inset, -2px -2px ${divColor.style.color} inset`
      divMarker.style.display = 'none'
      likeColor.style.backgroundImage = isColorLiked(color) ? getBackgroundImage(color, 'heart-filled') : getBackgroundImage(color, 'heart-empty')
    })

    return divColor
  }

  createDivInputColumn() {
    const updateHex = (value, divInputBox) => {
      const color = Colors.createHex(divInputBox.value)
      color !== null && Colors.notEqual(color, this.colorPicked) ? this.updatePage(color) : divInputBox.value = String(value)
    }

    const updateRGB = (index, value, divInputBox) => {
      const color = Colors.createRGB(
        String(index === 0 ? divInputBox.value : this.colorPicked.rgb.r),
        String(index === 1 ? divInputBox.value : this.colorPicked.rgb.g),
        String(index === 2 ? divInputBox.value : this.colorPicked.rgb.b),
      )
      color !== null && Colors.notEqual(color, this.colorPicked) ? this.updatePage(color) : divInputBox.value = String(value)
    }

    const updateHSL = (index, value, divInputBox) => {
      const color = Colors.createHSL(
        String(index === 0 ? divInputBox.value : this.colorPicked.hsl.h),
        String(index === 1 ? divInputBox.value : this.colorPicked.hsl.s),
        String(index === 2 ? divInputBox.value : this.colorPicked.hsl.l),
      )
      color !== null && Colors.notEqual(color, this.colorPicked) ? this.updatePage(color) : divInputBox.value = String(value)
    }

    const updateHSV = (index, value, divInputBox) => {
      const color = Colors.createHSV(
        String(index === 0 ? divInputBox.value : this.colorPicked.hsv.h),
        String(index === 1 ? divInputBox.value : this.colorPicked.hsv.s),
        String(index === 2 ? divInputBox.value : this.colorPicked.hsv.v),
      )
      color !== null && Colors.notEqual(color, this.colorPicked) ? this.updatePage(color) : divInputBox.value = String(value)
    }

    const updateCMYK = (index, value, divInputBox) => {
      const color = Colors.createCMYK(
        String(index === 0 ? divInputBox.value : this.colorPicked.cmyk.c),
        String(index === 1 ? divInputBox.value : this.colorPicked.cmyk.m),
        String(index === 2 ? divInputBox.value : this.colorPicked.cmyk.y),
        String(index === 3 ? divInputBox.value : this.colorPicked.cmyk.k),
      )
      color !== null && Colors.notEqual(color, this.colorPicked) ? this.updatePage(color) : divInputBox.value = String(value)
    }

    const divInputBox = document.createElement('input')
    divInputBox.className = 'box'
    divInputBox.type = 'text'
    divInputBox.maxLength = '7'
    divInputBox.style.width = '107px'
    divInputBox.value = this.colorPicked.formattedHex
    divInputBox.addEventListener('focusout', (event) => { updateHex(this.colorPicked.formattedHex, divInputBox) })
    divInputBox.addEventListener('keypress', (event) => { if (event.key === 'Enter') { updateHex(this.colorPicked.formattedHex, divInputBox) } })

    const buttonToggleInputs = document.createElement('button')
    buttonToggleInputs.className = 'theme'
    buttonToggleInputs.innerText = this.buttonToggleInputsText

    const hexBoxRow = document.createElement('div')
    hexBoxRow.className = 'input-row'
    hexBoxRow.appendChild(createH4('hex :'))
    hexBoxRow.appendChild(divInputBox)
    hexBoxRow.appendChild(buttonToggleInputs)

    const divInputRows = []
    const divInputColumn = document.createElement('div')
    divInputColumn.className = 'input-column'
    divInputColumn.appendChild(hexBoxRow)
    for (let [colorFormat, callable] of [['rgb', updateRGB], ['hsl', updateHSL], ['hsv', updateHSV], ['cmyk', updateCMYK]]) {
      const divInputRow = document.createElement('div')
      divInputRow.className = 'input-row'
      divInputRow.style.display = this.buttonToggleInputsText === 'Show' ? 'none' : 'flex'
      divInputRow.appendChild(createH4(`${colorFormat.padEnd(4, ' ')}:`))
      Object.entries(this.colorPicked[colorFormat]).forEach(([key, value], index) => {
        const divInputBox = document.createElement('input')
        divInputBox.className = 'box'
        divInputBox.type = 'text'
        divInputBox.maxLength = '3'
        divInputBox.style.width = '50px'
        divInputBox.value = String(Math.round(value))
        divInputBox.addEventListener('focusout', (event) => { callable(index, Math.round(value), divInputBox) })
        divInputBox.addEventListener('keypress', (event) => { if (event.key === 'Enter') { callable(index, Math.round(value), divInputBox) } })
        divInputRow.appendChild(divInputBox)
      })
      divInputColumn.appendChild(divInputRow)
      divInputRows.push(divInputRow)
    }
    divInputColumn.appendChild(this.colorPicker.createColorPickerButton(this.colorPicked, (color) => { this.updatePage(color) }))
    divInputColumn.appendChild(this.imagePicker.createImagePickerButton(this.colorPicked, (color) => { this.updatePage(color) }))

    buttonToggleInputs.addEventListener('click', (event) => {
      this.buttonToggleInputsText = this.buttonToggleInputsText === 'Show' ? 'Hide' : 'Show'
      buttonToggleInputs.innerText = this.buttonToggleInputsText
      divInputRows.forEach((divInputRow) => { divInputRow.style.display = this.buttonToggleInputsText === 'Show' ? 'none' : 'flex' })
    })

    return divInputColumn
  }

  createInputRangeSlider(min, max, step, text, value, row, slider) {
    const h4Slider = createH4(`${text}: ${value}`)

    const inputRangeSlider = document.createElement('input')
    inputRangeSlider.className = 'slider'
    inputRangeSlider.type = 'range'
    inputRangeSlider.min = min
    inputRangeSlider.max = max
    inputRangeSlider.step = step
    inputRangeSlider.value = value
    inputRangeSlider.addEventListener('input', () => {
      h4Slider.innerText = `${text}: ${inputRangeSlider.value}`
      if (slider === 'sat') {
        this.buildColorRow(row, Colors.saturations(this.colorPicked, inputRangeSlider.value))
      } else {
        this.buildColorRow(row, Colors.lightnesses(this.colorPicked, inputRangeSlider.value))
      }
    })

    const divSlider = document.createElement('div')
    divSlider.className = 'slider'
    divSlider.appendChild(h4Slider)
    divSlider.appendChild(inputRangeSlider)

    if (slider === 'sat') {
      this.buildColorRow(row, Colors.saturations(this.colorPicked, inputRangeSlider.value))
    } else {
      this.buildColorRow(row, Colors.lightnesses(this.colorPicked, inputRangeSlider.value))
    }

    return divSlider
  }

  createInputRangeSliders(min01, max01, step01, text01, value01, min02, max02, step02, text02, value02, row) {
    const h4Slider01 = createH4(`${text01}: ${value01}`)
    const h4Slider02 = createH4(`${text02}: ${value02}`)

    const inputRangeSlider01 = document.createElement('input')
    inputRangeSlider01.className = 'slider'
    inputRangeSlider01.type = 'range'
    inputRangeSlider01.min = min01
    inputRangeSlider01.max = max01
    inputRangeSlider01.step = step01
    inputRangeSlider01.value = value01

    const inputRangeSlider02 = document.createElement('input')
    inputRangeSlider02.className = 'slider'
    inputRangeSlider02.type = 'range'
    inputRangeSlider02.min = min02
    inputRangeSlider02.max = max02
    inputRangeSlider02.step = step02
    inputRangeSlider02.value = value02

    inputRangeSlider01.addEventListener('input', () => {
      h4Slider01.innerText = `${text01}: ${inputRangeSlider01.value}`
      this.buildColorRow(row, Colors.hues(this.colorPicked, inputRangeSlider02.value, inputRangeSlider01.value))
    })

    inputRangeSlider02.addEventListener('input', () => {
      h4Slider02.innerText = `${text02}: ${inputRangeSlider02.value}`
      this.buildColorRow(row, Colors.hues(this.colorPicked, inputRangeSlider02.value, inputRangeSlider01.value))
    })

    const divSlider01 = document.createElement('div')
    divSlider01.className = 'slider'
    divSlider01.appendChild(h4Slider01)
    divSlider01.appendChild(inputRangeSlider01)

    const divSlider02 = document.createElement('div')
    divSlider02.className = 'slider'
    divSlider02.appendChild(h4Slider02)
    divSlider02.appendChild(inputRangeSlider02)

    this.buildColorRow(row, Colors.hues(this.colorPicked, inputRangeSlider02.value, inputRangeSlider01.value))

    return [divSlider01, divSlider02]
  }
}

export { ColorPickerPage }