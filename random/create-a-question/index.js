import { CreateAQuestionThemes } from './create-a-question.js'

document.addEventListener('dblclick', event => { event.preventDefault() })

const themes = new CreateAQuestionThemes()
themes.setTheme()

const inputQuestion = createInputQuestion()
const questionColumn = createDivInnerColumn()

const inputQuestionRow = createDivInnerRow()
inputQuestionRow.appendChild(inputQuestion)
inputQuestionRow.appendChild(createButtonPlus())

const inputQuestionColumn = createDivInnerColumn()
inputQuestionColumn.appendChild(createH3("Type in the question you wish to ask someone."))
inputQuestionColumn.appendChild(inputQuestionRow)

const outerColumn = document.getElementById('outer-column')
outerColumn.appendChild(inputQuestionColumn)
outerColumn.appendChild(questionColumn)

function createDivInnerColumn () {
  return createDiv('inner-column')
}

function createDivInnerRow () {
  return createDiv('inner-row')
}

function createInputQuestion () {
  const inputToDo = document.createElement('input')
  inputToDo.className = 'to-do'
  inputToDo.type = 'text'
  inputToDo.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      event.preventDefault()
      addQuestion()
    }
  })

  return inputToDo
}

function createButtonYes () {
  const button = document.createElement('button')
  button.innerText = 'Yes :)'
  button.addEventListener('click', () => {
    questionColumn.replaceChildren()
    questionColumn.appendChild(createDivQuestionColumn("You're Awesome!"))
  })

  return button
}

function createButtonNo () {
  const button = document.createElement('button')
  button.innerText = 'No :('
  button.addEventListener('click', () => {
    questionColumn.replaceChildren()
    questionColumn.appendChild(createDivQuestionColumn("Your perseverance is noted."))
  })
  button.addEventListener('mouseover', () => {
    button.style.position = 'absolute'
    button.style.top = `${rangeRandom(Number(50), Number(window.innerHeight - 50))}px`
    button.style.left = `${rangeRandom(Number(50), Number(window.innerWidth - 50))}px`
    button.style.rotate = `${rangeRandom(Number(0), Number(360))}deg`
    const size = rangeRandom(Number(20), Number(200))
    button.style.width = `${size}px`
    button.style.height = `${size}px`
  })

  return button
}

function rangeRandom (floor, ceil) {
  const number = Math.ceil(limitRandom(ceil))
  return number < floor ? floor : number
}

function limitRandom (limit) {
  return random() * limit
}

function random () {
  return Math.random()
}

function createButtonPlus () {
  const buttonPlus = document.createElement('button')
  buttonPlus.className = 'plus'
  buttonPlus.addEventListener('click', addQuestion)

  return buttonPlus
}

function createDivQuestionColumn (toDo) {
  const divButtonRow = createDivInnerRow()
  divButtonRow.appendChild(createButtonYes())
  divButtonRow.appendChild(createButtonNo())
  
  const divQuestionColumn = createDivInnerColumn()
  divQuestionColumn.appendChild(createDivQuestion(toDo))
  divQuestionColumn.appendChild(divButtonRow)

  return divQuestionColumn
}

function createDivQuestion (toDo) {
  const divToDo = createDiv('to-do')
  divToDo.appendChild(createH2(toDo))

  return divToDo
}

function createH2 (innerText) {
  const h2 = document.createElement('h2')
  h2.innerText = innerText

  return h2
}

function createH3 (innerText) {
  const h3 = document.createElement('h2')
  h3.innerText = innerText

  return h3
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

function addQuestion () {
  if (inputQuestion.value !== null) {
    let toDo = inputQuestion.value.trim()
    if (toDo.length > 0) {
      toDo = `${toDo.slice(0, 1).toUpperCase()}${toDo.slice(1)}`
      if (toDo.slice(-1) != "?") {
        toDo = `${toDo}?`
      }
      questionColumn.replaceChildren()
      questionColumn.appendChild(createDivQuestionColumn(toDo))
    }
  }

  inputQuestion.value = null
  inputQuestionColumn.style.visibility = "hidden"
}
