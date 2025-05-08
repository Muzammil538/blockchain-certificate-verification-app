import { BrowserRouter as Router, Routes, Route } from 'react-router'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Upload from './pages/Upload'
import Verify from './pages/Verify'
import Display from './pages/Display'

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/display/:id" element={<Display />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App