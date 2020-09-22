import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SubscribedPage } from './subscribed.page';

describe('SubscribedPage', () => {
  let component: SubscribedPage;
  let fixture: ComponentFixture<SubscribedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscribedPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SubscribedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
