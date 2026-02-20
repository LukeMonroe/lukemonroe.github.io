import { ColorPickerPage } from './color-picker-page.js'
import { ExploreColorsPage } from './explore-colors-page.js'
import { ExploreGradientsPage } from './explore-gradient-page.js'
import { FavoritesPage } from './favorites-page.js'
import { ColorPicker } from './color-picker.js'
import { ImagePicker } from './image-picker.js'
import { SideNavigation } from './navigation.js'

document.addEventListener('dblclick', event => { event.preventDefault() })

const sideNavigation = new SideNavigation()
const buttonNavigation = sideNavigation.createButtonNavigation()
const colorPicker = new ColorPicker()
const imagePicker = new ImagePicker()

const colorPickerPage = new ColorPickerPage(buttonNavigation, colorPicker, imagePicker, false)
const gradientPickerPage = new ColorPickerPage(buttonNavigation, colorPicker, imagePicker, true)
const exploreColorsPage = new ExploreColorsPage(buttonNavigation, colorPickerPage)
const exploreGradientsPage = new ExploreGradientsPage(buttonNavigation, colorPickerPage)
const favoritesPage = new FavoritesPage(buttonNavigation, colorPicker)

sideNavigation.colorPickerPage = colorPickerPage
sideNavigation.gradientPickerPage = gradientPickerPage
sideNavigation.exploreColorsPage = exploreColorsPage
sideNavigation.exploreGradientsPage = exploreGradientsPage
sideNavigation.favoritesPage = favoritesPage

const tool = localStorage.getItem('tool')
if (tool === null || tool === 'colorPicker') {
  colorPickerPage.createPage()
} else if (tool === 'gradientPicker') {
  gradientPickerPage.createPage()
} else if (tool === 'exploreColors') {
  exploreColorsPage.createPage()
} else if (tool === 'exploreGradients') {
  exploreGradientsPage.createPage()
} else {
  favoritesPage.createPage()
}