function createDivTooltip(divParent, innerText) {
  const divTooltip = document.createElement('div')
  divTooltip.className = 'tooltip'
  divTooltip.innerText = innerText

  var mouseOver = false
  divParent.appendChild(divTooltip)
  divParent.addEventListener('mouseenter', () => {
    mouseOver = true
    setTimeout(function () {
      if (mouseOver) {
        divTooltip.style.display = 'block'
      }
    }, 600)
  })
  divParent.addEventListener('mouseleave', () => {
    mouseOver = false
    divTooltip.style.display = 'none'
  })
  divParent.addEventListener('click', () => {
    mouseOver = false
    divTooltip.style.display = 'none'
  })
}

export { createDivTooltip }