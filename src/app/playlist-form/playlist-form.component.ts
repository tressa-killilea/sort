import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'playlist-form',
  templateUrl: './playlist-form.component.html',
  styleUrls: ['./playlist-form.component.scss']
})
export class PlaylistFormComponent {

  @Output() playlistID = new EventEmitter<string>;
  choseOther:boolean= false;
  taylorPlaylistID : string = "5IZAevyO1lpExvoXitoZmU";
  // test taylorPlaylistID: string = "5cMvfdMeKXvCR40jP3mU9e";
  playlistIDstr: string = '';
  playlistLink: string = '';
  hasError: boolean = false;

  constructor(private router: Router){}

  clickTaylor(){
    this.playlistIDstr = this.taylorPlaylistID;
    const wrapper = document.getElementById('form-wrapper');
    if(wrapper) wrapper.setAttribute('hidden', '');
    this.router.navigateByUrl('/sort', {state: {id: this.taylorPlaylistID}});
  }

  clickOther(){
    this.choseOther = true;
  }

  clickStart(){
    if(!this.playlistLink.includes("https://open.spotify.com/playlist/")) this.hasError = true;
    else this.hasError = false;
    
    if(!this.hasError) {
      const splitRgx = /playlist\//gm;
      const splitLink = this.playlistLink.split(splitRgx);
      this.playlistIDstr = splitLink[1];
      const wrapper = document.getElementById('form-wrapper');
      if(wrapper) wrapper.setAttribute('hidden', '');
      this.router.navigateByUrl('/sort', {state: {id: this.playlistIDstr}});
    }
  }
}
