import {Node} from '../../../models/node';

    export function executeExperimental(grid: Node[], startNode: Node, endNode: Node){
        let visitedNodes = [];
        let unvisitedNodes = [];
        // initialize 
        //initialize(grid, visitedNodes, unvisitedNodes);
        for(let i: number = 0; i < grid.length; i++){
            if(grid[i].isStart){
                grid[i].distance = 0;
                grid[i].h = getHeuristicDistance(grid[i], endNode);
            }
            else{
                grid[i].distance = Infinity;
                grid[i].h = getHeuristicDistance(grid[i], endNode);
            }
            grid[i].parentNode = null;
        }
        unvisitedNodes = getAll(grid);
        console.log('unvisited nodes length: ' + unvisitedNodes.length);
        while(unvisitedNodes.length != 0){
            // get an array of unvisited nodes sorted according to the shortest distance
            unvisitedNodes.sort((a, b) => a.distance - b.distance);
            // currentNode is the node with shortest distance
            const currentNode = unvisitedNodes.shift();
            // skip the walls
            if(currentNode.isWall){
                console.log('Its a wall');
                continue;
            }
            // if distance is infinite, we are probably trapped in walls
            if(currentNode.distance == Infinity){
                console.log('WE GOT A PROBLEM!');
                return visitedNodes;
            }
            // set the current node's "isVisited"-property to true
            if(!currentNode.isStart && !currentNode.isEnd){
                currentNode.isVisited = true;
            }
            visitedNodes.push(currentNode);
            // push the current node into an array of already visited nodes
            if(currentNode.isEnd){
                console.log('End node reached!!');
                return visitedNodes;
            }
            if(currentNode.id == endNode.id){
                return visitedNodes;
            }
            console.log('updating neighbors')
            updateUnvisitedNeighbors(grid, currentNode);
        }
    }

    function getHeuristicDistance(currentNode: Node, endNode: Node): number{
        const result = Math.sqrt(Math.pow((currentNode.row - endNode.row), 2) + Math.pow((currentNode.column - endNode.column), 2));
        console.log(`CurrentNode: ${currentNode.row} ${currentNode.column}, EndNode: ${endNode.row} ${endNode.column}, HeuristicDistance: ${result}`);
        return result;
    }

    function getUnvisitedNeighbors(grid: Node[], currentNode: Node): Node[]{
        const neighbors = [];
        // get the column and row from the current node
        console.log('[DIJKSTRA]: CurrentNode: ' + currentNode.row + ' ' + currentNode.column);
        const column = currentNode.column;
        const row = currentNode.row;
        // get the node above
        if(row > 0){
            var index = 
            neighbors.push(grid[currentNode.id - 58]);
            console.log('Neighbor: ' + neighbors[neighbors.length-1].row + ' ' + neighbors[neighbors.length-1].column);
        }
        // get the node below
        if(row < 26){
            neighbors.push(grid[currentNode.id + 58]);
            console.log('Neighbor: ' + neighbors[neighbors.length-1].row + ' ' + neighbors[neighbors.length-1].column);
        }
        // get the node on the left
        if(column > 0){
            neighbors.push(grid[currentNode.id - 1]);
            console.log('Neighbor: ' + neighbors[neighbors.length-1].row + ' ' + neighbors[neighbors.length-1].column);
        }
        // get the node on the right
        if(column < 57){
            neighbors.push(grid[currentNode.id + 1]);
            console.log('Neighbor: ' + neighbors[neighbors.length-1].row + ' ' + neighbors[neighbors.length-1].column);
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
            node.distance = currentNode.distance + node.h + 1;
            node.parentNode = currentNode;
        });
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
            if(currentNode.parentNode.isStart){break;}
            currentNode = currentNode.parentNode;
        }
        console.log('[DIJKSTRA] LENGTH: ' + shortestPath.length);
        return shortestPath;
    }