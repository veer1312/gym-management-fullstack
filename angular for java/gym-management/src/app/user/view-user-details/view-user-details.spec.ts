import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUserDetails } from './view-user-details';

describe('ViewUserDetails', () => {
  let component: ViewUserDetails;
  let fixture: ComponentFixture<ViewUserDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewUserDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewUserDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
