import { Component, OnInit } from '@angular/core';
import {Node} from '../../models/node';
import {executeDijkstra, createShortestPath} from '../../models/dijkstra';
import { visitAll } from '@angular/compiler';

const GRID_NODES = [];
var mouseIsPressed = false;

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
    }
  }

  visualizeAlgorithm(){
    const startNode = this.nodes[590];
    const endNode = this.nodes[628];
    const visitedNodes = executeDijkstra(this.nodes, startNode, endNode);
    const shortestPath = createShortestPath(endNode);
    for(let i = 0; i < shortestPath.length; i++){
      console.log('[SHORTEST PATH]:' + shortestPath[i].row + ' ' + shortestPath[i].column);
    }
    console.log('[GRID] Shortest Path: ' + shortestPath.length);
    console.log('[GRID]: ' + shortestPath[0].row + ' ' + shortestPath[0].column);
    this.animateAlgorithm(visitedNodes, shortestPath);
  }

  animateAlgorithm(visitedNodes: Node[], shortestPath: Node[]){
    for(let i = 0; i <= visitedNodes.length; i++){
      if(i == visitedNodes.length){
        setTimeout(() => {
          console.log('[GRID] Shortest Path: ' + shortestPath.length);
          console.log('[GRID]: ' + shortestPath[0].row + ' ' + shortestPath[0].column);
          for(var j = 0; j < shortestPath.length; j++){
              console.log('[ANIMATE_SHORTEST_PATH] Shortest Path: ' + shortestPath.length);
              console.log('[ANIMATE_SHORTEST_PATH]: ' + shortestPath[j]);
              shortestPath[j].isActuallyVisited = false;
              shortestPath[j].isShortestPath = true;
          }
        }, i * 10);
        return;
      }
      setTimeout(() => {
        visitedNodes[i].isActuallyVisited = true;
      }, i * 10);
    }
  }

  animateShortestPath(shortestPath: Node[]){
    for(var i = 0; i < shortestPath.length; i++){
      setTimeout(() => {
        console.log('[ANIMATE_SHORTEST_PATH] Shortest Path: ' + shortestPath.length);
        console.log('[ANIMATE_SHORTEST_PATH]: ' + shortestPath[i].row + ' ' + shortestPath[i].column);
        shortestPath[i].isActuallyVisited = false;
        shortestPath[i].isShortestPath = true;
      }, i * 50);
    }
  }

  toggleWall(index: number){
    if(this.nodes[index].isStart || this.nodes[index].isEnd){}
    else{
        this.nodes[index].isWall = !this.nodes[index].isWall;
    }
    console.log('ROW: ' + this.nodes[index].row + ' COLUMN: ' + this.nodes[index].column + ' INDEX: '+ index);
  }

  mouseDown(index: number){
    this.toggleWall(index);
    mouseIsPressed = true;
  }

  mouseOver(index: number){
    if(mouseIsPressed)
      this.toggleWall(index);
  }

  mouseUp(index: number){
    mouseIsPressed = false;
  }
}
