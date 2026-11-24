/** Shared named constants for every study. */

export const MAX_PIXEL_RATIO = 2;
export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export const COLOR_BACKGROUND = 0x14161a;
export const COLOR_CUBE = 0x44aa88;
export const COLOR_LIGHT = 0xffffff;

export const CAMERA_FOV_DEG = 75;
export const CAMERA_NEAR = 0.1;
export const CAMERA_FAR = 50;
export const CAMERA_START_Z = 2.5;

export const LIGHT_INTENSITY = 3;
export const LIGHT_START_POSITION = [-1, 2, 4] as const;

/** Radians per second the cube spins about each axis. */
export const SPIN_RATE = 0.8;

/** Clamp for frame deltas (seconds) so a backgrounded tab does not jump on return. */
export const MAX_FRAME_DT = 0.1;
