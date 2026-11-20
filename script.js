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

// Sticky scroll da seção de trabalhos
const cases = [...document.querySelectorAll('.case[data-step]')]
const stage = document.querySelector('.case-stage')
if (cases.length && stage) {
  const panels = stage.querySelector('.stage-panels')
  const count = stage.querySelector('.stage-count b')
  const label = stage.querySelector('.stage-label')
  const progress = stage.querySelector('.stage-progress')
  progress.style.gridTemplateColumns = `repeat(${cases.length}, 1fr)`
  const bars = cases.map((c, k) => {
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.setAttribute('aria-label', `Ir para o caso ${k + 1}`)
    btn.appendChild(document.createElement('i'))
    progress.appendChild(btn)
    return btn
  })
  const total = stage.querySelector('.stage-total')
  if (total) total.textContent = String(cases.length).padStart(2, '0')
  const clones = cases.map((c) => {
    const fig = c.querySelector('.case-visual').cloneNode(true)
    fig.className = 'stage-panel'
    panels.appendChild(fig)
    return fig
  })

  const setActive = (i) => {
    cases.forEach((c, k) => c.classList.toggle('is-active', k === i))
    clones.forEach((f, k) => {
      if (k === i && !f.classList.contains('is-active')) {
        // reinicia as animações das peças ao voltar para o caso
        f.classList.remove('is-active')
        void f.offsetWidth
      }
      f.classList.toggle('is-active', k === i)
    })
    bars.forEach((b, k) => b.classList.toggle('on', k <= i))
    count.textContent = String(i + 1).padStart(2, '0')
    label.textContent = cases[i].dataset.label
  }
  setActive(0)

  // barras de progresso levam ao caso
  bars.forEach((b, k) =>
    b.addEventListener('click', () => {
      const r = cases[k].getBoundingClientRect()
      window.scrollTo({ top: window.scrollY + r.top + r.height / 2 - window.innerHeight / 2, behavior: 'smooth' })
    }),
  )

  // painéis do palco são decorativos para leitores de tela (o texto já está nos casos)
  clones.forEach((f) => f.setAttribute('aria-hidden', 'true'))

  // quem pede menos movimento não vê animações SMIL
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.case-visual svg, .stage-panel svg').forEach((svg) => svg.pauseAnimations && svg.pauseAnimations())
  }

  // no celular o diagrama fica dentro de cada caso: anima quando ele aparece
  // e continua visível depois, mesmo que o caso seguinte já esteja ativo
  const figs = cases.map((c) => c.querySelector('.case-visual'))
  if ('IntersectionObserver' in window) {
    const seen = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-seen')
            seen.unobserve(e.target)
          }
        })
      },
      { threshold: 0.3 },
    )
    figs.forEach((f) => seen.observe(f))
  } else {
    figs.forEach((f) => f.classList.add('is-seen'))
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(cases.indexOf(e.target))
        })
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    cases.forEach((c) => io.observe(c))
  } else {
    cases.forEach((c) => c.classList.add('is-active'))
  }
}
