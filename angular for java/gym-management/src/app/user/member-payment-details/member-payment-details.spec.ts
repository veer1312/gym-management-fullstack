import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberPaymentDetails } from './member-payment-details';

describe('MemberPaymentDetails', () => {
  let component: MemberPaymentDetails;
  let fixture: ComponentFixture<MemberPaymentDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberPaymentDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberPaymentDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
