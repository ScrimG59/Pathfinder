import { GridComponent } from 'src/app/grid/grid.component';

export class Node{
    id: number;
    isStart: boolean;
    isEnd: boolean;
    isWall: boolean;
    isVisited: boolean;
    distance: number;
    row: number;
    column: number;
    previousNode: Node;
    isShortestPath: boolean;
    isActuallyVisited: boolean;

    constructor(id: number, isStart: boolean, isEnd: boolean, isWall: boolean, isVisited: boolean, row: number, column: number){
        this.id = id;
        this.isStart = isStart;
        this.isEnd = isEnd;
        this.isWall = isWall;
        this.isVisited = isVisited;
        this.row = row;
        this.column = column;
        this.previousNode = null;
        this.isShortestPath = false;
        this.isActuallyVisited = false;
    }
}