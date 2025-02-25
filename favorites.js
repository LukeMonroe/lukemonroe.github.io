import { Colors } from './colors.js'
import { getBackgroundImage } from './images.js'
import { createDivTooltip } from './tooltips.js'

function createDivColorIconHeart(color) {
  const divColorIcon = document.createElement('div')
  divColorIcon.className = 'color-icon'
  divColorIcon.style.backgroundImage = isColorLiked(color) ? getBackgroundImage(color, 'heart-filled') : getBackgroundImage(color, 'heart-empty')
  divColorIcon.style.top = '10px'
  divColorIcon.style.left = '10px'
  createDivTooltip(divColorIcon, 'favorite')
  divColorIcon.addEventListener('click', () => {
    let colors = getLikedColors()
    let colorIndex = null
    for (let index = 0; index < colors.length; index++) {
      if (Colors.equal(colors[index], color)) {
        colorIndex = index
        break
      }
    }
    if (colorIndex === null) {
      divColorIcon.style.backgroundImage = getBackgroundImage(color, 'heart-filled')
      colors.push(color)
    } else {
      divColorIcon.style.backgroundImage = getBackgroundImage(color, 'heart-empty')
      colors.splice(colorIndex, 1)
    }
    setLikedColors(colors)
  })

  return divColorIcon
}

function getLikedColors() {
  const colors = []
  let index = 0
  while (localStorage.getItem(`likedColor${index}`) !== null) {
    colors.push(Colors.createHex(localStorage.getItem(`likedColor${index++}`)))
  }

  return colors
}

function isColorLiked(color) {
  const colors = getLikedColors()
  for (let index = 0; index < colors.length; index++) {
    if (Colors.equal(colors[index], color)) {
      return true
    }
  }

  return false
}

function setLikedColors(colors) {
  let pos = 0
  for (let index = (colors.length > 100 ? colors.length - 100 : 0); index < colors.length; index++) {
    localStorage.setItem(`likedColor${pos++}`, colors[index].formattedHex)
  }
  for (let index = (colors.length > 100 ? 100 : colors.length); index < 200; index++) {
    localStorage.removeItem(`likedColor${index}`)
  }
}

function createDivGradientIconHeart(gradient) {
  const divColorIcon = document.createElement('div')
  divColorIcon.className = 'color-icon'
  divColorIcon.style.backgroundImage = isGradientLiked(gradient) ? getBackgroundImage(gradient[0], 'heart-filled') : getBackgroundImage(gradient[0], 'heart-empty')
  divColorIcon.style.top = '10px'
  divColorIcon.style.left = '10px'
  createDivTooltip(divColorIcon, 'favorite')
  divColorIcon.addEventListener('click', () => {
    let gradients = getLikedGradients()
    let gradientIndex = null
    for (let index = 0; index < gradients.length; index++) {
      if (Colors.equal(gradients[index][0], gradient[0]) && Colors.equal(gradients[index][1], gradient[1])) {
        gradientIndex = index
        break
      }
    }
    if (gradientIndex === null) {
      divColorIcon.style.backgroundImage = getBackgroundImage(gradient[0], 'heart-filled')
      gradients.push(gradient)
    } else {
      divColorIcon.style.backgroundImage = getBackgroundImage(gradient[0], 'heart-empty')
      gradients.splice(gradientIndex, 1)
    }
    setLikedGradients(gradients)
  })

  return divColorIcon
}

function getLikedGradients() {
  const gradients = []
  let index = 0
  while (localStorage.getItem(`likedGradient${index}`) !== null) {
    const gradient = localStorage.getItem(`likedGradient${index++}`)
    gradients.push([Colors.createHex(gradient.split(':')[0]), Colors.createHex(gradient.split(':')[1])])
  }

  return gradients
}

function isGradientLiked(gradient) {
  const gradients = getLikedGradients()
  for (let index = 0; index < gradients.length; index++) {
    if (Colors.equal(gradients[index][0], gradient[0]) && Colors.equal(gradients[index][1], gradient[1])) {
      return true
    }
  }

  return false
}

function setLikedGradients(gradients) {
  let pos = 0
  for (let index = (gradients.length > 100 ? gradients.length - 100 : 0); index < gradients.length; index++) {
    localStorage.setItem(`likedGradient${pos++}`, `${gradients[index][0].formattedHex}:${gradients[index][1].formattedHex}`)
  }
  for (let index = (gradients.length > 100 ? 100 : gradients.length); index < 200; index++) {
    localStorage.removeItem(`likedGradient${index}`)
  }
}

export { createDivColorIconHeart, createDivGradientIconHeart, getLikedColors, isColorLiked, getLikedGradients, isGradientLiked }