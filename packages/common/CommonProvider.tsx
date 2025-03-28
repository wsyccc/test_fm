import {createContext, useContext, useState, ReactNode, useEffect} from 'react';


interface CommonContextType {
  count: number;
  increment: () => void;
  decrement: () => void;
}


const CommonContext = createContext<CommonContextType | undefined>(undefined);


export const CommonProvider = <T,>({ children }: { children: ReactNode}) => {
  const [count, setCount] = useState(0);
  const [urlData, setUrlData] = useState<T | null>(null);

  useEffect(() => {
    setUrlData(urlData);
  }, []);

  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);

  return (
    <CommonContext.Provider value={{ count, increment, decrement }}>
      {children}
    </CommonContext.Provider>
  );
};


export const useCommon = () => {
  const context = useContext(CommonContext);
  if (!context) throw new Error('useCommon must be used within a CommonContext');
  return context as CommonContextType;
};
