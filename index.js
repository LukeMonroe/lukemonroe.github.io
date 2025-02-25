import { ColorPickerPage } from './color-picker-page.js'
import { GradientPickerPage } from './gradient-picker-page.js'
import { FavoritesPage } from './favorites-page.js'

document.addEventListener('dblclick', event => { event.preventDefault() })

const tool = localStorage.getItem('tool')
if (tool === null || tool === 'colorPicker') {
  const colorPickerPage = new ColorPickerPage()
  colorPickerPage.createPage()
} else if (tool === 'gradientPicker') {
  const gradientPickerPage = new GradientPickerPage()
  gradientPickerPage.createPage()
} else {
  const favoritesPage = new FavoritesPage()
  favoritesPage.createPage()
}