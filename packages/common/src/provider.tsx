import {createContext, ReactNode, useContext, useEffect, useRef, useState} from 'react';
import {ActionPayload, BaseWidgetConfigType, BaseWidgetDataType} from '../type';
import {BaseMessagePurpose, BaseTriggerActions, MessageSource, WidgetType} from "../constants";
import {
  getBaseWidgetData,
  initializeCommunication,
  sendMessage,
  useWebviewListener
} from "./data_manager";
import {Message} from "./data_manager/Message";

export interface CommonContextType<T extends BaseWidgetDataType> {
  widgetData: T | null;
  updateWidgetData: (update: Partial<T>, storybook?: boolean) => void;
  resetWidgetData: () => void;
  triggerAction: (trigger: BaseTriggerActions[], payload: ActionPayload, storybook?: boolean) => void;
}

export function getCommonContext<T extends BaseWidgetDataType>() {
  const Context = createContext<CommonContextType<T> | undefined>(undefined);

  const Provider = ({ children }: { children: ReactNode }) => {
    const [widgetData, setWidgetData] = useState<T | null>(null);
    const widgetConfig = useRef<BaseWidgetConfigType>({});
    const originalWidgetData = useRef<T | null>(null);

    useEffect(() => {
      // Request for initial widget data from PM
      const path = window.location.pathname;
      const segments = path.split('/');
      const distName = segments.find((seg) => seg.startsWith('dist_'))?.split('_')[1];
      widgetConfig.current = {
        type: distName ? WidgetType[distName] : undefined,
        id: undefined
      }
      if (widgetConfig.current.type) initializeCommunication(widgetConfig.current.type);
    }, []);

    // received message from PM
    useWebviewListener((msg: Message) => {
      if (msg.source === MessageSource.WebView){
        if (msg.purpose === BaseMessagePurpose.updateWidgetData) {
          const newData = msg.payload;
          console.log('Received updateWidgetData:', newData);
          updateWidgetData({...widgetData, ...newData} as T);
        } else if (msg.purpose === BaseMessagePurpose.setWidgetBaseConfig) {
          const config = getBaseWidgetData(msg, widgetConfig);
          widgetConfig.current = {
            ...widgetConfig.current,
            ...config
          }
          setWidgetData({
            ...widgetData,
            width: config?.width,
            height: config?.height,
          } as T)
          // sendWidgetDefaultConfigs();
        } else {
          console.warn('Received unknown message:', msg);
        }
      }
    });

    const updateWidgetData = (update: Partial<T>, isStorybook?: boolean, ) => {
      const newWidgetData = { ...widgetData, ...update } as T;
      console.log(newWidgetData);
      setWidgetData(newWidgetData);
      if (!isStorybook) {
        sendMessage(new Message({
          source: MessageSource.Hulk,
          purpose: BaseMessagePurpose.updateWidgetData,
          widgetId: widgetConfig.current.id,
          widgetType: widgetConfig.current.type,
          payload: newWidgetData,
        }));
      }
      // pass the new widget data to pm
    };

    const resetWidgetData = () => {
      setWidgetData(originalWidgetData.current);
    };

    const triggerAction = (actions: BaseTriggerActions[]) => {
      actions.forEach((action) => {
        switch (action) {
          case BaseTriggerActions.onClick:
            console.log(`onClick on ${widgetConfig.current.id}`);
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
