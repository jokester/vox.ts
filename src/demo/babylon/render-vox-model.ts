import { BabylonContext } from '../../babylon-react/babylon-ctx';
import { ParsedVoxFile, VoxelModel } from '../../types/vox-types';
import { BabylonMeshBuilder } from '../../babylon/babylon-mesh-builder';
import { wait } from '../../util/timing';

const logger = console;

export async function renderModel(
  ctx: BabylonContext,
  voxModel: VoxelModel,
  voxFile: ParsedVoxFile,
  shouldBreak?: () => boolean,
): Promise<boolean> {
  const firstModel = voxModel;
  // new mesh builder
  const started = BabylonMeshBuilder.progessive(voxModel, voxFile.palette, 'first-model', ctx.scene, ctx.deps, 100);

  for (const p of started) {
    await wait(0.02e3); // and do next step
    if (shouldBreak?.()) return false;
  }
  return true;
}
