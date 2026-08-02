import { BrowserRouter, Route, Routes } from 'react-router-dom'

import PlayerVerificationPage from './pages/PlayerVerificationPage.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<PlayerVerificationPage />}
        />

        <Route
          path="/signup/player-verification"
          element={<PlayerVerificationPage />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App