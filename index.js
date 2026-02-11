import { ColorPickerPage } from './color-picker-page.js'
import { GradientPickerPage } from './gradient-picker-page.js'
import { GradientPickerPageNew } from './gradient-picker-page-new.js'
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
const gradientPickerPageNew = new GradientPickerPageNew(buttonNavigation, colorPicker, imagePicker)
const favoritesPage = new FavoritesPage(buttonNavigation, colorPicker)

sideNavigation.colorPickerPage = colorPickerPage
sideNavigation.gradientPickerPage = gradientPickerPage
sideNavigation.gradientPickerPageNew = gradientPickerPageNew
sideNavigation.favoritesPage = favoritesPage

const tool = localStorage.getItem('tool')
if (tool === null || tool === 'colorPicker') {
  colorPickerPage.createPage()
} else if (tool === 'gradientPicker') {
  gradientPickerPage.createPage()
} else if (tool === 'gradientPickerNew') {
  gradientPickerPageNew.createPage()
} else {
  favoritesPage.createPage()
}