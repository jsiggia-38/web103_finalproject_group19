const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3001";

export async function apiRequest(
  endpoint,
  options = {},
) {
  const authToken =
    sessionStorage.getItem("authToken");

  const requestHeaders = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (authToken) {
    requestHeaders.Authorization =
      `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...options,
        headers: requestHeaders,
      },
    );

    const data = await response
      .json()
      .catch(() => null);

    if (!response.ok) {
      throw new Error(
        data?.message ||
          "The request could not be completed.",
      );
    }

    return data;
  } catch (error) {
    console.error(
      `API request failed for ${endpoint}:`,
      error,
    );

    throw error;
  }
}