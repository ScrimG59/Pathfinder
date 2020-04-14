import { Component, OnInit } from '@angular/core';
import {Node} from '../../models/node';
import {executeDijkstra, createShortestPath} from '../../models/dijkstra';

const GRID_NODES = [];

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})

export class GridComponent implements OnInit {
  
  constructor() { }

  nodes = GRID_NODES;

  ngOnInit(): void {
    //generates the nodes for the grid
    let index: number = 0;
    for(var row: number = 0; row <= 20; row++){
      console.log(row);
      for(var column: number = 0; column < 58; column++){
        if(row == 10 && column == 10){
          GRID_NODES.push(new Node(index, true, false, false, false, row, column));
          console.log('Start Index: ' + index);
        }
        else if(row == 10 && column == 48){
          GRID_NODES.push(new Node(index, false, true, false, false, row, column));
          console.log('End Index: ' + index);
        }
        else{
          GRID_NODES.push(new Node(index, false, false,  false, false, row, column));
        }
        index++;
      }
      index++;
    }
    for(let i = 0; i < 1160; i++){
      if(GRID_NODES[i].row == null || GRID_NODES[i].column == null){
        console.log('NULL AT INDEX: ' + i);
      }
      else{console.log('Everything gucci!');}
    }
  }

  visualizeAlgorithm(){
    console.log('Works!');
    const startNode = this.nodes[590];
    console.log('COLUMN: ' + GRID_NODES[590].column + ' ROW: ' +  GRID_NODES[590].row);
    const endNode = this.nodes[628];
    console.log('COLUMN: ' + GRID_NODES[628].column + ' ROW: ' +  GRID_NODES[628].row);
    const visitedNodes = executeDijkstra(GRID_NODES, startNode, endNode);
    const shortestPath = createShortestPath(endNode);
    this.animateAlgorithm(visitedNodes, shortestPath);
  }

  animateAlgorithm(visitedNodes: Node[], shortestPath: Node[]){
    for(let i = 0; i <= visitedNodes.length; i++){
      if(i == visitedNodes.length){
        setTimeout(() => {
          this.animateShortestPath(shortestPath);
        }, i * 10);
        return;
      }
      setTimeout(() => {
        visitedNodes[i].isVisited = true;
      }, 50 * i);
    }
  }

  animateShortestPath(shortestPath: Node[]){

  }

  toggleWall(index: number){
    if(GRID_NODES[index].isStart || GRID_NODES[index].isEnd){}
    else{
      GRID_NODES[index].isWall = !GRID_NODES[index].isWall;
    }
    console.log('COLUMN: ' + GRID_NODES[index].column + ' ROW: ' + GRID_NODES[index].row + ' INDEX: '+ index);
  }
}
