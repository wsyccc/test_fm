import {createContext, ReactNode, useContext, useEffect, useRef, useState} from 'react';
import {ActionPayload, WidgetIdentityType, BaseWidgetDataType} from '../type';
import {BaseMessagePurpose, BaseTriggerActions, MessageSource, WidgetType} from "../constants";
import {
  getBaseWidgetData,
  initializeCommunication,
  sendMessage,
  useWebviewListener
} from "./data_manager";
import {Message} from "./data_manager/Message";
import {ActionHandler} from "./data_manager/actionHandler";

export interface CommonContextType<T extends BaseWidgetDataType | Omit<BaseWidgetDataType, 'width' | 'height'>> {
  widgetData: T | null;
  updateWidgetData: (update: Partial<T>, storybook?: boolean) => void;
  resetWidgetData: () => void;
  triggerAction: (trigger: BaseTriggerActions[], payload: ActionPayload, isStorybook?: boolean) => void;
}

export function getCommonContext<T extends BaseWidgetDataType | Omit<BaseWidgetDataType, 'width' | 'height'>>() {
  const Context = createContext<CommonContextType<T> | undefined>(undefined);

  const Provider = ({ children }: { children: ReactNode }) => {
    const [widgetData, setWidgetData] = useState<T | null>(null);
    const widgetIdentity = useRef<WidgetIdentityType>({});
    const originalWidgetData = useRef<T | null>(null);

    useEffect(() => {
      // Request for initial widget data from PM
      const path = window.location.pathname;
      const segments = path.split('/');
      const distName = segments.find((seg) => seg.startsWith('dist_'))?.split('_')[1];
      widgetIdentity.current = {
        type: distName ? WidgetType[distName] : undefined,
        widgetId: undefined
      }
      if (widgetIdentity.current.type) initializeCommunication(widgetIdentity.current.type);
    }, []);

    // received message from PM
    useWebviewListener((msg: Message) => {
      if (msg.purpose === BaseMessagePurpose.updateWidgetData) {
        const newData = msg.payload;
        console.log('Received updateWidgetData:', newData);
        updateWidgetData({...widgetData, ...newData} as T);
      } else if (msg.purpose === BaseMessagePurpose.setWidgetBaseConfig) {
        const config = getBaseWidgetData(msg, widgetIdentity);
        widgetIdentity.current = {
          ...widgetIdentity.current,
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
    });

    const updateWidgetData = (update: Partial<T>, isStorybook?: boolean, ) => {
      const newWidgetData = { ...widgetData, ...update } as T;
      console.log(newWidgetData);
      setWidgetData(newWidgetData);
      if (!isStorybook) {
        sendMessage(new Message({
          source: MessageSource.Hulk,
          purpose: BaseMessagePurpose.updateWidgetData,
          widgetId: widgetIdentity.current.widgetId,
          widgetType: widgetIdentity.current.type,
          payload: newWidgetData,
        }));
      }
      // pass the new widget data to pm
    };

    const resetWidgetData = () => {
      setWidgetData(originalWidgetData.current);
    };

    const triggerAction = (actions: BaseTriggerActions[], payload: ActionPayload, isStorybook?: boolean) => {
      if (widgetIdentity && widgetIdentity.current.type && widgetIdentity.current.widgetId && !isStorybook){
        const actionTrigger = new ActionHandler(widgetIdentity.current.type, widgetIdentity.current.widgetId, actions, payload);
        actionTrigger.triggerAction();
      }
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
