/**
 * Deterministic node-graph generator.
 *
 * Uses a seeded mulberry32 PRNG rather than `Math.random` so a project's diagram
 * is identical on every render and across server/client — important because
 * this component renders on both. No hydration mismatch, no layout thrash.
 */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type GraphNode = { x: number; y: number; r: number; active: boolean };
export type GraphEdge = { from: number; to: number };

export function buildGraph(seed: number, nodeCount = 11): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const random = mulberry32(seed);
  const nodes: GraphNode[] = [];

  // Poisson-ish placement: keep a minimum distance so nodes never overlap.
  for (let i = 0; i < nodeCount; i += 1) {
    let candidate = { x: random(), y: random() };
    for (let attempt = 0; attempt < 24; attempt += 1) {
      const tooClose = nodes.some(
        (node) => Math.hypot(node.x - candidate.x, node.y - candidate.y) < 0.22,
      );
      if (!tooClose) break;
      candidate = { x: random(), y: random() };
    }
    nodes.push({
      x: candidate.x,
      y: candidate.y,
      r: 0.006 + random() * 0.009,
      // One node in three is "live" — the rest are the surrounding structure.
      active: i % 3 === 0,
    });
  }

  // Connect each node to its two nearest neighbours: sparse, legible, no spaghetti.
  const edges: GraphEdge[] = [];
  for (let i = 0; i < nodes.length; i += 1) {
    const nearest = nodes
      .map((node, j) => ({ j, d: Math.hypot(node.x - nodes[i].x, node.y - nodes[i].y) }))
      .filter((entry) => entry.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2)
      .map((entry) => entry.j)
      .sort((a, b) => a - b);

    for (const target of nearest) {
      const key = `${Math.min(i, target)}-${Math.max(i, target)}`;
      if (!edges.some((edge) => `${Math.min(edge.from, edge.to)}-${Math.max(edge.from, edge.to)}` === key)) {
        edges.push({ from: Math.min(i, target), to: Math.max(i, target) });
      }
    }
  }

  return { nodes, edges };
}
