import { RecipesThemes } from './recipes-themes.js'

const recipesThemes = new RecipesThemes()
recipesThemes.setTheme()

let servings = 1
const increment = 0.5
const precision = 10000
const fractions = new Map([
  ['0', 0],
  ['1/8', 1 / 8],
  ['1/6', 1 / 6],
  ['1/4', 1 / 4],
  ['1/3', 1 / 3],
  ['3/8', 3 / 8],
  ['1/2', 1 / 2],
  ['5/8', 5 / 8],
  ['2/3', 2 / 3],
  ['3/4', 3 / 4],
  ['5/6', 5 / 6],
  ['7/8', 7 / 8],
  ['1', 1]
])

const h2Servings = document.getElementById('servings')
const spanNumberPairs = []
document.getElementsByName('number').forEach(spanNumber => {
  spanNumberPairs.push([spanNumber, textToNumber(spanNumber.innerText)])
})
updateServings()

const buttonMinus = document.getElementById('minus')
buttonMinus.addEventListener('click', () => {
  if (servings - increment >= 0.5) {
    servings -= increment
    updateServings()
  }
})

const buttonPlus = document.getElementById('plus')
buttonPlus.addEventListener('click', () => {
  if (servings + increment <= 5) {
    servings += increment
    updateServings()
  }
})

function updateServings () {
  h2Servings.innerText = `Servings: ${numberToMixedFraction(servings)}`
  spanNumberPairs.forEach(spanNumberPair => {
    spanNumberPair[0].innerText = numberToMixedFraction(spanNumberPair[1] * servings)
  })
}

function textToNumber (text) {
  let sum = 0
  const numbers = String(text).trim().split(' ')
  numbers.forEach(number => {
    const fraction = number.split('/')
    if (fraction.length > 1 && fraction[1] !== '0') {
      sum += Number(fraction[0]) / Number(fraction[1])
    } else {
      sum += Number(fraction[0])
    }
  })

  return round(sum)
}

function numberToMixedFraction (number) {
  const numbers = String(round(number)).trim().split('.')
  const integer = Number(numbers[0])
  let mixedFraction = String(integer)

  if (numbers.length > 1) {
    const decimal = Number(numbers[1]) / Math.pow(10, numbers[1].length)
    let fraction = null
    let closest = null

    for (const [key, value] of fractions) {
      const roundedValue = round(value)
      const closeness = Math.abs(decimal - roundedValue)
      if (closest === null || closeness <= closest) {
        fraction = key
        closest = closeness
        if (closest === 0) {
          break
        }
      }
    }

    if (fraction === '1') {
      mixedFraction = String(integer + 1)
    } else if (fraction !== '0') {
      mixedFraction = integer === 0 ? fraction : `${integer} ${fraction}`
    }
  }

  return mixedFraction
}

function round (number) {
  return Math.round(number * precision) / precision
}
