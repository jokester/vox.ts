import type { Scene } from '@babylonjs/core/scene';
import type { Engine } from '@babylonjs/core/Engines';
import { RefObject, useEffect, useState } from 'react';
import type { babylonAllDeps } from './babylon-deps';
import type { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { Deferred } from '@jokester/ts-commonutil/cjs/concurrency/deferred';
import type { HemisphericLight } from '@babylonjs/core/Lights';

/**
 * a object to control camera/scene/stuff
 */
export interface BabylonContext {
  canvas: HTMLCanvasElement;
  engine: {
    instance: Engine;
    start(): void;
    stop(): void;
  };
  scene: Scene;
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
    const effectReleased = new Deferred();

    import('./babylon-deps').then(async (imported) => {
      if (!effective) return;
      const ctx = createBabylonCtx(maybeCanvas, imported.babylonAllDeps);
      setCtx(ctx);

      effectReleased.then(() => ctx.disposeAll());
    });

    return () => {
      effective = false;
      effectReleased.fulfill(0);
    };
  }, []);

  return ctx;
}

export function useBabylonInspector(ctx: null | BabylonContext, enabled: boolean): void {
  useEffect(() => {
    let effective = true;
    setTimeout(async () => {
      await import('./babylon-deps-inspector');
      if (effective && ctx) {
        if (enabled) {
          await ctx.scene.debugLayer.show();
        } else {
          await ctx.scene.debugLayer.hide();
        }
      }
    });
    return () => {
      effective = false;
    };
  }, [ctx, enabled]);
}

export function useBabylonDepsPreload(): void {
  useEffect(() => {
    setTimeout(async () => {
      import('./babylon-deps');
      import('./babylon-deps-inspector');
    });
  }, []);
}

export function initLight(ctx: BabylonContext): HemisphericLight {
  const { HemisphericLight, Vector3, Color3 } = ctx.deps;

  const light = new HemisphericLight('light1', new Vector3(0, 1, 0), ctx.scene);
  light.specular = Color3.Black();
  light.groundColor = new Color3(1, 1, 1);
  return light;
}

export function initArcRotateCamera(ctx: BabylonContext): ArcRotateCamera {
  const { ArcRotateCamera, HemisphericLight, Vector3, Color3 } = ctx.deps;

  const camera = new ArcRotateCamera(
    'camera',
    /* alpha: rotation around "latitude axis" */ -Math.PI / 2,
    /* beta: rotation around "longitude axis" */ Math.PI / 2,
    1,
    Vector3.Zero(),
    ctx.scene,
  );
  camera.attachControl(ctx.canvas, false);

  return camera;
}

/**
 * @internal
 */
function createBabylonCtx(canvas: HTMLCanvasElement, deps: typeof babylonAllDeps): BabylonContext {
  const { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, Color3, Color4 } = deps;

  const engine = new Engine(canvas, true);
  const scene = new Scene(engine);

  return {
    canvas,
    engine: {
      instance: engine,

      start() {
        engine.runRenderLoop(() => engine.scenes.forEach((s) => s.render()));
      },
      stop() {
        engine.stopRenderLoop();
      },
    },
    scene,
    disposeAll: function () {
      engine.stopRenderLoop();
      scene.cameras.forEach((camera) => {
        camera.detachControl(canvas);
        camera.dispose();
      });

      engine.scenes.forEach((s) => {
        s.cameras.forEach((c) => {
          c.detachControl();
          c.dispose();
        });
        s.dispose();
      });

      engine.dispose();
    },
    deps,
  } as const;
}
