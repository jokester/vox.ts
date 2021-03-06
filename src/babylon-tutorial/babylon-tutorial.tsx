import { createRef, FC, useEffect } from 'react';
import { BabylonContext, useBabylonContext } from '../babylon-react/babylon-ctx';

export const BabylonTutorial: FC = () => {
  const canvasRef = createRef<HTMLCanvasElement>();

  const babylonContext = useBabylonContext(canvasRef);

  useEffect(() => {
    if (babylonContext) runTutorial(babylonContext);
  }, [babylonContext]);

  return <canvas className="bg-black" width={800} height={600} ref={canvasRef} />;
};

function runTutorial({ canvas, scene, deps }: BabylonContext) {
  const { ArcRotateCamera, HemisphericLight, Vector3, MeshBuilder } = deps;

  const camera = new ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2.5, 3, new Vector3(0, 0, 0), scene);
  camera.attachControl(canvas, true);
  const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
  const box = MeshBuilder.CreateBox('box', {}, scene);
}
