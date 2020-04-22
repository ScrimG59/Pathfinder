import { Node } from '../../../models/node';

export function generateRandomMaze(grid: Node[][]): Node[]{

    const wallNodes = [];

    for(let i = 0; i < grid.length; i++){
        for(let j = 0; j < grid[i].length; j++){
            // returns a random int value from 0 to 1
            const random = Math.floor(Math.random() * 3.5);
            const currentNode = grid[i][j];
            if(random == 1 && !currentNode.isStart && !currentNode.isEnd)
                wallNodes.push(currentNode); 
        }
    }
    return wallNodes;
}