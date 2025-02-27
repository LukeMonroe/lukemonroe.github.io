function getBackgroundImage(color, name) {
  let backgroundImage = 'blank.png'
  if (name === 'arrow') {
    backgroundImage = color.formattedText === '#ffffff' ? 'arrow-white.png' : 'arrow-black.png'
  } else if (name === 'checkmark') {
    backgroundImage = color.formattedText === '#ffffff' ? 'checkmark-white.png' : 'checkmark-black.png'
  } else if (name === 'corner-triangle') {
    backgroundImage = color.formattedText === '#ffffff' ? 'corner-triangle-white.png' : 'corner-triangle-black.png'
  } else if (name === 'exit') {
    backgroundImage = color.formattedText === '#ffffff' ? 'exit-white.png' : 'exit-black.png'
  } else if (name === 'eye') {
    backgroundImage = color.formattedText === '#ffffff' ? 'eye-white.png' : 'eye-black.png'
  } else if (name === 'eyedropper') {
    backgroundImage = color.formattedText === '#ffffff' ? 'eyedropper-white.png' : 'eyedropper-black.png'
  } else if (name === 'fullscreen') {
    backgroundImage = color.formattedText === '#ffffff' ? 'fullscreen-white.png' : 'fullscreen-black.png'
  } else if (name === 'heart-empty') {
    backgroundImage = color.formattedText === '#ffffff' ? 'heart-empty-white.png' : 'heart-empty-black.png'
  } else if (name === 'heart-filled') {
    backgroundImage = color.formattedText === '#ffffff' ? 'heart-filled-white.png' : 'heart-filled-black.png'
  } else if (name === 'hexagon') {
    backgroundImage = color.formattedText === '#ffffff' ? 'hexagon-white.png' : 'hexagon-black.png'
  } else if (name === 'information') {
    backgroundImage = color.formattedText === '#ffffff' ? 'information-white.png' : 'information-black.png'
  } else if (name === 'plus') {
    backgroundImage = color.formattedText === '#ffffff' ? 'plus-white.png' : 'plus-black.png'
  } else if (name === 'raindrop') {
    backgroundImage = color.formattedText === '#ffffff' ? 'raindrop-white.png' : 'raindrop-black.png'
  }

  return `url(images/${backgroundImage})`
}

export { getBackgroundImage }