declare const process: {
  env: {
    NODE_ENV: string;
  };
};

export const inBrowser = typeof window !== 'undefined';
export const inServer = !inBrowser;

export const isDevBuild = process.env.NODE_ENV !== 'production';
