import { Component } from '@angular/core';

import { AnalogWelcomeComponent } from './analog-welcome.component';

@Component({
  selector: 'game-home',
  standalone: true,
  imports: [AnalogWelcomeComponent],
  template: `
     <game-analog-welcome/>
  `,
})
export default class HomeComponent {
}
