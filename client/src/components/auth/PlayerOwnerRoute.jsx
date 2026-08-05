import {
  Navigate,
  useParams,
} from "react-router-dom";

const getAuthenticatedUser = () => {
  try {
    const storedUser =
      sessionStorage.getItem(
        "authenticatedUser",
      );

    return storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch (error) {
    console.error(
      "Unable to read authenticated user:",
      error,
    );

    return null;
  }
};

function PlayerOwnerRoute({
  children,
}) {
  const { playerId } = useParams();

  const authToken =
    sessionStorage.getItem("authToken");

  const user = getAuthenticatedUser();

  if (!authToken || !user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (
    user.role !== "Player" ||
    !user.playerId
  ) {
    if (user.role === "Coach") {
      return (
        <Navigate
          to="/dashboard/coach"
          replace
        />
      );
    }

    if (user.role === "Organizer") {
      return (
        <Navigate
          to="/dashboard/organizer"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  if (
    Number(playerId) !==
    Number(user.playerId)
  ) {
    return (
      <Navigate
        to={`/players/${user.playerId}`}
        replace
      />
    );
  }

  return children;
}

export default PlayerOwnerRoute;