const themeBtn = document.getElementById('theme-btn')
const body = document.body
const icon = themeBtn.querySelector('i')

const savedTheme = localStorage.getItem('theme')
if (savedTheme === 'light') {
  body.classList.add('light-mode')
  icon.classList.replace('fa-moon', 'fa-sun')
}

themeBtn.addEventListener('click', () => {
  body.classList.toggle('light-mode')

  if (body.classList.contains('light-mode')) {
    icon.classList.replace('fa-moon', 'fa-sun')
    localStorage.setItem('theme', 'light')
  } else {
    icon.classList.replace('fa-sun', 'fa-moon')
    localStorage.setItem('theme', 'dark')
  }
})
