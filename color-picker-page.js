import { Colors } from './colors.js'
import { createDivColorIconHeart, isColorLiked } from './favorites.js'
import { getBackgroundImage } from './images.js'
import { createDivTooltip } from './tooltips.js'
import { createH1, createH2, createH3, createH4, createDivColorText } from './text.js'
import { createDivColorIconFullscreen } from './fullscreen.js'

class ColorPickerPage {

  constructor(buttonNavigation, colorPicker, imagePicker, gradientPage) {
    this.buttonNavigation = buttonNavigation
    this.colorPicker = colorPicker
    this.imagePicker = imagePicker
    this.gradientPage = gradientPage
    this.pickerPageDataKey = gradientPage ? 'gradientPickerPageData' : 'colorPickerPageData'
    this.colorPicked = null
    this.mediaQueryLayoutVertical = window.matchMedia('(max-width: 600px)')
    this.colorPickerPageData = {
      hueSeparationSliderValue: 12,
      hueDegreeSliderValue: 180,
      saturationSliderValue: 8,
      lightnessSliderValue: 8,
      buttonToggleInputsText: 'Show',
      colorsToLoad: 'colorsDefault',
      colorsLoadable: {
        colorsDefault: {
          title: 'Tab 01',
          gradientTypeValue: 'Linear',
          gradientDegreeSliderValue: 0,
          gradientPercentSliderValue: [0],
          itemsToLoad: 'itemsDefault',
          itemsLoadable: {
            itemsDefault: {
              title: 'Color 01',
              colors: [Colors.random()]
            }
          }
        }
      }
    }
    if (this.gradientPage) {
      this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].itemsLoadable[`items${Date.now()}`] = { title: 'Color 02', colors: [Colors.random()] }
      this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].gradientPercentSliderValue.push(100)
    }
    this.colorPickerPageData = localStorage.getItem(this.pickerPageDataKey) !== null ? JSON.parse(localStorage.getItem(this.pickerPageDataKey)) : this.colorPickerPageData
    this.updateStorage()
  }

  updateStorage() {
    localStorage.setItem(this.pickerPageDataKey, JSON.stringify(this.colorPickerPageData))
  }

  createDivColorRow() {
    const row = document.createElement('div')
    row.className = 'color-row'

    return row
  }

  createDivColorRowReverse() {
    const row = document.createElement('div')
    row.className = 'color-row-reverse'

    return row
  }

  createDivColorRowSmall() {
    const row = document.createElement('div')
    row.className = 'color-row-small'

    return row
  }

  buildColorRow(row, colors) {
    row.replaceChildren()
    colors.forEach(color => {
      row.appendChild(this.createDivColor(color, false))
    })

    return row
  }

  createDivColorIconCheckmark(color) {
    const divColorIcon = document.createElement('div')
    divColorIcon.className = 'color-icon'
    divColorIcon.style.backgroundImage = getBackgroundImage(color, 'checkmark')
    divColorIcon.style.bottom = '10px'
    divColorIcon.style.right = '10px'
    createDivTooltip(divColorIcon, 'load')
    divColorIcon.addEventListener('click', () => {
      this.updatePage(color)
    })

    return divColorIcon
  }

  createSelectColorItemRow() {
    const selectColor = document.createElement('select')
    selectColor.className = 'inverted'
    selectColor.style.width = '100%'
    for (let itemLoadable in this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].itemsLoadable) {
      const optionItem = document.createElement('option')
      optionItem.textContent = this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].itemsLoadable[itemLoadable].title
      selectColor.appendChild(optionItem)
    }
    selectColor.value = this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].itemsLoadable[this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].itemsToLoad].title
    selectColor.addEventListener('change', event => {
      for (let itemLoadable in this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].itemsLoadable) {
        if (this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].itemsLoadable[itemLoadable].title === selectColor.value) {
          this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].itemsToLoad = itemLoadable
          this.updatePage(null)
          break
        }
      }
    })

    const buttonAddColor = document.createElement('button')
    buttonAddColor.className = 'theme-icon'
    buttonAddColor.innerHTML = '&nbsp;' // Need this for padding.
    buttonAddColor.style.display = Object.keys(this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].itemsLoadable).length >= (this.gradientPage ? 8 : 1) ? 'none' : 'block'
    buttonAddColor.style.backgroundColor = this.colorPicked.formattedHex
    buttonAddColor.style.backgroundImage = getBackgroundImage(this.colorPicked, 'plus')
    buttonAddColor.title = 'Add Color' // Switch to createDivTooltip().
    buttonAddColor.addEventListener('click', event => {
      const length = Object.keys(this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].itemsLoadable).length + 1
      if (length <= (this.gradientPage ? 8 : 1)) {
        this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].itemsToLoad = `items${Date.now()}`
        this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].itemsLoadable[this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].itemsToLoad] = { title: `Color ${String(length).padStart(2, '0')}`, colors: [Colors.random()] }
        this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].gradientPercentSliderValue.push(100)
        this.updatePage(null)
      }
    })

    const buttonRemoveColor = document.createElement('button')
    buttonRemoveColor.className = 'theme-icon'
    buttonRemoveColor.innerHTML = '&nbsp;' // Need this for padding.
    buttonRemoveColor.style.display = Object.keys(this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].itemsLoadable).length === (this.gradientPage ? 2 : 1) || this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].itemsToLoad === 'itemsDefault' ? 'none' : 'block'
    buttonRemoveColor.style.backgroundColor = this.colorPicked.formattedHex
    buttonRemoveColor.style.backgroundImage = getBackgroundImage(this.colorPicked, 'exit')
    buttonRemoveColor.title = 'Remove Color' // Switch to createDivTooltip().
    buttonRemoveColor.addEventListener('click', event => {
      const length = Object.keys(this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].itemsLoadable).length - 1
      if (length >= (this.gradientPage ? 2 : 1) && this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].itemsToLoad !== 'itemsDefault') {
        var index = Math.max(0, Object.keys(this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].itemsLoadable).indexOf(this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].itemsToLoad) - 1)
        delete this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].itemsLoadable[this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].itemsToLoad]
        this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].itemsToLoad = Object.keys(this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].itemsLoadable)[index]
        this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].gradientPercentSliderValue.splice(index + 1, 1)
        index = 1
        for (let itemLoadable in this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].itemsLoadable) {
          this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].itemsLoadable[itemLoadable].title = `Color ${String(index++).padStart(2, '0')}`
        }
        this.updatePage(null)
      }
    })

    const divInputRow = document.createElement('div')
    divInputRow.className = 'input-row'
    divInputRow.appendChild(selectColor)
    divInputRow.appendChild(buttonAddColor)
    divInputRow.appendChild(buttonRemoveColor)

    return divInputRow
  }

  createSelectColorRow() {
    const selectColor = document.createElement('select')
    selectColor.className = 'inverted'
    selectColor.style.width = '100%'
    for (let colorLoadable in this.colorPickerPageData.colorsLoadable) {
      const optionColor = document.createElement('option')
      optionColor.textContent = this.colorPickerPageData.colorsLoadable[colorLoadable].title
      selectColor.appendChild(optionColor)
    }
    selectColor.value = this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].title
    selectColor.addEventListener('change', event => {
      for (let colorLoadable in this.colorPickerPageData.colorsLoadable) {
        if (this.colorPickerPageData.colorsLoadable[colorLoadable].title === selectColor.value) {
          this.colorPickerPageData.colorsToLoad = colorLoadable
          this.updatePage(null)
          break
        }
      }
    })

    const buttonAddColor = document.createElement('button')
    buttonAddColor.className = 'theme-icon'
    buttonAddColor.innerHTML = '&nbsp;' // Need this for padding.
    buttonAddColor.style.display = Object.keys(this.colorPickerPageData.colorsLoadable).length >= 8 ? 'none' : 'block'
    buttonAddColor.style.backgroundColor = this.colorPicked.formattedHex
    buttonAddColor.style.backgroundImage = getBackgroundImage(this.colorPicked, 'plus')
    buttonAddColor.title = 'Add Tab' // Switch to createDivTooltip().
    buttonAddColor.addEventListener('click', event => {
      const length = Object.keys(this.colorPickerPageData.colorsLoadable).length + 1
      if (length <= 8) {
        this.colorPickerPageData.colorsToLoad = `colors${Date.now()}`
        this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad] = { title: `Tab ${String(length).padStart(2, '0')}`, gradientTypeValue: 'Linear', gradientDegreeSliderValue: 0, gradientPercentSliderValue: [0], itemsToLoad: 'itemsDefault', itemsLoadable: { itemsDefault: { title: 'Color 01', colors: [Colors.random()] } } }
        if (this.gradientPage) {
          this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].itemsLoadable[`items${Date.now()}`] = { title: 'Color 02', colors: [Colors.random()] }
          this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].gradientPercentSliderValue.push(100)
        }
        this.updatePage(null)
      }
    })

    const buttonRemoveColor = document.createElement('button')
    buttonRemoveColor.className = 'theme-icon'
    buttonRemoveColor.innerHTML = '&nbsp;' // Need this for padding.
    buttonRemoveColor.style.display = Object.keys(this.colorPickerPageData.colorsLoadable).length === 1 || this.colorPickerPageData.colorsToLoad === 'colorsDefault' ? 'none' : 'block'
    buttonRemoveColor.style.backgroundColor = this.colorPicked.formattedHex
    buttonRemoveColor.style.backgroundImage = getBackgroundImage(this.colorPicked, 'exit')
    buttonRemoveColor.title = 'Remove Tab' // Switch to createDivTooltip().
    buttonRemoveColor.addEventListener('click', event => {
      const length = Object.keys(this.colorPickerPageData.colorsLoadable).length - 1
      if (length >= 1 && this.colorPickerPageData.colorsToLoad !== 'colorsDefault') {
        var index = Math.max(0, Object.keys(this.colorPickerPageData.colorsLoadable).indexOf(this.colorPickerPageData.colorsToLoad) - 1)
        delete this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad]
        this.colorPickerPageData.colorsToLoad = Object.keys(this.colorPickerPageData.colorsLoadable)[index]
        index = 1
        for (let colorLoadable in this.colorPickerPageData.colorsLoadable) {
          this.colorPickerPageData.colorsLoadable[colorLoadable].title = `Tab ${String(index++).padStart(2, '0')}`
        }
        this.updatePage(null)
      }
    })

    const divInputRow = document.createElement('div')
    divInputRow.className = 'input-row'
    divInputRow.appendChild(selectColor)
    divInputRow.appendChild(buttonAddColor)
    divInputRow.appendChild(buttonRemoveColor)

    return divInputRow
  }

  updatePage(color) {
    if (color !== undefined && color !== null) {
      this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].itemsLoadable[this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].itemsToLoad].colors.push(color)
      this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].itemsLoadable[this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].itemsToLoad].colors = this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].itemsLoadable[this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].itemsToLoad].colors.slice(-20)
    }
    this.updateStorage()
    this.createPage()
  }

  createPage() {
    localStorage.setItem('tool', `${this.gradientPage ? 'gradient' : 'color'}Picker`)

    const titles = []
    const items = []
    for (let itemLoadable in this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].itemsLoadable) {
      const title = this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].itemsLoadable[itemLoadable].title
      const colors = this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].itemsLoadable[itemLoadable].colors
      titles.push(title)
      items.push(colors[colors.length - 1])
    }

    const colors = this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].itemsLoadable[this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].itemsToLoad].colors
    this.colorPicked = colors[colors.length - 1]
    document.documentElement.style.setProperty('--thumb-color', this.colorPicked.formattedHex)

    const hueRow = this.createDivColorRow()
    const hueCallable = () => { this.buildColorRow(hueRow, Colors.hues(this.colorPicked, this.colorPickerPageData.hueDegreeSliderValue, this.colorPickerPageData.hueSeparationSliderValue)) }
    const hueSeparationSlider = this.createInputRangeSlider(this.colorPickerPageData, 'hueSeparationSliderValue', 'Separation', hueCallable, 1, 90, 1, null)
    const hueDegreeSlider = this.createInputRangeSlider(this.colorPickerPageData, 'hueDegreeSliderValue', 'Degrees', hueCallable, 0, 360, 1, null)

    const saturationRow = this.createDivColorRow()
    const saturationCallable = () => { this.buildColorRow(saturationRow, Colors.saturations(this.colorPicked, this.colorPickerPageData.saturationSliderValue)) }
    const saturationSlider = this.createInputRangeSlider(this.colorPickerPageData, 'saturationSliderValue', 'Separation', saturationCallable, 1, 20, 1, null)

    const lightnessRow = this.createDivColorRow()
    const lightnessCallable = () => { this.buildColorRow(lightnessRow, Colors.lightnesses(this.colorPicked, this.colorPickerPageData.lightnessSliderValue)) }
    const lightnessSlider = this.createInputRangeSlider(this.colorPickerPageData, 'lightnessSliderValue', 'Separation', lightnessCallable, 1, 20, 1, null)

    var divColorPicked = items.length === 1 ? this.createDivColor(this.colorPicked, true) : this.createDivGradient(items, true)
    divColorPicked.style.height = '400px'
    divColorPicked.style.maxWidth = '800px'

    const divInputColumn = this.createDivInputColumn()

    const colorRow = document.createElement('div')
    colorRow.className = 'inner-row'
    colorRow.appendChild(divColorPicked)
    colorRow.appendChild(divInputColumn)

    const gradientCallable = () => {
      if (items.length > 1) {
        divColorPicked = this.createDivGradient(items, true)
        divColorPicked.style.height = '400px'
        divColorPicked.style.maxWidth = '800px'

        colorRow.replaceChildren()
        colorRow.appendChild(divColorPicked)
        colorRow.appendChild(divInputColumn)
      }
    }
    const gradientDegreesSlider = this.createInputRangeSlider(this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad], 'gradientDegreeSliderValue', 'Degrees', gradientCallable, 0, 360, 1, null)
    gradientDegreesSlider.style.display = this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].gradientTypeValue === 'Linear' ? 'flex' : 'none'
    const gradientPercentSliders = []
    items.forEach((item, index) => {
      document.documentElement.style.setProperty(`--thumb-color-${index}`, item.formattedHex)
      const gradientPercentSlider = this.createInputRangeSlider(this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad], 'gradientPercentSliderValue', 'Percent', gradientCallable, 0, 100, 1, index)
      gradientPercentSliders.push(gradientPercentSlider)
    })

    const buttonToggleGradientType = document.createElement('button')
    buttonToggleGradientType.className = 'theme'
    buttonToggleGradientType.innerText = this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].gradientTypeValue
    buttonToggleGradientType.style.maxWidth = '300px'
    buttonToggleGradientType.style.width = '80%'
    buttonToggleGradientType.addEventListener('click', event => {
      this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].gradientTypeValue = this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].gradientTypeValue === 'Linear' ? 'Radial' : 'Linear'
      buttonToggleGradientType.innerText = this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].gradientTypeValue
      gradientDegreesSlider.style.display = this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].gradientTypeValue === 'Linear' ? 'flex' : 'none'
      gradientCallable()
      this.updateStorage()
    })

    const gradientColumn = document.createElement('div')
    gradientColumn.className = 'inner-column'
    gradientColumn.appendChild(createH2('Gradient'))
    gradientColumn.appendChild(buttonToggleGradientType)
    gradientColumn.appendChild(gradientDegreesSlider)
    gradientPercentSliders.forEach(gradientPercentSlider => { gradientColumn.appendChild(gradientPercentSlider) })

    const variationsColumn = document.createElement('div')
    variationsColumn.className = 'inner-column'
    variationsColumn.appendChild(createH2('Variations'))
    variationsColumn.appendChild(createH3('Hue'))
    variationsColumn.appendChild(hueSeparationSlider)
    variationsColumn.appendChild(hueDegreeSlider)
    variationsColumn.appendChild(hueRow)
    variationsColumn.appendChild(createH3('Saturation'))
    variationsColumn.appendChild(saturationSlider)
    variationsColumn.appendChild(saturationRow)
    variationsColumn.appendChild(createH3('Lightness'))
    variationsColumn.appendChild(lightnessSlider)
    variationsColumn.appendChild(lightnessRow)

    const harmoniesColumn = document.createElement('div')
    harmoniesColumn.className = 'inner-column'
    harmoniesColumn.appendChild(createH2('Harmonies'))
    for (let [colorHarmony, colorCallable] of [
      ['Complementary', Colors.complementary],
      ['Split Complementary', Colors.splitComplementary],
      ['Analogous', Colors.analogous],
      ['Triadic', Colors.triadic],
      ['Tetradic', Colors.tetradic],
      ['Square', Colors.square]
    ]) {
      harmoniesColumn.appendChild(createH3(colorHarmony))
      harmoniesColumn.appendChild(this.buildColorRow(this.createDivColorRowSmall(), colorCallable(this.colorPicked)))
    }

    const palettesColumn = document.createElement('div')
    palettesColumn.className = 'inner-column'
    palettesColumn.appendChild(createH2('Palettes'))
    palettesColumn.appendChild(this.buildColorRow(this.createDivColorRowSmall(), Colors.paletteA(this.colorPicked)))

    const historyColumn = document.createElement('div')
    historyColumn.className = 'inner-column'
    historyColumn.appendChild(createH2('History'))
    historyColumn.appendChild(this.buildColorRow(this.createDivColorRowReverse(), colors))

    const header = document.getElementById('header')
    header.replaceChildren()
    header.appendChild(this.buttonNavigation)
    header.appendChild(createH1(`${this.gradientPage ? 'Gradient' : 'Color'} Picker`))

    const outerColumn = document.getElementById('outer-column')
    outerColumn.replaceChildren()
    outerColumn.appendChild(colorRow)
    if (items.length > 1) {
      outerColumn.appendChild(gradientColumn)
    }
    outerColumn.appendChild(variationsColumn)
    outerColumn.appendChild(harmoniesColumn)
    outerColumn.appendChild(palettesColumn)
    outerColumn.appendChild(historyColumn)

    setTimeout(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, 10)
  }

  createDivColorIconCornerTriangle(color, divGradient, divColors) {
    const divColorIcon = document.createElement('div')
    divColorIcon.className = 'color-icon'
    divColorIcon.style.backgroundImage = getBackgroundImage(color, 'corner-triangle')
    divColorIcon.style.bottom = '10px'
    divColorIcon.style.left = '10px'
    createDivTooltip(divColorIcon, 'show colors')
    divColorIcon.addEventListener('click', () => {
      divGradient.style.display = 'none'
      divColors.forEach(divColor => { divColor.style.display = 'flex' })
    })

    return divColorIcon
  }

  createDivGradient(colors, picked, explore = false) {
    const type = this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].gradientTypeValue.toLowerCase()
    const degrees = this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].gradientDegreeSliderValue
    const percents = this.colorPickerPageData.colorsLoadable[this.colorPickerPageData.colorsToLoad].gradientPercentSliderValue
    const background = `${type}-gradient(${type === 'linear' ? `${degrees}deg` : 'circle'}, ${colors.map((color, index) => `${color.formattedHex} ${percents[index]}%`).join(', ')})`

    const divColors = colors.map(color => this.createDivColor(color, false, explore, true))
    divColors.forEach(divColor => { divColor.style.display = 'none' })

    // const likeGradient = createDivGradientIconHeart(colors)
    const divGradient = document.createElement('div')
    divGradient.className = 'color'
    divGradient.style.display = 'flex'
    divGradient.style.backgroundColor = colors[0].formattedHex
    // divGradient.style.background = `${type}-gradient(${value}, ${colors.map((color, index) => `${color.formattedHex} ${Math.round((index / (colors.length - 1)) * 100)}%`).join(', ')})`
    divGradient.style.background = background
    divGradient.style.color = colors[0].formattedText
    divGradient.style.flex = '1 1 0'
    divGradient.style.height = '400px'
    divGradient.appendChild(createDivColorText(background))
    // colors.forEach(color => { divGradient.appendChild(createDivColorText(color.formattedHex)) })
    // divGradient.appendChild(likeGradient)
    // divGradient.appendChild(createDivGradientIconFullscreenNew(colors, type, value, position))
    divGradient.appendChild(this.createDivColorIconCornerTriangle(colors[0], divGradient, divColors))

    divGradient.addEventListener('mouseenter', event => {
      Array.from(divGradient.children).forEach(child => { child.style.display = 'block' })
      divGradient.style.flex = 'auto'
      divGradient.style.boxShadow = `2px 2px ${divGradient.style.color} inset, -2px -2px ${divGradient.style.color} inset`
      // likeGradient.style.backgroundImage = isGradientLiked(colors) ? getBackgroundImage(colors[0], 'heart-filled') : getBackgroundImage(colors[0], 'heart-empty')
    })
    divGradient.addEventListener('mouseleave', event => {
      Array.from(divGradient.children).forEach(child => { child.style.display = 'none' })
      divGradient.style.flex = '1 1 0'
      divGradient.style.boxShadow = 'none'
    })
    divGradient.addEventListener('click', event => {
      Array.from(divGradient.children).forEach(child => { child.style.display = 'block' })
      divGradient.style.flex = 'auto'
      divGradient.style.boxShadow = `2px 2px ${divGradient.style.color} inset, -2px -2px ${divGradient.style.color} inset`
      // likeGradient.style.backgroundImage = isGradientLiked(colors) ? getBackgroundImage(colors[0], 'heart-filled') : getBackgroundImage(colors[0], 'heart-empty')
    })

    const divColorRow = this.createDivColorRowReverse()
    divColorRow.style.flex = picked ? 'auto' : '1 1 0'
    divColorRow.appendChild(divGradient)
    divColors.forEach(divColor => { divColorRow.appendChild(divColor) })
    divColorRow.addEventListener('mouseenter', event => {
      divColorRow.style.flex = 'auto'
      divColors.forEach(divColor => { divColor.style.height = this.mediaQueryLayoutVertical.matches ? '200px' : '400px' })
    })
    divColorRow.addEventListener('mouseleave', event => {
      divColorRow.style.flex = picked ? 'auto' : '1 1 0'
      divGradient.style.display = 'flex'
      divColors.forEach(divColor => { divColor.style.display = 'none' })
    })
    divColorRow.addEventListener('click', event => {
      divColorRow.style.flex = 'auto'
      divColors.forEach(divColor => { divColor.style.height = this.mediaQueryLayoutVertical.matches ? '200px' : '400px' })
    })

    return divColorRow
  }

  createDivColor(color, picked, explore = false, gradientColor = false) {
    var divMarker = null
    const likeColor = createDivColorIconHeart(color)
    const divColor = document.createElement('div')
    divColor.className = 'color'
    divColor.style.flex = explore && !gradientColor ? 'none' : picked ? 'auto' : '1 1 0'
    divColor.style.backgroundColor = color.formattedHex
    divColor.style.color = color.formattedText
    divColor.appendChild(createDivColorText(color.formattedHex))
    divColor.appendChild(createDivColorText(color.formattedRGB))
    divColor.appendChild(createDivColorText(color.formattedHSL))
    divColor.appendChild(createDivColorText(color.formattedHSV))
    divColor.appendChild(createDivColorText(color.formattedCMYK))
    divColor.appendChild(createDivColorText(color.formattedCRWhite))
    divColor.appendChild(createDivColorText(color.formattedCRBlack))
    divColor.appendChild(likeColor)
    divColor.appendChild(createDivColorIconFullscreen(color))
    divColor.appendChild(this.createDivColorIconCheckmark(color))
    divColor.appendChild(this.colorPicker.createColorPickerIcon(color, (color) => { this.updatePage(color) }))
    if (!explore && Colors.equal(color, this.colorPicked)) {
      divMarker = document.createElement('div')
      divMarker.className = 'marker'
      divMarker.style.backgroundColor = color.formattedText
      divColor.appendChild(divMarker)
    }

    const expandDivColor = expand => {
      if (expand) {
        Array.from(divColor.children).forEach(child => { child.style.display = 'block' })
        divColor.style.flex = explore && !gradientColor ? 'none' : 'auto'
        divColor.style.width = explore && !gradientColor ? '100%' : this.mediaQueryLayoutVertical.matches ? '100%' : '300px'
        divColor.style.boxShadow = `2px 2px ${divColor.style.color} inset, -2px -2px ${divColor.style.color} inset`
        if (divMarker !== null) { divMarker.style.display = 'none' }
        likeColor.style.backgroundImage = isColorLiked(color) ? getBackgroundImage(color, 'heart-filled') : getBackgroundImage(color, 'heart-empty')
      } else {
        Array.from(divColor.children).forEach(child => { child.style.display = 'none' })
        divColor.style.flex = explore && !gradientColor ? 'none' : picked ? 'auto' : '1 1 0'
        divColor.style.width = '100%'
        divColor.style.boxShadow = 'none'
        if (divMarker !== null) { divMarker.style.display = 'block' }
      }
    }
    divColor.addEventListener('mouseenter', event => { expandDivColor(true) })
    divColor.addEventListener('mouseleave', event => { expandDivColor(false) })
    divColor.addEventListener('click', event => { expandDivColor(true) })

    return divColor
  }

  createDivInputColumn() {
    const inputHex = (value, divInputBox) => {
      const color = Colors.createHex(divInputBox.value)
      color !== null && Colors.notEqual(color, this.colorPicked) ? this.updatePage(color) : divInputBox.value = String(value)
    }

    const inputColor = (colorFormat, colorComponent, value, colorCallable, divInputBox) => {
      const colorComponents = []
      Object.keys(this.colorPicked[colorFormat]).forEach(key => {
        colorComponents.push(String(colorComponent === key ? divInputBox.value : this.colorPicked[colorFormat][key]))
      })
      const color = colorCallable(...colorComponents)
      color !== null && Colors.notEqual(color, this.colorPicked) ? this.updatePage(color) : divInputBox.value = String(value)
    }

    const divInputBox = document.createElement('input')
    divInputBox.className = 'box'
    divInputBox.type = 'text'
    divInputBox.maxLength = '7'
    divInputBox.style.width = '107px'
    divInputBox.value = this.colorPicked.formattedHex
    divInputBox.addEventListener('focusout', event => { inputHex(this.colorPicked.formattedHex, divInputBox) })
    divInputBox.addEventListener('keypress', event => { if (event.key === 'Enter') { inputHex(this.colorPicked.formattedHex, divInputBox) } })

    const buttonToggleInputs = document.createElement('button')
    buttonToggleInputs.className = 'theme'
    buttonToggleInputs.innerText = this.colorPickerPageData.buttonToggleInputsText
    buttonToggleInputs.style.width = '100%'

    const hexBoxRow = document.createElement('div')
    hexBoxRow.className = 'input-row'
    hexBoxRow.appendChild(createH4('hex :'))
    hexBoxRow.appendChild(divInputBox)
    hexBoxRow.appendChild(buttonToggleInputs)

    const divInputRows = []
    const divInputColumn = document.createElement('div')
    divInputColumn.className = 'input-column'
    divInputColumn.appendChild(hexBoxRow)
    for (let [colorFormat, colorCallable] of [
      ['rgb', Colors.createRGB],
      ['hsl', Colors.createHSL],
      ['hsv', Colors.createHSV],
      ['cmyk', Colors.createCMYK]
    ]) {
      const divInputRow = document.createElement('div')
      divInputRow.className = 'input-row'
      divInputRow.style.display = this.colorPickerPageData.buttonToggleInputsText === 'Show' ? 'none' : 'flex'
      divInputRow.appendChild(createH4(`${colorFormat.padEnd(4, ' ')}:`))
      Object.entries(this.colorPicked[colorFormat]).forEach(([colorComponent, value]) => {
        const divInputBox = document.createElement('input')
        divInputBox.className = 'box'
        divInputBox.type = 'text'
        divInputBox.maxLength = '3'
        divInputBox.style.width = '50px'
        divInputBox.value = String(Math.round(value))
        divInputBox.addEventListener('focusout', event => { inputColor(colorFormat, colorComponent, Math.round(value), colorCallable, divInputBox) })
        divInputBox.addEventListener('keypress', event => { if (event.key === 'Enter') { inputColor(colorFormat, colorComponent, Math.round(value), colorCallable, divInputBox) } })
        divInputRow.appendChild(divInputBox)
      })
      divInputColumn.appendChild(divInputRow)
      divInputRows.push(divInputRow)
    }
    divInputColumn.appendChild(this.colorPicker.createColorPickerButton(this.colorPicked, color => { this.updatePage(color) }))
    divInputColumn.appendChild(this.imagePicker.createImagePickerButton(this.colorPicked, color => { this.updatePage(color) }))
    if (this.gradientPage) {
      divInputColumn.appendChild(this.createSelectColorItemRow())
    }
    divInputColumn.appendChild(this.createSelectColorRow())

    buttonToggleInputs.addEventListener('click', event => {
      this.colorPickerPageData.buttonToggleInputsText = this.colorPickerPageData.buttonToggleInputsText === 'Show' ? 'Hide' : 'Show'
      buttonToggleInputs.innerText = this.colorPickerPageData.buttonToggleInputsText
      divInputRows.forEach(divInputRow => { divInputRow.style.display = this.colorPickerPageData.buttonToggleInputsText === 'Show' ? 'none' : 'flex' })
      this.updateStorage()
    })

    return divInputColumn
  }

  createInputRangeSlider(object, property, label, callable, min, max, step, index) {
    const h4Slider = createH4(`${label}: ${index === null ? object[property] : object[property][index]}`)

    const inputRangeSlider = document.createElement('input')
    inputRangeSlider.className = index === null ? 'slider' : `slider-${index}`
    inputRangeSlider.type = 'range'
    inputRangeSlider.min = min
    inputRangeSlider.max = max
    inputRangeSlider.step = step
    inputRangeSlider.value = index === null ? object[property] : object[property][index]
    inputRangeSlider.addEventListener('input', event => {
      index === null ? object[property] = inputRangeSlider.value : object[property][index] = inputRangeSlider.value
      h4Slider.innerText = `${label}: ${index === null ? object[property] : object[property][index]}`
      callable()
      this.updateStorage()
    })
    callable()

    const divSlider = document.createElement('div')
    divSlider.className = 'slider'
    divSlider.appendChild(h4Slider)
    divSlider.appendChild(inputRangeSlider)

    return divSlider
  }
}

export { ColorPickerPage }