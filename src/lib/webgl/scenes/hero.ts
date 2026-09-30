import { NOISE_PRELUDE } from '../noise';

/**
 * Hero scene — flowing digital ribbons over a deep midnight field.
 *
 * Design intent: cool near-black base, a single domain-warped aurora body
 * sitting right-of-centre, two families of thin additive light ribbons, and a
 * barely-there engineering grid that bends with the warp. The acid-green spark
 * is gated behind `step()` so it appears on roughly one in ten core pixels —
 * an accent, not a colour scheme.
 */
export const HERO_FRAGMENT = /* glsl */ `
precision highp float;

uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_pointer;
uniform float u_intro;

${NOISE_PRELUDE}

void main() {
  // Normalise to a 1-unit-tall space centred on the canvas.
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
  float t = u_time * 0.05;

  // Pointer parallax, offset well under one unit so type stays legible.
  vec2 p = uv * 0.90 + u_pointer * 0.14;
  p.y *= 0.95;

  // --- Domain warp: three nested fbm passes -----------------------------
  vec2 q = vec2(
    fbm(p * 1.10 + vec2(0.0,  t * 0.9)),
    fbm(p * 1.10 + vec2(4.7, -t * 0.6))
  );
  vec2 r = vec2(
    fbm(p * 1.45 + 2.2 * q + vec2(1.7, 9.2)),
    fbm(p * 1.45 + 2.2 * q + vec2(8.3, 2.8))
  );
  float w = fbm(p * 1.70 + 2.6 * r);

  // --- Base: near-black midnight, subtly lighter towards the top --------
  vec3 col = mix(
    vec3(0.015, 0.022, 0.037),
    vec3(0.026, 0.052, 0.094),
    smoothstep(-0.7, 0.9, uv.y)
  );

  // --- Aurora body -----------------------------------------------------
  float field = smoothstep(0.30, 0.92, w);
  float dField = length(uv * vec2(0.62, 1.15) - vec2(0.30, 0.10));
  float fieldMask = 1.0 - smoothstep(0.10, 1.20, dField);
  col += mix(vec3(0.055, 0.145, 0.36), vec3(0.020, 0.300, 0.34), q.x) * field * fieldMask * 0.85;

  // --- Ribbon families -------------------------------------------------
  float rc1 = (p.y + (q.x - 0.5) * 1.25) * 3.6 - t * 1.1;
  float rc2 = (p.x * 0.55 + p.y * 0.85 + (r.y - 0.5) * 1.5) * 2.1 + t * 0.7;

  float l1 = 1.0 - clamp(abs(fract(rc1) - 0.5) * 2.0, 0.0, 1.0);
  float l2 = 1.0 - clamp(abs(fract(rc2) - 0.5) * 2.0, 0.0, 1.0);

  col += vec3(0.13, 0.36, 0.95) * pow(l1, 6.0)  * 0.42;   // blue halo
  col += vec3(0.42, 0.78, 1.00) * pow(l1, 34.0) * 1.15;   // white-blue core
  col += vec3(0.05, 0.55, 0.60) * pow(l2, 5.0)  * 0.30;   // teal halo
  col += vec3(0.55, 0.95, 1.00) * pow(l2, 28.0) * 0.75;   // cyan core

  // --- Acid-green spark, gated to the brightest ribbon cores ------------
  col += vec3(0.72, 0.95, 0.23) * pow(l1, 90.0) * step(0.55, w) * 0.9;

  // --- Engineering grid, bent by the warp ------------------------------
  vec2 gp = p * 7.0 + q * 0.28;
  vec2 gd = abs(fract(gp) - 0.5);
  float gline = 1.0 - smoothstep(0.0, 0.055, min(gd.x, gd.y));
  float dGrid = length(uv * vec2(0.75, 1.10) - vec2(0.10, 0.05));
  col += vec3(0.30, 0.52, 0.80) * gline * (1.0 - smoothstep(0.05, 0.95, dGrid)) * 0.10;

  // --- Grade: top-left lift, vignette, dither --------------------------
  col += vec3(0.040, 0.090, 0.180) * (1.0 - smoothstep(-0.20, 1.00, uv.y * 0.8 - uv.x * 0.9)) * 0.5;
  col *= 1.0 - 0.55 * smoothstep(0.35, 1.50, length(uv * vec2(0.80, 1.00)));

  col *= u_intro;
  // Ordered-ish dither breaks up 8-bit banding in the dark gradients.
  col += (hash21(gl_FragCoord.xy + fract(u_time) * 91.7) - 0.5) / 220.0;

  gl_FragColor = vec4(max(col, 0.0), 1.0);
}
`;
