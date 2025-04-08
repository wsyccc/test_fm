import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useRef,
  useEffect
} from 'react';
import {BaseWidgetDataType} from '../type';
import {BaseMessagePurpose, BaseTriggerActions} from "../constatns";
import {initializeCommunication, useWebviewListener} from "./data_manager";

export interface CommonContextType<T extends BaseWidgetDataType, F extends BaseMessagePurpose> {
  widgetData: T | null;
  updateWidgetData: (update: Partial<T>, storybook?: boolean) => void;
  resetWidgetData: () => void;
  triggerAction: (trigger: F, storybook?: boolean) => void;
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
      initializeCommunication({ message: 'Hello from React!', version: '1.0.0' });
    }, []);

    useWebviewListener((msg: any) => {
      // 根据消息协议，判断消息类型并处理
      if (msg.payload?.updateWidgetData) {
        // 例如：收到更新 widgetData 的消息
        const newData = msg.payload.updateWidgetData.payload;
        console.log('Received updateWidgetData:', newData);
        updateWidgetData(newData);
      } else if (msg.payload?.triggerAction) {
        // 例如：收到触发 action 的消息
        const action = msg.payload.triggerAction.payload.action;
        console.log('Received triggerAction:', action);
        triggerAction([action]);
      } else {
        console.warn('Received unknown message:', msg);
      }
    });

    const updateWidgetData = (update: Partial<T>) => {
      const newWidgetData = { ...widgetData, ...update } as T;
      console.log(newWidgetData);
      setWidgetData(newWidgetData);
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
