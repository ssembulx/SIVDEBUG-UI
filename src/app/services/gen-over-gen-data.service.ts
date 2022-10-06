import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class GenOverGenDataService {

  constructor(
    private http: HttpClient
  ) { }

  // save(data: object): Observable<string> {
  //   console.log('Calling getUser');
  //   let serviceUrl: string = `${environment.serviceBaseUrl}api/GenOverGen/GetGenOverGenChart`;

  //   return this.http.post(serviceUrl, data, {responseType: 'text'})
  //     .map((rslt: string) => {
  //       return rslt;
  //     });
  // }

  /* get ES service */
  getESService(data) {
    const serviceUrl = `https://hsdes.intel.com/ws/ESService`;
    let param;
    if (data == 0) {
      param = {
        "requests": [
          {
            "command": "is_subject_writable",
            "command_args": {
              "filter_keys": {},
              "tenant": "client_platf",
              "subject": "bug"
            },
            "var_args": [],
            "tran_id": "869B00EF-7D77-40CD-930D-0610662241F9",
            "api_client": "SWAT:swat-article"
          }
        ]
      }
    } else if (data == 1) {
      param = {
        "requests": [
          {
            "command": "who_am_i",
            "command_args": {
              "filter_keys": {}
            },
            "var_args": [],
            "tran_id": "9878AE6D-AA8F-45E5-90D8-D0A16EDFDA38",
            "api_client": "SWAT:swat-article"
          }
        ]
      }
    }
    return this.http.post(serviceUrl,
      param, {
      headers: new HttpHeaders({
        'Content-type': 'application/json'
      })
    });
  }

  getWhoAmI(userToken): Observable<any> {

    // let userToken:any =  this.getTokens();

    console.log('getWhoAmI', userToken)
    const payload = { "userToken": userToken }
    const serviceUrl = `${environment.baseURL}api/Members/WhoAmI`
    let obj = this.http.post(serviceUrl, payload);
    console.log(obj);
    return obj;
  }

  public getTokens(): Observable<any> {
    return this.http.get(environment.iamWindowsAuth);

  }

  public GetToken() {
    return this.http.get(environment.iamWindowsAuth).toPromise();

  }

  //*** WhoamI APi(user Authentication) ****//
  public getUserDetailByIAM(req: any) {
    const serviceUrl = `${environment.baseURL}api/Members/WhoAmI`
    return this.http.post(serviceUrl, req).toPromise();
  }

  /**
   * @method GetGenOverGenChartData -get cumulative chart data
   */
  getGenOverGenChartData() {
    const serviceUrl = `${environment.serviceBaseUrl}api/GenOverGen/GetGenOverGenChart`;
    return this.http.post(serviceUrl, null, {
      headers: new HttpHeaders({
        'Content-type': 'application/json'
      })
    });
  }

  /**
   * @method getLeftMenu - get the list of filter menus
   */
  getLeftMenu(userName, moduleId) {
    const serviceUrl = `${environment.serviceUrl}api/Fre/GetFilters`;
    return this.http.post(serviceUrl
      /*   , ({
        UserName: userName,
        ModuleID: moduleId,
      }) */
      , {
        headers: new HttpHeaders({
          'Content-type': 'application/json'
        })
      });
  }

  /**
   * @method getNoOfSighting - get the number of sighting compare data for week on week
   * @param filterID number - chart data based on filterId
   * @param moduleId number - get the module id
   * @param platformIDList string -get the selected platform list
   * @param queryString string -get the selected query string
   * @param defectsDateType string -get the which defect type it has
   * @param columnParentIDList array - get the column selected all ids
   * @param defectsTypestr string - get the defect type seleccted
   */
  getNumberOfSightingDataForWeekOnWeekChart(filterID: number, moduleId: number, platformIDList?: any, columnParentIDList?: any,
    queryString?: any, defectsDateType?: any, defectsTypestr?: any, viewType?: number, actionStr?,
    rvpString?, programSkuID?, reportType?, isPOSTPV?, isCMF?, isUnique?: boolean) {
    const wWCount = 10;
    if (filterID !== 0) {
      // platformIDList = [];
      columnParentIDList = [];
      queryString = '';
      // reportType = '';
      // defectsTypestr = '';
      defectsDateType = '';
    }
    if (moduleId !== 4) {
      isPOSTPV = false;
      isCMF = false;
    }
    if (platformIDList === undefined || platformIDList === [] || platformIDList === null) {
      platformIDList = [];
    }
    if ((moduleId === 3) && defectsTypestr === undefined) {
      defectsTypestr = "''Intel Defects''";
    }
    if (moduleId !== 3) {
      defectsTypestr = '';
      programSkuID = 0;
      rvpString = '';
    }
    if (actionStr === undefined || actionStr === null) {
      actionStr = '';
    }
    if (viewType === undefined || viewType === null) {
      if (moduleId === 3 || moduleId === 4) {
        viewType = 1;
      } else {
        viewType = 0;
      }
    }
    if (moduleId !== 1) {
      reportType = 'GOG';
    }
    const serviceUrl = `${environment.serviceBaseUrl}api/CommonUtility/GetWeekOnWeekDefectsChartData`;
    return this.http.post(serviceUrl, ({
      FilterID: filterID,
      PlatformIDList: platformIDList,
      ColumnParentIDList: columnParentIDList,
      QueryString: queryString,
      DefectsTypestr: defectsTypestr,
      ModuleID: moduleId,
      WWCount: wWCount,
      DefectsDateType: defectsDateType,
      ViewType: viewType,
      ActionStr: actionStr,
      rvpStr: rvpString,
      ProgramSkuID: programSkuID,
      ReportType: reportType,
      ISPOSTPV: isPOSTPV,
      ISCMF: isCMF,
      IsUnique: isUnique
    }), {
      headers: new HttpHeaders({
        'Content-type': 'application/json'
      })
    });
  }

  /**
   * @method addUserFavouriteFilter -get the user favourite filters
   * @param filterId number -get the filterId based filter information
   * @param actionType number -get the actionId based filter information
   */
  addUserFavouriteFilter(filterId: number, actionType: boolean) {
    const serviceUrl = `${environment.serviceBaseUrl}api/CommonUtility/AddUserFavouriteMenuFilter`;
    return this.http.post(serviceUrl, ({
      FilterID: filterId,
      action: actionType,
    }), {
      headers: new HttpHeaders({
        'Content-type': 'application/json'
      })
    });
  }

  /**
   * @method getCategoryFilters -get default filter applied details
   */
  getCategoryFilters() {
    const serviceUrl = `${environment.serviceBaseUrl}api/GenOverGen/GetCategoryFilters`;
    return this.http.post(serviceUrl, null, {
      headers: new HttpHeaders({
        'Content-type': 'application/json'
      })
      // headers:{
      //   'Content-type':'application/json'
      // }
    });
  }

  /**
   * @method getHSDESFilterDetails -get the HSDES filters details
   */
  getHSDESFilterDetails() {
    const serviceUrl = `${environment.serviceBaseUrl}api/GenOverGen/GetHSDESFilterDetails`;
    return this.http.post(serviceUrl, JSON.stringify({
      TCPMainID: 1
    }), {
      headers: {
        'Content-type': 'application/json'
      }
    });
  }

  /**
   * @method getGenOverGenchartWithCumulativeChart -get the cumulative chart data
   * @param PlatformData string -selected platform details
   * @param filterinput string -filterInput from filter data
   * @param defectsType string -type of defects
   */
  getGenOverGenchartWithCumulativeChart(PlatformData: any, filterinput: string, defectsType: string) {
    const paramId = 1;
    const wWCount = 10;
    const serviceUrl = `${environment.serviceBaseUrl}api/GenOverGen/GetGenOverGenChartwithFilters`;
    return this.http.post(serviceUrl,
      ({
        PlatformIdList: PlatformData,
        Filtersinput: filterinput,
        paramID: paramId,
        WWCount: wWCount,
        DefectsType: defectsType
      }),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /**
   * @method getNumberOfSightingCompareDataForWeekOnWeekChartByApplyFilter -get the week on week chart data
   * @param PlatformData string -selected platform details
   * @param filterinput string -filterInput from filter data
   * @param defectsType string -type of defects
   */
  getNumberOfSightingCompareDataForWeekOnWeekChartByApplyFilter(PlatformData: any, filterinput: string, defectsType: string) {
    const paramId = 1;
    const wWCount = 10;
    const serviceUrl = `${environment.serviceBaseUrl}api/SightingComparison/GetNoOfSightingByApplyFilter`;
    return this.http.post(serviceUrl,
      ({
        PlatformIdList: PlatformData,
        Filtersinput: filterinput,
        paramID: paramId,
        WWCount: wWCount,
        DefectsType: defectsType
      }),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /**
   * @method validateMenuFilterName -validate menu filter available or not
   * @param filterName string -name of the menu filter
   * @param filterID number -getting data based on filterId
   * @param actionID number -checking with newfilter name or old filter name based on action id
   */
  validateMenuFilterName(filterName: string, filterID: number, actionID: number, moduleId: number) {
    const serviceUrl = `${environment.serviceBaseUrl}api/CommonUtility/ValidateMenuFilterName`;
    return this.http.post(serviceUrl,
      ({
        FilterName: filterName,
        FilterID: filterID,
        ActionID: actionID,
        ModuleID: moduleId
      }),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /**
   * @method getGenOverGenChartwithFavFiltersCumulativeChart -get the cumulative chart data
   * @param filterID number - chart data based on filterId
   * @param moduleId number - get the module id
   * @param platformIDList string -get the selected platform list
   * @param queryString string -get the selected query string
   * @param defectsDateType string -get the which defect type it has
   * @param columnParentIDList array - get the column selected all ids
   * @param defectsTypestr string - get the defect type seleccted
   */
  getGenOverGenChartwithFavFiltersCumulativeChart(filterID: number, moduleId: number, platformIDList?: any,
    columnParentIDList?: any, queryString?: any, defectsDateType?: any,
    defectsTypestr?: any, viewType?: number, actionStr?: string, rvpString?, programSkuID?,
    reportType?, isPOSTPV?, isCMF?, status?, statusReason?, closedReason?, submitType?,
    sysDebugs?, domain?, priority?, exposure?, regression?, howFound?, operatingSystem?,
    components?, isUnique?: boolean) {
    const wWCount = 10;
    if (filterID !== 0) {
      columnParentIDList = [];
      queryString = '';
      // defectsTypestr = '';
      // reportType = '';
      defectsDateType = '';
    }
    if (moduleId !== 4) {
      isPOSTPV = false;
      isCMF = false;
      status = '';
      statusReason = '';
      closedReason = '';
      submitType = '';
      sysDebugs = '';
      domain = '';
      priority = '';
      exposure = '';
      regression = '';
      howFound = '';
      operatingSystem = '';
      components = '';
    }
    if (platformIDList === undefined || platformIDList === [] || platformIDList === null) {
      platformIDList = [];
    }
    if (actionStr === undefined || actionStr === null) {
      actionStr = '';
    }
    if ((moduleId === 3) && defectsTypestr === undefined) {
      defectsTypestr = "''Intel Defects''";
    }
    if (moduleId !== 3) {
      defectsTypestr = '';
      programSkuID = 0;
      rvpString = '';
    }
    if (viewType === undefined || viewType === null) {
      if (moduleId === 3 || moduleId === 4) {
        viewType = 1;
      } else {
        viewType = 0;
      }
    }
    if (moduleId !== 1) {
      reportType = 'GOG';
    }
    const serviceUrl = `${environment.serviceBaseUrl}api/CommonUtility/GetCumulativeDefectsChartData`;
    return this.http.post(serviceUrl,
      ({
        FilterID: filterID,
        PlatformIDList: platformIDList,
        ColumnParentIDList: columnParentIDList,
        QueryString: queryString,
        DefectsTypestr: defectsTypestr,
        ModuleID: moduleId,
        WWCount: wWCount,
        DefectsDateType: defectsDateType,
        ViewType: viewType,
        ActionStr: actionStr,
        rvpStr: rvpString,
        ProgramSkuID: programSkuID,
        ReportType: reportType,
        ISPOSTPV: isPOSTPV,
        ISCMF: isCMF,
        Status: status,
        StatusReason: statusReason,
        ClosedReason: closedReason,
        SubmitType: submitType,
        SysDebugs: sysDebugs,
        Domain: domain,
        Priority: priority,
        Exposure: exposure,
        Regression: regression,
        HowFound: howFound,
        OperatingSystem: operatingSystem,
        Components: components,
        IsUnique: isUnique

      }),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }



  /**
   * @method GetJCDTCumulativeDefectsChartData -get the cumulative chart data
   * @param filterID number - chart data based on filterId
   * @param platformIDList string -get the selected platform list
   * @param defectsDateType string -get the which defect type it has
   */
  GetJCDTCumulativeDefectsChartData(filterID: number, platformIDList?: any, defectsType?: any,
    viewType?: number, isPOSTPV?, isCMF?, status?, statusReason?, closedReason?, submitType?,
    sysDebugs?, domain?, priority?, exposure?, regression?, howFound?, operatingSystem?,
    components?, chartType?, uniqueDefect?) {
    // if (filterID !== 0) {
    //   defectsType = '';
    // }

    if (platformIDList === undefined || platformIDList === [] || platformIDList === null) {
      platformIDList = [];
    }
    const serviceUrl = `${environment.serviceBaseUrl}api/JCDT/GetCumulativeDefectsChartData`;
    return this.http.post(serviceUrl,
      ({
        FilterID: filterID,
        PlatformIDList: platformIDList,
        DefectsType: defectsType,
        ViewType: viewType,
        ISPOSTPV: isPOSTPV,
        ISCMF: isCMF,
        Status: status,
        StatusReason: statusReason,
        ClosedReason: closedReason,
        SubmitType: submitType,
        SysDebugs: sysDebugs,
        Domain: domain,
        Priority: priority,
        Exposure: exposure,
        Regression: regression,
        HowFound: howFound,
        OperatingSystem: operatingSystem,
        Components: components,
        ChartType: chartType,
        IsUnique: uniqueDefect

      }),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }


  getOpenSightingChartOutput(filterId: number, platformIds, status, statusReason, closedReason, submitType, sysDebugs, domain, priority,
    exposure, regression, howFound, operatingSystem, components, processor) {
    const serviceUrl = `${environment.serviceBaseUrl}api/JDT/GetOpenSightingChartOutput`;
    return this.http.post(serviceUrl,
      ({
        FilterId: filterId,
        PlatformIds: platformIds,
        Status: status,
        StatusReason: statusReason,
        ClosedReason: closedReason,
        SubmitType: submitType,
        SysDebugs: sysDebugs,
        Domain: domain,
        Priority: priority,
        Exposure: exposure,
        Regression: regression,
        HowFound: howFound,
        OperatingSystem: operatingSystem,
        Components: components,
        Processor: processor

      }),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /**
   * @method getHSDESFavFilterDetails -get the favourite filter selected for HSDES
   * @param filterID number -data based on filterId
   */
  getHSDESFavFilterDetails(filterID: number, moduleId: number, uniqueDefect?, components?) {
    const serviceUrl = `${environment.serviceBaseUrl}api/CommonUtility/GetHSDESFilterByModule`;
    return this.http.post(serviceUrl,
      ({
        FilterID: filterID,
        ModuleID: moduleId,
        IsUnique: uniqueDefect,
        Components: components
      }),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /**
   * @method GetCannedComponentData -get the favourite filter selected for HSDES
   * @param filterID number -data based on filterId
   */
  getCannedComponentData(component, type, IsCMF, IsPostPV, isUnique, viewType, chartType, platformIdList) {
    const serviceUrl = `${environment.serviceBaseUrl}api/jcdt/GetCannedComponentData`;
    return this.http.post(serviceUrl,
      ({
        Component: component,
        Type: type,
        isCMF: IsCMF,
        isPostPV: IsPostPV,
        IsUnique: isUnique,
        ViewType: viewType,
        ChartType: chartType,
        PlatformIdList: platformIdList
      }),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }


  /**
   * @method GetFilters -get the favourite filter selected for HSDES
   * @param filterID number -data based on filterId
   */
  GetFilters(selectedFamily, selectedReleases, selectedMilestone, selectedStatues, selectedDomains) {
    const serviceUrl = `${environment.serviceUrl}api/Fre/GetFilters`;
    return this.http.post(serviceUrl,
      ({
        family: selectedFamily,
        releases: selectedReleases,
        milestones: selectedMilestone,
        statuses: selectedStatues,
        domains: selectedDomains

      }),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /**
   * @method GetPlatfroms -get the favourite filter selected for HSDES
   */
  GetPlatfroms() {
    const serviceUrl = `${environment.serviceUrl}api/Fre/GetPlatfroms`;
    return this.http.get(serviceUrl,
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /**
   * @method saveFilter -to save new menu filter
   * @param filterID number -get the default filterID=0 for craete new filter
   * @param actionID number -saving new filter actionId should=1
   * @param platformData string -selected platform data
   * @param filterinput string -selected filters input
   * @param defectsType string -selected defects type
   * @param filterName string -menu filter name
   * @param favourite boolean -favorite choosen from platform
   * @param isPrivate boolean -is creating filter is private
   * @param isFrequently boolean -is creating filter is Frequently used
   * @param chartType number -type of chart
   * @param isDisclaimer boolean -needs to show or not isDiscalimer text
   * @param disclaimerText string -disclaimer text to show in application
   */
  saveFilter(filterID: number, actionID: number, moduleId: number, platformData?: any, filterinput?: string, defectsType?: string,
    filterName?: string, favourite?: string, isPrivate?: boolean, isFrequently?: boolean, columnParentIDList?: any,
    chartType?: number, isDisclaimer?: boolean, disclaimerText?: string, defectsTypeStr?: string, reportType?: string) {

    const wWCount = 10;
    if (moduleId !== 1) {
      reportType = 'GOG';
    }
    const serviceUrl = `${environment.serviceBaseUrl}api/CommonUtility/SaveOrEditMenuFilterByModule`;
    return this.http.post(serviceUrl,
      ({
        FilterID: filterID,
        PlatformIDList: platformData,
        QryStr: filterinput,
        FilterName: filterName,
        ColumnParentIDList: columnParentIDList,
        WWCount: wWCount,
        DefectsDateType: defectsType,
        PlatformFavStr: favourite,
        IsPrivate: isPrivate,
        IsFrequent: isFrequently,
        ActionID: actionID,
        ChartType: chartType,
        IsDisclaimer: isDisclaimer,
        DisclaimerText: disclaimerText,
        ModuleID: moduleId,
        DefectsTypeStr: defectsTypeStr,
        ReportType: reportType
      }),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /**
   * @method getViewData -get the data for view table
   * @param filterID number -data based on filterId
   * @param platformIdList string -selected platform data
   * @param filterStr string -selected filter string
   * @param defectsType string -selected defects type
   * @param moduleId number -get the moduleId for request data
   */
  getViewData(filterID: number, moduleId: number, platformIdList: any, columnParentIDList: any, filterStr: string,
    defectsType: string, defectsTypeStr?: string): Observable<any> {
    if (moduleId !== 3 && moduleId !== 4) {
      defectsTypeStr = '';
    }
    if (filterID !== 0) {
      columnParentIDList = [];
      filterStr = '';
      defectsType = '';
      platformIdList = [];
    }
    const serviceUrl = `${environment.serviceBaseUrl}api/CommonUtility/GetViewDataByModule`;
    return this.http.post(serviceUrl,
      ({
        PlatformIDList: platformIdList,
        QueryStr: filterStr,
        FilterID: filterID,
        DefectsDateType: defectsType,
        ModuleID: moduleId,
        ColumnParentIDList: columnParentIDList,
        DefectsTypeStr: defectsTypeStr
      }),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /**
   * @method getQuarterWiseDefects -get the quterwise defects data
   */
  getQuarterWiseDefects(platformName, status, statusReason, closedReason, submitType, domain, priority,
    exposure, regression, howFound, operatingSystem, components, chartTypeFilter): Observable<any> {
    const serviceUrl = `${environment.serviceBaseUrl}api/CRD/GetDCRGraphChart`;

    return this.http.post(serviceUrl, ({
      // FilterId : filterId,
      PlatformName: platformName,
      Status: status,
      StatusReason: statusReason,
      ClosedReason: closedReason,
      SubmitType: submitType,
      Domain: domain,
      Priority: priority,
      Exposure: exposure,
      Regression: regression,
      HowFound: howFound,
      OperatingSystem: operatingSystem,
      Components: components,
      ChartType: chartTypeFilter

    }),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /**
   * @method getBugThroughPutChart -get the bugthroghput data
   */
  getBugThroughPutChart(platformName, status, statusReason, closedReason, submitType, domain, priority,
    exposure, regression, howFound, operatingSystem, components, chartTypeFilter): Observable<any> {
    const serviceUrl = `${environment.serviceBaseUrl}api/crd/GetBugThroughPutChart`;
    return this.http.post(serviceUrl, ({
      // FilterId : filterId,
      PlatformName: platformName,
      Status: status,
      StatusReason: statusReason,
      ClosedReason: closedReason,
      SubmitType: submitType,
      Domain: domain,
      Priority: priority,
      Exposure: exposure,
      Regression: regression,
      HowFound: howFound,
      OperatingSystem: operatingSystem,
      Components: components,
      ChartType: chartTypeFilter

    }),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /**
   * @method getHeaderComponent -get the header details/titles
   */
  getHeaderComponent(moduleId: number) {
    const serviceUrl = `${environment.serviceBaseUrl}api/CommonUtility/GetHeaderComponentByModule`;
    return this.http.post(serviceUrl, {
      ModuleID: moduleId
    }, {
      headers: {
        'Content-type': 'application/json'
      }
    });
  }


  /**
   * @method getHeaderComponent -get the header details/titles
   */
  getPlatformList() {
    const serviceUrl = `${environment.serviceBaseUrl}api/GenOverGen/GetPlatformList`;
    return this.http.post(serviceUrl, '', {
      headers: {
        'Content-type': 'application/json'
      }
    });
  }

  /**
   * @method getViewDataByPlatform -get the data for view table
   * @param filterID number -data based on filterId
   * @param selectedPlatformId string -selected platform id
   * @param filterStr string -selected filter string
   * @param defectsType string -selected defects type
   */
  getViewDataByPlatformwData(filterID: number, moduleId: number, platformId: any, columnParentIDList: any,
    filterStr: string, defectsType: string, defectsTypeStr?: string): Observable<any> {
    if (moduleId !== 3 && moduleId !== 4) {
      defectsTypeStr = '';
    }
    if (filterID !== 0) {
      columnParentIDList = [];
      filterStr = '';
      defectsType = '';
    }
    const serviceUrl = `${environment.serviceBaseUrl}api/CommonUtility/GetViewDataByPlatform`;
    return this.http.post(serviceUrl,
      ({
        PlatformIDList: platformId,
        QueryStr: filterStr,
        FilterID: filterID,
        DefectsDateType: defectsType,
        ModuleID: moduleId,
        ColumnParentIDList: columnParentIDList,
        DefectsTypeStr: defectsTypeStr
      }),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /**
   * @method getLastActivityUsers -get the user info details who are logged on
   */
  getLastActivityUsers(moduleID: number) {
    const serviceUrl = `${environment.serviceBaseUrl}api/CommonUtility/GetLastActivityUsersByModule`;
    return this.http.post(serviceUrl, ({
      ModuleID: moduleID
    }), {
      headers: {
        'Content-type': 'application/json'
      }
    });
  }

  /**
   * @method editUserRole -save the updated details
   * @param username name of the user
   * @param roleId roleId will give the acesss
   * @param active user status
   */
  editUserRole(moduleId: any, username: any, roleId: number, overallModuleAccess: boolean, modulePermission: any) {
    const serviceUrl = `${environment.serviceBaseUrl}api/CommonUtility/EditUserRole`;
    return this.http.post(serviceUrl, ({
      ModuleID: moduleId,
      Username: username,
      RoleID: roleId,
      ModulePermission: modulePermission,
      OverallModuleAccess: overallModuleAccess
    }), {
      headers: {
        'Content-type': 'application/json'
      }
    });
  }

  /**
   * @method getGenOverGenChartwithFavFiltersCumulativeChart -get the cumulative chart data for compare
   * @param filterID number - chart data based on filterId
   * @param moduleId number - get the module id
   * @param platformIDList string -get the selected platform list
   * @param queryString string -get the selected query string
   * @param defectsDateType string -get the which defect type it has
   * @param columnParentIDList array - get the column selected all ids
   * @param defectsTypestr string - get the defect type seleccted
   */
  getComparedCumulativeDefectsChartData(filterID: number, moduleId: number, platformIDList: any, columnParentIDList: any,
    queryString: any, defectsDateType: any, skuTypeList: any, designTypeList: any,
    defectsTypestr?: any, viewType?: number, rvpString?) {
    const wWCount = 10;
    if ((moduleId === 3 || moduleId === 4) && defectsTypestr === undefined) {
      defectsTypestr = "''Intel Defects''";
    }
    const serviceUrl = `${environment.serviceBaseUrl}api/CommonUtility/GetComparedCumulativeDefectsChartData`;
    return this.http.post(serviceUrl,
      ({
        FilterID: filterID,
        PlatformIDList: platformIDList,
        ColumnParentIDList: columnParentIDList,
        QueryString: queryString,
        DefectsTypestr: defectsTypestr,
        ModuleID: moduleId,
        WWCount: wWCount,
        DefectsDateType: defectsDateType,
        ViewType: viewType,
        SkuTypeList: skuTypeList,
        DesignTypeList: designTypeList,
        rvpStr: rvpString
      }),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /**
   * @method getComparedWeekOnWeekDefectsChartData -get the week on week chart data for compare
   * @param filterID number - chart data based on filterId
   * @param moduleId number - get the module id
   * @param platformIDList string -get the selected platform list
   * @param queryString string -get the selected query string
   * @param defectsDateType string -get the which defect type it has
   * @param columnParentIDList array - get the column selected all ids
   * @param defectsTypestr string - get the defect type seleccted
   */
  getComparedWeekOnWeekDefectsChartData(filterID: number, moduleId: number, platformIDList: any, columnParentIDList: any,
    queryString: any, defectsDateType: any, skuTypeList: any, designTypeList: any,
    defectsTypestr?: any, viewType?: number, rvpString?) {
    const wWCount = 10;
    if ((moduleId === 3 || moduleId === 4) && defectsTypestr === undefined) {
      defectsTypestr = "''Intel Defects''";
    }
    const serviceUrl = `${environment.serviceBaseUrl}api/CommonUtility/GetComparedWeekOnWeekDefectsChartData`;
    return this.http.post(serviceUrl,
      ({
        FilterID: filterID,
        PlatformIDList: platformIDList,
        ColumnParentIDList: columnParentIDList,
        QueryString: queryString,
        DefectsTypestr: defectsTypestr,
        ModuleID: moduleId,
        WWCount: wWCount,
        DefectsDateType: defectsDateType,
        ViewType: viewType,
        SkuTypeList: skuTypeList,
        DesignTypeList: designTypeList,
        rvpStr: rvpString
      }),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /**
   * @method getPlatformSightingsData -get the plaform sighting defects data
   */
  getPlatformSightingsData(platformId): Observable<any> {
    const serviceUrl = `${environment.serviceBaseUrl}api/CommonUtility/GetOpenSightingExcelDownloadData`;
    return this.http.post(serviceUrl, ({
      PlatformID: platformId
    }),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /* FRE Indicator API's  */
  getFREIndicatorChart(release, milestone, status, domain, freFamily): Observable<any> {
    const serviceUrl = `${environment.serviceUrl}api/Fre/GetSCurveChartDetails`;
    return this.http.post(serviceUrl,
      ({
        releases: release,
        milestones: milestone,
        statuses: status,
        domains: domain,
        family: freFamily
      }),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /* FRE Indicator API's  */
  getDataByDomain(release, milestone, status, domain, freFamily): Observable<any> {
    const serviceUrl = `${environment.serviceUrl}api/Fre/GetDomainChartDetails`;
    return this.http.post(serviceUrl, ({
      releases: release,
      milestones: milestone,
      statuses: status,
      domains: domain,
      family: freFamily

    }),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /* FRE Domain Summary  */
  getDomainSummary(release, milestone, status, domain): Observable<any> {
    const serviceUrl = `${environment.serviceBaseUrl}api/FRE/GetDomaintableData`;
    return this.http.post(serviceUrl, ({
      Release: release,
      Milestone: milestone,
      Status: status,
      Domain: domain
    }),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /* FRE Indicator API's  */
  getOrphanData(platformName, TableType): Observable<any> {
    const serviceUrl = `${environment.serviceBaseUrl}api/FRE/GetOrphanData`;
    return this.http.post(serviceUrl, ({
      PlatformName: platformName,
      TableType: TableType
    }),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /* FRE Indicator API's  */
  getIntegrationEvents(release, iscount, domain, freFamily): Observable<any> {
    const serviceUrl = `${environment.serviceUrl}api/Fre/BlockedIEcount`;
    return this.http.post(serviceUrl, ({
      releases: release,
      /* IsCount: iscount, */
      domains: domain,
      family: freFamily
    }),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /* FRE Indicator API's  */
  getBlockedFREvents(release, iscount, domain, freFamily): Observable<any> {
    const serviceUrl = `${environment.serviceUrl}api/Fre/GetIntegrationEventData`;
    return this.http.post(serviceUrl, ({
      releases: release,
      /* IsCount: iscount, */
      domains: domain,
      family: freFamily
    }),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /* get platform list */
  getPlatform(): Observable<any> {
    const serviceUrl = `${environment.baseURL}api/SIVDebug/GetPlatform`;
    return this.http.post(serviceUrl,
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

   /* get Vendor list */
   getVendor(): Observable<any> {
    const serviceUrl = `${environment.baseURL}api/SIVDebug/VedorDetails`;
    return this.http.post(serviceUrl,
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }
  /* get download list */
  getDownloadData(data): Observable<any> {
    const serviceUrl = `${environment.baseURL}api/SIVDebug/GetDCRdownload`;
    return this.http.post(serviceUrl, (data),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }
  /* get group domain list */
  getGroupDomain(): Observable<any> {
    const serviceUrl = `${environment.baseURL}api/SIVDebug/GetGroupDomain`;
    return this.http.post(serviceUrl,
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /* get triage accuracy list */
  getTraiageAccuracy(ChartType): Observable<any> {
    const serviceUrl = `${environment.baseURL}api/SIVDebug/GetTriagedata`;
    return this.http.post(serviceUrl, ({
      ChartType: ChartType,
    }),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /* get triage accuracy list */
  getTraiageAccuracywithGroupDomain(data): Observable<any> {
    const serviceUrl = `${environment.baseURL}api/SIVDebug/GroupWiseDomainData`;
    return this.http.post(serviceUrl, (data),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /* get triageLatency data */
  getTraiageAccuracywithGroupDomainDownload(data): Observable<any> {
    const serviceUrl = ` ${environment.baseURL}api/SIVDebug/TraiageAccuracyDownload`;
    return this.http.post(serviceUrl, (data),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /* get ComponentDetails list */
  getComponentDetails(data): Observable<any> {
    const serviceUrl = `${environment.baseURL}api/SIVDebug/ComponentDetails`;
    return this.http.post(serviceUrl, (data),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /* get DSI data */
  getDSIData(data): Observable<any> {
    const serviceUrl = `${environment.baseURL}api/SIVDebug/GetDCRdata`;
    return this.http.post(serviceUrl, (data),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /* get opensightingsbyexposure data */
  getopensightingsbyexposure(data): Observable<any> {
    const serviceUrl = `${environment.baseURL}api/SIVDebug/Opensightingexposure`;
    return this.http.post(serviceUrl, (data),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /* get opensightingsbyexposure data */
  getopensightingageingdistribution(data): Observable<any> {
    const serviceUrl = `${environment.baseURL}api/SIVDebug/opensightingageingdistribution`;
    return this.http.post(serviceUrl, (data),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /* get Bug Through Put */
  getBugThroughPut(data): Observable<any> {
    const serviceUrl = `${environment.baseURL}api/SIVDebug/Bugthroughput`;
    return this.http.post(serviceUrl, (data),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /* get Bug Through Put */
  getSIVBugThroughPut(data): Observable<any> {
    const serviceUrl = `${environment.baseURL}api/SIVDebug/SIVBugthroughput`;
    return this.http.post(serviceUrl, (data),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /* get BugAssistAdoptionPercent */
  getBugAssistAdoptionPercent(data): Observable<any> {
    const serviceUrl = `${environment.baseURL}api/SIVDebug/BugAssistAdoptionPercent`;
    return this.http.post(serviceUrl, (data),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /* get BugAssistWatcherAdoption */
  getBugAssistWatcherAdoption(data): Observable<any> {
    const serviceUrl = `${environment.baseURL}api/SIVDebug/BugAssistWatcherAdoption`;
    return this.http.post(serviceUrl, (data),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /* get milestone blockers */
  getMilestoneBlockers(data): Observable<any> {
    const serviceUrl = `${environment.baseURL}api/SIVDebug/GetMileStoneBlockers`;
    return this.http.post(serviceUrl, (data),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /* get milestone blockers download data */
  getMilestoneBlockersDownloadData(data): Observable<any> {
    const serviceUrl = `${environment.baseURL}api/SIVDebug/GetMileStoneBlockers`;
    return this.http.post(serviceUrl, (data),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /* get defect ageing data */
  getDefectAgeing(data): Observable<any> {
    const serviceUrl = `${environment.baseURL}api/SIVDebug/DefectAgeing`;
    return this.http.post(serviceUrl, (data),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

   /* get triageLatency data */
   getDefectAgeingDownload(data): Observable<any> {
    const serviceUrl = ` ${environment.baseURL}api/SIVDebug/DefectAgeingDownload`;
    return this.http.post(serviceUrl, (data),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /* get break up metrics data */
  getBreakUpMetrics(data): Observable<any> {
    const serviceUrl = ` ${environment.baseURL}api/SIVDebug/Breakupofdaysmetrics`;
    return this.http.post(serviceUrl, (data),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /* get StateTransaction data */
  StateTransaction(data): Observable<any> {
    const serviceUrl = ` ${environment.baseURL}api/SIVDebug/StateTransaction`;
    return this.http.post(serviceUrl, (data),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }


  /* get triageLatency data */
  getTriageLatency(data): Observable<any> {
    const serviceUrl = ` ${environment.baseURL}api/SIVDebug/TriageLatency`;
    return this.http.post(serviceUrl, (data),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }
  /* get triageLatency data */
  getTriageLatencyDownload(data): Observable<any> {
    const serviceUrl = ` ${environment.baseURL}api/SIVDebug/Triagelatencydownload`;
    return this.http.post(serviceUrl, (data),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /* get HSD data */
  getHSD(data): Observable<any> {
    const serviceUrl = ` ${environment.baseURL}api/SIVDebug/HSDPromote`;
    return this.http.post(serviceUrl, (data),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }


  /* get Gen Internal Sightings data */
  getGenInternalSightings(data): Observable<any> {
    const serviceUrl = `${environment.baseURL}api/SIVDebug/GenoverGenSightingData`;
    return this.http.post(serviceUrl, (data),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /* get Gen customer Sightings data */
  getGenCustomerSightings(data): Observable<any> {
    const serviceUrl = ` ${environment.baseURL}api/SIVDebug/GenoverGenCustomerfix`;
    return this.http.post(serviceUrl, (data),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /* get domain name list */
  getDaomainName(): Observable<any> {
    const serviceUrl = ` ${environment.baseURL}api/SIVDebug/GetDaomainName`;
    return this.http.post(serviceUrl,
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /* get user view details */
  getUserviewDetails(UserName, ChartName) {
    const serviceUrl = ` ${environment.baseURL}api/SIVDebug/UserviewDetails`;
    return this.http.post(serviceUrl, ({
      UserName: UserName,
      ChartName: ChartName
    }),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /* Get GroupDomain TraigeAccuracy */
  GetGroupDomainTraigeAccuracy(Platform, Exposure, SKUIDcombination): Observable<any> {
    const serviceUrl = `${environment.baseURL}api/SIVDebug/GetGroupDomainTraigeAccuracy`;
    return this.http.post(serviceUrl, ({
      Platform: Platform,
      Exposure: Exposure,
      SKUIDcombination: SKUIDcombination
    }),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /* Get GroupDomain DCR */
  GetGroupDomainDCR(Platform, Exposure, SKUIDcombination): Observable<any> {
    const serviceUrl = ` ${environment.baseURL}api/SIVDebug/GetDCRDomainwisedata`;
    return this.http.post(serviceUrl, ({
      Platform: Platform,
      Exposure: Exposure,
      SKUIDcombination: SKUIDcombination
    }),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /* Get GroupDomain DCR */
  GetGroupDomainBreakup(Platform, Exposure, SKUIDcombination, groupDomain): Observable<any> {
    const serviceUrl = ` ${environment.baseURL}api/SIVDebug/GroupDomainMetrics`;
    return this.http.post(serviceUrl, ({
      Platform: Platform,
      Exposure: Exposure,
      SKUIDcombination: SKUIDcombination,
      DomainName: groupDomain
    }),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /* Get HSDES link */
  getHSDESLink(): Observable<any> {
    const serviceUrl = `${environment.baseURL}api/SIVDebug/QueryIDDetails`;
    return this.http.post(serviceUrl,
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /* Get user view details */
  getUserViewDetails(): Observable<any> {
    const serviceUrl = `${environment.baseURL}api/SIVDebug/GetUserViewDetails`;
    return this.http.post(serviceUrl,
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }


  /* Get GroupDomain Defect ageing */
  GetGroupDomainDefectAgeing(Platform, Exposure, IsNonIntelDefects, SKUIDcombination, groupDomain): Observable<any> {
    const serviceUrl = ` ${environment.baseURL}api/SIVDebug/DefectAgingcomparison`;
    return this.http.post(serviceUrl, ({
      Platform: Platform,
      Exposure: Exposure,
      IsNonIntelDefects: IsNonIntelDefects,
      SKUIDcombination: SKUIDcombination,
      GroupName: groupDomain
    }),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }


  /* group Domain Config API's  */
  getGroupDomainConfig(flag): Observable<any> {
    const serviceUrl = `${environment.baseURL}api/SIVDebug/GroupDomainConfig`;
    return this.http.post(serviceUrl, ({
      flag: flag,
    }),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /* save group Domain Config API's  */
  saveGroupDomainConfig(flag, DomainName, COEGroup): Observable<any> {
    const serviceUrl = `${environment.baseURL}api/SIVDebug/GroupDomainConfig`;
    return this.http.post(serviceUrl, ({
      flag: flag,
      DomainName: DomainName,
      COEGroup: COEGroup

    }),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /* get release data  */
  getReleaseData(): Observable<any> {
    const serviceUrl = ` ${environment.baseURL}api/SIVDebug/Getversion`;
    return this.http.post(serviceUrl,
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /* get menu data  */
  getMenuData(): Observable<any> {
    const serviceUrl = `${environment.baseURL}api/SIVDebug/GetMenu`;
    return this.http.post(serviceUrl,
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

  /* get user info  */
  getUserInfo(user): Observable<any> {
    const serviceUrl = ` ${environment.baseURL}api/SIVDebug/GetUserDetails`;
    return this.http.post(serviceUrl, ({
      username: user,
    }),
      {
        headers: {
          'Content-type': 'application/json'
        }
      });
  }

}
