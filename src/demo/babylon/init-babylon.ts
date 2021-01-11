import type { Scene } from '@babylonjs/core/scene';
import type { Engine } from '@babylonjs/core/Engines';
import { RefObject, useEffect, useState } from 'react';
import type { babylonAllDeps } from './deps/babylon-deps';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { isDevBuild } from '../../config/build-env';

/**
 * a object to control camera/scene/stuff
 */
export interface BabylonContext {
  engine: {
    instance: Engine;
    start(): void;
  };
  scene: Scene;
  camera: {
    instance: ArcRotateCamera;
    setRadius(distance: number): void;
  };
  deps: typeof babylonAllDeps;

  disposeAll(): void;
}

export function useBabylonContext(canvasRef: RefObject<HTMLCanvasElement>): null | BabylonContext {
  const [ctx, setCtx] = useState<null | BabylonContext>(null);

  useEffect(() => {
    const maybeCanvas = canvasRef.current;
    if (!maybeCanvas) {
      setCtx(null);
      return;
    }

    let effective = true;

    import('./deps/babylon-deps').then(async (imported) => {
      if (!effective) return;
      const ctx = initBabylon(maybeCanvas, imported.babylonAllDeps);
      setCtx(ctx);

      if (isDevBuild) {
        await import('./deps/babylon-deps-inspector');
        if (!effective) return;
        await ctx.scene.debugLayer.show();
      }
    });

    return () => {
      effective = false;
    };
  }, []);

  return ctx;
}

/**
 * @internal
 */
function initBabylon(canvas: HTMLCanvasElement, deps: typeof babylonAllDeps): BabylonContext {
  const { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, Color3, Color4 } = deps;

  const engine = new Engine(canvas, true);
  const scene = new Scene(engine);

  scene.clearColor = new Color4(0.1, 0.1, 0.1, 1);
  const camera = new ArcRotateCamera(
    'camera',
    /* alpha: rotation around "latitude axis" */ -Math.PI / 2,
    /* beta: rotation around "longitude axis" */ Math.PI / 2,
    1,
    Vector3.Zero(),
    scene,
  );
  camera.attachControl(canvas, true);

  const light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene);
  light.specular = Color3.Black();
  light.groundColor = new Color3(1, 1, 1);

  return {
    engine: {
      instance: engine,

      start() {
        engine.runRenderLoop(() => scene.render());
      },
    },
    scene,
    camera: {
      instance: camera,
      setRadius(maxDimension: number) {
        camera.lowerRadiusLimit = maxDimension;
        camera.upperRadiusLimit = maxDimension * 2;
      },
    },

    disposeAll() {
      engine.stopRenderLoop();
      camera.detachControl(canvas);
      camera.dispose();

      scene.dispose();
      engine.dispose();
    },
    deps,
  } as const;
}
