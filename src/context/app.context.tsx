import { createContext, useState } from 'react';
import { ExtendedPurchase } from 'src/types/purchase.types';
import { User } from 'src/types/user.types';
import { getAccessTokenFromLS, getProfileFromLS } from 'src/utils/auth';

interface AppContextInterface {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  profile: User | null;
  setProfile: React.Dispatch<React.SetStateAction<User | null>>;
  extendedPurchases: ExtendedPurchase[];
  setExtendedPurchases: React.Dispatch<React.SetStateAction<ExtendedPurchase[]>>;
  reset: () => void;
}

const initialAppContext: AppContextInterface = {
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null,
  extendedPurchases: [],
  setExtendedPurchases: () => null,
  reset: () => null
};

const AppContext = createContext<AppContextInterface>(initialAppContext);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated);
  const [profile, setProfile] = useState<User | null>(initialAppContext.profile);
  const [extendedPurchases, setExtendedPurchases] = useState<ExtendedPurchase[]>(initialAppContext.extendedPurchases);

  const reset = (): void => {
    setExtendedPurchases([]);
    setIsAuthenticated(false);
    setProfile(null);
  };

  return (
    <AppContext.Provider
      value={{
        extendedPurchases,
        setExtendedPurchases,
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile,
        reset
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
