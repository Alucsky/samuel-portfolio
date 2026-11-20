const root = document.documentElement

// Tema claro/escuro
const themeBtn = document.getElementById('theme-btn')
themeBtn.addEventListener('click', () => {
  const light = root.classList.toggle('light')
  try {
    localStorage.setItem('theme', light ? 'light' : 'dark')
  } catch (e) {}
})

// Barra de progresso da rolagem
const scrollProgress = document.querySelector('.scroll-progress')
const updateProgress = () => {
  const total = document.documentElement.scrollHeight - window.innerHeight
  const pct = total > 0 ? (window.scrollY / total) * 100 : 0
  scrollProgress.style.width = `${pct}%`
}
window.addEventListener('scroll', updateProgress, { passive: true })
updateProgress()

// Revelar blocos ao entrar na tela
const items = document.querySelectorAll('.reveal')
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in')
          io.unobserve(entry.target)
        }
      })
    },
    { rootMargin: '0px 0px -8% 0px' },
  )
  items.forEach((el) => io.observe(el))
} else {
  items.forEach((el) => el.classList.add('in'))
}
