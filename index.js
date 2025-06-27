import { ColorPickerPage } from './color-picker-page.js'
import { GradientPickerPage } from './gradient-picker-page.js'
import { FavoritesPage } from './favorites-page.js'
import { ColorPicker } from './color-picker.js'
import { ButtonNavigation } from './navigation.js'

document.addEventListener('dblclick', event => { event.preventDefault() })

const buttonNavigation = new ButtonNavigation()
const createButtonNavigation = buttonNavigation.createButtonNavigation()
const colorPicker = new ColorPicker()

const colorPickerPage = new ColorPickerPage(createButtonNavigation, colorPicker)
const gradientPickerPage = new GradientPickerPage(createButtonNavigation, colorPicker)
const favoritesPage = new FavoritesPage(createButtonNavigation, colorPicker)

buttonNavigation.colorPickerPage = colorPickerPage
buttonNavigation.gradientPickerPage = gradientPickerPage
buttonNavigation.favoritesPage = favoritesPage

const tool = localStorage.getItem('tool')
if (tool === null || tool === 'colorPicker') {
  colorPickerPage.createPage()
} else if (tool === 'gradientPicker') {
  gradientPickerPage.createPage()
} else {
  favoritesPage.createPage()
}