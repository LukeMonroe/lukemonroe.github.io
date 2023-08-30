import { PrintsThemes } from './prints-themes.js'

document.addEventListener('dblclick', event => { event.preventDefault() })

const printsThemes = new PrintsThemes()
printsThemes.setTheme()
