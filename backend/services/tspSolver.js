const { fetchOsrmMatrix, fetchRouteGeometry } = require("./osrmService");

/**
 * Held-Karp Dynamic Programming (Bitmask DP) TSP Solver
 * Time Complexity: O(n^2 * 2^n)
 */
function heldKarpTSP(matrix, durationsMatrix, places, roundTrip = false) {
  const N = places.length;
  if (N === 0) return { order: [], legs: [], totalDistance: 0, totalDuration: 0 };
  if (N === 1) return { order: [places[0].id], legs: [], totalDistance: 0, totalDuration: 0 };

  const MAX_MASK = 1 << N;
  const dp = Array.from({ length: MAX_MASK }, () => Array(N).fill(Infinity));
  const durDp = Array.from({ length: MAX_MASK }, () => Array(N).fill(Infinity));
  const parent = Array.from({ length: MAX_MASK }, () => Array(N).fill(-1));

  // Base state: Start at place 0
  dp[1][0] = 0;
  durDp[1][0] = 0;

  for (let mask = 1; mask < MAX_MASK; mask++) {
    for (let u = 0; u < N; u++) {
      if (!(mask & (1 << u)) || dp[mask][u] === Infinity) continue;

      for (let v = 0; v < N; v++) {
        if (mask & (1 << v)) continue;

        const nextMask = mask | (1 << v);
        const newDist = dp[mask][u] + matrix[u][v];
        const newDur = durDp[mask][u] + durationsMatrix[u][v];

        if (newDist < dp[nextMask][v]) {
          dp[nextMask][v] = newDist;
          durDp[nextMask][v] = newDur;
          parent[nextMask][v] = u;
        }
      }
    }
  }

  const fullMask = MAX_MASK - 1;
  let lastNode = -1;
  let minCost = Infinity;

  if (roundTrip) {
    for (let u = 1; u < N; u++) {
      const totalCost = dp[fullMask][u] + matrix[u][0];
      if (totalCost < minCost) {
        minCost = totalCost;
        lastNode = u;
      }
    }
  } else {
    for (let u = 0; u < N; u++) {
      if (dp[fullMask][u] < minCost) {
        minCost = dp[fullMask][u];
        lastNode = u;
      }
    }
  }

  // Reconstruct path backward
  const pathIndices = [];
  let currMask = fullMask;
  let currNode = lastNode;

  while (currNode !== -1) {
    pathIndices.push(currNode);
    const prevNode = parent[currMask][currNode];
    currMask = currMask ^ (1 << currNode);
    currNode = prevNode;
  }
  pathIndices.reverse();

  if (roundTrip) {
    pathIndices.push(0);
  }

  // Build legs output
  const orderIds = pathIndices.map((idx) => places[idx].id);
  const legs = [];
  let totalDistance = 0;
  let totalDuration = 0;

  for (let k = 0; k < pathIndices.length - 1; k++) {
    const fromIdx = pathIndices[k];
    const toIdx = pathIndices[k + 1];
    const dist = Math.round(matrix[fromIdx][toIdx]);
    const dur = Math.round(durationsMatrix[fromIdx][toIdx]);

    legs.push({
      from: places[fromIdx].id,
      to: places[toIdx].id,
      distance: dist,
      duration: dur
    });

    totalDistance += dist;
    totalDuration += dur;
  }

  return {
    order: orderIds,
    legs,
    totalDistance,
    totalDuration
  };
}

/**
 * Main optimization service entry point
 */
async function optimizeRoute({ places, mode = "foot", roundTrip = false, startPlaceId = null }) {
  if (!places || places.length === 0) {
    throw new Error("No places provided for optimization.");
  }

  let orderedPlaces = [...places];
  if (startPlaceId) {
    const startIndex = orderedPlaces.findIndex((p) => p.id === startPlaceId);
    if (startIndex > 0) {
      const [startPlace] = orderedPlaces.splice(startIndex, 1);
      orderedPlaces.unshift(startPlace);
    }
  }

  // Cap at 12 places
  if (orderedPlaces.length > 12) {
    orderedPlaces = orderedPlaces.slice(0, 12);
  }

  // Fetch matrix from OSRM / Haversine
  const { distances, durations, estimated } = await fetchOsrmMatrix(orderedPlaces, mode);

  // Execute Held-Karp TSP
  const result = heldKarpTSP(distances, durations, orderedPlaces, roundTrip);

  return {
    ...result,
    estimated
  };
}

module.exports = {
  optimizeRoute,
  fetchRouteGeometry
};
