import { NOISE_PRELUDE } from '../noise';

/**
 * Shunya scene — a deliberately different atmosphere from the hero.
 *
 * The hero is a bright, energetic ribbon field. Shunya should feel like deep
 * water at night: near-black, cold, slow, and mostly empty. A low horizon glow,
 * stretched nebula wisps, a sparse hash-gated star matrix and one very slow
 * horizontal sweep. Motion runs at roughly a third of the hero's rate so the
 * section reads as cinematic and patient rather than busy.
 */
export const SHUNYA_FRAGMENT = /* glsl */ `
precision highp float;

uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_pointer;
uniform float u_intro;

${NOISE_PRELUDE}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
  float t = u_time * 0.018;

  // --- Base: deeper and colder than the hero ---------------------------
  vec3 col = mix(
    vec3(0.007, 0.012, 0.021),
    vec3(0.013, 0.032, 0.046),
    smoothstep(-0.90, 0.60, -uv.y)
  );

  // --- Nebula wisps: vertically stretched, very low contrast ------------
  vec2 p = vec2(uv.x * 0.70, uv.y * 0.35)
         + vec2(u_pointer.x * 0.09, u_pointer.y * 0.05);
  float w = fbm(p * 1.30 + vec2(t * 0.35, -t * 0.12));
  float wisp = smoothstep(0.40, 0.96, w);
  col += mix(vec3(0.020, 0.100, 0.160), vec3(0.030, 0.160, 0.150), w) * wisp * 0.90;

  // --- Horizon glow: the one warm-ish anchor in the frame ---------------
  float horizon = exp(-pow((uv.y + 0.42) * 3.2, 2.0));
  col += vec3(0.040, 0.200, 0.220) * horizon * 0.55;
  col += vec3(0.060, 0.120, 0.340) * exp(-pow((uv.y + 0.30) * 1.5, 2.0)) * 0.35;

  // --- Sparse star matrix: only ~1 cell in 10 is lit --------------------
  vec2 sp = uv * 26.0 + vec2(0.0, u_time * 0.02);
  vec2 cell = floor(sp);
  vec2 fcell = fract(sp) - 0.5;
  float lit = step(0.90, hash21(cell));
  float twinkle = 0.55 + 0.45 * sin(u_time * 1.1 + hash21(cell + 3.3) * 40.0);
  float star = lit * twinkle * smoothstep(0.34, 0.0, length(fcell));
  col += vec3(0.55, 0.78, 1.00) * star * 0.55;

  // --- Slow sweep: a single travelling band, 3% opacity ----------------
  float sweepY = fract(u_time * 0.035) * 2.2 - 1.1;
  col += vec3(0.10, 0.30, 0.34) * exp(-pow((uv.y - sweepY) * 9.0, 2.0)) * 0.16;

  // --- Heavy vignette ----------------------------------------------------
  col *= 1.0 - 0.75 * smoothstep(0.25, 1.35, length(uv * vec2(0.85, 1.00)));

  col *= u_intro;
  col += (hash21(gl_FragCoord.xy * 1.7 + fract(u_time) * 57.0) - 0.5) / 200.0;

  gl_FragColor = vec4(max(col, 0.0), 1.0);
}
`;
