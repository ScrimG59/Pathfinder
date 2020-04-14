import {Node} from '../models/node';

    export function executeDijkstra(grid: Node[], startNode: Node, endNode: Node){
        const visitedNodes = [];
        var unvisitedNodes = [];
        var currentNode = null;
        // initialize 
        intialize(grid, visitedNodes, unvisitedNodes);
        while(unvisitedNodes.length != 0){
            // get an array of unvisited nodes sorted according to the shortest distance
            unvisitedNodes = getSortedNodes(unvisitedNodes);
            // currentNode is the node with shortest distance
            currentNode = unvisitedNodes.shift();
            console.log(currentNode.row + currentNode.column);
            // skip the walls
            if(currentNode.isWall){continue;}
            // distance == -1 means infinite, so there's a problem
            if(currentNode.distance == -1){return visitedNodes;}
            // set the current node's "isVisited"-property to true
            currentNode.isVisited = true;
            // push the current node into an array of already visited nodes
            visitedNodes.push(currentNode);
            if(currentNode.id == endNode.id){
                return visitedNodes;
            }
        }
        updateUnvisitedNeighbors(grid, currentNode);
    }

    function intialize(grid: Node[], visitedNodes: Node[], unvisitedNodes: Node[]): void{
        for(let i: number = 0; i < grid.length; i++){
            if(grid[i].isStart){
                grid[i].distance = 0;
            }
            else{
                grid[i].distance = -1;
            }
            grid[i].previousNode = null;
            visitedNodes[i] = null;
        }
        unvisitedNodes = getAll(grid);
    }

    function getUnvisitedNeighbors(grid: Node[], currentNode: Node): Node[]{
        const neighbors = [];
        // get the column and row from the current node
        console.log('[DIJKSTRA]: CurrentNode: ' + currentNode.row + ' ' + currentNode.column);
        const column = currentNode.column;
        const row = currentNode.row;
        // get the node above
        if(row > 0){
            neighbors.push(grid[(row+1)*(column+1)]);
        }
        // get the node below
        if(row < grid.length - 1){
            neighbors.push(grid[(row+1)*(column+1)+(2*58)]);
        }
        // get the node on the left
        if(column > 0){
            neighbors.push(grid[(2*58)+(column-1)]);
        }
        // get the node on the right
        if(column < 57){
            neighbors.push(grid[(2*58)+(column-1)]);
        }
        
        // only return the neighbors that weren't visited yet
        return neighbors.filter(neighbor => !neighbor.isVisited);
    }

    function updateUnvisitedNeighbors(grid: Node[], currentNode: Node): void{
        // get all unvisited neighbors of the current node
        const unvisitedNeighbors = getUnvisitedNeighbors(grid, currentNode);
        // for each unvisited neighbor set the distance to the current node's distance + 1
        // +1 because the distance between the current node and the neighbor is 1
        // also set the neighbors "previousNode"-property to the current node
        unvisitedNeighbors.forEach(node => {
            node.distance = currentNode.distance + 1;
            node.previousNode = currentNode;
        });
    }

    function getSortedNodes(unvisitedNodes: Node[]): Node[]{
        // gets all the the unvisited nodes, sorted according to the shortest distance
        unvisitedNodes.sort((a, b) => a.distance - b.distance)
        return unvisitedNodes;
    }

    function getAll(grid: Node[]): Node[]{
        const nodes = [];
        // gets all nodes of the given grid
        for(const node of grid){
            nodes.push(node);
        }
        return nodes;
    }

    export function createShortestPath(endNode: Node): Node[]{
        const shortestPath = [];
        // set the current node to the end node
        var currentNode = endNode;
        // backtrack from the end node all the way to the starting node
        while(currentNode != null){
            // add the current node to the array of nodes for the shortest path
            shortestPath.unshift(currentNode);
            // then set current node to the current node's previous node ==> Backtracking
            currentNode = currentNode.previousNode;
        }
        return shortestPath;
    }