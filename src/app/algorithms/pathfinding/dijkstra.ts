import {Node} from '../../../models/node';

    export function executeDijkstra(grid: Node[][], startNode: Node, endNode: Node, diagonal: boolean){
        let visitedNodes = [];
        let unvisitedNodes = [];
        // initialize 
        for(let i: number = 0; i < grid.length; i++){
            for(let j = 0; j < grid[i].length; j++){
                if(grid[i][j].isStart){
                    grid[i][j].distance = 0;
                }
                else{
                    // setting every node's distance to infinity except the start node
                    grid[i][j].distance = Infinity;
                }
                // setting the parent (previous) node to null
                grid[i][j].parentNode = null;
            }
        }
        // getting all nodes from the current grid
        unvisitedNodes = getAll(grid);
        console.log('unvisited nodes length: ' + unvisitedNodes.length);
        // go through every unvisited node until the final node is reached
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
            console.log('updating neighbors')
            // update the unvisited neighbors
            updateUnvisitedNeighbors(grid, currentNode, diagonal);
        }
    }

    export function getUnvisitedNeighbors(grid: Node[][], currentNode: Node): Node[]{
        const neighbors = [];
        // get the column and row from the current node
        console.log('[DIJKSTRA]: CurrentNode: ' + currentNode.row + ' ' + currentNode.column);
        const column = currentNode.column;
        const row = currentNode.row;
        // get the node above
        if(row > 0){
            neighbors.push(grid[row - 1][column]);
            console.log('Neighbor: ' + neighbors[neighbors.length-1].row + ' ' + neighbors[neighbors.length-1].column + ' INDEX: ' + neighbors[neighbors.length-1].id);
        }
        // get the node below
        if(row < 26){
            neighbors.push(grid[row + 1][column]);
            console.log('Neighbor: ' + neighbors[neighbors.length-1].row + ' ' + neighbors[neighbors.length-1].column + ' INDEX: ' + neighbors[neighbors.length-1].id);
        }
        // get the node on the left
        if(column > 0){
            neighbors.push(grid[row][column - 1]);
            console.log('Neighbor: ' + neighbors[neighbors.length-1].row + ' ' + neighbors[neighbors.length-1].column + ' INDEX: ' + neighbors[neighbors.length-1].id);
        }
        // get the node on the right
        if(column < 68){
            neighbors.push(grid[row][column + 1]);
            console.log('Neighbor: ' + neighbors[neighbors.length-1].row + ' ' + neighbors[neighbors.length-1].column + ' INDEX: ' + neighbors[neighbors.length-1].id);
        }
        // only return the neighbors that weren't visited yet
        return neighbors.filter(neighbor => !neighbor.isVisited);
    }

    // UNDER CONSTRUCTION
    /*export function getUnvisitedDiagonalNeighbors(grid: Node[][], currentNode: Node): Node[]{
        const neighbors = [];
        // get the column and row from the current node
        console.log('[DIJKSTRA]: CurrentNode: ' + currentNode.row + ' ' + currentNode.column);
        const column = currentNode.column;
        const row = currentNode.row;
        let currentNeighbor = null; 
        // get the node above
        if(row > 0){
            currentNeighbor = grid[row - 1][column];
            neighbors.push(currentNeighbor);
            console.log('Neighbor: ' + neighbors[neighbors.length-1].row + ' ' + neighbors[neighbors.length-1].column + ' INDEX: ' + neighbors[neighbors.length-1].id);
        }
        // get the node diagonally right above
        if(row > 0 && column < 68){
            currentNeighbor = grid[row - 1][column + 1];
            currentNeighbor.isDiagonal = true; 
            neighbors.push(currentNeighbor);
        }
        // get the node on the right
        if(column < 68){
            currentNeighbor = grid[row][column + 1];
            neighbors.push(currentNeighbor);
            console.log('Neighbor: ' + neighbors[neighbors.length-1].row + ' ' + neighbors[neighbors.length-1].column + ' INDEX: ' + neighbors[neighbors.length-1].id);
        }
        // get the node diagonally right below
        if(row < 26 && column < 68){
            currentNeighbor = grid[row + 1][column + 1];
            currentNeighbor.isDiagonal = true; 
            neighbors.push(currentNeighbor);
        }
        // get the node below
        if(row < 26){
            currentNeighbor = grid[row + 1][column];
            neighbors.push(currentNeighbor);
            console.log('Neighbor: ' + neighbors[neighbors.length-1].row + ' ' + neighbors[neighbors.length-1].column + ' INDEX: ' + neighbors[neighbors.length-1].id);
        }
        // get the node diagonally left below
        if(row < 26 && column > 0){
            currentNeighbor = grid[row + 1][column - 1];
            currentNeighbor.isDiagonal = true;
            neighbors.push(currentNeighbor);
        }
        // get the node on the left
        if(column > 0){
            currentNeighbor = grid[row][column - 1];
            neighbors.push(currentNeighbor);
            console.log('Neighbor: ' + neighbors[neighbors.length-1].row + ' ' + neighbors[neighbors.length-1].column + ' INDEX: ' + neighbors[neighbors.length-1].id);
        }
        // get the node diagonally left above
        if(row > 0 && column > 0){
            currentNeighbor = grid[row - 1][column - 1];
            currentNeighbor.isDiagonal = true;
            neighbors.push(currentNeighbor);
        }
        // only return the neighbors that weren't visited yet
        return neighbors.filter(neighbor => !neighbor.isVisited);
    }*/

    function updateUnvisitedNeighbors(grid: Node[][], currentNode: Node, diagonal: boolean): void{
        // get all unvisited neighbors of the current node
        let unvisitedNeighbors;
        if(diagonal){
            //unvisitedNeighbors = getUnvisitedDiagonalNeighbors(grid, currentNode);
        }
        else {
            unvisitedNeighbors = getUnvisitedNeighbors(grid, currentNode);
        }
        // for each unvisited neighbor set the distance to the current node's distance + 1
        // +1 because the distance between the current node and the neighbor is 1
        // also set the neighbors "previousNode"-property to the current node
        unvisitedNeighbors.forEach(node => {
            if(node.isDiagonal){
                node.distance = currentNode.distance + 1.1;
            }
            else{
                // "1" is the standard weight (distance) from one node to its neighbors
                node.distance = currentNode.distance + 1;
            }
            node.parentNode = currentNode;
        });
    }

    export function getAll(grid: Node[][]): Node[]{
        const nodes = [];
        // gets all nodes of the given grid
        for(let i = 0; i < grid.length; i++){
            for(let j = 0; j < grid[i].length; j++){
                nodes.push(grid[i][j]);
            }
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
        return shortestPath;
    }