import { Themes } from './themes.js'

document.addEventListener('dblclick', event => { event.preventDefault() })

const themes = new Themes()
themes.setTheme()

const themeColumn = createDivInnerColumn()
themeColumn.appendChild(createH2('Theme'))
themeColumn.appendChild(themes.createButtonTheme())

const outerColumn = document.getElementById('outer-column')
outerColumn.appendChild(themeColumn)

function createH2 (innerText) {
  const h2 = document.createElement('h2')
  h2.innerText = innerText

  return h2
}

function createDivInnerColumn () {
  const divInnerColumn = document.createElement('div')
  divInnerColumn.className = 'inner-column'

  return divInnerColumn
}
