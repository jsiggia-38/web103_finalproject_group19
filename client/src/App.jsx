import {
  BrowserRouter,
  Route,
  Routes
} from 'react-router-dom'

import HomePage from './pages/HomePage.jsx'
import PlayerVerificationPage from './pages/PlayerVerificationPage.jsx'
import CompletePlayerProfilePage from './pages/CompletePlayerProfilePage.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/signup/player-verification"
          element={<PlayerVerificationPage />}
        />

        <Route
          path="/signup/player-profile"
          element={<CompletePlayerProfilePage />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App