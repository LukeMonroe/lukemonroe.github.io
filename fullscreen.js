import { createDivTooltip } from './tooltips.js'
import { createDivColorText } from './text.js'
import { getBackgroundImage } from './images.js'
import { createDivColorIconHeart, createDivGradientIconHeart } from './favorites.js'

function createDivColorIconFullscreen(color) {
  const divColorIcon = document.createElement('div')
  divColorIcon.className = 'color-icon'
  divColorIcon.style.backgroundImage = getBackgroundImage(color, 'fullscreen')
  divColorIcon.style.top = '10px'
  divColorIcon.style.right = '10px'
  createDivTooltip(divColorIcon, 'fullscreen')
  divColorIcon.addEventListener('click', () => {
    document.body.appendChild(createDivColorFullscreen(color))
    document.body.style.overflow = 'hidden'
  })

  return divColorIcon
}

function createDivColorFullscreen(color) {
  const divColorFullscreen = document.createElement('div')
  divColorFullscreen.className = 'color-fullscreen'
  divColorFullscreen.style.backgroundColor = color.formattedHex
  divColorFullscreen.style.color = color.formattedText
  divColorFullscreen.style.height = '100%'
  divColorFullscreen.style.width = '100%'
  divColorFullscreen.appendChild(createDivColorText(color.formattedHex))
  divColorFullscreen.appendChild(createDivColorText(color.formattedRGB))
  divColorFullscreen.appendChild(createDivColorText(color.formattedHSL))
  divColorFullscreen.appendChild(createDivColorText(color.formattedHSV))
  divColorFullscreen.appendChild(createDivColorText(color.formattedCMYK))
  divColorFullscreen.appendChild(createDivColorText(color.formattedCRWhite))
  divColorFullscreen.appendChild(createDivColorText(color.formattedCRBlack))
  divColorFullscreen.appendChild(createDivColorIconHeart(divColorFullscreen, color))
  divColorFullscreen.appendChild(createDivColorIconFullscreenExit(color, divColorFullscreen))
  divColorFullscreen.addEventListener('dblclick', () => {
    document.body.removeChild(divColorFullscreen)
    document.body.style.overflow = 'auto'
  })
  const children = divColorFullscreen.children
  for (let index = 0; index < children.length; index++) {
    children[index].style.display = 'block'
  }

  return divColorFullscreen
}

function createDivColorIconFullscreenExit(color, divColorFullscreen) {
  const divColorIcon = document.createElement('div')
  divColorIcon.className = 'color-icon'
  divColorIcon.style.backgroundImage = getBackgroundImage(color, 'fullscreen')
  divColorIcon.style.top = '10px'
  divColorIcon.style.right = '10px'
  createDivTooltip(divColorIcon, 'fullscreen')
  divColorIcon.addEventListener('click', () => {
    document.body.removeChild(divColorFullscreen)
    document.body.style.overflow = 'auto'
  })

  return divColorIcon
}

function createDivGradientIconFullscreen(background, colors) {
  const divGradientIcon = document.createElement('div')
  divGradientIcon.className = 'color-icon'
  divGradientIcon.style.backgroundImage = getBackgroundImage(colors[colors.length - 1], 'fullscreen')
  divGradientIcon.style.top = '10px'
  divGradientIcon.style.right = '10px'
  createDivTooltip(divGradientIcon, 'fullscreen')
  divGradientIcon.addEventListener('click', () => {
    document.body.appendChild(createDivGradientFullscreen(background, colors))
    document.body.style.overflow = 'hidden'
  })

  return divGradientIcon
}

function createDivGradientFullscreen(background, colors) {
  const divGradientFullscreen = document.createElement('div')
  divGradientFullscreen.className = 'color-fullscreen'
  divGradientFullscreen.style.backgroundColor = colors[0].formattedHex
  divGradientFullscreen.style.background = background
  divGradientFullscreen.style.color = colors[0].formattedText
  divGradientFullscreen.style.height = '100%'
  divGradientFullscreen.style.width = '100%'
  divGradientFullscreen.appendChild(createDivColorText(background))
  divGradientFullscreen.appendChild(createDivGradientIconHeart(divGradientFullscreen, background, colors))
  divGradientFullscreen.appendChild(createDivGradientIconFullscreenExit(colors, divGradientFullscreen))
  divGradientFullscreen.addEventListener('dblclick', () => {
    document.body.removeChild(divGradientFullscreen)
    document.body.style.overflow = 'auto'
  })
  const children = divGradientFullscreen.children
  for (let index = 0; index < children.length; index++) {
    children[index].style.display = 'block'
  }

  return divGradientFullscreen
}

function createDivGradientIconFullscreenExit(colors, divGradientFullscreen) {
  const divGradientIcon = document.createElement('div')
  divGradientIcon.className = 'color-icon'
  divGradientIcon.style.backgroundImage = getBackgroundImage(colors[colors.length - 1], 'fullscreen')
  divGradientIcon.style.top = '10px'
  divGradientIcon.style.right = '10px'
  createDivTooltip(divGradientIcon, 'fullscreen')
  divGradientIcon.addEventListener('click', () => {
    document.body.removeChild(divGradientFullscreen)
    document.body.style.overflow = 'auto'
  })

  return divGradientIcon
}

export { createDivColorIconFullscreen, createDivGradientIconFullscreen }