import { Node } from '../../models/node';

export function generateStairMaze(grid: Node[]):Node[]{
    const wallNodes = [];
    let row = 25;
    let col = 1;

    //first stair up
    while(true){
        if(col == 26){
            break;
        }
        const currentNode = grid[row][col];
        wallNodes.push(currentNode);
        row--;
        col++;
    }

    row = 2;

    // first stair down
    while(true){
        if(col == 50){
            break;
        }
        const currentNode = grid[row][col];
        wallNodes.push(currentNode);
        row++;
        col++;
    }

    row = 24;

    while(true){
        if(col == 68){
            break;
        }
        const currentNode = grid[row][col];
        wallNodes.push(currentNode);
        row--;
        col++;
    }

    return wallNodes;
}
