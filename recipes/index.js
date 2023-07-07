
function setContrast () {
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)

  const grayscale = Math.floor((0.2126 * r) + (0.7152 * g) + (0.0722 * b))
  console.log(grayscale)

  if (grayscale < 150) {
    document.documentElement.style.setProperty('--secondary-color', 'rgb(255, 255, 255)')
    document.documentElement.style.setProperty('--tertiary-color', 'rgb(0, 0, 0)')
  } else {
    document.documentElement.style.setProperty('--secondary-color', 'rgb(0, 0, 0)')
    document.documentElement.style.setProperty('--tertiary-color', 'rgb(255, 255, 255)')
  }

  document.documentElement.style.setProperty('--primary-color', `rgb(${r}, ${g}, ${b})`)
}

setContrast()
