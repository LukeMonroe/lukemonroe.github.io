import { ColorPickerThemes } from './color-picker-themes.js'

class ButtonNavigation {

  constructor() {
    this.colorPickerPage = null
    this.gradientPickerPage = null
    this.favoritesPage = null
  }

  createA(href, innerText) {
    const a = document.createElement('a')
    a.href = href
    a.innerText = innerText

    return a
  }

  createButtonNavigation() {
    const navigation = this.createNavigation()
    const buttonNavigation = document.createElement('button')
    buttonNavigation.className = 'theme'
    buttonNavigation.innerText = '\u2630'
    buttonNavigation.style.fontSize = '24px'
    buttonNavigation.addEventListener('click', event => {
      event.stopPropagation()
      navigation.style.width = '300px'
    })

    document.addEventListener('click', event => {
      if (navigation.style.width === '300px') {
        if (!navigation.contains(event.target)) {
          navigation.style.width = '0px'
        }
      }
    })
    document.body.appendChild(navigation)

    return buttonNavigation
  }

  createNavigation() {
    const navigation = document.createElement('div')
    navigation.className = 'side-navigation'
    const aColors = this.createA('javascript:void(0);', 'Color Picker')
    aColors.addEventListener('click', () => {
      navigation.style.width = '0px'
      this.colorPickerPage.createPage()
    })
    const aGradients = this.createA('javascript:void(0);', 'Gradient Picker')
    aGradients.addEventListener('click', () => {
      navigation.style.width = '0px'
      this.gradientPickerPage.createPage()
    })
    const aLikedColors = this.createA('javascript:void(0);', 'Favorites')
    aLikedColors.addEventListener('click', () => {
      navigation.style.width = '0px'
      this.favoritesPage.createPage()
    })
    navigation.appendChild(aColors)
    navigation.appendChild(aGradients)
    navigation.appendChild(aLikedColors)
    navigation.appendChild(this.createButtonTheme())

    return navigation
  }

  createButtonTheme() {
    const themes = new ColorPickerThemes()
    themes.setTheme()

    const buttonTheme = themes.createButtonTheme(true)
    buttonTheme.style.position = 'absolute'
    buttonTheme.style.bottom = '20px'
    buttonTheme.style.left = '20px'

    return buttonTheme
  }
}

export { ButtonNavigation }