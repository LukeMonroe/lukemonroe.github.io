
const BLACK = 'black'
const WHITE = 'white'

const theme = localStorage.getItem('theme')

pageColors()

function pageColors () {
  let backgroundColor = WHITE
  let textColor = BLACK

  let color = randomColor()
  if (theme === 'light') {
    while (color.grayscale > 150) { color = randomColor() }
  } else if (theme === 'dark') {
    while (color.grayscale <= 150) { color = randomColor() }
    backgroundColor = BLACK
    textColor = WHITE
  } else {
    while (color.grayscale > 150) { color = randomColor() }
  }

  document.documentElement.style.setProperty('--random-color', `hsl(${color.h}, ${color.s}%, ${color.l}%)`)
  document.documentElement.style.setProperty('--background-color', backgroundColor)
  document.documentElement.style.setProperty('--text-color', textColor)
}

function randomColor () {
  const h = Math.round(Math.random() * 359)
  const s = Math.round(Math.random() * 100)
  const l = Math.round(Math.random() * 100)

  const rgb = hslToRGB(h, s, l)
  const grayscale = Math.round((0.2126 * rgb.r) + (0.7152 * rgb.g) + (0.0722 * rgb.b))

  console.log(`hsl(${h}, ${s}%, ${l}%)`)
  console.log(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)
  console.log(grayscale)

  return { h, s, l, rgb, grayscale }
}

function hslToRGB (h, s, l) {
  s /= 100
  l /= 100

  const c = (1 - Math.abs((2 * l) - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - (c / 2)

  let r = 0
  let g = 0
  let b = 0

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c
  } else {
    r = c; g = 0; b = x
  }

  r = Math.round((r + m) * 255)
  g = Math.round((g + m) * 255)
  b = Math.round((b + m) * 255)

  return { r, g, b }
}
