import { ColorPickerThemes } from './color-picker-themes.js'
import { Colors } from './colors.js'

const themes = new ColorPickerThemes()
themes.setTheme()

const sideNavigation = createSideNavigation()

document.addEventListener('dblclick', event => { event.preventDefault() })
document.addEventListener('click', event => {
  if (sideNavigation.style.width === '300px') {
    if (!sideNavigation.contains(event.target)) {
      sideNavigation.style.width = '0px'
    }
  }
})
document.body.appendChild(sideNavigation)

let tool = localStorage.getItem('tool')
let toolPicked = tool === null ? createColorPicker : tool === 'colorPicker' ? createColorPicker : tool === 'gradientPicker' ? createGradientPicker : tool === 'likedColors' ? createLikedColors : createContrastPicker
toolPicked()

function createSideNavigation() {
  const sideNavigation = createDiv()
  sideNavigation.className = 'side-navigation'
  const aColors = createA('javascript:void(0);', 'Color Picker')
  aColors.addEventListener('click', () => {
    sideNavigation.style.width = '0px'
    createColorPicker()
  })
  const aGradients = createA('javascript:void(0);', 'Gradient Picker')
  aGradients.addEventListener('click', () => {
    sideNavigation.style.width = '0px'
    createGradientPicker()
  })
  const aContrastPicker = createA('javascript:void(0);', 'Contrast Picker')
  aContrastPicker.addEventListener('click', () => {
    sideNavigation.style.width = '0px'
    createContrastPicker()
  })
  const aLikedColors = createA('javascript:void(0);', 'Favorites')
  aLikedColors.addEventListener('click', () => {
    sideNavigation.style.width = '0px'
    createLikedColors()
  })
  sideNavigation.appendChild(aColors)
  sideNavigation.appendChild(aGradients)
  sideNavigation.appendChild(aContrastPicker)
  sideNavigation.appendChild(aLikedColors)
  sideNavigation.appendChild(createButtonTheme())

  return sideNavigation
}

function createButtonNavigation(sideNavigation) {
  const navigationButton = document.createElement('button')
  navigationButton.className = 'theme'
  navigationButton.innerText = '\u2630'
  navigationButton.style.fontSize = '24px'
  navigationButton.addEventListener('click', event => {
    event.stopPropagation()
    sideNavigation.style.width = '300px'
  })

  return navigationButton
}

function createButtonTheme() {
  const buttonTheme = themes.createButtonTheme(true)
  buttonTheme.style.position = 'absolute'
  buttonTheme.style.bottom = '20px'
  buttonTheme.style.left = '20px'

  return buttonTheme
}

function createColorPicker() {
  localStorage.setItem('tool', 'colorPicker')
  tool = localStorage.getItem('tool')
  toolPicked = createColorPicker

  const colors = getHistoryColors()
  if (colors.length === 0) {
    colors.push(Colors.randomGrayscaleRange(55, 200))
    setHistoryColors(colors)
  }
  const color = colors[colors.length - 1]
  document.documentElement.style.setProperty('--thumb-color', color.formattedHSL)

  const hueRow = createDivColorRow()
  const hueSliders = createDoubleInputRangeSliders(1, 90, 1, 'Separation', 12, 1, 360, 1, 'Degrees', 180, hueRow, buildHueRow, color)

  const saturationRow = createDivColorRow()
  const saturationSlider = createInputRangeSlider(1, 20, 1, 'Separation', 8, saturationRow, buildSaturationRow, color)

  const lightnessRow = createDivColorRow()
  const lightnessSlider = createInputRangeSlider(1, 20, 1, 'Separation', 8, lightnessRow, buildLightnessRow, color)

  const divColorPicked = createDivColor(color, color)
  divColorPicked.style.height = '300px'
  divColorPicked.style.maxWidth = '600px'

  const colorRow = createDivInnerRow()
  colorRow.appendChild(divColorPicked)
  colorRow.appendChild(createBoxColumn(color, null, null))

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
  harmoniesColumn.appendChild(complementaryRow(color))
  harmoniesColumn.appendChild(createH3('Split Complementary'))
  harmoniesColumn.appendChild(splitComplementaryRow(color))
  harmoniesColumn.appendChild(createH3('Analogous'))
  harmoniesColumn.appendChild(analogousRow(color))
  harmoniesColumn.appendChild(createH3('Triadic'))
  harmoniesColumn.appendChild(triadicRow(color))
  harmoniesColumn.appendChild(createH3('Tetradic'))
  harmoniesColumn.appendChild(tetradicRow(color))
  harmoniesColumn.appendChild(createH3('Square'))
  harmoniesColumn.appendChild(squareRow(color))

  const palettesColumn = createDivInnerColumn()
  palettesColumn.appendChild(createH2('Palettes'))
  palettesColumn.appendChild(paletteARow(color))

  const historyColumn = createDivInnerColumn()
  historyColumn.appendChild(createH2('History'))
  historyColumn.appendChild(buildColorRow(createDivColorRowSmall(), getHistoryColors(), color))

  const header = document.getElementById('header')
  header.replaceChildren()
  header.appendChild(createButtonNavigation(sideNavigation))
  header.appendChild(createH1('Color Picker'))

  const outerColumn = document.getElementById('outer-column')
  outerColumn.replaceChildren()
  outerColumn.appendChild(colorRow)
  outerColumn.appendChild(variationsColumn)
  outerColumn.appendChild(harmoniesColumn)
  outerColumn.appendChild(palettesColumn)
  outerColumn.appendChild(historyColumn)

  setTimeout(function () {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, 10)
}

function createGradientPicker() {
  localStorage.setItem('tool', 'gradientPicker')
  tool = localStorage.getItem('tool')
  toolPicked = createGradientPicker

  const gradients = getHistoryGradients()
  if (gradients.length === 0) {
    gradients.push([Colors.randomGrayscaleRange(55, 200), Colors.randomGrayscaleRange(55, 200)])
    setHistorGradients(gradients)
  }
  const gradient = gradients[gradients.length - 1]
  document.documentElement.style.setProperty('--thumb-color', gradient[0].formattedHSL)

  const colorRow = createDivInnerRow()
  const gradientSliders = createDoubleInputRangeSlidersGradient(0, 360, 1, 'Degrees', 0, 0, 100, 1, 'Percent', 0, colorRow, createGradientRowPicked, gradient[0], gradient[1], '300px')

  const boxRow = createDivInnerRow()
  boxRow.appendChild(createBoxColumn(gradient[0], gradient[1], 'left'))
  boxRow.appendChild(createBoxColumn(gradient[0], gradient[1], 'right'))

  const slidersColumn = createDivInnerColumn()
  gradientSliders.forEach(gradientSlider => {
    slidersColumn.appendChild(gradientSlider)
  })
  slidersColumn.appendChild(createButtonSwitchColors(gradient))

  const historyColumn = createDivInnerColumn()
  historyColumn.appendChild(createH2('History'))
  for (let index = 0; index < gradients.length; index++) {
    historyColumn.appendChild(gradientRow(gradients[index][0], gradients[index][1], gradient[0], gradient[1], 'linear', '0deg', '0%'))
  }

  const examplesColumn = createDivInnerColumn()
  examplesColumn.appendChild(createH2('Examples'))
  for (let index = 0; index < 10; index++) {
    examplesColumn.appendChild(gradientRow(Colors.random(), Colors.random(), gradient[0], gradient[1], 'linear', '0deg', '0%'))
  }

  const header = document.getElementById('header')
  header.replaceChildren()
  header.appendChild(createButtonNavigation(sideNavigation))
  header.appendChild(createH1('Gradient Picker'))

  const outerColumn = document.getElementById('outer-column')
  outerColumn.replaceChildren()
  outerColumn.appendChild(colorRow)
  outerColumn.appendChild(slidersColumn)
  outerColumn.appendChild(boxRow)
  outerColumn.appendChild(historyColumn)
  outerColumn.appendChild(examplesColumn)

  let timeout = false
  window.addEventListener('scroll', () => {
    if (tool === 'gradientPicker' && examplesColumn.children.length <= 991 && ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100)) {
      timeout = true
      setTimeout(function () {
        if (timeout === true) {
          for (let index = 0; index < 10; index++) {
            examplesColumn.appendChild(gradientRow(Colors.random(), Colors.random(), gradient[0], gradient[1], 'linear', '0deg', '0%'))
          }
          timeout = false
        }
      }, 1000)
    }
  })
  setTimeout(function () {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, 10)
}

function createContrastPicker() {
  localStorage.setItem('tool', 'contrastPicker')
  tool = localStorage.getItem('tool')
  toolPicked = createContrastPicker

  const colors = getHistoryContrastColors()
  if (colors.length === 0) {
    colors.push(Colors.randomGrayscaleRange(55, 200))
    setHistoryContrastColors(colors)
  }
  const color = colors[colors.length - 1]
  document.documentElement.style.setProperty('--thumb-color', color.formattedHSL)

  const textColors = getHistoryContrastTextColors()
  if (textColors.length === 0) {
    let randomColor = Colors.random()
    while (Math.abs(color.grayscale - randomColor.grayscale) < 64) {
      randomColor = Colors.random()
    }
    textColors.push(randomColor)
    setHistoryContrastTextColors(textColors)
  }
  const textColor = textColors[textColors.length - 1]

  const divColorPicked = createDivColor(color, color)
  divColorPicked.style.height = '300px'
  divColorPicked.style.maxWidth = '600px'
  divColorPicked.style.color = textColor.formattedHex

  const colorRow = createDivInnerRow()
  colorRow.appendChild(divColorPicked)

  const boxRow = createDivInnerRow()
  boxRow.appendChild(createBoxColumn(color, null, 'left'))
  boxRow.appendChild(createBoxColumn(null, textColor, 'right'))

  const historyColumn = createDivInnerColumn()
  historyColumn.appendChild(createH2('History'))
  historyColumn.appendChild(createH3('Colors'))
  historyColumn.appendChild(buildColorRow1(createDivColorRowSmall(), getHistoryContrastColors(), color, 'left'))
  historyColumn.appendChild(createH3('Text Colors'))
  historyColumn.appendChild(buildColorRow1(createDivColorRowSmall(), getHistoryContrastTextColors(), textColor, 'right'))

  const header = document.getElementById('header')
  header.replaceChildren()
  header.appendChild(createButtonNavigation(sideNavigation))
  header.appendChild(createH1('Contrast Picker'))

  const grayscaleDelta = Math.abs(color.grayscale - textColor.grayscale)
  let rating = 1
  let textRating = 'disgusting'
  if (grayscaleDelta < 16) {
    rating = 1
    textRating = 'disgusting'
  } else if (grayscaleDelta < 32) {
    rating = 2
    textRating = 'awful'
  } else if (grayscaleDelta < 48) {
    rating = 3
    textRating = 'bad'
  } else if (grayscaleDelta < 64) {
    rating = 4
    textRating = 'okay'
  } else if (grayscaleDelta < 80) {
    rating = 5
    textRating = 'alright'
  } else if (grayscaleDelta < 96) {
    rating = 6
    textRating = 'better'
  } else if (grayscaleDelta < 112) {
    rating = 7
    textRating = 'good'
  } else if (grayscaleDelta < 128) {
    rating = 8
    textRating = 'great'
  } else if (grayscaleDelta < 128) {
    rating = 9
    textRating = 'best'
  } else {
    rating = 10
    textRating = 'perfect'
  }

  const outerColumn = document.getElementById('outer-column')
  outerColumn.replaceChildren()
  outerColumn.appendChild(colorRow)
  outerColumn.appendChild(createH3(`Contrast Rating: ${textRating} (${rating}/10)`))
  outerColumn.appendChild(boxRow)
  outerColumn.appendChild(historyColumn)

  setTimeout(function () {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, 10)
}

function createLikedColors() {
  localStorage.setItem('tool', 'likedColors')
  tool = localStorage.getItem('tool')
  toolPicked = createLikedColors

  const likedColorsColumn = createDivInnerColumn()
  likedColorsColumn.appendChild(createH2('Colors'))
  likedColorsColumn.appendChild(createDivColorGrid())

  const likedGradientsColumn = createDivInnerColumn()
  likedGradientsColumn.appendChild(createH2('Gradients'))
  likedGradientsColumn.appendChild(createDivGradientGrid())

  const header = document.getElementById('header')
  header.replaceChildren()
  header.appendChild(createButtonNavigation(sideNavigation))
  header.appendChild(createH1('Favorites'))

  const outerColumn = document.getElementById('outer-column')
  outerColumn.replaceChildren()
  outerColumn.appendChild(likedColorsColumn)
  outerColumn.appendChild(likedGradientsColumn)

  setTimeout(function () {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, 10)
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

function createGradientRowPicked(color01, color02, colorPicked01, colorPicked02, type, value, position, height = null) {
  const colorRow = gradientRow(color01, color02, colorPicked01, colorPicked02, type, value, position, height)
  colorRow.style.maxWidth = '600px'

  return colorRow
}

function createDivMarker(color) {
  const divMarker = createDiv()
  divMarker.className = 'marker'
  divMarker.style.backgroundColor = color.formattedText
  divMarker.style.display = 'block'

  return divMarker
}

function createDivColorGrid() {
  const divColorGrid = createDiv()
  divColorGrid.className = 'color-grid'

  const colors = getLikedColors()
  for (let index = 0; index < colors.length; index++) {
    const divColor = createDivColor(colors[index], colors[index])
    divColor.style.flex = 'none'
    divColor.style.width = '300px'
    divColorGrid.appendChild(divColor)
  }
  if (colors.length === 0) {
    divColorGrid.appendChild(createH3('No favorites yet :('))
  }

  return divColorGrid
}

function createDivGradientGrid() {
  const divColorGrid = createDiv()
  divColorGrid.className = 'color-grid'

  const gradients = getLikedGradients()
  for (let index = 0; index < gradients.length; index++) {
    const divGradient = gradientRow(gradients[index][0], gradients[index][1], gradients[index][0], gradients[index][1], 'linear', '0deg', '0%')
    divGradient.style.flex = 'none'
    divGradient.style.width = '300px'
    divColorGrid.appendChild(divGradient)
  }
  if (gradients.length === 0) {
    divColorGrid.appendChild(createH3('No favorites yet :('))
  }

  return divColorGrid
}

function getHistoryColors() {
  const colors = []
  let index = 0
  while (localStorage.getItem(`historyColor${index}`) !== null) {
    colors.push(Colors.createHex(localStorage.getItem(`historyColor${index++}`)))
  }

  return colors
}

function isHistoryColor(color) {
  const colors = getHistoryColors()
  for (let index = 0; index < colors.length; index++) {
    if (Colors.equal(colors[index], color, false)) {
      return true
    }
  }

  return false
}

function setHistoryColors(colors) {
  let pos = 0
  for (let index = (colors.length > 8 ? colors.length - 8 : 0); index < colors.length; index++) {
    localStorage.setItem(`historyColor${pos++}`, colors[index].formattedHex)
  }
  for (let index = (colors.length > 8 ? 8 : colors.length); index < 16; index++) {
    localStorage.removeItem(`historyColor${index}`)
  }
}

function getHistoryGradients() {
  const gradients = []
  let index = 0
  while (localStorage.getItem(`historyGradient${index}`) !== null) {
    const gradient = localStorage.getItem(`historyGradient${index++}`)
    gradients.push([Colors.createHex(gradient.split(':')[0]), Colors.createHex(gradient.split(':')[1])])
  }

  return gradients
}

function isHistoryGradient(gradient) {
  const gradients = getHistoryGradients()
  for (let index = 0; index < gradients.length; index++) {
    if (Colors.equal(gradients[index][0], gradient[0], false) && Colors.equal(gradients[index][1], gradient[1], false)) {
      return true
    }
  }

  return false
}

function setHistorGradients(gradients) {
  let pos = 0
  for (let index = (gradients.length > 8 ? gradients.length - 8 : 0); index < gradients.length; index++) {
    localStorage.setItem(`historyGradient${pos++}`, `${gradients[index][0].formattedHex}:${gradients[index][1].formattedHex}`)
  }
  for (let index = (gradients.length > 8 ? 8 : gradients.length); index < 16; index++) {
    localStorage.removeItem(`historyGradient${index}`)
  }
}

function getHistoryContrastColors() {
  const colors = []
  let index = 0
  while (localStorage.getItem(`historyContrastColor${index}`) !== null) {
    colors.push(Colors.createHex(localStorage.getItem(`historyContrastColor${index++}`)))
  }

  return colors
}

function isHistoryContrastColor(color) {
  const colors = getHistoryContrastColors()
  for (let index = 0; index < colors.length; index++) {
    if (Colors.equal(colors[index], color, false)) {
      return true
    }
  }

  return false
}

function setHistoryContrastColors(colors) {
  let pos = 0
  for (let index = (colors.length > 8 ? colors.length - 8 : 0); index < colors.length; index++) {
    localStorage.setItem(`historyContrastColor${pos++}`, colors[index].formattedHex)
  }
  for (let index = (colors.length > 8 ? 8 : colors.length); index < 16; index++) {
    localStorage.removeItem(`historyContrastColor${index}`)
  }
}

function getHistoryContrastTextColors() {
  const colors = []
  let index = 0
  while (localStorage.getItem(`historyContrastTextColor${index}`) !== null) {
    colors.push(Colors.createHex(localStorage.getItem(`historyContrastTextColor${index++}`)))
  }

  return colors
}

function isHistoryContrastTextColor(color) {
  const colors = getHistoryContrastTextColors()
  for (let index = 0; index < colors.length; index++) {
    if (Colors.equal(colors[index], color, false)) {
      return true
    }
  }

  return false
}

function setHistoryContrastTextColors(colors) {
  let pos = 0
  for (let index = (colors.length > 8 ? colors.length - 8 : 0); index < colors.length; index++) {
    localStorage.setItem(`historyContrastTextColor${pos++}`, colors[index].formattedHex)
  }
  for (let index = (colors.length > 8 ? 8 : colors.length); index < 16; index++) {
    localStorage.removeItem(`historyContrastTextColor${index}`)
  }
}

function getLikedColors() {
  const colors = []
  let index = 0
  while (localStorage.getItem(`likedColor${index}`) !== null) {
    colors.push(Colors.createHex(localStorage.getItem(`likedColor${index++}`)))
  }

  return colors
}

function isColorLiked(color) {
  const colors = getLikedColors()
  for (let index = 0; index < colors.length; index++) {
    if (Colors.equal(colors[index], color, false)) {
      return true
    }
  }

  return false
}

function setLikedColors(colors) {
  let pos = 0
  for (let index = (colors.length > 100 ? colors.length - 100 : 0); index < colors.length; index++) {
    localStorage.setItem(`likedColor${pos++}`, colors[index].formattedHex)
  }
  for (let index = (colors.length > 100 ? 100 : colors.length); index < 200; index++) {
    localStorage.removeItem(`likedColor${index}`)
  }
}

function getLikedGradients() {
  const gradients = []
  let index = 0
  while (localStorage.getItem(`likedGradient${index}`) !== null) {
    const gradient = localStorage.getItem(`likedGradient${index++}`)
    gradients.push([Colors.createHex(gradient.split(':')[0]), Colors.createHex(gradient.split(':')[1])])
  }

  return gradients
}

function isGradientLiked(gradient) {
  const gradients = getLikedGradients()
  for (let index = 0; index < gradients.length; index++) {
    if (Colors.equal(gradients[index][0], gradient[0], false) && Colors.equal(gradients[index][1], gradient[1], false)) {
      return true
    }
  }

  return false
}

function setLikedGradients(gradients) {
  let pos = 0
  for (let index = (gradients.length > 100 ? gradients.length - 100 : 0); index < gradients.length; index++) {
    localStorage.setItem(`likedGradient${pos++}`, `${gradients[index][0].formattedHex}:${gradients[index][1].formattedHex}`)
  }
  for (let index = (gradients.length > 100 ? 100 : gradients.length); index < 200; index++) {
    localStorage.removeItem(`likedGradient${index}`)
  }
}

function createDivTooltip(divParent, innerText) {
  const divTooltip = createDiv()
  divTooltip.className = 'tooltip'
  divTooltip.innerText = innerText

  divParent.appendChild(divTooltip)
  divParent.addEventListener('mouseenter', () => {
    divTooltip.style.display = 'block'
  })
  divParent.addEventListener('mouseleave', () => {
    divTooltip.style.display = 'none'
  })
  divParent.addEventListener('click', () => {
    divTooltip.style.display = 'none'
  })
}

function createDivColorText(innerText) {
  const divColorText = createDiv()
  divColorText.className = 'color-text'
  divColorText.innerText = innerText
  createDivTooltip(divColorText, 'copy')
  divColorText.addEventListener('click', () => {
    navigator.clipboard.writeText(divColorText.innerText)

    const divCopied = createDiv()
    divCopied.className = 'copied'
    divCopied.appendChild(createH4('Copied to clipboard'))
    document.body.appendChild(divCopied)
    setTimeout(function () {
      divCopied.style.opacity = '1'
    }, 10)
    setTimeout(function () {
      divCopied.style.opacity = '0'
    }, 3000)
    setTimeout(function () {
      document.body.removeChild(divCopied)
    }, 3800)
  })

  return divColorText
}

function createDivColorIconHeart(color) {
  const divColorIcon = createDiv()
  divColorIcon.className = 'color-icon'
  divColorIcon.style.backgroundImage = isColorLiked(color) ? getBackgroundImage(color, 'heart-filled') : getBackgroundImage(color, 'heart-empty')
  divColorIcon.style.top = '10px'
  divColorIcon.style.left = '10px'
  createDivTooltip(divColorIcon, 'favorite')
  divColorIcon.addEventListener('click', () => {
    let colors = getLikedColors()
    let colorIndex = null
    for (let index = 0; index < colors.length; index++) {
      if (Colors.equal(colors[index], color, false)) {
        colorIndex = index
        break
      }
    }
    if (colorIndex === null) {
      divColorIcon.style.backgroundImage = getBackgroundImage(color, 'heart-filled')
      colors.push(color)
    } else {
      divColorIcon.style.backgroundImage = getBackgroundImage(color, 'heart-empty')
      colors.splice(colorIndex, 1)
    }
    setLikedColors(colors)
  })

  return divColorIcon
}

function createDivColorIconOpenFullscreen(color01, color02, type, value, position) {
  const divColorIcon = createDiv()
  divColorIcon.className = 'color-icon'
  divColorIcon.style.backgroundImage = getBackgroundImage(color02 === null ? color01 : color02, 'fullscreen')
  divColorIcon.style.top = '10px'
  divColorIcon.style.right = '10px'
  createDivTooltip(divColorIcon, 'fullscreen')
  divColorIcon.addEventListener('click', () => {
    if (color02 === null) {
      document.body.appendChild(createDivColor(color01, null, true))
    } else {
      document.body.appendChild(createDivGradientFullscreen(color01, color02, type, value, position))
    }
    document.body.style.overflow = 'hidden'
  })

  return divColorIcon
}

function createDivColorIconCloseFullscreen(color, divColor) {
  const divColorIcon = createDiv()
  divColorIcon.className = 'color-icon'
  divColorIcon.style.backgroundImage = getBackgroundImage(color, 'fullscreen')
  divColorIcon.style.top = '10px'
  divColorIcon.style.right = '10px'
  createDivTooltip(divColorIcon, 'fullscreen')
  divColorIcon.addEventListener('click', () => {
    document.body.removeChild(divColor)
    document.body.style.overflow = 'auto'
  })
  divColor.addEventListener('dblclick', () => {
    document.body.removeChild(divColor)
    document.body.style.overflow = 'auto'
  })

  return divColorIcon
}

function createDivColorIconCheckmark(color01, color02, side) {
  const baseColor = side === null ? color01 : side === 'left' ? color01 : color02
  const divColorIcon = createDiv()
  divColorIcon.className = 'color-icon'
  divColorIcon.style.backgroundImage = getBackgroundImage((side === null || color02 === null) ? color01 : side === 'left' ? color01 : color02, 'checkmark')
  divColorIcon.style.bottom = '10px'
  divColorIcon.style.right = '10px'
  createDivTooltip(divColorIcon, color02 === null ? 'load color' : 'load gradient')
  divColorIcon.addEventListener('click', () => {
    loadTool(baseColor, color01, color02, side)
  })

  return divColorIcon
}

function createDivColorIconCornerTriangle(color, divColor01, divColor02, divGradient) {
  const divColorIcon = createDiv()
  divColorIcon.className = 'color-icon'
  divColorIcon.style.backgroundImage = getBackgroundImage(color, 'corner-triangle')
  divColorIcon.style.bottom = '10px'
  divColorIcon.style.left = '10px'
  createDivTooltip(divColorIcon, 'show colors')
  divColorIcon.addEventListener('click', () => {
    divColor01.style.display = 'flex'
    divGradient.style.display = 'none'
    divColor02.style.display = 'flex'
  })

  return divColorIcon
}

function createDivGradientIconHeart(gradient) {
  const divColorIcon = createDiv()
  divColorIcon.className = 'color-icon'
  divColorIcon.style.backgroundImage = isGradientLiked(gradient) ? getBackgroundImage(gradient[0], 'heart-filled') : getBackgroundImage(gradient[0], 'heart-empty')
  divColorIcon.style.top = '10px'
  divColorIcon.style.left = '10px'
  createDivTooltip(divColorIcon, 'favorite')
  divColorIcon.addEventListener('click', () => {
    let gradients = getLikedGradients()
    let gradientIndex = null
    for (let index = 0; index < gradients.length; index++) {
      if (Colors.equal(gradients[index][0], gradient[0], false) && Colors.equal(gradients[index][1], gradient[1], false)) {
        gradientIndex = index
        break
      }
    }
    if (gradientIndex === null) {
      divColorIcon.style.backgroundImage = getBackgroundImage(gradient[0], 'heart-filled')
      gradients.push(gradient)
    } else {
      divColorIcon.style.backgroundImage = getBackgroundImage(gradient[0], 'heart-empty')
      gradients.splice(gradientIndex, 1)
    }
    setLikedGradients(gradients)
  })

  return divColorIcon
}

function createDivColor(color, colorPicked, fullscreen = false, color02 = null, side = null) {
  const divColor = createDiv()
  divColor.className = fullscreen ? 'color-fullscreen' : 'color'
  divColor.style.backgroundColor = color.formattedHSL
  divColor.style.color = color.formattedText

  const divMarker = createDivMarker(color)
  const likeColor = createDivColorIconHeart(color)

  divColor.appendChild(createDivColorText(color.formattedHex))
  divColor.appendChild(createDivColorText(color.formattedRGB))
  divColor.appendChild(createDivColorText(color.formattedHSL))
  divColor.appendChild(createDivColorText(color.formattedHSV))
  divColor.appendChild(createDivColorText(color.formattedCMYK))
  divColor.appendChild(createDivColorText(`grayscale: ${color.grayscale}`))
  divColor.appendChild(likeColor)
  if (colorPicked !== null && Colors.equal(color, colorPicked)) {
    divColor.appendChild(divMarker)
  }
  if (fullscreen) {
    divColor.appendChild(createDivColorIconCloseFullscreen(color, divColor))
  } else {
    divColor.appendChild(createDivColorIconOpenFullscreen(color, null, null, null, null))
    if (color02 !== null && side !== null) {
      if (side === 'left') {
        const load = createDivColorIconCheckmark(color, color02, 'left')
        load.style.right = '40px'
        divColor.appendChild(load)
        divColor.appendChild(createDivColorIconCheckmark(colorPicked, color, 'right'))
      } else {
        const load = createDivColorIconCheckmark(color, colorPicked, 'left')
        load.style.right = '40px'
        divColor.appendChild(load)
        divColor.appendChild(createDivColorIconCheckmark(color02, color, 'right'))
      }
    } else {
      divColor.appendChild(createDivColorIconCheckmark(color, null, null))
    }
  }

  divColor.addEventListener('mouseenter', () => {
    const children = divColor.children
    for (let index = 0; index < children.length; index++) {
      children[index].style.display = 'block'
    }
    divColor.style.boxShadow = `2px 2px ${divColor.style.color} inset, -2px -2px ${divColor.style.color} inset`
    divMarker.style.display = 'none'
    likeColor.style.backgroundImage = isColorLiked(color) ? getBackgroundImage(color, 'heart-filled') : getBackgroundImage(color, 'heart-empty')
  })
  divColor.addEventListener('mouseleave', () => {
    const children = divColor.children
    for (let index = 0; index < children.length; index++) {
      children[index].style.display = 'none'
    }
    divColor.style.boxShadow = 'none'
    divMarker.style.display = 'block'
  })
  divColor.addEventListener('click', () => {
    const children = divColor.children
    for (let index = 0; index < children.length; index++) {
      children[index].style.display = 'block'
    }
    divColor.style.boxShadow = `2px 2px ${divColor.style.color} inset, -2px -2px ${divColor.style.color} inset`
    divMarker.style.display = 'none'
    likeColor.style.backgroundImage = isColorLiked(color) ? getBackgroundImage(color, 'heart-filled') : getBackgroundImage(color, 'heart-empty')
  })

  return divColor
}

function createDivGradient(color01, color02, divColor01, divColor02, type, value, position) {
  const divGradient = createDiv()
  divGradient.className = 'color'
  divGradient.style.backgroundColor = color01.formattedHSL
  divGradient.style.color = color01.formattedText
  divGradient.style.background = color01.formattedHex
  divGradient.style.background = `${type}-gradient(${value}, ${color01.formattedHex} ${position}, ${color02.formattedHex}`
  divGradient.style.background = `-moz-${type}-gradient(${value}, ${color01.formattedHex} ${position}, ${color02.formattedHex}`
  divGradient.style.background = `-webkit-${type}-gradient(${value}, ${color01.formattedHex} ${position}, ${color02.formattedHex}`

  const show = createDivColorIconCornerTriangle(color01, divColor01, divColor02, divGradient)
  const openFullscreen = createDivColorIconOpenFullscreen(color01, color02, type, value, position)
  const load = createDivColorIconCheckmark(color01, color02, 'right')
  const likeGradient = createDivGradientIconHeart([color01, color02])

  divGradient.appendChild(show)
  divGradient.appendChild(openFullscreen)
  divGradient.appendChild(load)
  divGradient.appendChild(likeGradient)
  divGradient.addEventListener('mouseenter', () => {
    show.style.display = 'block'
    openFullscreen.style.display = 'block'
    load.style.display = 'block'
    likeGradient.style.display = 'block'
    divGradient.style.boxShadow = `2px 2px ${divGradient.style.color} inset, -2px -2px ${divGradient.style.color} inset`
  })
  divGradient.addEventListener('mouseleave', () => {
    show.style.display = 'none'
    openFullscreen.style.display = 'none'
    load.style.display = 'none'
    likeGradient.style.display = 'none'
    divGradient.style.boxShadow = 'none'
  })
  divGradient.addEventListener('click', () => {
    show.style.display = 'block'
    openFullscreen.style.display = 'block'
    load.style.display = 'block'
    likeGradient.style.display = 'block'
    divGradient.style.boxShadow = `2px 2px ${divGradient.style.color} inset, -2px -2px ${divGradient.style.color} inset`
  })

  return divGradient
}

function createDivGradientFullscreen(color01, color02, type, value, position) {
  const divGradient = createDiv()
  divGradient.className = 'color-fullscreen'
  divGradient.style.backgroundColor = color01.formattedHSL
  divGradient.style.color = color01.formattedText
  divGradient.style.background = color01.formattedHex
  divGradient.style.background = `${type}-gradient(${value}, ${color01.formattedHex} ${position}, ${color02.formattedHex}`
  divGradient.style.background = `-moz-${type}-gradient(${value}, ${color01.formattedHex} ${position}, ${color02.formattedHex}`
  divGradient.style.background = `-webkit-${type}-gradient(${value}, ${color01.formattedHex} ${position}, ${color02.formattedHex}`

  const closeFullscreen = createDivColorIconCloseFullscreen(color02, divGradient)

  divGradient.appendChild(closeFullscreen)
  divGradient.addEventListener('mouseenter', () => {
    closeFullscreen.style.display = 'block'
    divGradient.style.boxShadow = `2px 2px ${divGradient.style.color} inset, -2px -2px ${divGradient.style.color} inset`
  })
  divGradient.addEventListener('mouseleave', () => {
    closeFullscreen.style.display = 'none'
    divGradient.style.boxShadow = 'none'
  })
  divGradient.addEventListener('click', () => {
    closeFullscreen.style.display = 'block'
    divGradient.style.boxShadow = `2px 2px ${divGradient.style.color} inset, -2px -2px ${divGradient.style.color} inset`
  })

  return divGradient
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

function createInputRangeSlider(min, max, step, text, value, row, updateFunction, colorPicked) {
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
    updateFunction(row, inputRangeSlider.value, colorPicked)
  })

  const divSlider = createDiv()
  divSlider.className = 'slider'
  divSlider.appendChild(h4Slider)
  divSlider.appendChild(inputRangeSlider)

  updateFunction(row, inputRangeSlider.value, colorPicked)

  return divSlider
}

function createDoubleInputRangeSliders(min01, max01, step01, text01, value01, min02, max02, step02, text02, value02, row, updateFunction, colorPicked) {
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
    updateFunction(row, inputRangeSlider01.value, inputRangeSlider02.value, colorPicked)
  })

  inputRangeSlider02.addEventListener('input', () => {
    h4Slider02.innerText = `${text02}: ${inputRangeSlider02.value}`
    updateFunction(row, inputRangeSlider01.value, inputRangeSlider02.value, colorPicked)
  })

  const divSlider01 = createDiv()
  divSlider01.className = 'slider'
  divSlider01.appendChild(h4Slider01)
  divSlider01.appendChild(inputRangeSlider01)

  const divSlider02 = createDiv()
  divSlider02.className = 'slider'
  divSlider02.appendChild(h4Slider02)
  divSlider02.appendChild(inputRangeSlider02)

  updateFunction(row, inputRangeSlider01.value, inputRangeSlider02.value, colorPicked)

  return [divSlider01, divSlider02]
}

function createDoubleInputRangeSlidersGradient(min01, max01, step01, text01, value01, min02, max02, step02, text02, value02, row, updateFunction, colorPicked01, colorPicked02, height) {
  const h4Slider01 = createH4(`${text01}: ${value01}`)
  const h4Slider02 = createH4(`${text02}: ${value02}`)
  const h4Slider03 = createH4('Type: linear')

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

  const inputRangeSlider03 = document.createElement('input')
  inputRangeSlider03.className = 'slider'
  inputRangeSlider03.type = 'range'
  inputRangeSlider03.min = 0
  inputRangeSlider03.max = 1
  inputRangeSlider03.step = 1
  inputRangeSlider03.value = 0

  inputRangeSlider01.addEventListener('input', () => {
    h4Slider01.innerText = `${text01}: ${inputRangeSlider01.value}`
    row.replaceChildren()
    if (inputRangeSlider03.value === '0') {
      row.appendChild(updateFunction(colorPicked01, colorPicked02, colorPicked01, colorPicked02, 'linear', `${inputRangeSlider01.value}deg`, `${inputRangeSlider02.value}%`, height))
    } else {
      row.appendChild(updateFunction(colorPicked01, colorPicked02, colorPicked01, colorPicked02, 'radial', 'circle', `${inputRangeSlider02.value}%`, height))
    }
  })

  inputRangeSlider02.addEventListener('input', () => {
    h4Slider02.innerText = `${text02}: ${inputRangeSlider02.value}`
    row.replaceChildren()
    if (inputRangeSlider03.value === '0') {
      row.appendChild(updateFunction(colorPicked01, colorPicked02, colorPicked01, colorPicked02, 'linear', `${inputRangeSlider01.value}deg`, `${inputRangeSlider02.value}%`, height))
    } else {
      row.appendChild(updateFunction(colorPicked01, colorPicked02, colorPicked01, colorPicked02, 'radial', 'circle', `${inputRangeSlider02.value}%`, height))
    }
  })

  inputRangeSlider03.addEventListener('input', () => {
    h4Slider03.innerText = `Type: ${inputRangeSlider03.value === '0' ? 'linear' : 'radial'}`
    row.replaceChildren()
    if (inputRangeSlider03.value === '0') {
      row.appendChild(updateFunction(colorPicked01, colorPicked02, colorPicked01, colorPicked02, 'linear', `${inputRangeSlider01.value}deg`, `${inputRangeSlider02.value}%`, height))
    } else {
      row.appendChild(updateFunction(colorPicked01, colorPicked02, colorPicked01, colorPicked02, 'radial', 'circle', `${inputRangeSlider02.value}%`, height))
    }
  })

  const divSlider01 = createDiv()
  divSlider01.className = 'slider'
  divSlider01.appendChild(h4Slider01)
  divSlider01.appendChild(inputRangeSlider01)

  const divSlider02 = createDiv()
  divSlider02.className = 'slider'
  divSlider02.appendChild(h4Slider02)
  divSlider02.appendChild(inputRangeSlider02)

  const divSlider03 = createDiv()
  divSlider03.className = 'slider'
  divSlider03.appendChild(h4Slider03)
  divSlider03.appendChild(inputRangeSlider03)

  row.replaceChildren()
  if (inputRangeSlider03.value === '0') {
    row.appendChild(updateFunction(colorPicked01, colorPicked02, colorPicked01, colorPicked02, 'linear', `${inputRangeSlider01.value}deg`, `${inputRangeSlider02.value}%`, height))
  } else {
    row.appendChild(updateFunction(colorPicked01, colorPicked02, colorPicked01, colorPicked02, 'radial', 'circle', `${inputRangeSlider02.value}%`, height))
  }

  return [divSlider01, divSlider02, divSlider03]
}

function createButtonSwitchColors(gradient) {
  const buttonSwitchColors = document.createElement('button')
  buttonSwitchColors.className = 'theme'
  buttonSwitchColors.innerText = 'Switch Colors'
  buttonSwitchColors.addEventListener('click', () => {
    const gradients = getHistoryGradients()
    gradients.push([gradient[1], gradient[0]])
    setHistorGradients(gradients)
    toolPicked()
  })

  return buttonSwitchColors
}

function createButtonEyedropper(color01, color02) {
  const buttonEyedropper = document.createElement('button')
  buttonEyedropper.className = 'theme'
  buttonEyedropper.innerText = 'Eyedropper'
  buttonEyedropper.addEventListener('click', () => {
    const eyeDropper = new EyeDropper()

    eyeDropper
      .open()
      .then((colorSelectionResult) => {
        const eyedropColor = Colors.createHex(colorSelectionResult.sRGBHex)
        if (eyedropColor !== null && Colors.notEqual(eyedropColor, color01)) {
          loadTool(eyedropColor, color01, color02)
        }
      })
      .catch(error => {
      })
  })

  return buttonEyedropper
}

function loadTool(color, color01, color02, side) {
  if (tool !== 'likedColors') {
    if (tool === 'colorPicker') {
      const colors = getHistoryColors()
      colors.push(color)
      setHistoryColors(colors)
    } else if (tool === 'contrastPicker') {
      if (side === null || side === 'left') {
        const colors = getHistoryContrastColors()
        colors.push(color)
        setHistoryContrastColors(colors)
      } else {
        const colors = getHistoryContrastTextColors()
        colors.push(color)
        setHistoryContrastTextColors(colors)
      }
    } else {
      const gradients = getHistoryGradients()
      if (side === null || side === 'left') {
        gradients.push([color, color02])
      } else {
        gradients.push([color01, color])
      }
      setHistorGradients(gradients)
    }
    toolPicked()
  }
}

function createBoxColumn(color01, color02, side) {
  const baseColor = side === null ? color01 : side === 'left' ? color01 : color02
  const hexBoxRow = createDivInputRow()
  const hexBox = createInputTextBox()
  hexBox.maxLength = '7'
  hexBox.style.width = '107px'
  hexBox.value = baseColor.formattedHex
  hexBox.addEventListener('focusout', () => {
    const color = Colors.createHex(hexBox.value)
    if (color !== null && Colors.notEqual(color, baseColor)) {
      loadTool(color, color01, color02, side)
    } else {
      hexBox.value = baseColor.formattedHex
    }
  })
  hexBox.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      const color = Colors.createHex(hexBox.value)
      if (color !== null && Colors.notEqual(color, baseColor)) {
        loadTool(color, color01, color02, side)
      } else {
        hexBox.value = baseColor.formattedHex
      }
    }
  })

  hexBoxRow.appendChild(createH4('hex:'))
  hexBoxRow.appendChild(hexBox)

  const rgbBoxRow = createDivInputRow()
  const rBox = createInputTextBox()
  rBox.maxLength = '3'
  rBox.value = baseColor.rgb.r
  const gBox = createInputTextBox()
  gBox.maxLength = '3'
  gBox.value = baseColor.rgb.g
  const bBox = createInputTextBox()
  bBox.maxLength = '3'
  bBox.value = baseColor.rgb.b

  rBox.addEventListener('focusout', () => {
    const color = Colors.createRGB(rBox.value, gBox.value, bBox.value)
    if (color !== null && Colors.notEqual(color, baseColor)) {
      loadTool(color, color01, color02, side)
    } else {
      rBox.value = baseColor.rgb.r
    }
  })
  rBox.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      const color = Colors.createRGB(rBox.value, gBox.value, bBox.value)
      if (color !== null && Colors.notEqual(color, baseColor)) {
        loadTool(color, color01, color02, side)
      } else {
        rBox.value = baseColor.rgb.r
      }
    }
  })
  gBox.addEventListener('focusout', () => {
    const color = Colors.createRGB(rBox.value, gBox.value, bBox.value)
    if (color !== null && Colors.notEqual(color, baseColor)) {
      loadTool(color, color01, color02, side)
    } else {
      gBox.value = baseColor.rgb.g
    }
  })
  gBox.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      const color = Colors.createRGB(rBox.value, gBox.value, bBox.value)
      if (color !== null && Colors.notEqual(color, baseColor)) {
        loadTool(color, color01, color02, side)
      } else {
        gBox.value = baseColor.rgb.g
      }
    }
  })
  bBox.addEventListener('focusout', () => {
    const color = Colors.createRGB(rBox.value, gBox.value, bBox.value)
    if (color !== null && Colors.notEqual(color, baseColor)) {
      loadTool(color, color01, color02, side)
    } else {
      bBox.value = baseColor.rgb.b
    }
  })
  bBox.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      const color = Colors.createRGB(rBox.value, gBox.value, bBox.value)
      if (color !== null && Colors.notEqual(color, baseColor)) {
        loadTool(color, color01, color02, side)
      } else {
        bBox.value = baseColor.rgb.b
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
  hBox.value = baseColor.hsl.h
  const sBox = createInputTextBox()
  sBox.maxLength = '3'
  sBox.value = baseColor.hsl.s
  const lBox = createInputTextBox()
  lBox.maxLength = '3'
  lBox.value = baseColor.hsl.l

  hBox.addEventListener('focusout', () => {
    const color = Colors.createHSL(hBox.value, sBox.value, lBox.value)
    if (color !== null && Colors.notEqual(color, baseColor)) {
      loadTool(color, color01, color02, side)
    } else {
      hBox.value = baseColor.hsl.h
    }
  })
  hBox.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      const color = Colors.createHSL(hBox.value, sBox.value, lBox.value)
      if (color !== null && Colors.notEqual(color, baseColor)) {
        loadTool(color, color01, color02, side)
      } else {
        hBox.value = baseColor.hsl.h
      }
    }
  })
  sBox.addEventListener('focusout', () => {
    const color = Colors.createHSL(hBox.value, sBox.value, lBox.value)
    if (color !== null && Colors.notEqual(color, baseColor)) {
      loadTool(color, color01, color02, side)
    } else {
      sBox.value = baseColor.hsl.s
    }
  })
  sBox.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      const color = Colors.createHSL(hBox.value, sBox.value, lBox.value)
      if (color !== null && Colors.notEqual(color, baseColor)) {
        loadTool(color, color01, color02, side)
      } else {
        sBox.value = baseColor.hsl.s
      }
    }
  })
  lBox.addEventListener('focusout', () => {
    const color = Colors.createHSL(hBox.value, sBox.value, lBox.value)
    if (color !== null && Colors.notEqual(color, baseColor)) {
      loadTool(color, color01, color02, side)
    } else {
      lBox.value = baseColor.hsl.l
    }
  })
  lBox.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      const color = Colors.createHSL(hBox.value, sBox.value, lBox.value)
      if (color !== null && Colors.notEqual(color, baseColor)) {
        loadTool(color, color01, color02, side)
      } else {
        lBox.value = baseColor.hsl.l
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
  boxColumn.appendChild(createColorWidget(baseColor))
  if (window.EyeDropper) {
    const buttonRow = createDivInputRow()
    buttonRow.appendChild(createButtonEyedropper(color01, color02))
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

function buildHueRow(row, value, degrees, colorPicked) {
  buildColorRow(row, Colors.hues(colorPicked, degrees, value), colorPicked)
}

function buildSaturationRow(row, value, colorPicked) {
  buildColorRow(row, Colors.saturations(colorPicked, value), colorPicked)
}

function buildLightnessRow(row, value, colorPicked) {
  buildColorRow(row, Colors.lightnesses(colorPicked, value), colorPicked)
}

function updateColorWidget(pickedColor, hoveredColor, divInnerRow, divCanvasRow) {
  const divColor = createDivColor(hoveredColor, pickedColor)
  divColor.style.height = '400px'
  divColor.style.width = '100%'
  divInnerRow.replaceChildren()
  divInnerRow.appendChild(divColor)
  divInnerRow.appendChild(divCanvasRow)
  const children = divColor.children
  for (let index = 0; index < children.length; index++) {
    if (children[index].className === 'color-text') {
      children[index].style.display = 'block'
    }
  }
  divColor.style.boxShadow = `2px 2px ${divColor.style.color} inset, -2px -2px ${divColor.style.color} inset`

  divInnerRow.addEventListener('mouseleave', () => {
    const children = divColor.children
    for (let index = 0; index < children.length; index++) {
      if (children[index].className === 'color-text') {
        children[index].style.display = 'none'
      }
    }
    divColor.style.boxShadow = 'none'
  })
}

function createColorWidget(pickedColor) {
  const divColor = createDivColor(pickedColor, pickedColor)
  divColor.style.height = '400px'
  divColor.style.width = '100%'

  const canvasColors = document.createElement('canvas')
  canvasColors.style.touchAction = 'none'
  canvasColors.style.height = '400px'
  canvasColors.style.width = '100%'
  canvasColors.style.minWidth = '0px'
  canvasColors.height = 200
  canvasColors.width = 200

  const canvasHues = document.createElement('canvas')
  canvasHues.style.touchAction = 'none'
  canvasHues.style.height = '400px'
  canvasHues.style.width = '20%'
  canvasHues.style.minWidth = '0px'
  canvasHues.height = 200
  canvasHues.width = 200

  const divCanvasRow = createDiv()
  divCanvasRow.style.display = 'flex'
  divCanvasRow.style.justifyContent = 'center'
  divCanvasRow.style.alignItems = 'center'
  divCanvasRow.style.width = '100%'
  divCanvasRow.appendChild(canvasColors)
  divCanvasRow.appendChild(canvasHues)

  const divInnerRow = createDivInnerRow()
  divInnerRow.style.gap = '0px'
  divInnerRow.style.border = '2px solid var(--color)'
  divInnerRow.appendChild(divColor)
  divInnerRow.appendChild(divCanvasRow)

  let hoveredColor = Colors.copy(pickedColor)

  let mouseDownColors = false
  let touchDownColors = false
  let mouseDownHues = false
  let touchDownHues = false

  let xColors = getCanvasWidth(canvasColors) / 2
  let yColors = getCanvasHeight(canvasColors) / 2
  let xHues = getCanvasWidth(canvasHues) / 2
  let yHues = getCanvasHeight(canvasHues) / 2

  canvasColors.addEventListener('mousedown', () => { mouseDownColors = true })
  canvasColors.addEventListener('mouseup', () => { mouseDownColors = false })
  canvasColors.addEventListener('mousemove', (event) => {
    const potentialColorXY = getImageDataColors(event, canvasColors, mouseDownColors, false, pickedColor)
    const potentialColor = potentialColorXY[0]
    if (mouseDownColors && Colors.notEqual(potentialColor, hoveredColor)) {
      xColors = potentialColorXY[1]
      yColors = potentialColorXY[2]
      hoveredColor = potentialColor
      updateColorWidget(pickedColor, hoveredColor, divInnerRow, divCanvasRow)
    }
  })
  canvasColors.addEventListener('touchstart', () => { touchDownColors = true })
  canvasColors.addEventListener('touchend', () => { touchDownColors = false })
  canvasColors.addEventListener('touchmove', (event) => {
    const potentialColorXY = getImageDataColors(event, canvasColors, false, touchDownColors, pickedColor)
    const potentialColor = potentialColorXY[0]
    if (touchDownColors && Colors.notEqual(potentialColor, hoveredColor)) {
      xColors = potentialColorXY[1]
      yColors = potentialColorXY[2]
      hoveredColor = potentialColor
      updateColorWidget(pickedColor, hoveredColor, divInnerRow, divCanvasRow)
    }
  })
  canvasColors.addEventListener('click', (event) => {
    const potentialColorXY = getImageDataColors(event, canvasColors, true, false, pickedColor)
    const potentialColor = potentialColorXY[0]
    xColors = potentialColorXY[1]
    yColors = potentialColorXY[2]
    hoveredColor = potentialColor
    updateColorWidget(pickedColor, hoveredColor, divInnerRow, divCanvasRow)
  })

  canvasHues.addEventListener('touchstart', () => { touchDownHues = true })
  canvasHues.addEventListener('touchend', () => { touchDownHues = false })
  canvasHues.addEventListener('mousemove', (event) => {
    const potentialHueXY = getImageDataHues(event, canvasHues, mouseDownHues, false, pickedColor)
    if (mouseDownHues) {
      pickedColor = potentialHueXY[0]
      xHues = potentialHueXY[1]
      yHues = potentialHueXY[2]
      const potentialColorXY = getImageDataColorsXY(canvasColors, xColors, yColors, pickedColor)
      hoveredColor = potentialColorXY[0]
      xColors = potentialColorXY[1]
      yColors = potentialColorXY[2]
      updateColorWidget(pickedColor, hoveredColor, divInnerRow, divCanvasRow)
    }
  })
  canvasHues.addEventListener('mousedown', () => { mouseDownHues = true })
  canvasHues.addEventListener('mouseup', () => { mouseDownHues = false })
  canvasHues.addEventListener('touchmove', (event) => {
    const potentialHueXY = getImageDataHues(event, canvasHues, false, touchDownHues, pickedColor)
    if (touchDownHues) {
      pickedColor = potentialHueXY[0]
      xHues = potentialHueXY[1]
      yHues = potentialHueXY[2]
      const potentialColorXY = getImageDataColorsXY(canvasColors, xColors, yColors, pickedColor)
      hoveredColor = potentialColorXY[0]
      xColors = potentialColorXY[1]
      yColors = potentialColorXY[2]
      updateColorWidget(pickedColor, hoveredColor, divInnerRow, divCanvasRow)
    }
  })
  canvasHues.addEventListener('click', (event) => {
    const potentialHueXY = getImageDataHues(event, canvasHues, true, false, pickedColor)
    pickedColor = potentialHueXY[0]
    xHues = potentialHueXY[1]
    yHues = potentialHueXY[2]
    const potentialColorXY = getImageDataColorsXY(canvasColors, xColors, yColors, pickedColor)
    hoveredColor = potentialColorXY[0]
    xColors = potentialColorXY[1]
    yColors = potentialColorXY[2]
    updateColorWidget(pickedColor, hoveredColor, divInnerRow, divCanvasRow)
  })

  const divColorWidgetWindow = createDiv()
  divColorWidgetWindow.className = 'color-fullscreen'
  divColorWidgetWindow.appendChild(divInnerRow)
  divColorWidgetWindow.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
  divColorWidgetWindow.addEventListener('dblclick', () => {
    document.body.removeChild(divColorWidgetWindow)
    document.body.style.overflow = 'auto'
  })

  const buttonColorWidget = document.createElement('button')
  buttonColorWidget.className = 'theme'
  buttonColorWidget.innerText = 'Color Widget'
  buttonColorWidget.addEventListener('click', () => {
    document.body.appendChild(divColorWidgetWindow)
    document.body.style.overflow = 'hidden'
    resizeCanvasColors(canvasColors, pickedColor, getCanvasWidth(canvasColors) / 2, getCanvasHeight(canvasColors) / 2, true)
    resizeCanvasHues(canvasHues, pickedColor, getCanvasWidth(canvasHues) / 2, getCanvasHeight(canvasHues) / 2, true)
    const potentialHueXY = findImageDataHues(canvasHues, pickedColor)
    hoveredColor = potentialHueXY[0]
    xHues = potentialHueXY[1]
    yHues = potentialHueXY[2]
    const potentialColorXY = findImageDataColors(canvasColors, pickedColor)
    hoveredColor = potentialColorXY[0]
    xColors = potentialColorXY[1]
    yColors = potentialColorXY[2]
    updateColorWidget(pickedColor, hoveredColor, divInnerRow, divCanvasRow)
  })

  window.addEventListener('resize', () => {
    resizeCanvasColors(canvasColors, pickedColor, xColors, yColors)
    const xyHues = resizeCanvasHues(canvasHues, pickedColor, xHues, yHues)
    xHues = xyHues[0]
    yHues = xyHues[1]
  })

  return buttonColorWidget
}

function getCanvasHeight(canvas) {
  return canvas.getBoundingClientRect().height
}

function getCanvasWidth(canvas) {
  return canvas.getBoundingClientRect().width
}

function getDPR() {
  return window.devicePixelRatio
}

function resizeCanvasColors(canvas, pickedColor, x, y, initial = false) {
  const context = canvas.getContext('2d')
  const height = getCanvasHeight(canvas)
  const width = getCanvasWidth(canvas)
  const dpr = getDPR()

  const xPct = Math.round((x / (canvas.width / dpr)) * 100) / 100
  const yPct = Math.round((y / (canvas.height / dpr)) * 100) / 100

  canvas.height = height * dpr
  canvas.width = width * dpr
  context.scale(dpr, dpr)

  const x1 = initial ? x : xPct * width
  const y1 = initial ? y : yPct * height

  drawCanvasColors(canvas, x1, y1, pickedColor, pickedColor)

  return [x1, y1]
}

function resizeCanvasHues(canvas, pickedColor, x, y, initial = false) {
  const context = canvas.getContext('2d')
  const height = getCanvasHeight(canvas)
  const width = getCanvasWidth(canvas)
  const dpr = getDPR()

  const xPct = Math.round((x / (canvas.width / dpr)) * 100) / 100
  const yPct = Math.round((y / (canvas.height / dpr)) * 100) / 100

  canvas.height = height * dpr
  canvas.width = width * dpr
  context.scale(dpr, dpr)

  const x1 = initial ? x : xPct * width
  const y1 = initial ? y : yPct * height

  drawCanvasHues(canvas, x1, y1, pickedColor, pickedColor)

  return [x1, y1]
}

function drawCanvasColors(canvas, x, y, pickedColor, hoveredColor) {
  const context = canvas.getContext('2d')
  context.clearRect(0, 0, getCanvasWidth(canvas), getCanvasHeight(canvas))

  const colorGradient = context.createLinearGradient(0, 0, getCanvasWidth(canvas), 0)
  colorGradient.addColorStop(0.01, '#ffffff')
  colorGradient.addColorStop(0.99, Colors.createHSL(`${pickedColor.hsl.h}`, '100', '50').formattedHex)
  context.fillStyle = colorGradient
  context.fillRect(0, 0, getCanvasWidth(canvas), getCanvasHeight(canvas))

  const blackGradient = context.createLinearGradient(0, 0, 0, getCanvasHeight(canvas))
  blackGradient.addColorStop(0.01, '#00000000')
  blackGradient.addColorStop(0.99, '#000000')
  context.fillStyle = blackGradient
  context.fillRect(0, 0, getCanvasWidth(canvas), getCanvasHeight(canvas))

  context.lineWidth = 2
  context.strokeStyle = hoveredColor.formattedText
  context.strokeRect(x - 6, y - 6, 12, 12)
}

function drawCanvasHues(canvas, x, y, pickedColor, hoveredColor) {
  const context = canvas.getContext('2d')
  context.clearRect(0, 0, getCanvasWidth(canvas), getCanvasHeight(canvas))

  const colorGradient = context.createLinearGradient(0, 0, 0, getCanvasHeight(canvas))
  colorGradient.addColorStop(0.01, Colors.createHSL('0', '100', '50').formattedHex)
  colorGradient.addColorStop(0.10, Colors.createHSL('35', '100', '50').formattedHex)
  colorGradient.addColorStop(0.20, Colors.createHSL('71', '100', '50').formattedHex)
  colorGradient.addColorStop(0.30, Colors.createHSL('107', '100', '50').formattedHex)
  colorGradient.addColorStop(0.40, Colors.createHSL('143', '100', '50').formattedHex)
  colorGradient.addColorStop(0.50, Colors.createHSL('179', '100', '50').formattedHex)
  colorGradient.addColorStop(0.60, Colors.createHSL('215', '100', '50').formattedHex)
  colorGradient.addColorStop(0.70, Colors.createHSL('251', '100', '50').formattedHex)
  colorGradient.addColorStop(0.80, Colors.createHSL('287', '100', '50').formattedHex)
  colorGradient.addColorStop(0.90, Colors.createHSL('323', '100', '50').formattedHex)
  colorGradient.addColorStop(0.99, Colors.createHSL('359', '100', '50').formattedHex)
  context.fillStyle = colorGradient
  context.fillRect(0, 0, getCanvasWidth(canvas), getCanvasHeight(canvas))

  context.lineWidth = 2
  context.strokeStyle = hoveredColor.formattedText
  context.strokeRect(2, y - 6, getCanvasWidth(canvas) - 4, 12)
}

function getImageDataColors(event, canvas, mouseDown, touchDown, pickedColor) {
  if (mouseDown || touchDown) {
    const context = canvas.getContext('2d')

    const dpr = getDPR()
    const bounding = canvas.getBoundingClientRect()
    const x = (mouseDown ? event.clientX : event.touches[0].clientX) - bounding.left
    const y = (mouseDown ? event.clientY : event.touches[0].clientY) - bounding.top
    const data = context.getImageData(x * dpr, y * dpr, 1, 1).data
    const hoveredColor = Colors.createRGB(`${data[0]}`, `${data[1]}`, `${data[2]}`)
    drawCanvasColors(canvas, x, y, pickedColor, hoveredColor)

    return [hoveredColor, x, y]
  }

  return [pickedColor, getCanvasWidth(canvas) / 2, getCanvasHeight(canvas) / 2]
}

function getImageDataColorsXY(canvas, x, y, pickedColor) {
  drawCanvasColors(canvas, x, y, pickedColor, pickedColor)
  const context = canvas.getContext('2d')
  const dpr = getDPR()
  const data = context.getImageData(x * dpr, y * dpr, 1, 1).data
  const hoveredColor = Colors.createRGB(`${data[0]}`, `${data[1]}`, `${data[2]}`)

  return [hoveredColor, x, y]
}

function getImageDataHues(event, canvas, mouseDown, touchDown, pickedColor) {
  if (mouseDown || touchDown) {
    const context = canvas.getContext('2d')

    const dpr = getDPR()
    const bounding = canvas.getBoundingClientRect()
    const x = (mouseDown ? event.clientX : event.touches[0].clientX) - bounding.left
    const y = (mouseDown ? event.clientY : event.touches[0].clientY) - bounding.top
    const data = context.getImageData(x * dpr, y * dpr, 1, 1).data
    const hoveredColor = Colors.createRGB(`${data[0]}`, `${data[1]}`, `${data[2]}`)
    drawCanvasHues(canvas, x, y, pickedColor, hoveredColor)

    return [hoveredColor, x, y]
  }

  return [pickedColor, getCanvasWidth(canvas) / 2, getCanvasHeight(canvas) / 2]
}

function findImageDataColors(canvas, pickedColor) {
  const context = canvas.getContext('2d')
  const dpr = getDPR()
  let x = 0
  let y = canvas.height / 2

  for (x = 0; x <= canvas.width; x++) {
    const data = context.getImageData(x, y, 1, 1).data
    const hoveredColor = Colors.createRGB(`${data[0]}`, `${data[1]}`, `${data[2]}`)
    if (hoveredColor.hsv.s === pickedColor.hsv.s) {
      break
    }
  }

  for (y = 0; y <= canvas.height; y++) {
    const data = context.getImageData(x, y, 1, 1).data
    const hoveredColor = Colors.createRGB(`${data[0]}`, `${data[1]}`, `${data[2]}`)
    if (hoveredColor.hsv.v === pickedColor.hsv.v) {
      drawCanvasColors(canvas, x / dpr, y / dpr, pickedColor, hoveredColor)
      return [hoveredColor, x / dpr, y / dpr]
    }
  }

  return [pickedColor, getCanvasWidth(canvas) / 2, getCanvasHeight(canvas) / 2]
}

function findImageDataHues(canvas, pickedColor) {
  const context = canvas.getContext('2d')
  const dpr = getDPR()
  const x = canvas.width / 2

  for (let y = 0; y <= canvas.height; y++) {
    const data = context.getImageData(x, y, 1, 1).data
    const hoveredColor = Colors.createRGB(`${data[0]}`, `${data[1]}`, `${data[2]}`)
    if (hoveredColor.hsl.h === pickedColor.hsl.h) {
      drawCanvasHues(canvas, x / dpr, y / dpr, pickedColor, hoveredColor)
      return [hoveredColor, x / dpr, y / dpr]
    }
  }

  return [pickedColor, getCanvasWidth(canvas) / 2, getCanvasHeight(canvas) / 2]
}

function complementaryRow(colorPicked) {
  return buildColorRow(createDivColorRowSmall(), Colors.complementary(colorPicked), colorPicked)
}

function splitComplementaryRow(colorPicked) {
  return buildColorRow(createDivColorRowSmall(), Colors.splitComplementary(colorPicked), colorPicked)
}

function analogousRow(colorPicked) {
  return buildColorRow(createDivColorRowSmall(), Colors.analogous(colorPicked), colorPicked)
}

function triadicRow(colorPicked) {
  return buildColorRow(createDivColorRowSmall(), Colors.triadic(colorPicked), colorPicked)
}

function tetradicRow(colorPicked) {
  return buildColorRow(createDivColorRowSmall(), Colors.tetradic(colorPicked), colorPicked)
}

function squareRow(colorPicked) {
  return buildColorRow(createDivColorRowSmall(), Colors.square(colorPicked), colorPicked)
}

function paletteARow(colorPicked) {
  return buildColorRow(createDivColorRowSmall(), Colors.paletteA(colorPicked), colorPicked)
}

function gradientRow(color01, color02, colorPicked01, colorPicked02, type, value, position, height = null) {
  return buildColorGradientRow(createDivColorRowSmall(), Colors.gradient(color01, color02), colorPicked01, colorPicked02, type, value, position, height)
}

function buildColorRow(row, colors, colorPicked) {
  row.replaceChildren()
  colors.forEach(color => {
    row.appendChild(createDivColor(color, colorPicked))
  })

  return row
}

function buildColorRow1(row, colors, colorPicked, side) {
  row.replaceChildren()
  colors.forEach(color => {
    row.appendChild(createDivColor(color, colorPicked, false, color, side))
  })

  return row
}

function buildColorGradientRow(row, colors, colorPicked01, colorPicked02, type, value, position, height = null) {
  const divColor01 = createDivColor(colors[0], colorPicked01, false, colorPicked02, 'left')
  const divColor02 = createDivColor(colors[1], colorPicked02, false, colorPicked01, 'right')
  const divGradient = createDivGradient(colors[0], colors[1], divColor01, divColor02, type, value, position)

  if (height !== null) {
    divColor01.style.height = height
    divGradient.style.height = height
    divColor02.style.height = height
  }

  divColor01.style.display = 'none'
  divGradient.style.display = 'flex'
  divColor02.style.display = 'none'

  row.replaceChildren()
  row.appendChild(divColor01)
  row.appendChild(divGradient)
  row.appendChild(divColor02)
  row.addEventListener('mouseleave', () => {
    divColor01.style.display = 'none'
    divGradient.style.display = 'flex'
    divColor02.style.display = 'none'
  })

  return row
}

function getBackgroundImage(color, name) {
  let backgroundImage = 'blank.png'
  if (name === 'checkmark') {
    backgroundImage = color.grayscale > 127 ? 'checkmark-black.png' : 'checkmark-white.png'
  } else if (name === 'corner-triangle') {
    backgroundImage = color.grayscale > 127 ? 'corner-triangle-black.png' : 'corner-triangle-white.png'
  } else if (name === 'fullscreen') {
    backgroundImage = color.grayscale > 127 ? 'fullscreen-black.png' : 'fullscreen-white.png'
  } else if (name === 'heart-empty') {
    backgroundImage = color.grayscale > 127 ? 'heart-empty-black.png' : 'heart-empty-white.png'
  } else if (name === 'heart-filled') {
    backgroundImage = color.grayscale > 127 ? 'heart-filled-black.png' : 'heart-filled-white.png'
  }

  return `url(images/${backgroundImage})`
}
