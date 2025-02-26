function getBackgroundImage(color, name) {
  let backgroundImage = 'blank.png'
  if (name === 'checkmark') {
    backgroundImage = color.formattedText === '#ffffff' ? 'checkmark-white.png' : 'checkmark-black.png'
  } else if (name === 'color-picker') {
    backgroundImage = color.formattedText === '#ffffff' ? 'eyedropper-white.png' : 'eyedropper-black.png'
  } else if (name === 'corner-triangle') {
    backgroundImage = color.formattedText === '#ffffff' ? 'corner-triangle-white.png' : 'corner-triangle-black.png'
  } else if (name === 'eyedropper') {
    backgroundImage = color.formattedText === '#ffffff' ? 'eyedropper-white.png' : 'eyedropper-black.png'
  } else if (name === 'fullscreen') {
    backgroundImage = color.formattedText === '#ffffff' ? 'fullscreen-white.png' : 'fullscreen-black.png'
  } else if (name === 'heart-empty') {
    backgroundImage = color.formattedText === '#ffffff' ? 'heart-empty-white.png' : 'heart-empty-black.png'
  } else if (name === 'heart-filled') {
    backgroundImage = color.formattedText === '#ffffff' ? 'heart-filled-white.png' : 'heart-filled-black.png'
  }

  return `url(images/${backgroundImage})`
}

export { getBackgroundImage }