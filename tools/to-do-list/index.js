import { ToDoListThemes } from './to-do-list-themes.js'

const themes = new ToDoListThemes()
themes.setTheme()

const toDos = loadToDos()
const toDosColumn = createDivInnerColumn()
buildToDosColumn()

const inputToDo = createInputToDo()
const inputToDoRow = createDivInnerRow()
inputToDoRow.appendChild(inputToDo)
inputToDoRow.appendChild(createButtonPlus())

const inputColumn = createDivInnerColumn()
inputColumn.appendChild(inputToDoRow)

const outerColumn = document.getElementById('outer-column')
outerColumn.appendChild(inputColumn)
outerColumn.appendChild(toDosColumn)

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

function createInputToDo () {
  const inputTextBox = document.createElement('input')
  inputTextBox.className = 'to-do'
  inputTextBox.type = 'text'

  return inputTextBox
}

function createButtonMinus (index) {
  const buttonMinus = document.createElement('button')
  buttonMinus.className = 'minus'
  buttonMinus.addEventListener('click', () => {
    localStorage.clear()
    toDos.splice(index, 1)
    buildToDosColumn()
  })

  return buttonMinus
}

function createButtonPlus () {
  const buttonPlus = document.createElement('button')
  buttonPlus.className = 'plus'
  buttonPlus.addEventListener('click', () => {
    const toDo = inputToDo.value
    inputToDo.value = null
    if (toDo !== null && toDo.trim().length > 0) {
      toDo.trim().split(',').forEach(td => {
        if (td.trim().length > 0) {
          toDos.push(td.trim())
        }
      })
      buildToDosColumn()
    }
  })

  return buttonPlus
}

function createDivToDoRow (index, toDo) {
  const divItemRow = createDivInnerRow()
  divItemRow.appendChild(createButtonMinus(index))
  divItemRow.appendChild(createDivToDo(toDo))

  return divItemRow
}

function createDivToDo (toDo) {
  const divItem = document.createElement('div')
  divItem.className = 'to-do'
  divItem.appendChild(createH4(`${toDo.slice(0, 1).toUpperCase()}${toDo.slice(1)}`))

  return divItem
}

function createH4 (innerText) {
  const h4 = document.createElement('h4')
  h4.innerText = innerText

  return h4
}

function createDiv () {
  return document.createElement('div')
}

function loadToDos () {
  const toDos = []
  let index = 0
  while (localStorage.getItem(`toDo${index}`) !== null) {
    toDos.push(localStorage.getItem(`toDo${index++}`))
  }

  return toDos
}

function buildToDosColumn () {
  toDosColumn.replaceChildren()
  for (let index = 0; index < toDos.length; index++) {
    localStorage.setItem(`toDo${index}`, toDos[index])
    toDosColumn.appendChild(createDivToDoRow(index, toDos[index]))
  }

  return toDosColumn
}
