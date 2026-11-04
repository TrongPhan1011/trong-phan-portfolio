import { createContext, useContext } from 'react';

export const EngineContext = createContext(null);
export const ModeContext = createContext({ mode: 'build', setMode: () => {} });
export const StageContext = createContext(null);

export const useEngine = () => useContext(EngineContext);
export const useStudioMode = () => useContext(ModeContext);
