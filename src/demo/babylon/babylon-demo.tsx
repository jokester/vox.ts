import React, { useEffect, useRef, useState } from 'react';
import { ParsedVoxFile } from '../../types/vox-types';
import { useBabylonContext } from './init-babylon';
import classNames from 'classnames';
import { useMounted } from '../components/hooks/use-mounted';
import { createRefAxes } from './deps/create-ref-axes';
import { renderPlayground } from './render-playground';
import { binaryConversion } from '../../util/binary-conversion';
import { basicParser } from '../../parser/basic-parser';
import { renderModel } from './render-vox-model';

export const BabylonDemo: React.FC = () => {
  const [model, setModel] = useState<null | ParsedVoxFile>(null);

  if (model) {
    return <BabylonModelRenderer model={model} onReset={() => setModel(null)} />;
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

  const doReadBlob = async (blob: Blob) => {
    const bytes = await binaryConversion.blob.toArrayBuffer(blob);
    const parsed = basicParser(bytes, true);
    if (parsed.models.length === 1) {
      props.onModelRead?.(parsed);
    }
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
      <input
        type="file"
        ref={inputRef}
        onChange={(ev) => {
          const file0 = ev.target.files?.item(0);
          file0 && onFileSelected(file0);
        }}
      />
    </div>
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

    createRefAxes(20, babylonCtx.scene, babylonCtx.deps);
    if (props.model && props.model.models.length) {
      renderModel(babylonCtx, props.model.models[0], props.model)
        //
        .then(babylonCtx.engine.start);
    } else {
      babylonCtx.camera.setRadius(50);
      renderPlayground(babylonCtx);
      babylonCtx.engine.start();
    }
  }, [babylonCtx, props.model]);
  return (
    <div className={classNames('py-24')}>
      <canvas ref={canvasRef} className={classNames('bg-white mx-auto')} style={{ width: 640, height: 480 }} />
    </div>
  );
};
