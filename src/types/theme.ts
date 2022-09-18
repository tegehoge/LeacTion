/* eslint-disable no-unused-vars */

// SUIDのThemeで追加したブレイクポイントの型エラーをさせないために以下を追加
import { BreakpointOverrides } from "@suid/system/createTheme/createBreakpoints";
declare module "@suid/system/createTheme/createBreakpoints" {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    "2sm": true;
    md: true;
    lg: true;
    xl: true;
  }
}
