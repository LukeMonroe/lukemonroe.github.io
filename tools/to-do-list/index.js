import { ToDoListThemes } from './to-do-list-themes.js'

const themes = new ToDoListThemes()
themes.setTheme()

const text = localStorage.getItem('text')

// ------
const textAreaRow = createDivInputRow()
const textArea = createTextArea()
textArea.value = text
textArea.addEventListener('focusout', () => {
  localStorage.setItem('text', textArea.value)
  boxColumn.appendChild(createH4(textArea.value))
})

textAreaRow.appendChild(createH4('01:'))
textAreaRow.appendChild(textArea)

const boxColumn = createDivInputColumn()
boxColumn.appendChild(textAreaRow)
// ------

const colorRow = createDivInnerRow()
colorRow.appendChild(boxColumn)

const outerColumn = document.getElementById('outer-column')
outerColumn.appendChild(boxColumn)

function createDivInnerColumn () {
  const column = createDiv()
  column.className = 'inner-column'

  return column
}

function createDivInnerRow () {
  const row = createDiv()
  row.className = 'inner-row'

  return row
}

function createDivInputColumn () {
  const divBoxColumn = createDiv()
  divBoxColumn.className = 'input-column'

  return divBoxColumn
}

function createDivInputRow () {
  const divBoxRow = createDiv()
  divBoxRow.className = 'input-row'

  return divBoxRow
}

function createTextArea () {
  return document.createElement('textarea')
}

function createH2 (innerText) {
  const h2 = document.createElement('h2')
  h2.innerText = innerText

  return h2
}

function createH3 (innerText) {
  const h3 = document.createElement('h3')
  h3.innerText = innerText

  return h3
}

function createH4 (innerText) {
  const h4 = document.createElement('h4')
  h4.innerText = innerText

  return h4
}

function createDiv () {
  return document.createElement('div')
}
