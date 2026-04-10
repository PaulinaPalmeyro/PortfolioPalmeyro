import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import { App } from './App'
import { PageTransitionProvider } from './context/PageTransitionContext'
import { ShellLayout } from './layouts/ShellLayout'
import { SectionView } from './pages/SectionView'

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <BrowserRouter>
      <PageTransitionProvider>
        <Routes>
          <Route element={<ShellLayout />}>
            <Route path="/" element={<App />} />
            <Route path="/seccion/:slug" element={<SectionView />} />
          </Route>
        </Routes>
      </PageTransitionProvider>
    </BrowserRouter>
  </StrictMode>,
)
