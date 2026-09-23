/** Independent particles in a local flow. Appearance is never changed. */
export const PORTRAIT_FLOW_RADIUS = 96;
export type PortraitParticle = { hx: number; hy: number; ox: number; oy: number; vx: number; vy: number };
export type PortraitPointer = { x: number; y: number; vx: number; vy: number; active: boolean };

export function stepPortraitParticle(p: PortraitParticle, pointer: PortraitPointer, seconds: number, dt: number): boolean {
  const delta = Math.min(1 / 30, Math.max(0, dt));
  const dx = p.hx + p.ox - pointer.x;
  const dy = p.hy + p.oy - pointer.y;
  const distance = Math.hypot(dx, dy);
  if (!pointer.active || distance >= PORTRAIT_FLOW_RADIUS) {
    // A quick, monotonic return. No elastic overshoot or long trailing wake.
    const keep = Math.exp(-25 * delta);
    p.ox *= keep; p.oy *= keep;
    p.vx = p.vy = 0;
    if (Math.hypot(p.ox, p.oy) < 0.08) {
      p.ox = p.oy = 0;
      return false;
    }
    return true;
  }

  const angle = distance > 0.01 ? Math.atan2(dy, dx) : p.hx * 0.73 + p.hy * 0.39;
  const nx = Math.cos(angle), ny = Math.sin(angle);
  const falloff = 1 - distance / PORTRAIT_FLOW_RADIUS;
  const influence = falloff * falloff * (3 - 2 * falloff);
  // Smooth local variation breaks up a rigid disc, without random jitter.
  const flow = 1 + 0.19 * Math.sin(p.hx * 0.033 + p.hy * 0.021 + seconds * 1.1);
  const curl = 92 * influence * flow;
  const core = 24 + 3 * Math.sin(angle * 2 + seconds * 0.8);
  const separation = 110 * Math.exp(-((distance / core) ** 2));
  const home = 0.32 + 18 * (1 - influence) ** 4;
  const targetX = nx * separation - ny * curl - p.ox * home + pointer.vx * influence * 0.12;
  const targetY = ny * separation + nx * curl - p.oy * home + pointer.vy * influence * 0.12;
  const response = 1 - Math.exp(-32 * delta);
  p.vx += (targetX - p.vx) * response;
  p.vy += (targetY - p.vy) * response;
  p.ox += p.vx * delta;
  p.oy += p.vy * delta;
  return true;
}

/** Local spacing keeps flowing dots distinct instead of piling into a rim. */
export function separatePortraitParticles(particles: Iterable<PortraitParticle>) {
  const spacing = 2.7;
  const buckets = new Map<number, PortraitParticle[]>();
  for (const p of particles) {
    const col = Math.floor((p.hx + p.ox) / spacing);
    const row = Math.floor((p.hy + p.oy) / spacing);
    for (let y = row - 1; y <= row + 1; y++) {
      for (let x = col - 1; x <= col + 1; x++) {
        const neighbors = buckets.get(x + y * 2048);
        if (!neighbors) continue;
        for (const other of neighbors) {
          const dx = p.hx + p.ox - other.hx - other.ox;
          const dy = p.hy + p.oy - other.hy - other.oy;
          const distance = Math.hypot(dx, dy);
          if (distance >= spacing) continue;
          const angle = distance > 0.001 ? Math.atan2(dy, dx) : p.hx * 0.73 + p.hy * 0.39;
          const correction = (spacing - distance) * 0.45;
          const sx = Math.cos(angle) * correction;
          const sy = Math.sin(angle) * correction;
          p.ox += sx; p.oy += sy;
          other.ox -= sx; other.oy -= sy;
        }
      }
    }
    const key = col + row * 2048;
    const bucket = buckets.get(key);
    if (bucket) bucket.push(p); else buckets.set(key, [p]);
  }
}
