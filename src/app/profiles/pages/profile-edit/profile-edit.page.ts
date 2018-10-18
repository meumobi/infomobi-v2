import { ProfilesService } from '@profiles/services';
import { Profile } from '@profiles/models';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss'],
})
export class ProfileEditPage implements OnInit {

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
    if (id)  {
      this.loadProfile(id);
    } else {
      this.profile = new Profile();
    }
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

  async saveProfile() {
 
    const loading = await this.loadingController.create({
      message: 'Saving Profile..'
    });
    await loading.present();
 
    if (this.profile && this.profile.id) {
      this.profilesService.update(this.profile).then(() => {
        loading.dismiss();
        this.nav.goBack();
      });
    } else {
      this.profilesService.create(this.profile).then(() => {
        loading.dismiss();
        this.nav.goBack();
      });
    }
  }
}
