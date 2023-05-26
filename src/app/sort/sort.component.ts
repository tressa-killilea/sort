import { AfterViewInit, Component, Injectable, Input } from '@angular/core';
import Chart, { ChartItem } from 'chart.js/auto';
import {GetToken} from '../services/getToken.service';
import { Songs } from '../services/songs.service';
import { Location } from '@angular/common';

type SongObj = {
  title: string;
  album: string;
  id: string;
};

type AlbumObj = {
  title: string;
  points: number;
  trackTotal: number;
}

type GraphModel = {
  value:number;
  color:string;
  size:string;
  legend:string;
}

@Component({
  selector: 'app-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.scss'],
  providers:[GetToken, Songs]
})
export class SortComponent implements AfterViewInit{
  @Input() listType:string = "song";
  @Input() playlistId: string = '';
  dataList:SongObj[] = [];

  lstMember:number[][] = []
  parent:number[] = [];
  equal:number[] = [];
  rec:number[] = [];

  cmp1 = 0;
  cmp2 = 0;
  head1 = 0;
  head2 = 0;
  nrec = 0;
  progress = 0;

  numQuestion = 1;
  totalSize = 0;
  finishSize = 0;
  finishFlag = 0;

  leftSongId = '';
  rightSongId = '';

  albumAry:AlbumObj[] = [];

  tempObj:object[] = [];

  token:any = {};
  playlist:any = {};
  routeState:any = {};
  isTSplaylist: boolean = true;

  toggleBtnTxt = "Hide Music Players";
  showPlayers = true;

  ngAfterViewInit(){
   // this.showImage();
  }

  ngOnInit() {
    this.routeState = this.location.getState();
    this.playlistId = this.routeState.id;
  }

  constructor(private getToken: GetToken, 
    private songService: Songs, 
    private location: Location){

    this.getTokenService();

    this.isTSplaylist = this.playlistId === "5IZAevyO1lpExvoXitoZmU";
  }

  // async getTokenService(){
  //   await this.getToken.sendPostRequest().subscribe((token: object) => (this.token = token));
  // }
  getTokenService(){
      this.getToken.sendPostRequest().subscribe((token: any) => {
        this.token = token;
        this.getPlaylistService('', this.playlistId);
      });
  }

  getPlaylistService(url: string = '', playlistId: string){
    var temp:SongObj[] = [];
    this.songService.getPlaylist(this.token.access_token, url, playlistId).subscribe((playlist: any) => {

      this.playlist = playlist;
      this.getData();

      if(playlist.body.next != null){
        this.getPlaylistService(playlist.body.next, playlistId);
      } else {
        this.initList();
        this.showImage();
      }
    });
  }

  cleanAlbumTitleTS(t: string){
    var title = "";
    if(t == "Taylor Swift") {
      title = "Debut"
    }
    else if(t.includes("Fearless")) {
      title = "Fearless";
    }
    else if(t.includes("Speak Now")) {
      title = "Speak Now";
    }
    else if(t.includes("Red")) {
      title = "Red";
    }
    else if(t.includes("1989")) {
      title = "1989";
    }
    else if(t.includes("reputation")) {
      title = "reputation";
    }
    else if(t.includes("Lover")) {
      title = "Lover";
    }
    else if(t.includes("folklore")) {
      title = "folklore";
    }
    else if(t.includes("evermore")) {
      title = "evermore";
    }
    else if(t.includes("Midnights")) {
      title = "Midnights";
    }
    else {
      title = "Other"
    }
    return title;
  }

  getData(){
    var temp:SongObj[] = [];
    var tempObj:SongObj = {title: "", album: "", id: ""};
    for(var i=0; i<this.playlist.body.items.length; i++){
      tempObj.title= this.playlist.body.items[i].track.name;
      if(this.isTSplaylist) tempObj.album= this.cleanAlbumTitleTS(this.playlist.body.items[i].track.album.name);
      else tempObj.album=this.playlist.body.items[i].track.album.name;
      tempObj.id= this.playlist.body.items[i].track.id;

      temp.push(tempObj);
      tempObj = {title: "", album: "", id: ""};
    }
    this.dataList.push(...temp);
  }

  initList(){
    var n = 0;
    var mid = 0;
    var i = 0;
    this.lstMember[n] = [];
    for( i=0; i<this.dataList.length; i++){
      this.lstMember[n][i] = i;
    }

    this.parent[n] = -1;
    this.totalSize = 0;
    n++;

    for(i=0; i<this.lstMember.length; i++){
      if(this.lstMember[i].length >= 2){
        mid = Math.ceil(this.lstMember[i].length/2);
        this.lstMember[n] = new Array();
        this.lstMember[n] = this.lstMember[i].slice(0,mid);
        this.totalSize += this.lstMember[n].length;
        this.parent[n] = i;
        n++;
        this.lstMember[n] = new Array();
        this.lstMember[n] = this.lstMember[i].slice(mid,this.lstMember[i].length);
        this.totalSize += this.lstMember[n].length;
        this.parent[n] = i;
        n++;
      }
    }

    for(i=0; i<this.dataList.length; i++){
      this.rec[i] = 0;
    }

    this.nrec = 0;

    for(i=0; i<=this.dataList.length; i++){
      this.equal[i] = -1;
    }

    this.cmp1 = this.lstMember.length-2;
    this.cmp2 = this.lstMember.length-1;
  }

  sortList(flag: number){
    var i = 0;
    var str = "";

    // Choose left song
    if(flag < 0){
      this.rec[this.nrec] = this.lstMember[this.cmp1][this.head1];
      this.head1++;
      this.nrec++;
      this.finishSize++;

      while(this.equal[this.rec[this.nrec-1]] != -1){
        this.rec[this.nrec] = this.lstMember[this.cmp1][this.head1];
        this.head1++;
        this.nrec++;
        this.finishSize++;
      }
      // Choose right song
    } else if(flag>0){
      this.rec[this.nrec] = this.lstMember[this.cmp2][this.head2];
      this.head2++;
      this.nrec++;
      this.finishSize++;

      while(this.equal[this.rec[this.nrec-1]] != -1){
        this.rec[this.nrec] = this.lstMember[this.cmp2][this.head2];
        this.head2++;
        this.nrec++;
        this.finishSize++;
      }
      // Choose neutral option
    } else {
      this.rec[this.nrec] = this.lstMember[this.cmp1][this.head1];
      this.head1++;
      this.nrec++;
      this.finishSize++;

      while(this.equal[this.rec[this.nrec-1]] != -1){
        this.rec[this.nrec] = this.lstMember[this.cmp1][this.head1];
        this.head1++;
        this.nrec++;
        this.finishSize++;
      }

      this.rec[this.nrec] = this.lstMember[this.cmp2][this.head2];
      this.head2++;
      this.nrec++;
      this.finishSize++;

      while(this.equal[this.rec[this.nrec-1]] != -1){
        this.rec[this.nrec] = this.lstMember[this.cmp2][this.head2];
        this.head2++;
        this.nrec++;
        this.finishSize++;
      }
    }

    // If second list is done
    if(this.head1 < this.lstMember[this.cmp1].length && 
      this.head2 == this.lstMember[this.cmp2].length){
        while(this.head1 < this.lstMember[this.cmp1].length){
          this.rec[this.nrec] = this.lstMember[this.cmp1][this.head1];
          this.head1++;
          this.nrec++;
          this.finishSize++;
        }
      //If first list is done
    } else if(this.head1 == this.lstMember[this.cmp1].length &&
      this.head2<this.lstMember[this.cmp2].length){
        while(this.head2 < this.lstMember[this.cmp2].length){
          this.rec[this.nrec] = this.lstMember[this.cmp2][this.head2];
          this.head2++;
          this.nrec++;
          this.finishSize++;
        }
    }

    //If both lists are done
    if(this.head1 == this.lstMember[this.cmp1].length && 
      this.head2 == this.lstMember[this.cmp2].length){

        for (i=0; i<this.lstMember[this.cmp1].length+this.lstMember[this.cmp2].length; i++) {
          this.lstMember[this.parent[this.cmp1]][i] = this.rec[i];
        }

        this.lstMember.pop();
        this.lstMember.pop();
        this.cmp1 = this.cmp1 - 2;
        this.cmp2 = this.cmp2 - 2;
        this.head1 = 0;
        this.head2 = 0;

        //Initialize the rec before performing the new comparison
        if(this.head1==0 && this.head2 == 0){
          for(i=0; i<this.dataList.length; i++){
            this.rec[i] = 0;
          }
          this.nrec = 0;
        }
    }

    if(this.cmp1 < 0) {
      str = "Battle #"+(this.numQuestion-1);
      const el = document.getElementById("battleNumber");
      if(el != null) el.innerHTML = str;
      this.showResult();
      this.finishFlag = 1;
    } else {
      this.showImage();
    }
  }

  fitFont(){
    var leftField = document.getElementById('leftField');
    var neutralField = document.getElementById('neutralField');
    var rightField = document.getElementById('rightField');
  }

  getEmbedSrc(id: string) {
    return "https://open.spotify.com/embed/track/"+id+"?utm_source=generator";
  }

  showImage(){
    const obj1 = this.getSongObj(this.lstMember[this.cmp1][this.head1]);
    const obj2 = this.getSongObj(this.lstMember[this.cmp2][this.head2]);

    var str0 = "Battle #"+(this.numQuestion-1);
    var str1 = obj1.title;
    var str2 = obj2.title;

    this.progress = Math.floor(this.finishSize*100/this.totalSize)
    const battleEl = document.getElementById("battleNumber");

    if(battleEl) battleEl.innerHTML = str0;
    const leftEl = document.getElementById("leftField");
    const rightEl = document.getElementById("rightField");

    this.leftSongId = this.getEmbedSrc(obj1.id);
    this.rightSongId = this.getEmbedSrc(obj2.id);

    if(leftEl) {
      leftEl.innerHTML = str1;
      if(str1.length > 25){
        leftEl.style.fontSize = "20px";
      } else leftEl.style.fontSize = "25px";
    }
    
    if(rightEl) {
      rightEl.innerHTML = str2;
      if(str2.length > 25){
        rightEl.style.fontSize = "20px";
      } else rightEl.style.fontSize = "25px;"
    }
    this.numQuestion ++;
  }

  getSongName(n: number){
    return this.dataList[n].title;
  }

  getSongObj(n: number){
    return this.dataList[n];
  }

  showResult() {
    var ranking = 1;
    var sameRank = 1;
    var str = "";
    var i:number;
    const resultEl = document.getElementById("resultField");

    str += "<table style=\"width:350px; font-size:18px; line-height:120%; margin-left:auto; margin-right:auto; border:1px solid #000; border-collapse:collapse\" align=\"center\">";
    str += "<tr><td style=\"color:#ffffff; background-color:#6B705C; font-family: Goudy Old Style ;text-align:center;\">Rank<\/td><td style=\"color:#ffffff; background-color:#000; background-color:#6B705C; font-family: Goudy Old Style; text-align:center;\">Song<\/td><\/tr>";

    for(i=0; i<this.dataList.length; i++){
      str += "<tr><td style=\"border:1px solid #000; text-align:center; padding-right:5px;\">"+ranking+"<\/td><td style=\"border:1px solid #000; padding-left:5px;\">"+this.dataList[this.lstMember[0][i]].title+"<\/td><\/tr>";
      if(i < this.dataList.length - 1){
        if(this.equal[this.lstMember[0][i]] == this.lstMember[0][i+1]){
          sameRank ++;
        } else {
          ranking += sameRank;
          sameRank = 1;
        }
      }
    }
    str += "<\/table>";
    if(resultEl) resultEl.innerHTML = str;
    if(this.isTSplaylist) this.showAlbumResult();
  }

  findAlbumIndex(albumTitle: string, albums: AlbumObj[]){
    for(var i=0; i<albums.length; i++){
      if(albumTitle == albums[i].title) return i;
    }
    return -1;
  }

  getAlbumList(){
    var albumList:string[] = [];
    var isFound = false;

    for(var i=0; i<this.dataList.length; i++){
      for(var j=0; j<albumList.length; j++){
        if(this.dataList[i].album === albumList[j]) isFound = true;
      }
      if(!isFound) albumList.push(this.dataList[i].album);
      isFound = false;
    }
    return albumList;
  }

  showAlbumResult(){
    var list = this.lstMember[0];
    var albumTitles = this.getAlbumList();
    var albumsObj:AlbumObj[] = [];
    var tempSongObj;
    var tempIndex;
    var str = "";
    var totalPoints = (list.length - 1) * list.length / 2;
    var chartColors:string[] = [];
    var chartPoints:number[] = [];

    // Instatiate albumsObj
    for(var i=0; i < albumTitles.length; i++){
      albumsObj[i] = {
        title: albumTitles[i],
        points: 0,  
        trackTotal: 0
      }
    }
   // 
    for(var j=0; j < list.length; j++){
      tempSongObj = this.getSongObj(list[j]);
      tempIndex = this.findAlbumIndex(tempSongObj.album, albumsObj);
      albumsObj[tempIndex].points += j;
      albumsObj[tempIndex].trackTotal++;
    }

    albumsObj.forEach((album)=>{
      var t = album.title;
      if(t == "Debut") {
        chartColors.push("#8ac6eb");
      }
      else if(t.includes("Fearless")) {
        chartColors.push("#9c643d");
      }
      else if(t.includes("Speak Now")) {
        chartColors.push("#712485");
      }
      else if(t.includes("Red")) {
        chartColors.push("#c71625");
      }
      else if(t.includes("1989")) {
        chartColors.push("#537aad");
      }
      else if(t.includes("reputation")) {
        chartColors.push("#000");
      }
      else if(t.includes("Lover")) {
        chartColors.push("#e67ec8");
      }
      else if(t.includes("folklore")) {
        chartColors.push("#827f81");
      }
      else if(t.includes("evermore")) {
        chartColors.push("#57091d");
      }
      else if(t.includes("Midnights")) {
        chartColors.push("#28285e");
      }
      else {
        chartColors.push("#a3972a");
      }
    });

    for(var i=0; i < albumsObj.length; i++){
      var points = (totalPoints - albumsObj[i].points) * (albumsObj[i].trackTotal / list.length);
      chartPoints.push(points);
    }

    var chart = document.getElementById("albumChart") as ChartItem;
    var albumChart = new Chart(chart, {
      type: 'bar',
      data:{
        labels: albumTitles,
        datasets: [{
          label: '',
          data: chartPoints,
          backgroundColor: chartColors,
          maxBarThickness: 20,
        }]
      },
      options: {
        indexAxis: "y",
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              display: false
            },
            
          },
          y: {
            grid: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  toggleMusicPlayers(){
    // const leftPlayer = document.getElementById("left-player");
    // const rightPlayer = document.getElementById("right-player");
    this.showPlayers = !this.showPlayers;
  }

}
