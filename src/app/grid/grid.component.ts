import { Component, OnInit } from '@angular/core';

import { Node } from '../models/node';
import {executeDijkstra, createShortestPath} from '../algorithms/pathfinding/dijkstra';
import { aStar, retraceShortestPath } from '../algorithms/pathfinding/astar';
import { generateRandomMaze} from '../algorithms/maze/randomMaze';
import { generateStairMaze} from '../algorithms/maze/stair';


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
let lastPosition = new Map();

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
    this.setCoordinates();
    // setting the default checkboxes
    this.setHeuristicCheckboxes();
    this.initShowProcessCheckbox();
  }

  // sets the coordinates of start and end node
  setCoordinates(): void {
    startCoordiantes.set('Row', 13);
    startCoordiantes.set('Col', 10);
    endCoordinates.set('Row', 13);
    endCoordinates.set('Col', 58);
  }

  // generates a two-dimensional grid
  generateTwoDimensionalGrid(): void {
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

  // method that checks if there's a algorithm selected and if there's is one, it calls the visualizeAlgorithm-method
  checkAlgorithm(): void {
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

  // method that prepares everything for the animation-algorithm
  visualizeAlgorithm(): void {
    if(this.algorithm == 'Dijkstra') {
      const startRow = startCoordiantes.get('Row');
      const startCol = startCoordiantes.get('Col');
      const startNode = this.nodes[startRow][startCol];
      const endRow = endCoordinates.get('Row');
      const endCol = endCoordinates.get('Col');
      const endNode = this.nodes[endRow][endCol];
      const visitedNodes = executeDijkstra(this.nodes);
      if(!this.checkIfFound(visitedNodes)) {
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
    else if(this.algorithm == 'A*') {
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
      else {
        const shortestPath = retraceShortestPath(endNode);
        this.animateAlgorithm(visitedNodes, shortestPath, showProcess);
        this.setStatistics(visitedNodes, shortestPath, showProcess);
      }
    }
  }

  // animates the selected algorithm
  animateAlgorithm(visitedNodes: Node[], shortestPath: Node[], showProcess: boolean) {
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

  // animates the shortest path
  animateShortestPath(shortestPath: Node[]) {
    for(let i = 0; i <= shortestPath.length; i++){
      setTimeout(() => {
        if(i == shortestPath.length){
          isRunning = false;
          document.getElementById('btn-visualize').style.backgroundColor = '#0398f4';
          setTimeout(() => {
            document.getElementById('btn-visualize').textContent = `Visualize ${this.algorithm}!`
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

  // method that checks some constraints and calls the animation-method
  visualizeMazeAlgorithm(algo: string) {
    if(isRunning) return;
    if(algo == 'Random'){
      console.log("Generating random maze...");
      this.clearBoard();
      isRunning = true;
      const walls = generateRandomMaze(this.nodes);
      this.animateMazeAlgorithm(walls);
    }
    else if(algo == 'Stair'){
      console.log("Generating stair maze...");
      this.clearBoard();
      isRunning = true;
      const walls = generateStairMaze(this.nodes);
      this.animateMazeAlgorithm(walls);
    }
  }

  // method that animates the maze algorithms
  animateMazeAlgorithm(walls: Node[]) {
    console.log("Animating maze...");
    for(let i = 0; i <= walls.length; i++){
      setTimeout(() => {
      if(i == walls.length){
        isRunning = false;
        return;
      }
        walls[i].isWall = true;
      }, i * 15);
    }
  }

  // helper method to set or delete a wall node
  toggleWall(row: number, column: number) {
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

  // sets the start node
  setStart(row: number, column: number) {
    if(isRunning){return;}
    this.nodes[row][column].isStart = true;
    startCoordiantes.set('Row', row);
    startCoordiantes.set('Col', column);
  }

  // deletes the start node
  deleteStart(row: number, column: number) {
    if(isRunning){return;}
    this.nodes[row][column].isStart = false;
  }

  // sets the end node
  setEnd(row: number, column: number) {
    if(isRunning){return;}
    this.nodes[row][column].isEnd = true;
    endCoordinates.set('Row', row);
    endCoordinates.set('Col', column);
  }

  // deletes the end node
  deleteEnd(row: number, column: number) {
    if(isRunning){return;}
    this.nodes[row][column].isEnd = false;
  }

  /*
  ######## These are all the mouse events that handle things like dragging and moving nodes #########
  */
  mouseDown(row: number, col: number) {
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

  mouseEnter(row: number, column: number) {
    if(mouseIsPressed && !startIsMoving && !endIsMoving){
      this.toggleWall(row, column);
    }
    else if(mouseIsPressed && startIsMoving){
      if(this.nodes[row][column].isWall){
        this.toggleWall(row, column);
        isWall = true;
      }
      if(this.nodes[row][column].isEnd){
        this.setStart(lastPosition.get('Row'), lastPosition.get('Col'));
      }
      else{

        this.setStart(row, column);
      }
    }
    else if(mouseIsPressed && endIsMoving){
      if(this.nodes[row][column].isWall){
        this.toggleWall(row, column);
        isWall = true;
      }
      if(this.nodes[row][column].isStart){
        this.setEnd(lastPosition.get('Row'), lastPosition.get('Col'));
      }
      else{
        this.setEnd(row, column);
      }
    }
    else{}
  }

  mouseLeave(row: number, column: number) {
    if(mouseIsPressed && startIsMoving && this.nodes[row][column].isEnd){
      this.deleteStart(lastPosition.get('Row'), lastPosition.get('Col'));
    }
    else if(mouseIsPressed && startIsMoving){
      lastPosition.set('Row', row);
      lastPosition.set('Col', column);
      this.deleteStart(row, column);
    }
    else if(mouseIsPressed && endIsMoving && this.nodes[row][column].isStart){
      this.deleteEnd(lastPosition.get('Row'), lastPosition.get('Col'));
    }
    else if(mouseIsPressed && endIsMoving){
      lastPosition.set('Row', row);
      lastPosition.set('Col', column);
      this.deleteEnd(row, column);
    }
    else {}
    if(isWall){
      this.toggleWall(row, column);
      isWall = false;
    }
  }

  mouseUp(row?: number, column?: number) {
    mouseIsPressed = false;
    startIsMoving = false;
    endIsMoving = false;
    console.log('Mouse up');
  }

  /*
  #########################################################
  */

  // deletes all wall nodes of the grid
  clearWalls(): void {
    if(isRunning)
      return;
    for(let i = 0; i < this.nodes.length; i++){
      for(let j = 0; j < this.nodes[i].length; j++){
        if(this.nodes[i][j].isWall)
        this.nodes[i][j].isWall = false;
      }
    }
  }

  // deletes everything of the grid except the start and end node
  clearBoard(): void {
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

  // resets the statistics of the options
  resetStatistics(): void {
    document.getElementById('visitedNodes').style.color = 'white';
    document.getElementById('shortestPath').style.color = 'white';
    document.getElementById('visitedNodes').textContent = '0';
    document.getElementById('shortestPath').textContent = '0';
  }

  // deletes every visited node from any previous algorithm
  clearVisitedNodes(): void {
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

  // helper method to set an selected algorithm
  setPathfindingAlgorithm(algorithm: string): void {
    //this.openDijkstraDialog();
    this.algorithm = algorithm;
    document.getElementById('btn-visualize').textContent = `Visualize ${this.algorithm}!`;
    console.log(this.algorithm);
  }

  // helper method that sets the speed of animation
  setSpeed(speed: string): void {
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

  // helper method that sets the initial state of the show-process checkbox
  initShowProcessCheckbox(): void {
    const showProcessCheckbox = document.getElementById('showProcess') as HTMLInputElement;
    showProcess = true;
    showProcessCheckbox.checked = true;

  }

  // helper method that handles the show-process checkbox
  setShowProcessCheckbox(): void {
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

  // sets the statistics in real time
  setStatistics(visitedNodes: Node[], shortestPath: Node[], showProcess: boolean): void {
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

  // sets the heuristic checkboxes according to some constraints
  setHeuristicCheckboxes(): void {
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

  // helper method that sets the selected heuristic internally and also calls the setHeuristicCheckboxed()-method
  setHeuristicDistance(heuristic: string): void {
    distance = heuristic;
    this.setHeuristicCheckboxes();
  }

  // helper method that checks if there are visited nodes in the grid
  checkVisited(): boolean {
    for(let i = 0; i < this.nodes.length; i++){
      for(let j = 0; j < this.nodes[i].length; j++){
        if(this.nodes[i][j].isActuallyVisited && this.nodes[i][j].isShortestPath)
        return true;
      }
    }
    return false;
  }

  // same helper method as above but for the A*-algorithm
  checkClosed(): boolean {
    for(let i = 0; i < this.nodes.length; i++){
      for(let j = 0; j < this.nodes[i].length; j++){
        if(this.nodes[i][j].closed)
          return true;
      }
    }
    return false;
  }

  // checks if the given algorithm found the final node
  checkIfFound(visitedNodes: Node[]): boolean {
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

  // toggles the side menu at right-hand side of the screen when the viewports width is getting smaller and a burger menu appears
  toggleSlideMenu():void {
    const slideMenu = document.querySelector('.slideMenu');
    const burger = document.querySelector('.burger')

    slideMenu.classList.toggle('slideMenu-active');
    burger.classList.toggle('toggle');
    console.log(slideMenu.classList);
  }
}
