import fs from 'fs';
import path from 'path';

/**
 * taken from https://github.com/ephtracy/voxel-model/tree/master/vox/character
 * MAIN { SIZE, XYZI, RGBA }
 */
export const chrFoxVox = readVox('voxel-model/vox/character/chr_fox.vox');

/**
 * taken from https://github.com/ephtracy/voxel-model/tree/master/vox/anim
 * MAIN { SIZE, XYZI, RGBA }
 */
export const monu8Vox = readVox('voxel-model/vox/monument/monu8.vox');

/**
 * taken from https://github.com/ephtracy/voxel-model/tree/master/vox/monument
 * ANIM ?
 */
export const deerVox = readVox('voxel-model/vox/anim/deer.vox');

function readVox(basename: string): ArrayBuffer {
  return toArrayBuffer(fs.readFileSync(path.join(__dirname, '../../../../ref-models', basename)));
}

function toArrayBuffer(orig: Buffer): ArrayBuffer {
  const ret = new ArrayBuffer(orig.length);
  orig.copy(new Uint8Array(ret));
  return ret;
}
