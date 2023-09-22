# SongSort

The purpose of this application is to take a link to a Spotify playlist and allow the user to sort through the songs by comparing two at a time until there is a definitive list from most favorable to least. The application uses the playlist ID from the URL to utilize Spotify APIs to pull song and playlist data.

Because this algorithm can be time consuming for the user for a playlist with a high number of songs, I recommend using this test playlist as a way to run through the process quickly.

    https://open.spotify.com/playlist/0l1gPdDmfz51TTCKrXFrdb?si=622d419162f6471b

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.1.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## To Do

- Unit Testing
- Improve responsiveness
- Style results table
- Add artist name to results table
- Refactor css with SCSS
- Explore options for other sorting options (other than songs)
