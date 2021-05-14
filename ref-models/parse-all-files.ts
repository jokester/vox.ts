import path from 'path';
import { Dirent } from 'fs';
import { fsp } from '@jokester/ts-commonutil/cjs/node';
import { basicParser } from '../src/parser/basic-parser';
import { VoxelModelSize } from '../src/types/vox-types';
import lodash from 'lodash';

async function* dfsDirectory(start: string): AsyncGenerator<{ path: string; entry: Dirent }> {
  const queue = [start];

  while (queue.length) {
    const p = queue.shift()!;
    const f = await fsp.stat(p);
    if (f.isDirectory()) {
      for (const child of await fsp.readDir(p, { withFileTypes: true })) {
        yield { path: path.join(p, child.name), entry: child };

        if (child.isDirectory()) {
          queue.unshift(path.join(p, child.name));
        }
      }
    }
  }
}

async function main() {
  const outLines: {
    filename: string;
    numBytes: number;
    error?: string;
    models?: { numVoxels: number; size: VoxelModelSize }[];
    materials?: { materialType: number; modelPropertyBits: string }[];
  }[] = [];
  for await (const maybeFile of dfsDirectory(path.join(__dirname, 'models'))) {
    if (maybeFile.entry.isFile() && /\.vox$/i.test(maybeFile.path)) {
      const bytes = await fsp.readFile(path.join(maybeFile.path));
      try {
        const parsed = basicParser(bytes.buffer);
        outLines.push({
          filename: maybeFile.path,
          numBytes: bytes.length,
          models: parsed.models.map((m) => ({ numVoxels: m.voxels.length, size: m.size })),
          materials: parsed.materials.map((m) => ({
            materialType: m.type,
            modelPropertyBits: '0b' + lodash.padStart(m.propertyBits.toString(2), 8, '0'),
          })),
        });
        console.debug('parsed file', maybeFile.path, bytes.length);
      } catch (e) {
        outLines.push({
          filename: maybeFile.path,
          numBytes: bytes.length,
          error: String(e),
        });
        console.debug('error parsing file', maybeFile.path, bytes.length);
      }
    }
  }

  outLines.sort((a, b) => a.numBytes - b.numBytes);

  await fsp.writeFile(path.join(__dirname, 'vox-files.json'), JSON.stringify(outLines, null, 2));
}

setTimeout(main);
