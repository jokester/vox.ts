import { BabylonTutorial } from '../src/babylon-tutorial/babylon-tutorial';
import { FC } from 'react';
import { DefaultMeta } from '../src/demo/components/default-meta';

const BabylonTutorialPage: FC = () => (
  <div className="bg-white p-4">
    <DefaultMeta />
    <BabylonTutorial />
  </div>
);

export default BabylonTutorialPage;
