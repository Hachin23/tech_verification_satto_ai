/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// CSSファイルをモジュールとして認識させるための宣言
declare module "*.css" {
  const content: any;
  export default content;
}

declare module "*.scss";
declare module "*.png";
declare module "*.jpg";
declare module "*.svg";