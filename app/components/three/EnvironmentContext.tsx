import { createContext } from 'react';

export type EnvironmentContextType = {
    isReady: boolean;
    setReady: (ready: boolean) => void;
};

export const EnvironmentContext = createContext<EnvironmentContextType>({
    isReady: false,
    setReady: () => { }
}); 