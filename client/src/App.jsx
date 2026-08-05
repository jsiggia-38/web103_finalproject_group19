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
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import PlayerOwnerRoute from "./components/auth/PlayerOwnerRoute.jsx";
import PlayersPage from "./pages/PlayersPage.jsx";
import CreateTeamPage from "./pages/CreateTeamPage.jsx";
import ScoutListPage from "./pages/ScoutListPage.jsx";
import TeamsPage from "./pages/TeamsPage.jsx";
import TeamDetailsPage from "./pages/TeamDetailsPage.jsx";
import AIAssistantPage from "./pages/AIAssistantPage.jsx";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
  path="/ai-assistant"
  element={<AIAssistantPage />}
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
  element={
    <PlayerOwnerRoute>
      <EditPlayerPage />
    </PlayerOwnerRoute>
  }
/>

<Route
  path="/players"
  element={<PlayersPage />}
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
  element={
    <ProtectedRoute
      allowedRoles={["Coach"]}
    >
      <CoachDashboardPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/dashboard/organizer"
  element={
    <ProtectedRoute
      allowedRoles={["Organizer"]}
    >
      <OrganizerDashboardPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/teams"
  element={<TeamsPage />}
/>

<Route
  path="/teams/create"
  element={
    <ProtectedRoute
      allowedRoles={["Organizer"]}
    >
      <CreateTeamPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/teams/:teamId"
  element={<TeamDetailsPage />}
/>

<Route
  path="/scout-list"
  element={
    <ProtectedRoute
      allowedRoles={["Coach"]}
    >
      <ScoutListPage />
    </ProtectedRoute>
  }
/>


      </Routes>

     
    </BrowserRouter>
  )
}

export default App