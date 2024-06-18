import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "game-root",
  standalone: true,
  imports: [RouterOutlet],
  template: ` <router-outlet />`,
})
export class AppComponent {}
