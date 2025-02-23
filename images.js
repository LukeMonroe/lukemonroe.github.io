function getBackgroundImage(color, name) {
  let backgroundImage = 'blank.png'
  if (name === 'checkmark') {
    backgroundImage = color.grayscale > 50 ? 'checkmark-black.png' : 'checkmark-white.png'
  } else if (name === 'corner-triangle') {
    backgroundImage = color.grayscale > 50 ? 'corner-triangle-black.png' : 'corner-triangle-white.png'
  } else if (name === 'fullscreen') {
    backgroundImage = color.grayscale > 50 ? 'fullscreen-black.png' : 'fullscreen-white.png'
  } else if (name === 'heart-empty') {
    backgroundImage = color.grayscale > 50 ? 'heart-empty-black.png' : 'heart-empty-white.png'
  } else if (name === 'heart-filled') {
    backgroundImage = color.grayscale > 50 ? 'heart-filled-black.png' : 'heart-filled-white.png'
  }

  return `url(images/${backgroundImage})`
}

export { getBackgroundImage }