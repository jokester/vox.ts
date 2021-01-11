import React, { useEffect, useRef, useState } from 'react';
import { ParsedVoxFile } from '../../types/vox-types';
import { useBabylonContext } from './init-babylon';
import classNames from 'classnames';
import { useMounted } from '../components/hooks/use-mounted';
import { className } from '@babylonjs/core';
import { createRefAxes } from './deps/create-ref-axes';
import { renderPlayground } from './render-playground';

export const BabylonDemo: React.FC = () => {
  const [model, setModel] = useState<null | ParsedVoxFile>(null);

  if (1) {
    return <BabylonModelRenderer model={model || undefined} onReset={() => setModel(null)} />;
  } else {
    return (
      <div>
        <h1>pick a vox file</h1>
        <BabylonFilePicker onModelRead={setModel} />
      </div>
    );
  }
};

const BabylonFilePicker: React.FC<{ onModelRead?(got: ParsedVoxFile): void }> = (props) => {
  const [reading, setReading] = useState(false);
  const mounted = useMounted();

  const [file, setFile] = useState<null | File>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // TODO
  }, [file]);

  return (
    <input
      type="file"
      ref={inputRef}
      onChange={(ev) => {
        const file0 = ev.target.files?.item(0);
        if (file0) setFile(file0);
      }}
    />
  );
};

const BabylonModelRenderer: React.FC<{ onReset?(): void; model?: ParsedVoxFile }> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const babylonCtx = useBabylonContext(canvasRef);

  const started = useRef(false);

  useEffect(() => {
    if (!babylonCtx) {
      return;
    } else if (started.current) {
      return;
    }
    started.current = true;
    babylonCtx.camera.setRadius(50);

    createRefAxes(20, babylonCtx.scene, babylonCtx.deps);
    renderPlayground(babylonCtx).then(() => babylonCtx.engine.start());
  }, [babylonCtx]);
  return (
    <div className={classNames('py-24')}>
      <canvas ref={canvasRef} className={classNames('bg-white mx-auto')} style={{ width: 640, height: 480 }} />
    </div>
  );
};
