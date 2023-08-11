import { ColorPickerThemes } from './color-picker-themes.js'
import { Colors } from '../../colors.js'

let sValue = 0
let dValue = 360

const themes = new ColorPickerThemes()
themes.setTheme()

const row = document.getElementById('outer-column')

// Add sliders to create my own color picker.

const h = localStorage.getItem('h')
const s = localStorage.getItem('s')
const l = localStorage.getItem('l')
let color = null

if (h === null || s === null || l === null) {
  color = Colors.randomColor()
} else {
  color = Colors.buildColor(h, s, l)
}

const hsl = createDiv()
hsl.innerText = Colors.formatHSL(color)
hsl.style.padding = '0px 10px'

const rgb = createDiv()
rgb.innerText = Colors.formatRGB(color)
rgb.style.padding = '0px 10px'

const grayscale = createDiv()
grayscale.innerText = `Grayscale: ${color.grayscale}`
grayscale.style.padding = '0px 10px'

let textColor = Colors.formatHSL(Colors.white())
if (color.grayscale > 150) {
  textColor = Colors.formatHSL(Colors.black())
}
hsl.style.color = textColor
rgb.style.color = textColor
grayscale.style.color = textColor

const colorColumn = createColumn()
colorColumn.style.backgroundColor = Colors.formatHSL(color)
colorColumn.appendChild(hsl)
colorColumn.appendChild(rgb)
colorColumn.appendChild(grayscale)

const lightnessRow = createRow()
updateLightnessRow(lightnessRow, 8)
const lightnessSlider = createRangeSlider(1, 24, 1, 'Separation', 8, lightnessRow, updateLightnessRow)

const saturationRow = createRow()
updateSaturationRow(saturationRow, 8)
const saturationSlider = createRangeSlider(1, 24, 1, 'Separation', 8, saturationRow, updateSaturationRow)

const hueRow = createRow()
updateHueRow(hueRow, 24)
const hueSlider = createRangeSlider(1, 90, 1, 'Separation', 24, hueRow, updateHueRow)
const hueDegreeSlider = createRangeSlider(1, 360, 1, 'Degrees', 360, hueRow, updateHueDegreeRow)

const complementary = Colors.complementary(color)
const complementaryRow = createRow()
complementaryRow.appendChild(createItemWithMarker(complementary[0]))
complementaryRow.appendChild(createItem(complementary[1]))

const splitComplementary = Colors.splitComplementary(color)
const splitComplementaryRow = createRow()
splitComplementaryRow.appendChild(createItemWithMarker(splitComplementary[0]))
splitComplementaryRow.appendChild(createItem(splitComplementary[1]))
splitComplementaryRow.appendChild(createItem(splitComplementary[2]))

const analogous = Colors.analogous(color)
const analogousRow = createRow()
analogousRow.appendChild(createItemWithMarker(analogous[0]))
analogousRow.appendChild(createItem(analogous[1]))
analogousRow.appendChild(createItem(analogous[2]))

const triadic = Colors.triadic(color)
const triadicRow = createRow()
triadicRow.appendChild(createItemWithMarker(triadic[0]))
triadicRow.appendChild(createItem(triadic[1]))
triadicRow.appendChild(createItem(triadic[2]))

const tetradic = Colors.tetradic(color)
const tetradicRow = createRow()
tetradicRow.appendChild(createItem(tetradic[0]))
tetradicRow.appendChild(createItem(tetradic[1]))
tetradicRow.appendChild(createItem(tetradic[2]))
tetradicRow.appendChild(createItem(tetradic[3]))

const square = Colors.square(color)
const squareRow = createRow()
squareRow.appendChild(createItemWithMarker(square[0]))
squareRow.appendChild(createItem(square[1]))
squareRow.appendChild(createItem(square[2]))
squareRow.appendChild(createItem(square[3]))

const variationsColumn = createColumn()
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

const harmoniesColumn = createColumn()
harmoniesColumn.appendChild(createH2('Harmonies'))
harmoniesColumn.appendChild(createH3('Complementary'))
harmoniesColumn.appendChild(complementaryRow)
harmoniesColumn.appendChild(createH3('Split Complementary'))
harmoniesColumn.appendChild(splitComplementaryRow)
harmoniesColumn.appendChild(createH3('Analogous'))
harmoniesColumn.appendChild(analogousRow)
harmoniesColumn.appendChild(createH3('Triadic'))
harmoniesColumn.appendChild(triadicRow)
harmoniesColumn.appendChild(createH3('Tetradic'))
harmoniesColumn.appendChild(tetradicRow)
harmoniesColumn.appendChild(createH3('Square'))
harmoniesColumn.appendChild(squareRow)

row.appendChild(colorColumn)
row.appendChild(variationsColumn)
row.appendChild(harmoniesColumn)

function createColumn () {
  const column = document.createElement('div')
  column.className = 'inner-column'

  return column
}

function createRow () {
  const row = document.createElement('div')
  row.className = 'color-row'

  return row
}

function createItem (color) {
  const hsl = document.createElement('div')
  hsl.innerText = Colors.formatHSL(color)
  hsl.style.display = 'none'
  hsl.style.padding = '0px 10px'

  const rgb = document.createElement('div')
  rgb.innerText = Colors.formatRGB(color)
  rgb.style.display = 'none'
  rgb.style.padding = '0px 10px'

  const grayscale = document.createElement('div')
  grayscale.innerText = `Grayscale: ${color.grayscale}`
  grayscale.style.display = 'none'
  grayscale.style.padding = '0px 10px'

  const item = document.createElement('div')
  item.className = 'item'
  item.style.backgroundColor = Colors.formatHSL(color)
  item.style.color = color.grayscale > 150 ? Colors.formatHSL(Colors.black()) : Colors.formatHSL(Colors.white())
  item.appendChild(hsl)
  item.appendChild(rgb)
  item.appendChild(grayscale)
  item.addEventListener('mouseenter', event => {
    event.preventDefault()
    hsl.style.display = 'block'
    rgb.style.display = 'block'
    grayscale.style.display = 'block'
    item.style.boxShadow = `2px 2px ${item.style.color} inset, -2px -2px ${item.style.color} inset`
  })
  item.addEventListener('mouseleave', event => {
    event.preventDefault()
    hsl.style.display = 'none'
    rgb.style.display = 'none'
    grayscale.style.display = 'none'
    item.style.boxShadow = 'none'
  })
  item.addEventListener('dblclick', () => {
    localStorage.setItem('h', color.hsl.h)
    localStorage.setItem('s', color.hsl.s)
    localStorage.setItem('l', color.hsl.l)
    window.location.href = './index.html'
  })

  return item
}

function createItemWithMarker (color) {
  const marker = document.createElement('div')
  marker.className = 'marker'
  marker.style.backgroundColor = color.grayscale > 150 ? Colors.formatHSL(Colors.black()) : Colors.formatHSL(Colors.white())
  marker.style.display = 'block'

  const item = createItem(color)
  item.appendChild(marker)
  item.addEventListener('mouseenter', event => {
    event.preventDefault()
    marker.style.display = 'none'
  })
  item.addEventListener('mouseleave', event => {
    event.preventDefault()
    marker.style.display = 'block'
  })

  return item
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
  const lightnessItems = []
  let lightenedColor = Colors.copy(color)
  lightnessItems.push(createItemWithMarker(lightenedColor))

  while (lightenedColor.hsl.l < 100) {
    lightenedColor = Colors.lightenColor(lightenedColor, value)
    lightnessItems.push(createItem(lightenedColor))
  }
  lightnessItems.reverse()

  let darkenedColor = Colors.copy(color)
  while (darkenedColor.hsl.l > 0) {
    darkenedColor = Colors.darkenColor(darkenedColor, value)
    lightnessItems.push(createItem(darkenedColor))
  }

  lightnessRow.replaceChildren()
  lightnessItems.forEach(item => {
    lightnessRow.appendChild(item)
  })
}

function updateSaturationRow (saturationRow, value) {
  const saturationItems = []
  let saturatedColor = Colors.copy(color)
  saturationItems.push(createItemWithMarker(saturatedColor))

  while (saturatedColor.hsl.s < 100) {
    saturatedColor = Colors.saturateColor(saturatedColor, value)
    saturationItems.push(createItem(saturatedColor))
  }
  saturationItems.reverse()

  let desaturatedColor = Colors.copy(color)
  while (desaturatedColor.hsl.s > 0) {
    desaturatedColor = Colors.desaturateColor(desaturatedColor, value)
    saturationItems.push(createItem(desaturatedColor))
  }

  saturationRow.replaceChildren()
  saturationItems.forEach(item => {
    saturationRow.appendChild(item)
  })
}

function updateHueRow (hueRow, value) {
  sValue = value
  const hueItems = []
  let huedColor = Colors.copy(color)
  hueItems.push(createItemWithMarker(huedColor))

  const x = Math.max(Math.round(dValue / value) - 1, 0)
  let i = x
  while (i > x / 2) {
    huedColor = Colors.hueColor(huedColor, value)
    hueItems.push(createItem(huedColor))
    i--
  }
  hueItems.reverse()

  huedColor = Colors.copy(color)
  while (i > 0) {
    huedColor = Colors.hueColor(huedColor, -value)
    hueItems.push(createItem(huedColor))
    i--
  }

  hueRow.replaceChildren()
  hueItems.forEach(item => {
    hueRow.appendChild(item)
  })
}

function updateHueDegreeRow (hueRow, value) {
  dValue = value
  const hueItems = []
  let huedColor = Colors.copy(color)
  hueItems.push(createItemWithMarker(huedColor))

  const x = Math.max(Math.round(value / sValue) - 1, 0)
  let i = x
  while (i > x / 2) {
    huedColor = Colors.hueColor(huedColor, sValue)
    hueItems.push(createItem(huedColor))
    i--
  }
  hueItems.reverse()

  huedColor = Colors.copy(color)
  while (i > 0) {
    huedColor = Colors.hueColor(huedColor, -sValue)
    hueItems.push(createItem(huedColor))
    i--
  }

  hueRow.replaceChildren()
  hueItems.forEach(item => {
    hueRow.appendChild(item)
  })
}
