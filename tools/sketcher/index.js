import { ColorPickerThemes } from './color-picker-themes.js'

document.addEventListener('dblclick', event => { event.preventDefault() })

const themes = new ColorPickerThemes()
themes.setTheme()

const BUTTON = 'button'
const CANVAS = 'canvas'
const CLICK = 'click'
const DIV = 'div'

const ASPECT_RATIO = 16 / 9
const CANVAS_MIN_WIDTH = 300
const CANVAS_MAX_WIDTH = 1200

const actionButton01 = document.createElement(BUTTON)
actionButton01.innerText = 'Line'
actionButton01.style.color = 'red'
actionButton01.addEventListener(CLICK, lineSketch)

const actionButton02 = document.createElement(BUTTON)
actionButton02.innerText = 'Lock Vertical'
actionButton02.style.color = 'red'
actionButton02.addEventListener(CLICK, clickVertical)

const actionButton03 = document.createElement(BUTTON)
actionButton03.innerText = 'Lock Horizontal'
actionButton03.style.color = 'red'
actionButton03.addEventListener(CLICK, clickHorizontal)

const actionButton04 = document.createElement(BUTTON)
actionButton04.innerText = 'Drag Point'
actionButton04.style.color = 'red'
actionButton04.addEventListener(CLICK, clickDrag)

const actionButton05 = document.createElement(BUTTON)
actionButton05.innerText = 'Merge Points'
actionButton05.style.color = 'red'
actionButton05.addEventListener(CLICK, clickMerge)

const clearButton = document.createElement(BUTTON)
clearButton.innerText = 'Clear'
clearButton.addEventListener(CLICK, clearSketch)

const canvas = document.createElement(CANVAS)
canvas.style.border = '2px solid green'
canvas.addEventListener('click', event => handleClick(event))
const context = canvas.getContext('2d')

const buttonRow = document.createElement(DIV)
buttonRow.className = 'button-row'
buttonRow.appendChild(actionButton01)
buttonRow.appendChild(actionButton02)
buttonRow.appendChild(actionButton03)
buttonRow.appendChild(actionButton04)
buttonRow.appendChild(actionButton05)
buttonRow.appendChild(clearButton)

const canvasColumn = document.createElement(DIV)
canvasColumn.className = 'canvas-column'
canvasColumn.appendChild(canvas)

const outerColumn = document.getElementById('outer-column')
outerColumn.appendChild(buttonRow)
outerColumn.appendChild(canvasColumn)

let requestId = null
let points = []
let lines = []
let scale = 1
let timeStamp = 0
let previousTimeStamp = 0
let elapsedTimeStamp = 0

let sketchLines = false
let verticalLock = false
let verticalLockPoints = []
let horizontalLock = false
let horizontalLockPoints = []
let dragPoint = false
let dPoints = []
let removeDragPointNextClick = false

const raf =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame

window.addEventListener('resize', resizeCanvas)
resizeCanvas()
manage()

function lineSketch() {
    if (points.length > 1 && points.length < 2) {
        alert("Line must have at least 2 points.")
    } else {
        sketchLines = !sketchLines
        actionButton01.style.color = sketchLines ? 'green' : 'red'

        if (points.length >= 2) {
            lines.push(points)
        }
        points = []
    }
}

function clickMerge() {
    let newPoints = []
    for (const point of points) {
        let merge = false
        for (const newPoint of newPoints) {
            if (point.x == newPoint.x && point.y == newPoint.y) {
                merge = true
            }
        }
        if (!merge) {
            newPoints.push(point)
        }
    }
    points = newPoints
}

function clickDrag() {
    draglPoint()
}

function draglPoint(lPoint) {
    if (lPoint == null) {
        dragPoint = !dragPoint
        actionButton04.style.color = dragPoint ? 'green' : 'red'
        canvas.removeEventListener('mousemove', movelPoint)
        if (dPoints != null) {
            dPoints = []
        }
    } else {
        if (dragPoint) {
            dPoints = [lPoint]
            for (const line of lines) {
                for (const point of line) {
                    if (lPoint.x == point.x && lPoint.y == point.y) {
                        point.color = 'blue'
                        dPoints.push(point)
                    }
                }
            }
            canvas.addEventListener('mousemove', movelPoint)
        }
    }
}

const movelPoint = event => {
    const canvasRect = canvas.getBoundingClientRect()
    const x = event.clientX - canvasRect.left
    const y = event.clientY - canvasRect.top
    for (const point of dPoints) {
        point.x = x
        point.y = y
    }
}

function clickVertical() {
    lockVertical()
}

function lockVertical(lPoint) {
    if (lPoint == null) {
        verticalLock = !verticalLock
        actionButton02.style.color = verticalLock ? 'green' : 'red'
        verticalLockPoints = []
    } else {
        if (verticalLock) {
            lPoint.color = 'blue'
            verticalLockPoints.push(lPoint)

            if (verticalLockPoints.length == 2) {
                const pointFr = verticalLockPoints[0]
                const pointTo = verticalLockPoints[1]

                if (pointFr.equal(pointTo)) {
                    alert("Both points are the same!")
                } else if (pointTo.verticalLock && pointFr.verticalLock) {
                    alert("Both points are vertically locked!")
                } else if (pointTo.verticalLock && !pointFr.verticalLock) {
                    pointTo.verticalLock = true
                    pointFr.verticalLock = true
                    pointFr.x = pointTo.x
                } else {
                    pointTo.verticalLock = true
                    pointFr.verticalLock = true
                    pointTo.x = pointFr.x
                }
                lockVertical()
            }
        }
    }
}

function clickHorizontal() {
    lockHorizontal()
}

function lockHorizontal(lPoint) {
    if (lPoint == null) {
        horizontalLock = !horizontalLock
        actionButton03.style.color = horizontalLock ? 'green' : 'red'
        horizontalLockPoints = []
    } else {
        if (horizontalLock) {
            lPoint.color = 'blue'
            horizontalLockPoints.push(lPoint)

            if (horizontalLockPoints.length == 2) {
                const pointFr = horizontalLockPoints[0]
                const pointTo = horizontalLockPoints[1]

                if (pointFr.equal(pointTo)) {
                    alert("Both points are the same!")
                } else if (pointTo.horizontalLock && pointFr.horizontalLock) {
                    alert("Both points are horizontally locked!")
                } else if (pointTo.horizontalLock && !pointFr.horizontalLock) {
                    pointTo.horizontalLock = true
                    pointFr.horizontalLock = true
                    pointFr.y = pointTo.y
                } else {
                    pointTo.horizontalLock = true
                    pointFr.horizontalLock = true
                    pointTo.y = pointFr.y
                }
                lockHorizontal()
            }
        }
    }
}

function locatePoint(newPoint) {
    let locatedPoint = null

    for (const point of points) {
        if (Math.abs(point.x - newPoint.x) < 10 && Math.abs(point.y - newPoint.y) < 10) {
            locatedPoint = point
            break
        }
    }
    for (const line of lines) {
        let pointMatched = false
        for (const point of line) {
            if (Math.abs(point.x - newPoint.x) < 10 && Math.abs(point.y - newPoint.y) < 10) {
                locatedPoint = point
                pointMatched = true
                break
            }
        }
        if (pointMatched) {
            break
        }
    }

    return locatedPoint
}

function clearSketch() {
    points = []
    lines = []
}

function handleClick(event) {
    const canvasRect = canvas.getBoundingClientRect()
    const x = event.clientX - canvasRect.left
    const y = event.clientY - canvasRect.top
    const nPoint = new Point(x, y)
    const lPoint = locatePoint(nPoint)

    if (sketchLines) {
        points.push(lPoint != null ? lPoint.copy() : nPoint)
    }

    if (verticalLock) {
        if (lPoint != null) {
            lockVertical(lPoint)
        }
    }

    if (horizontalLock) {
        if (lPoint != null) {
            lockHorizontal(lPoint)
        }
    }

    if (removeDragPointNextClick) {
        removeDragPointNextClick = false
        draglPoint()
    }

    if (dragPoint) {
        if (lPoint != null) {
            removeDragPointNextClick = true
            draglPoint(lPoint)
        }
    }
}

function resizeCanvas() {
    const oldStyleWidth = Number(canvas.style.width.split('px')[0])
    const oldStyleHeight = Number(canvas.style.height.split('px')[0])
    let newStyleWidth = null
    let newStyleHeight = null

    if (canvasColumn.clientWidth < CANVAS_MIN_WIDTH) {
        newStyleWidth = CANVAS_MIN_WIDTH
    } else if (canvasColumn.clientWidth > CANVAS_MAX_WIDTH) {
        newStyleWidth = CANVAS_MAX_WIDTH
    } else {
        newStyleWidth = canvasColumn.clientWidth
    }
    newStyleHeight = newStyleWidth / ASPECT_RATIO

    scale = newStyleWidth / CANVAS_MAX_WIDTH
    canvas.style.height = `${newStyleHeight}px`
    canvas.style.width = `${newStyleWidth}px`

    const dpr = window.devicePixelRatio
    canvas.height = Math.floor(newStyleHeight * dpr)
    canvas.width = Math.floor(newStyleWidth * dpr)
    context.scale(dpr, dpr)
}

function requestAnimationFrame(callable) {
    requestId = raf(callable)
}

function manage(timestamp) {
    elapsedTimeStamp = Math.round((timeStamp - previousTimeStamp) * 100) / 100
    previousTimeStamp = timeStamp
    clear()
    draw()
    requestAnimationFrame(manage)
}

function clear() {
    context.clearRect(0, 0, canvasStyleWidth(), canvasStyleHeight())
}

function draw() {
    points.forEach(point => point.draw(context))
    lines.forEach(line => drawLine(line))

    if (points.length > 1) {
        drawLine(points)
    }
}

function drawLine(line) {
    line.forEach(point => point.draw(context))

    context.save()
    context.fillStyle = "#000000"
    context.beginPath()

    for (const point of line) {
        context.lineTo(point.x, point.y)
    }

    context.stroke()
    context.restore()
}

function canvasStyleWidth() {
    return Number(canvas.style.width.split('px')[0])
}

function canvasStyleHeight() {
    return Number(canvas.style.height.split('px')[0])
}

class Point {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.color = "#000000"
        this.scale = 1
        this.size = 4
        this.lockVertical = false
        this.lockHorizontal = false
    }

    copy() {
        return new Point(this.x, this.y)
    }

    equal(point) {
        return this.x == point.x && this.y == point.y
    }

    draw(context) {
        context.save()
        context.fillStyle = this.color
        context.beginPath()

        context.arc(this.x, this.y, this.size * this.scale, 0, Math.PI * 2)

        context.closePath()
        context.fill()
        context.restore()
    }

    getDistance() {
        return Point.getDistance(this.x, this.y)
    }

    static getDistance(x, y) {
        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
    }
}
