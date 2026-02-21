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

function isGradientLiked(colors) {
  for (let likedGradient of getLikedGradients()) {
    if (likedGradient.every((likedColor, index) => likedGradient.length === colors.length && Colors.equal(likedColor, colors[index]))) {
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

function updateLikedGradients(background, colors) {
  const favoritesPageData = localStorage.getItem('favoritesPageData') !== null ? JSON.parse(localStorage.getItem('favoritesPageData')) : { colors: [], gradients: [] }
  isGradientLiked(colors) ? null : favoritesPageData.gradients.push(colors)
  setLikedGradients(favoritesPageData)
}

function setLikedColors(favoritesPageData) {
  localStorage.setItem('favoritesPageData', JSON.stringify(favoritesPageData))
}

function setLikedGradients(favoritesPageData) {
  localStorage.setItem('favoritesPageData', JSON.stringify(favoritesPageData))
}

function getLikedColors() {
  const favoritesPageData = localStorage.getItem('favoritesPageData') !== null ? JSON.parse(localStorage.getItem('favoritesPageData')) : { colors: [], gradients: [] }
  setLikedColors(favoritesPageData)

  return favoritesPageData.colors
}

function getLikedGradients() {
  const favoritesPageData = localStorage.getItem('favoritesPageData') !== null ? JSON.parse(localStorage.getItem('favoritesPageData')) : { colors: [], gradients: [] }
  setLikedGradients(favoritesPageData)

  return favoritesPageData.gradients
}

function createDivColorIconHeart(divColor, color) {
  const currentBackgroundImage = (divColorIcon, color) => {
    divColorIcon.style.backgroundImage = isColorLiked(color) ? getBackgroundImage(color, 'heart-filled') : getBackgroundImage(color, 'heart-empty')
  }
  const toggleBackgroundImage = (divColorIcon, color) => {
    divColorIcon.style.backgroundImage = isColorLiked(color) ? getBackgroundImage(color, 'heart-empty') : getBackgroundImage(color, 'heart-filled')
    updateLikedColors(color)
  }

  const divColorIcon = document.createElement('div')
  divColorIcon.className = 'color-icon'
  divColorIcon.style.top = '10px'
  divColorIcon.style.left = '10px'
  currentBackgroundImage(divColorIcon, color)
  createDivTooltip(divColorIcon, 'favorite')
  divColorIcon.addEventListener('click', event => { toggleBackgroundImage(divColorIcon, color) })
  divColor.addEventListener('mouseenter', event => { currentBackgroundImage(divColorIcon, color) })
  divColor.addEventListener('click', event => { currentBackgroundImage(divColorIcon, color) })

  return divColorIcon
}

function createDivGradientIconHeart(divGradient, background, colors) {
  const currentBackgroundImage = (divGradientIcon, colors) => {
    divGradientIcon.style.backgroundImage = isGradientLiked(colors) ? getBackgroundImage(colors[0], 'heart-filled') : getBackgroundImage(colors[0], 'heart-empty')
  }
  const toggleBackgroundImage = (divGradientIcon, background, colors) => {
    divGradientIcon.style.backgroundImage = isGradientLiked(colors) ? getBackgroundImage(colors[0], 'heart-empty') : getBackgroundImage(colors[0], 'heart-filled')
    updateLikedGradients(background, colors)
  }

  const divGradientIcon = document.createElement('div')
  divGradientIcon.className = 'color-icon'
  divGradientIcon.style.top = '10px'
  divGradientIcon.style.left = '10px'
  currentBackgroundImage(divGradientIcon, colors)
  createDivTooltip(divGradientIcon, 'favorite')
  divGradientIcon.addEventListener('click', event => { toggleBackgroundImage(divGradientIcon, background, colors) })
  divGradient.addEventListener('mouseenter', event => { currentBackgroundImage(divGradientIcon, colors) })
  divGradient.addEventListener('click', event => { currentBackgroundImage(divGradientIcon, colors) })

  return divGradientIcon
}

export { createDivColorIconHeart, createDivGradientIconHeart, getLikedColors, getLikedGradients }