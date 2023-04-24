import { Injectable, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class Songs {

    constructor (private http: HttpClient) { }

    getPlaylist(token: string, url:string, id:string) {
        var temp:any = []
        const playlistID: string = "5IZAevyO1lpExvoXitoZmU"; //TODO: Playlist ID to be dynamically grabbed from user
        if(url === '') url = 'https://api.spotify.com/v1/playlists/'+id+'/tracks';

        var headers = new HttpHeaders().set('Authorization', 'Bearer '+token);
        return this.http.get(url, { observe: 'response' , headers: headers});
     
   }   
}
