import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSidebarComponent } from './new-sidebar.component';

describe('NewModalComponent', () => {
  let component: NewSidebarComponent;
  let fixture: ComponentFixture<NewSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
