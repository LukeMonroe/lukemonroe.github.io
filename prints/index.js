import { PrintsThemes } from './prints-themes.js'

const printsThemes = new PrintsThemes()
printsThemes.setTheme()

let fullscreen = false
const image = document.getElementById('image')
image.addEventListener('click', () => {
  if (fullscreen) {
    document.exitFullscreen()
    fullscreen = false
  } else {
    image.requestFullscreen()
    fullscreen = true
  }
})
