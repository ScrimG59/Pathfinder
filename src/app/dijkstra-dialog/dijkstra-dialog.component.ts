import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dijkstra-dialog',
  templateUrl: './dijkstra-dialog.component.html',
  styleUrls: ['./dijkstra-dialog.component.css']
})
export class DijkstraDialogComponent implements OnInit {

  form: FormGroup;

  constructor(private formBuilder: FormBuilder, private dialogRef: MatDialogRef<DijkstraDialogComponent>) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      examplename: ''
    })
  }

  submit(form){
    this.dialogRef.close(`${form.value.examplename}`);
  }

}
