import { BrowserRouter, Route, Routes } from 'react-router-dom'

// Layout components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

// Route protection
import ProtectedRoute from './components/auth/ProtectedRoute'
import SignupFlowGuard from './components/auth/SignupFlowGuard'

// Public pages
import HomePage from './pages/HomePage'
import PlayersPage from './pages/PlayersPage'
import PlayerDetailsPage from './pages/PlayerDetailsPage'
import TeamsPage from './pages/TeamsPage'
import TeamDetailsPage from './pages/TeamDetailsPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import NotFoundPage from './pages/NotFoundPage'

// Player signup flow pages
import PlayerVerificationPage from './pages/PlayerVerificationPage'
import CompletePlayerProfilePage from './pages/CompletePlayerProfilePage'

// Authenticated player pages
import EditPlayerPage from './pages/EditPlayerPage'
import InvitationsPage from './pages/InvitationsPage'

// Coach / Captain pages
import ScoutListPage from './pages/ScoutListPage'

// Organizer pages
import CreateTeamPage from './pages/CreateTeamPage'
import EditTeamPage from './pages/EditTeamPage'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />

        <main className="app-main">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />

            <Route path="/players" element={<PlayersPage />} />
            <Route
              path="/players/:playerId"
              element={<PlayerDetailsPage />}
            />

            <Route path="/teams" element={<TeamsPage />} />
            <Route
              path="/teams/:teamId"
              element={<TeamDetailsPage />}
            />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* 
              Player registration flow

              Step 1:
              The user begins at /signup and selects Student Player.

              Step 2:
              SignupPage stores the pending signup data in sessionStorage
              and sends the user to /signup/player-verification.

              Step 3:
              After verification, the verification record is also stored
              temporarily and the user continues to
              /signup/player-profile.

              Step 4:
              The final page sends the complete player signup request to
              the backend. The backend creates the user, player profile,
              and statistics in one database transaction.
            */}

            <Route
              path="/signup/player-verification"
              element={
                <SignupFlowGuard requiredStep="signup">
                  <PlayerVerificationPage />
                </SignupFlowGuard>
              }
            />

            <Route
              path="/signup/player-profile"
              element={
                <SignupFlowGuard requiredStep="verification">
                  <CompletePlayerProfilePage />
                </SignupFlowGuard>
              }
            />

            {/* Authenticated player routes */}
            <Route
              path="/players/:playerId/edit"
              element={
                <ProtectedRoute allowedRoles={['Player']}>
                  <EditPlayerPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/invitations"
              element={
                <ProtectedRoute allowedRoles={['Player']}>
                  <InvitationsPage />
                </ProtectedRoute>
              }
            />

            {/* Coach and captain routes */}
            <Route
              path="/scout-list"
              element={
                <ProtectedRoute allowedRoles={['Coach', 'Captain']}>
                  <ScoutListPage />
                </ProtectedRoute>
              }
            />

            {/* Club organizer routes */}
            <Route
              path="/teams/new"
              element={
                <ProtectedRoute allowedRoles={['Organizer']}>
                  <CreateTeamPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/teams/:teamId/edit"
              element={
                <ProtectedRoute allowedRoles={['Organizer']}>
                  <EditTeamPage />
                </ProtectedRoute>
              }
            />

            {/* 404 route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App