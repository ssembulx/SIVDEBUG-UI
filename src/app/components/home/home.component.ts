import { Component, OnInit } from '@angular/core';
import * as svcs from '../../services';
import { HelperService } from '../../shared/services/helper.service';
import { AccountModel } from 'src/app/models/account.model';
@Component({
  selector: 'cqi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private dataShare: svcs.SharedService, private dataSvc: svcs.GenOverGenDataService, private helper: HelperService) { }
  //userInfo: AccountModel;
  ngOnInit(): void {
    this.helper.GetUser().subscribe(user => {
      if (user != null) {
        // this.userInfo = user;
        this.dataSvc.getUserviewDetails(user.idsid, 'Home').subscribe(res => {
          if (res) {
          }
        });
      }
    });
    this.dataShare.changeTitle("home");
    this.GetHSDESLink();
    this.getUserViewDetails();
  }
  userviewDetails;
  getUserViewDetails() {
    this.dataSvc.getUserViewDetails().subscribe(res => {
      if (res) {

        this.userviewDetails = res.userviewDetails;
      }
    });
  }
  HSDESLink;
  GetHSDESLink() {
    this.dataSvc.getHSDESLink().subscribe(res => {
      if (res) {
        this.HSDESLink = res.coeQueryID;
      }
    });
  }

}
