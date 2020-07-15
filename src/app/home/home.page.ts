import { Component } from '@angular/core';
import { CalendarOptions, DateFormat } from '../components/calendar/calendar.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  calendarOptions: CalendarOptions = {
    minDate: new Date("2020-07-10"),
    maxDate: new Date("2020-08-31"),
    // format: DateFormat.short
  }

  constructor() {}

  onSelectDate(dateString: string) {
    console.log(dateString);
  }
}
