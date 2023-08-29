import { ToDoListThemes } from './to-do-list-themes.js'

const themes = new ToDoListThemes()
themes.setTheme()

const inputToDo = createInputToDo()
const toDos = loadToDos()
const toDosColumn = createDivInnerColumn()
buildToDosColumn()

const inputToDoRow = createDivInnerRow()
inputToDoRow.appendChild(inputToDo)
inputToDoRow.appendChild(createButtonPlus())

const inputToDoColumn = createDivInnerColumn()
inputToDoColumn.appendChild(inputToDoRow)

const outerColumn = document.getElementById('outer-column')
outerColumn.appendChild(inputToDoColumn)
outerColumn.appendChild(toDosColumn)

function createDivInnerColumn () {
  return createDiv('inner-column')
}

function createDivInnerRow () {
  return createDiv('inner-row')
}

function createInputToDo () {
  const inputToDo = document.createElement('input')
  inputToDo.className = 'to-do'
  inputToDo.type = 'text'
  inputToDo.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      event.preventDefault()
      addToDo()
    }
  })

  return inputToDo
}

function createButtonMinus (index) {
  const buttonMinus = document.createElement('button')
  buttonMinus.className = 'minus'
  buttonMinus.addEventListener('click', () => {
    for (let index = 0; index < toDos.length; index++) {
      localStorage.removeItem(`toDo${index}`)
    }
    toDos.splice(index, 1)
    buildToDosColumn()
  })

  return buttonMinus
}

function createButtonPlus () {
  const buttonPlus = document.createElement('button')
  buttonPlus.className = 'plus'
  buttonPlus.addEventListener('click', addToDo)

  return buttonPlus
}

function createDivToDoRow (index, toDo) {
  const divToDoRow = createDivInnerRow()
  divToDoRow.appendChild(createButtonMinus(index))
  divToDoRow.appendChild(createDivToDo(toDo))

  return divToDoRow
}

function createDivToDo (toDo) {
  const divToDo = createDiv('to-do')
  divToDo.appendChild(createH4(`${toDo.slice(0, 1).toUpperCase()}${toDo.slice(1)}`))

  return divToDo
}

function createH4 (innerText) {
  const h4 = document.createElement('h4')
  h4.innerText = innerText

  return h4
}

function createDiv (className) {
  const div = document.createElement('div')
  if (className !== null) {
    div.className = className
  }

  return div
}

function loadToDos () {
  const toDos = []
  while (localStorage.getItem(`toDo${toDos.length}`) !== null) {
    toDos.push(localStorage.getItem(`toDo${toDos.length}`))
  }

  return toDos
}

function addToDo () {
  if (inputToDo.value !== null) {
    const toDo = inputToDo.value.trim()
    if (toDo.length > 0) {
      toDo.split(',').forEach(innerToDo => addInnerToDo(innerToDo))
      buildToDosColumn()
    }
  }

  inputToDo.value = null
}

function addInnerToDo (innerToDo) {
  innerToDo = innerToDo.trim()
  if (innerToDo.length > 0) {
    toDos.push(innerToDo)
  }
}

function buildToDosColumn () {
  toDosColumn.replaceChildren()
  for (let index = 0; index < toDos.length; index++) {
    localStorage.setItem(`toDo${index}`, toDos[index])
    toDosColumn.appendChild(createDivToDoRow(index, toDos[index]))
  }

  return toDosColumn
}
