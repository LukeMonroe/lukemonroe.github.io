function createDivTooltip(divParent, innerText) {
  const divTooltip = document.createElement('div')
  divTooltip.className = 'tooltip'
  divTooltip.innerText = innerText

  var mouseOver = false
  divParent.addEventListener('mouseenter', event => {
    mouseOver = true
    setTimeout(() => {
      if (mouseOver) {
        divTooltip.style.display = 'block'
        if (!divParent.contains(divTooltip)) {
          divParent.appendChild(divTooltip)
        }
      }
    }, 600)
  })
  divParent.addEventListener('mouseleave', event => {
    mouseOver = false
    divTooltip.style.display = 'none'
    if (divParent.contains(divTooltip)) {
      divParent.removeChild(divTooltip)
    }
  })
  divParent.addEventListener('click', event => {
    mouseOver = false
    divTooltip.style.display = 'none'
    if (divParent.contains(divTooltip)) {
      divParent.removeChild(divTooltip)
    }
  })
}

export { createDivTooltip }