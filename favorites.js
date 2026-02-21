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

function isGradientLiked(background, colors) {
  for (let likedGradient of getLikedGradients()) {
    if (likedGradient.background === background) {
      return true
    }
  }

  return false
}

function setLikedColors(color) {
  const favoritesPageData = localStorage.getItem('favoritesPageData') !== null ? JSON.parse(localStorage.getItem('favoritesPageData')) : { colors: [], gradients: [] }
  isColorLiked(color) ? null : favoritesPageData.colors.push(color)
  localStorage.setItem('favoritesPageData', JSON.stringify(favoritesPageData))
}

function setLikedGradients(background, colors) {
  const favoritesPageData = localStorage.getItem('favoritesPageData') !== null ? JSON.parse(localStorage.getItem('favoritesPageData')) : { colors: [], gradients: [] }
  isGradientLiked(background, colors) ? null : favoritesPageData.gradients.push({ background: background, colors: colors })
  localStorage.setItem('favoritesPageData', JSON.stringify(favoritesPageData))
}

function getLikedColors() {
  return (localStorage.getItem('favoritesPageData') !== null ? JSON.parse(localStorage.getItem('favoritesPageData')) : { colors: [], gradients: [] }).colors
}

function getLikedGradients() {
  return (localStorage.getItem('favoritesPageData') !== null ? JSON.parse(localStorage.getItem('favoritesPageData')) : { colors: [], gradients: [] }).gradients
}

function createDivColorIconHeart(divColor, color) {
  const currentBackgroundImage = (divColorIcon, color) => {
    divColorIcon.style.backgroundImage = isColorLiked(color) ? getBackgroundImage(color, 'heart-filled') : getBackgroundImage(color, 'heart-empty')
  }
  const toggleBackgroundImage = (divColorIcon, color) => {
    divColorIcon.style.backgroundImage = isColorLiked(color) ? getBackgroundImage(color, 'heart-empty') : getBackgroundImage(color, 'heart-filled')
    setLikedColors(color)
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
  const currentBackgroundImage = (divGradientIcon, background, colors) => {
    divGradientIcon.style.backgroundImage = isGradientLiked(background, colors) ? getBackgroundImage(colors[0], 'heart-filled') : getBackgroundImage(colors[0], 'heart-empty')
  }
  const toggleBackgroundImage = (divGradientIcon, background, colors) => {
    divGradientIcon.style.backgroundImage = isGradientLiked(background, colors) ? getBackgroundImage(colors[0], 'heart-empty') : getBackgroundImage(colors[0], 'heart-filled')
    setLikedGradients(background, colors)
  }

  const divGradientIcon = document.createElement('div')
  divGradientIcon.className = 'color-icon'
  divGradientIcon.style.top = '10px'
  divGradientIcon.style.left = '10px'
  currentBackgroundImage(divGradientIcon, background, colors)
  createDivTooltip(divGradientIcon, 'favorite')
  divGradientIcon.addEventListener('click', event => { toggleBackgroundImage(divGradientIcon, background, colors) })
  divGradient.addEventListener('mouseenter', event => { currentBackgroundImage(divGradientIcon, background, colors) })
  divGradient.addEventListener('click', event => { currentBackgroundImage(divGradientIcon, background, colors) })

  return divGradientIcon
}

export { createDivColorIconHeart, createDivGradientIconHeart, getLikedColors, getLikedGradients }