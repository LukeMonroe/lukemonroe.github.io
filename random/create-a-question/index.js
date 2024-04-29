import { CreateAQuestionThemes } from './create-a-question.js'

document.addEventListener('dblclick', event => { event.preventDefault() })

const themes = new CreateAQuestionThemes()
themes.setTheme()

var clicks = 0
var addedEventListener = false

var url = new URL(window.location.href)
var urlQuestion = url.searchParams.get("question")

const inputQuestion = createInputQuestion()

const inputQuestionRow = createDivInnerRow()
inputQuestionRow.appendChild(inputQuestion)
inputQuestionRow.appendChild(createButtonEnter())

const inputQuestionColumn = createDivInnerColumn()
inputQuestionColumn.appendChild(createH2("Enter the yes or no question you wish to ask."))
inputQuestionColumn.appendChild(inputQuestionRow)

const questionColumn = createDivInnerColumn()

const outerColumn = document.getElementById('outer-column')

if (urlQuestion === null) {
    outerColumn.appendChild(inputQuestionColumn)
} else {
    addQuestion()
    outerColumn.appendChild(questionColumn)
}

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
    button.style.transition = '1s'
    button.style.scale = '1'
    button.appendChild(createH4('No'))
    button.addEventListener('touchstart', () => { handleNo(button) })
    button.addEventListener('mouseenter', () => { handleNo(button) })

    return button
}

function handleNo(button) {
    if (clicks >= 20) {
        if (!addedEventListener) {
            button.addEventListener('click', () => {
                questionColumn.replaceChildren()
                questionColumn.appendChild(createDivQuestionColumn("Your perseverance is noted."))
            })
            button.style.position = 'relative'
            button.style.transition = 'None'
            button.style.scale = '1'
            button.style.top = '0px'
            button.style.left = '0px'
            button.style.rotate = '0deg'
            addedEventListener = true
        }
    } else {
        button.style.position = 'absolute'
        let yPosition = Number(button.style.top.slice(0, -2))
        let xPosition = Number(button.style.left.slice(0, -2))
        let xLimit = rangeRandom(100, 1000) * (random() >= 0.5 ? 1 : -1)
        while (xPosition + xLimit < 0 || xPosition + xLimit > document.body.clientWidth) {
            xLimit = rangeRandom(100, 1000) * (random() >= 0.5 ? 1 : -1)
        }
        let yLimit = rangeRandom(100, 1000) * (random() >= 0.5 ? 1 : -1)
        while (yPosition + yLimit < 0 || yPosition + yLimit > window.innerHeight) {
            yLimit = rangeRandom(100, 1000) * (random() >= 0.5 ? 1 : -1)
        }
        button.style.top = `${yPosition + yLimit}px`
        button.style.left = `${xPosition + xLimit}px`

        let rotate = Number(button.style.rotate.slice(0, -3))
        let rotateLimit = limitRandom(180) * (random() >= 0.5 ? 1 : -1)
        button.style.rotate = `${rotate + rotateLimit}deg`

        let scale = Number(button.style.scale) - 0.04
        scale = scale > 0.2 ? scale : 0.2
        button.style.scale = `${scale}`
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
    if (urlQuestion === null) {
        if (inputQuestion.value !== null) {
            let question = inputQuestion.value.trim()
            if (question.length > 0) {
                question = `${question.slice(0, 1).toUpperCase()}${question.slice(1)}`
                if (question.slice(-1) != "?") {
                    question = `${question}?`
                }

                let url = new URL(window.location.href)
                url.searchParams.set("question", question)
                window.location.href = url.href
            }
        }
    } else {
        questionColumn.replaceChildren()
        questionColumn.appendChild(createDivQuestionColumn(urlQuestion))
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
