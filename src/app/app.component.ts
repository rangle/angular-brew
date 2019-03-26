import {
  Component,
  OnInit,
  Optional,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { TransferState, makeStateKey } from '@angular/platform-browser';
import { APP_NAME } from './tokens';

// make state key in state to store users
const STATE_KEY_BREWERIES = makeStateKey('breweries');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  name = '';
  breweries = [];

  breweries$: Observable<any>;
  constructor(
    private httpClient: HttpClient,
    private state: TransferState,
    @Inject(PLATFORM_ID) private platform: any,
    @Optional() @Inject(APP_NAME) protected appName: any
  ) {
    console.log(appName, platform);
  }

  ngOnInit() {
    this.breweries = this.state.get(STATE_KEY_BREWERIES, [] as any);
    if (this.breweries.length === 0) {
      this.getBreweries();
    }
  }

  getBreweries(name?: string) {
    let url = 'https://api.openbrewerydb.org/breweries';
    if (name) {
      url = url + `?by_name=${name}`;
    }
    this.httpClient.get<any[]>(url).subscribe(data => {
      this.state.set(STATE_KEY_BREWERIES, data as any);
      this.breweries = data;
    });
  }
}
