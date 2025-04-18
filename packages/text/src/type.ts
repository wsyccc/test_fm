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