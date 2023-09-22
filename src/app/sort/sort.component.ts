import { AfterViewInit, Component, Injectable, Input } from '@angular/core';
import { GetToken } from '../services/getToken.service';
import { Songs } from '../services/songs.service';
import { Location } from '@angular/common';
import { Sort } from '../services/sort.service';

type PlaylistObj = {
  name: string;
  owner: string;
  image: string;
};

@Component({
  selector: 'app-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.scss'],
  providers: [GetToken, Songs, Sort],
})
export class SortComponent implements AfterViewInit {
  @Input() listType: string = 'song';
  @Input() playlistId: string = '';

  playlistInfo: PlaylistObj = {
    name: '',
    owner: '',
    image: '',
  };

  numQuestion = 1;
  finishFlag = 0;
  progress = 0;

  leftSongId = '';
  rightSongId = '';

  token: any = {};
  playlist: any = {};
  routeState: any = {};

  toggleBtnTxt = 'Hide Music Players';
  showPlayers = true;

  ngAfterViewInit() {}

  ngOnInit() {
    this.routeState = this.location.getState();
    this.playlistId = this.routeState.id;
  }

  constructor(
    private getToken: GetToken,
    private songService: Songs,
    private location: Location,
    private sortService: Sort
  ) {
    this.getTokenService();
  }

  getTokenService() {
    this.getToken.sendPostRequest().subscribe((token: any) => {
      this.token = token;
      this.getPlaylistService('', this.playlistId);
    });
  }

  getPlaylistService(url: string = '', playlistId: string) {
    this.songService
      .getPlaylist(this.token.access_token, url, playlistId)
      .subscribe((playlist: any) => {
        this.playlist = playlist;
        this.sortService.getData(playlist);

        if (playlist.body.next != null) {
          this.getPlaylistService(playlist.body.next, playlistId);
        } else {
          this.sortService.initList();
          this.showImage();
        }
      });

    this.songService
      .getPlaylistInfo(this.token.access_token, url, playlistId)
      .subscribe((playlist: any) => {
        this.playlistInfo.name = playlist.body.name;
        this.playlistInfo.owner = playlist.body.owner.display_name;
        this.playlistInfo.image = playlist.body.images[0].url;
      });
  }

  onClick(flag: number) {
    var str = '';
    const isDone = this.sortService.sortList(flag);
    if (isDone) {
      str = 'Battle #' + (this.numQuestion - 1);
      const el = document.getElementById('battleNumber');
      if (el != null) el.innerHTML = str;
      this.showResult();
      this.finishFlag = 1;
    } else {
      this.showImage();
    }
  }

  getEmbedSrc(id: string) {
    return (
      'https://open.spotify.com/embed/track/' +
      id +
      '?utm_source=generator&theme=0'
    );
  }

  formatText(
    songTitle: string,
    songHtml: HTMLElement,
    artistHtml: HTMLElement
  ) {
    if (songTitle.length > 25) {
      songHtml.style.fontSize = '20px';
    } else {
      songHtml.style.fontSize = '25px';
    }
    songHtml.style.marginTop = 'auto';
    songHtml.style.marginBottom = '35px';

    artistHtml.style.fontSize = '15px';
  }

  showImage() {
    const obj1 = this.sortService.getLeftObject();
    const obj2 = this.sortService.getRightObject();

    var str0 = 'Battle #' + (this.numQuestion - 1);
    var str1 = obj1.title;
    var str2 = obj2.title;

    var leftHtml = `<h1 class='song-title'>${str1}</h1><p class='artists'>${obj1.artists[0]}</p>`;
    var rightHtml = `<h1 class='song-title'>${str2}</h1><p class='artists'>${obj2.artists[0]}</p>`;

    this.progress = this.sortService.getProgress();
    const battleEl = document.getElementById('battleNumber');

    if (battleEl) battleEl.innerHTML = str0;
    const leftEl = document.getElementById('leftField');
    const rightEl = document.getElementById('rightField');

    this.leftSongId = this.getEmbedSrc(obj1.id);
    this.rightSongId = this.getEmbedSrc(obj2.id);

    if (leftEl) {
      leftEl.innerHTML = leftHtml;
      const songName = leftEl.children[0] as HTMLElement;
      const artist = leftEl.children[1] as HTMLElement;
      this.formatText(str1, songName, artist);
    }

    if (rightEl) {
      rightEl.innerHTML = rightHtml;
      const songName = rightEl.children[0] as HTMLElement;
      const artist = rightEl.children[1] as HTMLElement;
      this.formatText(str2, songName, artist);
    }
    this.numQuestion++;
  }

  showResult() {
    var ranking = 1;
    var sameRank = 1;
    var str = '';
    var i: number;
    const resultEl = document.getElementById('resultField');

    str +=
      '<table style="width:350px; font-size:18px; line-height:120%; margin-left:auto; margin-right:auto; border:1px solid #000; border-collapse:collapse" align="center">';
    str +=
      '<tr><td style="color:#000; background-color:#daebf5; font-family: Goudy Old Style ;text-align:center;">Rank</td><td style="color:#000; background-color:#daebf5; font-family: Goudy Old Style; text-align:center;">Song</td></tr>';

    for (i = 0; i < this.sortService.dataList.length; i++) {
      str +=
        '<tr><td style="border:1px solid #000; text-align:center; padding-right:5px;">' +
        ranking +
        '</td><td style="border:1px solid #000; padding-left:5px;">' +
        this.sortService.getSong(0, i).title +
        '</td></tr>';
      if (i < this.sortService.getSongListLength() - 1) {
        if (
          this.sortService.equal[this.sortService.lstMember[0][i]] ==
          this.sortService.lstMember[0][i + 1]
        ) {
          sameRank++;
        } else {
          ranking += sameRank;
          sameRank = 1;
        }
      }
    }
    str += '</table>';
    if (resultEl) resultEl.innerHTML = str;
  }

  toggleMusicPlayers() {
    this.showPlayers = !this.showPlayers;
  }
}
