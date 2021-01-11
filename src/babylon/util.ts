import { VoxelColor } from '../types/vox-types';
import { Color4 } from '@babylonjs/core';

const white = { r: 0, b: 0, g: 0, a: 255 } as const;

export function buildBabylonColor(maybeColor: undefined | VoxelColor, kolor4: typeof Color4): Color4 {
  const { r, g, b, a } = maybeColor || white;
  return new kolor4(r / 255, g / 255, b / 255, a / 255);
}
