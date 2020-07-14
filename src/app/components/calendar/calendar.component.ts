import { Component, OnInit, ElementRef, HostListener } from '@angular/core';

export interface CalendarDate {
  date: number;
  selected?: boolean;
  disabled: boolean;
}

@Component({
  selector: 'sunlife-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  private nameOfDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  private _currentDate: Date;
  private weeks: Array<CalendarDate[]> = [];
  private title = "";  

  public show = true;

  constructor(private readonly elemRef: ElementRef) { }

  ngOnInit() {
    this._currentDate = new Date();
    this.createCalendar();
  }

  // hides the calendar when the user taps outside the component.
  @HostListener('document:click', ['$event'])
  clickOutside(event:Event) {
    if (!this.elemRef.nativeElement.contains(event.target)) {
      this.show = false
    }
  }

  cancel() {
    this.show = false;
  }

  private createCalendar() {
    // set calendar title
    const month = this._currentDate.toLocaleDateString('default', { month: 'long' });
    this.title = `${month} ${this._currentDate.getFullYear()}`

    // setup calendar date numbers
    let date = new Date(this._currentDate.getFullYear(), this._currentDate.getMonth(), 1);
    for (let i = 7; date.getMonth() == this._currentDate.getMonth(); i += 7) {
      this.weeks.push(this.getWeek(date));
      date = new Date(this._currentDate.getFullYear(), this._currentDate.getMonth(), 1 + i);
    } 
  }

  // returns the date numbers for the given week;
  private getWeek(date: Date): CalendarDate[] {
    const day = date.getDay();
    const first = new Date(date.getTime() - 60*60*24* day*1000);
    const last = new Date(first.getTime() + 60 * 60 *24 * 6 * 1000);

    const dayNum: CalendarDate[] = [];
    while (first <= last) {
      const num = first.getDate();
      const calendarDate: CalendarDate = {
        date: num,
        disabled: first.getMonth() != date.getMonth(),
        selected: num == this._currentDate.getDate()
      }
      dayNum.push(calendarDate);
      first.setDate(num + 1);
    }
    return dayNum;
  }
}
