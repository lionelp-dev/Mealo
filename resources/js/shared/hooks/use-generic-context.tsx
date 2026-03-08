import { createContext, PropsWithChildren, useContext } from 'react';

export function useGenericContext<T>() {
  const Context = createContext<T | null>(null);

  function Provider({ children, value }: { value: T } & PropsWithChildren) {
    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  function useContextValue() {
    const context = useContext(Context);
    if (!context) throw new Error('Missing Provider');
    return context;
  }

  return { Provider, useContextValue };
}
