import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useRef,
  useEffect
} from 'react';
import {BaseWidgetDataType} from '../type';
import {WidgetActions} from "../constatns";

export interface CommonContextType<T extends BaseWidgetDataType> {
  widgetData: T | null;
  updateWidgetData: (update: Partial<T>, storybook?: boolean) => void;
  resetWidgetData: () => void;
  triggerAction: (actions: WidgetActions[], storybook?: boolean) => void;
}

export function getCommonContext<T extends BaseWidgetDataType>() {
  const Context = createContext<CommonContextType<T> | undefined>(undefined);

  const Provider = ({ children }: { children: ReactNode }) => {
    const [widgetData, setWidgetData] = useState<T | null>(null);
    const originalWidgetData = useRef<T | null>(null);

    useEffect(() => {
      originalWidgetData.current = widgetData;
    }, []);

    useEffect(() => {
      if (window.chrome && window.chrome.webview) {

      }
    }, []);

    const updateWidgetData = (update: Partial<T>) => {
      const newWidgetData = { ...widgetData, ...update } as T;
      console.log(newWidgetData);
      setWidgetData(newWidgetData);
      // pass the new widget data to pm
    };

    const resetWidgetData = () => {
      setWidgetData(originalWidgetData.current);
    };

    const triggerAction = (actions: WidgetActions[]) => {
      actions.forEach((action) => {
        switch (action) {
          case WidgetActions.onClick:
            console.log(`onClick on ${widgetData?.id}`);
            // Handle onClick action
            break;
        }
      });
    };

    return (
      <Context.Provider value={{ widgetData, updateWidgetData, resetWidgetData, triggerAction }}>
        {children}
      </Context.Provider>
    );
  };

  const useCommon = () => {
    const context = useContext(Context);
    if (!context) {
      throw new Error('useCommon must be used within a Provider');
    }
    return context;
  };

  return { Provider, useCommon };
}
