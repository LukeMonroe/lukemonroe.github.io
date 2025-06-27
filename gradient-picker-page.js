import { Colors } from './colors.js'
import { createDivColorIconHeart, createDivGradientIconHeart, isColorLiked } from './favorites.js'
import { getBackgroundImage } from './images.js'
import { createDivTooltip } from './tooltips.js'
import { createH1, createH2, createH4, createDivColorText } from './text.js'
import { createDivColorIconFullscreen, createDivGradientIconFullscreen } from './fullscreen.js'

class GradientPickerPage {

  constructor(buttonNavigation, colorPicker) {
    this.buttonNavigation = buttonNavigation
    this.colorPicker = colorPicker
  }

  createDivInnerColumn() {
    const column = document.createElement('div')
    column.className = 'inner-column'

    return column
  }

  createDivInnerRow() {
    const row = document.createElement('div')
    row.className = 'inner-row'

    return row
  }

  createDivColorRowSmall() {
    const row = document.createElement('div')
    row.className = 'color-row-small'

    return row
  }

  createDivGradientIconCheckmark(gradient) {
    const divColorIcon = document.createElement('div')
    divColorIcon.className = 'color-icon'
    divColorIcon.style.backgroundImage = getBackgroundImage(gradient[1], 'checkmark')
    divColorIcon.style.bottom = '10px'
    divColorIcon.style.right = '10px'
    createDivTooltip(divColorIcon, 'load')
    divColorIcon.addEventListener('click', () => {
      this.updatePage(gradient)
    })

    return divColorIcon
  }

  updatePage(gradient) {
    const gradients = this.getHistoryGradients()
    gradients.push(gradient)
    this.setHistoryGradients(gradients)
    this.createPage()
  }

  createPage() {
    localStorage.setItem('tool', 'gradientPicker')

    const gradients = this.getHistoryGradients()
    if (gradients.length === 0) {
      gradients.push([Colors.random(), Colors.random()])
      this.setHistoryGradients(gradients)
    }
    const gradient = gradients[gradients.length - 1]
    document.documentElement.style.setProperty('--thumb-color', gradient[0].formattedHex)

    const gradientRow = this.createDivInnerRow()
    const gradientSliders = this.createInputRangeSliders(0, 360, 1, 'Degrees', 0, 0, 100, 1, 'Percent', 0, gradientRow, gradient, '400px')

    const slidersColumn = this.createDivInnerColumn()
    gradientSliders.forEach(gradientSlider => {
      slidersColumn.appendChild(gradientSlider)
    })
    slidersColumn.appendChild(this.createButtonSwitchColors(gradient))

    const historyColumn = this.createDivInnerColumn()
    historyColumn.appendChild(createH2('History'))
    for (let index = 0; index < gradients.length; index++) {
      historyColumn.appendChild(this.buildGradientRow(gradients[index], 'linear', '0deg', '0%', null))
    }

    const examplesColumn = this.createDivInnerColumn()
    examplesColumn.appendChild(createH2('Examples'))
    for (let index = 0; index < 10; index++) {
      examplesColumn.appendChild(this.buildGradientRow([Colors.random(), Colors.random()], 'linear', '0deg', '0%', null))
    }

    const header = document.getElementById('header')
    header.replaceChildren()
    header.appendChild(this.buttonNavigation)
    header.appendChild(createH1('Gradient Picker'))

    const outerColumn = document.getElementById('outer-column')
    outerColumn.replaceChildren()
    outerColumn.appendChild(gradientRow)
    outerColumn.appendChild(slidersColumn)
    outerColumn.appendChild(historyColumn)
    outerColumn.appendChild(examplesColumn)

    let timeout = false
    window.addEventListener('scroll', () => {
      if (examplesColumn.children.length <= 991 && ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100)) {
        timeout = true
        setTimeout(() => {
          if (timeout === true) {
            for (let index = 0; index < 10; index++) {
              examplesColumn.appendChild(this.buildGradientRow([Colors.random(), Colors.random()], 'linear', '0deg', '0%', null))
            }
            timeout = false
          }
        }, 1000)
      }
    })
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 10)
  }

  getHistoryGradients() {
    const gradients = []
    let index = 0
    while (localStorage.getItem(`historyGradient${index}`) !== null) {
      const gradient = localStorage.getItem(`historyGradient${index++}`)
      gradients.push([Colors.createHex(gradient.split(':')[0]), Colors.createHex(gradient.split(':')[1])])
    }

    return gradients
  }

  setHistoryGradients(gradients) {
    let pos = 0
    for (let index = (gradients.length > 8 ? gradients.length - 8 : 0); index < gradients.length; index++) {
      localStorage.setItem(`historyGradient${pos++}`, `${gradients[index][0].formattedHex}:${gradients[index][1].formattedHex}`)
    }
    for (let index = (gradients.length > 8 ? 8 : gradients.length); index < 16; index++) {
      localStorage.removeItem(`historyGradient${index}`)
    }
  }

  createButtonSwitchColors(gradient) {
    const buttonSwitchColors = document.createElement('button')
    buttonSwitchColors.className = 'theme'
    buttonSwitchColors.innerText = 'Switch Colors'
    buttonSwitchColors.addEventListener('click', () => {
      this.updatePage([gradient[1], gradient[0]])
    })

    return buttonSwitchColors
  }

  createGradientRowPicked(gradient, type, value, position, height) {
    const gradientRow = this.buildGradientRow(gradient, type, value, position, height)
    gradientRow.style.maxWidth = '800px'

    return gradientRow
  }

  createDivColor(color) {
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
    divColor.appendChild(this.colorPicker.createColorPickerIcon(color, (color) => { }))
    divColor.appendChild(divMarker)

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

  createDivGradient(gradient, divColors, type, value, position) {
    const divGradient = document.createElement('div')
    divGradient.className = 'color'
    divGradient.style.backgroundColor = gradient[0].formattedHex
    divGradient.style.color = gradient[0].formattedText
    divGradient.style.background = gradient[0].formattedHex
    divGradient.style.background = `${type}-gradient(${value}, ${gradient[0].formattedHex} ${position}, ${gradient[1].formattedHex}`
    divGradient.style.background = `-moz-${type}-gradient(${value}, ${gradient[0].formattedHex} ${position}, ${gradient[1].formattedHex}`
    divGradient.style.background = `-webkit-${type}-gradient(${value}, ${gradient[0].formattedHex} ${position}, ${gradient[1].formattedHex}`

    const show = this.createDivColorIconCornerTriangle(gradient, divColors, divGradient)
    const openFullscreen = createDivGradientIconFullscreen(gradient, type, value, position)
    const load = this.createDivGradientIconCheckmark(gradient)
    const likeGradient = createDivGradientIconHeart(gradient)

    divGradient.appendChild(likeGradient)
    divGradient.appendChild(openFullscreen)
    divGradient.appendChild(load)
    divGradient.appendChild(show)
    divGradient.addEventListener('mouseenter', () => {
      likeGradient.style.display = 'block'
      openFullscreen.style.display = 'block'
      load.style.display = 'block'
      show.style.display = 'block'
      divGradient.style.boxShadow = `2px 2px ${divGradient.style.color} inset, -2px -2px ${divGradient.style.color} inset`
    })
    divGradient.addEventListener('mouseleave', () => {
      likeGradient.style.display = 'none'
      openFullscreen.style.display = 'none'
      load.style.display = 'none'
      show.style.display = 'none'
      divGradient.style.boxShadow = 'none'
    })
    divGradient.addEventListener('click', () => {
      likeGradient.style.display = 'block'
      openFullscreen.style.display = 'block'
      load.style.display = 'block'
      show.style.display = 'block'
      divGradient.style.boxShadow = `2px 2px ${divGradient.style.color} inset, -2px -2px ${divGradient.style.color} inset`
    })

    return divGradient
  }

  buildGradientRow(gradient, type, value, position, height) {
    const divColor01 = this.createDivColor(gradient[0])
    const divColor02 = this.createDivColor(gradient[1])
    const divGradient = this.createDivGradient(gradient, [divColor01, divColor02], type, value, position)

    if (height !== null) {
      divColor01.style.height = height
      divGradient.style.height = height
      divColor02.style.height = height
    }

    divColor01.style.display = 'none'
    divGradient.style.display = 'flex'
    divColor02.style.display = 'none'

    const divGradientRow = this.createDivColorRowSmall()
    divGradientRow.style.flex = 'none'
    divGradientRow.replaceChildren()
    divGradientRow.appendChild(divColor01)
    divGradientRow.appendChild(divGradient)
    divGradientRow.appendChild(divColor02)
    divGradientRow.addEventListener('mouseleave', () => {
      divColor01.style.display = 'none'
      divGradient.style.display = 'flex'
      divColor02.style.display = 'none'
    })

    return divGradientRow
  }

  createDivColorIconCornerTriangle(gradient, divColors, divGradient) {
    const divColorIcon = document.createElement('div')
    divColorIcon.className = 'color-icon'
    divColorIcon.style.backgroundImage = getBackgroundImage(gradient[0], 'corner-triangle')
    divColorIcon.style.bottom = '10px'
    divColorIcon.style.left = '10px'
    createDivTooltip(divColorIcon, 'show colors')
    divColorIcon.addEventListener('click', () => {
      divColors[0].style.display = 'flex'
      divGradient.style.display = 'none'
      divColors[1].style.display = 'flex'
    })

    return divColorIcon
  }

  createInputRangeSliders(min01, max01, step01, text01, value01, min02, max02, step02, text02, value02, row, gradient, height) {
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
        row.appendChild(this.createGradientRowPicked(gradient, 'linear', `${inputRangeSlider01.value}deg`, `${inputRangeSlider02.value}%`, height))
      } else {
        row.appendChild(this.createGradientRowPicked(gradient, 'radial', 'circle', `${inputRangeSlider02.value}%`, height))
      }
    })

    inputRangeSlider02.addEventListener('input', () => {
      h4Slider02.innerText = `${text02}: ${inputRangeSlider02.value}`
      row.replaceChildren()
      if (inputRangeSlider03.value === '0') {
        row.appendChild(this.createGradientRowPicked(gradient, 'linear', `${inputRangeSlider01.value}deg`, `${inputRangeSlider02.value}%`, height))
      } else {
        row.appendChild(this.createGradientRowPicked(gradient, 'radial', 'circle', `${inputRangeSlider02.value}%`, height))
      }
    })

    inputRangeSlider03.addEventListener('input', () => {
      h4Slider03.innerText = `Type: ${inputRangeSlider03.value === '0' ? 'linear' : 'radial'}`
      row.replaceChildren()
      if (inputRangeSlider03.value === '0') {
        row.appendChild(this.createGradientRowPicked(gradient, 'linear', `${inputRangeSlider01.value}deg`, `${inputRangeSlider02.value}%`, height))
      } else {
        row.appendChild(this.createGradientRowPicked(gradient, 'radial', 'circle', `${inputRangeSlider02.value}%`, height))
      }
    })

    const divSlider01 = document.createElement('div')
    divSlider01.className = 'slider'
    divSlider01.appendChild(h4Slider01)
    divSlider01.appendChild(inputRangeSlider01)

    const divSlider02 = document.createElement('div')
    divSlider02.className = 'slider'
    divSlider02.appendChild(h4Slider02)
    divSlider02.appendChild(inputRangeSlider02)

    const divSlider03 = document.createElement('div')
    divSlider03.className = 'slider'
    divSlider03.appendChild(h4Slider03)
    divSlider03.appendChild(inputRangeSlider03)

    row.replaceChildren()
    if (inputRangeSlider03.value === '0') {
      row.appendChild(this.createGradientRowPicked(gradient, 'linear', `${inputRangeSlider01.value}deg`, `${inputRangeSlider02.value}%`, height))
    } else {
      row.appendChild(this.createGradientRowPicked(gradient, 'radial', 'circle', `${inputRangeSlider02.value}%`, height))
    }

    return [divSlider01, divSlider02, divSlider03]
  }
}

export { GradientPickerPage }