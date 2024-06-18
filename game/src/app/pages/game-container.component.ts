import { Component } from "@angular/core";
import { MoleComponent } from "../components/mole.component";

@Component({
  selector: "game-container",
  standalone: true,
  imports: [MoleComponent],
  template: `<div class="container flex flex-col items-center">
    <div class="background-image">
      <div class="header"></div>
      <div class="moles-container">
        @for(mole of moles; track mole){
        <game-mole />
        }
      </div>
    </div>
  </div>`,
  styles: `
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .background-image{
        background: url('/background.png') ;
        width:650px;
        height:100dvh;
        display: flex ;
        flex-direction: column;
      }

      .header {
        flex-basis: 25%
      }

      .moles-container {
        display:grid;
        gap: 1rem;
        grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
      }
    `,
})
export class GameContainerComponent {
  moles = Array.from({ length: 12 }, (_, i) => i + 1);
}
