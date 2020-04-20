import { Component, OnInit } from '@angular/core';
import {Node} from '../../models/node';
import {executeDijkstra, createShortestPath} from '../algorithms/pathfinding/dijkstra';
import { aStar, retraceShortestPath } from '../algorithms/pathfinding/astar';
import { executeExperimental } from '../algorithms/pathfinding/dijkstraexperimental';
import { ThrowStmt } from '@angular/compiler';

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
    //this.generateGrid();
    this.generateTwoDimensionalGrid();
  }

  generateTwoDimensionalGrid(){
    let index: number = 0;
    for(let row: number = 0; row <= 26; row++){
      const currentRow = [];
      for(let column: number = 0; column < 69; column++){
        if(row == 13 && column == 10){
          currentRow.push(new Node(index, true, false, false, false, row, column));
        }
        else if(row == 13 && column == 48){
          currentRow.push(new Node(index, false, true, false, false, row, column));
        }
        else{
          currentRow.push(new Node(index, false, false,  false, false, row, column));
        }
        index++;
      }
      GRID_NODES.push(currentRow);
    }
  }

  generateGrid(){
    let index: number = 0;
    for(var row: number = 0; row <= 26; row++){
      console.log(row);
      for(var column: number = 0; column < 69; column++){
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
      const startNode = this.nodes[13][10];
      const endNode = this.nodes[13][48];
      const visitedNodes = executeDijkstra(this.nodes, startNode, endNode);
      const shortestPath = createShortestPath(endNode);
      this.animateAlgorithm(visitedNodes, shortestPath);
    }
    else if(this.algorithm == 'A*'){
      const startNode = this.nodes[13][10];
      const endNode = this.nodes[13][48];
      const visitedNodes = aStar(this.nodes, startNode, endNode, 'euklidean');
      const shortestPath = retraceShortestPath(endNode);
      this.animateAlgorithm(visitedNodes, shortestPath);
    }
    else if(this.algorithm == 'Alt-Dijkstra'){
      const startNode = this.nodes[13][10];
      const endNode = this.nodes[13][48];
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

  toggleWall(row: number, column: number){
    if((this.nodes[row][column].isStart || this.nodes[row][column].isEnd)){
      console.log('Cannot toggle wall!');
      return;
    }
    else if(isRunning){}
    else{
        this.nodes[row][column].isWall = !this.nodes[row][column].isWall;
    }
    console.log('ROW: ' + this.nodes[row][column].row + ' COLUMN: ' + this.nodes[row][column].column);
  }

  setStart(row: number, column: number){
    this.nodes[row][column].isStart = true;
  }

  deleteStart(row: number, column: number){
    this.nodes[row][column].isStart = false;
  }

  setEnd(row: number, column: number){
    this.nodes[row][column].isEnd = true;
  }

  deleteEnd(row: number, column: number){
    this.nodes[row][column].isEnd = false;
  }

  mouseDown(row?: number, col?: number){
    mouseIsPressed = true;
    this.toggleWall(row, col);
    console.log('Mouse down');
  }

  mouseEnter(row: number, column: number){
    if(mouseIsPressed){
      this.toggleWall(row, column);
    }
  }

  mouseLeave(row: number, column: number){
    if(mouseIsPressed){
      
    }
  }

  mouseUp(row?: number, column?: number){
    mouseIsPressed = false;
    console.log('Mouse up');
  }

  clearWalls(){
    if(isRunning)
      return;
    for(let i = 0; i < this.nodes.length; i++){
      for(let j = 0; j < this.nodes[i].length; j++){
        if(this.nodes[i][j].isWall)
        this.nodes[i][j].isWall = false;
      }
    }
  }

  clearBoard(){
    if(isRunning)
      return;
    for(let i = 0; i < this.nodes.length; i++){
      for(let j = 0; j < this.nodes[i].length; j++){
        this.nodes[i][j].isWall = false;
        this.nodes[i][j].isVisited = false;
        this.nodes[i][j].isActuallyVisited = false;
        this.nodes[i][j].isShortestPath = false;
      }
    }
  }

  clearVisitedNodes(){
    if(isRunning)
      return;
    for(let i = 0; i < this.nodes.length; i++){
      for(let j = 0; j < this.nodes[i].length; j++){
        if(this.nodes[i][j].isActuallyVisited || this.nodes[i][j].isVisited || this.nodes[i][j].closed){
          this.nodes[i][j].isVisited = false;
          this.nodes[i][j].isActuallyVisited = false;
          this.nodes[i][j].isShortestPath = false;
          this.nodes[i][j].closed = false;
        }
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
      for(let j = 0; j < this.nodes[i].length; j++){
        if(this.nodes[i][j].isActuallyVisited)
        return true;
      }
    }
    return false;
  }

  checkClosed(){
    for(let i = 0; i < this.nodes.length; i++){
      for(let j = 0; j < this.nodes[i].length; j++){
        if(this.nodes[i][j].closed)
          return true;
      }
    }
    return false;
  }
}
