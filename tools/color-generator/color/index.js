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

  huedColor = Colors.copy(color)
  while (i > 0) {
    huedColor = Colors.hueColor(huedColor, -24)
    hueItems.push(createItem(huedColor))
    i--
  }

  hueItems.forEach(item => {
    hueRow.appendChild(item)
  })
  // --------------

  const lightnessH3 = createH3()
  lightnessH3.innerText = 'Lightness'

  const saturationH3 = createH3()
  saturationH3.innerText = 'Saturation'

  const hueH3 = createH3()
  hueH3.innerText = 'Hue'

  const variationsColumn = createColumn()
  variationsColumn.appendChild(lightnessH3)
  variationsColumn.appendChild(lightnessRow)
  variationsColumn.appendChild(saturationH3)
  variationsColumn.appendChild(saturationRow)
  variationsColumn.appendChild(hueH3)
  variationsColumn.appendChild(hueRow)

  row.appendChild(colorColumn)
  row.appendChild(variationsColumn)
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

function createH3 () {
  return document.createElement('h3')
}

// function createDiv () {
//   return document.createElement('div')
// }
