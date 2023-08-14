const API_URL = process.env.REACT_APP_UNIVERSAL_API_BASE_URL as string;

export const getTokenConfig = () => ({
  url: `${API_URL}/getaccesstoken`,
  options: {
    headers: {
      Accept: "application/json",
      "api-token": process.env.REACT_APP_UNIVERSAL_API_TOKEN,
      "user-email": process.env.REACT_APP_UNIVERSAL_API_EMAIL,
    },
    retries: 3,
    retryDelay: 1000,
  },
});

export const getStatesConfig = (authToken: string) => ({
  url: `${API_URL}/states/United States`,
  options: {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    retries: 3,
    retryDelay: 1000,
  },
});

export const getCitiesForStateConfig = (
  stateName: string,
  authToken: string,
) => ({
  url: `${API_URL}/cities/${stateName}`,
  options: {
    headers: {
      Authorization: `Bearer ${authToken}`,
      Accept: "application/json",
    },
    retries: 3,
    retryDelay: 2000,
  },
});
