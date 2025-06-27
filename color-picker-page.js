import { Colors } from './colors.js'
import { createDivColorIconHeart, isColorLiked } from './favorites.js'
import { getBackgroundImage } from './images.js'
import { createDivTooltip } from './tooltips.js'
import { createH1, createH2, createH3, createH4, createDivColorText } from './text.js'
import { createDivColorIconFullscreen } from './fullscreen.js'

class ColorPickerPage {

  constructor(buttonNavigation, colorPicker) {
    this.buttonNavigation = buttonNavigation
    this.colorPicker = colorPicker
    this.colorPicked = null
  }

  createDivColorRow() {
    const row = document.createElement('div')
    row.className = 'color-row'

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

  createButtonColorInputs(colorInputs) {
    const buttonColorInputs = document.createElement('button')
    buttonColorInputs.className = 'theme'
    buttonColorInputs.innerText = 'Show'
    buttonColorInputs.addEventListener('click', () => {
      buttonColorInputs.innerText = buttonColorInputs.innerText === 'Hide' ? 'Show' : 'Hide'
      for (let index = 0; index < colorInputs.length; index++) {
        if (colorInputs[index].style.display === 'none') {
          colorInputs[index].style.display = 'flex'
        } else {
          colorInputs[index].style.display = 'none'
        }
      }
    })

    return buttonColorInputs
  }

  updatePage(color) {
    const colors = this.getHistoryColors()
    colors.push(color)
    this.setHistoryColors(colors)
    this.createPage()
  }

  createPage() {
    localStorage.setItem('tool', 'colorPicker')

    const colors = this.getHistoryColors()
    if (colors.length === 0) {
      colors.push(Colors.random())
      this.setHistoryColors(colors)
    }
    this.colorPicked = colors[colors.length - 1]
    document.documentElement.style.setProperty('--thumb-color', this.colorPicked.formattedHex)

    const hueRow = this.createDivColorRow()
    const hueSliders = this.createInputRangeSliders(1, 90, 1, 'Separation', 12, 1, 360, 1, 'Degrees', 180, hueRow)

    const saturationRow = this.createDivColorRow()
    const saturationSlider = this.createInputRangeSlider(1, 20, 1, 'Separation', 8, saturationRow, "sat")

    const lightnessRow = this.createDivColorRow()
    const lightnessSlider = this.createInputRangeSlider(1, 20, 1, 'Separation', 8, lightnessRow, "lig")

    const divColorPicked = this.createDivColor(this.colorPicked, true)
    divColorPicked.style.height = '400px'
    divColorPicked.style.maxWidth = '800px'

    const colorRow = document.createElement('div')
    colorRow.className = 'inner-row'
    colorRow.appendChild(divColorPicked)
    colorRow.appendChild(this.createBoxColumn())

    const variationsColumn = document.createElement('div')
    variationsColumn.className = 'inner-column'
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

    const harmoniesColumn = document.createElement('div')
    harmoniesColumn.className = 'inner-column'
    harmoniesColumn.appendChild(createH2('Harmonies'))
    harmoniesColumn.appendChild(createH3('Complementary'))
    harmoniesColumn.appendChild(this.buildColorRow(this.createDivColorRowSmall(), Colors.complementary(this.colorPicked)))
    harmoniesColumn.appendChild(createH3('Split Complementary'))
    harmoniesColumn.appendChild(this.buildColorRow(this.createDivColorRowSmall(), Colors.splitComplementary(this.colorPicked)))
    harmoniesColumn.appendChild(createH3('Analogous'))
    harmoniesColumn.appendChild(this.buildColorRow(this.createDivColorRowSmall(), Colors.analogous(this.colorPicked)))
    harmoniesColumn.appendChild(createH3('Triadic'))
    harmoniesColumn.appendChild(this.buildColorRow(this.createDivColorRowSmall(), Colors.triadic(this.colorPicked)))
    harmoniesColumn.appendChild(createH3('Tetradic'))
    harmoniesColumn.appendChild(this.buildColorRow(this.createDivColorRowSmall(), Colors.tetradic(this.colorPicked)))
    harmoniesColumn.appendChild(createH3('Square'))
    harmoniesColumn.appendChild(this.buildColorRow(this.createDivColorRowSmall(), Colors.square(this.colorPicked)))

    const palettesColumn = document.createElement('div')
    palettesColumn.className = 'inner-column'
    palettesColumn.appendChild(createH2('Palettes'))
    palettesColumn.appendChild(this.buildColorRow(this.createDivColorRowSmall(), Colors.paletteA(this.colorPicked)))

    const historyColumn = document.createElement('div')
    historyColumn.className = 'inner-column'
    historyColumn.appendChild(createH2('History'))
    historyColumn.appendChild(this.buildColorRow(this.createDivColorRow(), this.getHistoryColors()))

    const header = document.getElementById('header')
    header.replaceChildren()
    header.appendChild(this.buttonNavigation)
    header.appendChild(createH1('Color Picker'))

    const outerColumn = document.getElementById('outer-column')
    outerColumn.replaceChildren()
    outerColumn.appendChild(colorRow)
    outerColumn.appendChild(variationsColumn)
    outerColumn.appendChild(harmoniesColumn)
    outerColumn.appendChild(palettesColumn)
    outerColumn.appendChild(historyColumn)

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 10)
  }

  getHistoryColors() {
    const colors = []
    let index = 0
    while (localStorage.getItem(`historyColor${index}`) !== null) {
      colors.push(Colors.createHex(localStorage.getItem(`historyColor${index++}`)))
    }

    return colors
  }

  setHistoryColors(colors) {
    let pos = 0
    for (let index = (colors.length > 8 ? colors.length - 8 : 0); index < colors.length; index++) {
      localStorage.setItem(`historyColor${pos++}`, colors[index].formattedHex)
    }
    for (let index = (colors.length > 8 ? 8 : colors.length); index < 16; index++) {
      localStorage.removeItem(`historyColor${index}`)
    }
  }

  createDivColor(color, picked) {
    const divMarker = document.createElement('div')
    divMarker.className = 'marker'
    divMarker.style.backgroundColor = color.formattedText

    const likeColor = createDivColorIconHeart(color)
    const divColor = document.createElement('div')
    divColor.className = 'color'
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
    if (Colors.equal(color, this.colorPicked)) {
      divColor.appendChild(divMarker)
    }

    divColor.style.flex = picked ? 'auto' : '1 1 0'
    divColor.addEventListener('mouseenter', () => {
      const children = divColor.children
      for (let index = 0; index < children.length; index++) {
        children[index].style.display = 'block'
      }
      divColor.style.flex = 'auto'
      divColor.style.boxShadow = `2px 2px ${divColor.style.color} inset, -2px -2px ${divColor.style.color} inset`
      divMarker.style.display = 'none'
      likeColor.style.backgroundImage = isColorLiked(color) ? getBackgroundImage(color, 'heart-filled') : getBackgroundImage(color, 'heart-empty')
    })
    divColor.addEventListener('mouseleave', () => {
      const children = divColor.children
      for (let index = 0; index < children.length; index++) {
        children[index].style.display = 'none'
      }
      divColor.style.flex = picked ? 'auto' : '1 1 0'
      divColor.style.boxShadow = 'none'
      divMarker.style.display = 'block'
    })
    divColor.addEventListener('click', () => {
      const children = divColor.children
      for (let index = 0; index < children.length; index++) {
        children[index].style.display = 'block'
      }
      divColor.style.flex = 'auto'
      divColor.style.boxShadow = `2px 2px ${divColor.style.color} inset, -2px -2px ${divColor.style.color} inset`
      divMarker.style.display = 'none'
      likeColor.style.backgroundImage = isColorLiked(color) ? getBackgroundImage(color, 'heart-filled') : getBackgroundImage(color, 'heart-empty')
    })

    return divColor
  }

  createBoxColumn() {
    const divInputBoxHex = document.createElement('input')
    divInputBoxHex.className = 'box'
    divInputBoxHex.type = 'text'
    divInputBoxHex.maxLength = '7'
    divInputBoxHex.style.width = '107px'
    divInputBoxHex.value = this.colorPicked.formattedHex
    divInputBoxHex.addEventListener('focusout', () => {
      const enteredColor = Colors.createHex(divInputBoxHex.value)
      if (enteredColor !== null && Colors.notEqual(enteredColor, this.colorPicked)) {
        this.updatePage(enteredColor)
      } else {
        divInputBoxHex.value = this.colorPicked.formattedHex
      }
    })
    divInputBoxHex.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        const enteredColor = Colors.createHex(divInputBoxHex.value)
        if (enteredColor !== null && Colors.notEqual(enteredColor, this.colorPicked)) {
          this.updatePage(enteredColor)
        } else {
          divInputBoxHex.value = this.colorPicked.formattedHex
        }
      }
    })

    const divInputBoxR = document.createElement('input')
    divInputBoxR.className = 'box'
    divInputBoxR.type = 'text'
    divInputBoxR.maxLength = '3'
    divInputBoxR.style.width = '50px'
    divInputBoxR.value = this.colorPicked.rgb.r
    divInputBoxR.addEventListener('focusout', () => {
      const enteredColor = Colors.createRGB(divInputBoxR.value, `${this.colorPicked.rgb.g}`, `${this.colorPicked.rgb.b}`)
      if (enteredColor !== null && Colors.notEqual(enteredColor, this.colorPicked)) {
        this.updatePage(enteredColor)
      } else {
        divInputBoxR.value = this.colorPicked.rgb.r
      }
    })
    divInputBoxR.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        const enteredColor = Colors.createRGB(divInputBoxR.value, `${this.colorPicked.rgb.g}`, `${this.colorPicked.rgb.b}`)
        if (enteredColor !== null && Colors.notEqual(enteredColor, this.colorPicked)) {
          this.updatePage(enteredColor)
        } else {
          divInputBoxR.value = this.colorPicked.rgb.r
        }
      }
    })

    const divInputBoxG = document.createElement('input')
    divInputBoxG.className = 'box'
    divInputBoxG.type = 'text'
    divInputBoxG.maxLength = '3'
    divInputBoxG.style.width = '50px'
    divInputBoxG.value = this.colorPicked.rgb.g
    divInputBoxG.addEventListener('focusout', () => {
      const enteredColor = Colors.createRGB(`${this.colorPicked.rgb.r}`, divInputBoxG.value, `${this.colorPicked.rgb.b}`)
      if (enteredColor !== null && Colors.notEqual(enteredColor, this.colorPicked)) {
        this.updatePage(enteredColor)
      } else {
        divInputBoxG.value = this.colorPicked.rgb.g
      }
    })
    divInputBoxG.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        const enteredColor = Colors.createRGB(`${this.colorPicked.rgb.r}`, divInputBoxG.value, `${this.colorPicked.rgb.b}`)
        if (enteredColor !== null && Colors.notEqual(enteredColor, this.colorPicked)) {
          this.updatePage(enteredColor)
        } else {
          divInputBoxG.value = this.colorPicked.rgb.g
        }
      }
    })

    const divInputBoxB = document.createElement('input')
    divInputBoxB.className = 'box'
    divInputBoxB.type = 'text'
    divInputBoxB.maxLength = '3'
    divInputBoxB.style.width = '50px'
    divInputBoxB.value = this.colorPicked.rgb.b
    divInputBoxB.addEventListener('focusout', () => {
      const enteredColor = Colors.createRGB(`${this.colorPicked.rgb.r}`, `${this.colorPicked.rgb.g}`, divInputBoxB.value)
      if (enteredColor !== null && Colors.notEqual(enteredColor, this.colorPicked)) {
        this.updatePage(enteredColor)
      } else {
        divInputBoxB.value = this.colorPicked.rgb.b
      }
    })
    divInputBoxB.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        const enteredColor = Colors.createRGB(`${this.colorPicked.rgb.r}`, `${this.colorPicked.rgb.g}`, divInputBoxB.value)
        if (enteredColor !== null && Colors.notEqual(enteredColor, this.colorPicked)) {
          this.updatePage(enteredColor)
        } else {
          divInputBoxB.value = this.colorPicked.rgb.b
        }
      }
    })

    const divInputBoxHSLH = document.createElement('input')
    divInputBoxHSLH.className = 'box'
    divInputBoxHSLH.type = 'text'
    divInputBoxHSLH.maxLength = '3'
    divInputBoxHSLH.style.width = '50px'
    divInputBoxHSLH.value = Math.round(this.colorPicked.hsl.h)
    divInputBoxHSLH.addEventListener('focusout', () => {
      const enteredColor = Colors.createHSL(divInputBoxHSLH.value, `${this.colorPicked.hsl.s}`, `${this.colorPicked.hsl.l}`)
      if (enteredColor !== null && Colors.notEqual(enteredColor, this.colorPicked)) {
        this.updatePage(enteredColor)
      } else {
        divInputBoxHSLH.value = Math.round(this.colorPicked.hsl.h)
      }
    })
    divInputBoxHSLH.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        const enteredColor = Colors.createHSL(divInputBoxHSLH.value, `${this.colorPicked.hsl.s}`, `${this.colorPicked.hsl.l}`)
        if (enteredColor !== null && Colors.notEqual(enteredColor, this.colorPicked)) {
          this.updatePage(enteredColor)
        } else {
          divInputBoxHSLH.value = Math.round(this.colorPicked.hsl.h)
        }
      }
    })

    const divInputBoxHSLS = document.createElement('input')
    divInputBoxHSLS.className = 'box'
    divInputBoxHSLS.type = 'text'
    divInputBoxHSLS.maxLength = '3'
    divInputBoxHSLS.style.width = '50px'
    divInputBoxHSLS.value = Math.round(this.colorPicked.hsl.s)
    divInputBoxHSLS.addEventListener('focusout', () => {
      const enteredColor = Colors.createHSL(`${this.colorPicked.hsl.h}`, divInputBoxHSLS.value, `${this.colorPicked.hsl.l}`)
      if (enteredColor !== null && Colors.notEqual(enteredColor, this.colorPicked)) {
        this.updatePage(enteredColor)
      } else {
        divInputBoxHSLS.value = Math.round(this.colorPicked.hsl.s)
      }
    })
    divInputBoxHSLS.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        const enteredColor = Colors.createHSL(`${this.colorPicked.hsl.h}`, divInputBoxHSLS.value, `${this.colorPicked.hsl.l}`)
        if (enteredColor !== null && Colors.notEqual(enteredColor, this.colorPicked)) {
          this.updatePage(enteredColor)
        } else {
          divInputBoxHSLS.value = Math.round(this.colorPicked.hsl.s)
        }
      }
    })

    const divInputBoxHSLL = document.createElement('input')
    divInputBoxHSLL.className = 'box'
    divInputBoxHSLL.type = 'text'
    divInputBoxHSLL.maxLength = '3'
    divInputBoxHSLL.style.width = '50px'
    divInputBoxHSLL.value = Math.round(this.colorPicked.hsl.l)
    divInputBoxHSLL.addEventListener('focusout', () => {
      const enteredColor = Colors.createHSL(`${this.colorPicked.hsl.h}`, `${this.colorPicked.hsl.s}`, divInputBoxHSLL.value)
      if (enteredColor !== null && Colors.notEqual(enteredColor, this.colorPicked)) {
        this.updatePage(enteredColor)
      } else {
        divInputBoxHSLL.value = Math.round(this.colorPicked.hsl.l)
      }
    })
    divInputBoxHSLL.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        const enteredColor = Colors.createHSL(`${this.colorPicked.hsl.h}`, `${this.colorPicked.hsl.s}`, divInputBoxHSLL.value)
        if (enteredColor !== null && Colors.notEqual(enteredColor, this.colorPicked)) {
          this.updatePage(enteredColor)
        } else {
          divInputBoxHSLL.value = Math.round(this.colorPicked.hsl.l)
        }
      }
    })

    const divInputBoxHSVH = document.createElement('input')
    divInputBoxHSVH.className = 'box'
    divInputBoxHSVH.type = 'text'
    divInputBoxHSVH.maxLength = '3'
    divInputBoxHSVH.style.width = '50px'
    divInputBoxHSVH.value = Math.round(this.colorPicked.hsv.h)
    divInputBoxHSVH.addEventListener('focusout', () => {
      const enteredColor = Colors.createHSV(divInputBoxHSVH.value, `${this.colorPicked.hsv.s}`, `${this.colorPicked.hsv.v}`)
      if (enteredColor !== null && Colors.notEqual(enteredColor, this.colorPicked)) {
        this.updatePage(enteredColor)
      } else {
        divInputBoxHSVH.value = Math.round(this.colorPicked.hsv.h)
      }
    })
    divInputBoxHSVH.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        const enteredColor = Colors.createHSV(divInputBoxHSVH.value, `${this.colorPicked.hsv.s}`, `${this.colorPicked.hsv.v}`)
        if (enteredColor !== null && Colors.notEqual(enteredColor, this.colorPicked)) {
          this.updatePage(enteredColor)
        } else {
          divInputBoxHSVH.value = Math.round(this.colorPicked.hsv.h)
        }
      }
    })

    const divInputBoxHSVS = document.createElement('input')
    divInputBoxHSVS.className = 'box'
    divInputBoxHSVS.type = 'text'
    divInputBoxHSVS.maxLength = '3'
    divInputBoxHSVS.style.width = '50px'
    divInputBoxHSVS.value = Math.round(this.colorPicked.hsv.s)
    divInputBoxHSVS.addEventListener('focusout', () => {
      const enteredColor = Colors.createHSV(`${this.colorPicked.hsv.h}`, divInputBoxHSVS.value, `${this.colorPicked.hsv.v}`)
      if (enteredColor !== null && Colors.notEqual(enteredColor, this.colorPicked)) {
        this.updatePage(enteredColor)
      } else {
        divInputBoxHSVS.value = Math.round(this.colorPicked.hsv.s)
      }
    })
    divInputBoxHSVS.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        const enteredColor = Colors.createHSV(`${this.colorPicked.hsv.h}`, divInputBoxHSVS.value, `${this.colorPicked.hsv.v}`)
        if (enteredColor !== null && Colors.notEqual(enteredColor, this.colorPicked)) {
          this.updatePage(enteredColor)
        } else {
          divInputBoxHSVS.value = Math.round(this.colorPicked.hsv.s)
        }
      }
    })

    const divInputBoxHSVV = document.createElement('input')
    divInputBoxHSVV.className = 'box'
    divInputBoxHSVV.type = 'text'
    divInputBoxHSVV.maxLength = '3'
    divInputBoxHSVV.style.width = '50px'
    divInputBoxHSVV.value = Math.round(this.colorPicked.hsv.v)
    divInputBoxHSVV.addEventListener('focusout', () => {
      const enteredColor = Colors.createHSV(`${this.colorPicked.hsv.h}`, `${this.colorPicked.hsv.s}`, divInputBoxHSVV.value)
      if (enteredColor !== null && Colors.notEqual(enteredColor, this.colorPicked)) {
        this.updatePage(enteredColor)
      } else {
        divInputBoxHSVV.value = Math.round(this.colorPicked.hsv.v)
      }
    })
    divInputBoxHSVV.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        const enteredColor = Colors.createHSV(`${this.colorPicked.hsv.h}`, `${this.colorPicked.hsv.s}`, divInputBoxHSVV.value)
        if (enteredColor !== null && Colors.notEqual(enteredColor, this.colorPicked)) {
          this.updatePage(enteredColor)
        } else {
          divInputBoxHSVV.value = Math.round(this.colorPicked.hsv.v)
        }
      }
    })

    const divInputBoxC = document.createElement('input')
    divInputBoxC.className = 'box'
    divInputBoxC.type = 'text'
    divInputBoxC.maxLength = '3'
    divInputBoxC.style.width = '50px'
    divInputBoxC.value = Math.round(this.colorPicked.cmyk.c)
    divInputBoxC.addEventListener('focusout', () => {
      const enteredColor = Colors.createCMYK(divInputBoxC.value, `${this.colorPicked.cmyk.m}`, `${this.colorPicked.cmyk.y}`, `${this.colorPicked.cmyk.k}`)
      if (enteredColor !== null && Colors.notEqual(enteredColor, this.colorPicked)) {
        this.updatePage(enteredColor)
      } else {
        divInputBoxC.value = Math.round(this.colorPicked.cmyk.c)
      }
    })
    divInputBoxC.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        const enteredColor = Colors.createCMYK(divInputBoxC.value, `${this.colorPicked.cmyk.m}`, `${this.colorPicked.cmyk.y}`, `${this.colorPicked.cmyk.k}`)
        if (enteredColor !== null && Colors.notEqual(enteredColor, this.colorPicked)) {
          this.updatePage(enteredColor)
        } else {
          divInputBoxC.value = Math.round(this.colorPicked.cmyk.c)
        }
      }
    })

    const divInputBoxM = document.createElement('input')
    divInputBoxM.className = 'box'
    divInputBoxM.type = 'text'
    divInputBoxM.maxLength = '3'
    divInputBoxM.style.width = '50px'
    divInputBoxM.value = Math.round(this.colorPicked.cmyk.m)
    divInputBoxM.addEventListener('focusout', () => {
      const enteredColor = Colors.createCMYK(`${this.colorPicked.cmyk.c}`, divInputBoxM.value, `${this.colorPicked.cmyk.y}`, `${this.colorPicked.cmyk.k}`)
      if (enteredColor !== null && Colors.notEqual(enteredColor, this.colorPicked)) {
        this.updatePage(enteredColor)
      } else {
        divInputBoxM.value = Math.round(this.colorPicked.cmyk.m)
      }
    })
    divInputBoxM.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        const enteredColor = Colors.createCMYK(`${this.colorPicked.cmyk.c}`, divInputBoxM.value, `${this.colorPicked.cmyk.y}`, `${this.colorPicked.cmyk.k}`)
        if (enteredColor !== null && Colors.notEqual(enteredColor, this.colorPicked)) {
          this.updatePage(enteredColor)
        } else {
          divInputBoxM.value = Math.round(this.colorPicked.cmyk.m)
        }
      }
    })

    const divInputBoxY = document.createElement('input')
    divInputBoxY.className = 'box'
    divInputBoxY.type = 'text'
    divInputBoxY.maxLength = '3'
    divInputBoxY.style.width = '50px'
    divInputBoxY.value = Math.round(this.colorPicked.cmyk.y)
    divInputBoxY.addEventListener('focusout', () => {
      const enteredColor = Colors.createCMYK(`${this.colorPicked.cmyk.c}`, `${this.colorPicked.cmyk.m}`, divInputBoxY.value, `${this.colorPicked.cmyk.k}`)
      if (enteredColor !== null && Colors.notEqual(enteredColor, this.colorPicked)) {
        this.updatePage(enteredColor)
      } else {
        divInputBoxY.value = Math.round(this.colorPicked.cmyk.y)
      }
    })
    divInputBoxY.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        const enteredColor = Colors.createCMYK(`${this.colorPicked.cmyk.c}`, `${this.colorPicked.cmyk.m}`, divInputBoxY.value, `${this.colorPicked.cmyk.k}`)
        if (enteredColor !== null && Colors.notEqual(enteredColor, this.colorPicked)) {
          this.updatePage(enteredColor)
        } else {
          divInputBoxY.value = Math.round(this.colorPicked.cmyk.y)
        }
      }
    })

    const divInputBoxK = document.createElement('input')
    divInputBoxK.className = 'box'
    divInputBoxK.type = 'text'
    divInputBoxK.maxLength = '3'
    divInputBoxK.style.width = '50px'
    divInputBoxK.value = Math.round(this.colorPicked.cmyk.k)
    divInputBoxK.addEventListener('focusout', () => {
      const enteredColor = Colors.createCMYK(`${this.colorPicked.cmyk.c}`, `${this.colorPicked.cmyk.m}`, `${this.colorPicked.cmyk.y}`, divInputBoxK.value)
      if (enteredColor !== null && Colors.notEqual(enteredColor, this.colorPicked)) {
        this.updatePage(enteredColor)
      } else {
        divInputBoxK.value = Math.round(this.colorPicked.cmyk.k)
      }
    })
    divInputBoxK.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        const enteredColor = Colors.createCMYK(`${this.colorPicked.cmyk.c}`, `${this.colorPicked.cmyk.m}`, `${this.colorPicked.cmyk.y}`, divInputBoxK.value)
        if (enteredColor !== null && Colors.notEqual(enteredColor, this.colorPicked)) {
          this.updatePage(enteredColor)
        } else {
          divInputBoxK.value = Math.round(this.colorPicked.cmyk.k)
        }
      }
    })

    const cmykBoxRow = document.createElement('div')
    cmykBoxRow.className = 'input-row'
    cmykBoxRow.style.display = 'none'
    cmykBoxRow.appendChild(createH4('cmyk:'))
    cmykBoxRow.appendChild(divInputBoxC)
    cmykBoxRow.appendChild(divInputBoxM)
    cmykBoxRow.appendChild(divInputBoxY)
    cmykBoxRow.appendChild(divInputBoxK)

    const hsvBoxRow = document.createElement('div')
    hsvBoxRow.className = 'input-row'
    hsvBoxRow.style.display = 'none'
    hsvBoxRow.appendChild(createH4('hsv :'))
    hsvBoxRow.appendChild(divInputBoxHSVH)
    hsvBoxRow.appendChild(divInputBoxHSVS)
    hsvBoxRow.appendChild(divInputBoxHSVV)

    const hslBoxRow = document.createElement('div')
    hslBoxRow.className = 'input-row'
    hslBoxRow.style.display = 'none'
    hslBoxRow.appendChild(createH4('hsl :'))
    hslBoxRow.appendChild(divInputBoxHSLH)
    hslBoxRow.appendChild(divInputBoxHSLS)
    hslBoxRow.appendChild(divInputBoxHSLL)

    const rgbBoxRow = document.createElement('div')
    rgbBoxRow.className = 'input-row'
    rgbBoxRow.style.display = 'none'
    rgbBoxRow.appendChild(createH4('rgb :'))
    rgbBoxRow.appendChild(divInputBoxR)
    rgbBoxRow.appendChild(divInputBoxG)
    rgbBoxRow.appendChild(divInputBoxB)

    const hexBoxRow = document.createElement('div')
    hexBoxRow.className = 'input-row'
    hexBoxRow.appendChild(createH4('hex :'))
    hexBoxRow.appendChild(divInputBoxHex)
    hexBoxRow.appendChild(this.createButtonColorInputs([rgbBoxRow, hslBoxRow, hsvBoxRow, cmykBoxRow]))

    const divInputColumn = document.createElement('div')
    divInputColumn.className = 'input-column'
    divInputColumn.appendChild(hexBoxRow)
    divInputColumn.appendChild(rgbBoxRow)
    divInputColumn.appendChild(hslBoxRow)
    divInputColumn.appendChild(hsvBoxRow)
    divInputColumn.appendChild(cmykBoxRow)
    divInputColumn.appendChild(this.colorPicker.createColorPickerButton(this.colorPicked, (color) => { this.updatePage(color) }))

    return divInputColumn
  }
  createInputRangeSlider(min, max, step, text, value, row, slider) {
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
      if (slider === 'sat') {
        this.buildColorRow(row, Colors.saturations(this.colorPicked, inputRangeSlider.value))
      } else {
        this.buildColorRow(row, Colors.lightnesses(this.colorPicked, inputRangeSlider.value))
      }
    })

    const divSlider = document.createElement('div')
    divSlider.className = 'slider'
    divSlider.appendChild(h4Slider)
    divSlider.appendChild(inputRangeSlider)

    if (slider === 'sat') {
      this.buildColorRow(row, Colors.saturations(this.colorPicked, inputRangeSlider.value))
    } else {
      this.buildColorRow(row, Colors.lightnesses(this.colorPicked, inputRangeSlider.value))
    }

    return divSlider
  }

  createInputRangeSliders(min01, max01, step01, text01, value01, min02, max02, step02, text02, value02, row) {
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
      this.buildColorRow(row, Colors.hues(this.colorPicked, inputRangeSlider02.value, inputRangeSlider01.value))
    })

    inputRangeSlider02.addEventListener('input', () => {
      h4Slider02.innerText = `${text02}: ${inputRangeSlider02.value}`
      this.buildColorRow(row, Colors.hues(this.colorPicked, inputRangeSlider02.value, inputRangeSlider01.value))
    })

    const divSlider01 = document.createElement('div')
    divSlider01.className = 'slider'
    divSlider01.appendChild(h4Slider01)
    divSlider01.appendChild(inputRangeSlider01)

    const divSlider02 = document.createElement('div')
    divSlider02.className = 'slider'
    divSlider02.appendChild(h4Slider02)
    divSlider02.appendChild(inputRangeSlider02)

    this.buildColorRow(row, Colors.hues(this.colorPicked, inputRangeSlider02.value, inputRangeSlider01.value))

    return [divSlider01, divSlider02]
  }
}

export { ColorPickerPage }