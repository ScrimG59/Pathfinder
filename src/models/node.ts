export class Node{
    id: number;
    isStart: boolean;
    isEnd: boolean;
    isWall: boolean;
    isVisited: boolean;

    constructor(id: number, isStart: boolean, isEnd: boolean, isWall: boolean, isVisited: boolean){
        this.id = id;
        this.isStart = isStart;
        this.isEnd = isEnd;
        this.isWall = isWall;
        this.isVisited = isVisited;
    }
}