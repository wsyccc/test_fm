export interface WebviewMessage<T = any> {
  widgetType: string;
  type: string;
  payload: T;
}