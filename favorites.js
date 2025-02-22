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
      if (Colors.equal(colors[index], color, false)) {
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
    if (Colors.equal(colors[index], color, false)) {
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

export { createDivColorIconHeart, getLikedColors, isColorLiked }