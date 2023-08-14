import React, { createContext, useState, useContext, useEffect } from "react";
import * as LocationService from "../services/LocationService";
import { useFetch } from "../hooks/useFetch";

export interface State {
  stateName: string;
}

export interface City {
  cityName: string;
}

interface LocationContextProps {
  authToken: string | null;
  cities: Record<string, City[]>;
  cityHasNoOptions: (currentState: string) => boolean;
  error: string | null;
  fetchCitiesForState: (stateName: string) => Promise<void>;
  loading: boolean;
  states: State[];
}

const LocationContext = createContext<LocationContextProps>({
  authToken: null,
  cities: {},
  cityHasNoOptions: () => true,
  error: null,
  fetchCitiesForState: async () => {},
  loading: false,
  states: [],
});

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authToken, setAuthToken] = useState<string | null>(
    getFromLocalStorage("authToken"),
  );
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<Record<string, City[]>>({});

  const [loadingState, setLoadingState] = useState<boolean>(false);
  const [errorState, setErrorState] = useState<string | null>(null);

  const { fetcher } = useFetch();

  useEffect(() => {
    fetchAuthToken();
  }, [authToken]);

  useEffect(() => {
    if (authToken && states.length === 0) {
      fetchAvailableStates();
    }
  }, [authToken]);

  const fetchAuthToken = async () => {
    if (!authToken) {
      try {
        setLoadingState(true);
        const data = await fetcher(LocationService.getTokenConfig());
        setToLocalStorage("authToken", data.auth_token);
        setAuthToken(data.auth_token);
      } catch (err) {
        console.error("Error fetching token:", err);
        setErrorState("Error fetching authentication token.");
      } finally {
        setLoadingState(false);
      }
    }
  };

  const fetchAvailableStates = async () => {
    if (!authToken) return;

    try {
      setLoadingState(true);
      const data: { state_name: string }[] = await fetcher(
        LocationService.getStatesConfig(authToken!),
      );
      const parsedStates = data.map((item) => ({ stateName: item.state_name }));
      setStates(parsedStates);
    } catch (err) {
      console.error("Error fetching states:", err);
      setErrorState("Error fetching available states.");
    } finally {
      setLoadingState(false);
    }
  };

  const fetchCitiesForState = async (stateName: string) => {
    if (!authToken) return;

    if (!cities[stateName]) {
      try {
        setLoadingState(true);
        const data = await fetcher(
          LocationService.getCitiesForStateConfig(stateName, authToken),
        );
        const uniqueCityNames: string[] = Array.from(
          new Set(data.map((item: { city_name: string }) => item.city_name)),
        );
        const parsedCities: City[] = uniqueCityNames.map((cityName) => ({
          cityName,
        }));
        setCities((prevCities) => ({
          ...prevCities,
          [stateName]: parsedCities,
        }));
      } catch (err) {
        console.error(`Error fetching cities for state ${stateName}:`, err);
        setErrorState(`Error fetching cities for state ${stateName}.`);
      } finally {
        setLoadingState(false);
      }
    }
  };

  const cityHasNoOptions = (currentState: string) => {
    return cities[currentState] && cities[currentState].length === 0;
  };

  return (
    <LocationContext.Provider
      value={{
        authToken,
        states,
        cities,
        loading: loadingState,
        error: errorState,
        fetchCitiesForState,
        cityHasNoOptions,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextProps => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};

// Utility functions for localStorage
const getFromLocalStorage = (key: string) => {
  return localStorage.getItem(key);
};

const setToLocalStorage = (key: string, value: string) => {
  localStorage.setItem(key, value);
};
