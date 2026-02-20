import { ColorPickerPage } from './color-picker-page.js'
import { GradientPickerPage } from './gradient-picker-page.js'
import { ExploreColorsPage } from './explore-colors-page.js'
import { FavoritesPage } from './favorites-page.js'
import { ColorPicker } from './color-picker.js'
import { ImagePicker } from './image-picker.js'
import { SideNavigation } from './navigation.js'

document.addEventListener('dblclick', event => { event.preventDefault() })

const sideNavigation = new SideNavigation()
const buttonNavigation = sideNavigation.createButtonNavigation()
const colorPicker = new ColorPicker()
const imagePicker = new ImagePicker()

const colorPickerPage = new ColorPickerPage(buttonNavigation, colorPicker, imagePicker)
const gradientPickerPage = new GradientPickerPage(buttonNavigation, colorPicker)
const exploreColorsPage = new ExploreColorsPage(buttonNavigation, colorPickerPage)
const favoritesPage = new FavoritesPage(buttonNavigation, colorPicker)

sideNavigation.colorPickerPage = colorPickerPage
sideNavigation.gradientPickerPage = gradientPickerPage
sideNavigation.exploreColorsPage = exploreColorsPage
sideNavigation.favoritesPage = favoritesPage

const tool = localStorage.getItem('tool')
if (tool === null || tool === 'colorPicker') {
  colorPickerPage.createPage()
} else if (tool === 'gradientPicker') {
  gradientPickerPage.createPage()
} else if (tool === 'exploreColors') {
  exploreColorsPage.createPage()
} else {
  favoritesPage.createPage()
}