import { ColorPickerThemes } from './color-picker-themes.js'
import { Colors } from './colors.js'

document.addEventListener('dblclick', event => { event.preventDefault() })

createTheme()
createNavigation()
const tool = localStorage.getItem('tool')
let toolPicked = tool === null ? createColorPicker : tool === 'colorPicker' ? createColorPicker : createGradientPicker
toolPicked()

function createTheme() {
  const themes = new ColorPickerThemes()
  themes.setTheme()

  const themeButton = themes.createButtonTheme()
  themeButton.style.position = 'fixed'
  themeButton.style.bottom = "20px"
  themeButton.style.right = "20px"

  document.body.appendChild(themeButton)
}

function createNavigation() {
  const aColors = createA('javascript:void(0);', 'Color Picker')
  aColors.addEventListener('click', () => {
    createColorPicker()
  })
  const aGradients = createA('javascript:void(0);', 'Gradient Picker')
  aGradients.addEventListener('click', () => {
    createGradientPicker()
  })
  const aTop = createA('javascript:void(0);', 'Top Of Page')
  aTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })

  const sideNavigation = createDiv()
  sideNavigation.className = 'side-navigation'
  sideNavigation.appendChild(aColors)
  sideNavigation.appendChild(aGradients)
  sideNavigation.appendChild(aTop)
  sideNavigation.addEventListener('click', () => {
    sideNavigation.style.width = '0px'
  })

  const navigationButton = document.createElement('button')
  navigationButton.className = 'theme'
  navigationButton.innerText = '\u2630'
  navigationButton.style.position = 'fixed'
  navigationButton.style.bottom = "20px"
  navigationButton.style.left = "20px"
  navigationButton.style.fontSize = "24px"
  navigationButton.addEventListener('click', () => {
    sideNavigation.style.width = '300px'
  })

  document.body.appendChild(sideNavigation)
  document.body.appendChild(navigationButton)
}

function createColorPicker() {
  toolPicked = createColorPicker
  localStorage.setItem('tool', 'colorPicker')

  const storageItem = 'hexColorPicker'
  const hex = localStorage.getItem(storageItem)
  const colorPicked = hex === null ? Colors.random() : Colors.createHex(hex)
  localStorage.setItem(storageItem, colorPicked.formattedHex)
  document.documentElement.style.setProperty('--thumb-color', colorPicked.formattedHSL)

  const divCopied = createDivCopied()

  const titleRow = createDivInnerRow()
  titleRow.appendChild(createH1('Color Picker'))

  const hueRow = createDivColorRow()
  const hueSliders = createDoubleInputRangeSliders(1, 90, 1, 'Separation', 12, 1, 360, 1, 'Degrees', 180, hueRow, buildHueRow, colorPicked, divCopied, storageItem)

  const saturationRow = createDivColorRow()
  const saturationSlider = createInputRangeSlider(1, 20, 1, 'Separation', 8, saturationRow, buildSaturationRow, colorPicked, divCopied, storageItem)

  const lightnessRow = createDivColorRow()
  const lightnessSlider = createInputRangeSlider(1, 20, 1, 'Separation', 8, lightnessRow, buildLightnessRow, colorPicked, divCopied, storageItem)

  const boxColumn = createBoxColumn(colorPicked, storageItem)

  const colorRow = createDivInnerRow()
  colorRow.appendChild(createDivColorPicked(colorPicked, divCopied, storageItem))
  colorRow.appendChild(boxColumn)

  const variationsColumn = createDivInnerColumn()
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

  const harmoniesColumn = createDivInnerColumn()
  harmoniesColumn.appendChild(createH2('Harmonies'))
  harmoniesColumn.appendChild(createH3('Complementary'))
  harmoniesColumn.appendChild(complementaryRow(colorPicked, divCopied, storageItem))
  harmoniesColumn.appendChild(createH3('Split Complementary'))
  harmoniesColumn.appendChild(splitComplementaryRow(colorPicked, divCopied, storageItem))
  harmoniesColumn.appendChild(createH3('Analogous'))
  harmoniesColumn.appendChild(analogousRow(colorPicked, divCopied, storageItem))
  harmoniesColumn.appendChild(createH3('Triadic'))
  harmoniesColumn.appendChild(triadicRow(colorPicked, divCopied, storageItem))
  harmoniesColumn.appendChild(createH3('Tetradic'))
  harmoniesColumn.appendChild(tetradicRow(colorPicked, divCopied, storageItem))
  harmoniesColumn.appendChild(createH3('Square'))
  harmoniesColumn.appendChild(squareRow(colorPicked, divCopied, storageItem))

  const palettesColumn = createDivInnerColumn()
  palettesColumn.appendChild(createH2('Palettes'))
  palettesColumn.appendChild(createH3('Palette One'))
  palettesColumn.appendChild(paletteARow(colorPicked, divCopied, storageItem))

  const historyColumn = createDivInnerColumn()
  historyColumn.appendChild(createH2('History'))
  historyColumn.appendChild(createH3('Colors'))
  historyColumn.appendChild(historyColorRow(colorPicked, divCopied, storageItem))

  const outerColumn = document.getElementById('outer-column')
  outerColumn.replaceChildren()
  outerColumn.appendChild(titleRow)
  outerColumn.appendChild(colorRow)
  outerColumn.appendChild(variationsColumn)
  outerColumn.appendChild(harmoniesColumn)
  outerColumn.appendChild(palettesColumn)
  outerColumn.appendChild(historyColumn)
  outerColumn.appendChild(divCopied)

  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function createGradientPicker() {
  toolPicked = createGradientPicker
  localStorage.setItem('tool', 'gradientPicker')

  const storageItem01 = 'hexGradientPicker01'
  const hex01 = localStorage.getItem(storageItem01)
  const colorPicked01 = hex01 === null ? Colors.random() : Colors.createHex(hex01)
  localStorage.setItem(storageItem01, colorPicked01.formattedHex)
  document.documentElement.style.setProperty('--thumb-color', colorPicked01.formattedHSL)

  const storageItem02 = 'hexGradientPicker02'
  const hex02 = localStorage.getItem(storageItem02)
  const colorPicked02 = hex02 === null ? Colors.random() : Colors.createHex(hex02)
  localStorage.setItem(storageItem02, colorPicked02.formattedHex)

  const divCopied = createDivCopied()

  const titleRow = createDivInnerRow()
  titleRow.appendChild(createH1('Gradient Picker'))

  const boxColumn01 = createBoxColumn(colorPicked01, storageItem01)
  const boxColumn02 = createBoxColumn(colorPicked02, storageItem02)

  const colorRow01 = createDivInnerRow()
  colorRow01.appendChild(createDivColorPicked(colorPicked01, divCopied, storageItem01))
  colorRow01.appendChild(boxColumn01)

  const colorRow02 = createDivInnerRow()
  colorRow02.appendChild(createDivColorPicked(colorPicked02, divCopied, storageItem02))
  colorRow02.appendChild(boxColumn02)

  const gradientsColumn = createDivInnerColumn()
  gradientsColumn.appendChild(createH2('Gradients'))
  gradientsColumn.appendChild(createH3('Left To Right'))
  gradientsColumn.appendChild(gradientRow(colorPicked01, colorPicked02, colorPicked01, colorPicked02, divCopied, storageItem01, storageItem02, 'linear', '0deg', '0%'))
  gradientsColumn.appendChild(createH3('Right To Left'))
  gradientsColumn.appendChild(gradientRow(colorPicked01, colorPicked02, colorPicked01, colorPicked02, divCopied, storageItem01, storageItem02, 'linear', '180deg', '0%'))
  gradientsColumn.appendChild(createH3('Bottom Left To Top Right'))
  gradientsColumn.appendChild(gradientRow(colorPicked01, colorPicked02, colorPicked01, colorPicked02, divCopied, storageItem01, storageItem02, 'linear', '45deg', '0%'))
  gradientsColumn.appendChild(createH3('Bottom Right To Top Left'))
  gradientsColumn.appendChild(gradientRow(colorPicked01, colorPicked02, colorPicked01, colorPicked02, divCopied, storageItem01, storageItem02, 'linear', '135deg', '0%'))
  gradientsColumn.appendChild(createH3('Bottom To Top'))
  gradientsColumn.appendChild(gradientRow(colorPicked01, colorPicked02, colorPicked01, colorPicked02, divCopied, storageItem01, storageItem02, 'linear', '90deg', '0%'))
  gradientsColumn.appendChild(createH3('Top To Bottom'))
  gradientsColumn.appendChild(gradientRow(colorPicked01, colorPicked02, colorPicked01, colorPicked02, divCopied, storageItem01, storageItem02, 'linear', '270deg', '0%'))
  gradientsColumn.appendChild(createH3('Inside To Outside'))
  gradientsColumn.appendChild(gradientRow(colorPicked01, colorPicked02, colorPicked01, colorPicked02, divCopied, storageItem01, storageItem02, 'radial', 'circle', '0%'))
  gradientsColumn.appendChild(createH3('Outside To Inside'))
  gradientsColumn.appendChild(gradientRow(colorPicked02, colorPicked01, colorPicked01, colorPicked01, divCopied, storageItem01, storageItem02, 'radial', 'circle', '0%'))

  const historyColumn = createDivInnerColumn()
  historyColumn.appendChild(createH2('History'))
  historyColumn.appendChild(createH3('Gradients'))
  historyGradientRow(historyColumn, colorPicked01, colorPicked02, divCopied, storageItem01, storageItem02)

  const examplesColumn = createDivInnerColumn()
  examplesColumn.appendChild(createH2('Examples'))
  for (let index = 0; index < 20; index++) {
    const color01 = Colors.random()
    const color02 = Colors.random()
    examplesColumn.appendChild(gradientRow(color01, color02, colorPicked01, colorPicked02, divCopied, storageItem01, storageItem02, 'linear', '0deg', '0%'))
    examplesColumn.appendChild(createButtonGradient(color01, color02, storageItem01, storageItem02))
  }
  examplesColumn.appendChild(createButtonExamples(examplesColumn, colorPicked01, colorPicked02, divCopied, storageItem01, storageItem02, 'linear', '0deg', '0%'))

  const outerColumn = document.getElementById('outer-column')
  outerColumn.replaceChildren()
  outerColumn.appendChild(titleRow)
  outerColumn.appendChild(colorRow01)
  outerColumn.appendChild(colorRow02)
  outerColumn.appendChild(gradientsColumn)
  outerColumn.appendChild(historyColumn)
  outerColumn.appendChild(examplesColumn)
  outerColumn.appendChild(divCopied)

  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function createDivInnerColumn() {
  const column = createDiv()
  column.className = 'inner-column'

  return column
}

function createDivInnerRow() {
  const row = createDiv()
  row.className = 'inner-row'

  return row
}

function createDivColorRow() {
  const row = createDiv()
  row.className = 'color-row'

  return row
}

function createDivColorRowSmall() {
  const row = createDiv()
  row.className = 'color-row-small'

  return row
}

function createDivColorPicked(color, divCopied, storageItem) {
  const divColor = createDivColorWithDivMarker(color, divCopied, storageItem)
  divColor.style.height = '300px'
  divColor.style.maxWidth = '600px'
  divColor.addEventListener('click', () => {
    if (document.fullscreenElement === null) {
      openFullscreen(divColor)
    } else {
      closeFullscreen()
    }
  })

  return divColor
}

function openFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen()
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen()
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen()
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen()
  }
}

function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen()
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen()
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen()
  }
}

function createDivColorWithDivMarker(color, divCopied, storageItem) {
  const divMarker = createDivMarker(color)
  const divColor = createDivColor(color, divCopied, storageItem)
  divColor.appendChild(divMarker)
  divColor.addEventListener('mouseenter', () => {
    divMarker.style.display = 'none'
  })
  divColor.addEventListener('mouseleave', () => {
    divMarker.style.display = 'block'
  })

  return divColor
}

function createDivGradient(color01, color02, type, value, position) {
  const divColor = createDiv()
  divColor.className = 'color'
  divColor.style.backgroundColor = color01.formattedHSL
  divColor.style.color = color01.formattedText
  divColor.style.background = color01.formattedHex
  divColor.style.background = `${type}-gradient(${value}, ${color01.formattedHex} ${position}, ${color02.formattedHex}`
  divColor.style.background = `-moz-${type}-gradient(${value}, ${color01.formattedHex} ${position}, ${color02.formattedHex}`
  divColor.style.background = `-webkit-${type}-gradient(${value}, ${color01.formattedHex} ${position}, ${color02.formattedHex}`

  return divColor
}

function createDivMarker(color) {
  const divMarker = createDiv()
  divMarker.className = 'marker'
  divMarker.style.backgroundColor = color.formattedText
  divMarker.style.display = 'block'

  return divMarker
}

function createDivCopied() {
  const divCopied = createDiv()
  divCopied.className = 'copied'
  divCopied.appendChild(createH4('Color copied to clipboard'))

  return divCopied
}

function createDivColorText(innerText, divCopied) {
  const divColorText = createDiv()
  divColorText.className = 'color-text'
  divColorText.innerText = innerText
  divColorText.addEventListener('click', () => {
    navigator.clipboard.writeText(divColorText.innerText)
    divCopied.style.opacity = '1'
    setTimeout(function () { divCopied.style.opacity = '0' }, 3000)
  })

  return divColorText
}

function createDivColor(color, divCopied, storageItem) {
  const hex = createDivColorText(color.formattedHex, divCopied)
  const rgb = createDivColorText(color.formattedRGB, divCopied)
  const hsl = createDivColorText(color.formattedHSL, divCopied)
  const grayscale = createDivColorText(`grayscale: ${color.grayscale}`, divCopied)

  const divColor = createDiv()
  divColor.className = 'color'
  divColor.style.backgroundColor = color.formattedHSL
  divColor.style.color = color.formattedText
  divColor.appendChild(hex)
  divColor.appendChild(rgb)
  divColor.appendChild(hsl)
  divColor.appendChild(grayscale)
  divColor.addEventListener('mouseenter', () => {
    hex.style.display = 'block'
    rgb.style.display = 'block'
    hsl.style.display = 'block'
    grayscale.style.display = 'block'
    divColor.style.boxShadow = `2px 2px ${divColor.style.color} inset, -2px -2px ${divColor.style.color} inset`
  })
  divColor.addEventListener('mouseleave', () => {
    hex.style.display = 'none'
    rgb.style.display = 'none'
    hsl.style.display = 'none'
    grayscale.style.display = 'none'
    divColor.style.boxShadow = 'none'
  })
  divColor.addEventListener('click', () => {
    hex.style.display = 'block'
    rgb.style.display = 'block'
    hsl.style.display = 'block'
    grayscale.style.display = 'block'
    divColor.style.boxShadow = `2px 2px ${divColor.style.color} inset, -2px -2px ${divColor.style.color} inset`
  })
  divColor.addEventListener('dblclick', () => {
    localStorage.setItem(storageItem, color.formattedHex)
    toolPicked()
  })

  return divColor
}

function createDivInputColumn() {
  const divBoxColumn = createDiv()
  divBoxColumn.className = 'input-column'

  return divBoxColumn
}

function createDivInputRow() {
  const divBoxRow = createDiv()
  divBoxRow.className = 'input-row'

  return divBoxRow
}

function createInputTextBox() {
  const inputTextBox = document.createElement('input')
  inputTextBox.className = 'box'
  inputTextBox.type = 'text'

  return inputTextBox
}

function createInputRangeSlider(min, max, step, text, value, row, updateFunction, colorPicked, divCopied, storageItem) {
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
    updateFunction(row, inputRangeSlider.value, colorPicked, divCopied, storageItem)
  })

  const divSlider = createDiv()
  divSlider.className = 'slider'
  divSlider.appendChild(h4Slider)
  divSlider.appendChild(inputRangeSlider)

  updateFunction(row, inputRangeSlider.value, colorPicked, divCopied, storageItem)

  return divSlider
}

function createDoubleInputRangeSliders(min01, max01, step01, text01, value01, min02, max02, step02, text02, value02, row, updateFunction, colorPicked, divCopied, storageItem) {
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
    updateFunction(row, inputRangeSlider01.value, inputRangeSlider02.value, colorPicked, divCopied, storageItem)
  })

  inputRangeSlider02.addEventListener('input', () => {
    h4Slider02.innerText = `${text02}: ${inputRangeSlider02.value}`
    updateFunction(row, inputRangeSlider01.value, inputRangeSlider02.value, colorPicked, divCopied, storageItem)
  })

  const divSlider01 = createDiv()
  divSlider01.className = 'slider'
  divSlider01.appendChild(h4Slider01)
  divSlider01.appendChild(inputRangeSlider01)

  const divSlider02 = createDiv()
  divSlider02.className = 'slider'
  divSlider02.appendChild(h4Slider02)
  divSlider02.appendChild(inputRangeSlider02)

  updateFunction(row, inputRangeSlider01.value, inputRangeSlider02.value, colorPicked, divCopied, storageItem)

  return [divSlider01, divSlider02]
}

function createButtonGradient(color01, color02, storageItem01, storageItem02) {
  const buttonGradient = document.createElement('button')
  buttonGradient.className = 'theme'
  buttonGradient.innerText = 'Load Gradient'
  buttonGradient.addEventListener('click', () => {
    localStorage.setItem(storageItem01, color01.formattedHex)
    localStorage.setItem(storageItem02, color02.formattedHex)
    toolPicked()
  })

  return buttonGradient
}

function createButtonExamples(col, colorPicked01, colorPicked02, divCopied, storageItem01, storageItem02, type, value, position) {
  const buttonExamples = document.createElement('button')
  buttonExamples.className = 'theme'
  buttonExamples.innerText = 'More Examples'
  buttonExamples.addEventListener('click', () => {
    for (let index = 0; index < 20; index++) {
      const color01 = Colors.random()
      const color02 = Colors.random()
      col.insertBefore(gradientRow(color01, color02, colorPicked01, colorPicked02, divCopied, storageItem01, storageItem02, type, value, position), col.lastElementChild)
      col.insertBefore(createButtonGradient(color01, color02, storageItem01, storageItem02), col.lastElementChild)
    }
  })

  return buttonExamples
}

function createButtonEyedropper(colorPicked, storageItem) {
  const buttonEyedropper = document.createElement('button')
  buttonEyedropper.className = 'theme'
  buttonEyedropper.innerText = 'Eyedropper'
  buttonEyedropper.addEventListener('click', () => {
    const eyeDropper = new EyeDropper()

    eyeDropper
      .open()
      .then((colorSelectionResult) => {
        const color = Colors.createHex(colorSelectionResult.sRGBHex)
        if (color !== null && Colors.notEqual(color, colorPicked)) {
          localStorage.setItem(storageItem, color.formattedHex)
          toolPicked()
        } else {
          hexBox.value = colorPicked.formattedHex
        }
      })
      .catch(error => {
      })
  })

  return buttonEyedropper
}

function createBoxColumn(colorPicked, storageItem) {
  const hexBoxRow = createDivInputRow()
  const hexBox = createInputTextBox()
  hexBox.maxLength = '7'
  hexBox.style.width = '107px'
  hexBox.value = colorPicked.formattedHex
  hexBox.addEventListener('focusout', () => {
    const color = Colors.createHex(hexBox.value)
    if (color !== null && Colors.notEqual(color, colorPicked)) {
      localStorage.setItem(storageItem, color.formattedHex)
      toolPicked()
    } else {
      hexBox.value = colorPicked.formattedHex
    }
  })
  hexBox.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      const color = Colors.createHex(hexBox.value)
      if (color !== null && Colors.notEqual(color, colorPicked)) {
        localStorage.setItem(storageItem, color.formattedHex)
        toolPicked()
      } else {
        hexBox.value = colorPicked.formattedHex
      }
    }
  })

  hexBoxRow.appendChild(createH4('hex:'))
  hexBoxRow.appendChild(hexBox)

  const rgbBoxRow = createDivInputRow()
  const rBox = createInputTextBox()
  rBox.maxLength = '3'
  rBox.value = colorPicked.rgb.r
  const gBox = createInputTextBox()
  gBox.maxLength = '3'
  gBox.value = colorPicked.rgb.g
  const bBox = createInputTextBox()
  bBox.maxLength = '3'
  bBox.value = colorPicked.rgb.b

  rBox.addEventListener('focusout', () => {
    const color = Colors.createRGB(rBox.value, gBox.value, bBox.value)
    if (color !== null && Colors.notEqual(color, colorPicked)) {
      localStorage.setItem(storageItem, color.formattedHex)
      toolPicked()
    } else {
      rBox.value = colorPicked.rgb.r
    }
  })
  rBox.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      const color = Colors.createRGB(rBox.value, gBox.value, bBox.value)
      if (color !== null && Colors.notEqual(color, colorPicked)) {
        localStorage.setItem(storageItem, color.formattedHex)
        toolPicked()
      } else {
        rBox.value = colorPicked.rgb.r
      }
    }
  })
  gBox.addEventListener('focusout', () => {
    const color = Colors.createRGB(rBox.value, gBox.value, bBox.value)
    if (color !== null && Colors.notEqual(color, colorPicked)) {
      localStorage.setItem(storageItem, color.formattedHex)
      toolPicked()
    } else {
      gBox.value = colorPicked.rgb.g
    }
  })
  gBox.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      const color = Colors.createRGB(rBox.value, gBox.value, bBox.value)
      if (color !== null && Colors.notEqual(color, colorPicked)) {
        localStorage.setItem(storageItem, color.formattedHex)
        toolPicked()
      } else {
        gBox.value = colorPicked.rgb.g
      }
    }
  })
  bBox.addEventListener('focusout', () => {
    const color = Colors.createRGB(rBox.value, gBox.value, bBox.value)
    if (color !== null && Colors.notEqual(color, colorPicked)) {
      localStorage.setItem(storageItem, color.formattedHex)
      toolPicked()
    } else {
      bBox.value = colorPicked.rgb.b
    }
  })
  bBox.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      const color = Colors.createRGB(rBox.value, gBox.value, bBox.value)
      if (color !== null && Colors.notEqual(color, colorPicked)) {
        localStorage.setItem(storageItem, color.formattedHex)
        toolPicked()
      } else {
        bBox.value = colorPicked.rgb.b
      }
    }
  })

  rgbBoxRow.appendChild(createH4('rgb:'))
  rgbBoxRow.appendChild(rBox)
  rgbBoxRow.appendChild(gBox)
  rgbBoxRow.appendChild(bBox)

  const hslBoxRow = createDivInputRow()
  const hBox = createInputTextBox()
  hBox.maxLength = '3'
  hBox.value = colorPicked.hsl.h
  const sBox = createInputTextBox()
  sBox.maxLength = '3'
  sBox.value = colorPicked.hsl.s
  const lBox = createInputTextBox()
  lBox.maxLength = '3'
  lBox.value = colorPicked.hsl.l

  hBox.addEventListener('focusout', () => {
    const color = Colors.createHSL(hBox.value, sBox.value, lBox.value)
    if (color !== null && Colors.notEqual(color, colorPicked)) {
      localStorage.setItem(storageItem, color.formattedHex)
      toolPicked()
    } else {
      hBox.value = colorPicked.hsl.h
    }
  })
  hBox.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      const color = Colors.createHSL(hBox.value, sBox.value, lBox.value)
      if (color !== null && Colors.notEqual(color, colorPicked)) {
        localStorage.setItem(storageItem, color.formattedHex)
        toolPicked()
      } else {
        hBox.value = colorPicked.hsl.h
      }
    }
  })
  sBox.addEventListener('focusout', () => {
    const color = Colors.createHSL(hBox.value, sBox.value, lBox.value)
    if (color !== null && Colors.notEqual(color, colorPicked)) {
      localStorage.setItem(storageItem, color.formattedHex)
      toolPicked()
    } else {
      sBox.value = colorPicked.hsl.s
    }
  })
  sBox.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      const color = Colors.createHSL(hBox.value, sBox.value, lBox.value)
      if (color !== null && Colors.notEqual(color, colorPicked)) {
        localStorage.setItem(storageItem, color.formattedHex)
        toolPicked()
      } else {
        sBox.value = colorPicked.hsl.s
      }
    }
  })
  lBox.addEventListener('focusout', () => {
    const color = Colors.createHSL(hBox.value, sBox.value, lBox.value)
    if (color !== null && Colors.notEqual(color, colorPicked)) {
      localStorage.setItem(storageItem, color.formattedHex)
      toolPicked()
    } else {
      lBox.value = colorPicked.hsl.l
    }
  })
  lBox.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      const color = Colors.createHSL(hBox.value, sBox.value, lBox.value)
      if (color !== null && Colors.notEqual(color, colorPicked)) {
        localStorage.setItem(storageItem, color.formattedHex)
        toolPicked()
      } else {
        lBox.value = colorPicked.hsl.l
      }
    }
  })

  hslBoxRow.appendChild(createH4('hsl:'))
  hslBoxRow.appendChild(hBox)
  hslBoxRow.appendChild(sBox)
  hslBoxRow.appendChild(lBox)

  const boxColumn = createDivInputColumn()
  boxColumn.appendChild(hexBoxRow)
  boxColumn.appendChild(rgbBoxRow)
  boxColumn.appendChild(hslBoxRow)
  if (window.EyeDropper) {
    const buttonRow = createDivInputRow()
    buttonRow.appendChild(createButtonEyedropper(colorPicked, storageItem))
    boxColumn.appendChild(buttonRow)
  }

  return boxColumn
}

function createH1(innerText) {
  const h1 = document.createElement('h1')
  h1.innerText = innerText

  return h1
}

function createH2(innerText) {
  const h2 = document.createElement('h2')
  h2.innerText = innerText

  return h2
}

function createH3(innerText) {
  const h3 = document.createElement('h3')
  h3.innerText = innerText

  return h3
}

function createH4(innerText) {
  const h4 = document.createElement('h4')
  h4.innerText = innerText

  return h4
}

function createDiv() {
  return document.createElement('div')
}

function createA(href, innerText) {
  const a = document.createElement('a')
  a.href = href
  a.innerText = innerText

  return a
}

function buildHueRow(row, value, degrees, colorPicked, divCopied, storageItem) {
  buildColorRow(row, Colors.hues(colorPicked, degrees, value), colorPicked, divCopied, storageItem)
}

function buildSaturationRow(row, value, colorPicked, divCopied, storageItem) {
  buildColorRow(row, Colors.saturations(colorPicked, value), colorPicked, divCopied, storageItem)
}

function buildLightnessRow(row, value, colorPicked, divCopied, storageItem) {
  buildColorRow(row, Colors.lightnesses(colorPicked, value), colorPicked, divCopied, storageItem)
}

function complementaryRow(colorPicked, divCopied, storageItem) {
  return buildColorRow(createDivColorRowSmall(), Colors.complementary(colorPicked), colorPicked, divCopied, storageItem)
}

function splitComplementaryRow(colorPicked, divCopied, storageItem) {
  return buildColorRow(createDivColorRowSmall(), Colors.splitComplementary(colorPicked), colorPicked, divCopied, storageItem)
}

function analogousRow(colorPicked, divCopied, storageItem) {
  return buildColorRow(createDivColorRowSmall(), Colors.analogous(colorPicked), colorPicked, divCopied, storageItem)
}

function triadicRow(colorPicked, divCopied, storageItem) {
  return buildColorRow(createDivColorRowSmall(), Colors.triadic(colorPicked), colorPicked, divCopied, storageItem)
}

function tetradicRow(colorPicked, divCopied, storageItem) {
  return buildColorRow(createDivColorRowSmall(), Colors.tetradic(colorPicked), colorPicked, divCopied, storageItem)
}

function squareRow(colorPicked, divCopied, storageItem) {
  return buildColorRow(createDivColorRowSmall(), Colors.square(colorPicked), colorPicked, divCopied, storageItem)
}

function paletteARow(colorPicked, divCopied, storageItem) {
  return buildColorRow(createDivColorRowSmall(), Colors.paletteA(colorPicked), colorPicked, divCopied, storageItem)
}

function gradientRow(color01, color02, colorPicked01, colorPicked02, divCopied, storageItem01, storageItem02, type, value, position) {
  return buildColorGradientRow(createDivColorRowSmall(), Colors.gradient(color01, color02), colorPicked01, colorPicked02, divCopied, storageItem01, storageItem02, type, value, position)
}

function historyColorRow(colorPicked, divCopied, storageItem) {
  let colors = []
  let index = 0
  while (localStorage.getItem(`history${storageItem}${index}`) !== null) {
    colors.push(Colors.createHex(localStorage.getItem(`history${storageItem}${index++}`)))
  }
  if (colors.length === 0 || Colors.notEqual(colors[colors.length - 1], colorPicked)) {
    colors.push(colorPicked)
  }
  if (colors.length > 8) {
    colors = colors.slice(colors.length - 8, colors.length)
  }
  for (let index = 0; index < colors.length; index++) {
    localStorage.setItem(`history${storageItem}${index}`, colors[index].formattedHex)
  }

  return buildColorRow(createDivColorRowSmall(), colors, colorPicked, divCopied, storageItem)
}

function historyGradientRow(col, colorPicked01, colorPicked02, divCopied, storageItem01, storageItem02) {
  let colors01 = []
  let index01 = 0
  while (localStorage.getItem(`history${storageItem01}${index01}`) !== null) {
    colors01.push(Colors.createHex(localStorage.getItem(`history${storageItem01}${index01++}`)))
  }
  if (colors01.length === 0 || Colors.notEqual(colors01[colors01.length - 1], colorPicked01)) {
    colors01.push(colorPicked01)
  }
  if (colors01.length > 8) {
    colors01 = colors01.slice(colors01.length - 8, colors01.length)
  }
  for (let index = 0; index < colors01.length; index++) {
    localStorage.setItem(`history${storageItem01}${index}`, colors01[index].formattedHex)
  }

  let colors02 = []
  let index02 = 0
  while (localStorage.getItem(`history${storageItem02}${index02}`) !== null) {
    colors02.push(Colors.createHex(localStorage.getItem(`history${storageItem02}${index02++}`)))
  }
  if (colors02.length === 0 || Colors.notEqual(colors02[colors02.length - 1], colorPicked02)) {
    colors02.push(colorPicked02)
  }
  if (colors02.length > 8) {
    colors02 = colors02.slice(colors02.length - 8, colors02.length)
  }
  for (let index = 0; index < colors02.length; index++) {
    localStorage.setItem(`history${storageItem02}${index}`, colors02[index].formattedHex)
  }

  const length = colors01.length < colors02.length ? colors02.length : colors01.length
  for (let index = length - 1; index >= 0; index--) {
    const color01 = index < colors01.length ? colors01[index] : colors01[colors01.length - 1]
    const color02 = index < colors02.length ? colors02[index] : colors02[colors02.length - 1]
    col.appendChild(gradientRow(color01, color02, colorPicked01, colorPicked02, divCopied, storageItem01, storageItem02, 'linear', '0deg', '0%'))
    col.appendChild(createButtonGradient(color01, color02, storageItem01, storageItem02))
  }
}

function buildColorRow(row, colors, colorPicked, divCopied, storageItem) {
  row.replaceChildren()
  colors.forEach(color => {
    row.appendChild(Colors.equal(color, colorPicked) ? createDivColorWithDivMarker(color, divCopied, storageItem) : createDivColor(color, divCopied, storageItem))
  })

  return row
}

function buildColorGradientRow(row, colors, colorPicked01, colorPicked02, divCopied, storageItem01, storageItem02, type, value, position) {
  const divColor01 = Colors.equal(colors[0], colorPicked01) ? createDivColorWithDivMarker(colors[0], divCopied, storageItem01) : createDivColor(colors[0], divCopied, storageItem01)
  const divGradient = createDivGradient(colors[0], colors[1], type, value, position)
  const divColor02 = Colors.equal(colors[1], colorPicked02) ? createDivColorWithDivMarker(colors[1], divCopied, storageItem02) : createDivColor(colors[1], divCopied, storageItem02)

  divColor01.style.display = 'none'
  divGradient.style.display = 'flex'
  divColor02.style.display = 'none'
  row.addEventListener('mouseenter', () => {
    divColor01.style.display = 'flex'
    divGradient.style.display = 'none'
    divColor02.style.display = 'flex'
  })
  row.addEventListener('mouseleave', () => {
    divColor01.style.display = 'none'
    divGradient.style.display = 'flex'
    divColor02.style.display = 'none'
  })
  row.addEventListener('click', () => {
    divColor01.style.display = 'flex'
    divGradient.style.display = 'none'
    divColor02.style.display = 'flex'
  })

  row.replaceChildren()
  row.appendChild(divColor01)
  row.appendChild(divGradient)
  row.appendChild(divColor02)

  return row
}
