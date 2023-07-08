
let theme = null

const themeButton = document.getElementById('theme')
themeButton.addEventListener('click', changeTheme)

setTheme()

function setTheme () {
  theme = localStorage.getItem('theme')
  if (theme === 'light') {
    lightTheme()
  } else if (theme === 'dark') {
    darkTheme()
  } else {
    lightTheme()
  }
}

function changeTheme () {
  theme = localStorage.getItem('theme')
  if (theme === 'light') {
    darkTheme()
  } else if (theme === 'dark') {
    lightTheme()
  } else {
    lightTheme()
  }
}

function darkTheme () {
  localStorage.setItem('theme', 'dark')
  themeButton.textContent = 'dark'
  document.documentElement.style.setProperty('--background-color', 'black')
}

function lightTheme () {
  localStorage.setItem('theme', 'light')
  themeButton.textContent = 'light'
  document.documentElement.style.setProperty('--background-color', 'ghostwhite')
}
