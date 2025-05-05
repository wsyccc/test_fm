import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {ActionRequest, BaseWidgetDataType, CurrentWidgetIdentity} from '../type';
import {BaseMessagePurpose, WidgetType} from "../constants";
import {sendMessage, useWebviewListener} from "./data_manager";
import {Message} from "./data_manager/Message";
import {parseReceiverMessagePayload} from "./data_manager/receiver";
import {v4 as uuidv4} from "uuid";

export interface CommonContextType<T extends BaseWidgetDataType | Omit<BaseWidgetDataType, 'width' | 'height'>> {
  widgetData: T | null;
  updateWidgetData: (update: Partial<T>, widgetVersion?: string, isStorybook?: boolean) => void;
  triggerAction: ({request, isStorybook}: { request: ActionRequest, isStorybook?: boolean }) => void;
}

export function getCommonContext<T extends BaseWidgetDataType | Omit<BaseWidgetDataType, 'width' | 'height'>>() {
  const Context = createContext<CommonContextType<T> | undefined>(undefined);

  const Provider = ({children}: { children: ReactNode }) => {
    const [widgetData, setWidgetData] = useState<T | null>(null);
    const [widgetIdentity, setWidgetIdentity] = useState<CurrentWidgetIdentity | null>(null);

    useEffect(() => {
      // Request for initial widget data from PM
      const path = window.location.pathname;
      const segments = path.split('/');
      const distName = segments.find((seg) => seg.startsWith('dist_'))?.split('_')[1];
      setWidgetIdentity({
        widgetType: distName ? WidgetType[distName] : undefined,
          widgetId: undefined
      });
    }, []);

    // received message from PM
    useWebviewListener((message: Message) => {
      const result = parseReceiverMessagePayload(message, widgetIdentity!);
      if (result){
        if (result.data){
          setWidgetData(prevState => ({...prevState, ...result.data}));
        }
        if (result.widgetId){
          setWidgetIdentity(prevState => ({...prevState, widgetId: result.widgetId}));
        }
      } else {
        console.warn(`Received Purpose ${message.purpose}, but not payload to set ${message.toJSON()}`)
      }
    });

    const updateWidgetData = (update: Partial<T>, widgetVersion?: string, isStorybook?: boolean) => {
      const isCreate = !widgetIdentity?.widgetVersion && widgetData == null;
      if (!widgetIdentity?.widgetVersion && widgetVersion) setWidgetIdentity(prevState => ({...prevState, widgetVersion}));
      setWidgetData(prevState => {
        return {...prevState, ...update} as T;
      });
      if (!isStorybook) {
        // send back the current configs
        sendMessage(new Message({
          id: uuidv4(),
          purpose: isCreate ? BaseMessagePurpose.SEND_CREATE_WIDGET : BaseMessagePurpose.SEND_UPDATE_WIDGET,
          widgetId: widgetIdentity?.widgetId!,
          widgetType: widgetIdentity?.widgetType!,
          senderMessagePayload: {
            triggerWidgets: [{
              widgetId: widgetIdentity?.widgetId,
              widgetType: widgetIdentity?.widgetType,
              data: {...widgetData, ...update},
              version: widgetIdentity?.widgetVersion
            }]
          }
        }));
      }
      // pass the new widget data to pm
    };

    const triggerAction = ({request, isStorybook}: { request: ActionRequest, isStorybook?: boolean }) => {
      // if (widgetIdentity && widgetIdentity.current.widgetType && widgetIdentity.current.widgetId && !isStorybook) {
      //   const actionTrigger = new ActionHandler(widgetIdentity.current.widgetType, widgetIdentity.current.widgetId, actions, payload);
      //   actionTrigger.triggerAction();
      // }
    };
    return (widgetIdentity?.widgetId && (import.meta as any).env.MODE === "production") ? (
      <Context.Provider value={{widgetData, updateWidgetData, triggerAction}}>
        {children}
      </Context.Provider>
    ) : (import.meta as any).env.MODE === "development" ? (
      <Context.Provider value={{widgetData, updateWidgetData, triggerAction}}>
        {children}
      </Context.Provider>
    ) : "Initializing Data...";
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
