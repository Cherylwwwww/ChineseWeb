/// <reference types="vite/client" />

declare module '*.jpeg' {
  const value: string;
  export default value;
}

declare module '*.JPG' {
  const value: string;
  export default value;
}

declare module '*.png' {
  const value: string;
  export default value;
}