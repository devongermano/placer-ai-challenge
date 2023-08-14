import React from "react";
import { LocationProvider } from "./contexts/LocationContext";
import SignupForm from "./components/SignupForm/SignupForm";

const App: React.FC = () => {
  return (
    <LocationProvider>
      <SignupForm />
    </LocationProvider>
  );
};

export default App;
