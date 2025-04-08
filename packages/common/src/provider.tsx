import {createContext, ReactNode, useContext, useEffect, useRef, useState} from 'react';
import {BaseWidgetDataType} from '../type';
import {BaseMessagePurpose, BaseTriggerActions, MessageSource, WidgetType} from "../constants";
import {initializeCommunication, sendMessage, useWebviewListener} from "./data_manager";
import {Message} from "./data_manager/Message";

export interface CommonContextType<T extends BaseWidgetDataType, F extends BaseTriggerActions[]> {
  widgetData: T | null;
  updateWidgetData: (update: Partial<T>, storybook?: boolean) => void;
  resetWidgetData: () => void;
  triggerAction: (trigger: F, storybook?: boolean) => void;
}

export function getCommonContext<T extends BaseWidgetDataType, F extends BaseTriggerActions[]>() {
  const Context = createContext<CommonContextType<T, F> | undefined>(undefined);

  const Provider = ({ children }: { children: ReactNode }) => {
    const [widgetData, setWidgetData] = useState<T | null>(null);
    const originalWidgetData = useRef<T | null>(null);

    useEffect(() => {
      // Request for initial widget data from PM
      const path = window.location.pathname;
      const segments = path.split('/');
      const distName = segments.find((seg) => seg.startsWith('dist_'))?.split('_')[1];
      if (distName) setWidgetData({ type: WidgetType[distName] } as T)
      initializeCommunication(distName ? WidgetType[distName] : undefined);
    }, []);

    // received message from PM
    useWebviewListener((msg: Message) => {
      if (msg.purpose === BaseMessagePurpose.updateWidgetData) {
        const newData = msg.payload;
        console.log('Received updateWidgetData:', newData);
        updateWidgetData({...widgetData, ...newData} as T);
      } else if (msg.purpose === BaseMessagePurpose.initialize) {
        console.warn('Received unknown message:', msg);
      } else {
        console.warn('Received unknown message:', msg);
      }
    });

    const updateWidgetData = (update: Partial<T>, isStorybook?: boolean, ) => {
      const newWidgetData = { ...widgetData, ...update } as T;
      console.log(newWidgetData);
      setWidgetData(newWidgetData);
      sendMessage(new Message({
        source: MessageSource.Hulk,
        purpose: BaseMessagePurpose.updateWidgetData,
        widgetId: newWidgetData?.id,
        widgetType: newWidgetData?.type,
      }));
      // pass the new widget data to pm
    };

    const resetWidgetData = () => {
      setWidgetData(originalWidgetData.current);
    };

    const triggerAction = (actions: BaseTriggerActions[]) => {
      actions.forEach((action) => {
        switch (action) {
          case BaseTriggerActions.onClick:
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
