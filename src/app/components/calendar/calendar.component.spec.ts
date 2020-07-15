import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CalendarComponent, DateFormat, NavDirection } from './calendar.component';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format date properly #formatDate', () => {
    const { formatDate } = component;
    const date = new Date(2020, 6, 16);

    // default and short
    expect(formatDate(date)).toBe('16/07/2020');
    expect(formatDate(date, DateFormat.short)).toBe('16/07/2020'); 
    // medium
    expect(formatDate(date, DateFormat.medium)).toBe('Jul 16, 2020');
    // long
    expect(formatDate(date, DateFormat.long)).toBe('July 16, 2020');
    // full
    expect(formatDate(date, DateFormat.full)).toBe('Thursday, July 16, 2020');
  });

  it('should move the date a month forward or backward properly #moveDate', () => {
    let { moveDate } = component;
    component.currentDate = new Date(2020, 6, 16);
  
    // move 1 month forward
    moveDate(NavDirection.next);
    expect(component.currentDate.getTime()).toEqual(new Date(2020, 7, 16).getTime());
    // move 1 month backward
    moveDate(NavDirection.previous);
    expect(component.currentDate.getTime()).toEqual(new Date(2020, 5, 16).getTime());
  });
});
