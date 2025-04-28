import {createContext, ReactNode, useContext, useEffect, useRef, useState} from 'react';
import {ActionRequest, BaseWidgetDataType, WidgetIdentityType} from '../type';
import {BaseMessagePurpose, BaseTriggerActions, WidgetType} from "../constants";
import {sendMessage, useWebviewListener} from "./data_manager";
import {Message} from "./data_manager/Message";
import {ActionHandler} from "./data_manager/actionHandler";

export interface CommonContextType<T extends BaseWidgetDataType | Omit<BaseWidgetDataType, 'width' | 'height'>> {
  widgetData: T | null;
  updateWidgetData: (update: Partial<T>, storybook?: boolean) => void;
  resetWidgetData: () => void;
  triggerAction: ({request, isStorybook}: { request: ActionRequest, isStorybook?: boolean }) => void;
  initializeWidgetData: ({id, type, version, data}: WidgetIdentityType & { data: T }) => void;
}

export function getCommonContext<T extends BaseWidgetDataType | Omit<BaseWidgetDataType, 'width' | 'height'>>() {
  const Context = createContext<CommonContextType<T> | undefined>(undefined);

  const Provider = ({children}: { children: ReactNode }) => {
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
        id: undefined
      }
    }, []);

    // received message from PM
    useWebviewListener((msg: Message) => {
      // at runtime the server side already has the data
      if (msg.purpose === BaseMessagePurpose.initialize) {
        const data = msg.payload?.updateWidgets[0].data;
        widgetIdentity.current.id = msg.widgetId;
        widgetIdentity.current.type = msg.widgetType;
        setWidgetData(data);
      } else {
        const data = msg.payload?.updateWidgets.find(item => item.id === widgetIdentity.current.id );
        if (!data) return;
        if (msg.purpose === BaseMessagePurpose.updateWidgetData) {
          const newData = data.data;
          console.log('Received updateWidgetData:', newData);
          updateWidgetData({...widgetData, ...newData} as T);
        } else {
          console.warn('Received unknown message:', msg);
        }
      }
    });

    const updateWidgetData = (update: Partial<T>, isStorybook?: boolean) => {
      const newWidgetData = {...widgetData, ...update} as T;
      setWidgetData(newWidgetData);
      if (!isStorybook) {
        sendMessage(new Message({
          purpose: BaseMessagePurpose.updateWidgetData,
          widgetId: widgetIdentity.current.id,
          widgetType: widgetIdentity.current.type,
          payload: {
            updateWidgets: [
              {
                id: widgetIdentity.current.id,
                type: widgetIdentity.current.type,
                data: newWidgetData,
                version: widgetIdentity.current.version ?? "0.0.0",
              }
            ]
          }
        }));
      }
      // pass the new widget data to pm
    };

    const initializeWidgetData = ({id, type, version, data}: WidgetIdentityType & { data: T }) => {
      widgetIdentity.current.id = id;
      widgetIdentity.current.type = type;
      widgetIdentity.current.version = version;
      setWidgetData({...widgetData, ...data} as T);
    }

    const resetWidgetData = () => {
      setWidgetData(originalWidgetData.current);
    };

    const triggerAction = ({request, isStorybook}: { request: ActionRequest, isStorybook?: boolean }) => {
      if (widgetIdentity && widgetIdentity.current.type && widgetIdentity.current.id && !isStorybook) {
        const actionTrigger = new ActionHandler(widgetIdentity.current.type, widgetIdentity.current.id, actions, payload);
        actionTrigger.triggerAction();
      }
    };

    return (
      <Context.Provider value={{widgetData, updateWidgetData, resetWidgetData, triggerAction, initializeWidgetData}}>
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

  return {Provider, useCommon};
}
