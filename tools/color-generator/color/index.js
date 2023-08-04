import { ColorThemes } from './color-themes.js'
import { Colors } from '../../../colors.js'

const themes = new ColorThemes()
themes.setTheme()

const row = document.getElementById('row')
const colors = new Set()
const h = localStorage.getItem('h')
const s = localStorage.getItem('s')
const l = localStorage.getItem('l')
colors.add(Colors.buildColor(h, s, l))

// colors = Array.from(colors)
// colors.sort(function (color01, color02) { return color01.grayscale > color02.grayscale })

colors.forEach(color => {
  const hsl = document.createElement('div')
  hsl.innerText = Colors.formatHSL(color)

  const rgb = document.createElement('div')
  rgb.innerText = Colors.formatRGB(color)

  const grayscale = document.createElement('div')
  grayscale.innerText = `Grayscale: ${color.grayscale}`

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

  // ------------------
  const lightnessRow = createRow()
  const lightnessItems = []
  let lightenedColor = Colors.copy(color)
  lightnessItems.push(createItemWithMarker(lightenedColor))

  while (lightenedColor.hsl.l < 100) {
    lightenedColor = Colors.lightenColor(lightenedColor, 8)
    lightnessItems.push(createItem(lightenedColor))
  }
  lightnessItems.reverse()

  let darkenedColor = Colors.copy(color)
  while (darkenedColor.hsl.l > 0) {
    darkenedColor = Colors.darkenColor(darkenedColor, 8)
    lightnessItems.push(createItem(darkenedColor))
  }

  lightnessItems.forEach(item => {
    lightnessRow.appendChild(item)
  })
  // --------------

  // ------------------
  const saturationRow = createRow()
  const saturationItems = []
  let saturatedColor = Colors.copy(color)
  saturationItems.push(createItemWithMarker(saturatedColor))

  while (saturatedColor.hsl.s < 100) {
    saturatedColor = Colors.saturateColor(saturatedColor, 8)
    saturationItems.push(createItem(saturatedColor))
  }
  saturationItems.reverse()

  let desaturatedColor = Colors.copy(color)
  while (desaturatedColor.hsl.s > 0) {
    desaturatedColor = Colors.desaturateColor(desaturatedColor, 8)
    saturationItems.push(createItem(desaturatedColor))
  }

  saturationItems.forEach(item => {
    saturationRow.appendChild(item)
  })
  // --------------

  // ------------------
  const hueRow = createRow()
  const hueItems = []
  let huedColor = Colors.copy(color)
  hueItems.push(createItemWithMarker(huedColor))

  let i = 14
  while (i > 7) {
    huedColor = Colors.hueColor(huedColor, 24)
    hueItems.push(createItem(huedColor))
    i--
  }
  hueItems.reverse()

  const hueItems01 = []
  while (i > 0) {
    huedColor = Colors.hueColor(huedColor, 24)
    hueItems01.push(createItem(huedColor))
    i--
  }
  hueItems01.reverse()

  hueItems.forEach(item => {
    hueRow.appendChild(item)
  })
  hueItems01.forEach(item => {
    hueRow.appendChild(item)
  })
  // --------------

  // ------------------
  const complementaryRow = createRow()
  const complementaryItems = []
  complementaryItems.push(createItemWithMarker(Colors.copy(color)))
  complementaryItems.push(createItem(Colors.hueColor(color, 180)))
  complementaryItems.forEach(item => {
    complementaryRow.appendChild(item)
  })
  // --------------

  // ------------------
  const splitComplementaryRow = createRow()
  const splitComplementaryItems = []
  splitComplementaryItems.push(createItemWithMarker(Colors.copy(color)))
  const splitComplementaryColor = Colors.hueColor(color, 180)
  splitComplementaryItems.push(createItem(Colors.hueColor(splitComplementaryColor, -30)))
  splitComplementaryItems.push(createItem(Colors.hueColor(splitComplementaryColor, 30)))
  splitComplementaryItems.forEach(item => {
    splitComplementaryRow.appendChild(item)
  })
  // --------------

  // ------------------
  const analogousRow = createRow()
  const analogousItems = []
  analogousItems.push(createItem(Colors.hueColor(color, -30)))
  analogousItems.push(createItemWithMarker(Colors.copy(color)))
  analogousItems.push(createItem(Colors.hueColor(color, 30)))
  analogousItems.forEach(item => {
    analogousRow.appendChild(item)
  })
  // --------------

  // ------------------
  const triadicRow = createRow()
  const triadicItems = []
  triadicItems.push(createItem(Colors.hueColor(color, -120)))
  triadicItems.push(createItemWithMarker(Colors.copy(color)))
  triadicItems.push(createItem(Colors.hueColor(color, 120)))
  triadicItems.forEach(item => {
    triadicRow.appendChild(item)
  })
  // --------------

  // ------------------
  const tetradicRow = createRow()
  const tetradicItems = []
  tetradicItems.push(createItem(Colors.hueColor(color, -30)))
  tetradicItems.push(createItem(Colors.hueColor(color, 30)))
  tetradicItems.push(createItem(Colors.hueColor(color, -150)))
  tetradicItems.push(createItem(Colors.hueColor(color, 150)))
  tetradicItems.forEach(item => {
    tetradicRow.appendChild(item)
  })
  // --------------

  // ------------------
  const squareRow = createRow()
  const squareItems = []
  squareItems.push(createItemWithMarker(Colors.copy(color)))
  squareItems.push(createItem(Colors.hueColor(color, 90)))
  squareItems.push(createItem(Colors.hueColor(color, 180)))
  squareItems.push(createItem(Colors.hueColor(color, 270)))
  squareItems.forEach(item => {
    squareRow.appendChild(item)
  })
  // --------------

  const variationsH2 = createH2()
  variationsH2.innerText = 'Variations'

  const lightnessH3 = createH3()
  lightnessH3.innerText = 'Lightness'

  const saturationH3 = createH3()
  saturationH3.innerText = 'Saturation'

  const hueH3 = createH3()
  hueH3.innerText = 'Hue'

  const harmoniesH2 = createH2()
  harmoniesH2.innerText = 'Harmonies'

  const complementaryH3 = createH3()
  complementaryH3.innerText = 'Complementary'

  const splitComplementaryH3 = createH3()
  splitComplementaryH3.innerText = 'Split Complementary'

  const analogousH3 = createH3()
  analogousH3.innerText = 'Analogous'

  const triadicH3 = createH3()
  triadicH3.innerText = 'Triadic'

  const tetradicH3 = createH3()
  tetradicH3.innerText = 'Tetradic'

  const squareH3 = createH3()
  squareH3.innerText = 'Square'

  const variationsColumn = createColumn()
  variationsColumn.appendChild(variationsH2)
  variationsColumn.appendChild(lightnessH3)
  variationsColumn.appendChild(lightnessRow)
  variationsColumn.appendChild(saturationH3)
  variationsColumn.appendChild(saturationRow)
  variationsColumn.appendChild(hueH3)
  variationsColumn.appendChild(hueRow)

  const harmoniesColumn = createColumn()
  harmoniesColumn.appendChild(harmoniesH2)
  harmoniesColumn.appendChild(complementaryH3)
  harmoniesColumn.appendChild(complementaryRow)
  harmoniesColumn.appendChild(splitComplementaryH3)
  harmoniesColumn.appendChild(splitComplementaryRow)
  harmoniesColumn.appendChild(analogousH3)
  harmoniesColumn.appendChild(analogousRow)
  harmoniesColumn.appendChild(triadicH3)
  harmoniesColumn.appendChild(triadicRow)
  harmoniesColumn.appendChild(tetradicH3)
  harmoniesColumn.appendChild(tetradicRow)
  harmoniesColumn.appendChild(squareH3)
  harmoniesColumn.appendChild(squareRow)

  row.appendChild(colorColumn)
  row.appendChild(variationsColumn)
  row.appendChild(harmoniesColumn)
})

function createColumn () {
  const column = document.createElement('div')
  column.className = 'column'

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

  const rgb = document.createElement('div')
  rgb.innerText = Colors.formatRGB(color)
  rgb.style.display = 'none'

  const grayscale = document.createElement('div')
  grayscale.innerText = `Grayscale: ${color.grayscale}`
  grayscale.style.display = 'none'

  const item = document.createElement('div')
  item.className = 'item'
  item.style.backgroundColor = Colors.formatHSL(color)
  item.style.color = color.grayscale > 150 ? Colors.formatHSL(Colors.black()) : Colors.formatHSL(Colors.white())
  item.appendChild(hsl)
  item.appendChild(rgb)
  item.appendChild(grayscale)
  item.addEventListener('mouseenter', () => {
    hsl.style.display = 'block'
    rgb.style.display = 'block'
    grayscale.style.display = 'block'
    item.style.boxShadow = `2px 2px ${item.style.color} inset, -2px -2px ${item.style.color} inset`
  })
  item.addEventListener('mouseleave', () => {
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
  item.addEventListener('mouseenter', () => {
    marker.style.display = 'none'
  })
  item.addEventListener('mouseleave', () => {
    marker.style.display = 'block'
  })

  return item
}

function createH2 () {
  return document.createElement('h2')
}

function createH3 () {
  return document.createElement('h3')
}

// function createDiv () {
//   return document.createElement('div')
// }
