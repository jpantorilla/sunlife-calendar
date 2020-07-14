import { Component, OnInit, ElementRef, HostListener } from '@angular/core';

export interface CalendarDate {
  date: Date;
  num: number;
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
  private currentDate: Date;
  private selectedDate: CalendarDate;
  private weeks: Array<CalendarDate[]> = [];
  private title = "";  

  public show = true;

  constructor(private readonly elemRef: ElementRef) { }

  ngOnInit() {
    this.currentDate = new Date();
    this.createCalendar();
  }

  // hides the calendar when the user taps outside the component.
  @HostListener('document:click', ['$event'])
  clickOutside(event:Event) {
    if (!this.elemRef.nativeElement.contains(event.target)) {
      this.hideCalendar();
    }
  }

  cancel() {
    this.hideCalendar()
  }

  ok() {
    this.hideCalendar();
  }

  selectDate(row: number, col: number) {
    this.selectedDate.selected = false;
    const newDate = this.weeks[row][col];
    newDate.selected = true;
    this.selectedDate = newDate;
  }

  prevMonth() {
    this.moveDate(-1);
  }

  nextMonth() {
    this.moveDate(1);
  }

  /*
  */
  private hideCalendar() {
    this.show = false;
  }

  private moveDate(diff: number) {
    this.currentDate.setMonth(this.currentDate.getMonth() + diff);
    this.createCalendar();
  }

  private createCalendar() {
    // clear the weeks array.
    this.weeks = [];

    // set calendar title
    const month = this.currentDate.toLocaleDateString('default', { month: 'long' });
    this.title = `${month} ${this.currentDate.getFullYear()}`

    // setup calendar date numbers
    let date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    for (let i = 7; date.getMonth() == this.currentDate.getMonth(); i += 7) {
      const week = this.getWeek(date);
      const selectedDate = week.find(calDate => calDate.date.getTime() == this.selectedDate?.date.getTime());
      if (selectedDate) {
        selectedDate.selected = true;
      }
      this.weeks.push(week);
      date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1 + i);
    }
  }

  // returns the date numbers for the given week;
  private getWeek(date: Date): CalendarDate[] {
    const actualDate = new Date();
    const day = date.getDay();
    const first = new Date(date.getTime() - 60*60*24* day*1000);
    const last = new Date(first.getTime() + 60 * 60 *24 * 6 * 1000);

    const dayNum: CalendarDate[] = [];
    while (first <= last) {
      const num = first.getDate();
      const clonedDate = new Date(first.getTime());
      const calendarDate: CalendarDate = {
        num,
        date: clonedDate,
        disabled: first.getMonth() != date.getMonth()
      }
      if (
        num == this.currentDate.getDate()
        && clonedDate.getMonth() == actualDate.getMonth()
        && !this.selectedDate
      ) {
        calendarDate.selected = true;
        this.selectedDate = calendarDate;
      }

      dayNum.push(calendarDate);
      first.setDate(num + 1);
    }
    return dayNum;
  }
}
