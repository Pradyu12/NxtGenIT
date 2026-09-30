/**
 * Minimal WebGL helpers.
 *
 * Deliberately dependency-free: three.js would add ~150KB gzipped to the
 * critical path for what is two shaders. Everything here targets GLSL ES 1.00,
 * which both WebGL1 and WebGL2 contexts accept, so one shader source covers
 * every browser we support.
 */

export type GL = WebGL2RenderingContext | WebGLRenderingContext;

export const VERTEX_SHADER = /* glsl */ `
attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

/** Single oversized triangle — cheaper than a quad and avoids the diagonal seam. */
export const FULLSCREEN_TRIANGLE = new Float32Array([-1, -1, 3, -1, -1, 3]);

export function createContext(canvas: HTMLCanvasElement): GL | null {
  const attributes: WebGLContextAttributes = {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: false,
    powerPreference: 'high-performance',
    failIfMajorPerformanceCaveat: false,
  };

  const gl =
    canvas.getContext('webgl2', attributes) ??
    (canvas.getContext('webgl', attributes) as WebGLRenderingContext | null);

  return gl;
}

function compileShader(gl: GL, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[gl] shader compile failed:', gl.getShaderInfoLog(shader));
    }
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

export function createProgram(gl: GL, fragmentSource: string): WebGLProgram | null {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

  if (!vertex || !fragment) return null;

  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.bindAttribLocation(program, 0, 'aPosition');
  gl.linkProgram(program);

  // Shaders are reference-counted by the program; detach once linked.
  gl.detachShader(program, vertex);
  gl.detachShader(program, fragment);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[gl] program link failed:', gl.getProgramInfoLog(program));
    }
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

/** Resolves every active uniform location up front so the render loop stays allocation-free. */
export function resolveUniforms(gl: GL, program: WebGLProgram): Record<string, WebGLUniformLocation | null> {
  const uniforms: Record<string, WebGLUniformLocation | null> = {};
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number;

  for (let i = 0; i < count; i += 1) {
    const info = gl.getActiveUniform(program, i);
    if (!info) continue;
    const name = info.name.replace(/\[0\]$/, '');
    uniforms[name] = gl.getUniformLocation(program, info.name);
  }

  return uniforms;
}
