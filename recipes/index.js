import { RecipesThemes } from './recipes-themes.js'

const recipesThemes = new RecipesThemes()
recipesThemes.setTheme()

let servings = 1
const increment = 0.5
const h2Servings = document.getElementById('servings')
h2Servings.innerText = `Servings: ${servings}`

const numbers = document.getElementsByName('number')

const buttonMinus = document.getElementById('minus')
buttonMinus.addEventListener('click', () => {
  if (servings - increment >= increment) {
    servings -= increment
    h2Servings.innerText = `Servings: ${servings}`
    numbers.forEach(number => {
      number.innerText = numberToMixedFraction((textToNumber(number.innerText) / (servings + increment)) * servings)
    })
  }
})

const buttonPlus = document.getElementById('plus')
buttonPlus.addEventListener('click', () => {
  if (servings + increment <= 10) {
    servings += increment
    h2Servings.innerText = `Servings: ${servings}`
    numbers.forEach(number => {
      number.innerText = numberToMixedFraction((textToNumber(number.innerText) / (servings - increment)) * servings)
    })
  }
})

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

  return sum
}

function numberToMixedFraction (number) {
  const numbers = String(number).trim().split('.')
  if (numbers.length > 1) {
    let numerator = Number(numbers[1])
    let denominator = Math.pow(10, numbers[1].length)
    for (let gcd = Math.max(numerator, denominator); gcd > 1; gcd--) {
      if ((numerator % gcd === 0) && (denominator % gcd === 0)) {
        numerator /= gcd
        denominator /= gcd
      }
    }

    if (numbers[0] === '0') {
      return `${numerator}/${denominator}`
    } else {
      return `${numbers[0]} ${numerator}/${denominator}`
    }
  }

  return numbers[0]
}
