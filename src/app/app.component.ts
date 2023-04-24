import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'songSort';
  id = '';

  getPlaylistId(id: string){
    this.id = id;
  }
}
