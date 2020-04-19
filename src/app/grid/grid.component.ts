import { Component, OnInit } from '@angular/core';
import {Node} from '../../models/node';
import {executeDijkstra, createShortestPath} from '../algorithms/pathfinding/dijkstra';
import { aStar, retraceShortestPath } from '../algorithms/pathfinding/astar';
import { executeExperimental } from '../algorithms/pathfinding/dijkstraexperimental';

const GRID_NODES = [];
let ALGORITHM = "nothing";
let mouseIsPressed = false;
let isRunning = false;

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})

export class GridComponent implements OnInit {
  
  constructor() {}

  nodes = GRID_NODES;
  algorithm = ALGORITHM;

  ngOnInit(): void {
    //generates the nodes for the grid
    this.generateGrid();
  }

  generateGrid(){
    let index: number = 0;
    for(var row: number = 0; row <= 26; row++){
      console.log(row);
      for(var column: number = 0; column < 58; column++){
        if(row == 13 && column == 10){
          GRID_NODES.push(new Node(index, true, false, false, false, row, column));
          console.log('Start Index: ' + index);
        }
        else if(row == 13 && column == 48){
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

  checkAlgorithm(){
    if(isRunning) return;
    if(this.algorithm == 'nothing'){
      document.getElementById('btn-visualize').textContent = "Pick an algortihm!"
    }
    else{
      document.getElementById('btn-visualize').textContent = 'Visualizing...';
      document.getElementById('btn-visualize').style.backgroundColor = '#ff0000';
      if(this.checkVisited() || this.checkClosed()){
        this.clearVisitedNodes();
      }
      isRunning = true;
      this.visualizeAlgorithm();
    }
  }

  visualizeAlgorithm(){
    if(this.algorithm == 'Dijkstra'){
      const startNode = this.nodes[764];
      const endNode = this.nodes[802];
      const visitedNodes = executeDijkstra(this.nodes, startNode, endNode);
      const shortestPath = createShortestPath(endNode);
      this.animateAlgorithm(visitedNodes, shortestPath);
    }
    else if(this.algorithm == 'A*'){
      const startNode = this.nodes[764];
      const endNode = this.nodes[802];
      const visitedNodes = aStar(this.nodes, startNode, endNode, 'euklidean');
      const shortestPath = retraceShortestPath(endNode);
      this.animateAlgorithm(visitedNodes, shortestPath);
    }
    else if(this.algorithm == 'Experimental'){
      const startNode = this.nodes[764];
      const endNode = this.nodes[802];
      const visitedNodes = executeExperimental(this.nodes, startNode, endNode);
      const shortestPath = createShortestPath(endNode);
      this.animateAlgorithm(visitedNodes, shortestPath);
    }
  }

  animateAlgorithm(visitedNodes: Node[], shortestPath?: Node[]){
    for(let i = 0; i <= visitedNodes.length; i++){
      if(i == visitedNodes.length){
        setTimeout(() => {
          console.log('[GRID] Shortest Path: ' + shortestPath.length);
          console.log('[GRID]: ' + shortestPath[0].row + ' ' + shortestPath[0].column);
          this.animateShortestPath(shortestPath);
        }, i * 20);
        return;
      }
      setTimeout(() => {
        if(visitedNodes[i].isStart || visitedNodes[i].isEnd){}
        else{
          visitedNodes[i].isActuallyVisited = true;
        }
      }, i * 20);
    }
  }

  animateShortestPath(shortestPath: Node[]){
    for(let i = 0; i <= shortestPath.length; i++){
      setTimeout(() => {
        if(i == shortestPath.length){
          this.algorithm = 'nothing';
          isRunning = false;
          document.getElementById('btn-visualize').style.backgroundColor = '#0398f4';
          setTimeout(() => {
            document.getElementById('btn-visualize').textContent = 'Visualize!'
          }, 1500);
          document.getElementById('btn-visualize').textContent = 'Done!'
          return;
        }
        console.log('[ANIMATE_SHORTEST_PATH]: ' + shortestPath[i].row + ' ' + shortestPath[i].column);
        shortestPath[i].isActuallyVisited = false;
        if(shortestPath[i].isEnd){}
        else {shortestPath[i].isShortestPath = true;}
      }, i * 40);
    }
  }

  toggleWall(index: number){
    if((this.nodes[index].isStart || this.nodes[index].isEnd)){
      console.log('Cannot toggle wall!');
      return;
    }
    else if(isRunning){}
    else{
        this.nodes[index].isWall = !this.nodes[index].isWall;
    }
    console.log('ROW: ' + this.nodes[index].row + ' COLUMN: ' + this.nodes[index].column + ' INDEX: '+ index);
  }

  toggleStart(index: number){
    for(let i = 0; i < this.nodes.length; i++){
      if(this.nodes[i].isStart){
        this.nodes[i].isStart = false;
      }
    }
    this.nodes[index].isStart = true;
  }

  toggleEnd(index: number){
    for(let i = 0; i < this.nodes.length; i++){
      if(this.nodes[i].isEnd){
        this.nodes[i].isEnd = false;
      }
    }
    this.nodes[index].isEnd = true;
  }

  mouseDown(index: number){
    mouseIsPressed = true;
    console.log('Mouse down');
  }

  mouseOver(index: number){
    if(mouseIsPressed){
      this.toggleWall(index);
    }
  }

  mouseUp(index: number){
    mouseIsPressed = false;
    console.log('Mouse up');
  }

  clearWalls(){
    if(isRunning)
      return;
    for(let i = 0; i < this.nodes.length; i++){
      if(this.nodes[i].isWall)
        this.nodes[i].isWall = false;
    }
  }

  clearBoard(){
    if(isRunning)
      return;
    for(let i = 0; i < this.nodes.length; i++){
      this.nodes[i].isWall = false;
      this.nodes[i].isVisited = false;
      this.nodes[i].isActuallyVisited = false;
      this.nodes[i].isShortestPath = false;
    }
  }

  clearVisitedNodes(){
    if(isRunning)
      return;
    for(let i = 0; i < this.nodes.length; i++){
      if(this.nodes[i].isActuallyVisited || this.nodes[i].isVisited || this.nodes[i].closed){
        this.nodes[i].isVisited = false;
        this.nodes[i].isActuallyVisited = false;
        this.nodes[i].isShortestPath = false;
        this.nodes[i].closed = false;
      }
    }
  }

  setPathfindingAlgorithm(algorithm: string): void{
    this.algorithm = algorithm;
    document.getElementById('btn-visualize').textContent = `Visualize ${this.algorithm}!`;
    console.log(this.algorithm);
  }

  checkVisited(){
    for(let i = 0; i < this.nodes.length; i++){
      if(this.nodes[i].isActuallyVisited)
        return true;
    }
    return false;
  }

  checkClosed(){
    for(let i = 0; i < this.nodes.length; i++){
      if(this.nodes[i].closed){
        return true;
      }
    }
    return false;
  }
}
