import { environment } from "src/environments/environment";

export class Constent {
    public static GetUser: string = environment.serviceUrl + 'api/Account/GetUser';
    public static GetCumulativeChart: string = environment.serviceUrl + 'api/Home/GetCumulativeChart';
}
