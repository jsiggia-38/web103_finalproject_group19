import {
  BrowserRouter,
  Route,
  Routes
} from 'react-router-dom'

import HomePage from './pages/HomePage.jsx'
import PlayerVerificationPage from './pages/PlayerVerificationPage.jsx'
import CompletePlayerProfilePage from './pages/CompletePlayerProfilePage.jsx'
import PlayerDetailsPage from "./pages/PlayerDetailsPage.jsx";
import EditPlayerPage from "./pages/EditPlayerPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import CoachDashboardPage from "./pages/CoachDashboardPage.jsx";
import OrganizerDashboardPage from "./pages/OrganizerDashboardPage.jsx";

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
         <Route
         path="/players/:playerId"
         element={<PlayerDetailsPage />}
      />

      <Route
         path="/players/:playerId/edit"
         element={<EditPlayerPage />}
      />
      <Route
         path="/signup"
         element={<SignupPage />}
      />

      <Route
  path="/login"
  element={<LoginPage />}
/>

<Route
  path="/dashboard/coach"
  element={<CoachDashboardPage />}
/>

<Route
  path="/dashboard/organizer"
  element={<OrganizerDashboardPage />}
/>
      </Routes>

     
    </BrowserRouter>
  )
}

export default App