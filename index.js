
const CLICK = 'click'
const THEME = 'theme'
const LIGHT = 'light'
const DARK = 'dark'
const COLOR = 'color'
const NEXT = 'next'
const BLACK = 'black'
const GHOST_WHITE = 'ghostwhite'

const themes = new Map([
  [LIGHT, new Map([[COLOR, GHOST_WHITE], [NEXT, DARK]])],
  [DARK, new Map([[COLOR, BLACK], [NEXT, LIGHT]])]
])

const themeButton = document.getElementById(THEME)
themeButton.addEventListener(CLICK, nextTheme)

setTheme(getTheme())

function getTheme () {
  const theme = localStorage.getItem(THEME)

  return themes.has(theme) ? theme : LIGHT
}

function setTheme (theme) {
  localStorage.setItem(THEME, theme)
  themeButton.innerText = theme
  document.documentElement.style.setProperty('--background-color', themes.get(theme).get(COLOR))
}

function nextTheme () {
  setTheme(themes.get(getTheme()).get(NEXT))
}
