import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

const API_URL = environment.meumobi.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private token = 'be672190693f9c8c5cf7da7840a6c942c41fa56f';
  private domain = 'meumobibox.meumobi.com';

  constructor(
    public http: HttpClient,
  ) {}

  private buildUrl(endp) {
    try {
      /*
        If this.domain is null then use domain empty
      */
     console.log('ApiService: buildUrl');
      const domain = (this.domain) ? this.domain : '';
      const url = `${API_URL}/api/${domain}${endp}/`;

      return url;
    } catch (err) {
    }
  }

  private sendRequest(url, options) {

    return this.http.get(url, options).toPromise()
    .then(
      (res: any) => {
        return res.items;
      }
    );
  }

  login(params): Promise<any> {
    const httpOptions = {
      headers: {
        'Accept':  'application/json',
      }
    };

    const url = this.buildUrl('/visitors/login');

    return this.http
      .post(url, params, httpOptions)
      .toPromise()
      .then((response) => {
        return response;
        // return response.json().data as Hero[];
      });
      // .catch(this.handleError);
  }

  fetchLatestItems(): Promise<any[]> {
    const httpOptions = {
      headers: {
        'Accept':  'application/json',
        'X-Visitor-Token': this.token
      }
    };
    const url = this.buildUrl('/items/latest');

    return this.sendRequest(url, httpOptions);
  }

  fetchItemsByCategory(id: number): Promise<any[]> {
    const httpOptions = {
      headers: {
        'Accept':  'application/json',
        'X-Visitor-Token': this.token
      }
    };
    const url = this.buildUrl('/categories') + `${id}/items`;

    return this.sendRequest(url, httpOptions);
  }

  fetchItemById(id: string): Promise<any> {
    const httpOptions = {
      headers: {
        'Accept':  'application/json',
        'X-Visitor-Token': this.token
      }
    };
    const url = this.buildUrl('/items') + `${id}`;

    return this.sendRequest(url, httpOptions);
  }
}
