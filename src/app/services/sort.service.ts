type AlbumObj = {
  title: string;
  points: number;
  trackTotal: number;
};

type SongObj = {
  title: string;
  album: string;
  id: string;
  artists: string[];
};

export class Sort {
  lstMember: number[][] = [];
  parent: number[] = [];
  equal: number[] = [];
  rec: number[] = [];
  dataList: SongObj[] = [];

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

  albumAry: AlbumObj[] = [];

  tempObj: object[] = [];

  token: any = {};
  playlist: any = {};
  routeState: any = {};

  getLeftObject() {
    const index = this.lstMember[this.cmp1][this.head1];
    return this.getSong(this.cmp1, this.head1);
  }

  getRightObject() {
    return this.getSong(this.cmp2, this.head2);
  }

  getProgress() {
    return Math.floor((this.finishSize * 100) / this.totalSize);
  }

  getSong(x: number, z: number) {
    const index = this.lstMember[x][z];
    return this.dataList[index];
  }

  getSongListLength() {
    return this.dataList.length;
  }

  getData(playlist: any) {
    var temp: SongObj[] = [];
    var tempObj: SongObj = { title: '', album: '', id: '', artists: [] };
    const tracks = playlist.body.tracks;
    for (var i = 0; i < tracks.items.length; i++) {
      tempObj.title = tracks.items[i].track.name;
      tempObj.album = tracks.items[i].track.album.name;
      tempObj.id = tracks.items[i].track.id;
      const artists = tracks.items[i].track.artists;
      for (const artist of artists) {
        tempObj.artists.push(artist.name);
      }

      temp.push(tempObj);
      tempObj = { title: '', album: '', id: '', artists: [] };
    }
    this.dataList.push(...temp);
  }

  initList() {
    var n = 0;
    var mid = 0;
    var i = 0;
    this.lstMember[n] = [];
    for (i = 0; i < this.dataList.length; i++) {
      this.lstMember[n][i] = i;
    }

    this.parent[n] = -1;
    this.totalSize = 0;
    n++;

    for (i = 0; i < this.lstMember.length; i++) {
      if (this.lstMember[i].length >= 2) {
        mid = Math.ceil(this.lstMember[i].length / 2);
        this.lstMember[n] = new Array();
        this.lstMember[n] = this.lstMember[i].slice(0, mid);
        this.totalSize += this.lstMember[n].length;
        this.parent[n] = i;
        n++;
        this.lstMember[n] = new Array();
        this.lstMember[n] = this.lstMember[i].slice(
          mid,
          this.lstMember[i].length
        );
        this.totalSize += this.lstMember[n].length;
        this.parent[n] = i;
        n++;
      }
    }

    for (i = 0; i < this.dataList.length; i++) {
      this.rec[i] = 0;
    }

    this.nrec = 0;

    for (i = 0; i <= this.dataList.length; i++) {
      this.equal[i] = -1;
    }

    this.cmp1 = this.lstMember.length - 2;
    this.cmp2 = this.lstMember.length - 1;
  }

  sortList(flag: number) {
    var i = 0;

    // Choose left song
    if (flag < 0) {
      this.rec[this.nrec] = this.lstMember[this.cmp1][this.head1];
      this.head1++;
      this.nrec++;
      this.finishSize++;

      while (this.equal[this.rec[this.nrec - 1]] != -1) {
        this.rec[this.nrec] = this.lstMember[this.cmp1][this.head1];
        this.head1++;
        this.nrec++;
        this.finishSize++;
      }
      // Choose right song
    } else if (flag > 0) {
      this.rec[this.nrec] = this.lstMember[this.cmp2][this.head2];
      this.head2++;
      this.nrec++;
      this.finishSize++;

      while (this.equal[this.rec[this.nrec - 1]] != -1) {
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

      while (this.equal[this.rec[this.nrec - 1]] != -1) {
        this.rec[this.nrec] = this.lstMember[this.cmp1][this.head1];
        this.head1++;
        this.nrec++;
        this.finishSize++;
      }

      this.rec[this.nrec] = this.lstMember[this.cmp2][this.head2];
      this.head2++;
      this.nrec++;
      this.finishSize++;

      while (this.equal[this.rec[this.nrec - 1]] != -1) {
        this.rec[this.nrec] = this.lstMember[this.cmp2][this.head2];
        this.head2++;
        this.nrec++;
        this.finishSize++;
      }
    }

    // If second list is done
    if (
      this.head1 < this.lstMember[this.cmp1].length &&
      this.head2 == this.lstMember[this.cmp2].length
    ) {
      while (this.head1 < this.lstMember[this.cmp1].length) {
        this.rec[this.nrec] = this.lstMember[this.cmp1][this.head1];
        this.head1++;
        this.nrec++;
        this.finishSize++;
      }
      //If first list is done
    } else if (
      this.head1 == this.lstMember[this.cmp1].length &&
      this.head2 < this.lstMember[this.cmp2].length
    ) {
      while (this.head2 < this.lstMember[this.cmp2].length) {
        this.rec[this.nrec] = this.lstMember[this.cmp2][this.head2];
        this.head2++;
        this.nrec++;
        this.finishSize++;
      }
    }

    //If both lists are done
    if (
      this.head1 == this.lstMember[this.cmp1].length &&
      this.head2 == this.lstMember[this.cmp2].length
    ) {
      for (
        i = 0;
        i < this.lstMember[this.cmp1].length + this.lstMember[this.cmp2].length;
        i++
      ) {
        this.lstMember[this.parent[this.cmp1]][i] = this.rec[i];
      }

      this.lstMember.pop();
      this.lstMember.pop();
      this.cmp1 = this.cmp1 - 2;
      this.cmp2 = this.cmp2 - 2;
      this.head1 = 0;
      this.head2 = 0;

      //Initialize the rec before performing the new comparison
      if (this.head1 == 0 && this.head2 == 0) {
        for (i = 0; i < this.dataList.length; i++) {
          this.rec[i] = 0;
        }
        this.nrec = 0;
      }
    }

    if (this.cmp1 < 0) {
      return true;
    } else {
      return false;
    }
  }
}
