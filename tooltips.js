function createDivTooltip(divParent, innerText) {
  const divTooltip = document.createElement('div')
  divTooltip.className = 'tooltip'
  divTooltip.innerText = innerText

  divParent.appendChild(divTooltip)
  divParent.addEventListener('mouseenter', () => {
    divTooltip.style.display = 'block'
  })
  divParent.addEventListener('mouseleave', () => {
    divTooltip.style.display = 'none'
  })
  divParent.addEventListener('click', () => {
    divTooltip.style.display = 'none'
  })
}

export { createDivTooltip }