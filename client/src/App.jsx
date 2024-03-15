import { Routes, Route } from 'react-router-dom'
import './App.css'
import MainVideoPage from './components/videoComponents/MainVideoPage'
import Dashboard from './components/dashboard/Dashboard'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/join-video/:id" element={<MainVideoPage />} />
      </Routes>
    </>
  )
}

export default App
