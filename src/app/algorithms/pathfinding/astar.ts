import { Node } from '../../models/node';

export function aStar(grid: Node[][], startNode: Node, endNode: Node, heuristic: string){
    // intialize
    let openList = [];
    let closedList = [];
    for(let i = 0; i < grid.length; i++){
        for(let j = 0; j < grid[i].length; j++){
            grid[i][j].f = 0;
            grid[i][j].g = 0;
            grid[i][j].h = 0;
            grid[i][j].parentNode = null;
        }
    }
    openList.push(startNode);
    while(openList.length != 0){
        let indexOfLowestF = 0;
        for(let i = 0; i < openList.length; i++){
            if(openList[i].f < openList[indexOfLowestF].f){
                indexOfLowestF = i;
            }
        }
        const currentNode = openList[indexOfLowestF];

        // we found the end node
        if(currentNode.isEnd){
            console.log('Found end node!');
            closedList.push(currentNode);
            return closedList;
        }

        // remove the node with lowest f value from the openList
        openList.splice(indexOfLowestF, 1);
        // and push it into the closedList
        currentNode.closed = true;
        closedList.push(currentNode);
        // get the 4 neighbors of the current node
        const neighbors = getNeighbors(grid, currentNode);

        for(let i = 0; i < neighbors.length; i++){
            const neighbor = neighbors[i];
            // if the neighbor already is in the closedList or it is a wall, just skip it
            if(closedList.includes(neighbor) || neighbor.isWall){
                console.log(`Neighbor ${neighbor.id} already in the closedList!`);
                continue;
            }

            // the gScore is just the distance from the start node to the current node
            let gScore = currentNode.g + 1;
            // this boolean value is helping us to differentiate if it's the most optimal path to the current node
            let isBestG = false;

            // first time visiting the node
            if(!openList.includes(neighbor)){
                console.log(`First time visiting Node ${neighbor.row} ${neighbor.column}`);
                // if it's the first time visiting the node, the gscore is the best (at least for the moment)
                isBestG = true;
                // get the heuristic distance
                neighbor.h = getHeuristicDistance(neighbor, endNode, heuristic);
                // add the current neighbor to the openList
                openList.push(neighbor);
            }

            // if it's not the first time visiting the node but the g score was worse on the previous time
            else if(gScore < neighbor.g){
                isBestG = true;
            }

            // if we found the temporal best path to this node
            if(isBestG){
                console.log(`Best path to node ${neighbor.row} ${neighbor.column}`);
                neighbor.parentNode = currentNode;
                neighbor.g = gScore;
                neighbor.f = neighbor.g + neighbor.h;
                console.log(`F: ${neighbor.f} G: ${neighbor.g} H: ${neighbor.h}`);
            }
        }
    }
    // return empty array if there was an error
    return [];
}

function getNeighbors(grid: Node[][], currentNode: Node): Node[]{
    const neighbors = [];
    // get the column and row from the current node
    console.log('[A*]: CurrentNode: ' + currentNode.row + ' ' + currentNode.column);
    const column = currentNode.column;
    const row = currentNode.row;
    // get the node above
    if(row > 0){
        var index =
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
    return neighbors;
}

function getHeuristicDistance(currentNode: Node, endNode: Node, heuristic: string): number{
    if(heuristic == 'euclidean'){
        const result = Math.sqrt(Math.pow((currentNode.row - endNode.row), 2) + Math.pow((currentNode.column - endNode.column), 2));
        console.log('Euclidean Distance as heuristic');
        console.log(`CurrentNode: ${currentNode.row} ${currentNode.column}, EndNode: ${endNode.row} ${endNode.column}, HeuristicDistance: ${result}`);
        return result;
    }
    else{
        const result = Math.abs(currentNode.row - endNode.row) + Math.abs(currentNode.column - endNode.column);
        console.log('Manhattan Distance as heuristic');
        console.log(`CurrentNode: ${currentNode.row} ${currentNode.column}, EndNode: ${endNode.row} ${endNode.column}, HeuristicDistance: ${result}`);
        return result;
    }
}

export function retraceShortestPath(endNode: Node){
    const shortestPath = [];
    // set the current node to the end node
    var currentNode = endNode;
    // backtrack from the end node all the way to the starting node
    while(currentNode.parentNode != null){
        // add the current node to the array of nodes for the shortest path
        shortestPath.unshift(currentNode);
        // then set current node to the current node's previous node ==> Backtracking

        currentNode = currentNode.parentNode;
    }
    console.log('[A*] LENGTH: ' + shortestPath.length);
    return shortestPath;
}
