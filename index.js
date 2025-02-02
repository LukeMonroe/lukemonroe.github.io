import { ColorPickerThemes } from './color-picker-themes.js'
import { Colors } from './colors.js'

const themes = new ColorPickerThemes()
themes.setTheme()

const aColors = createA('javascript:void(0);', 'Colors')
aColors.addEventListener('click', () => {
  createColorPicker()
})
const aGradients = createA('javascript:void(0);', 'Gradients')
aGradients.addEventListener('click', () => {
  createGradientPicker()
})
const aTop = createA('javascript:void(0);', 'Top')
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
  sideNavigation.style.width = '250px'
})

let hueSeparation = 12
let hueDegrees = 180
let toolPicked = null
let colorPicked = null

const divCopied = createDivCopied()

document.body.appendChild(sideNavigation)
document.body.appendChild(navigationButton)

const tool = localStorage.getItem('tool')
toolPicked = tool === null ? createColorPicker : tool === 'colorPicker' ? createColorPicker : createGradientPicker
toolPicked()

function createColorPicker() {
  toolPicked = createColorPicker
  localStorage.setItem('tool', 'colorPicker')

  const hex = localStorage.getItem('hex')
  colorPicked = hex === null ? Colors.random() : Colors.createHex(hex)
  localStorage.setItem('hex', colorPicked.formattedHex)
  document.documentElement.style.setProperty('--thumb-color', colorPicked.formattedHSL)

  const hueRow = createDivColorRow()
  const hueSliderSeparation = createInputRangeSlider(1, 90, 1, 'Separation', 12, hueRow, buildHueRowSeparation)
  const hueSliderDegree = createInputRangeSlider(1, 360, 1, 'Degrees', 180, hueRow, buildHueRowDegree)

  const saturationRow = createDivColorRow()
  const saturationSlider = createInputRangeSlider(1, 20, 1, 'Separation', 8, saturationRow, buildSaturationRow)

  const lightnessRow = createDivColorRow()
  const lightnessSlider = createInputRangeSlider(1, 20, 1, 'Separation', 8, lightnessRow, buildLightnessRow)

  const boxColumn = createBoxColumn()

  const colorRow = createDivInnerRow()
  colorRow.appendChild(createDivColorPicked(colorPicked))
  colorRow.appendChild(boxColumn)

  const variationsColumn = createDivInnerColumn()
  variationsColumn.appendChild(createH2('Variations'))
  variationsColumn.appendChild(createH3('Hue'))
  variationsColumn.appendChild(hueSliderSeparation)
  variationsColumn.appendChild(hueSliderDegree)
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
  harmoniesColumn.appendChild(complementaryRow())
  harmoniesColumn.appendChild(createH3('Split Complementary'))
  harmoniesColumn.appendChild(splitComplementaryRow())
  harmoniesColumn.appendChild(createH3('Analogous'))
  harmoniesColumn.appendChild(analogousRow())
  harmoniesColumn.appendChild(createH3('Triadic'))
  harmoniesColumn.appendChild(triadicRow())
  harmoniesColumn.appendChild(createH3('Tetradic'))
  harmoniesColumn.appendChild(tetradicRow())
  harmoniesColumn.appendChild(createH3('Square'))
  harmoniesColumn.appendChild(squareRow())

  const palettesColumn = createDivInnerColumn()
  palettesColumn.appendChild(createH2('Palettes'))
  palettesColumn.appendChild(createH3('Palette A'))
  palettesColumn.appendChild(paletteARow())

  const historyColumn = createDivInnerColumn()
  historyColumn.appendChild(createH2('History'))
  historyColumn.appendChild(createH3('Colors'))
  historyColumn.appendChild(historyRow())

  const outerColumn = document.getElementById('outer-column')
  outerColumn.replaceChildren()
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

  const hex = localStorage.getItem('hex')
  colorPicked = hex === null ? Colors.random() : Colors.createHex(hex)
  localStorage.setItem('hex', colorPicked.formattedHex)
  document.documentElement.style.setProperty('--thumb-color', colorPicked.formattedHSL)

  const boxColumn = createBoxColumn()

  const colorRow = createDivInnerRow()
  colorRow.appendChild(createDivColorPicked(colorPicked))
  colorRow.appendChild(boxColumn)

  const gradientsColumn = createDivInnerColumn()
  gradientsColumn.appendChild(createH2('Gradients'))
  gradientsColumn.appendChild(complementaryRow())

  const historyColumn = createDivInnerColumn()
  historyColumn.appendChild(createH2('History'))
  historyColumn.appendChild(createH3('Colors'))
  historyColumn.appendChild(historyRow())

  const outerColumn = document.getElementById('outer-column')
  outerColumn.replaceChildren()
  outerColumn.appendChild(colorRow)
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

function createDivColorPicked(color) {
  const divColor = createDivColorWithDivMarker(color)
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

function createDivColorWithDivMarker(color) {
  const divMarker = createDivMarker(color)
  const divColor = createDivColor(color)
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

function createDivColorText(innerText) {
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

function createDivColor(color) {
  const hex = createDivColorText(color.formattedHex)
  const rgb = createDivColorText(color.formattedRGB)
  const hsl = createDivColorText(color.formattedHSL)
  const grayscale = createDivColorText(`grayscale: ${color.grayscale}`)

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
    localStorage.setItem('hex', color.formattedHex)
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

function createInputRangeSlider(min, max, step, text, value, row, updateFunction) {
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
    updateFunction(row, inputRangeSlider.value)
  })

  const divSlider = createDiv()
  divSlider.className = 'slider'
  divSlider.appendChild(h4Slider)
  divSlider.appendChild(inputRangeSlider)

  updateFunction(row, inputRangeSlider.value)

  return divSlider
}

function createButtonEyedropper() {
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
          localStorage.setItem('hex', color.formattedHex)
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

function createBoxColumn() {
  const hexBoxRow = createDivInputRow()
  const hexBox = createInputTextBox()
  hexBox.maxLength = '7'
  hexBox.style.width = '107px'
  hexBox.value = colorPicked.formattedHex
  hexBox.addEventListener('focusout', () => {
    const color = Colors.createHex(hexBox.value)
    if (color !== null && Colors.notEqual(color, colorPicked)) {
      localStorage.setItem('hex', color.formattedHex)
      toolPicked()
    } else {
      hexBox.value = colorPicked.formattedHex
    }
  })
  hexBox.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      const color = Colors.createHex(hexBox.value)
      if (color !== null && Colors.notEqual(color, colorPicked)) {
        localStorage.setItem('hex', color.formattedHex)
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
      localStorage.setItem('hex', color.formattedHex)
      toolPicked()
    } else {
      rBox.value = colorPicked.rgb.r
    }
  })
  rBox.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      const color = Colors.createRGB(rBox.value, gBox.value, bBox.value)
      if (color !== null && Colors.notEqual(color, colorPicked)) {
        localStorage.setItem('hex', color.formattedHex)
        toolPicked()
      } else {
        rBox.value = colorPicked.rgb.r
      }
    }
  })
  gBox.addEventListener('focusout', () => {
    const color = Colors.createRGB(rBox.value, gBox.value, bBox.value)
    if (color !== null && Colors.notEqual(color, colorPicked)) {
      localStorage.setItem('hex', color.formattedHex)
      toolPicked()
    } else {
      gBox.value = colorPicked.rgb.g
    }
  })
  gBox.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      const color = Colors.createRGB(rBox.value, gBox.value, bBox.value)
      if (color !== null && Colors.notEqual(color, colorPicked)) {
        localStorage.setItem('hex', color.formattedHex)
        toolPicked()
      } else {
        gBox.value = colorPicked.rgb.g
      }
    }
  })
  bBox.addEventListener('focusout', () => {
    const color = Colors.createRGB(rBox.value, gBox.value, bBox.value)
    if (color !== null && Colors.notEqual(color, colorPicked)) {
      localStorage.setItem('hex', color.formattedHex)
      toolPicked()
    } else {
      bBox.value = colorPicked.rgb.b
    }
  })
  bBox.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      const color = Colors.createRGB(rBox.value, gBox.value, bBox.value)
      if (color !== null && Colors.notEqual(color, colorPicked)) {
        localStorage.setItem('hex', color.formattedHex)
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
      localStorage.setItem('hex', color.formattedHex)
      toolPicked()
    } else {
      hBox.value = colorPicked.hsl.h
    }
  })
  hBox.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      const color = Colors.createHSL(hBox.value, sBox.value, lBox.value)
      if (color !== null && Colors.notEqual(color, colorPicked)) {
        localStorage.setItem('hex', color.formattedHex)
        toolPicked()
      } else {
        hBox.value = colorPicked.hsl.h
      }
    }
  })
  sBox.addEventListener('focusout', () => {
    const color = Colors.createHSL(hBox.value, sBox.value, lBox.value)
    if (color !== null && Colors.notEqual(color, colorPicked)) {
      localStorage.setItem('hex', color.formattedHex)
      toolPicked()
    } else {
      sBox.value = colorPicked.hsl.s
    }
  })
  sBox.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      const color = Colors.createHSL(hBox.value, sBox.value, lBox.value)
      if (color !== null && Colors.notEqual(color, colorPicked)) {
        localStorage.setItem('hex', color.formattedHex)
        toolPicked()
      } else {
        sBox.value = colorPicked.hsl.s
      }
    }
  })
  lBox.addEventListener('focusout', () => {
    const color = Colors.createHSL(hBox.value, sBox.value, lBox.value)
    if (color !== null && Colors.notEqual(color, colorPicked)) {
      localStorage.setItem('hex', color.formattedHex)
      toolPicked()
    } else {
      lBox.value = colorPicked.hsl.l
    }
  })
  lBox.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      const color = Colors.createHSL(hBox.value, sBox.value, lBox.value)
      if (color !== null && Colors.notEqual(color, colorPicked)) {
        localStorage.setItem('hex', color.formattedHex)
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

  const buttonRow = createDivInputRow()
  buttonRow.appendChild(themes.createButtonTheme())
  if (window.EyeDropper) {
    buttonRow.appendChild(createButtonEyedropper())
  }

  const boxColumn = createDivInputColumn()
  boxColumn.appendChild(hexBoxRow)
  boxColumn.appendChild(rgbBoxRow)
  boxColumn.appendChild(hslBoxRow)
  boxColumn.appendChild(buttonRow)

  return boxColumn
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

function buildHueRowSeparation(row, value) {
  hueSeparation = value
  buildColorRow(row, Colors.hues(colorPicked, hueDegrees, hueSeparation))
}

function buildHueRowDegree(row, value) {
  hueDegrees = value
  buildColorRow(row, Colors.hues(colorPicked, hueDegrees, hueSeparation))
}

function buildSaturationRow(row, value) {
  buildColorRow(row, Colors.saturations(colorPicked, value))
}

function buildLightnessRow(row, value) {
  buildColorRow(row, Colors.lightnesses(colorPicked, value))
}

function complementaryRow() {
  return buildColorRow(createDivColorRowSmall(), Colors.complementary(colorPicked))
}

function splitComplementaryRow() {
  return buildColorRow(createDivColorRowSmall(), Colors.splitComplementary(colorPicked))
}

function analogousRow() {
  return buildColorRow(createDivColorRowSmall(), Colors.analogous(colorPicked))
}

function triadicRow() {
  return buildColorRow(createDivColorRowSmall(), Colors.triadic(colorPicked))
}

function tetradicRow() {
  return buildColorRow(createDivColorRowSmall(), Colors.tetradic(colorPicked))
}

function squareRow() {
  return buildColorRow(createDivColorRowSmall(), Colors.square(colorPicked))
}

function paletteARow() {
  return buildColorRow(createDivColorRowSmall(), Colors.paletteA(colorPicked))
}

function historyRow() {
  let colors = []
  let index = 0
  while (localStorage.getItem(`historyHex${index}`) !== null) {
    colors.push(Colors.createHex(localStorage.getItem(`historyHex${index++}`)))
  }
  if (colors.length === 0 || Colors.notEqual(colors[colors.length - 1], colorPicked)) {
    colors.push(colorPicked)
  }
  if (colors.length > 12) {
    colors = colors.slice(colors.length - 12, colors.length)
  }
  for (let index = 0; index < colors.length; index++) {
    localStorage.setItem(`historyHex${index}`, colors[index].formattedHex)
  }

  return buildColorRow(createDivColorRow(), colors)
}

function buildColorRow(row, colors) {
  row.replaceChildren()
  colors.forEach(color => {
    row.appendChild(Colors.equal(color, colorPicked) ? createDivColorWithDivMarker(color) : createDivColor(color))
  })

  return row
}
