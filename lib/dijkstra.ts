export interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  icon: any;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  weight: number;
}

export interface DijkstraStep {
  timelineIndex: number;
  currentNode: string | null;
  visited: string[];
  distances: Record<string, number>;
  previous: Record<string, string | null>;
  queue: { node: string; dist: number }[];
  activeLines: number[];
  explanation: string;
  /** Structured log fields for the Navigation Log terminal */
  statusLabel: string;
  action: string;
  note: string;
  status: "init" | "searching" | "found" | "not_found";
  candidateEdges: string[];
  highlightedEdges: string[];
}

/**
 * Generates an array of steps representing the execution of Dijkstra's algorithm.
 * The implementation mirrors the original generateSteps logic used in the page component.
 */
export function generateDijkstraSteps(start: string, end: string, nodes: Node[], edges: Edge[]): DijkstraStep[] {
  const steps: DijkstraStep[] = [];
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const visited: string[] = [];
  const queue: { node: string; dist: number }[] = [];

  nodes.forEach(n => {
    distances[n.id] = Infinity;
    previous[n.id] = null;
  });
  distances[start] = 0;
  queue.push({ node: start, dist: 0 });

  // Initial step
  const startLabel = nodes.find(n => n.id === start)?.label ?? start;
  const endLabel = nodes.find(n => n.id === end)?.label ?? end;
  steps.push({
    timelineIndex: 0,
    currentNode: null,
    visited: [],
    distances: { ...distances },
    previous: { ...previous },
    queue: [...queue],
    activeLines: [1, 2, 3],
    explanation: `System initialized. Distance to ${startLabel} is 0 mins. All other locations are unknown (Infinity).`,
    statusLabel: "INIT",
    action: `Origin locked at ${startLabel}`,
    note: `Target: ${endLabel} — all other distances set to ∞`,
    status: "init",
    candidateEdges: [],
    highlightedEdges: []
  });

  let isFound = false;
  while (queue.length > 0) {
    queue.sort((a, b) => a.dist - b.dist);
    const curr = queue.shift()!;
    if (distances[curr.node] < curr.dist) continue;

    // Selecting node step
    const currLabel = nodes.find(n => n.id === curr.node)?.label ?? curr.node;
    steps.push({
      timelineIndex: 1,
      currentNode: curr.node,
      visited: [...visited],
      distances: { ...distances },
      previous: { ...previous },
      queue: [...queue],
      activeLines: [6],
      explanation: `Selecting closest unvisited location: ${currLabel} (Known time: ${curr.dist} mins).`,
      statusLabel: "SCANNING",
      action: `Entering node: ${currLabel}`,
      note: `Best known distance: ${curr.dist} min`,
      status: "searching",
      candidateEdges: [],
      highlightedEdges: []
    });

    if (curr.node === end) {
      isFound = true;
      visited.push(curr.node);
      break;
    }

    visited.push(curr.node);
    const neighbors = edges.filter(e => e.source === curr.node || e.target === curr.node);
    const candidateEdges = neighbors.map(e => e.id);

    // Scanning neighbors step
    steps.push({
      timelineIndex: 1,
      currentNode: curr.node,
      visited: [...visited],
      distances: { ...distances },
      previous: { ...previous },
      queue: [...queue],
      activeLines: [10],
      explanation: `Scanning all roads connected to ${currLabel}.`,
      statusLabel: "PROBING",
      action: `Scanning roads from ${currLabel}`,
      note: `${neighbors.length} connected road${neighbors.length !== 1 ? 's' : ''} detected`,
      status: "searching",
      candidateEdges: [...candidateEdges],
      highlightedEdges: []
    });

    for (const edge of neighbors) {
      const neighborId = edge.source === curr.node ? edge.target : edge.source;
      if (visited.includes(neighborId)) continue;

      const newDist = distances[curr.node] + edge.weight;
      if (newDist < distances[neighborId]) {
        distances[neighborId] = newDist;
        previous[neighborId] = curr.node;
        queue.push({ node: neighborId, dist: newDist });

        const nbLabel = nodes.find(n => n.id === neighborId)?.label ?? neighborId;
        steps.push({
          timelineIndex: 1,
          currentNode: curr.node,
          visited: [...visited],
          distances: { ...distances },
          previous: { ...previous },
          queue: [...queue],
          activeLines: [11, 12, 13, 14],
          explanation: `Found faster route to ${nbLabel}! New time: ${newDist} mins via ${currLabel}.`,
          statusLabel: "ROUTE UPDATE",
          action: `Shorter path to ${nbLabel} found`,
          note: `${newDist} min via ${currLabel}`,
          status: "searching",
          candidateEdges: [edge.id],
          highlightedEdges: []
        });
      } else {
        const nbLabel = nodes.find(n => n.id === neighborId)?.label ?? neighborId;
        steps.push({
          timelineIndex: 1,
          currentNode: curr.node,
          visited: [...visited],
          distances: { ...distances },
          previous: { ...previous },
          queue: [...queue],
          activeLines: [11, 12],
          explanation: `Checked road to ${nbLabel}, but existing route is already faster or equal.`,
          statusLabel: "NO CHANGE",
          action: `Route to ${nbLabel} unchanged`,
          note: `Current path is already optimal`,
          status: "searching",
          candidateEdges: [edge.id],
          highlightedEdges: []
        });
      }
    }
  }

  const highlightedEdges: string[] = [];
  if (isFound) {
    let curr = end;
    while (previous[curr] !== null) {
      const prev = previous[curr]!;
      const edge = edges.find(e => (e.source === curr && e.target === prev) || (e.source === prev && e.target === curr));
      if (edge) highlightedEdges.push(edge.id);
      curr = prev;
    }
    steps.push({
      timelineIndex: 2,
      currentNode: end,
      visited: [...visited],
      distances: { ...distances },
      previous: { ...previous },
      queue: [...queue],
      activeLines: [7],
      explanation: `Destination locked! Shortest route confirmed with total time of ${distances[end]} mins.`,
      statusLabel: "ROUTE LOCKED",
      action: `Optimal path to ${endLabel} confirmed`,
      note: `Total travel time: ${distances[end]} min`,
      status: "found",
      candidateEdges: [],
      highlightedEdges,
    });
  } else {
    steps.push({
      timelineIndex: 2,
      currentNode: null,
      visited: [...visited],
      distances: { ...distances },
      previous: { ...previous },
      queue: [...queue],
      activeLines: [18],
      explanation: `Destination unreachable from starting location.`,
      statusLabel: "UNREACHABLE",
      action: `No valid path to ${endLabel}`,
      note: `All connected nodes have been exhausted`,
      status: "not_found",
      candidateEdges: [],
      highlightedEdges: [],
    });
  }

  return steps;
}
