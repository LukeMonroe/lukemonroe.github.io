import { PrintsThemes } from './prints-themes.js'

const printsThemes = new PrintsThemes()
printsThemes.setTheme()

const image = document.getElementById('image')
image.addEventListener('click', () => {
  image.requestFullscreen()
})
