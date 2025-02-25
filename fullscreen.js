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
  divColorFullscreen.appendChild(createDivColorIconHeart(color))
  divColorFullscreen.appendChild(createDivColorIconFullscreenExit(color, divColorFullscreen))
  divColorFullscreen.addEventListener('dblclick', () => {
    document.body.removeChild(divColorFullscreen)
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
  })

  return divColorIcon
}

function createDivGradientIconFullscreen(gradient, type, value, position) {
  const divGradientIcon = document.createElement('div')
  divGradientIcon.className = 'color-icon'
  divGradientIcon.style.backgroundImage = getBackgroundImage(gradient[1], 'fullscreen')
  divGradientIcon.style.top = '10px'
  divGradientIcon.style.right = '10px'
  createDivTooltip(divGradientIcon, 'fullscreen')
  divGradientIcon.addEventListener('click', () => {
    document.body.appendChild(createDivGradientFullscreen(gradient, type, value, position))
  })

  return divGradientIcon
}

function createDivGradientFullscreen(gradient, type, value, position) {
  const divGradientFullscreen = document.createElement('div')
  divGradientFullscreen.className = 'color-fullscreen'
  divGradientFullscreen.style.backgroundColor = gradient[0].formattedHex
  divGradientFullscreen.style.color = gradient[0].formattedText
  divGradientFullscreen.style.height = '100%'
  divGradientFullscreen.style.width = '100%'
  divGradientFullscreen.style.background = gradient[0].formattedHex
  divGradientFullscreen.style.background = `${type}-gradient(${value}, ${gradient[0].formattedHex} ${position}, ${gradient[1].formattedHex}`
  divGradientFullscreen.style.background = `-moz-${type}-gradient(${value}, ${gradient[0].formattedHex} ${position}, ${gradient[1].formattedHex}`
  divGradientFullscreen.style.background = `-webkit-${type}-gradient(${value}, ${gradient[0].formattedHex} ${position}, ${gradient[1].formattedHex}`
  divGradientFullscreen.appendChild(createDivGradientIconHeart(gradient))
  divGradientFullscreen.appendChild(createDivGradientIconFullscreenExit(gradient, divGradientFullscreen))
  divGradientFullscreen.addEventListener('dblclick', () => {
    document.body.removeChild(divGradientFullscreen)
  })
  const children = divGradientFullscreen.children
  for (let index = 0; index < children.length; index++) {
    children[index].style.display = 'block'
  }

  return divGradientFullscreen
}

function createDivGradientIconFullscreenExit(gradient, divGradientFullscreen) {
  const divGradientIcon = document.createElement('div')
  divGradientIcon.className = 'color-icon'
  divGradientIcon.style.backgroundImage = getBackgroundImage(gradient[1], 'fullscreen')
  divGradientIcon.style.top = '10px'
  divGradientIcon.style.right = '10px'
  createDivTooltip(divGradientIcon, 'fullscreen')
  divGradientIcon.addEventListener('click', () => {
    document.body.removeChild(divGradientFullscreen)
  })

  return divGradientIcon
}

export { createDivColorIconFullscreen, createDivGradientIconFullscreen }