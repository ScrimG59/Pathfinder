import { Component, OnInit } from '@angular/core';

import {Node} from '../../models/node';
import {executeDijkstra, createShortestPath} from '../algorithms/pathfinding/dijkstra';
import { aStar, retraceShortestPath } from '../algorithms/pathfinding/astar';
import { executeExperimental } from '../algorithms/pathfinding/dijkstraexperimental';
import { generateRandomMaze } from '../algorithms/maze/randomMaze';


const GRID_NODES = [];
let ALGORITHM = "nothing";
let distance = 'euclidean';
let showProcess = true;
let animationSpeed = 20;
let mouseIsPressed = false;
let startIsMoving = false;
let endIsMoving = false;
let isRunning = false;
let isWall = false;
let startCoordiantes = new Map();
let endCoordinates = new Map();

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})

export class GridComponent implements OnInit {

  exampleArray = [];
  
  constructor() {}

  nodes = GRID_NODES;
  algorithm = ALGORITHM;

  ngOnInit(): void {
    //generates the nodes for the grid
    this.generateTwoDimensionalGrid();
    // setting the default coordinates for start node and end node
    startCoordiantes.set('Row', 13);
    startCoordiantes.set('Col', 10);
    endCoordinates.set('Row', 13);
    endCoordinates.set('Col', 58);
    // setting the default checkboxes
    this.setHeuristicCheckboxes();
    this.initShowProcessCheckbox();
  }

  generateTwoDimensionalGrid(): void{
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

  checkAlgorithm(): void{
    if(isRunning) return;
    if(this.algorithm == 'nothing'){
      document.getElementById('btn-visualize').textContent = "Pick an algortihm!"
    }
    else{
      document.getElementById('btn-visualize').textContent = 'Visualizing...';
      document.getElementById('btn-visualize').style.backgroundColor = '#ff0000';
      this.clearVisitedNodes();
      isRunning = true;
      const slideMenu = document.querySelector('.slideMenu');
      if(slideMenu.classList.contains('slideMenu-active')){
        this.toggleSlideMenu();
      } 
      this.visualizeAlgorithm();
    }
  }

  visualizeAlgorithm(): void{
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
        this.animateAlgorithm(visitedNodes, shortestPath, showProcess);
        this.setStatistics(visitedNodes, shortestPath, showProcess);
      }
    }
    else if(this.algorithm == 'A*'){
      const startRow = startCoordiantes.get('Row');
      const startCol = startCoordiantes.get('Col');
      const startNode = this.nodes[startRow][startCol];
      const endRow = endCoordinates.get('Row');
      const endCol = endCoordinates.get('Col');
      const endNode = this.nodes[endRow][endCol];
      const visitedNodes = aStar(this.nodes, startNode, endNode, distance);
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
        this.animateAlgorithm(visitedNodes, shortestPath, showProcess);
        this.setStatistics(visitedNodes, shortestPath, showProcess);
      }
    }
    else if(this.algorithm == 'Alt-Dijkstra'){
      const startRow = startCoordiantes.get('Row');
      const startCol = startCoordiantes.get('Col');
      const startNode = this.nodes[startRow][startCol];
      const endRow = endCoordinates.get('Row');
      const endCol = endCoordinates.get('Col');
      const endNode = this.nodes[endRow][endCol];
      const visitedNodes = executeExperimental(this.nodes, startNode, endNode, distance);
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
        this.animateAlgorithm(visitedNodes, shortestPath, showProcess);
        this.setStatistics(visitedNodes, shortestPath, showProcess);
      }
    }
  }

  animateAlgorithm(visitedNodes: Node[], shortestPath: Node[], showProcess: boolean){
    if(showProcess){
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
    else{
      this.animateShortestPath(shortestPath);
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
      }, i * animationSpeed*2);
    }
  }

  visualizeMazeAlgorithm(){
    if(isRunning) return;
    console.log("Generating random maze...");
    this.clearBoard();
    isRunning = true;
    const walls = generateRandomMaze(this.nodes);
    this.animateMazeAlgorithm(walls);
  }

  animateMazeAlgorithm(walls: Node[]){
    console.log("Animating random maze...");
    for(let i = 0; i <= walls.length; i++){
      setTimeout(() => {
      if(i == walls.length){
        isRunning = false;
        document.getElementById('btn-visualize').style.backgroundColor = '#0398f4';
        setTimeout(() => {
          document.getElementById('btn-visualize').textContent = 'Visualize!'
        }, 1500);
        document.getElementById('btn-visualize').textContent = 'Done!'
        return;
      }
        walls[i].isWall = true;
      }, i * 10);
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
        isWall = true;
      }
      this.setStart(row, column);
    }
    else if(mouseIsPressed && endIsMoving){
      if(this.nodes[row][column].isWall){
        this.toggleWall(row, column);
        isWall = true;
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
    if(isWall){
      this.toggleWall(row, column);
      isWall = false;
    }
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
    this.resetStatistics();
    const currentStartRow = startCoordiantes.get('Row');
    const currentStartCol = startCoordiantes.get('Col');
    const currentEndRow = endCoordinates.get('Row');
    const currentEndCol = endCoordinates.get('Col');
    this.deleteStart(currentStartRow, currentStartCol);
    this.deleteEnd(currentEndRow, currentEndCol);
    this.setStart(13, 10);
    this.setEnd(13, 58);
  }

  resetStatistics(): void{
    document.getElementById('visitedNodes').style.color = 'white';
    document.getElementById('shortestPath').style.color = 'white';
    document.getElementById('visitedNodes').textContent = '0';
    document.getElementById('shortestPath').textContent = '0';
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
    this.resetStatistics();
  }

  setPathfindingAlgorithm(algorithm: string): void{
    //this.openDijkstraDialog();
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

  initShowProcessCheckbox(): void{
    const showProcessCheckbox = document.getElementById('showProcess') as HTMLInputElement;
    showProcess = true;
    showProcessCheckbox.checked = true;

  }

  setShowProcessCheckbox(): void{
    const showProcessCheckbox = document.getElementById('showProcess') as HTMLInputElement;

    if(showProcessCheckbox.checked){
      showProcess = true;
      console.log(showProcess);
    }
    else {
      showProcess = false;
      console.log(showProcess);
    }
  }

  setStatistics(visitedNodes: Node[], shortestPath: Node[], showProcess: boolean): void{
    if(showProcess){
      for(let i = 0; i <= visitedNodes.length; i++){
        if(i == visitedNodes.length){
          setTimeout(() => {
            for(let j = 0; j < shortestPath.length; j++){
              setTimeout(() => {
                document.getElementById('visitedNodes').style.color = '#0398f4';
                document.getElementById('shortestPath').style.color = 'yellow';
                document.getElementById('shortestPath').textContent = `${j}`;
              }, j * animationSpeed*2);
            }
          }, i * animationSpeed);
        }
        else{
          setTimeout(() => {
            document.getElementById('visitedNodes').style.color = '#ff0000';
            document.getElementById('visitedNodes').textContent = `${i}`;
          }, i * animationSpeed);
        }
      }
    }
    else{
      for(let i = 0; i < shortestPath.length; i++){
        setTimeout(() => {
          document.getElementById('shortestPath').style.color = 'yellow';
          document.getElementById('shortestPath').textContent = `${i}`;
        }, i * animationSpeed*2);
      }
    }
  }

  setHeuristicCheckboxes(): void{
    let euclideanCheckbox = document.getElementById('euclidean') as HTMLInputElement;
    let manhattanCheckbox = document.getElementById('manhattan') as HTMLInputElement;

    if(distance == 'euclidean'){
      euclideanCheckbox.checked = true;
      manhattanCheckbox.checked = false;
    }
    else{
      euclideanCheckbox.checked = false;
      manhattanCheckbox.checked = true;
    }
  }

  setHeuristicDistance(heuristic: string): void{
    distance = heuristic;
    this.setHeuristicCheckboxes();
  }

  checkVisited(): boolean{
    for(let i = 0; i < this.nodes.length; i++){
      for(let j = 0; j < this.nodes[i].length; j++){
        if(this.nodes[i][j].isActuallyVisited && this.nodes[i][j].isShortestPath)
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

  // checks if the given algorithm found the final node
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

  toggleSlideMenu():void{
    const slideMenu = document.querySelector('.slideMenu');
    const burger = document.querySelector('.burger')

    slideMenu.classList.toggle('slideMenu-active');
    burger.classList.toggle('toggle');
    console.log(slideMenu.classList);
  }
}
