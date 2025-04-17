import type { CSSProperties } from 'react';

export interface Report {
  header: {
    title: {
      text: string;
      style?: CSSProperties;
    },
    subtitle?: {
      text: string;
      style?: CSSProperties;
    },
    logo?: {
      src: string;
      style?: CSSProperties;
    },
  },
  footer: {
    pageNo: {
      visible: boolean;
      align?: 'start' | 'end' | 'center'
    },
    title?: {
      text: string;
      style?: CSSProperties;
    },
    subtitle?: {
      text: string;
      style?: CSSProperties;
    },
    logo?: {
      src: string;
      style?: CSSProperties;
    },
  }
}