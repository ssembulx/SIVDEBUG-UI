import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';

import { ChartInfo } from '../../shared/models/chart-info';
import { breakupMetrics } from "../../const/index";

import * as svcs from '../../services';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4themes_dark from '@amcharts/amcharts4/themes/dark';
import { List } from '@amcharts/amcharts4/core';
import { NULL_EXPR } from '@angular/compiler/src/output/output_ast';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";
import { FormControl } from '@angular/forms';

import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { ReplaySubject, Subject } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { CollectionViewer, SelectionChange, SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs';
import { HelperService } from '../../shared/services/helper.service';
import { AccountModel } from 'src/app/models/account.model';
/**
 * Node for game
 */
export class GameNode {
  children: BehaviorSubject<GameNode[]>;
  constructor(public item: string, children?: GameNode[]) {
    this.children = new BehaviorSubject(children === undefined ? [] : children);
  }
}

/**
 * The list of games
 */
let TREE_DATA = [
  new GameNode('Simulation', [
    new GameNode('Factorio'),
    new GameNode('Oxygen not included'),
  ]),
  new GameNode('Indie', [
    new GameNode(`Don't Starve`, [
      new GameNode(`Region of Giants`),
      new GameNode(`Together`),
      new GameNode(`Shipwrecked`)
    ]),
    new GameNode('Terraria'),
    new GameNode('Starbound'),
    new GameNode('Dungeon of the Endless')
  ]),
  new GameNode('Action', [
    new GameNode('Overcooked')
  ]),
  new GameNode('Strategy', [
    new GameNode('Rise to ruins')
  ]),
  new GameNode('RPG', [
    new GameNode('Magicka', [
      new GameNode('Magicka 1'),
      new GameNode('Magicka 2')
    ])
  ])
];
/**
 * @title Tree with checklist
 */
@Component({
  selector: 'cqi-statetransaction',
  templateUrl: './statetransaction.component.html',
  styleUrls: ['./statetransaction.component.css']
})
export class StatetransactionComponent implements OnInit {



  triageAccuracyData: any;
  duration = "Year";
  loader: boolean = true;
  chartView: boolean = false;
  noDataFound: boolean = false;
  fullScreenFlag = false;
  fullScreenFlagComp = false;
  protected _onDestroy = new Subject<void>();
  selectedValToggleGroup: any;
  constructor(private changeDetectorRef: ChangeDetectorRef, private router: Router, private service: DashboardService, private dataSvc: svcs.GenOverGenDataService, private dataShare: svcs.SharedService, private _snackBar: MatSnackBar, private modalService: NgbModal, private spinner: NgxSpinnerService, private helper: HelperService) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<GameNode>(
      this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.getGroupDomainData();
    this.dataSource.data = TREE_DATA;

    /* platform start */
    this.treeFlattenerPlatform = new MatTreeFlattener(this.transformerPlatform, this.getLevelPlatform,
      this.isExpandablePlatform, this.getChildrenPlatform);
    this.treeControlPlatform = new FlatTreeControl<GameNode>(
      this.getLevelPlatform, this.isExpandablePlatform);
    this.dataSourcePlatform = new MatTreeFlatDataSource(this.treeControlPlatform, this.treeFlattenerPlatform);
    this.dataSourcePlatform = new MatTreeFlatDataSource(this.treeControlPlatform, this.treeFlattenerPlatform);
    this.getPlatformData();
    this.dataSourcePlatform.data = TREE_DATA;
    /* platform end */
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
  }
  //userInfo: AccountModel;
  ngOnInit(): void {
    this.helper.GetUser().subscribe(user => {
      if (user != null) {
        //this.userInfo = user;
        this.dataSvc.getUserviewDetails(user.idsid, 'Breakup of days metrics').subscribe(res => {
          if (res) {
          }
        });
      }
    });
    this.dataShare.changeTitle("Domain Specific Indicator");
    this.triageAccuracyData = breakupMetrics;
    this.spinner.show();
    this.chartView = false;
    this.noDataFound = false;
    // this.getDSI("Year", "Group Domain", "Platform", "Exposure");
    // this.getGroupDomainData();
    // this.getPlatformData();
    this.getGroupDomainConfig();
    //this.GetGroupDomainTraigeAccuracy(this.selected, this.selectedExposure);
    // listen for search field value changes
    this.bankMultiFilterCtrl.valueChanges
      .subscribe(() => {
        this.filterBanksMulti();
      });
    // listen for search field value changes
    this.exposureFilterCtrl.valueChanges
      .subscribe(() => {
        this.filterExposureMulti();
      });
    this.selectedValToggleGroup = 'All';
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  /* get full screen view */
  getfullScreen() {
    this.fullScreenFlag = !this.fullScreenFlag;
  }
  /* get full screen view end*/

  /* get full screen view */
  getfullScreenComp() {
    this.fullScreenFlagComp = !this.fullScreenFlagComp;
  }
  /* get full screen view end*/

  /* get all platform for dropdown*/
  platformslist;
  selected = "Platform";
  selectedExposure = "Exposure"
  exposerList; tempList; tempListExposure;
  preSelected = [];
  selectedTXT;
  getPlatformData() {
    this.dataSvc.getPlatform().subscribe(res => {
      if (res) {
        this.platformslist = res.platformslist;
        this.platformslist.unshift({ "platformName": "Platform Select/Deselect All" });
        this.platformslist.forEach(element => {
          this.preSelected.push(element.platformName);
        });
        let arrData = JSON.parse(JSON.stringify(this.preSelected));
        arrData.forEach((d, index) => {
          if (d == "Platform Select/Deselect All") {
            arrData.splice(index, 1);
          }
        });
        this.selected = arrData.join(',');
        this.selectedTXT = this.selected;
        this.allSelected = false;
        this.getDSI("Year", "Group Domain", "SKU", this.selected, "Exposure", "All");
        //   this.GetGroupDomainTraigeAccuracy(this.selected, this.selectedExposure, "SKU", "Group Domain");
        this.tempList = res.platformslist;
        // this.dataShare.changeplatformList(res.platformslist)
        this.exposerList = res.exploserfilterlists;
        this.exposerList.unshift({ "exposure": "All Exposure" });
        this.tempListExposure = this.exposerList;
      }
    });
  }
  /* get all platform for dropdown end */

  /* get all group domain for dropdown */
  groupDomainList;
  selectedGroupDomain = "Group Domain";
  getGroupDomainData() {
    this.dataSvc.getGroupDomain().subscribe(res => {
      if (res) {
        this.groupDomainList = res.domainlist;
        TREE_DATA = [];
        this.groupDomainList.forEach((d, index) => {

          let tempSubDomain = [];
          d.coeGroupList.forEach((data, index) => {
            tempSubDomain.push(new GameNode(data.domainName));
          });
          TREE_DATA.push(new GameNode(d.coeGroup, tempSubDomain));
        });
        this.dataSource.data = TREE_DATA;
      }
    });
  }
  /* get all group domain for dropdown end */

  /* call non intel defects */
  public onValChangeToggleGroup(val) {
    this.selectedValToggleGroup = val;
    // this.getDSI(this.duration, this.selectedGroupDomain, this.selectedSKUID, this.selected, this.selectedExposure, this.selectedValToggleGroup, this.temp);
    // this.GetGroupDomainTraigeAccuracy(this.selected, this.selectedExposure, this.selectedValToggleGroup, this.selectedSKUID, this.selectedGroupDomain);
  }

  /* get BreakUpMetrics chart data */
  getDcrDetailsList;
  ChartType = "Year"
  dcrInformation;
  isDomainGroup = true;
  isPlatform = true;
  getDSI(duration?: string, groupDomain?: string, SKUIDcombination?: string, platform?: string, exposure?: String, selectedToggleGroup?: String) {
    this.spinner.show();
    this.chartView = false;
    this.noDataFound = false;
    if (groupDomain == "Group Domain") {
      groupDomain = "";
    }
    if (platform == "Platform") {
      platform = "";
    }
    if (exposure == 'Exposure') {
      exposure = '';
    }
    if (SKUIDcombination == 'SKU') {
      SKUIDcombination = '';
    }
    let data = {
      "Charttype": duration,
      "GroupName": groupDomain,
      "Platform": platform,
      "Exposure": exposure,
      "SKUIDcombination": SKUIDcombination,
      "Type": selectedToggleGroup
    }
    this.dataSvc.StateTransaction(data).subscribe(res => {
      if (res) {
        this.getDcrDetailsList = res.st_details;

        // this.dcrInformation = res.breakupMetricsInfo;
        if (this.getDcrDetailsList == null) {
          this.spinner.hide();
          this.chartView = false;
          this.noDataFound = true;
        } else {
          this.noDataFound = false;
          //  this.spinner.hide();
          this.chartView = true;
          /* this.renderChart(); */
          this.renderBreakUpMetrics();
        }
      }
    });



  }
  /* get BreakUpMetrics chart data end*/

  /* apply filter  */
  applyFilter() {
    this.chartView = true;
    this.getDSI(this.duration, this.selectedGroupDomain, this.selectedSKUID, this.selected, this.selectedExposure, this.selectedValToggleGroup);
    // this.GetGroupDomainTraigeAccuracy(this.selected, this.selectedExposure, this.selectedSKUID, this.selectedGroupDomain);
  }

  /* reset filter  */
  resetFilter() {
    // save current route first
    const currentRoute = this.router.url;

    //  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.router.navigateByUrl(currentRoute); // navigate to same route
    // });
  }

  /* render BreakUpMetrics chart */
  renderBreakUpMetrics() {
    this.spinner.hide();
    this.chartView = true;
    this.noDataFound = false;

    /* Chart code */
    // Themes begin
    am4core.useTheme(am4themes_animated);
    am4core.options.autoSetClassName = true;
    am4core.options.commercialLicense = true;
    // Themes end

    let chart = am4core.create('chartdiv', am4charts.XYChart)
    //chart.colors.step = 2;
    chart.colors.list = [
      am4core.color("#c6c6c6"),
      am4core.color("#ffd688"),
      am4core.color("#aac6e7"),
      am4core.color("#aace9a"),
      /* am4core.color("#FFC75F"), */
      am4core.color("#F9F871"),
      am4core.color("#8D6E63"),
      am4core.color("#FF5722"),
      am4core.color("#43A047"),
      am4core.color("#C0CA33"),
      am4core.color("#26A69A"),
    ];

    let xAxis = chart.xAxes.push(new am4charts.CategoryAxis())
    xAxis.dataFields.category = "wYear";
    xAxis.renderer.grid.template.location = 0;
    xAxis.title.text = "[bold]" + this.duration;
    xAxis.renderer.minGridDistance = 20;
    xAxis.renderer.labels.template.rotation = 290;
    xAxis.renderer.labels.template.fill = am4core.color("#000000");
    let label = xAxis.renderer.labels.template;
    label.truncate = true;
    label.maxWidth = 120;
    label.tooltipText = "{category}";
    label.fontSize = 12;
    let start;
    let end;
    let datalength = this.getDcrDetailsList.length;
    if (this.duration == 'Quarter') {
      if (datalength > 4) {
        end = this.getDcrDetailsList[datalength - 1].chartType;
        start = this.getDcrDetailsList[datalength - 4].chartType;
      }
      chart.events.on("ready", function () {
        if (datalength > 4) {
          xAxis.zoomToCategories(start, end);
        }
      });
    }
    if (this.duration == 'Week') {
      if (datalength > 4) {
        end = this.getDcrDetailsList[datalength - 1].chartType;
        start = this.getDcrDetailsList[datalength - 4].chartType;
      }
      chart.events.on("ready", function () {
        if (datalength > 4) {
          xAxis.zoomToCategories(start, end);
        }
      });
    }
    if (this.duration == 'Platform') {
      if (datalength > 4) {
        end = this.getDcrDetailsList[datalength - 1].chartType;
        start = this.getDcrDetailsList[datalength - 4].chartType;
      }
      chart.events.on("ready", function () {
        if (datalength > 4) {
          xAxis.zoomToCategories(start, end);
        }
      });
    }

    let yAxis = chart.yAxes.push(new am4charts.ValueAxis());
    yAxis.min = 0;
    yAxis.title.text = "[bold] Days";

    /*   function createSeries(value, name) {
        let series = chart.series.push(new am4charts.ColumnSeries())
        series.dataFields.valueY = value
        series.dataFields.categoryX = 'chartType'
        series.name = name
        series.tooltipText = "[bold]{name}[/]\n[font-size:14px]{categoryX}: {valueY}";
        series.events.on("hidden", arrangeColumns);
        series.events.on("shown", arrangeColumns);
  
        let bullet = series.bullets.push(new am4charts.LabelBullet())
        bullet.interactionsEnabled = false
        bullet.dy = 20;
        bullet.label.text = "{valueY.formatNumber('#.a')}";
        bullet.label.fill = am4core.color('#000000')
  
        return series;
      } */

    // Create series
    function createSeries(field, name, percentage, tooltiptxt) {

      // Set up series
      var series = chart.series.push(new am4charts.ColumnSeries());
      // series.dataFields.value = percentage;
      series.name = name;
      series.dataFields.valueY = field;
      series.dataFields.categoryX = "wYear";
      // series.dataFields.customValue = tooltiptxt;
      series.sequencedInterpolation = true;
      // Make it stacked
      series.stacked = true;
      // series.tooltipText = "[font-size:14px]{name} : {valueY} [/]";
      // Configure columns
      series.columns.template.width = am4core.percent(60);
      series.columns.template.tooltipText = tooltiptxt;

      // Add label
      var labelBullet = series.bullets.push(new am4charts.LabelBullet());
      labelBullet.label.text = "{valueY.formatNumber('#.a')}";
      labelBullet.locationY = 0.5;
      labelBullet.label.hideOversized = true;

      return series;
    }

    chart.data = this.getDcrDetailsList;
    createSeries('new_to_promote', 'Open.New to Open.Promoted', 'new_to_traige_percentage', "[font-size:14px] Open.New ( {open_newDays} days, {open_newcount} HSDs) \n Open.Awaiting_triage ( {open_Awaiting_triage_Days} days, {open_Awaiting_triage_Count} HSDs) \n Open.Triage ( {open_TriageDays} days, {open_TriageCount} HSDs) \n Open.Debug ( {open_DebugDays} days, {open_DebugDays} HSDs) \n Open.Awaiting_submitter ( {open_Awaiting_SubmitterDays} days, {open_Awaiting_SubmitterCount} HSDs) \n Open.Awaiting_debug ( {open_Awaiting_debugDays} days, {open_Awaiting_debugCount} HSDs)");
    createSeries('open_promoted_to_implemented_awaiting_integration', 'Open.Promoted to Implemented.Awaiting_Integration', 'new_to_traige_percentage', "[font-size:14px] Open.Debug ( {open_DebugDays} days, {open_DebugDays} HSDs) \n Open.Awaiting_submitter ( {open_Awaiting_SubmitterDays} days, {open_Awaiting_SubmitterCount} HSDs) \n Open.Awaiting_debug ( {open_Awaiting_debugDays} days, {open_Awaiting_debugCount} HSDs) \n Open.Promoted ( {open_PromotedDays} days, {open_PromotedCount} HSDs) \n Open.awaiting_promoted ( {open_awaiting_promotedDays} days, {open_awaiting_promotedCount} HSDs) \n Implemented.Awaiting_Ingredient_release ( {implemented_Awaiting_Ingredient_releaseDays} days, {implemented_Awaiting_Ingredient_releaseCount} HSDs) \n open.verify_failed ( {open_verify_failedDays} days, {open_verify_failedCount} HSDs)");
    createSeries('implemented_awaiting_integration_to_verified', 'Implemented.Awaiting_Integration to Verified', 'new_to_traige_percentage', "[font-size:14px] Implemented.Awaiting_Integration ( {implemented_Awaiting_IntegrationDays} days, {implemented_Awaiting_IntegrationCount} HSDs) \n Implemented.Await_user_verify ( {implemented_Await_user_verifyDays} days, {implemented_Await_user_verifyCount} HSDs)");
    createSeries('verified_to_completed', 'Verified to Complete', 'new_to_traige_percentage', "[font-size:14px] Verified ( {verified_to_completed} days, {verified_to_completedCount} HSDs) \n open.verify_failed ( {open_verify_failedDays} days, {open_verify_failedCount} HSDs)");
    // createSeries('verified_to_completed', 'Verified to Complete', 'new_to_traige_percentage', "[font-size:14px] Verified : {verified_to_completed} \n open.verify_failed ( {open_verify_failedDays} days, {open_verify_failedCount} HSDs)");
    /* createSeries('newToTraige', 'New to triage', 'new_to_traige_percentage');
    createSeries('triageDays', 'Triage days', 'triage_Days_percentage');
    createSeries('traigetoimplemented', 'Triage exit to implemented', 'traige_to_implemented_percentage');
    createSeries('implementedtoverified', 'Implemented to verified', 'implemented_to_verified_percentage');
    createSeries('verifiedtoComplete', 'Verified to complete', 'verified_to_Complete_percentage'); */

    function arrangeColumns() {

      let series = chart.series.getIndex(0);

      let w = 1 - xAxis.renderer.cellStartLocation - (1 - xAxis.renderer.cellEndLocation);
      if (series.dataItems.length > 1) {
        let x0 = xAxis.getX(series.dataItems.getIndex(0), "categoryX");
        let x1 = xAxis.getX(series.dataItems.getIndex(1), "categoryX");
        let delta = ((x1 - x0) / chart.series.length) * w;
        if (am4core.isNumber(delta)) {
          let middle = chart.series.length / 2;

          let newIndex = 0;
          chart.series.each(function (series) {
            if (!series.isHidden && !series.isHiding) {
              series.dummyData = newIndex;
              newIndex++;
            }
            else {
              series.dummyData = chart.series.indexOf(series);
            }
          })
          let visibleCount = newIndex;
          let newMiddle = visibleCount / 2;

          chart.series.each(function (series) {
            let trueIndex = chart.series.indexOf(series);
            let newIndex = series.dummyData;

            let dx = (newIndex - trueIndex + middle - newMiddle) * delta

            series.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
            series.bulletsContainer.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
          })
        }
      }
    }

    function createTraigeLineSeries() {

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      /*  if (chart.yAxes.indexOf(valueAxis) != 0) {
         valueAxis.syncWithAxis = chart.yAxes.getIndex(0);
       } */
      valueAxis.min = 0;
      valueAxis.renderer.opposite = true;
      valueAxis.renderer.grid.template.disabled = true;
      valueAxis.title.text = '[bold] Average days open';
      valueAxis.renderer.labels.template.fill = am4core.color("#000000");
      valueAxis.renderer.labels.template.fontSize = 12;
      valueAxis.renderer.line.strokeOpacity = 1;
      valueAxis.renderer.line.strokeWidth = 1;
      valueAxis.renderer.line.stroke = am4core.color("#e91e63");
      valueAxis.renderer.labels.template.fill = am4core.color("#e91e63");
      /* valueAxis.renderer.minGridDistance = 30; */

      var lineSeries = chart.series.push(new am4charts.LineSeries());
      lineSeries.name = "Average days open";
      lineSeries.dataFields.valueY = "average_days_open";
      lineSeries.dataFields.categoryX = "wYear";
      lineSeries.yAxis = valueAxis;
      lineSeries.id = 'g1';
      lineSeries.stroke = am4core.color("#e91e63"); // yellow
      lineSeries.strokeWidth = 2;
      lineSeries.propertyFields.strokeDasharray = "lineDash";
      lineSeries.tooltip.label.textAlign = "middle";

      var bullet = lineSeries.bullets.push(new am4charts.Bullet());
      bullet.fill = am4core.color("#e91e63"); // tooltips grab fill from parent by default
      // bullet.tooltipText = "[#fff font-size: 15px]{name} in {categoryX}:\n[/][#fff font-size: 20px]{valueY}[/] [#fff]{additional}[/]"
      bullet.tooltipText = "[#000 font-size: 14px]{name} : [/][#000 font-size: 14px]{valueY}[/]";
      var circle = bullet.createChild(am4core.Circle);
      circle.radius = 3;
      circle.fill = am4core.color("#fff");
      circle.strokeWidth = 2;
    }
    createTraigeLineSeries();
    function createLineSeries() {
      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      /*  if (chart.yAxes.indexOf(valueAxis) != 0) {
         valueAxis.syncWithAxis = chart.yAxes.getIndex(0);
       } */
      valueAxis.min = 0;
      valueAxis.renderer.opposite = true;
      valueAxis.renderer.grid.template.disabled = true;
      valueAxis.title.text = '[bold] Defect Count';
      valueAxis.renderer.labels.template.fill = am4core.color("#000000");
      valueAxis.renderer.labels.template.fontSize = 12;
      valueAxis.renderer.minGridDistance = 20;
      valueAxis.renderer.line.strokeOpacity = 1;
      valueAxis.renderer.line.strokeWidth = 1;
      valueAxis.renderer.line.stroke = am4core.color("#2196f3");
      valueAxis.renderer.labels.template.fill = am4core.color("#2196f3");

      var lineSeriesDefects = chart.series.push(new am4charts.LineSeries());
      lineSeriesDefects.name = "Defect Count";
      lineSeriesDefects.dataFields.valueY = "sightingCount";
      lineSeriesDefects.dataFields.categoryX = "chartType";
      lineSeriesDefects.yAxis = valueAxis;
      lineSeriesDefects.id = 'g2';
      lineSeriesDefects.stroke = am4core.color("#2196f3"); //blue
      lineSeriesDefects.strokeWidth = 2;
      lineSeriesDefects.propertyFields.strokeDasharray = "lineDash";
      lineSeriesDefects.tooltip.label.textAlign = "middle";

      var bullet = lineSeriesDefects.bullets.push(new am4charts.Bullet());
      bullet.fill = am4core.color("#2196f3"); // tooltips grab fill from parent by default
      // bullet.tooltipText = "[#fff font-size: 15px]{name} in {categoryX}:\n[/][#fff font-size: 20px]{valueY}[/] [#fff]{additional}[/]"
      bullet.tooltipText = "[#000 font-size: 14px]{name} : [/][#000 font-size: 14px]{valueY}[/]";
      var circle = bullet.createChild(am4core.Circle);
      circle.radius = 3;
      circle.fill = am4core.color("#fff");
      circle.strokeWidth = 2;
    }
    //  createLineSeries();
    function createtriageDefectpercentLineSeries() {
      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      /*  if (chart.yAxes.indexOf(valueAxis) != 0) {
         valueAxis.syncWithAxis = chart.yAxes.getIndex(0);
       } */
      valueAxis.min = 0;
      valueAxis.renderer.opposite = true;
      valueAxis.renderer.grid.template.disabled = true;
      valueAxis.title.text = '[bold] % Complete HSDs with all metrics';
      valueAxis.renderer.labels.template.fill = am4core.color("#000000");
      valueAxis.renderer.labels.template.fontSize = 12;
      valueAxis.renderer.minGridDistance = 20;
      valueAxis.renderer.line.strokeOpacity = 1;
      valueAxis.renderer.line.strokeWidth = 1;
      valueAxis.renderer.line.stroke = am4core.color("#fdd400");
      valueAxis.renderer.labels.template.fill = am4core.color("#fdd400");

      var lineSeriesDefects = chart.series.push(new am4charts.LineSeries());
      lineSeriesDefects.name = "% Complete HSDs with all metrics";
      lineSeriesDefects.dataFields.valueY = "triageDefectpercent";
      lineSeriesDefects.dataFields.categoryX = "chartType";
      lineSeriesDefects.yAxis = valueAxis;
      lineSeriesDefects.id = 'g3';
      lineSeriesDefects.stroke = am4core.color("#fdd400"); //blue
      lineSeriesDefects.strokeWidth = 2;
      lineSeriesDefects.propertyFields.strokeDasharray = "lineDash";
      lineSeriesDefects.tooltip.label.textAlign = "middle";

      var bullet = lineSeriesDefects.bullets.push(new am4charts.Bullet());
      bullet.fill = am4core.color("#fdd400"); // tooltips grab fill from parent by default
      // bullet.tooltipText = "[#fff font-size: 15px]{name} in {categoryX}:\n[/][#fff font-size: 20px]{valueY}[/] [#fff]{additional}[/]"
      bullet.tooltipText = "[#000 font-size: 14px]{name} : [/][#000 font-size: 14px]{valueY}%[/]";
      var circle = bullet.createChild(am4core.Circle);
      circle.radius = 3;
      circle.fill = am4core.color("#fff");
      circle.strokeWidth = 2;
    }
    // createtriageDefectpercentLineSeries();
    /* Toggle all */
    const ToggleSeries = chart.series.push(new am4charts.LineSeries());
    ToggleSeries.dataFields.valueY = 'void'; // d.valueY;
    ToggleSeries.dataFields.categoryX = 'target'; //  d.valueX;
    ToggleSeries.strokeWidth = 3;
    ToggleSeries.stroke = am4core.color('#ff3838');
    ToggleSeries.fill = am4core.color('#ff3838');

    ToggleSeries.id = 'void'; // d.valueY;

    ToggleSeries.name = 'Toggle All'; // d.name;

    ToggleSeries.events.on('hidden', () => {
      chart.series.values.forEach(s => {
        s.hide();
      });
    });

    ToggleSeries.events.on('shown', () => {
      chart.series.values.forEach(s => {
        s.show();
      });
    });
    chart.legend = new am4charts.Legend();
    chart.legend.position = "bottom";
    chart.legend.contentAlign = "center";
    /* chart.cursor = new am4charts.XYCursor(); */

    if (this.duration == 'Week' || this.duration == 'Quarter') {
      chart.scrollbarX = new am4core.Scrollbar();
      chart.scrollbarX.parent = chart.bottomAxesContainer;
      // zoomAxis();
    }
    if (this.duration == 'Quarter') {
      chart.scrollbarX = new am4core.Scrollbar();
      chart.scrollbarX.parent = chart.bottomAxesContainer;
      // zoomAxisQuarter();
    }
    if (this.duration == 'Year') {
      chart.scrollbarX = new am4core.Scrollbar();
      chart.scrollbarX.parent = chart.bottomAxesContainer;
    }
    if (this.duration == 'Platform') {
      chart.scrollbarX = new am4core.Scrollbar();
      chart.scrollbarX.parent = chart.bottomAxesContainer;
      // zoomAxisPlatform();
    }
    function zoomAxisPlatform() {
      xAxis.start = 0.6;
      xAxis.end = 1;
      // categoryAxis.keepSelection = true;
    }
    function zoomAxisQuarter() {
      xAxis.start = 0.8;
      xAxis.end = 1;
      // categoryAxis.keepSelection = true;
    }
    function zoomAxis() {
      xAxis.start = 0.97;
      xAxis.end = 1;
      // categoryAxis.keepSelection = true;
    }

  }
  /* end render BreakUpMetrics chart */

  /* group domain comparision */
  groupDomainTraigeAccuracy;
  GetGroupDomainTraigeAccuracy(platform, exposure, SKUIDcombination, groupDomain) {
    if (this.selected == "Platform") {
      platform = "";
    }
    if (this.selectedExposure == 'Exposure') {
      exposure = '';
    }
    if (SKUIDcombination == 'SKU') {
      SKUIDcombination = '';
    }
    if (groupDomain == "Group Domain") {
      groupDomain = "";
    }
    this.dataSvc.GetGroupDomainBreakup(platform, exposure, SKUIDcombination, groupDomain).subscribe(res => {
      if (res) {
        this.groupDomainTraigeAccuracy = res.groupDomainMetricsDetails;
        if (this.groupDomainTraigeAccuracy == null) {
          this.spinner.hide();
          this.chartView = false;
          this.noDataFound = true;
        } else {
          this.noDataFound = false;
          this.spinner.hide();
          this.chartView = true;
          /* this.renderChart(); */
          this.renderComparisonDomain();
        }
      }
    });
  }

  renderComparisonDomain() {
    this.spinner.hide();
    this.chartView = true;
    this.noDataFound = false;

    /* Chart code */
    // Themes begin
    am4core.useTheme(am4themes_animated);
    am4core.options.autoSetClassName = true;
    am4core.options.commercialLicense = true;
    // Themes end

    let chart = am4core.create('chartdiv1', am4charts.XYChart)
    //chart.colors.step = 2;
    chart.colors.list = [
      am4core.color("#c6c6c6"),
      am4core.color("#ffd688"),
      am4core.color("#aac6e7"),
      am4core.color("#aace9a"),
      /* am4core.color("#FFC75F"), */
      am4core.color("#F9F871"),
      am4core.color("#8D6E63"),
      am4core.color("#FF5722"),
      am4core.color("#43A047"),
      am4core.color("#C0CA33"),
      am4core.color("#26A69A"),
    ];

    let xAxis = chart.xAxes.push(new am4charts.CategoryAxis())
    xAxis.dataFields.category = "groupName";
    xAxis.renderer.grid.template.location = 0;
    /* xAxis.title.text = "[bold]" + this.duration; */
    xAxis.renderer.minGridDistance = 20;
    /* xAxis.renderer.labels.template.rotation = 290; */
    xAxis.renderer.labels.template.fill = am4core.color("#000000");
    let label = xAxis.renderer.labels.template;
    label.wrap = true;
    /* label.truncate = true; */
    label.maxWidth = 150;
    label.tooltipText = "{category}";
    label.fontSize = 12;

    let yAxis = chart.yAxes.push(new am4charts.ValueAxis());
    yAxis.min = 0;
    yAxis.title.text = "[bold] Days";
    // Create series
    function createSeries(field, name, percentage) {

      // Set up series
      var series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.value = percentage;
      series.name = name;
      series.dataFields.valueY = field;
      series.dataFields.categoryX = "groupName";
      series.sequencedInterpolation = true;
      // Make it stacked
      series.stacked = true;

      // Configure columns
      series.columns.template.width = am4core.percent(60);
      series.columns.template.tooltipText = "[font-size:14px]{categoryX} : {valueY} [/]({value}[/]%[/])";

      // Add label
      var labelBullet = series.bullets.push(new am4charts.LabelBullet());
      labelBullet.label.text = "{valueY.formatNumber('#.a')}";
      labelBullet.locationY = 0.5;
      labelBullet.label.hideOversized = true;

      return series;
    }

    chart.data = this.groupDomainTraigeAccuracy;

    createSeries('new_To_Traige', 'New to triage', 'new_to_traige_percentage');
    createSeries('triage_Days', 'Triage days', 'triage_Days_percentage');
    createSeries('traige_to_implemented', 'Triage exit to implemented', 'traige_to_implemented_percentage');
    createSeries('implemented_to_verified', 'Implemented to verified', 'implemented_to_verified_percentage');
    createSeries('verified_to_Complete', 'Verified to complete', 'verified_to_Complete_percentage');

    function arrangeColumns() {

      let series = chart.series.getIndex(0);

      let w = 1 - xAxis.renderer.cellStartLocation - (1 - xAxis.renderer.cellEndLocation);
      if (series.dataItems.length > 1) {
        let x0 = xAxis.getX(series.dataItems.getIndex(0), "categoryX");
        let x1 = xAxis.getX(series.dataItems.getIndex(1), "categoryX");
        let delta = ((x1 - x0) / chart.series.length) * w;
        if (am4core.isNumber(delta)) {
          let middle = chart.series.length / 2;

          let newIndex = 0;
          chart.series.each(function (series) {
            if (!series.isHidden && !series.isHiding) {
              series.dummyData = newIndex;
              newIndex++;
            }
            else {
              series.dummyData = chart.series.indexOf(series);
            }
          })
          let visibleCount = newIndex;
          let newMiddle = visibleCount / 2;

          chart.series.each(function (series) {
            let trueIndex = chart.series.indexOf(series);
            let newIndex = series.dummyData;

            let dx = (newIndex - trueIndex + middle - newMiddle) * delta

            series.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
            series.bulletsContainer.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
          })
        }
      }
    }

    function createTraigeLineSeries() {

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      /*  if (chart.yAxes.indexOf(valueAxis) != 0) {
         valueAxis.syncWithAxis = chart.yAxes.getIndex(0);
       } */
      valueAxis.min = 0;
      valueAxis.renderer.opposite = true;
      valueAxis.renderer.grid.template.disabled = true;
      valueAxis.title.text = '[bold] Average days open';
      valueAxis.renderer.labels.template.fill = am4core.color("#000000");
      valueAxis.renderer.labels.template.fontSize = 12;
      valueAxis.renderer.line.strokeOpacity = 1;
      valueAxis.renderer.line.strokeWidth = 1;
      valueAxis.renderer.line.stroke = am4core.color("#e91e63");
      valueAxis.renderer.labels.template.fill = am4core.color("#e91e63");
      /* valueAxis.renderer.minGridDistance = 30; */

      var lineSeries = chart.series.push(new am4charts.LineSeries());
      lineSeries.name = "Average days open";
      lineSeries.dataFields.valueY = "average_days_open";
      lineSeries.dataFields.categoryX = "groupName";
      lineSeries.yAxis = valueAxis;
      lineSeries.id = 'g1';
      lineSeries.stroke = am4core.color("#e91e63"); // yellow
      lineSeries.strokeWidth = 2;
      lineSeries.propertyFields.strokeDasharray = "lineDash";
      lineSeries.tooltip.label.textAlign = "middle";

      var bullet = lineSeries.bullets.push(new am4charts.Bullet());
      bullet.fill = am4core.color("#e91e63"); // tooltips grab fill from parent by default
      // bullet.tooltipText = "[#fff font-size: 15px]{name} in {categoryX}:\n[/][#fff font-size: 20px]{valueY}[/] [#fff]{additional}[/]"
      bullet.tooltipText = "[#000 font-size: 14px]{name} : [/][#000 font-size: 14px]{valueY}[/]";
      var circle = bullet.createChild(am4core.Circle);
      circle.radius = 3;
      circle.fill = am4core.color("#fff");
      circle.strokeWidth = 2;
    }
    createTraigeLineSeries();
    function createLineSeries() {
      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      /*  if (chart.yAxes.indexOf(valueAxis) != 0) {
         valueAxis.syncWithAxis = chart.yAxes.getIndex(0);
       } */
      valueAxis.min = 0;
      valueAxis.renderer.opposite = true;
      valueAxis.renderer.grid.template.disabled = true;
      valueAxis.title.text = '[bold] Defect Count';
      valueAxis.renderer.labels.template.fill = am4core.color("#000000");
      valueAxis.renderer.labels.template.fontSize = 12;
      valueAxis.renderer.minGridDistance = 20;
      valueAxis.renderer.line.strokeOpacity = 1;
      valueAxis.renderer.line.strokeWidth = 1;
      valueAxis.renderer.line.stroke = am4core.color("#2196f3");
      valueAxis.renderer.labels.template.fill = am4core.color("#2196f3");

      var lineSeriesDefects = chart.series.push(new am4charts.LineSeries());
      lineSeriesDefects.name = "Defect Count";
      lineSeriesDefects.dataFields.valueY = "sightingCount";
      lineSeriesDefects.dataFields.categoryX = "groupName";
      lineSeriesDefects.yAxis = valueAxis;
      lineSeriesDefects.id = 'g2';
      lineSeriesDefects.stroke = am4core.color("#2196f3"); //blue
      lineSeriesDefects.strokeWidth = 2;
      lineSeriesDefects.propertyFields.strokeDasharray = "lineDash";
      lineSeriesDefects.tooltip.label.textAlign = "middle";

      var bullet = lineSeriesDefects.bullets.push(new am4charts.Bullet());
      bullet.fill = am4core.color("#2196f3"); // tooltips grab fill from parent by default
      // bullet.tooltipText = "[#fff font-size: 15px]{name} in {categoryX}:\n[/][#fff font-size: 20px]{valueY}[/] [#fff]{additional}[/]"
      bullet.tooltipText = "[#000 font-size: 14px]{name} : [/][#000 font-size: 14px]{valueY}[/]";
      var circle = bullet.createChild(am4core.Circle);
      circle.radius = 3;
      circle.fill = am4core.color("#fff");
      circle.strokeWidth = 2;
    }
    createLineSeries();
    /* Toggle all */
    const ToggleSeries = chart.series.push(new am4charts.LineSeries());
    ToggleSeries.dataFields.valueY = 'void'; // d.valueY;
    ToggleSeries.dataFields.categoryX = 'target'; //  d.valueX;
    ToggleSeries.strokeWidth = 3;
    ToggleSeries.stroke = am4core.color('#ff3838');
    ToggleSeries.fill = am4core.color('#ff3838');

    ToggleSeries.id = 'void'; // d.valueY;

    ToggleSeries.name = 'Toggle All'; // d.name;

    ToggleSeries.events.on('hidden', () => {
      chart.series.values.forEach(s => {
        s.hide();
      });
    });

    ToggleSeries.events.on('shown', () => {
      chart.series.values.forEach(s => {
        s.show();
      });
    });
    chart.legend = new am4charts.Legend();
    chart.legend.position = "bottom";
    chart.legend.contentAlign = "center";
    /* chart.legend.labels.template.truncate = true; */
    /* chart.legend.width = 800;
    chart.legend.labels.template.maxWidth = 150;
    chart.legend.labels.template.truncate = false;
    chart.legend.labels.template.wrap = true; */

    /*  var legendContainer = am4core.create("legenddiv", am4core.Container);
     legendContainer.width = am4core.percent(100);
     legendContainer.height = am4core.percent(100);
     chart.legend.parent = legendContainer; */
    /* chart.cursor = new am4charts.XYCursor(); */
  }
  /*  group domain comparision  */

  onPlatformValChange(value) {
    /* this.spinner.show();
    this.chartView = false; */
    this.selected = value;
    // this.getDSI(this.duration, this.selectedGroupDomain, this.selectedSKUID, this.selected, this.selectedExposure);
  }

  onGroupValChange(value) {
    /*  this.spinner.show();
     this.chartView = false; */
    this.selectedGroupDomain = value;
    // this.getDSI(this.duration, this.selectedGroupDomain, this.selectedSKUID, this.selected, this.selectedExposure);
  }

  onValChange(value) {
    /*   this.spinner.show();
      this.chartView = false; */
    this.duration = value;
    // this.getDSI(this.duration, this.selectedGroupDomain, this.selectedSKUID, this.selected, this.selectedExposure);
  }
  enableSlider: boolean = false;
  openAddGroupDetails() {
    this.enableSlider = true;
  }

  groupDomainConfig;
  getGroupDomainConfig() {
    this.dataSvc.getGroupDomainConfig(2).subscribe(res => {
      if (res) {
        this.groupDomainConfig = res.groupDomainConfig;
      }
    });
  }
  closeSlider() {
    this.enableSlider = false;
  }

  public domainName: String;
  addCOE() {
    if (this.domainName == undefined || this.domainName == "") {
      this._snackBar.open("Please Enter Domain Name", "Warning", {
        duration: 3000,
      });
    } else if (this.addCOEValue == undefined) {
      this._snackBar.open("Please Select COE Group", "Warning", {
        duration: 3000,
      });
    } else {
      this.dataSvc.saveGroupDomainConfig(1, this.domainName, this.addCOEValue).subscribe(res => {
        if (res.isSuccess) {
          this._snackBar.open("Successfully Added COE Group", "Done", {
            duration: 3000,
          });
          this.closeSlider();
          this.getGroupDomainData();
        }
      });
    }
  }

  addCOEValue;
  onAddCOEValChange(val) {
    this.addCOEValue = val;
  }

  userMetrics(val) {
    this.domainName = val;
  }

  openLg(content) {
    this.modalService.open(content, { size: 'lg' });
  }

  /* platform selection */
  @ViewChild('select') select: MatSelect;

  allSelected = true;
  platformPlaceholderTxt = "Platform";
  groupDomainPlaceholderTxt = "Group Domain";
  exposurePlaceholderTxt = "Exposure";
  selectedSKU = "SKU";
  selectedSKUID = '';
  toggleAllSelection(data) {
    this.platformPlaceholderTxt = "";
    // this.allSelected = data.checked;
    this.selected = "";
    if (this.allSelected) {
      this.select.options.forEach((item: MatOption) => {
        if (typeof item.value == "string") {
          item.select();
          if (item.selected) {
            if (this.selected == "") {
              this.selected = item.value;
            }
            else {
              this.selected = this.selected + ',' + item.value;
            }
          }
        } else if (typeof item.value == "number") {
          item.deselect();
          this.selectedSKUID = "";
        }
      });
      this.allSelected = false;
      let arrData = this.selected.split(",");
      arrData.forEach((d, index) => {
        if (d == "undefined") {
          arrData.splice(index, 1);
        }
      });
      arrData.forEach((d, index) => {
        if (d == "Platform Select/Deselect All") {
          arrData.splice(index, 1);
        }
      });
      this.selected = arrData.join(',');
      this.selectedTXT = this.selected;
      this.platformPlaceholderTxt = arrData.join(',');
      //  this.getDSI(this.duration, this.selectedGroupDomain, this.selectedSKUID, this.selected, this.selectedExposure);
      //  this.GetGroupDomainTraigeAccuracy(this.selected, this.selectedExposure, this.selectedSKUID, this.selectedGroupDomain);
    } else {
      this.platformPlaceholderTxt = "Platform";
      this.selected = "Platform";
      this.selectedTXT = "Platform";
      this.select.options.forEach((item: MatOption) => item.deselect());
      this.allSelected = true;
      // this.getDSI(this.duration, this.selectedGroupDomain, this.selectedSKUID, this.selected, this.selectedExposure);
      //this.GetGroupDomainTraigeAccuracy(this.selected, this.selectedExposure, this.selectedSKUID, this.selectedGroupDomain);
    }
  }

  optionClick(option, data, id) {
    if (option == 'platform') {
      this.platformPlaceholderTxt = "";
      this.selected = "";
      this.allSelected = true;
      this.select.options.forEach((item: MatOption) => {
        if (!item.selected) {
          /*   this.spinner.show();
            this.chartView = false; */
        } else if (item.selected) {
          /*  this.spinner.show();
           this.chartView = false; */
          if (typeof item.value == "string") {
            if (this.selected == "Platform" || this.selected == "") {
              this.selected = item.value;
            } else {
              this.selected = this.selected + ',' + item.value;
            }
          }
        }
      });
      if (this.selected == '') {
        this.selected = "Platform";
        this.platformPlaceholderTxt = "Platform";
      }
      let arrData = this.selected.split(",");
      arrData.forEach((d, index) => {
        if (d == "undefined") {
          arrData.splice(index, 1);
        }
      });
      arrData.forEach((d, index) => {
        if (d == "Platform Select/Deselect All") {
          arrData.splice(index, 1);
        }
      });
      this.selected = arrData.join(',');
      this.platformPlaceholderTxt = arrData.join(',');
      let platformList = "";
      this.platformslist.forEach(element => {
        if (element.platformName != "Platform Select/Deselect All") {
          if (platformList == "") {
            platformList = element.platformName;
          }
          else {
            platformList = platformList + ',' + element.platformName;
          }
        }
      });
      this.select.options.forEach((item: MatOption) => {
        if (platformList == this.selected) {
          if (item.value == 'Platform Select/Deselect All') {
            item.select();
            this.allSelected = false;
          }
        } else {
          if (item.value == 'Platform Select/Deselect All') {
            item.deselect();
            this.allSelected = true;
          }
        }
      });
      this.deSelectChild(data, id);
      // this.getDSI(this.duration, this.selectedGroupDomain, this.selectedSKUID, this.selected, this.selectedExposure);
      //this.GetGroupDomainTraigeAccuracy(this.selected, this.selectedExposure, this.selectedSKUID, this.selectedGroupDomain);
    } else if (option == 'sku') {
      this.platformPlaceholderTxt = "";
      this.selectedSKUID = "";
      this.allSelected = true;
      this.select.options.forEach((item: MatOption) => {
        if (!item.selected) {
          /*   this.spinner.show();
            this.chartView = false; */
        } else if (item.selected) {
          /*  this.spinner.show();
           this.chartView = false; */
          if (typeof item.value == "number") {
            if (this.selectedSKUID == "Platform" || this.selectedSKUID == "") {
              this.selectedSKUID = this.selectedSKUID + item.value;
            } else {
              this.selectedSKUID = this.selectedSKUID + ',' + item.value;
            }
          }
        }
      });
      /*  if (this.selectedSKUID == '') {
         this.selectedSKUID = "Platform";
         this.platformPlaceholderTxt = "Platform";
       } */
      let arrData = this.selectedSKUID.split(",");
      /*arrData.forEach((d, index) => {
        if (d == "undefined") {
          arrData.splice(index, 1);
        }
      });
      arrData.forEach((d, index) => {
        if (d == "Platform Select/Deselect All") {
          arrData.splice(index, 1);
        }
      }); */
      this.selectedSKUID = arrData.join(',');
      this.deSelectParent(data, id);
      // this.platformPlaceholderTxt = arrData.join(',');
      //  this.getDSI(this.duration, this.selectedGroupDomain, this.selectedSKUID, this.selected, this.selectedExposure);
      //  this.GetGroupDomainTraigeAccuracy(this.selected, this.selectedExposure, this.selectedSKUID, this.selectedGroupDomain);
    }
  }
  deSelectChild(data, id) {
    let childList = [];
    let arrayList = JSON.parse(JSON.stringify(this.platformslist));
    arrayList.forEach(element => {
      if (element.platformName == data) {
        childList = element.platformSkuList;
      }
    });
    childList.forEach(element => {
      this.select.options.forEach((item: MatOption) => {
        if (element.skuid == item.value) {
          item.deselect();
          let arraySKUID = this.selectedSKUID.split(',');
          arraySKUID.forEach((d, index) => {
            if (element.skuid == d) {
              arraySKUID.splice(index, 1);
            }
          });
          this.selectedSKUID = arraySKUID.join(',');
        }
      });
    });
    if (this.selectedTXT.indexOf(data) !== -1) {

      let arraySelectedTXT = this.selectedTXT.split(',');
      let tempTXT = JSON.parse(JSON.stringify(arraySelectedTXT));
      tempTXT.forEach((element, index) => {
        let array = [], c = 0;

        element.split(/([()])/).filter(Boolean).forEach(e =>
          // Increase / decrease counter and push desired values to an array
          e == '(' ? c++ : e == ')' ? c-- : c > 0 ? array.push('(' + e + ')') : array.push(e)
        );

        if (data == array[0]) {
          if (array.length == 1) {
            if (tempTXT.length == 1) {
              tempTXT[index] = "Platform";
            } else {
              tempTXT.splice(index, 1);
            }
          } else if (array.length > 1) {
            tempTXT[index] = data;
          }
        }
      });
      this.selectedTXT = tempTXT.join(',');
    } else {
      if (this.selectedTXT == "Platform") {
        this.selectedTXT = data;
      } else {
        this.selectedTXT = this.selectedTXT + ',' + data;
      }
    }
  }
  deSelectParent(data, id) {
    let parent;
    let arrayList = JSON.parse(JSON.stringify(this.tempList));
    arrayList.forEach((d, index) => {
      if (d.platformName == "Platform Select/Deselect All") {
        arrayList.splice(index, 1);
      }
    });
    arrayList.forEach(element => {
      /*    if (element.platformName == data) {
           childList = element.platformSkuList;
         } */
      element.platformSkuList.forEach(ele => {
        if (ele.skuid == id) {
          parent = element.platformName;
        }
      });
    });

    let arraySelectedTXT = this.selectedTXT.split(',');
    let tempTXT = JSON.parse(JSON.stringify(arraySelectedTXT));
    tempTXT.forEach((element, index) => {

      let array = [], c = 0;

      element.split(/([()])/).filter(Boolean).forEach(e =>
        // Increase / decrease counter and push desired values to an array
        e == '(' ? c++ : e == ')' ? c-- : c > 0 ? array.push('(' + e + ')') : array.push(e)
      );
      if (array[0] == "Platform") {
        tempTXT[index] = parent + '(' + data + ')';
      } else {
        if (parent == array[0]) {
          // arraySelected[index] = parent + ' ( ' + data + ' ) ';
          let removedBra;
          let splitArray;
          let uncheck = false;
          if (array.length == 1) {
            tempTXT[index] = parent + '(' + data + ')';
          } else if (array.length > 1) {
            removedBra = array[1].slice(1, -1);
            splitArray = removedBra.split(';')
            splitArray.forEach((ele, i) => {
              if (ele == data) {
                splitArray.splice(i, 1);
                tempTXT[index] = parent + '(' + splitArray.join(';') + ')';
                uncheck = true;
                return false;
              }
            });
            if (splitArray.length == 0) {
              tempTXT.splice(index, 1);
              return false;
              //  tempTXT[index] = parent;
            } else if (splitArray.length >= 1) {
              if (!uncheck) {
                removedBra = splitArray.join(';');
                removedBra = removedBra + ';' + data;
                tempTXT[index] = parent + '(' + removedBra + ')';
              }

            }
          }
        }
      }
    });
    this.selectedTXT = tempTXT.join(',');

    this.select.options.forEach((item: MatOption) => {
      if (item.value == 'Platform Select/Deselect All') {
        item.deselect();
      }
      if (parent == item.value) {
        item.deselect();
        let arraySelected = this.selected.split(',');
        arraySelected.forEach((d, index) => {
          if (parent == d) {
            arraySelected.splice(index, 1);
          }
        });
        this.selected = arraySelected.join(',');
      }
    });
  }
  /* platform selection end */

  /* group domain */
  @ViewChild('selectGroupDomain') selectGroupDomain: MatSelect;

  allSelectedGroupDomain = true;
  toggleAllSelectionGroupDomain(data) {
    this.groupDomainPlaceholderTxt = "";
    this.allSelectedGroupDomain = data.checked;
    this.selectedGroupDomain = "";
    if (this.allSelectedGroupDomain) {
      this.selectGroupDomain.options.forEach((item: MatOption) => {
        item.select()
        if (item.selected) {
          if (this.selectedGroupDomain == "") {
            this.selectedGroupDomain = item.value;
          } else {
            this.selectedGroupDomain = this.selectedGroupDomain + ',' + item.value;
          }
        }
      });
      // this.getDSI(this.duration, this.selectedGroupDomain, this.selectedSKUID, this.selected, this.selectedExposure);
    } else {
      this.groupDomainPlaceholderTxt = "Group Domain";
      this.selectedGroupDomain = "Group Domain";
      this.selectGroupDomain.options.forEach((item: MatOption) => item.deselect());
      //  this.getDSI(this.duration, this.selectedGroupDomain, this.selectedSKUID, this.selected, this.selectedExposure);
    }
  }
  optionClickGroupDomain() {
    this.groupDomainPlaceholderTxt = "";
    let newStatus = true;
    this.selectedGroupDomain = "";
    this.selectGroupDomain.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
        /*  this.spinner.show();
         this.chartView = false; */
        /*   let arrData = this.selectedGroupDomain.split(",");
          arrData.forEach((d, index) => {
            if (d == item.value) {
              arrData.splice(index, 1);
            }
          });
          if (arrData.length == 0) {
            this.selectedGroupDomain = "";
          } else {
            this.selectedGroupDomain = arrData.join(",");
          } */
      } else if (item.selected) {
        /*   this.spinner.show();
          this.chartView = false; */
        if (this.selectedGroupDomain == "Group Domain" || this.selectedGroupDomain == "") {
          this.selectedGroupDomain = item.value;
        } else {
          this.selectedGroupDomain = this.selectedGroupDomain + ',' + item.value;
        }
      }
    });
    this.allSelectedGroupDomain = newStatus;
    if (this.selectedGroupDomain == '') {
      this.groupDomainPlaceholderTxt = "Group Domain";
      this.selectedGroupDomain = "Group Domain";
    }
    // this.getDSI(this.duration, this.selectedGroupDomain, this.selectedSKUID, this.selected, this.selectedExposure);
  }
  /* group domain end*/

  /* exposure start */
  @ViewChild('selectexposure') selectexposure: MatSelect;

  allExposure = true;
  toggleAllExposure(data) {
    this.exposurePlaceholderTxt = "";
    // this.allExposure = data.checked;
    this.selectedExposure = "";
    if (this.allExposure) {
      this.selectexposure.options.forEach((item: MatOption) => {
        item.select();
        if (item.selected) {
          if (this.selectedExposure == "") {
            this.selectedExposure = item.value;
          } else {
            this.selectedExposure = this.selectedExposure + ',' + item.value;
          }
        }
      });
      this.allExposure = false;
      let arrData = this.selectedExposure.split(",");
      arrData.forEach((d, index) => {
        if (d == "undefined") {
          arrData.splice(index, 1);
        }
      });
      arrData.forEach((d, index) => {
        if (d == "All Exposure") {
          arrData.splice(index, 1);
        }
      });
      this.selectedExposure = arrData.join(',');
      this.exposurePlaceholderTxt = arrData.join(',');
      //  this.getDSI(this.duration, this.selectedGroupDomain, this.selectedSKUID, this.selected, this.selectedExposure);
      //      this.GetGroupDomainTraigeAccuracy(this.selected, this.selectedExposure, this.selectedSKUID, this.selectedGroupDomain);
    } else {
      this.exposurePlaceholderTxt = "Exposure";
      this.selectedExposure = "Exposure";
      this.selectexposure.options.forEach((item: MatOption) => item.deselect());
      this.allExposure = true;
      // this.getDSI(this.duration, this.selectedGroupDomain, this.selectedSKUID, this.selected, this.selectedExposure);
      //this.GetGroupDomainTraigeAccuracy(this.selected, this.selectedExposure, this.selectedSKUID, this.selectedGroupDomain);
    }
  }
  optionClickExposre() {
    this.exposurePlaceholderTxt = "";
    /* let newStatus = true; */
    this.selectedExposure = "";
    this.allExposure = true;
    this.selectexposure.options.forEach((item: MatOption) => {
      if (!item.selected) {
        /* newStatus = false; */
        /*    this.spinner.show();
           this.chartView = false; */
      } else if (item.selected) {
        /*   this.spinner.show();
          this.chartView = false; */
        if (this.selectedExposure == "Exposure" || this.selectedExposure == "") {
          this.selectedExposure = item.value;
        } else {
          this.selectedExposure = this.selectedExposure + ',' + item.value;
        }
      }
    });
    /* this.allExposure = newStatus; */
    if (this.selectedExposure == '') {
      this.exposurePlaceholderTxt = "Exposure";
      this.selectedExposure = "Exposure";
    }
    let arrData = this.selectedExposure.split(",");
    arrData.forEach((d, index) => {
      if (d == "undefined") {
        arrData.splice(index, 1);
      }
    });
    arrData.forEach((d, index) => {
      if (d == "All Exposure") {
        arrData.splice(index, 1);
      }
    });
    this.selectedExposure = arrData.join(',');
    this.exposurePlaceholderTxt = arrData.join(',');
    // this.getDSI(this.duration, this.selectedGroupDomain, this.selectedSKUID, this.selected, this.selectedExposure);
    // this.GetGroupDomainTraigeAccuracy(this.selected, this.selectedExposure, this.selectedSKUID, this.selectedGroupDomain);
  }
  /* exposure end */

  /* platform search */
  public bankMultiFilterCtrl: FormControl = new FormControl();

  /** control for the selected bank for multi-selection */
  public bankMultiCtrl: FormControl = new FormControl();

  protected filterBanksMulti() {

    if (!this.platformslist) {
      return;
    }
    // get the search keyword
    let search = this.bankMultiFilterCtrl.value;
    if (!search) {
      this.platformslist = this.tempList;
      return;
    } else {
      search = search.toLowerCase();
    }
    // console.log("before", this.platformslist);
    this.platformslist = this.tempList.filter(function (e) {
      return e.platformName.toLowerCase().indexOf(search) > -1
    });
  }

  /* exposure search end */
  public exposureFilterCtrl: FormControl = new FormControl();

  /** control for the selected bank for multi-selection */
  public exposureMultiCtrl: FormControl = new FormControl();

  protected filterExposureMulti() {

    if (!this.exposerList) {
      return;
    }
    // get the search keyword
    let search = this.exposureFilterCtrl.value;
    if (!search) {
      this.exposerList = this.tempListExposure;
      return;
    } else {
      search = search.toLowerCase();
    }
    // console.log("before", this.exposerList);
    this.exposerList = this.tempListExposure.filter(function (e) {
      return e.exposure.toLowerCase().indexOf(search) > -1
    });
  }
  /* platform search */
  /* Mat Tree start*/
  levels = new Map<GameNode, number>();
  treeControl: FlatTreeControl<GameNode>;

  treeFlattener: MatTreeFlattener<GameNode, GameNode>;

  dataSource: MatTreeFlatDataSource<GameNode, GameNode>;


  getLevel = (node: GameNode): number => {
    return this.levels.get(node) || 0;
  };

  isExpandable = (node: GameNode): boolean => {
    return node.children.value.length > 0;
  };

  getChildren = (node: GameNode) => {
    return node.children;
  };

  transformer = (node: GameNode, level: number) => {
    this.levels.set(node, level);
    return node;
  }

  hasChildren = (index: number, node: GameNode) => {
    return this.isExpandable(node);
  }

  /** The selection for checklist */
  checklistSelection = new SelectionModel<GameNode>(true /* multiple */);

  /** Whether all the descendants of the node are selected */
  descendantsAllSelected(node: GameNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    if (!descendants.length) {
      return this.checklistSelection.isSelected(node);
    }
    const selected = this.checklistSelection.isSelected(node);
    const allSelected = descendants.every(child => this.checklistSelection.isSelected(child));
    if (!selected && allSelected) {
      this.checklistSelection.select(node);
      this.changeDetectorRef.markForCheck();
    }
    return allSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: GameNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    if (!descendants.length) {
      return false;
    }
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the game selection. Select/deselect all the descendants node */
  nodeSelectionToggle(node: GameNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants, node)
      : this.checklistSelection.deselect(...descendants, node);
    this.changeDetectorRef.markForCheck();

    let selesctedmattreeArray = [];
    let selesctedmattreeList = this.checklistSelection.selected;
    if (selesctedmattreeList.length > 0) {
      this.groupDomainList.forEach((d, index) => {
        selesctedmattreeList.forEach((data, index) => {
          if (data.item == d.coeGroup) {
            selesctedmattreeList.splice(index, 1);
          }
        });
      });

      selesctedmattreeList.forEach((data, index) => {
        selesctedmattreeArray.push(data.item);
      });
      this.selectedGroupDomain = selesctedmattreeArray.join(",");
      this.groupDomainPlaceholderTxt = selesctedmattreeArray.join(",");
    }
    else {
      this.groupDomainPlaceholderTxt = "Group Domain";
      this.selectedGroupDomain = "Group Domain";
    }
    // this.getDSI(this.duration, this.selectedGroupDomain, this.selectedSKUID, this.selected, this.selectedExposure);
    //this.GetGroupDomainTraigeAccuracy(this.selected, this.selectedExposure, this.selectedSKUID, this.selectedGroupDomain);
  }
  /* select all */
  isSelectedAllGroupDomain = false;
  checkAll() {
    /*   for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
        if (!this.checklistSelection.isSelected(this.treeControl.dataNodes[i])) {
          this.checklistSelection.toggle(this.treeControl.dataNodes[i]);
        }
        else {
          this.checklistSelection.deselect(this.treeControl.dataNodes[i]);
        }
        this.treeControl.expand(this.treeControl.dataNodes[i])
      } */

    if (!this.isSelectedAllGroupDomain) {
      for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
        this.checklistSelection.select(this.treeControl.dataNodes[i]);
        this.treeControl.expand(this.treeControl.dataNodes[i]);
      }
      this.isSelectedAllGroupDomain = true;
    } else if (this.isSelectedAllGroupDomain) {
      for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
        this.checklistSelection.deselect(this.treeControl.dataNodes[i]);
        this.treeControl.expand(this.treeControl.dataNodes[i]);
      }
      this.isSelectedAllGroupDomain = false;
    }

    let selesctedmattreeArray = [];
    let selesctedmattreeList = this.checklistSelection.selected;
    if (selesctedmattreeList.length > 0) {
      this.groupDomainList.forEach((d, index) => {
        selesctedmattreeList.forEach((data, index) => {
          if (data.item == d.coeGroup) {
            selesctedmattreeList.splice(index, 1);
          }
        });
      });

      selesctedmattreeList.forEach((data, index) => {
        selesctedmattreeArray.push(data.item);
      });
      this.selectedGroupDomain = selesctedmattreeArray.join(",");
      this.groupDomainPlaceholderTxt = selesctedmattreeArray.join(",");
    }
    else {
      this.groupDomainPlaceholderTxt = "Group Domain";
      this.selectedGroupDomain = "Group Domain";
    }
    //   this.getDSI(this.duration, this.selectedGroupDomain, this.selectedSKUID, this.selected, this.selectedExposure);
    //  this.GetGroupDomainTraigeAccuracy(this.selected, this.selectedExposure, this.selectedSKUID, this.selectedGroupDomain);
  }
  /* Mat Tree End */
  /* Platform Mat Tree start*/
  levelsPlatform = new Map<GameNode, number>();
  treeControlPlatform: FlatTreeControl<GameNode>;

  treeFlattenerPlatform: MatTreeFlattener<GameNode, GameNode>;

  dataSourcePlatform: MatTreeFlatDataSource<GameNode, GameNode>;


  getLevelPlatform = (node: GameNode): number => {
    return this.levels.get(node) || 0;
  };

  isExpandablePlatform = (node: GameNode): boolean => {
    return node.children.value.length > 0;
  };

  getChildrenPlatform = (node: GameNode) => {
    return node.children;
  };

  transformerPlatform = (node: GameNode, level: number) => {
    this.levels.set(node, level);
    return node;
  }

  hasChildrenPlatform = (index: number, node: GameNode) => {
    return this.isExpandable(node);
  }

  /** The selection for checklist */
  checklistSelectionPlatform = new SelectionModel<GameNode>(true /* multiple */);

  /** Whether all the descendants of the node are selected */
  descendantsAllSelectedPlatform(node: GameNode): boolean {
    const descendants = this.treeControlPlatform.getDescendants(node);
    if (!descendants.length) {
      return this.checklistSelection.isSelected(node);
    }
    const selected = this.checklistSelection.isSelected(node);
    const allSelected = descendants.every(child => this.checklistSelection.isSelected(child));
    if (!selected && allSelected) {
      this.checklistSelection.select(node);
      this.changeDetectorRef.markForCheck();
    }
    return allSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelectedPlatform(node: GameNode): boolean {
    const descendants = this.treeControlPlatform.getDescendants(node);
    if (!descendants.length) {
      return false;
    }
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the game selection. Select/deselect all the descendants node */
  nodeSelectionTogglePlatform(node: GameNode): void {
    this.isSelectedAllPlatform = false;
    this.select.options.forEach((item: MatOption) => item.deselect());
    this.checklistSelectionPlatform.toggle(node);
    const descendants = this.treeControlPlatform.getDescendants(node);
    this.checklistSelectionPlatform.isSelected(node)
      ? this.checklistSelectionPlatform.select(...descendants, node)
      : this.checklistSelectionPlatform.deselect(...descendants, node);
    this.changeDetectorRef.markForCheck();

    let selesctedmattreeArray = [];
    let selesctedmattreeList = this.checklistSelectionPlatform.selected;
    if (selesctedmattreeList.length > 0) {
      this.groupDomainList.forEach((d, index) => {
        selesctedmattreeList.forEach((data, index) => {
          if (data.item == d.coeGroup) {
            selesctedmattreeList.splice(index, 1);
          }
        });
      });

      selesctedmattreeList.forEach((data, index) => {
        selesctedmattreeArray.push(data.item);
      });
      this.selectedGroupDomain = selesctedmattreeArray.join(",");
      this.groupDomainPlaceholderTxt = selesctedmattreeArray.join(",");
    }
    else {
      this.groupDomainPlaceholderTxt = "Group Domain";
      this.selectedGroupDomain = "Group Domain";
    }
    //  this.getDSI(this.duration, this.selectedGroupDomain, this.selectedSKUID, this.selected, this.selectedExposure);
    // this.GetGroupDomainTraigeAccuracy(this.selected, this.selectedExposure, this.selectedSKUID, this.selectedGroupDomain);
  }
  /* select all */
  isSelectedAllPlatform = false;
  checkAllPlatform() {
    /*  for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
       if (!this.checklistSelection.isSelected(this.treeControl.dataNodes[i])) {
         this.checklistSelection.select(this.treeControl.dataNodes[i]);
       }
       else if (this.checklistSelection.isSelected(this.treeControl.dataNodes[i])) {
         this.checklistSelection.deselect(this.treeControl.dataNodes[i]);
       }
       this.treeControl.expand(this.treeControl.dataNodes[i])
     } */
    if (!this.isSelectedAllPlatform) {
      for (let i = 0; i < this.treeControlPlatform.dataNodes.length; i++) {
        this.checklistSelection.select(this.treeControlPlatform.dataNodes[i]);
        this.treeControlPlatform.expand(this.treeControlPlatform.dataNodes[i]);
      }
      this.isSelectedAllPlatform = true;
    } else if (this.isSelectedAllPlatform) {
      for (let i = 0; i < this.treeControlPlatform.dataNodes.length; i++) {
        this.checklistSelection.deselect(this.treeControlPlatform.dataNodes[i]);
        this.treeControlPlatform.expand(this.treeControlPlatform.dataNodes[i]);
      }
      this.isSelectedAllPlatform = false;
    }

    let selesctedmattreeArray = [];
    let selesctedmattreeList = this.checklistSelection.selected;
    if (selesctedmattreeList.length > 0) {
      this.groupDomainList.forEach((d, index) => {
        selesctedmattreeList.forEach((data, index) => {
          if (data.item == d.coeGroup) {
            selesctedmattreeList.splice(index, 1);
          }
        });
      });

      selesctedmattreeList.forEach((data, index) => {
        selesctedmattreeArray.push(data.item);
      });
      this.selectedGroupDomain = selesctedmattreeArray.join(",");
      this.groupDomainPlaceholderTxt = selesctedmattreeArray.join(",");
    }
    else {
      this.groupDomainPlaceholderTxt = "Group Domain";
      this.selectedGroupDomain = "Group Domain";
    }
    //  this.getDSI(this.duration, this.selectedGroupDomain, this.selectedSKUID, this.selected, this.selectedExposure);
    //    this.GetGroupDomainTraigeAccuracy(this.selected, this.selectedExposure, this.selectedSKUID, this.selectedGroupDomain);
  }
  /* Platform Mat Tree End */
}
