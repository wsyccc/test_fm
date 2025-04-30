import { BaseWidgetDataType } from "@hulk/common";

export enum Fonts {
  arial = 'Arial',
  arialBlack = 'Arial Black',
  verdana = 'Verdana',
  helvetica = 'Helvetica',
  tahoma = 'Tahoma',
  trebuchetMS = 'Trebuchet MS',
  impact = 'Impact',
  timesNewRoman = 'Times New Roman',
  didot = 'Didot',
  georgia = 'Georgia',
  garamond = 'Garamond',
  americanTypewriter = 'American Typewriter',
  andaleMono = 'Andale Mono',
  courier = 'Courier',
  courierNew = 'Courier New',
  lucidaConsole = 'Lucida Console',
  monaco = 'Monaco',
  bradleyHand = 'Bradley Hand',
  brushScriptMT = 'Brush Script MT',
  luminari = 'Luminari',
  comicSansMS = 'Comic Sans MS',
  liGothic = 'LiGothic',
  fangSong = 'FangSong',
  stHeitiLight = 'STHeiti Light',
  stHeiti = 'STHeiti',
  stKaiti = 'STKaiti',
  stSong = 'STSong',
  stFangsong = 'STFangsong',
  liHeiProMedium = 'LiHei Pro Medium',
  liSongProLight = 'LiSong Pro Light',
  biauKai = 'BiauKai',
  pMingLiU = 'PMingLiU',
  mingLiU = 'MingLiU',
  dFKaiSB = 'DFKai-SB',
  simHei = 'SimHei',
  simSun = 'SimSun',
  nSimSun = 'NSimSun',
  kaiTi = 'KaiTi',
  microsoftJhengHei = 'Microsoft JhengHei',
  microsoftYaHei = 'Microsoft YaHei',
  fangSongGB2312 = 'FangSong_GB2312',
  kaiTiGB2312 = 'KaiTi_GB2312',
}

export enum AlignItems {
  start = 'start',
  center = 'center',
  end = 'end',
}

export enum TextDecorationStyle {
  solid = 'solid',
  double = 'double',
  dotted = 'dotted',
  dashed = 'dashed',
  wavy = 'wavy',
}

export interface TextDecorationFormData {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  lineThrough: boolean;
  overline: boolean;
  color: string;
  style: TextDecorationStyle;
}

export interface TextPropsInterface extends BaseWidgetDataType {
  // add more props here
  bgColor?: string;
  value?: string;
  fontSize?: number;
  fontFamily?: Fonts;
  color?: string;
  justifyContent?: AlignItems;
  alignItems?: AlignItems;
  border?: {
    size: number,
    style: TextDecorationStyle,
    color: string
  },
  boxShadow?: {
    x: number,
    y: number,
    blur: number,
    diffusion: number,
    color: string
  },
  textDecoration?: TextDecorationFormData;
}

const TextPropsSchema = {
  bgColor: {
    type: 'string',
    required: false
  },
  value: {
    type: 'string',
    required: false
  },
  fontSize: {
    type: 'number',
    required: false
  },
  fontFamily: {
    type: 'string',
    enum: [
      'Arial',
      'Arial Black',
      'Verdana',
      'Helvetica',
      'Tahoma',
      'Trebuchet MS',
      'Impact',
      'Times New Roman',
      'Didot',
      'Georgia',
      'Garamond',
      'American Typewriter',
      'Andale Mono',
      'Courier',
      'Courier New',
      'Lucida Console',
      'Monaco',
      'Bradley Hand',
      'Brush Script MT',
      'Luminari',
      'Comic Sans MS',
      'LiGothic',
      'FangSong',
      'STHeiti Light',
      'STHeiti',
      'STKaiti',
      'STSong',
      'STFangsong',
      'LiHei Pro Medium',
      'LiSong Pro Light',
      'BiauKai',
      'PMingLiU',
      'MingLiU',
      'DFKai-SB',
      'SimHei',
      'SimSun',
      'NSimSun',
      'KaiTi',
      'Microsoft JhengHei',
      'Microsoft YaHei',
      'FangSong_GB2312',
      'KaiTi_GB2312'
    ],
    required: false
  },
  color: {
    type: 'string',
    required: false
  },
  justifyContent: {
    type: 'string',
    enum: ['start', 'center', 'end'],
    required: false
  },
  alignItems: {
    type: 'string',
    enum: ['start', 'center', 'end'],
    required: false
  },
  border: {
    type: 'object',
    required: false,
    additionalProperties: false,
    properties: {
      size: {
        type: 'number',
        required: true
      },
      style: {
        type: 'string',
        enum: ['solid', 'double', 'dotted', 'dashed', 'wavy'],
        required: true
      },
      color: {
        type: 'string',
        required: true
      }
    }
  },
  boxShadow: {
    type: 'object',
    required: false,
    additionalProperties: false,
    properties: {
      x: {
        type: 'number',
        required: true
      },
      y: {
        type: 'number',
        required: true
      },
      blur: {
        type: 'number',
        required: true
      },
      diffusion: {
        type: 'number',
        required: true
      },
      color: {
        type: 'string',
        required: true
      }
    }
  },
  textDecoration: {
    type: 'object',
    required: false,
    additionalProperties: false,
    properties: {
      bold: {
        type: 'boolean',
        required: true
      },
      italic: {
        type: 'boolean',
        required: true
      },
      underline: {
        type: 'boolean',
        required: true
      },
      lineThrough: {
        type: 'boolean',
        required: true
      },
      overline: {
        type: 'boolean',
        required: true
      },
      color: {
        type: 'string',
        required: true
      },
      style: {
        type: 'string',
        enum: ['solid', 'double', 'dotted', 'dashed', 'wavy'],
        required: true
      }
    }
  }
};

export default TextPropsSchema;