import { Themes } from './themes.js'

class SideNavigation {

  constructor() {
    this.colorPickerPage = null
    this.gradientPickerPage = null
    this.favoritesPage = null
    this.themes = new Themes()
    this.themes.setTheme()
  }

  createA(href, innerText) {
    const a = document.createElement('a')
    a.href = href
    a.innerText = innerText

    return a
  }

  createButtonNavigation() {
    const sideNavigation = document.createElement('div')
    sideNavigation.className = 'side-navigation'

    const aColors = this.createA('javascript:void(0);', 'Color Picker')
    aColors.addEventListener('click', () => {
      sideNavigation.style.width = '0px'
      const tool = localStorage.getItem('tool')
      if (tool !== 'colorPicker') {
        this.colorPickerPage.createPage()
      }
    })

    const aGradients = this.createA('javascript:void(0);', 'Gradient Picker')
    aGradients.addEventListener('click', () => {
      sideNavigation.style.width = '0px'
      const tool = localStorage.getItem('tool')
      if (tool !== 'gradientPicker') {
        this.gradientPickerPage.createPage()
      }
    })

    const aFavorites = this.createA('javascript:void(0);', 'Favorites')
    aFavorites.addEventListener('click', () => {
      sideNavigation.style.width = '0px'
      const tool = localStorage.getItem('tool')
      if (tool !== 'favorites') {
        this.favoritesPage.createPage()
      }
    })

    const buttonTheme = this.themes.createButtonTheme(true)
    buttonTheme.style.position = 'absolute'
    buttonTheme.style.bottom = '20px'
    buttonTheme.style.left = '20px'

    sideNavigation.appendChild(aColors)
    sideNavigation.appendChild(aGradients)
    sideNavigation.appendChild(aFavorites)
    sideNavigation.appendChild(buttonTheme)
    document.body.appendChild(sideNavigation)

    const buttonNavigation = document.createElement('button')
    buttonNavigation.className = 'theme'
    buttonNavigation.innerText = '\u2630'
    buttonNavigation.style.fontSize = '24px'
    buttonNavigation.addEventListener('click', event => {
      event.stopPropagation()
      if (sideNavigation.style.width === '300px') {
        sideNavigation.style.width = '0px'
      } else {
        sideNavigation.style.width = '300px'
      }
    })

    document.addEventListener('click', event => {
      if (sideNavigation.style.width === '300px') {
        if (!sideNavigation.contains(event.target)) {
          sideNavigation.style.width = '0px'
        }
      }
    })

    return buttonNavigation
  }
}

export { SideNavigation }