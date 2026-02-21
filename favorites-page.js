import { getLikedColors, getLikedGradients } from './favorites.js'
import { createH1, createH3 } from './text.js'

class FavoritesPage {

  constructor(buttonNavigation, colorPickerPage, gradientPickerPage) {
    this.buttonNavigation = buttonNavigation
    this.colorPickerPage = colorPickerPage
    this.gradientPickerPage = gradientPickerPage
  }

  createPage() {
    localStorage.setItem('tool', 'favorites')

    const divFavoritesGrid = document.createElement('div')
    divFavoritesGrid.className = 'color-grid'
    getLikedColors().forEach(likedColor => {
      const divColor = this.colorPickerPage.createDivColor(likedColor, false, true)
      divColor.style.height = '400px'
      divColor.style.maxWidth = '400px'
      divFavoritesGrid.appendChild(divColor)
    })
    getLikedGradients().forEach(likedGradient => {
      const divGradient = this.gradientPickerPage.createDivGradient(likedGradient.colors, true, true, likedGradient.background)
      divGradient.style.height = '400px'
      divGradient.style.maxWidth = '400px'
      divFavoritesGrid.appendChild(divGradient)
    })

    const favoritesColumn = document.createElement('div')
    favoritesColumn.style.maxWidth = 'none'
    favoritesColumn.className = 'inner-column'
    favoritesColumn.appendChild(divFavoritesGrid)

    const header = document.getElementById('header')
    header.replaceChildren()
    header.appendChild(this.buttonNavigation)
    header.appendChild(createH1('Favorites'))

    const outerColumn = document.getElementById('outer-column')
    outerColumn.replaceChildren()
    outerColumn.appendChild(favoritesColumn)

    setTimeout(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, 10)
  }
}

export { FavoritesPage }