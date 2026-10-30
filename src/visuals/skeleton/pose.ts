/**
 * Static poses for the skeleton motif (DESIGN_BRIEF §2). Coordinates in the
 * 400 x 320 drawing space used by the hero drawings. D2 adds keyframes for the
 * animated version.
 */

export type Joint =
  | 'head'
  | 'neck'
  | 'shoulderL'
  | 'shoulderR'
  | 'elbowL'
  | 'elbowR'
  | 'wristL'
  | 'wristR'
  | 'hipL'
  | 'hipR'
  | 'kneeL'
  | 'kneeR'
  | 'ankleL'
  | 'ankleR'

export type Pose = Record<Joint, [number, number]>

/** Connections drawn as 1.5 px lines. */
export const BONES: [Joint, Joint][] = [
  ['neck', 'shoulderL'],
  ['neck', 'shoulderR'],
  ['shoulderL', 'elbowL'],
  ['elbowL', 'wristL'],
  ['shoulderR', 'elbowR'],
  ['elbowR', 'wristR'],
  ['shoulderL', 'hipL'],
  ['shoulderR', 'hipR'],
  ['hipL', 'hipR'],
  ['hipL', 'kneeL'],
  ['kneeL', 'ankleL'],
  ['hipR', 'kneeR'],
  ['kneeR', 'ankleR'],
]

/** Standing at a workbench, reaching forward to place a part (grip and place cycle). */
export const reachPose: Pose = {
  head: [176, 70],
  neck: [170, 92],
  shoulderL: [154, 102],
  shoulderR: [184, 106],
  elbowL: [168, 146],
  elbowR: [222, 128],
  wristL: [196, 166],
  wristR: [262, 140],
  hipL: [152, 182],
  hipR: [170, 184],
  kneeL: [150, 242],
  kneeR: [174, 244],
  ankleL: [146, 302],
  ankleR: [180, 302],
}

/** Bending forward to a low bin (used to illustrate load). */
export const bendPose: Pose = {
  head: [236, 128],
  neck: [216, 132],
  shoulderL: [200, 132],
  shoulderR: [214, 142],
  elbowL: [214, 182],
  elbowR: [236, 188],
  wristL: [232, 226],
  wristR: [254, 230],
  hipL: [150, 176],
  hipR: [160, 182],
  kneeL: [162, 240],
  kneeR: [178, 242],
  ankleL: [150, 302],
  ankleR: [176, 302],
}
