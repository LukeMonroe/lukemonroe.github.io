import { ColorPickerThemes } from './color-picker-themes.js'
import { ColorPickerPage } from './color-picker-page.js'
import { GradientPickerPage } from './gradient-picker-page.js'
import { FavoritesPage } from './favorites-page.js'

function createA(href, innerText) {
  const a = document.createElement('a')
  a.href = href
  a.innerText = innerText

  return a
}

function createButtonNavigation() {
  const navigation = createNavigation()
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

function createNavigation() {
  const navigation = document.createElement('div')
  navigation.className = 'side-navigation'
  const aColors = createA('javascript:void(0);', 'Color Picker')
  aColors.addEventListener('click', () => {
    navigation.style.width = '0px'
    const colorPickerPage = new ColorPickerPage()
    colorPickerPage.createPage()
  })
  const aGradients = createA('javascript:void(0);', 'Gradient Picker')
  aGradients.addEventListener('click', () => {
    navigation.style.width = '0px'
    const gradientPickerPage = new GradientPickerPage()
    gradientPickerPage.createPage()
  })
  const aLikedColors = createA('javascript:void(0);', 'Favorites')
  aLikedColors.addEventListener('click', () => {
    navigation.style.width = '0px'
    const favoritesPage = new FavoritesPage()
    favoritesPage.createPage()
  })
  navigation.appendChild(aColors)
  navigation.appendChild(aGradients)
  navigation.appendChild(aLikedColors)
  navigation.appendChild(createButtonTheme())

  return navigation
}

function createButtonTheme() {
  const themes = new ColorPickerThemes()
  themes.setTheme()

  const buttonTheme = themes.createButtonTheme(true)
  buttonTheme.style.position = 'absolute'
  buttonTheme.style.bottom = '20px'
  buttonTheme.style.left = '20px'

  return buttonTheme
}

export { createButtonNavigation }