import {BaseWidgetDataType} from "@hulk/common";

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
export interface ButtonPropsInterface extends BaseWidgetDataType{
  value?: string;
  fontSize?: number;
  fontFamily?: Fonts;
  color?: string;
}

const ButtonPropsSchema = {
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
  }
}

export default ButtonPropsSchema;
