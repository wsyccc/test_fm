import {createContext, ReactNode, useContext, useEffect, useRef, useState} from 'react';
import {ActionRequest, BaseWidgetDataType, CurrentWidgetIdentity} from '../type';
import {BaseMessagePurpose, WidgetType} from "../constants";
import {sendMessage, useWebviewListener} from "./data_manager";
import {Message} from "./data_manager/Message";

export interface CommonContextType<T extends BaseWidgetDataType | Omit<BaseWidgetDataType, 'width' | 'height'>> {
  widgetData: T | null;
  updateWidgetData: (update: Partial<T>, storybook?: boolean) => void;
  resetWidgetData: () => void;
  triggerAction: ({request, isStorybook}: { request: ActionRequest, isStorybook?: boolean }) => void;
  initializeWidgetData: ({widgetId, widgetType, widgetVersion, data}: CurrentWidgetIdentity & { data: T }) => void;
}

export function getCommonContext<T extends BaseWidgetDataType | Omit<BaseWidgetDataType, 'width' | 'height'>>() {
  const Context = createContext<CommonContextType<T> | undefined>(undefined);

  const Provider = ({children}: { children: ReactNode }) => {
    const [widgetData, setWidgetData] = useState<T | null>(null);
    const widgetIdentity = useRef<CurrentWidgetIdentity>({});
    const originalWidgetData = useRef<T | null>(null);

    useEffect(() => {
      // Request for initial widget data from PM
      const path = window.location.pathname;
      const segments = path.split('/');
      const distName = segments.find((seg) => seg.startsWith('dist_'))?.split('_')[1];
      widgetIdentity.current = {
        widgetType: distName ? WidgetType[distName] : undefined,
        widgetId: undefined
      }
    }, []);

    // received message from PM
    useWebviewListener((msg: Message) => {
      if (msg.purpose === BaseMessagePurpose.INIT){

      } else {
        msg.receiverMessagePayload?.updateWidgets.forEach(payload => {
          if (payload.widgetId === widgetIdentity.current.widgetId) {
            switch (msg.purpose) {
              case BaseMessagePurpose.RECEIVE_WIDGET_DATA:
                setWidgetData({
                  ...widgetData,
                  ...payload.data
                });
                break;
            }
          }
        });
      }
    });

    const updateWidgetData = (update: Partial<T>, isStorybook?: boolean) => {
      const newWidgetData = {...widgetData, ...update} as T;
      setWidgetData(newWidgetData);
      if (!isStorybook) {
        sendMessage(new Message({
          purpose: BaseMessagePurpose.SEND_UPDATE_WIDGET,
          widgetId: widgetIdentity.current.widgetId!,
          widgetType: widgetIdentity.current.widgetType!,
          payload: {
            updateWidgets: [
              {
                id: widgetIdentity.current.widgetId,
                type: widgetIdentity.current.widgetType,
                data: newWidgetData,
                version: widgetIdentity.current.widgetVersion ?? "0.0.0",
              }
            ]
          }
        }));
      }
      // pass the new widget data to pm
    };

    const initializeWidgetData = ({widgetId, widgetType, widgetVersion, data}: CurrentWidgetIdentity & { data: T }) => {
      widgetIdentity.current.widgetId = widgetId;
      widgetIdentity.current.widgetType = widgetType;
      widgetIdentity.current.widgetVersion = widgetVersion;
      setWidgetData({...widgetData, ...data} as T);
    }

    const resetWidgetData = () => {
      setWidgetData(originalWidgetData.current);
    };

    const triggerAction = ({request, isStorybook}: { request: ActionRequest, isStorybook?: boolean }) => {
      if (widgetIdentity && widgetIdentity.current.widgetType && widgetIdentity.current.widgetId && !isStorybook) {
        const actionTrigger = new ActionHandler(widgetIdentity.current.widgetType, widgetIdentity.current.widgetId, actions, payload);
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
