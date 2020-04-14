import { Component, OnInit } from '@angular/core';
import {Node} from '../../models/node';

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
    for(var i: number = 0; i < 2262; i++){
      if(i == 970){
        GRID_NODES.push(new Node(i, true, false, false, false));
      }
      else if(i == 1030){
        GRID_NODES.push(new Node(i, false, true, false, false));
      }
      else{
        GRID_NODES.push(new Node(i, false, false,  false, false))
      }
    }
  }

  toggleWall(index: number){
    if(GRID_NODES[index].isStart || GRID_NODES[index].isEnd){}
    else{
      GRID_NODES[index].isWall = !GRID_NODES[index].isWall;
    }
  }
}
