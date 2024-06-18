import { Component } from "@angular/core";

import { GameContainerComponent } from "./game-container.component";

@Component({
  selector: "game-home",
  standalone: true,
  imports: [GameContainerComponent],
  template: ` <game-container /> `,
})
export default class HomeComponent {}
