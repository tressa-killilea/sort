import { AfterViewInit, Component, Input } from '@angular/core';
import * as songData from 'src/assets/songList.json';
import * as testData from 'src/assets/testList.json';

type SongObj = {
  title: string;
  album: string;
};

type AlbumObj = {
  title: string;
  points: number;
  trackTotal: number;
}

@Component({
  selector: 'app-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.scss']
})
export class SortComponent implements AfterViewInit{
  @Input() listType:string = "song";
  dataList:SongObj[] = testData;

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

  tempObj:object[] = [];

  ngAfterViewInit(){
    this.showImage();
  }

  constructor(){
    this.initList();
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
      str = "Battle #"+(this.numQuestion-1)+"<br>"+Math.floor(this.finishSize*100/this.totalSize)+"% sorted.";
      const el = document.getElementById("battleNumber");
      if(el != null) el.innerHTML = str;
      this.showResult();
      this.finishFlag = 1;
    } else {
      this.showImage();
    }
    console.log(this.lstMember);
  }

  fitFont(){
    var leftField = document.getElementById('leftField');
    var neutralField = document.getElementById('neutralField');
    var rightField = document.getElementById('rightField');

    
  }

  showImage(){
    var str0 = "Battle #"+(this.numQuestion-1)+"<br>"+Math.floor(this.finishSize*100/this.totalSize)+"% sorted.";
    var str1 = ""+this.getSongName(this.lstMember[this.cmp1][this.head1]);
    var str2 = ""+this.getSongName(this.lstMember[this.cmp2][this.head2]);
    this.progress = Math.floor(this.finishSize*100/this.totalSize)
    const battleEl = document.getElementById("battleNumber");
    if(battleEl) battleEl.innerHTML = str0;
    const leftEl = document.getElementById("leftField");
    if(leftEl) {
      leftEl.innerHTML = str1;
      if(str1.length > 25){
        leftEl.style.fontSize = "20px";
      } else leftEl.style.fontSize = "25px";
    }
    const rightEl = document.getElementById("rightField");
    if(rightEl) {
      rightEl.innerHTML = str2;
      if(str2.length > 25){
        rightEl.style.fontSize = "20px;"
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

    str += "<table style=\"width:200px; font-size:18px; line-height:120%; margin-left:auto; margin-right:auto; border:1px solid #000; border-collapse:collapse\" align=\"center\">";
    str += "<tr><td style=\"color:#ffffff; background-color:#000; text-align:center;\">Album<\/td><td style=\"color:#ffffff; background-color:#000; text-align:center;\">Points<\/td><\/tr>";

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
    this.showAlbumResult();
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
    const resultEl = document.getElementById("albumResults");

    for(var i=0; i < albumTitles.length; i++){
      albumsObj[i] = {
        title: albumTitles[i],
        points: 0,  
        trackTotal: 0
      }
    }
  
    for(var j=0; j < list.length; j++){
     
      tempSongObj = this.getSongObj(list[j]);
      
      tempIndex = this.findAlbumIndex(tempSongObj.album, albumsObj);
      albumsObj[tempIndex].points += j;
      albumsObj[tempIndex].trackTotal++;
    }

    // build albums table
    str += "<table style=\"width:200px; font-size:18px; line-height:120%; margin-left:auto; margin-right:auto; border:1px solid #000; border-collapse:collapse\" align=\"center\">";
    str += "<tr><td style=\"color:#ffffff; background-color:#000; text-align:center;\">Rank<\/td><td style=\"color:#ffffff; background-color:#000; text-align:center;\">Song<\/td><\/tr>";

    for(var i=0; i < albumsObj.length; i++){
      var points = (totalPoints - albumsObj[i].points) * (albumsObj[i].trackTotal / list.length);
      str += "<tr><td style=\"border:1px solid #000; text-align:center; padding-right:5px;\">"+albumsObj[i].title+"<\/td><td style=\"border:1px solid #000; padding-left:5px;\">"+points+"<\/td><\/tr>";
    }

    str += "<\/table>";

    if(resultEl) resultEl.innerHTML = str;
  }

}
