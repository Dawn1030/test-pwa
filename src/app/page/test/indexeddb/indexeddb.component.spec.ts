import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexeddbComponent } from './indexeddb.component';

describe('IndexeddbComponent', () => {
  let component: IndexeddbComponent;
  let fixture: ComponentFixture<IndexeddbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexeddbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexeddbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
