import { createDivTooltip } from './tooltips.js'

function createH1(innerText) {
  const h1 = document.createElement('h1')
  h1.innerText = innerText

  return h1
}

function createH2(innerText) {
  const h2 = document.createElement('h2')
  h2.innerText = innerText

  return h2
}

function createH3(innerText) {
  const h3 = document.createElement('h3')
  h3.innerText = innerText

  return h3
}

function createH4(innerText) {
  const h4 = document.createElement('h4')
  h4.innerText = innerText

  return h4
}

function createH5(innerText) {
  const h5 = document.createElement('h5')
  h5.innerText = innerText

  return h5
}

function createH6(innerText) {
  const h6 = document.createElement('h6')
  h6.innerText = innerText

  return h6
}

function createDivColorText(innerText) {
  const divColorText = document.createElement('div')
  divColorText.className = 'color-text'
  divColorText.innerText = innerText
  createDivTooltip(divColorText, 'copy')
  divColorText.addEventListener('click', () => {
    navigator.clipboard.writeText(divColorText.innerText)

    const divCopied = document.createElement('div')
    divCopied.className = 'copied'
    divCopied.appendChild(createH4('Copied to clipboard'))
    document.body.appendChild(divCopied)
    setTimeout(function () {
      divCopied.style.opacity = '1'
    }, 10)
    setTimeout(function () {
      divCopied.style.opacity = '0'
    }, 3000)
    setTimeout(function () {
      document.body.removeChild(divCopied)
    }, 3800)
  })

  return divColorText
}

export { createH1, createH2, createH3, createH4, createH5, createH6, createDivColorText }