function openTab (tabName) {
  const tabContent = document.getElementsByClassName('tab-content')
  for (let i = 0; i < tabContent.length; i++) {
    tabContent[i].style.display = 'none'
  }

  document.getElementById(tabName).style.display = 'flex'
}

function initEmail () {
  emailjs.init('I4v5nKkBfKnOtb346')
  document.getElementById('contact-form').addEventListener('submit', sendEmail)
}

function sendEmail (event) {
  event.preventDefault()
  emailjs.sendForm('contact_service', 'contact_form', document.getElementById('contact-form'))
    .then(function (response) {
      console.log('SUCCESS:', response.status, response.text)
    }, function (error) {
      console.log('FAILED:', error)
    })

  clearForm()
  sendAnimation()
}

function clearForm () {
  document.getElementById('first-name').value = ''
  document.getElementById('last-name').value = ''
  document.getElementById('phone').value = ''
  document.getElementById('email').value = ''
  document.getElementById('message').value = ''
}

function sendAnimation () {
  const element = document.getElementById('checkmark')
  element.style.visibility = 'visible'
  element.style.animation = 'fade-in 2s'
  element.style.left = '87%'
  element.style.transform = 'translate(0%, -52%) rotate(720deg)'
  element.style.transition = '2s'

  setTimeout(() => {
    const element = document.getElementById('send')
    element.value = 'Message sent successfully!'
  }, 2000)

  setTimeout(() => {
    const element = document.getElementById('checkmark')
    element.style.visibility = 'hidden'
    element.style.animation = 'fade-out 2s'
    element.style.left = '0%'
    element.style.transform = 'translate(0%, -52%) rotate(-720deg)'
    element.style.transition = '2s'
  }, 5000)

  setTimeout(() => {
    const element = document.getElementById('send')
    element.value = 'Send'
  }, 7000)
}

export { openTab, initEmail }
