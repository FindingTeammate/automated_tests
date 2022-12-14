import { useState } from "react";
import { useContext, createContext } from "react";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [authDetails, setAuthDetails] = useState(() => {
    const authInStorage = window.localStorage.getItem("@auth") || null;
    if (authInStorage) {
      return JSON.parse(authInStorage);
    }
    return null;
  });

  const saveAuthDetails = (newAuthDetails) => {
    window.localStorage.setItem("@auth", JSON.stringify(newAuthDetails));
    setAuthDetails(newAuthDetails);
  };

  return (
    <AuthContext.Provider value={[authDetails, saveAuthDetails]}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuthContext = () => useContext(AuthContext);
