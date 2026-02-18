import { useState, useEffect } from "react";
import { apiService } from "@/services/apiService";

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedUser = apiService.getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setIsLoaded(true);
  }, []);

  const login = async (credentials: any) => {
    const data = await apiService.login(credentials);
    setUser(data);
    return data;
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
  };

  return { user, isLoaded, login, logout, isSignedIn: !!user };
};
