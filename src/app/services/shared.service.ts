import { Injectable, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private titleSource = new BehaviorSubject<string>('');
  currentTitle = this.titleSource.asObservable();

  @Output() fire: EventEmitter<any> = new EventEmitter();

  constructor() {
    this.fire.emit(true);
  }
  /** get the latest title updated */
  changeTitle(title: string) {
    this.titleSource.next(title);
  }


  private openfilter = new BehaviorSubject<boolean>(false);
  statusOpenfilter = this.openfilter.asObservable();

  private filterId = new BehaviorSubject<number>(undefined);
  currentfilterId = this.filterId.asObservable();

  private filterByChart = new BehaviorSubject<number>(1);
  CurrentChartType = this.filterByChart.asObservable();

  private leftNavigationfilterMenuStatus = new BehaviorSubject<boolean>(false);
  leftNavfilter1 = this.leftNavigationfilterMenuStatus.asObservable();

  private editFilterData = new BehaviorSubject<any>(null);
  editFilterData1 = this.editFilterData.asObservable();

  private moduleData = new BehaviorSubject<any>(null);
  getModuleInfo = this.moduleData.asObservable();

  private legend = new BehaviorSubject<any>([]);
  getLegend = this.legend.asObservable();

  private defectTypeString = new BehaviorSubject<string>('Intel Defects');
  currentDefectTypeString = this.defectTypeString.asObservable();

  private viewType = new BehaviorSubject<number>(1);
  getViewType = this.viewType.asObservable();

  private platfromList = new BehaviorSubject<any>([]);
  getPlatfromList = this.platfromList.asObservable();

  private chartString = new BehaviorSubject<string>('');
  getChartString = this.chartString.asObservable();

  private defectString = new BehaviorSubject<string>('1');
  getDefectString = this.defectString.asObservable();

  private programSkuId = new BehaviorSubject<number>(0);
  getProgramSkuId = this.programSkuId.asObservable();

  private userObject = new BehaviorSubject<any>(null);
  getUserObject = this.userObject.asObservable();

  private reportType = new BehaviorSubject<string>('GOG');
  getReportType = this.reportType.asObservable();

  private megaIndicatorModuleChart = new BehaviorSubject<string>('crd');
  getMegaIndicatorModuleChart = this.megaIndicatorModuleChart.asObservable();

  private megaIndicatorModuleChartFilter = new BehaviorSubject<string>('year');
  getMegaIndicatorModuleChartFilter = this.megaIndicatorModuleChartFilter.asObservable();

  private HSDESFilterList = new BehaviorSubject<any>(null);
  getHSDESFilterList = this.HSDESFilterList.asObservable();

  private cmfEnableInJCDT = new BehaviorSubject<boolean>(false);
  getCMFEnableInJCDT = this.cmfEnableInJCDT.asObservable();

  private postPVEnableInJCDT = new BehaviorSubject<boolean>(false);
  getpostPVEnableInJCDT = this.postPVEnableInJCDT.asObservable();

  private uniqueEnableInJCDT = new BehaviorSubject<boolean>(false);
  getUniqueEnableInJCDT = this.uniqueEnableInJCDT.asObservable();

  private isDefect = new BehaviorSubject<boolean>(false);
  getIsDefect = this.isDefect.asObservable();

  private isJDTDefect = new BehaviorSubject<boolean>(true);
  getIsJDTDefect = this.isJDTDefect.asObservable();

  private jcdtComponent = new BehaviorSubject<any>('');
  getJCDTComponent = this.jcdtComponent.asObservable();

  private chartData = new BehaviorSubject<any>(null);
  getChartData = this.chartData.asObservable();

  private disclaimerText = new BehaviorSubject<any>('');
  getJCDTDisclaimerText = this.disclaimerText.asObservable();

  private modalOpen = new BehaviorSubject<boolean>(false);
  getModalOpen = this.modalOpen.asObservable();


  /** side navigation or filters open status */
  changeopenfilter(status: boolean) {
    this.openfilter.next(status);
  }

  /** loading/buffer image status */
  change(value) {
    // console.log('change started');
    this.fire.emit(value);
  }

  /** get the loading/buffer status */
  getEmittedValue() {
    return this.fire;
  }

  /** get the latest filterId */
  setFavfilterId(filterId: number) {
    this.filterId.next(filterId);
  }

  /** get the latest chartType */
  setChartType(chartType: number) {
    this.filterByChart.next(chartType);
  }

  /** get the latest menu filter from the left navigation */
  setLeftNavfilter(status: boolean) {
    return this.leftNavigationfilterMenuStatus.next(status);
  }

  /** get the entire object of filter menu */
  setEditFilterData(filterMenuObject: any) {
    return this.editFilterData.next(filterMenuObject);
  }

  /** setting the chart lengend */
  setLegend(legendObject: any) {
    return this.legend.next(legendObject);
  }

  /** setting the chart lengend */
  setModuleInfo(moduleData: any) {
    return this.moduleData.next(moduleData);
  }

  setDefectTypeString(defectType: string) {
    return this.defectTypeString.next(defectType);
  }

  setViewType(viewType: number) {
    return this.viewType.next(viewType);
  }

  setCurrentPlatform(platfromlist: any) {
    return this.platfromList.next(platfromlist);
  }

  setChartString(chartString: any) {
    return this.chartString.next(chartString);
  }

  setDefectString(defectString: any) {
    return this.defectString.next(defectString);
  }

  setProgramSkuId(skuId: number) {
    return this.programSkuId.next(skuId);
  }

  setUserObject(userObject: any) {
    return this.userObject.next(userObject);
  }

  setReportType(reportType: string) {
    return this.reportType.next(reportType);
  }

  setMegaIndicatorModuleChart(megaIndicatorModuleChart: string) {
    return this.megaIndicatorModuleChart.next(megaIndicatorModuleChart);
  }

  setMegaIndicatorModuleChartFilter(megaIndicatorModuleChartFilter: string) {
    return this.megaIndicatorModuleChartFilter.next(megaIndicatorModuleChartFilter);
  }

  /** get the entire object of filter menu */
  setHSDESFilterList(HSDESFilterList: any) {
    return this.HSDESFilterList.next(HSDESFilterList);
  }

  setCMFEnableInJCDT(cmfEnable: boolean) {
    return this.cmfEnableInJCDT.next(cmfEnable);
  }

  setpostPVEnableInJCDT(postPVEnable: boolean) {
    return this.postPVEnableInJCDT.next(postPVEnable);
  }

  setUniqueEnableInJCDT(uniqueEnable: boolean) {
    return this.uniqueEnableInJCDT.next(uniqueEnable);
  }

  setJCDTComponent(jcdtComponent: string) {
    return this.jcdtComponent.next(jcdtComponent);
  }
  setIsDefect(IsDefect: boolean) {
    return this.isDefect.next(IsDefect);
  }

  setChartData(chartData: any) {
    return this.chartData.next(chartData);
  }

  setJCDTDisclaimerText(disclaimerText: any) {
    return this.disclaimerText.next(disclaimerText);
  }

  setModalOpen(modalOpen: boolean) {
    return this.modalOpen.next(modalOpen);
  }

  setIsJDTDefect(IsJDTDefect: boolean) {
    return this.isJDTDefect.next(IsJDTDefect);
  }


}
