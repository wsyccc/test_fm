import { BaseWidgetDataType } from "@hulk/common";

export interface ImagePropsInterface extends BaseWidgetDataType {
  // add more props here
  src?: string;
  alt?: string;
}

const ImagePropsSchema = {
  src: {
    type: "string",
    required: false
  },
  alt: {
    type: "string",
    required: false
  }
};

export default ImagePropsSchema;