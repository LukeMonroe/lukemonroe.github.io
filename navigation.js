import { Themes } from './themes.js'

class SideNavigation {

  constructor() {
    this.colorPickerPage = null
    this.gradientPickerPage = null
    this.gradientPickerPageNew = null
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

    const aGradientsNew = this.createA('javascript:void(0);', 'Gradient Picker New')
    aGradientsNew.addEventListener('click', () => {
      sideNavigation.style.width = '0px'
      const tool = localStorage.getItem('tool')
      if (tool !== 'gradientPickerNew') {
        this.gradientPickerPageNew.createPage()
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

    const selectTheme = this.themes.createSelectTheme(true)
    selectTheme.style.width = '260px'
    selectTheme.style.margin = '30px 0px 0px 30px'

    sideNavigation.appendChild(selectTheme)
    sideNavigation.appendChild(aColors)
    sideNavigation.appendChild(aGradients)
    sideNavigation.appendChild(aGradientsNew)
    sideNavigation.appendChild(aFavorites)
    document.body.appendChild(sideNavigation)

    const buttonNavigation = document.createElement('button')
    buttonNavigation.className = 'theme'
    buttonNavigation.innerText = '\u2630'
    buttonNavigation.style.fontSize = '24px'
    buttonNavigation.addEventListener('click', event => {
      event.stopPropagation()
      if (sideNavigation.style.width === '320px') {
        sideNavigation.style.width = '0px'
      } else {
        sideNavigation.style.width = '320px'
      }
    })

    document.addEventListener('click', event => {
      if (sideNavigation.style.width === '320px') {
        if (!sideNavigation.contains(event.target)) {
          sideNavigation.style.width = '0px'
        }
      }
    })

    return buttonNavigation
  }
}

export { SideNavigation }