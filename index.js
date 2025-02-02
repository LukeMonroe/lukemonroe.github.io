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
  palettesColumn.appendChild(createH3('Palette A'))
  palettesColumn.appendChild(paletteARow(colorPicked, divCopied, storageItem))

  const historyColumn = createDivInnerColumn()
  historyColumn.appendChild(createH2('History'))
  historyColumn.appendChild(createH3('Colors'))
  historyColumn.appendChild(historyRow(colorPicked, divCopied, storageItem))

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
  gradientsColumn.appendChild(gradientRow(colorPicked01, colorPicked02, divCopied, storageItem01))

  const historyColumn = createDivInnerColumn()
  historyColumn.appendChild(createH2('History'))
  historyColumn.appendChild(createH3('Colors'))
  historyColumn.appendChild(historyRow(colorPicked01, divCopied, storageItem01))
  historyColumn.appendChild(historyRow(colorPicked02, divCopied, storageItem02))

  const outerColumn = document.getElementById('outer-column')
  outerColumn.replaceChildren()
  outerColumn.appendChild(titleRow)
  outerColumn.appendChild(colorRow01)
  outerColumn.appendChild(colorRow02)
  outerColumn.appendChild(gradientsColumn)
  outerColumn.appendChild(historyColumn)
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

function gradientRow(colorPicked01, colorPicked02, divCopied, storageItem01, storageItem02) {
  return buildColorGradientRow(createDivColorRowSmall(), Colors.gradient(colorPicked01, colorPicked02), colorPicked01, colorPicked02, divCopied, storageItem01, storageItem02)
}

function historyRow(colorPicked, divCopied, storageItem) {
  let colors = []
  let index = 0
  while (localStorage.getItem(`history${storageItem}${index}`) !== null) {
    colors.push(Colors.createHex(localStorage.getItem(`history${storageItem}${index++}`)))
  }
  if (colors.length === 0 || Colors.notEqual(colors[colors.length - 1], colorPicked)) {
    colors.push(colorPicked)
  }
  if (colors.length > 12) {
    colors = colors.slice(colors.length - 12, colors.length)
  }
  for (let index = 0; index < colors.length; index++) {
    localStorage.setItem(`history${storageItem}${index}`, colors[index].formattedHex)
  }

  return buildColorRow(createDivColorRow(), colors, colorPicked, divCopied, storageItem)
}

function buildColorRow(row, colors, colorPicked, divCopied, storageItem) {
  row.replaceChildren()
  colors.forEach(color => {
    row.appendChild(Colors.equal(color, colorPicked) ? createDivColorWithDivMarker(color, divCopied, storageItem) : createDivColor(color, divCopied, storageItem))
  })

  return row
}

function buildColorGradientRow(row, colors, colorPicked01, colorPicked02, divCopied, storageItem01, storageItem02) {
  row.replaceChildren()
  row.appendChild(createDivColorWithDivMarker(colorPicked01, divCopied, storageItem01))
  row.appendChild(createDivColorWithDivMarker(colorPicked02, divCopied, storageItem02))

  return row
}
