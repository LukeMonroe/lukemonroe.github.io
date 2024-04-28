import { CreateAQuestionThemes } from './create-a-question.js'

document.addEventListener('dblclick', event => { event.preventDefault() })

const themes = new CreateAQuestionThemes()
themes.setTheme()

const inputQuestion = createInputQuestion()
const questionColumn = createDivInnerColumn()

const inputQuestionRow = createDivInnerRow()
inputQuestionRow.appendChild(inputQuestion)
inputQuestionRow.appendChild(createButtonEnter())

const inputQuestionColumn = createDivInnerColumn()
inputQuestionColumn.appendChild(createH2("Enter the yes or no question you wish to ask."))
inputQuestionColumn.appendChild(inputQuestionRow)

const outerColumn = document.getElementById('outer-column')
outerColumn.appendChild(inputQuestionColumn)
outerColumn.appendChild(questionColumn)

function createDivInnerColumn() {
  return createDiv('inner-column')
}

function createDivInnerRow() {
  return createDiv('inner-row')
}

function createInputQuestion() {
  const inputQuestion = document.createElement('input')
  inputQuestion.className = 'question'
  inputQuestion.type = 'text'
  inputQuestion.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      event.preventDefault()
      addQuestion()
    }
  })

  return inputQuestion
}

function createButtonYes() {
  const button = document.createElement('button')
  button.appendChild(createH4('Yes'))
  button.addEventListener('click', () => {
    questionColumn.replaceChildren()
    questionColumn.appendChild(createDivQuestionColumn("You're Awesome!"))
  })

  return button
}

function createButtonNo() {
  const button = document.createElement('button')
  button.appendChild(createH4('No'))
  button.appendChild(x)
  button.appendChild(y)
  button.addEventListener('touchstart', () => {
    handleNo(button)
  })
  button.addEventListener('mouseover', () => {
    handleNo(button)
  })

  return button
}

var clicks = 0
var addedEventListener = false
var x = createH4('X')
var y = createH4('Y')
function handleNo(button) {
  if (clicks >= 20) {
    if (!addedEventListener) {
      button.addEventListener('click', () => {
        questionColumn.replaceChildren()
        questionColumn.appendChild(createDivQuestionColumn("Your perseverance is noted."))
      })
      button.style.position = 'relative'
      button.style.top = '0px'
      button.style.left = '0px'
      button.style.rotate = '0deg'
      button.style.transition = 'None'
      addedEventListener = true
    }
  } else {
    button.style.position = 'absolute'
    button.style.top = `${rangeRandom(Number(50), Number(window.innerHeight - 50))}px`
    y.innerText = button.style.top
    button.style.left = `${rangeRandom(Number(50), Number(document.body.clientWidth - 50))}px`
    x.innerText = button.style.left
    button.style.rotate = `${rangeRandom(Number(0), Number(360))}deg`
    button.style.transition = '1s'
    clicks++
  }
}

function createButtonEnter() {
  const buttonEnter = document.createElement('button')
  buttonEnter.appendChild(createH4('Enter'))
  buttonEnter.addEventListener('click', addQuestion)

  return buttonEnter
}

function createDivQuestionColumn(question) {
  const divButtonRow = createDivInnerRow()
  divButtonRow.appendChild(createButtonYes())
  divButtonRow.appendChild(createButtonNo())

  const divQuestionColumn = createDivInnerColumn()
  divQuestionColumn.appendChild(createDivQuestion(question))
  divQuestionColumn.appendChild(divButtonRow)

  return divQuestionColumn
}

function createDivQuestion(question) {
  const divQuestion = createDiv('question')
  divQuestion.appendChild(createH2(question))

  return divQuestion
}

function createH2(innerText) {
  const h2 = document.createElement('h2')
  h2.innerText = innerText

  return h2
}

function createH4(innerText) {
  const h4 = document.createElement('h4')
  h4.innerText = innerText

  return h4
}

function createDiv(className) {
  const div = document.createElement('div')
  if (className !== null) {
    div.className = className
  }

  return div
}

function addQuestion() {
  if (inputQuestion.value !== null) {
    let question = inputQuestion.value.trim()
    if (question.length > 0) {
      question = `${question.slice(0, 1).toUpperCase()}${question.slice(1)}`
      if (question.slice(-1) != "?") {
        question = `${question}?`
      }
      questionColumn.replaceChildren()
      questionColumn.appendChild(createDivQuestionColumn(question))

      inputQuestion.value = null
      inputQuestionColumn.style.display = "None"
    }
  }
}

function rangeRandom(floor, ceil) {
  const number = Math.ceil(limitRandom(ceil))
  return number < floor ? floor : number
}

function limitRandom(limit) {
  return random() * limit
}

function random() {
  return Math.random()
}
