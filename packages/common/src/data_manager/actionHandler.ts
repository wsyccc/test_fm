import {BaseTriggerActions, WidgetType} from "../../constants";
import {ActionPayload} from "../../type";

export class ActionHandler {
  get triggeredActions(): BaseTriggerActions[] {
    return this._triggeredActions;
  }

  set triggeredActions(value: BaseTriggerActions[]) {
    this._triggeredActions = value;
  }

  get widgetType(): WidgetType {
    return this._widgetType;
  }

  set widgetType(value: WidgetType) {
    this._widgetType = value;
  }

  get widgetId(): string {
    return this._widgetId;
  }

  set widgetId(value: string) {
    this._widgetId = value;
  }

  get payload(): ActionPayload {
    return this._payload;
  }

  set payload(value: ActionPayload) {
    this._payload = value;
  }

  private _triggeredActions: BaseTriggerActions[];
  private _widgetType: WidgetType;
  private _widgetId: string;
  private _payload?: ActionPayload;

  constructor(widgetType: WidgetType, widgetId: string, triggerAction: BaseTriggerActions[], payload?: ActionPayload) {
    this._widgetId = widgetId;
    this._widgetType = widgetType;
    this._triggeredActions = triggerAction;
    this._payload = payload;
  }

  public triggerAction(){
    this.triggeredActions.forEach((action) => {
      switch (action) {
        case BaseTriggerActions.onClick:
          console.log(`onClick on ${this.widgetId}`);
          // Handle onClick action
          break;
        case BaseTriggerActions.init:
          console.log(`init on ${this.widgetId}`);
          break;
      }
    });
  }

}