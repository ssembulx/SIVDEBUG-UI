import { Component, OnInit } from '@angular/core';
import { AccountModel } from 'src/app/models/account.model';
import { HelperService } from '../../shared/services/helper.service';
import { sidenav } from "../../const/sidenav";
import * as svcs from '../../services';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'cqi-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  /* SideNavMenu: any; */
  Pagetitle: any;
  constructor(private helper: HelperService, private dataShare: svcs.SharedService, public router: Router, private modalService: NgbModal, private dataSvc: svcs.GenOverGenDataService) { }

  userInfo: AccountModel;
  data;
  ngOnInit(): void {
    /* this.SideNavMenu = sidenav; */
    this.helper.GetUser().subscribe(user => {
      this.userInfo = user;
    });
    this.dataShare.currentTitle.subscribe(message => this.Pagetitle = message);
    this.getPlatformData();
    this.getMenuData();
  }
  onSelectTab(newTab: string): void {
    /* if (newTab == "dcr" || newTab == "triage-accuracy" || newTab == "defect-ageing" || newTab == "triage-latency" || newTab == "through-put" || newTab == "milestone-blockers") { */

    /* } */
    /*  if (newTab == "BugAssistUsage") {
       window.open("https://bugassist-mapper.intel.com/#/home/dashboard", "_blank");
     } else { */
    this.router.navigate([newTab]);
    /* } */
  }

  openReleaseNotes(content) {
    this.modalService.open(content, { size: 'lg' });
  }

  /* get latform data */
  releaseNote;
  techInfo;
  link;
  getPlatformData() {
    this.dataSvc.getReleaseData().subscribe(res => {
      if (res) {
        this.releaseNote = res.version;
        this.link = res.technologyDetails[0].technologyInfo.split(": ");
        this.techInfo = res.technologyDetails;
        this.releaseNote.forEach((d, index) => {
          d.releaseIteam = d.releaseIteam.split(",");
        });
      }
    });
  }

  /* get menu data */
  SideNavMenu;
  Staging : any = false;
  getMenuData() {
    this.dataSvc.getMenuData().subscribe(res => {
      if (res) {
        this.SideNavMenu = res.getmenu;
        this.Staging = true;
      }
    });
  }
}
