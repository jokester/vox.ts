import React, { useEffect, useRef, useState } from 'react';
import { ParsedVoxFile, VoxelModel } from '../../types/vox-types';
import {
  initArcRotateCamera,
  initLight,
  useBabylonContext,
  useBabylonInspector,
} from '../../babylon-react/babylon-ctx';
import classNames from 'classnames';
import { useMounted } from '../components/hooks/use-mounted';
import { createRefAxes } from '../../babylon-react/create-ref-axes';
import { binaryConversion } from '../../util/binary-conversion';
import { basicParser } from '../../parser/basic-parser';
import { renderModel } from './render-vox-model';

export const BabylonDemo: React.FC = () => {
  const [selected, setSelected] = useState<null | { modelIndex: number; voxFile: ParsedVoxFile }>(null);

  const onFileRead = (parsed: ParsedVoxFile) => {
    if (parsed.models.length < 1) {
      console.error('cannot read model', parsed);
    } else {
      setSelected({ modelIndex: 0, voxFile: parsed });
    }
  };

  if (selected) {
    return (
      <div className="p-4">
        <h1 className="mb-2 text-xl">model viewer</h1>
        <BabylonModelRenderer
          key={selected.modelIndex}
          model={selected.voxFile.models[selected.modelIndex]}
          voxFile={selected.voxFile}
          onReset={() => setSelected(null)}
        />
        <hr className="py-1" />
        <div className="space-x-2">
          {selected.voxFile.models.map((model, i) => (
            <button
              key={i}
              onClick={() => setSelected({ ...selected, modelIndex: i })}
              className="p-2 border-white border"
            >
              render model #{i}
            </button>
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div className="p-4">
        <h1 className="mb-2 text-xl">pick a vox file</h1>
        <BabylonFilePicker onFileRead={onFileRead} />
      </div>
    );
  }
};

const BabylonFilePicker: React.FC<{ onFileRead?(got: ParsedVoxFile): void }> = (props) => {
  const [reading, setReading] = useState(false);
  const mounted = useMounted();

  const [file, setFile] = useState<null | File>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // TODO
  }, [file]);

  const doReadBlob = async (blob: Blob) => {
    const bytes = await binaryConversion.blob.toArrayBuffer(blob);
    const parsed = basicParser(bytes);
    props.onFileRead?.(parsed);
  };

  const onFileSelected = async (f: File) => {
    try {
      if (reading) return;
      setReading(true);
      await doReadBlob(f);
    } finally {
      if (mounted.current && inputRef.current) {
        setReading(false);
        inputRef.current.value = '';
      }
    }
  };

  const onRequestResource = async (url: string) => {
    try {
      if (reading) return;
      setReading(true);
      const blob = await fetch(url).then((_) => _.blob());
      await doReadBlob(blob);
    } finally {
      mounted.current && setReading(false);
    }
  };

  return (
    <div>
      <ul>
        <li>
          Load file:
          <input
            type="file"
            ref={inputRef}
            disabled={reading}
            onChange={(ev) => {
              const file0 = ev.target.files?.item(0);
              file0 && onFileSelected(file0);
            }}
          />
        </li>
        {demoAssets.map((path, i) => (
          <li key={i}>
            <button
              className="border border-white p-1 disabled:opacity-25"
              disabled={reading}
              onClick={() => onRequestResource(path)}
            >
              load {path}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const BabylonModelRenderer: React.FC<{ onReset?(): void; model: VoxelModel; voxFile: ParsedVoxFile }> = (props) => {
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
    let effectRunning = true;

    // fixme: should re-init scene when model changes
    createRefAxes(100, babylonCtx.scene, babylonCtx.deps);

    const camera = initArcRotateCamera(babylonCtx);
    initLight(babylonCtx);
    babylonCtx.engine.start();

    camera.lowerRadiusLimit = Math.max(2 * props.model.size.x, 2 * props.model.size.y, 2 * props.model.size.z);
    renderModel(babylonCtx, props.model, props.voxFile, () => !effectRunning);
    return () => {
      babylonCtx.engine.stop();
      effectRunning = false;
    };
  }, [babylonCtx, props.model, props.voxFile]);

  const [enableInspector, setEnableInspector] = useState(false);
  useBabylonInspector(babylonCtx, enableInspector);

  return (
    <div className={classNames('py-24')}>
      <canvas ref={canvasRef} className={classNames('bg-white mx-auto')} style={{ width: 640, height: 480 }} />
      <hr />
      <p className="p-2 space-x-2">
        <button className="p-2" onClick={() => setEnableInspector(!enableInspector)}>
          {enableInspector ? 'disable inspector' : 'enable inspector'}
        </button>
        <button onClick={props.onReset}>reset</button>
      </p>
    </div>
  );
};

const demoAssets = ['/ref-models/chr_fox.vox', '/ref-models/deer.vox', '/ref-models/monu8.vox'] as const;
