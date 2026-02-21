import { Colors } from './colors.js'
import { getBackgroundImage } from './images.js'
import { createDivTooltip } from './tooltips.js'

function isColorLiked(color) {
  for (let likedColor of getLikedColors()) {
    if (Colors.equal(likedColor, color)) {
      return true
    }
  }

  return false
}

function updateLikedColors(color) {
  const favoritesPageData = localStorage.getItem('favoritesPageData') !== null ? JSON.parse(localStorage.getItem('favoritesPageData')) : { colors: [], gradients: [] }
  isColorLiked(color) ? null : favoritesPageData.colors.push(color)
  setLikedColors(favoritesPageData)
}

function getLikedColors() {
  const favoritesPageData = localStorage.getItem('favoritesPageData') !== null ? JSON.parse(localStorage.getItem('favoritesPageData')) : { colors: [], gradients: [] }
  setLikedColors(favoritesPageData)

  return favoritesPageData.colors
}

function setLikedColors(favoritesPageData) {
  localStorage.setItem('favoritesPageData', JSON.stringify(favoritesPageData))
}

function isGradientLiked(colors) {
  for (let likedGradient of getLikedGradients()) {
    if (likedGradient.every((likedColor, index) => likedGradient.length === colors.length && Colors.equal(likedColor, colors[index]))) {
      return true
    }
  }

  return false
}

function updateLikedGradients(colors) {
  const favoritesPageData = localStorage.getItem('favoritesPageData') !== null ? JSON.parse(localStorage.getItem('favoritesPageData')) : { colors: [], gradients: [] }
  isGradientLiked(colors) ? null : favoritesPageData.gradients.push(colors)
  setLikedGradients(favoritesPageData)
}

function getLikedGradients() {
  const favoritesPageData = localStorage.getItem('favoritesPageData') !== null ? JSON.parse(localStorage.getItem('favoritesPageData')) : { colors: [], gradients: [] }
  setLikedGradients(favoritesPageData)

  return favoritesPageData.gradients
}

function setLikedGradients(favoritesPageData) {
  localStorage.setItem('favoritesPageData', JSON.stringify(favoritesPageData))
}

function createDivColorIconHeart(color) {
  const divColorIcon = document.createElement('div')
  divColorIcon.className = 'color-icon'
  divColorIcon.style.backgroundImage = isColorLiked(color) ? getBackgroundImage(color, 'heart-filled') : getBackgroundImage(color, 'heart-empty')
  divColorIcon.style.top = '10px'
  divColorIcon.style.left = '10px'
  createDivTooltip(divColorIcon, 'favorite')
  divColorIcon.addEventListener('click', event => {
    divColorIcon.style.backgroundImage = isColorLiked(color) ? getBackgroundImage(color, 'heart-empty') : getBackgroundImage(color, 'heart-filled')
    updateLikedColors(color)
  })

  return divColorIcon
}

function createDivGradientIconHeart(colors) {
  const divGradientIcon = document.createElement('div')
  divGradientIcon.className = 'color-icon'
  divGradientIcon.style.backgroundImage = isGradientLiked(colors) ? getBackgroundImage(colors[0], 'heart-filled') : getBackgroundImage(colors[0], 'heart-empty')
  divGradientIcon.style.top = '10px'
  divGradientIcon.style.left = '10px'
  createDivTooltip(divGradientIcon, 'favorite')
  divGradientIcon.addEventListener('click', event => {
    divGradientIcon.style.backgroundImage = isGradientLiked(colors) ? getBackgroundImage(colors[0], 'heart-empty') : getBackgroundImage(colors[0], 'heart-filled')
    updateLikedGradients(colors)
  })

  return divGradientIcon
}

export { createDivColorIconHeart, createDivGradientIconHeart, getLikedColors, isColorLiked, getLikedGradients, isGradientLiked }