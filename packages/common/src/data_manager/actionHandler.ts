import {BaseMessagePurpose, BaseTriggerActions, MessageSource, WidgetType} from "../../constants";
import {ActionRequest} from "../../type";
import {Message} from "./Message";
import {sendMessage} from "./index";

export class ActionHandler {
  get actions(): BaseTriggerActions[] {
    return this._actions;
  }

  set actions(value: BaseTriggerActions[]) {
    this._actions = value;
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

  get actionRequest(): ActionRequest | undefined {
    return this._actionRequest;
  }

  set actionRequest(value: ActionRequest) {
    this._actionRequest = value;
  }

  private _actions: BaseTriggerActions[];
  private _widgetType: WidgetType;
  private _widgetId: string;
  private _actionRequest?: ActionRequest;

  constructor(widgetType: WidgetType, widgetId: string, request: ActionRequest) {
    this._widgetId = widgetId;
    this._widgetType = widgetType;
    this._actions = request.actions;
    this._actionRequest = request;
  }

  public triggerAction(){
    this.actions.forEach((action) => {
      const message = new Message(
        {
          purpose: BaseMessagePurpose.triggerAction,
          widgetId: this.widgetId,
          widgetType: this.widgetType,
          actionRequest: this.actionRequest
        }
      );
      switch (action) {
        case BaseTriggerActions.onClick:
          console.log(`onClick on ${this.widgetId}`);
          // Handle onClick action
          break;
        default:
          message.payload = {
            updateWidgets: [{
              id: this.widgetId,
              type: this.widgetType,
              version: "0.0.0"
            }],
          }
          break;
      }
      if (message.payload) sendMessage(message);
      else console.error(`Message payload is empty for ${action}`);
    });
  }

}