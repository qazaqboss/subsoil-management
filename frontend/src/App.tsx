import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import Dashboard from './pages/Dashboard'
import LicensesList from './pages/LicensesList'
import LicenseDetail from './pages/LicenseDetail'
import Calendar from './pages/Calendar'
import WellsList from './pages/WellsList'
import WellDetail from './pages/WellDetail'
import Contractors from './pages/Contractors'
import Tests from './pages/Tests'
import Reports from './pages/Reports'
import AIAssistant from './pages/AIAssistant'
import Settings from './pages/Settings'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="licenses" element={<LicensesList />} />
          <Route path="licenses/:id" element={<LicenseDetail />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="wells" element={<WellsList />} />
          <Route path="wells/:id" element={<WellDetail />} />
          <Route path="contractors" element={<Contractors />} />
          <Route path="tests" element={<Tests />} />
          <Route path="reports" element={<Reports />} />
          <Route path="ai-assistant" element={<AIAssistant />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
