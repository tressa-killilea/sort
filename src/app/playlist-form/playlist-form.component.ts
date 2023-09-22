import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'playlist-form',
  templateUrl: './playlist-form.component.html',
  styleUrls: ['./playlist-form.component.scss'],
})
export class PlaylistFormComponent {
  @Output() playlistID = new EventEmitter<string>();
  playlistIDstr: string = '';
  playlistLink: string = '';
  hasError: boolean = false;
  regex: any = /https:\/\/open\.spotify\.com\/playlist\/.*\?si=.*/gm;

  constructor(private router: Router) {}

  clickStart() {
    if (!this.regex.test(this.playlistLink)) this.hasError = true;
    else this.hasError = false;

    if (!this.hasError) {
      const splitRgx = /playlist\//gm;
      const splitLink = this.playlistLink.split(splitRgx);
      this.playlistIDstr = splitLink[1];
      const wrapper = document.getElementById('form-wrapper');
      if (wrapper) wrapper.setAttribute('hidden', '');
      this.router.navigateByUrl('/sort', { state: { id: this.playlistIDstr } });
    }
  }
}
