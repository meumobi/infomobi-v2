import { Profile } from '@profiles/models';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-headline',
  templateUrl: './profile-headline.component.html',
  styleUrls: ['./profile-headline.component.scss']
})
export class ProfileHeadlineComponent implements OnInit {

  @Input() profile: Profile;
  
  constructor() { }

  ngOnInit() {
  }

}
