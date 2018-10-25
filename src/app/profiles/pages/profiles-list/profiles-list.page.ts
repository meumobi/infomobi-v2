import { ProfilesService } from '@profiles/services';
import { Profile } from '@profiles/models';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profiles-list',
  templateUrl: './profiles-list.page.html',
  styleUrls: ['./profiles-list.page.scss'],
})
export class ProfilesListPage implements OnInit {

  profiles$: Observable<Profile[]>;

  constructor(
    private profilesService: ProfilesService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.profiles$ = this.profilesService.fetchAll();
  }

  create(profile: Profile) {
    this.profilesService.create(profile);
  }

  delete(id: string) {
    this.profilesService.delete(id);
  }

  update(profile: Profile) {
    this.profilesService.update(profile);
  }

  openTabPage(url: string, outlet: string, id: string = "") {
    this.router.navigateByUrl(`/tabs/(${outlet}:${url}/${id}`);
  }
}
