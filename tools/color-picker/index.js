import { ColorPickerThemes } from './color-picker-themes.js'
import { Colors } from '../../colors.js'

let hueSeparation = 24
let hueDegrees = 360

const themes = new ColorPickerThemes()
themes.setTheme()

const h = localStorage.getItem('h')
const s = localStorage.getItem('s')
const l = localStorage.getItem('l')
let colorPicked = null

if (h === null || s === null || l === null) {
  colorPicked = Colors.random()
} else {
  colorPicked = Colors.build(h, s, l)
}

document.documentElement.style.setProperty('--thumb', colorPicked.formattedHSL)

const hueRow = createDivColorRow()
const hueSliderSeparation = createInputRangeSlider(1, 90, 1, 'Separation', 24, hueRow, buildHueRowSeparation)
const hueSliderDegree = createInputRangeSlider(1, 360, 1, 'Degrees', 360, hueRow, buildHueRowDegree)

const saturationRow = createDivColorRow()
const saturationSlider = createInputRangeSlider(1, 20, 1, 'Separation', 8, saturationRow, buildSaturationRow)

const lightnessRow = createDivColorRow()
const lightnessSlider = createInputRangeSlider(1, 20, 1, 'Separation', 8, lightnessRow, buildLightnessRow)

const colorColumn = createDivInnerColumn()
colorColumn.appendChild(createDivColorPicked(colorPicked))

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

const divCopied = createDivCopied()

const outerColumn = document.getElementById('outer-column')
outerColumn.appendChild(colorColumn)
outerColumn.appendChild(variationsColumn)
outerColumn.appendChild(harmoniesColumn)
outerColumn.appendChild(divCopied)

function createDivInnerColumn () {
  const column = createDiv()
  column.className = 'inner-column'

  return column
}

function createDivColorRow () {
  const row = createDiv()
  row.className = 'color-row'

  return row
}

function createDivColorPicked (color) {
  const divColor = createDivColorWithDivMarker(color)
  divColor.style.flex = 'none'
  divColor.style.height = '200px'
  divColor.style.width = '50%'
  divColor.style.minWidth = '300px'

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
    localStorage.setItem('h', color.hsl.h)
    localStorage.setItem('s', color.hsl.s)
    localStorage.setItem('l', color.hsl.l)
    window.location.href = './index.html'
  })

  return divColor
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

function buildColorRow (row, colors) {
  row.replaceChildren()
  colors.forEach(color => {
    row.appendChild(Colors.equal(color, colorPicked) ? createDivColorWithDivMarker(color) : createDivColor(color))
  })
}

function complementaryRow () {
  const complementary = Colors.complementary(colorPicked)
  const row = createDivColorRow()
  row.appendChild(createDivColorWithDivMarker(complementary[0]))
  row.appendChild(createDivColor(complementary[1]))

  return row
}

function splitComplementaryRow () {
  const splitComplementary = Colors.splitComplementary(colorPicked)
  const row = createDivColorRow()
  row.appendChild(createDivColorWithDivMarker(splitComplementary[0]))
  row.appendChild(createDivColor(splitComplementary[1]))
  row.appendChild(createDivColor(splitComplementary[2]))

  return row
}

function analogousRow () {
  const analogous = Colors.analogous(colorPicked)
  const row = createDivColorRow()
  row.appendChild(createDivColorWithDivMarker(analogous[0]))
  row.appendChild(createDivColor(analogous[1]))
  row.appendChild(createDivColor(analogous[2]))

  return row
}

function triadicRow () {
  const triadic = Colors.triadic(colorPicked)
  const row = createDivColorRow()
  row.appendChild(createDivColorWithDivMarker(triadic[0]))
  row.appendChild(createDivColor(triadic[1]))
  row.appendChild(createDivColor(triadic[2]))

  return row
}

function tetradicRow () {
  const tetradic = Colors.tetradic(colorPicked)
  const row = createDivColorRow()
  row.appendChild(createDivColor(tetradic[0]))
  row.appendChild(createDivColor(tetradic[1]))
  row.appendChild(createDivColor(tetradic[2]))
  row.appendChild(createDivColor(tetradic[3]))

  return row
}

function squareRow () {
  const square = Colors.square(colorPicked)
  const row = createDivColorRow()
  row.appendChild(createDivColorWithDivMarker(square[0]))
  row.appendChild(createDivColor(square[1]))
  row.appendChild(createDivColor(square[2]))
  row.appendChild(createDivColor(square[3]))

  return row
}
