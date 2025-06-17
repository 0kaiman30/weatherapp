import { ref, onMounted } from 'vue'

const theme = ref<'light' | 'dark'>('light')

export function useTheme() {
  const setTheme = (newTheme: 'light' | 'dark') => {
    theme.value = newTheme
    document.documentElement.className = newTheme
    localStorage.setItem('theme', newTheme)
  }

  const toggleTheme = () => {
    const newTheme = theme.value === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  onMounted(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
    setTheme(saved || 'light')
  })

  return {
    theme,
    toggleTheme,
    setTheme,
  }
}
