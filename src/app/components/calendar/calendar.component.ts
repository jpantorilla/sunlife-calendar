import { Component, OnInit, ElementRef, HostListener, Output, EventEmitter, Input } from '@angular/core';

export interface CalendarDate {
  date: Date;
  num: number;
  selected?: boolean;
  disabled: boolean;
}

export enum DateFormat {
  short,  //  DD/MM/YYYY          | 16/07/2020     <- default
  medium, //  MMM D, YYYY         | Jul 16, 2020
  long,   //  MMMM D, YYYY        | July 16, 2020
  full    //  dddd, MMMM D, YYYY  | Thursday, July 16, 2020
}

export interface CalendarOptions {
  minDate?: Date;
  maxDate?: Date;
  format?: DateFormat
}

enum NavDirection {
  previous = -1,
  next = 1
}

@Component({
  selector: 'sunlife-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  private nameOfDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  private currentDate: Date;
  private _selectedDate: CalendarDate;
  private weeks: Array<CalendarDate[]> = [];
  private title = "";
  private showNav = { prev: true, next: true  };

  public show = true;
  @Output() selectedDate = new EventEmitter<string>();
  @Input() options?: CalendarOptions;

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
    this.selectedDate.emit(this.formatDate(this._selectedDate.date));
    this.hideCalendar();
  }

  selectDate(row: number, col: number) {
    const newDate = this.weeks[row][col];
    if (newDate.disabled) return;

    this._selectedDate.selected = false;
    newDate.selected = true;
    this._selectedDate = newDate;
  }

  prevMonth() {
    this.moveDate(NavDirection.previous);
  }

  nextMonth() {
    this.moveDate(NavDirection.next);
  }

  toggleCalendar() {
    this.show = !this.show;
    if (this.show) {
      this._selectedDate = null;
      this.currentDate = new Date();
      this.createCalendar();
    }
  }

  /*
  */

  private formatDate(date: Date): string {
    // Can also use Intl.DateTimeFormat
    switch (this.options?.format) {
      case DateFormat.full: return date.toLocaleDateString('default', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      case DateFormat.long: return date.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' });
      case DateFormat.medium: return date.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' });
      case DateFormat.short:
      default: {
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, '0');
        const day = `${date.getDate()}`.padStart(2, '0');

        return `${day}/${month}/${year}`;
      }
    }
  }

  private hideCalendar() {
    this.show = false;
  }

  private moveDate(direction: NavDirection) {
    this.currentDate.setMonth(this.currentDate.getMonth() + direction);
    this.createCalendar();
  }

  private toggleNavButtons() {
    this.showNav.prev = this.checkIfNavIsPossible(NavDirection.previous);
    this.showNav.next = this.checkIfNavIsPossible(NavDirection.next);
  }

  // checks the min and max date options if navigation should still be possible
  private checkIfNavIsPossible(direction: NavDirection): boolean {
    switch (direction) {
      case NavDirection.previous: {
        // get last day of previous month
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 0)
        return this.options?.minDate == undefined || this.options?.minDate?.getTime() < lastDay.getTime()
      }
      case NavDirection.next: {
        // get first day of next month
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
        return this.options?.maxDate == undefined || this.options?.maxDate?.getTime() > firstDay.getTime();
      }
    }
  }

  private createCalendar() {
    // clear the weeks array.
    this.weeks = [];

    // set calendar title
    const month = this.currentDate.toLocaleDateString('default', { month: 'long' });
    this.title = `${month} ${this.currentDate.getFullYear()}`

    // setup calendar date numbers
    let date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    let week: CalendarDate[] = [];
    for (
      let i = 7;
      date.getMonth() == this.currentDate.getMonth() || week[0]?.date.getMonth() == this.currentDate.getMonth();
      i += 7
    ) {
      week = this.getWeek(date);
      
      if (
        week.length > 0
        && (
          week[0]?.date.getMonth() > this.currentDate.getMonth()
          || (week[0]?.date.getMonth() == 0 && this.currentDate.getMonth() == 11)
        )
        && !(week[0]?.date.getMonth() == 11 && this.currentDate.getMonth() == 0)
      ) {
        break;
      }
      const _selectedDate = week.find(calDate => calDate.date.getTime() == this._selectedDate?.date.getTime());
      if (_selectedDate) {
        _selectedDate.selected = true;
      }
      this.weeks.push(week);
      date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1 + i);
    }

    // toggle nav buttons
    this.toggleNavButtons();
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
        disabled: clonedDate.getMonth() != this.currentDate.getMonth() 
                  || clonedDate.getTime() < this.options?.minDate?.getTime() 
                  || clonedDate.getTime() > this.options?.maxDate?.getTime()
      }
      if (
        num == this.currentDate.getDate()
        && clonedDate.getMonth() == actualDate.getMonth()
        && !this._selectedDate
      ) {
        calendarDate.selected = true;
        this._selectedDate = calendarDate;
      }

      dayNum.push(calendarDate);
      first.setDate(num + 1);
    }
    return dayNum;
  }
}
