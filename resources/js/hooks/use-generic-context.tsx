import { createContext, ReactNode, useContext } from 'react';

export function useGenericContext<T>() {
  const Context = createContext<T | null>(null);

  interface DataProviderProps {
    children: ReactNode;
    data: T;
  }

  function Provider({ children, data }: DataProviderProps) {
    return <Context.Provider value={data}>{children}</Context.Provider>;
  }

  function useContextValue() {
    const context = useContext(Context);
    if (!context) {
      throw new Error('useContextValue must be used within DataProvider');
    }
    return context;
  }

  function useOptionalContextValue(): T | null {
    return useContext(Context);
  }

  return {
    Provider,
    useContextValue,
    useOptionalContextValue,
  };
}
