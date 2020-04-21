import { Component, OnInit } from '@angular/core';
import {Node} from '../../models/node';
import {executeDijkstra, createShortestPath} from '../algorithms/pathfinding/dijkstra';
import { aStar, retraceShortestPath } from '../algorithms/pathfinding/astar';
import { executeExperimental } from '../algorithms/pathfinding/dijkstraexperimental';

const GRID_NODES = [];
let ALGORITHM = "nothing";
let animationSpeed = 20;
let mouseIsPressed = false;
let startIsMoving = false;
let endIsMoving = false;
let isRunning = false;
let startCoordiantes = new Map();
let endCoordinates = new Map();

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
    this.generateTwoDimensionalGrid();
    // setting the default start node and end node
    startCoordiantes.set('Row', 13);
    startCoordiantes.set('Col', 10);
    endCoordinates.set('Row', 13);
    endCoordinates.set('Col', 58);
  }

  generateTwoDimensionalGrid(){
    let index: number = 0;
    for(let row: number = 0; row <= 26; row++){
      const currentRow = [];
      for(let column: number = 0; column < 69; column++){
        if(row == 13 && column == 10){
          currentRow.push(new Node(index, true, false, false, false, row, column));
        }
        else if(row == 13 && column == 58){
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
      const startRow = startCoordiantes.get('Row');
      const startCol = startCoordiantes.get('Col');
      const startNode = this.nodes[startRow][startCol];
      const endRow = endCoordinates.get('Row');
      const endCol = endCoordinates.get('Col');
      const endNode = this.nodes[endRow][endCol];
      const visitedNodes = executeDijkstra(this.nodes, startNode, endNode);
      if(!this.checkIfFound(visitedNodes)){
        setTimeout(() => {
          document.getElementById('btn-visualize').textContent = 'Visualize!';
          document.getElementById('btn-visualize').style.backgroundColor = '#0398f4';
        }, 1500);
        document.getElementById('btn-visualize').textContent = 'No path found!';
        this.algorithm = 'nothing';
        isRunning = false;
        return;
      }
      else{
        const shortestPath = createShortestPath(endNode);
        this.animateAlgorithm(visitedNodes, shortestPath);
      }
    }
    else if(this.algorithm == 'A*'){
      const startRow = startCoordiantes.get('Row');
      const startCol = startCoordiantes.get('Col');
      const startNode = this.nodes[startRow][startCol];
      const endRow = endCoordinates.get('Row');
      const endCol = endCoordinates.get('Col');
      const endNode = this.nodes[endRow][endCol];
      const visitedNodes = aStar(this.nodes, startNode, endNode, 'euklidean');
      console.log('VISITED NODES:' + visitedNodes.length);
      if(!this.checkIfFound(visitedNodes)){
        setTimeout(() => {
          document.getElementById('btn-visualize').textContent = 'Visualize!';
          document.getElementById('btn-visualize').style.backgroundColor = '#0398f4';
        }, 1500);
        document.getElementById('btn-visualize').textContent = 'No path found!';
        this.algorithm = 'nothing';
        isRunning = false;
        return;
      }
      else{
        const shortestPath = retraceShortestPath(endNode);
        this.animateAlgorithm(visitedNodes, shortestPath);
      }
    }
    else if(this.algorithm == 'Alt-Dijkstra'){
      const startRow = startCoordiantes.get('Row');
      const startCol = startCoordiantes.get('Col');
      const startNode = this.nodes[startRow][startCol];
      const endRow = endCoordinates.get('Row');
      const endCol = endCoordinates.get('Col');
      const endNode = this.nodes[endRow][endCol];
      const visitedNodes = executeExperimental(this.nodes, startNode, endNode);
      if(!this.checkIfFound(visitedNodes)){
        setTimeout(() => {
          document.getElementById('btn-visualize').textContent = 'Visualize!';
          document.getElementById('btn-visualize').style.backgroundColor = '#0398f4';
        }, 1500);
        document.getElementById('btn-visualize').textContent = 'No path found!';
        this.algorithm = 'nothing';
        isRunning = false;
        return;
      }
      else {
        const shortestPath = createShortestPath(endNode);
        this.animateAlgorithm(visitedNodes, shortestPath);
      }
    }
  }

  animateAlgorithm(visitedNodes: Node[], shortestPath?: Node[]){
    for(let i = 0; i <= visitedNodes.length; i++){
      if(i == visitedNodes.length){
        setTimeout(() => {
          console.log('[GRID] Shortest Path: ' + shortestPath.length);
          console.log('[GRID]: ' + shortestPath[0].row + ' ' + shortestPath[0].column);
          this.animateShortestPath(shortestPath);
        }, i * animationSpeed);
        return;
      }
      setTimeout(() => {
        if(visitedNodes[i].isStart || visitedNodes[i].isEnd){}
        else{
          visitedNodes[i].isActuallyVisited = true;
        }
      }, i * animationSpeed);
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
      }, i * animationSpeed);
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
    if(isRunning){return;}
    this.nodes[row][column].isStart = true;
    startCoordiantes.set('Row', row);
    startCoordiantes.set('Col', column);
  }

  deleteStart(row: number, column: number){
    if(isRunning){return;}
    this.nodes[row][column].isStart = false;
  }

  setEnd(row: number, column: number){
    if(isRunning){return;}
    this.nodes[row][column].isEnd = true;
    endCoordinates.set('Row', row);
    endCoordinates.set('Col', column);
  }

  deleteEnd(row: number, column: number){
    if(isRunning){return;}
    this.nodes[row][column].isEnd = false;
  }

  mouseDown(row: number, col: number){
    mouseIsPressed = true;
    if(this.nodes[row][col].isStart){
      startIsMoving = true;
    }
    else if(this.nodes[row][col].isEnd){
      endIsMoving = true;
    }
    else {
      this.toggleWall(row, col);
    } 
    console.log('Mouse down');
  }

  mouseEnter(row: number, column: number){
    if(mouseIsPressed && !startIsMoving && !endIsMoving){
      this.toggleWall(row, column);
    }
    else if(mouseIsPressed && startIsMoving){
      if(this.nodes[row][column].isWall){
        this.toggleWall(row, column);
      }
      this.setStart(row, column);
    }
    else if(mouseIsPressed && endIsMoving){
      if(this.nodes[row][column].isWall){
        this.toggleWall(row, column);
      }
      this.setEnd(row, column);
    }
    else{}
  }

  mouseLeave(row: number, column: number){
    if(mouseIsPressed && startIsMoving){
      this.deleteStart(row, column);   
    }
    else if(mouseIsPressed && endIsMoving){
      this.deleteEnd(row, column);
    }
    else {}
  }

  mouseUp(row?: number, column?: number){
    mouseIsPressed = false;
    startIsMoving = false;
    endIsMoving = false;
    console.log('Mouse up');
  }

  clearWalls(): void{
    if(isRunning)
      return;
    for(let i = 0; i < this.nodes.length; i++){
      for(let j = 0; j < this.nodes[i].length; j++){
        if(this.nodes[i][j].isWall)
        this.nodes[i][j].isWall = false;
      }
    }
  }

  clearBoard(): void{
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

  clearVisitedNodes(): void{
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

  setSpeed(speed: string): void{
    switch(speed){
      case "Very Fast":
        animationSpeed = 5;
        break;
      case "Fast":
        animationSpeed = 10;
      case "Normal":
        animationSpeed = 20;
        break;
      case "Slow":
        animationSpeed = 40;
        break;
      case "Very Slow":
        animationSpeed = 60;
    }
  }

  checkVisited(): boolean{
    for(let i = 0; i < this.nodes.length; i++){
      for(let j = 0; j < this.nodes[i].length; j++){
        if(this.nodes[i][j].isActuallyVisited)
        return true;
      }
    }
    return false;
  }

  checkClosed(): boolean{
    for(let i = 0; i < this.nodes.length; i++){
      for(let j = 0; j < this.nodes[i].length; j++){
        if(this.nodes[i][j].closed)
          return true;
      }
    }
    return false;
  }

  checkIfFound(visitedNodes: Node[]): boolean{
    if(visitedNodes.length == 0){
      return false;
    }
    else if(visitedNodes[visitedNodes.length-1].isEnd){
      return true;
    }
    else{
      return false;
    }
  }
}
