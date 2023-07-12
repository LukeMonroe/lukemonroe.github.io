import { PrintsThemes } from './prints-themes.js'

const printsThemes = new PrintsThemes()
printsThemes.setTheme()

let fullscreen = false
const images = document.getElementsByTagName('img')

for (let index = 0; index < images.length; index++) {
  const image = images[index]
  image.addEventListener('click', () => {
    if (!fullscreen) {
      image.requestFullscreen()
      fullscreen = true
    }
  })
}

document.addEventListener('click', () => {
  if (fullscreen) {
    document.exitFullscreen()
    fullscreen = false
  }
})
