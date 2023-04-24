import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
//var querystring = require('query-string');

@Injectable()
export class GetToken {
    url: string = 'https://accounts.spotify.com/api/token';

    constructor (private http: HttpClient) { }

    sendPostRequest() {
        const headers = new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')

            const body = "grant_type=client_credentials&client_id=59833418178c407d91ca2976158b18cc&client_secret=40f7d7026509471f92f368f9ab2827ee"
        // const body = {
        //     grant_type: 'client_credentials',
        //     client_id: '59833418178c407d91ca2976158b18cc',
        //     client_secret: '40f7d7026509471f92f368f9ab2827ee'
        // }
        return this.http.post(this.url, body, { headers: headers });
   }   
}