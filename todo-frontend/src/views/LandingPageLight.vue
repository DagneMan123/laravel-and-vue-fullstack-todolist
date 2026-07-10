<template>
  <div class="landing-container" :class="{ 'dark-mode': themeStore.isDark }">
    <!-- ===== PROFESSIONAL HEADER / NAVBAR ===== -->
    <header class="header">
      <nav class="navbar">
        <div class="nav-wrapper">
          <!-- Logo with Enhanced Branding -->
          <router-link to="/" class="logo">
            <div class="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div class="logo-text">
              <span class="logo-brand">Todo</span>
              <span class="logo-highlight">List</span>
            </div>
            
          </router-link>

          <!-- Desktop Navigation Links -->
          <div class="nav-links">
            <a 
              href="#features" 
              class="nav-link" 
              :class="{ active: activeSection === 'features' }"
              @click.prevent="scrollToSection('features')"
            >
              <span class="nav-icon">✨</span>
              <span>Features</span>
            </a>
            <a 
              href="#how-it-works" 
              class="nav-link"
              :class="{ active: activeSection === 'how-it-works' }"
              @click.prevent="scrollToSection('how-it-works')"
            >
              <span class="nav-icon">🚀</span>
              <span>How It Works</span>
            </a>
            <a 
              href="#faq" 
              class="nav-link"
              :class="{ active: activeSection === 'faq' }"
              @click.prevent="scrollToSection('faq')"
            >
              <span class="nav-icon">💡</span>
              <span>FAQ</span>
            </a>
          </div>

          <!-- Right Actions -->
          <div class="nav-actions">
            <button @click="themeStore.toggleTheme" class="theme-toggle" :title="themeStore.isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
              <span v-if="!themeStore.isDark" class="theme-icon">🌙</span>
              <span v-else class="theme-icon">☀️</span>
            </button>
            
            <router-link to="/login" class="nav-btn login-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>Log In</span>
            </router-link>
            
            <router-link to="/register" class="nav-btn signup-btn">
              <span>Get Started</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </router-link>

            <!-- Mobile Menu Button -->
            <button @click="mobileMenuOpen = !mobileMenuOpen" class="mobile-menu-btn" aria-label="Toggle menu">
              <span class="hamburger-line" :class="{ active: mobileMenuOpen }"></span>
              <span class="hamburger-line" :class="{ active: mobileMenuOpen }"></span>
              <span class="hamburger-line" :class="{ active: mobileMenuOpen }"></span>
            </button>
          </div>
        </div>

        <!-- Mobile Menu -->
        <transition name="slide-down">
          <div v-if="mobileMenuOpen" class="mobile-menu">
            <a href="#features" class="mobile-link" @click.prevent="scrollToSection('features'); mobileMenuOpen = false">
              <span class="mobile-icon">✨</span>
              <span>Features</span>
            </a>
            <a href="#how-it-works" class="mobile-link" @click.prevent="scrollToSection('how-it-works'); mobileMenuOpen = false">
              <span class="mobile-icon">🚀</span>
              <span>How It Works</span>
            </a>
            <a href="#faq" class="mobile-link" @click.prevent="scrollToSection('faq'); mobileMenuOpen = false">
              <span class="mobile-icon">💡</span>
              <span>FAQ</span>
            </a>
            <div class="mobile-divider"></div>
            <router-link to="/login" class="mobile-link mobile-login" @click="mobileMenuOpen = false">
              <span class="mobile-icon">🔑</span>
              <span>Log In</span>
            </router-link>
            <router-link to="/register" class="mobile-link mobile-signup" @click="mobileMenuOpen = false">
              <span class="mobile-icon">🚀</span>
              <span>Get Started</span>
            </router-link>
          </div>
        </transition>
      </nav>
    </header>

    <!-- ===== HERO SECTION ===== -->
    <main class="hero">
      <div class="hero-content">
        <div class="badge">🚀 Smart Task Management</div>
        <h1>Organize Your Life<br><span class="accent">One Task at a Time</span></h1>
        <p class="subtitle">The ultimate todo list app with start dates, due dates, priorities, and calendar view.</p>
        
        <div class="cta-buttons">
          <router-link to="/register" class="btn btn-primary">
            Start Free
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </router-link>
          <button class="btn btn-secondary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Watch Demo
          </button>
        </div>

        <div class="trust-badges">
          <span>⭐ 4.9/5 Rating</span>
          <span>•</span>
          <span>50K+ Tasks Done</span>
          <span>•</span>
          <span>No Credit Card</span>
        </div>
      </div>

      <div class="hero-card">
        <img src="/assests/todolist.png" alt="Todo List Image" class="card-image" />
      </div>
    </main>

    <!-- ===== FEATURES SECTION ===== -->
    <section id="features" class="features-section">
      <div class="section-header">
        <span class="section-badge">Features</span>
        <h2>Everything You Need to Stay Productive</h2>
        <p class="section-subtitle">Built specifically for task management with powerful features</p>
      </div>

      <div class="features-grid">
        <div class="feature-card" v-for="feature in features" :key="feature.title">
          <div class="feature-icon-wrapper" :style="{ background: feature.color }">
            <span class="feature-icon">{{ feature.icon }}</span>
          </div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </div>
      </div>
    </section>

    <!-- ===== HOW IT WORKS ===== -->
    <section id="how-it-works" class="how-it-works">
      <div class="section-header">
        <span class="section-badge">How It Works</span>
        <h2>Manage Tasks in 3 Simple Steps</h2>
        <p class="section-subtitle">From task creation to completion in minutes</p>
      </div>

      <div class="steps">
        <div class="step" v-for="(step, index) in steps" :key="index">
          <div class="step-number">{{ index + 1 }}</div>
          <div class="step-content">
            <h3>{{ step.title }}</h3>
            <p>{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== KEY APP FEATURES ===== -->
    <section class="key-features">
      <div class="section-header">
        <span class="section-badge">Key Features</span>
        <h2>Built for Task Management</h2>
        <p class="section-subtitle">Features designed to make task management effortless</p>
      </div>

      <div class="key-features-grid">
        <div class="key-feature" v-for="feature in keyFeatures" :key="feature.title">
          <div class="key-feature-icon">{{ feature.icon }}</div>
          <div class="key-feature-content">
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== STATS ===== -->
    <section class="stats-section">
      <div class="stats-container">
        <div class="stat-item" v-for="stat in stats" :key="stat.label">
          <div class="stat-number">{{ stat.count }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </section>

    <!-- ===== FAQ SECTION ===== -->
    <section id="faq" class="faq-section">
      <div class="section-header">
        <span class="section-badge">FAQ</span>
        <h2>Frequently Asked Questions</h2>
        <p class="section-subtitle">Everything you need to know about TodoList</p>
      </div>

      <div class="faq-grid">
        <div class="faq-item" v-for="(faq, index) in faqs" :key="index">
          <div class="faq-question" @click="toggleFaq(index)">
            <span>{{ faq.question }}</span>
            <span class="faq-icon">{{ activeFaq === index ? '−' : '+' }}</span>
          </div>
          <transition name="faq-expand">
            <div v-if="activeFaq === index" class="faq-answer">
              <p>{{ faq.answer }}</p>
            </div>
          </transition>
        </div>
      </div>
    </section>

    <!-- ===== CTA SECTION ===== -->
    <section class="cta-section">
      <div class="cta-content">
        <h2>Ready to Get Things Done?</h2>
        <p>Join thousands of users who have transformed their productivity</p>
        <router-link to="/register" class="btn btn-primary cta-btn">Start Free Trial</router-link>
      </div>
    </section>

    <!-- ===== FOOTER ===== -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-brand">
          <div class="logo">
            <div class="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span>TodoList</span>
          </div>
          <p>Simple task management for everyone</p>
        </div>
        <div class="footer-links">
          <div class="footer-column">
            <h4>Product</h4>
            <a href="#features" @click.prevent="scrollToSection('features')">Features</a>
            <a href="#how-it-works" @click.prevent="scrollToSection('how-it-works')">How It Works</a>
            <a href="#">Integrations</a>
          </div>
          
          <div class="footer-column">
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">Contact</a>
            <a href="#">Privacy</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2026 TodoList. All rights reserved.</p>
        
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const mobileMenuOpen = ref(false)
const activeFaq = ref<number | null>(null)
const activeSection = ref('')

// ─── Smooth Scroll Function ───
const scrollToSection = (sectionId: string) => {
  activeSection.value = sectionId
  const element = document.getElementById(sectionId)
  if (element) {
    const offset = 80
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - offset
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

// ─── Detect Active Section on Scroll ───
const handleScroll = () => {
  const sections = ['features', 'how-it-works', 'faq']
  const scrollPosition = window.scrollY + 100

  for (const section of sections) {
    const element = document.getElementById(section)
    if (element) {
      const offsetTop = element.offsetTop
      const offsetBottom = offsetTop + element.offsetHeight
      
      if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
        activeSection.value = section
        break
      }
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// ─── Toggle FAQ ───
const toggleFaq = (index: number) => {
  activeFaq.value = activeFaq.value === index ? null : index
}

// ─── Feature Data ───
const features = [
  {
    icon: '📅',
    title: 'Start & Due Dates',
    description: 'Set start dates and due dates for better task planning and tracking',
    color: 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
  },
  {
    icon: '🎯',
    title: 'Priority Levels',
    description: 'Organize tasks with High, Medium, or Low priority to focus on what matters',
    color: 'linear-gradient(135deg, #f59e0b, #ef4444)'
  },
  {
    icon: '📊',
    title: 'Calendar View',
    description: 'Visualize all your tasks and deadlines in an interactive calendar',
    color: 'linear-gradient(135deg, #10b981, #06b6d4)'
  },
  {
    icon: '🔍',
    title: 'Smart Filters',
    description: 'Search, filter, and sort tasks by status, priority, or date range',
    color: 'linear-gradient(135deg, #8b5cf6, #ec4899)'
  },
  {
    icon: '👥',
    title: 'Task Collaboration',
    description: 'Share tasks and track progress with your team members',
    color: 'linear-gradient(135deg, #06b6d4, #3b82f6)'
  },
  {
    icon: '📱',
    title: 'Responsive Design',
    description: 'Access your tasks anywhere, anytime on any device',
    color: 'linear-gradient(135deg, #10b981, #f59e0b)'
  }
]

// ─── Key App Features ───
const keyFeatures = [
  {
    icon: '✅',
    title: 'Task Management',
    description: 'Create, edit, delete, and complete tasks with one click'
  },
  {
    icon: '📅',
    title: 'Smart Scheduling',
    description: 'Set start dates, due dates, and get reminders'
  },
  {
    icon: '🎯',
    title: 'Priority System',
    description: 'High, Medium, Low priority levels for better organization'
  },
  {
    icon: '📊',
    title: 'Progress Tracking',
    description: 'Visualize your productivity with task completion stats'
  },
  {
    icon: '🔍',
    title: 'Advanced Filters',
    description: 'Filter by status, priority, date, and search tasks'
  },
  {
    icon: '🌙',
    title: 'Dark Mode',
    description: 'Work comfortably in any lighting condition'
  }
]

// ─── Stats Data ───
const stats = [
  { count: '50K+', label: 'Active Users' },
  { count: '1M+', label: 'Tasks Completed' },
  { count: '99.9%', label: 'Uptime' },
  { count: '4.9★', label: 'User Rating' }
]

// ─── Steps Data ───
const steps = [
  {
    title: 'Create Your Account',
    description: 'Sign up in seconds with your email or Google account'
  },
  {
    title: 'Create Your Tasks',
    description: 'Add tasks with titles, descriptions, start dates, due dates, and priority levels'
  },
  {
    title: 'Stay Productive',
    description: 'Track progress, filter tasks, and complete them efficiently'
  }
]

// ─── FAQ Data ───
const faqs = [
  {
    question: 'What is TodoList?',
    answer: 'TodoList is a powerful task management application that helps you organize your tasks with start dates, due dates, priorities, and a calendar view.'
  },
  {
    question: 'Is TodoList free to use?',
    answer: 'Yes! TodoList offers a free plan with up to 10 tasks, basic filters, and calendar view. For unlimited tasks and advanced features, check out our Pro plan.'
  },
  {
    question: 'Can I use TodoList on mobile?',
    answer: 'Absolutely! TodoList is fully responsive and works on all devices including mobile phones, tablets, and desktop computers.'
  },
  {
    question: 'How do start dates and due dates work?',
    answer: 'Start dates help you plan when to begin a task, while due dates are when the task needs to be completed. This helps you better manage your workflow.'
  }
]
</script>

<style scoped>
/* ─── Reset & Base ─── */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.landing-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
  color: #333;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.landing-container.dark-mode {
  background: linear-gradient(135deg, #0f1419 0%, #1a1f2e 100%);
  color: #e0e0e0;
}

/* ─── Header / Navbar ─── */
.header {
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.92);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  padding: 0.5rem 2.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.landing-container.dark-mode .navbar {
  background: rgba(15, 20, 25, 0.92);
  border-bottom-color: rgba(139, 92, 246, 0.12);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.nav-wrapper {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 72px;
  gap: 2rem;
}

/* ─── Logo ─── */
.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  flex-shrink: 0;
}

.logo:hover {
  transform: scale(1.02);
}

.logo-icon {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 0.65rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
}

.logo:hover .logo-icon {
  box-shadow: 0 6px 24px rgba(59, 130, 246, 0.4);
  transform: rotate(-5deg);
}

.logo-icon svg {
  width: 22px;
  height: 22px;
  stroke-width: 2.5;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  gap: 1px;
}

.logo-brand {
  color: #1f2937;
}

.landing-container.dark-mode .logo-brand {
  color: #f0f0f0;
}

.logo-highlight {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo-badge {
  font-size: 0.55rem;
  font-weight: 600;
  padding: 0.15rem 0.6rem;
  background: rgba(59, 130, 246, 0.12);
  color: #3b82f6;
  border-radius: 50px;
  letter-spacing: 0.3px;
  margin-left: 0.25rem;
  border: 1px solid rgba(59, 130, 246, 0.15);
}

.landing-container.dark-mode .logo-badge {
  background: rgba(139, 92, 246, 0.15);
  color: #a78bfa;
  border-color: rgba(139, 92, 246, 0.2);
}

/* ─── Navigation Links ─── */
.nav-links {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  background: rgba(0, 0, 0, 0.03);
  padding: 0.3rem;
  border-radius: 0.75rem;
  flex: 1;
  justify-content: center;
}

.landing-container.dark-mode .nav-links {
  background: rgba(255, 255, 255, 0.04);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 1.4rem;
  border-radius: 0.5rem;
  color: #666;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  white-space: nowrap;
}

.landing-container.dark-mode .nav-link {
  color: #a0a0a0;
}

.nav-link .nav-icon {
  font-size: 0.95rem;
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.nav-link:hover .nav-icon {
  opacity: 1;
}

.nav-link:hover {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.08);
  transform: translateY(-1px);
}

.landing-container.dark-mode .nav-link:hover {
  color: #a78bfa;
  background: rgba(139, 92, 246, 0.1);
}

.nav-link.active {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.12);
  font-weight: 600;
}

.landing-container.dark-mode .nav-link.active {
  color: #a78bfa;
  background: rgba(139, 92, 246, 0.15);
}

.nav-link.active .nav-icon {
  opacity: 1;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2.5px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 2px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 50%;
}

/* ─── Nav Actions ─── */
.nav-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-shrink: 0;
}

.theme-toggle {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  position: relative;
}

.theme-toggle:hover {
  background: rgba(0, 0, 0, 0.06);
  transform: scale(1.05) rotate(10deg);
}

.landing-container.dark-mode .theme-toggle:hover {
  background: rgba(255, 255, 255, 0.06);
}

.theme-icon {
  transition: transform 0.3s ease;
}

.theme-toggle:hover .theme-icon {
  transform: scale(1.1);
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.65rem 1.6rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  cursor: pointer;
  white-space: nowrap;
}

.nav-btn svg {
  width: 18px;
  height: 18px;
  transition: transform 0.3s ease;
}

.login-btn {
  color: #666;
  background: transparent;
  border: 1.5px solid transparent;
}

.landing-container.dark-mode .login-btn {
  color: #a0a0a0;
}

.login-btn:hover {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.06);
  border-color: rgba(59, 130, 246, 0.15);
  transform: translateY(-1px);
}

.login-btn:hover svg {
  transform: translateX(-2px);
}

.signup-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3);
}

.signup-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(59, 130, 246, 0.4);
}

.signup-btn:hover svg {
  transform: translateX(2px);
}

.signup-btn:active {
  transform: translateY(0);
}

/* ─── Mobile Menu Button ─── */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.mobile-menu-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}

.landing-container.dark-mode .mobile-menu-btn:hover {
  background: rgba(255, 255, 255, 0.05);
}

.hamburger-line {
  display: block;
  width: 24px;
  height: 2.5px;
  background: #333;
  border-radius: 3px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}

.landing-container.dark-mode .hamburger-line {
  background: #e0e0e0;
}

.hamburger-line.active:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger-line.active:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.hamburger-line.active:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

/* ─── Mobile Menu ─── */
.mobile-menu {
  display: none;
  flex-direction: column;
  padding: 1rem 2rem 1.5rem;
  background: rgba(255, 255, 255, 0.98);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
}

.landing-container.dark-mode .mobile-menu {
  background: rgba(15, 20, 25, 0.98);
  border-top-color: rgba(139, 92, 246, 0.08);
}

.mobile-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 0;
  color: #666;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
}

.landing-container.dark-mode .mobile-link {
  color: #a0a0a0;
  border-bottom-color: rgba(139, 92, 246, 0.05);
}

.mobile-link:last-of-type {
  border-bottom: none;
}

.mobile-link:hover {
  color: #3b82f6;
  padding-left: 0.75rem;
}

.mobile-icon {
  font-size: 1.1rem;
  width: 30px;
  text-align: center;
  flex-shrink: 0;
}

.mobile-divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.06);
  margin: 0.5rem 0 0.25rem;
}

.landing-container.dark-mode .mobile-divider {
  background: rgba(139, 92, 246, 0.08);
}

.mobile-login {
  color: #666;
}

.landing-container.dark-mode .mobile-login {
  color: #a0a0a0;
}

.mobile-login:hover {
  color: #3b82f6 !important;
}

.mobile-signup {
  color: #3b82f6;
  font-weight: 600;
}

.landing-container.dark-mode .mobile-signup {
  color: #a78bfa;
}

/* ─── Slide Down Animation ─── */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ─── Hero Section ─── */
.hero {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
  width: 100%;
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.badge {
  display: inline-block;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: #3b82f6;
  padding: 0.6rem 1.2rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 600;
  width: fit-content;
}

.landing-container.dark-mode .badge {
  background: rgba(139, 92, 246, 0.1);
  border-color: rgba(139, 92, 246, 0.3);
  color: #a78bfa;
}

h1 {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1.2;
  color: #1f2937;
}

.landing-container.dark-mode h1 {
  color: #f0f0f0;
}

.accent {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 1.125rem;
  color: #666;
  line-height: 1.6;
  max-width: 400px;
}

.landing-container.dark-mode .subtitle {
  color: #a0a0a0;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.95rem;
}

.btn svg {
  width: 20px;
  height: 20px;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

.btn-secondary {
  background: white;
  color: #333;
  border: 2px solid #e5e7eb;
}

.landing-container.dark-mode .btn-secondary {
  background: #1a1f2e;
  color: #e0e0e0;
  border-color: rgba(139, 92, 246, 0.3);
}

.btn-secondary:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.trust-badges {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #666;
  margin-top: 1rem;
}

.landing-container.dark-mode .trust-badges {
  color: #a0a0a0;
}

.hero-card {
  background: white;
  border-radius: 1rem;
  padding: 0;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.hero-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(59, 130, 246, 0.15);
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  min-height: 400px;
}

.landing-container.dark-mode .hero-card {
  background: #1a1f2e;
  border-color: rgba(139, 92, 246, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

/* ─── Section Header ─── */
.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-badge {
  display: inline-block;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  padding: 0.4rem 1rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
}

.landing-container.dark-mode .section-badge {
  background: rgba(139, 92, 246, 0.1);
  border-color: rgba(139, 92, 246, 0.2);
  color: #a78bfa;
}

.section-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
}

.landing-container.dark-mode .section-header h2 {
  color: #f0f0f0;
}

.section-subtitle {
  color: #666;
  font-size: 1.1rem;
  margin-top: 0.5rem;
}

.landing-container.dark-mode .section-subtitle {
  color: #a0a0a0;
}

/* ─── Features Section ─── */
.features-section {
  max-width: 1200px;
  margin: 4rem auto;
  padding: 2rem;
  width: 100%;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  transition: all 0.3s;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.landing-container.dark-mode .feature-card {
  background: #1a1f2e;
  border-color: rgba(139, 92, 246, 0.15);
}

.feature-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(59, 130, 246, 0.1);
  border-color: #3b82f6;
}

.feature-icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.feature-icon {
  font-size: 1.5rem;
  color: white;
}

.feature-card h3 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: #1f2937;
}

.landing-container.dark-mode .feature-card h3 {
  color: #f0f0f0;
}

.feature-card p {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
}

.landing-container.dark-mode .feature-card p {
  color: #a0a0a0;
}

/* ─── How It Works ─── */
.how-it-works {
  max-width: 1200px;
  margin: 4rem auto;
  padding: 2rem;
  width: 100%;
}

.steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.step {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  padding: 1.5rem;
  background: white;
  border-radius: 1rem;
  border: 1px solid #e5e7eb;
  transition: all 0.3s;
}

.landing-container.dark-mode .step {
  background: #1a1f2e;
  border-color: rgba(139, 92, 246, 0.15);
}

.step:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.1);
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.step-content h3 {
  font-size: 1.1rem;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.landing-container.dark-mode .step-content h3 {
  color: #f0f0f0;
}

.step-content p {
  color: #666;
  font-size: 0.9rem;
}

.landing-container.dark-mode .step-content p {
  color: #a0a0a0;
}

/* ─── Key Features ─── */
.key-features {
  max-width: 1200px;
  margin: 4rem auto;
  padding: 2rem;
  width: 100%;
}

.key-features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.key-feature {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: white;
  border-radius: 1rem;
  border: 1px solid #e5e7eb;
  transition: all 0.3s;
}

.landing-container.dark-mode .key-feature {
  background: #1a1f2e;
  border-color: rgba(139, 92, 246, 0.15);
}

.key-feature:hover {
  transform: translateX(4px);
  border-color: #3b82f6;
}

.key-feature-icon {
  font-size: 2rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 0.8rem;
  flex-shrink: 0;
}

.landing-container.dark-mode .key-feature-icon {
  background: rgba(139, 92, 246, 0.1);
}

.key-feature-content h3 {
  font-size: 1rem;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.landing-container.dark-mode .key-feature-content h3 {
  color: #f0f0f0;
}

.key-feature-content p {
  color: #666;
  font-size: 0.85rem;
}

.landing-container.dark-mode .key-feature-content p {
  color: #a0a0a0;
}

/* ─── Stats Section ─── */
.stats-section {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  padding: 4rem 2rem;
  width: 100%;
}

.stats-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
  text-align: center;
}

.stat-item {
  color: white;
}

.stat-number {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 1rem;
  opacity: 0.8;
}

/* ─── FAQ Section ─── */
.faq-section {
  max-width: 800px;
  margin: 4rem auto;
  padding: 2rem;
  width: 100%;
}

.faq-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.faq-item {
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  transition: all 0.3s;
}

.landing-container.dark-mode .faq-item {
  background: #1a1f2e;
  border-color: rgba(139, 92, 246, 0.15);
}

.faq-item:hover {
  border-color: #3b82f6;
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  cursor: pointer;
  font-weight: 600;
  color: #1f2937;
  transition: all 0.3s;
}

.landing-container.dark-mode .faq-question {
  color: #f0f0f0;
}

.faq-question:hover {
  background: rgba(59, 130, 246, 0.05);
}

.faq-icon {
  font-size: 1.25rem;
  color: #3b82f6;
}

.faq-answer {
  padding: 0 1.5rem 1.5rem;
  color: #666;
  line-height: 1.6;
}

.landing-container.dark-mode .faq-answer {
  color: #a0a0a0;
}

.faq-expand-enter-active,
.faq-expand-leave-active {
  transition: all 0.3s ease;
}

.faq-expand-enter-from,
.faq-expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.faq-expand-enter-to,
.faq-expand-leave-from {
  opacity: 1;
  max-height: 500px;
}

/* ─── CTA Section ─── */
.cta-section {
  background: linear-gradient(135deg, #0f1419 0%, #1a1f2e 100%);
  padding: 4rem 2rem;
  width: 100%;
}

.cta-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  color: white;
}

.cta-content h2 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.cta-content p {
  font-size: 1.1rem;
  opacity: 0.8;
  margin-bottom: 2rem;
}

.cta-btn {
  padding: 1rem 3rem;
  font-size: 1.1rem;
}

/* ─── Footer ─── */
.footer {
  background: #0f1419;
  color: #a0a0a0;
  padding: 3rem 2rem 1.5rem;
  width: 100%;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-brand .logo {
  color: white;
  margin-bottom: 0.5rem;
  text-decoration: none;
}

.footer-brand .logo .logo-icon {
  width: 32px;
  height: 32px;
}

.footer-brand p {
  font-size: 0.9rem;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.footer-column h4 {
  color: white;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
}

.footer-column a {
  display: block;
  color: #a0a0a0;
  text-decoration: none;
  padding: 0.25rem 0;
  font-size: 0.85rem;
  transition: color 0.3s;
  cursor: pointer;
}

.footer-column a:hover {
  color: #3b82f6;
}

.footer-bottom {
  max-width: 1200px;
  margin: 1.5rem auto 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-links a {
  color: #a0a0a0;
  text-decoration: none;
  font-size: 1.2rem;
  transition: color 0.3s;
}

.social-links a:hover {
  color: #3b82f6;
}

/* ─── Responsive ─── */
@media (max-width: 1024px) {
  .nav-links {
    display: none;
  }
  
  .mobile-menu-btn {
    display: flex;
  }
  
  .mobile-menu {
    display: flex;
  }

  .nav-actions .login-btn span {
    display: none;
  }
  
  .nav-actions .signup-btn span {
    display: none;
  }
  
  .signup-btn {
    padding: 0.6rem 0.8rem;
  }
  
  .login-btn {
    padding: 0.6rem 0.8rem;
  }

  .navbar {
    padding: 0.5rem 1.5rem;
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 0.5rem 1rem;
  }

  .nav-wrapper {
    height: 64px;
    gap: 1rem;
  }

  .logo-text {
    font-size: 1.1rem;
  }

  .logo-icon {
    width: 38px;
    height: 38px;
  }

  .logo-icon svg {
    width: 18px;
    height: 18px;
  }

  .logo-badge {
    display: none;
  }

  .mobile-menu {
    padding: 1rem 1.25rem 1.25rem;
  }

  .theme-toggle {
    width: 38px;
    height: 38px;
    font-size: 1.1rem;
  }

  .login-btn {
    padding: 0.5rem 0.7rem;
  }

  .signup-btn {
    padding: 0.5rem 0.7rem;
  }

  .signup-btn svg {
    width: 16px;
    height: 16px;
  }

  .login-btn svg {
    width: 16px;
    height: 16px;
  }

  .mobile-menu-btn {
    width: 38px;
    height: 38px;
  }

  .hamburger-line {
    width: 20px;
    height: 2px;
  }

  .hero {
    grid-template-columns: 1fr;
    padding: 2rem 1rem;
  }

  h1 {
    font-size: 1.75rem;
  }

  .features-grid,
  .key-features-grid {
    grid-template-columns: 1fr;
  }

  .steps {
    grid-template-columns: 1fr;
  }

  .stats-container {
    grid-template-columns: repeat(2, 1fr);
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-links {
    grid-template-columns: repeat(2, 1fr);
  }

  .cta-buttons {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }

  .cta-content h2 {
    font-size: 1.75rem;
  }

  .faq-section {
    padding: 0 1rem;
  }
}

@media (max-width: 480px) {
  .footer-links {
    grid-template-columns: 1fr;
  }

  .stats-container {
    grid-template-columns: 1fr 1fr;
  }

  .nav-wrapper {
    height: 56px;
  }

  .logo-icon {
    width: 32px;
    height: 32px;
  }

  .logo-text {
    font-size: 0.95rem;
  }

  .login-btn {
    padding: 0.4rem 0.5rem;
  }

  .signup-btn {
    padding: 0.4rem 0.5rem;
  }

  .theme-toggle {
    width: 32px;
    height: 32px;
    font-size: 0.9rem;
  }

  .mobile-menu-btn {
    width: 32px;
    height: 32px;
  }

  .hamburger-line {
    width: 18px;
    height: 2px;
  }
}
</style>