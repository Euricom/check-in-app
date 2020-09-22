import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CheckedInPage } from './checked-in.page';

describe('CheckedInPage', () => {
  let component: CheckedInPage;
  let fixture: ComponentFixture<CheckedInPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckedInPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckedInPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
