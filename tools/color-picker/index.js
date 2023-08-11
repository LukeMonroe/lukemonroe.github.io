import { ColorPickerThemes } from './color-picker-themes.js'
import { Colors } from '../../colors.js'

let sValue = 0
let dValue = 360

const themes = new ColorPickerThemes()
themes.setTheme()

const h = localStorage.getItem('h')
const s = localStorage.getItem('s')
const l = localStorage.getItem('l')
let color = null

if (h === null || s === null || l === null) {
  color = Colors.randomColor()
} else {
  color = Colors.buildColor(h, s, l)
}

const lightnessRow = createDivColorRow()
updateLightnessRow(lightnessRow, 8)
const lightnessSlider = createRangeSlider(1, 20, 1, 'Separation', 8, lightnessRow, updateLightnessRow)

const saturationRow = createDivColorRow()
updateSaturationRow(saturationRow, 8)
const saturationSlider = createRangeSlider(1, 20, 1, 'Separation', 8, saturationRow, updateSaturationRow)

const hueRow = createDivColorRow()
updateHueRow(hueRow, 24)
const hueSlider = createRangeSlider(1, 90, 1, 'Separation', 24, hueRow, updateHueRow)
const hueDegreeSlider = createRangeSlider(1, 360, 1, 'Degrees', 360, hueRow, updateHueDegreeRow)

const colorColumn = createDivInnerColumn()
colorColumn.appendChild(createMainDivColorWithDivMarker(color))

const variationsColumn = createDivInnerColumn()
variationsColumn.appendChild(createH2('Variations'))
variationsColumn.appendChild(createH3('Lightness'))
variationsColumn.appendChild(lightnessSlider)
variationsColumn.appendChild(lightnessRow)
variationsColumn.appendChild(createH3('Saturation'))
variationsColumn.appendChild(saturationSlider)
variationsColumn.appendChild(saturationRow)
variationsColumn.appendChild(createH3('Hue'))
variationsColumn.appendChild(hueSlider)
variationsColumn.appendChild(hueDegreeSlider)
variationsColumn.appendChild(hueRow)

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

const outerColumn = document.getElementById('outer-column')
outerColumn.appendChild(colorColumn)
outerColumn.appendChild(variationsColumn)
outerColumn.appendChild(harmoniesColumn)

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

function createMainDivColorWithDivMarker (color) {
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
  divMarker.style.backgroundColor = Colors.formatTextColor(color)
  divMarker.style.display = 'block'

  return divMarker
}

function createDivColorText (innerText) {
  const divColorText = createDiv()
  divColorText.className = 'color-text'
  divColorText.innerText = innerText
  divColorText.addEventListener('click', () => {
    navigator.clipboard.writeText(divColorText.innerText)
  })

  return divColorText
}

function createDivColor (color) {
  const hex = createDivColorText(color.hex)
  const rgb = createDivColorText(Colors.formatRGB(color))
  const hsl = createDivColorText(Colors.formatHSL(color))
  const grayscale = createDivColorText(`Grayscale: ${color.grayscale}`)

  const divColor = createDiv()
  divColor.className = 'color'
  divColor.style.backgroundColor = Colors.formatHSL(color)
  divColor.style.color = Colors.formatTextColor(color)
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

function createRangeSlider (min, max, step, text, value, row, updateFunction) {
  const sliderH4 = createH4()
  sliderH4.innerText = `${text}: ${value}`

  const sliderInput = document.createElement('input')
  sliderInput.className = 'slider'
  sliderInput.type = 'range'
  sliderInput.min = min
  sliderInput.max = max
  sliderInput.step = step
  sliderInput.value = value
  sliderInput.oninput = function () {
    sliderH4.innerText = `${text}: ${this.value}`
    updateFunction(row, this.value)
  }

  const sliderDiv = createDiv()
  sliderDiv.className = 'slider'
  sliderDiv.appendChild(sliderH4)
  sliderDiv.appendChild(sliderInput)

  return sliderDiv
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

function updateLightnessRow (lightnessRow, value) {
  const lightnessColors = []
  let lightenedColor = Colors.copy(color)
  lightnessColors.push(createDivColorWithDivMarker(lightenedColor))

  while (lightenedColor.hsl.l < 100) {
    lightenedColor = Colors.lightenColor(lightenedColor, value)
    lightnessColors.push(createDivColor(lightenedColor))
  }
  lightnessColors.reverse()

  let darkenedColor = Colors.copy(color)
  while (darkenedColor.hsl.l > 0) {
    darkenedColor = Colors.darkenColor(darkenedColor, value)
    lightnessColors.push(createDivColor(darkenedColor))
  }

  lightnessRow.replaceChildren()
  lightnessColors.forEach(item => {
    lightnessRow.appendChild(item)
  })
}

function updateSaturationRow (saturationRow, value) {
  const saturationColors = []
  let saturatedColor = Colors.copy(color)
  saturationColors.push(createDivColorWithDivMarker(saturatedColor))

  while (saturatedColor.hsl.s < 100) {
    saturatedColor = Colors.saturateColor(saturatedColor, value)
    saturationColors.push(createDivColor(saturatedColor))
  }
  saturationColors.reverse()

  let desaturatedColor = Colors.copy(color)
  while (desaturatedColor.hsl.s > 0) {
    desaturatedColor = Colors.desaturateColor(desaturatedColor, value)
    saturationColors.push(createDivColor(desaturatedColor))
  }

  saturationRow.replaceChildren()
  saturationColors.forEach(item => {
    saturationRow.appendChild(item)
  })
}

function updateHueRow (hueRow, value) {
  sValue = value
  const hueColors = []
  let huedColor = Colors.copy(color)
  hueColors.push(createDivColorWithDivMarker(huedColor))

  const x = Math.max(Math.round(dValue / value) - 1, 0)
  let i = x
  while (i > x / 2) {
    huedColor = Colors.hueColor(huedColor, value)
    hueColors.push(createDivColor(huedColor))
    i--
  }
  hueColors.reverse()

  huedColor = Colors.copy(color)
  while (i > 0) {
    huedColor = Colors.hueColor(huedColor, -value)
    hueColors.push(createDivColor(huedColor))
    i--
  }

  hueRow.replaceChildren()
  hueColors.forEach(item => {
    hueRow.appendChild(item)
  })
}

function updateHueDegreeRow (hueRow, value) {
  dValue = value
  const hueColors = []
  let huedColor = Colors.copy(color)
  hueColors.push(createDivColorWithDivMarker(huedColor))

  const x = Math.max(Math.round(value / sValue) - 1, 0)
  let i = x
  while (i > x / 2) {
    huedColor = Colors.hueColor(huedColor, sValue)
    hueColors.push(createDivColor(huedColor))
    i--
  }
  hueColors.reverse()

  huedColor = Colors.copy(color)
  while (i > 0) {
    huedColor = Colors.hueColor(huedColor, -sValue)
    hueColors.push(createDivColor(huedColor))
    i--
  }

  hueRow.replaceChildren()
  hueColors.forEach(item => {
    hueRow.appendChild(item)
  })
}

function complementaryRow () {
  const complementary = Colors.complementary(color)
  const row = createDivColorRow()
  row.appendChild(createDivColorWithDivMarker(complementary[0]))
  row.appendChild(createDivColor(complementary[1]))

  return row
}

function splitComplementaryRow () {
  const splitComplementary = Colors.splitComplementary(color)
  const row = createDivColorRow()
  row.appendChild(createDivColorWithDivMarker(splitComplementary[0]))
  row.appendChild(createDivColor(splitComplementary[1]))
  row.appendChild(createDivColor(splitComplementary[2]))

  return row
}

function analogousRow () {
  const analogous = Colors.analogous(color)
  const row = createDivColorRow()
  row.appendChild(createDivColorWithDivMarker(analogous[0]))
  row.appendChild(createDivColor(analogous[1]))
  row.appendChild(createDivColor(analogous[2]))

  return row
}

function triadicRow () {
  const triadic = Colors.triadic(color)
  const row = createDivColorRow()
  row.appendChild(createDivColorWithDivMarker(triadic[0]))
  row.appendChild(createDivColor(triadic[1]))
  row.appendChild(createDivColor(triadic[2]))

  return row
}

function tetradicRow () {
  const tetradic = Colors.tetradic(color)
  const row = createDivColorRow()
  row.appendChild(createDivColor(tetradic[0]))
  row.appendChild(createDivColor(tetradic[1]))
  row.appendChild(createDivColor(tetradic[2]))
  row.appendChild(createDivColor(tetradic[3]))

  return row
}

function squareRow () {
  const square = Colors.square(color)
  const row = createDivColorRow()
  row.appendChild(createDivColorWithDivMarker(square[0]))
  row.appendChild(createDivColor(square[1]))
  row.appendChild(createDivColor(square[2]))
  row.appendChild(createDivColor(square[3]))

  return row
}