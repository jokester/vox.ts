import Head from 'next/head';

import React from 'react';

export const DefaultMeta: React.FC = () => {
  return (
    <Head>
      <script
        src="https://cdn.jsdelivr.net/npm/webxr-polyfill@2.0.3/build/webxr-polyfill.min.js"
        key="js-webxr-polyfill"
        integrity="sha256-bc8YjmmqkWVoSNQ62HvbHAQA7wh2612ScT/CYfjFx9A="
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        key="css-tailwindcss"
        href="https://cdn.jsdelivr.net/npm/tailwindcss@2.0.2/dist/tailwind.min.css"
        integrity="sha256-KwBcfPYYUP4pXG0aiIA8nTSuAqRzRWdtoHQktxvMVf4="
        crossOrigin="anonymous"
      />
      <script
        key="js-babylonjs"
        src="https://cdn.jsdelivr.net/npm/babylonjs@4.2.0/babylon.max.js"
        integrity="sha256-7MX80Nc0dcDQEMZHH864dxs/N6kf0NJL6I55fBMBxi0="
        crossOrigin="anonymous"
      />
      <meta
        key="meta-viewport"
        name="viewport"
        content="width=device-width, initial-scale=1,maximum-scale=1.5,minimum-scale=1"
      />
    </Head>
  );
};
