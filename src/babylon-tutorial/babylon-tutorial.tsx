import { createRef, FC, useEffect, useState } from 'react';
import { BabylonContext, useBabylonContext, useBabylonInspector } from '../babylon-react/babylon-ctx';
import type { HemisphericLight, ArcRotateCamera } from '@babylonjs/core';
import { Tools } from '@babylonjs/core';
import { StandardMaterial } from '@babylonjs/core/Materials';

export const BabylonTutorial: FC = () => {
  const canvasRef = createRef<HTMLCanvasElement>();

  const babylonContext = useBabylonContext(canvasRef);
  const [enableInspector, setEnableInspector] = useState(false);
  useBabylonInspector(babylonContext, enableInspector);

  useEffect(() => {
    if (babylonContext) {
      runTutorial_2_build_a_village(babylonContext).then(babylonContext.engine.start);
    }
  }, [babylonContext]);

  return (
    <div className="p-2">
      <canvas width={800} height={600} ref={canvasRef} />
      <hr className="my-2" />
      <div className="space-x-2">
        <button onClick={() => setEnableInspector((_) => !_)} className="p-1 border border-black text-black ">
          toggle inspector
        </button>
      </div>
    </div>
  );
};

async function runTutorial_1_firsts({ canvas, scene, engine, deps }: BabylonContext) {
  const { ArcRotateCamera, HemisphericLight, Vector3, MeshBuilder, Color4, SceneLoader } = deps;

  const camera: ArcRotateCamera = new ArcRotateCamera(
    'camera',
    -Math.PI / 2,
    Math.PI / 2.5,
    3,
    new Vector3(0, 0, 0),
    scene,
  );
  camera.lowerRadiusLimit = 2;
  camera.attachControl(canvas, true);
  const light: HemisphericLight = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
  const box = MeshBuilder.CreateBox('box', { faceColors: [] }, scene);
}

async function runTutorial_2_build_a_village({ canvas, scene, engine, deps }: BabylonContext) {
  const { ArcRotateCamera, HemisphericLight, Vector3, MeshBuilder, Color4, SceneLoader } = deps;

  const camera: ArcRotateCamera = new ArcRotateCamera(
    'camera',
    -Math.PI / 2,
    Math.PI / 2.5,
    3,
    new Vector3(0, 0, 0),
    scene,
  );
  camera.lowerRadiusLimit = 2;
  camera.attachControl(canvas, true);
  const light: HemisphericLight = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
  const box = MeshBuilder.CreateBox('box', { faceColors: [] }, scene);
  box.position.y = 0.5;

  const roofMat = new StandardMaterial('roofMat', scene);
  /**
   * ground: a 0-thickness single-faced mesh
   * @type {Mesh}
   */
  const ground = MeshBuilder.CreateGround('ground', { width: 10, height: 10 });
}
