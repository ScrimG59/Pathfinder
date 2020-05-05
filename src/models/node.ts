import { GridComponent } from 'src/app/grid/grid.component';

export class Node{
    id: number;
    isStart: boolean;
    isEnd: boolean;
    isWall: boolean;
    isVisited: boolean;
    isDiagonal: boolean;
    distance: number;
    //###########
    // for astar algo
    f: number;
    g: number;
    h: number;
    closed: boolean;
    //############
    row: number;
    column: number;
    parentNode: Node;
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
        this.parentNode = null;
        this.isShortestPath = false;
        this.isActuallyVisited = false;
        this.closed = false;
        this.isDiagonal = false;
    }
}