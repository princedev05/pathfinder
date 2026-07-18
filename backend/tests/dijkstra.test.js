import assert from 'node:assert/strict';
import { dijkstra } from '../utilities/dijkstra.utility.js';

const graph = {
  A: [{ node: 'B', weight: 1 }, { node: 'C', weight: 4 }],
  B: [{ node: 'A', weight: 1 }, { node: 'C', weight: 2 }],
  C: [{ node: 'A', weight: 4 }, { node: 'B', weight: 2 }],
};

const disconnectedGraph = {
  A: [{ node: 'B', weight: 1 }],
  B: [{ node: 'A', weight: 1 }],
  C: [],
};

const singleNodeGraph = {
  A: [],
};

function run() {
  const pathResult = dijkstra(graph, 'A', 'C');
  assert.equal(pathResult.distance, 3);
  assert.deepEqual(pathResult.path, ['A', 'B', 'C']);

  const disconnected = dijkstra(disconnectedGraph, 'A', 'C');
  assert.equal(disconnected.distance, Infinity);
  assert.deepEqual(disconnected.path, []);

  const singleNode = dijkstra(singleNodeGraph, 'A', 'A');
  assert.equal(singleNode.distance, 0);
  assert.deepEqual(singleNode.path, ['A']);

  console.log('dijkstra tests passed');
}

run();
