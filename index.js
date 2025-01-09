import { ColorPickerThemes } from './color-picker-themes.js'
import { Colors } from './colors.js'

document.addEventListener('dblclick', event => { event.preventDefault() })

const themes = new ColorPickerThemes()
themes.setTheme()

const themeColumn = createDivInnerColumn()
themeColumn.appendChild(createH2('Theme'))
themeColumn.appendChild(themes.createButtonTheme())

let hueSeparation = 24
let hueDegrees = 360

const hex = localStorage.getItem('hex')
let colorPicked = null
if (hex !== null) {
  colorPicked = Colors.createHex(hex)
} else {
  colorPicked = Colors.random()
  localStorage.setItem('hex', colorPicked.formattedHex)
}

document.documentElement.style.setProperty('--thumb-color', colorPicked.formattedHSL)

const hueRow = createDivColorRow()
const hueSliderSeparation = createInputRangeSlider(1, 90, 1, 'Separation', 24, hueRow, buildHueRowSeparation)
const hueSliderDegree = createInputRangeSlider(1, 360, 1, 'Degrees', 360, hueRow, buildHueRowDegree)

const saturationRow = createDivColorRow()
const saturationSlider = createInputRangeSlider(1, 20, 1, 'Separation', 8, saturationRow, buildSaturationRow)

const lightnessRow = createDivColorRow()
const lightnessSlider = createInputRangeSlider(1, 20, 1, 'Separation', 8, lightnessRow, buildLightnessRow)

// ------
const hexBoxRow = createDivInputRow()
const hexBox = createInputTextBox()
hexBox.maxLength = '7'
hexBox.style.width = '107px'
hexBox.value = colorPicked.formattedHex
hexBox.addEventListener('focusout', () => {
  const color = Colors.createHex(hexBox.value)
  if (color !== null && Colors.notEqual(color, colorPicked)) {
    localStorage.setItem('hex', color.formattedHex)
    window.location.href = './index.html'
  } else {
    hexBox.value = colorPicked.formattedHex
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
    window.location.href = './index.html'
  } else {
    rBox.value = colorPicked.rgb.r
  }
})
gBox.addEventListener('focusout', () => {
  const color = Colors.createRGB(rBox.value, gBox.value, bBox.value)
  if (color !== null && Colors.notEqual(color, colorPicked)) {
    localStorage.setItem('hex', color.formattedHex)
    window.location.href = './index.html'
  } else {
    gBox.value = colorPicked.rgb.g
  }
})
bBox.addEventListener('focusout', () => {
  const color = Colors.createRGB(rBox.value, gBox.value, bBox.value)
  if (color !== null && Colors.notEqual(color, colorPicked)) {
    localStorage.setItem('hex', color.formattedHex)
    window.location.href = './index.html'
  } else {
    bBox.value = colorPicked.rgb.b
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
    window.location.href = './index.html'
  } else {
    hBox.value = colorPicked.hsl.h
  }
})
sBox.addEventListener('focusout', () => {
  const color = Colors.createHSL(hBox.value, sBox.value, lBox.value)
  if (color !== null && Colors.notEqual(color, colorPicked)) {
    localStorage.setItem('hex', color.formattedHex)
    window.location.href = './index.html'
  } else {
    sBox.value = colorPicked.hsl.s
  }
})
lBox.addEventListener('focusout', () => {
  const color = Colors.createHSL(hBox.value, sBox.value, lBox.value)
  if (color !== null && Colors.notEqual(color, colorPicked)) {
    localStorage.setItem('hex', color.formattedHex)
    window.location.href = './index.html'
  } else {
    lBox.value = colorPicked.hsl.l
  }
})

hslBoxRow.appendChild(createH4('hsl:'))
hslBoxRow.appendChild(hBox)
hslBoxRow.appendChild(sBox)
hslBoxRow.appendChild(lBox)

const boxRow = createDivInputRow()
boxRow.appendChild(hexBoxRow)
boxRow.appendChild(rgbBoxRow)
boxRow.appendChild(hslBoxRow)

const boxColumn = createDivInputColumn()
boxColumn.appendChild(hexBoxRow)
boxColumn.appendChild(rgbBoxRow)
boxColumn.appendChild(hslBoxRow)
// ------

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

const historyColumn = createDivInnerColumn()
historyColumn.appendChild(createH2('History'))
historyColumn.appendChild(createH3('Colors'))
historyColumn.appendChild(historyRow())

const divCopied = createDivCopied()

const outerColumn = document.getElementById('outer-column')
outerColumn.appendChild(colorRow)
outerColumn.appendChild(variationsColumn)
outerColumn.appendChild(harmoniesColumn)
outerColumn.appendChild(historyColumn)
outerColumn.appendChild(divCopied)
outerColumn.appendChild(themeColumn)

function createDivInnerColumn () {
  const column = createDiv()
  column.className = 'inner-column'

  return column
}

function createDivInnerRow () {
  const row = createDiv()
  row.className = 'inner-row'

  return row
}

function createDivColorRow () {
  const row = createDiv()
  row.className = 'color-row'

  return row
}

function createDivColorPicked (color) {
  const divColor = createDivColorWithDivMarker(color)
  divColor.style.height = '250px'
  divColor.style.maxWidth = '50%'

  return divColor
}

function createDivColorWithDivMarker (color) {
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

function createDivMarker (color) {
  const divMarker = createDiv()
  divMarker.className = 'marker'
  divMarker.style.backgroundColor = color.formattedText
  divMarker.style.display = 'block'

  return divMarker
}

function createDivCopied () {
  const divCopied = createDiv()
  divCopied.className = 'copied'
  divCopied.appendChild(createH4('Color copied to clipboard'))

  return divCopied
}

function createDivColorText (innerText) {
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

function createDivColor (color) {
  const hex = createDivColorText(color.formattedHex)
  const rgb = createDivColorText(color.formattedRGB)
  const hsl = createDivColorText(color.formattedHSL)
  const grayscale = createDivColorText(`Grayscale: ${color.grayscale}`)

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
  divColor.addEventListener('dblclick', () => {
    localStorage.setItem('hex', color.formattedHex)
    window.location.href = './index.html'
  })

  return divColor
}

function createDivInputColumn () {
  const divBoxColumn = createDiv()
  divBoxColumn.className = 'input-column'

  return divBoxColumn
}

function createDivInputRow () {
  const divBoxRow = createDiv()
  divBoxRow.className = 'input-row'

  return divBoxRow
}

function createInputTextBox () {
  const inputTextBox = document.createElement('input')
  inputTextBox.className = 'box'
  inputTextBox.type = 'text'

  return inputTextBox
}

function createInputRangeSlider (min, max, step, text, value, row, updateFunction) {
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

function createH2 (innerText) {
  const h2 = document.createElement('h2')
  h2.innerText = innerText

  return h2
}

function createH3 (innerText) {
  const h3 = document.createElement('h3')
  h3.innerText = innerText

  return h3
}

function createH4 (innerText) {
  const h4 = document.createElement('h4')
  h4.innerText = innerText

  return h4
}

function createDiv () {
  return document.createElement('div')
}

function buildHueRowSeparation (row, value) {
  hueSeparation = value
  buildColorRow(row, Colors.hues(colorPicked, hueDegrees, hueSeparation))
}

function buildHueRowDegree (row, value) {
  hueDegrees = value
  buildColorRow(row, Colors.hues(colorPicked, hueDegrees, hueSeparation))
}

function buildSaturationRow (row, value) {
  buildColorRow(row, Colors.saturations(colorPicked, value))
}

function buildLightnessRow (row, value) {
  buildColorRow(row, Colors.lightnesses(colorPicked, value))
}

function complementaryRow () {
  return buildColorRow(createDivColorRow(), Colors.complementary(colorPicked))
}

function splitComplementaryRow () {
  return buildColorRow(createDivColorRow(), Colors.splitComplementary(colorPicked))
}

function analogousRow () {
  return buildColorRow(createDivColorRow(), Colors.analogous(colorPicked))
}

function triadicRow () {
  return buildColorRow(createDivColorRow(), Colors.triadic(colorPicked))
}

function tetradicRow () {
  return buildColorRow(createDivColorRow(), Colors.tetradic(colorPicked))
}

function squareRow () {
  return buildColorRow(createDivColorRow(), Colors.square(colorPicked))
}

function historyRow () {
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

function buildColorRow (row, colors) {
  row.replaceChildren()
  colors.forEach(color => {
    row.appendChild(Colors.equal(color, colorPicked) ? createDivColorWithDivMarker(color) : createDivColor(color))
  })

  return row
}
