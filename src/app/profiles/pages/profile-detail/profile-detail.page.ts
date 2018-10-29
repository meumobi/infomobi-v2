import { ProfilesService } from '@profiles/services';
import { Profile } from '@profiles/models';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile-detail.page.html',
  styleUrls: ['./profile-detail.page.scss'],
})
export class ProfileDetailPage implements OnInit {

  profile: Profile = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private nav: NavController,
    private profilesService: ProfilesService,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    /**
     * TODO: id is mandatory on routing, catch when not match any entry
     */
    this.loadProfile(id);
  }

  async loadProfile(id: string) {
    const loading = await this.loadingController.create({
      message: 'Loading Profile..'
    });
    await loading.present();

    this.profilesService.fecthById(id).subscribe( res => {
      loading.dismiss();
      this.profile = res;
    });
  }

  async deleteProfile() {

    const loading = await this.loadingController.create({
      message: 'Delete Profile..'
    });
    await loading.present();

    this.profilesService.delete(this.profile.id).then(() => {
      loading.dismiss();
      this.nav.goBack();
    });
  }

  editProfile() {
    this.router.navigateByUrl(`/tabs/(profiles:profiles/edit/${this.profile.id})`);
  }
}
