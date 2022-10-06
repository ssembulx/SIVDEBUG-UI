import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedService } from '../services/shared.service';
import * as svcs from '../services';
import { HelperService } from '../shared/services/helper.service';
@Injectable(
    {
        providedIn: 'root'
    }
)
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private dataShare: SharedService, private dataSvc: svcs.GenOverGenDataService, private helper: HelperService) {

    }
    /* local */
   /*   canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return new Promise(res => {
            this.dataSvc.getESService(0).subscribe((active: any) => {
                if (active.responses) {
                    if (active.responses[0].result_table[0].isWritable == 1) {
                        this.dataSvc.getESService(1).subscribe((act: any) => {
                            if (act.responses) {
                                this.helper.GetUser().subscribe(user => {
                                    if (user == null) {
                                        this.dataSvc.getUserInfo(act.responses[0].result_table[0].idsid).subscribe(res => {
                                            if (res) {
                                                this.helper.SetUser(res.usermodel[0]);
                                            }
                                        });
                                    }
                                });
                            }
                        });
                        res(true);
                    } else if (active.responses[0].result_table[0].isWritable == 0) {
                        this.router.navigate(['/AccessDenied']);
                        res(false);
                    }
                }
            });
        });
    }  */
    /* server */
    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (!this.helper.token) {
            let userToken: any = await this.dataSvc.GetToken();
            const payload = { "userToken": userToken.token }
            const userinfo: any = await this.dataSvc.getUserDetailByIAM(payload)
            if (userinfo) {
                this.helper.setToken(userToken.token)
                this.helper.SetUser(userinfo);
                return true;
            } else {
                this.router.navigate(['/AccessDenied']);
                return false
            }
        } else {
            return true
        }
    }
}

