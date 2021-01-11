import React from 'react';
import { isDevBuild } from '../src/config/build-env';
import { NextPage } from 'next';
import { ReactDemo } from '../src/react-demo/react-demo';

const IndexPage: NextPage = (props) => {
  console.log('buildEnv', isDevBuild);
  return (
    <div>
      <h1>index page</h1>
      <ReactDemo />
    </div>
  );
};

export default IndexPage;
