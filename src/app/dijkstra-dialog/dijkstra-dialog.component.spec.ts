import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DijkstraDialogComponent } from './dijkstra-dialog.component';

describe('DijkstraDialogComponent', () => {
  let component: DijkstraDialogComponent;
  let fixture: ComponentFixture<DijkstraDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DijkstraDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DijkstraDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
