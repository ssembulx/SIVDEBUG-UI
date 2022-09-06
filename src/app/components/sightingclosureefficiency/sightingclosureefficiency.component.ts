import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';

import { ChartInfo } from '../../shared/models/chart-info';
import { dataChart1 } from "../../const/chart1";

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
import { take, takeUntil } from 'rxjs/operators';
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

export class GameNodePlatform {
  children: BehaviorSubject<GameNodePlatform[]>;
  constructor(public item: string, public id: number, children?: GameNodePlatform[]) {
    this.children = new BehaviorSubject(children === undefined ? [] : children);
  }
}
let TREE_DATA_PLATFORM = [
  new GameNodePlatform('Simulation', 1, [
    new GameNodePlatform('Factorio', 1),
    new GameNodePlatform('Oxygen not included', 2),
  ]),
  new GameNodePlatform('Indie', 2, [
    new GameNodePlatform(`Don't Starve`, 1, [
      new GameNodePlatform(`Region of Giants`, 1),
      new GameNodePlatform(`Together`, 2),
      new GameNodePlatform(`Shipwrecked`, 3)
    ]),
    new GameNodePlatform('Terraria', 3),
    new GameNodePlatform('Starbound', 4),
    new GameNodePlatform('Dungeon of the Endless', 5)
  ]),
  new GameNodePlatform('Action', 5, [
    new GameNodePlatform('Overcooked', 7)
  ]),
  new GameNodePlatform('Strategy', 8, [
    new GameNodePlatform('Rise to ruins', 9)
  ]),
  new GameNodePlatform('RPG', 10, [
    new GameNodePlatform('Magicka', 11, [
      new GameNodePlatform('Magicka 1', 12),
      new GameNodePlatform('Magicka 2', 13)
    ])
  ])
];

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
  selector: 'cqi-sightingclosureefficiency',
  templateUrl: './sightingclosureefficiency.component.html',
  styleUrls: ['./sightingclosureefficiency.component.css']
})
export class SightingclosureefficiencyComponent implements OnInit, OnDestroy {

  triageAccuracyData: any;
  duration = "Year";
  loader: boolean = true;
  chartView: boolean = false;
  noDataFound: boolean = false;
  fullScreenFlag = false;
  fullScreenFlagComp = false;
  protected _onDestroy = new Subject<void>();

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
    this.treeControlPlatform = new FlatTreeControl<GameNodePlatform>(
      this.getLevelPlatform, this.isExpandablePlatform);
    this.dataSourcePlatform = new MatTreeFlatDataSource(this.treeControlPlatform, this.treeFlattenerPlatform);
    this.dataSourcePlatform = new MatTreeFlatDataSource(this.treeControlPlatform, this.treeFlattenerPlatform);
    this.getPlatformData();
    this.dataSourcePlatform.data = TREE_DATA_PLATFORM;
    /* platform end */
  }
  initialLoad;
  //userInfo: AccountModel;
  ngOnInit(): void {
    this.initialLoad = true;
    this.helper.GetUser().subscribe(user => {
      if (user != null) {
        //this.userInfo = user;
        this.dataSvc.getUserviewDetails(user.idsid, 'DCR').subscribe(res => {

          if (res) {
          }
        });
      }
    });
    this.dataShare.changeTitle("Domain Specific Indicator");
    this.triageAccuracyData = dataChart1;
    this.spinner.show();
    this.chartView = false;
    this.noDataFound = false;
    //  this.getDSI("Year", "Group Domain", "SKU", "Platform", "Exposure");
    // this.getGroupDomainData();
    // this.getPlatformData();
    this.getGroupDomainConfig();
    // this.GetGroupDomainTraigeAccuracy(this.selected, this.selectedExposure, "SKU");
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
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  /* get full screen view */
  getfullScreen() {
    this.fullScreenFlag = !this.fullScreenFlag
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
        this.getDSI("Year", "Group Domain", "SKU", this.selected, "Exposure");
        this.GetGroupDomainTraigeAccuracy(this.selected, this.selectedExposure, "SKU");
        this.tempList = res.platformslist;
        TREE_DATA_PLATFORM = [];
        /* this.tempList.forEach((d, index) => {
          let tempSubPlatform = []; */
        //tempSubPlatform.push(new GameNodePlatform("All", d.platformGroupID));
        /*  d.platformSkuList.forEach((data, index) => {
           tempSubPlatform.push(new GameNodePlatform(data.skuName, data.skuid));
         });
         TREE_DATA_PLATFORM.push(new GameNodePlatform(d.platformName, d.platformGroupID, tempSubPlatform));
       });
       this.dataSourcePlatform.data = TREE_DATA_PLATFORM; */
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

  /* get dcr chart data */
  getDcrDetailsList;
  ChartType = "Year"
  dcrInformation;
  isDomainGroup = true;
  isPlatform = true;
  getDSI(duration?: string, groupDomain?: string, SKUIDcombination?: string, platform?: string, exposure?: String) {
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
      /* "Charttype": duration, */
      "GroupName": groupDomain,
      "Platform": platform,
      "Exposure": exposure,
      "SKUIDcombination": SKUIDcombination,
    }
    this.dataSvc.getopensightingsbyexposure(data).subscribe(res => {
      if (res) {
        this.getDcrDetailsList = res.opensightingDetails;
        this.dcrInformation = res.dcrInformationDetails;
        /* this.dcrInformation.forEach((d, index) => {
          var keyNames = Object.keys(d);
          if (keyNames.indexOf("domaingroup") !== -1) {
            this.isDomainGroup = true;
          }
          if (keyNames.indexOf("platform") !== -1) {
            this.isPlatform = true;
          }
        }); */
        if (this.getDcrDetailsList == null) {
          this.spinner.hide();
          this.chartView = false;
          this.noDataFound = true;
        } else {
          this.noDataFound = false;
          this.spinner.hide();
          this.chartView = true;
          this.renderChar();
        }
      }
    });
  }
  /* get dcr chart data end*/

  /* group domain comparision */
  groupDomainTraigeAccuracy;
  GetGroupDomainTraigeAccuracy(platform, exposure, SKUIDcombination) {
    if (this.selected == "Platform") {
      platform = "";
    }
    if (this.selectedExposure == 'Exposure') {
      exposure = '';
    }
    if (SKUIDcombination == 'SKU') {
      SKUIDcombination = '';
    }
    this.dataSvc.GetGroupDomainDCR(platform, exposure, SKUIDcombination).subscribe(res => {
      if (res) {
        this.groupDomainTraigeAccuracy = res.dcRdomainwisedata;
        this.renderComparisonDomain();
      }
    });
  }

  renderComparisonDomain() {
    am4core.options.autoSetClassName = true;
    am4core.options.commercialLicense = true;
    //am4core.options.autoDispose = true;
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    let chart = am4core.create("chartdiv1", am4charts.XYChart);
    //chart.numberFormatter.numberFormat = "#'%'";
    // Add data
    chart.data = this.groupDomainTraigeAccuracy;
    //color list
    chart.colors.list = [
      am4core.color("#c6c6c6"),
      am4core.color("#ffd688"),
      am4core.color("#aac6e7"),
      am4core.color("#aace9a"),
      am4core.color("#FFC75F"),
      am4core.color("#F9F871"),
      am4core.color("#8D6E63"),
      am4core.color("#FF5722"),
      am4core.color("#43A047"),
      am4core.color("#C0CA33"),
      am4core.color("#26A69A"),
    ];
    // Create axes

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "chartType";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    /* categoryAxis.renderer.labels.template.rotation = 290; */
    categoryAxis.renderer.labels.template.fill = am4core.color("#000000");
    let label = categoryAxis.renderer.labels.template;
    label.wrap = true;
    /* label.truncate = true; */
    label.maxWidth = 150;
    label.tooltipText = "{category}";
    label.fontSize = 12;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = '[bold] DCR %';
    valueAxis.renderer.labels.template.fill = am4core.color("#000000");
    valueAxis.renderer.labels.template.fontSize = 12;
    valueAxis.min = 0;
    valueAxis.max = 100;
    valueAxis.renderer.minGridDistance = 20;

    let range = valueAxis.axisRanges.create();
    range.value = 80;
    range.grid.stroke = am4core.color("#ff0000");
    range.grid.strokeWidth = 1;
    range.grid.strokeOpacity = 1;
    range.label.inside = true;
    range.label.text = "DCR Goal = 80%";
    range.label.fill = range.grid.stroke;
    //range.label.align = "right";
    range.label.verticalCenter = "bottom";

    let vAxis = chart.yAxes.push(new am4charts.ValueAxis());
    /*  if (chart.yAxes.indexOf(valueAxis) != 0) {
       valueAxis.syncWithAxis = chart.yAxes.getIndex(0);
     } */
    vAxis.min = 0;
    vAxis.renderer.opposite = true;
    vAxis.renderer.grid.template.disabled = true;
    vAxis.title.text = '[bold] Noise Counts';
    //valueAxis.renderer.labels.template.fill = am4core.color("#000000");
    vAxis.renderer.labels.template.fontSize = 12;
    vAxis.renderer.line.strokeOpacity = 1;
    vAxis.renderer.line.strokeWidth = 1;
    vAxis.renderer.line.stroke = am4core.color("#FFFFFF");
    //  vAxis.renderer.labels.template.fill = am4core.color("#FFFFFF");
    vAxis.tooltip.disabled = true;

    // Create series
    /*     let series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = "dcrPercent";
        series.dataFields.categoryX = "chartType";
        series.name = "DCR";
        series.columns.template.tooltipText = " DCR Percent : [bold]{valueY}[/]";
        series.columns.template.fillOpacity = 1; */

    // Create series
    function createSeries(field, name, percentage) {

      // Set up series
      var series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.value = percentage;
      series.name = name;
      series.dataFields.valueY = field;
      series.dataFields.categoryX = "chartType";
      series.yAxis = vAxis;
      series.sequencedInterpolation = true;
      // Make it stacked
      series.stacked = true;

      // Configure columns
      series.columns.template.width = am4core.percent(60);
      series.columns.template.tooltipText = "[#000 font-size: 14px]{name} [#000]:[/] [/][bold #000 font-size: 14px]{value} [/][bold #000]%[/]";

      // Add label
      var labelBullet = series.bullets.push(new am4charts.LabelBullet());
      labelBullet.label.text = "{valueY}";
      labelBullet.locationY = 0.5;
      labelBullet.label.hideOversized = true;

      return series;
    }

    createSeries("cannot_reproduce", "Can Not Reproduce", "cannot_reproduce_percentage");
    createSeries("config_issue", "Config Issue", "config_issue_percentage");
    createSeries("behavior", "Expected Behavior", "behavior_percentage");
    createSeries("feature_not_por", "Feature Not Por", "feature_not_por_percentage");
    createSeries("feature_por_not_ready", "Feature Por Not Ready", "feature_por_not_ready_percentage");
    createSeries("filed_by_mistake", "Filed by Mistake", "filed_by_mistake_percentage");
    createSeries("test_test_env", "Test/Test env", "test_test_env_percentage");
    createSeries("duplicate", "Duplicate", "duplicate_percentage");
    createSeries("inactive", "Inactive", "inactive_percentage");
    createSeries("poor_sighting_quality", "Poor Sighting Quality", "poor_sighting_quality_percentage");
    createSeries("uncategorized", "Uncategorized [#FF0000]*[/]", "uncategorized_percentage");

    if (this.initialLoad != true || this.selectedExposure != "Exposure") {
      var lineSeries = chart.series.push(new am4charts.LineSeries());
      lineSeries.name = "DCR(Dynamic based on filter)";
      lineSeries.dataFields.valueY = "dcrPercent";
      lineSeries.dataFields.categoryX = "chartType";
      lineSeries.stroke = am4core.color("#fdd400"); // yellow
      lineSeries.strokeWidth = 2;
      lineSeries.propertyFields.strokeDasharray = "lineDash";
      lineSeries.tooltip.label.textAlign = "middle";
      //lineSeries.numberFormatter.numberFormat = "#'%'";
      /*  lineSeries.tensionX = 0.8;
       lineSeries.showOnInit = true; */

      var bullet = lineSeries.bullets.push(new am4charts.Bullet());
      bullet.fill = am4core.color("#fdd400"); // tooltips grab fill from parent by default
      // bullet.tooltipText = "[#fff font-size: 15px]{name} in {categoryX}:\n[/][#fff font-size: 20px]{valueY}[/] [#fff]{additional}[/]"
      bullet.tooltipText = "[#000 font-size: 14px]{name} : [/][bold #000 font-size: 14px]{valueY}[/ bold #000]%[/]";
      var circle = bullet.createChild(am4core.Circle);
      circle.radius = 3;
      circle.fill = am4core.color("#fff");
      circle.strokeWidth = 2;

      var valueLabel = lineSeries.bullets.push(new am4charts.LabelBullet());
      valueLabel.label.text = "{valueY}[/]%[/]";
      /*  valueLabel.label.fontSize = 12;
       valueLabel.label.dy = 0;
       valueLabel.label.dx = -20; */
      valueLabel.label.hideOversized = false;

      valueLabel.label.adapter.add("verticalCenter", function (center, target) {
        if (!target.dataItem) {
          return center;
        }
        var values = target.dataItem.values;
        return values.valueY.value > values.openValueY.value
          ? "bottom"
          : "top";
      });
    }
    /* overall */
    /* if (this.selectedGroupDomain != "Group Domain" || this.selected != "Platform") { */
    var lineSeriesOverAll = chart.series.push(new am4charts.LineSeries());
    lineSeriesOverAll.name = "DCR(Overall)";
    lineSeriesOverAll.dataFields.valueY = "overallpercent";
    lineSeriesOverAll.id = 'g1';
    lineSeriesOverAll.dataFields.categoryX = "chartType";
    lineSeriesOverAll.strokeDasharray = "8,4";
    lineSeriesOverAll.stroke = am4core.color("#2196f3"); // blue
    lineSeriesOverAll.strokeWidth = 2;
    lineSeriesOverAll.propertyFields.strokeDasharray = "lineDash";
    lineSeriesOverAll.tooltip.label.textAlign = "middle";
    // lineSeriesOverAll.numberFormatter.numberFormat = "#'%'";
    /*  lineSeriesOverAll.tensionX = 0.8;
     lineSeriesOverAll.showOnInit = true; */

    var bulletOverAll = lineSeriesOverAll.bullets.push(new am4charts.Bullet());
    bulletOverAll.fill = am4core.color("#2196f3"); // tooltips grab fill from parent by default
    // bullet.tooltipText = "[#fff font-size: 15px]{name} in {categoryX}:\n[/][#fff font-size: 20px]{valueY}[/] [#fff]{additional}[/]"
    bulletOverAll.tooltipText = "[#000 font-size: 14px]{name} : [/][bold #000 font-size: 14px]{valueY}[/ bold #000]%[/]";
    var circleOverAll = bulletOverAll.createChild(am4core.Circle);
    circleOverAll.radius = 3;
    circleOverAll.fill = am4core.color("#fff");
    circleOverAll.strokeWidth = 2;

    var valueLabelOverAll = lineSeriesOverAll.bullets.push(new am4charts.LabelBullet());
    valueLabelOverAll.label.text = "{valueY}[/]%[/]";
    /*   valueLabelOverAll.label.fontSize = 12;
      valueLabelOverAll.label.dy = 0;
      valueLabelOverAll.label.dx = -20; */
    valueLabelOverAll.label.hideOversized = false;

    valueLabelOverAll.label.adapter.add("verticalCenter", function (center, target) {
      if (!target.dataItem) {
        return center;
      }
      var values = target.dataItem.values;
      return values.valueY.value > values.openValueY.value
        ? "bottom"
        : "top";
    });

    // Add label
    /*   var labelBullet = series.bullets.push(new am4charts.LabelBullet());
      labelBullet.label.text = "{valueY}";
      labelBullet.locationY = 0.5;
      labelBullet.label.hideOversized = true; */
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
    /* chart.cursor = new am4charts.XYCursor(); */
    /* let series1 = chart.series.push(new am4charts.ColumnSeries());
    series1.dataFields.valueY = "traigeAccuracy";
    series1.dataFields.categoryX = "domainGroupName";
    series1.name = "traigeAccuracy";
    series1.columns.template.tooltipText = " Traige Accuracy : [bold]{valueY}[/]";
    series1.columns.template.fillOpacity = 1;

    // Add label
    var labelBullet1 = series1.bullets.push(new am4charts.LabelBullet());
    labelBullet1.label.text = "{valueY}";
    labelBullet1.locationY = 0.5;
    labelBullet1.label.hideOversized = true; */

    /* let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1; */



    /*    series.columns.template.adapter.add("fill", function (fill, target) {
         return chart.colors.getIndex(target.dataItem.index);
       }); */

  }
  /*  group domain comparision  */

  /* render dcr chart */
  renderChar() {
    am4core.options.autoSetClassName = true;
    am4core.options.commercialLicense = true;
    //am4core.options.autoDispose = true;
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    let chart = am4core.create("chartdiv", am4charts.XYChart);
    //chart.numberFormatter.numberFormat = "#'%'";
    // Add data
    //chart.data = this.getDcrDetailsList;
    chart.data = [{ "exposure": "PoE", "exposureCount": "5988", "exposure_percent": "13", "exposurepercentageline": "25" }, { "exposure": "Pre Alpha", "exposureCount": "15463", "exposure_percent": "33", "exposurepercentageline": "40" }, { "exposure": "Alpha", "exposureCount": "23114", "exposure_percent": "50", "exposurepercentageline": "30" }, { "exposure": "ES", "exposureCount": "1050", "exposure_percent": "2", "exposurepercentageline": "5" }]
    //color list
    chart.colors.list = [
      am4core.color("#67b7dc"),
      am4core.color("#ffd688"),
      am4core.color("#aac6e7"),
      am4core.color("#aace9a"),
      am4core.color("#FFC75F"),
      am4core.color("#F9F871"),
      am4core.color("#8D6E63"),
      am4core.color("#FF5722"),
      am4core.color("#43A047"),
      am4core.color("#C0CA33"),
      am4core.color("#26A69A"),
    ];

    /* Create axes */
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "exposure";
    categoryAxis.renderer.minGridDistance = 30;

    /* Create value axis */
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = '[bold]';
    valueAxis.min = 0;
    valueAxis.max = 100;
    /* Create series */
    let columnSeries = chart.series.push(new am4charts.ColumnSeries());
    columnSeries.name = "SCE Actual";
    columnSeries.dataFields.valueY = "exposure_percent";
    columnSeries.dataFields.categoryX = "exposure";
    columnSeries.dataFields.value = "exposureCount";

    columnSeries.columns.template.tooltipText = "[#000 font-size: 14px]{name} in {categoryX}:\n[/][#000 font-size: 14px]{valueY}% [/][#000 font-size: 14px]( {value} )[/] [#000]{additional}[/]"
    columnSeries.columns.template.propertyFields.fillOpacity = "fillOpacity";
    columnSeries.columns.template.propertyFields.stroke = "stroke";
    columnSeries.columns.template.propertyFields.strokeWidth = "strokeWidth";
    columnSeries.columns.template.propertyFields.strokeDasharray = "columnDash";
    columnSeries.tooltip.label.textAlign = "middle";

    /*  let lineSeries = chart.series.push(new am4charts.LineSeries());
     lineSeries.name = "exposurepercentageline";
     lineSeries.dataFields.valueY = "exposurepercentageline";
     lineSeries.dataFields.categoryX = "exposure";
 
     lineSeries.stroke = am4core.color("#fdd400");
     lineSeries.strokeWidth = 3;
     lineSeries.propertyFields.strokeDasharray = "lineDash";
     lineSeries.tooltip.label.textAlign = "middle";
 
     let bullet = lineSeries.bullets.push(new am4charts.Bullet());
     bullet.fill = am4core.color("#fdd400"); // tooltips grab fill from parent by default
     bullet.tooltipText = "[#fff font-size: 15px]{name} in {categoryX}:\n[/][#fff font-size: 20px]{valueY}[/] [#fff]{additional}[/]"
     let circle = bullet.createChild(am4core.Circle);
     circle.radius = 4;
     circle.fill = am4core.color("#fff");
     circle.strokeWidth = 3; */

    var lineSeries = chart.series.push(new am4charts.LineSeries());
    lineSeries.name = "SCE desired";
    lineSeries.dataFields.valueY = "exposurepercentageline";
    lineSeries.dataFields.categoryX = "exposure";
    lineSeries.stroke = am4core.color("#fdd400"); // yellow
    lineSeries.strokeWidth = 2;
    lineSeries.propertyFields.strokeDasharray = "lineDash";
    lineSeries.tooltip.label.textAlign = "middle";
    //lineSeries.numberFormatter.numberFormat = "#'%'";
    /*  lineSeries.tensionX = 0.8;
     lineSeries.showOnInit = true; */

    var bullet = lineSeries.bullets.push(new am4charts.Bullet());
    bullet.fill = am4core.color("#fdd400"); // tooltips grab fill from parent by default
    // bullet.tooltipText = "[#fff font-size: 15px]{name} in {categoryX}:\n[/][#fff font-size: 20px]{valueY}[/] [#fff]{additional}[/]"
    bullet.tooltipText = "[#000 font-size: 14px]{name} : [/][bold #000 font-size: 14px]{valueY}[/]%[/] [/][bold #000]%[/][/] [#000]{additional}[/]";
    var circle = bullet.createChild(am4core.Circle);
    circle.radius = 3;
    circle.fill = am4core.color("#fff");
    circle.strokeWidth = 2;

    var valueLabel = lineSeries.bullets.push(new am4charts.LabelBullet());
    valueLabel.label.text = "{valueY}[/]%[/]";
    //  valueLabel.label.text = "{valueY}";
    /*  valueLabel.label.fontSize = 12;
     valueLabel.label.dy = 0;
     valueLabel.label.dx = -20; */
    valueLabel.label.hideOversized = false;

    valueLabel.label.adapter.add("verticalCenter", function (center, target) {
      if (!target.dataItem) {
        return center;
      }
      var values = target.dataItem.values;
      return values.valueY.value > values.openValueY.value
        ? "bottom"
        : "top";
    });
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
  }
  /* render dcr chart end */

  onPlatformValChange(value) {
    this.spinner.show();
    this.chartView = false;
    this.selected = value;
    this.getDSI(this.duration, this.selectedGroupDomain, this.selectedSKUID, this.selected, this.selectedExposure);
  }

  onGroupValChange(value) {
    this.spinner.show();
    this.chartView = false;
    this.selectedGroupDomain = value;
    this.getDSI(this.duration, this.selectedGroupDomain, this.selectedSKUID, this.selected, this.selectedExposure);
  }

  onValChange(value) {
    this.spinner.show();
    this.chartView = false;
    this.duration = value;
    this.getDSI(this.duration, this.selectedGroupDomain, this.selectedSKUID, this.selected, this.selectedExposure);
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
  selectedSKUID = '';
  toggleAllSelection(data) {
    this.initialLoad = false;
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
      this.getDSI(this.duration, this.selectedGroupDomain, this.selectedSKUID, this.selected, this.selectedExposure);
      this.GetGroupDomainTraigeAccuracy(this.selected, this.selectedExposure, this.selectedSKUID);
    } else {
      this.platformPlaceholderTxt = "Platform";
      this.selected = "Platform";
      this.selectedTXT = "Platform";
      this.select.options.forEach((item: MatOption) => item.deselect());
      this.allSelected = true;
      this.getDSI(this.duration, this.selectedGroupDomain, this.selectedSKUID, this.selected, this.selectedExposure);
      this.GetGroupDomainTraigeAccuracy(this.selected, this.selectedExposure, this.selectedSKUID);
    }
  }

  optionClick(option, data, id) {
    this.initialLoad = false;
    if (option == 'platform') {
      this.platformPlaceholderTxt = "";
      this.selected = "";
      this.allSelected = true;
      this.select.options.forEach((item: MatOption) => {
        if (!item.selected) {
          this.spinner.show();
          this.chartView = false;
        } else if (item.selected) {
          this.spinner.show();
          this.chartView = false;
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
      this.getDSI(this.duration, this.selectedGroupDomain, this.selectedSKUID, this.selected, this.selectedExposure);
      this.GetGroupDomainTraigeAccuracy(this.selected, this.selectedExposure, this.selectedSKUID);
    } else if (option == 'sku') {
      this.platformPlaceholderTxt = "";
      this.selectedSKUID = "";
      this.allSelected = true;
      this.select.options.forEach((item: MatOption) => {
        if (!item.selected) {
          this.spinner.show();
          this.chartView = false;
        } else if (item.selected) {
          this.spinner.show();
          this.chartView = false;
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
      this.getDSI(this.duration, this.selectedGroupDomain, this.selectedSKUID, this.selected, this.selectedExposure);
      this.GetGroupDomainTraigeAccuracy(this.selected, this.selectedExposure, this.selectedSKUID);
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

  /* deselectSKU(data) {
    data.forEach(element => {
      this.treeControlPlatform.dataNodes.forEach(ele => {
        if (element == ele.item) {
          ele.children.value.forEach(el => {
            this.checklistSelectionPlatform.deselect(el);
          });
        }
      });
    });
    let selesctedmattreeArray = [];
    let selesctedmattreeArrayTooltip = [];
    let selesctedmattreeList = this.checklistSelectionPlatform.selected;
    if (selesctedmattreeList.length > 0) {
      this.tempList.forEach((d, index) => {
        selesctedmattreeList.forEach((data, index) => {
          if (data.item == d.platformName) {
            selesctedmattreeList.splice(index, 1);
          }
        });
      });

      selesctedmattreeList.forEach((data, index) => {
        selesctedmattreeArray.push(data.id);
      });
      selesctedmattreeList.forEach((data, index) => {
        selesctedmattreeArrayTooltip.push(data.item);
      });
      this.selectedSKUID = selesctedmattreeArray.join(",");
      this.selectedSKU = selesctedmattreeArrayTooltip.join(",");
    }
    else {
      this.selectedSKU = "SKU";
    }
  } */
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
      this.getDSI(this.duration, this.selectedGroupDomain, this.selectedSKUID, this.selected, this.selectedExposure);
    } else {
      this.groupDomainPlaceholderTxt = "Group Domain";
      this.selectedGroupDomain = "Group Domain";
      this.selectGroupDomain.options.forEach((item: MatOption) => item.deselect());
      this.getDSI(this.duration, this.selectedGroupDomain, this.selectedSKUID, this.selected, this.selectedExposure);
    }
  }
  optionClickGroupDomain() {
    this.groupDomainPlaceholderTxt = "";
    let newStatus = true;
    this.selectedGroupDomain = "";
    this.selectGroupDomain.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
        this.spinner.show();
        this.chartView = false;
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
        this.spinner.show();
        this.chartView = false;
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
    this.getDSI(this.duration, this.selectedGroupDomain, this.selectedSKUID, this.selected, this.selectedExposure);
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
      this.getDSI(this.duration, this.selectedGroupDomain, this.selectedSKUID, this.selected, this.selectedExposure);
      this.GetGroupDomainTraigeAccuracy(this.selected, this.selectedExposure, this.selectedSKUID);
    } else {
      this.exposurePlaceholderTxt = "Exposure";
      this.selectedExposure = "Exposure";
      this.selectexposure.options.forEach((item: MatOption) => item.deselect());
      this.allExposure = true;
      this.getDSI(this.duration, this.selectedGroupDomain, this.selectedSKUID, this.selected, this.selectedExposure);
      this.GetGroupDomainTraigeAccuracy(this.selected, this.selectedExposure, this.selectedSKUID);
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
        this.spinner.show();
        this.chartView = false;
      } else if (item.selected) {
        this.spinner.show();
        this.chartView = false;
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
    this.getDSI(this.duration, this.selectedGroupDomain, this.selectedSKUID, this.selected, this.selectedExposure);
    this.GetGroupDomainTraigeAccuracy(this.selected, this.selectedExposure, this.selectedSKUID);
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
    this.isSelectedAllGroupDomain = false;
    this.selectGroupDomain.options.forEach((item: MatOption) => item.deselect());
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
    this.getDSI(this.duration, this.selectedGroupDomain, this.selectedSKUID, this.selected, this.selectedExposure);
    this.GetGroupDomainTraigeAccuracy(this.selected, this.selectedExposure, this.selectedSKUID);
  }
  /* select all */
  isSelectedAllGroupDomain = false;
  checkAll() {
    /*  for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
       if (!this.checklistSelection.isSelected(this.treeControl.dataNodes[i])) {
         this.checklistSelection.select(this.treeControl.dataNodes[i]);
       }
       else if (this.checklistSelection.isSelected(this.treeControl.dataNodes[i])) {
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
    this.getDSI(this.duration, this.selectedGroupDomain, this.selectedSKUID, this.selected, this.selectedExposure);
    this.GetGroupDomainTraigeAccuracy(this.selected, this.selectedExposure, this.selectedSKUID);
  }
  /* Mat Tree End */

  @ViewChild('selectSKU') selectSKU: MatSelect;
  /* Platform Mat Tree start*/
  levelsPlatform = new Map<GameNodePlatform, number>();
  treeControlPlatform: FlatTreeControl<GameNodePlatform>;

  treeFlattenerPlatform: MatTreeFlattener<GameNodePlatform, GameNodePlatform>;

  dataSourcePlatform: MatTreeFlatDataSource<GameNodePlatform, GameNodePlatform>;


  getLevelPlatform = (node: GameNodePlatform): number => {
    return this.levels.get(node) || 0;
  };

  isExpandablePlatform = (node: GameNodePlatform): boolean => {
    return node.children.value.length > 0;
  };

  getChildrenPlatform = (node: GameNodePlatform) => {
    return node.children;
  };

  transformerPlatform = (node: GameNodePlatform, level: number) => {
    this.levels.set(node, level);
    return node;
  }

  hasChildrenPlatform = (index: number, node: GameNodePlatform) => {
    return this.isExpandablePlatform(node);
  }

  /** The selection for checklist */
  checklistSelectionPlatform = new SelectionModel<GameNodePlatform>(true /* multiple */);

  /** Whether all the descendants of the node are selected */
  descendantsAllSelectedPlatform(node: GameNodePlatform): boolean {
    const descendants = this.treeControlPlatform.getDescendants(node);
    if (!descendants.length) {
      return this.checklistSelectionPlatform.isSelected(node);
    }
    const selected = this.checklistSelectionPlatform.isSelected(node);
    const allSelected = descendants.every(child => this.checklistSelectionPlatform.isSelected(child));
    if (!selected && allSelected) {
      this.checklistSelectionPlatform.select(node);
      this.changeDetectorRef.markForCheck();
    }
    return allSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelectedPlatform(event, node: GameNodePlatform): boolean {
    const descendants = this.treeControlPlatform.getDescendants(node);
    if (!descendants.length) {
      return false;
    }
    const result = descendants.some(child => this.checklistSelectionPlatform.isSelected(child));
    return result && !this.descendantsAllSelectedPlatform(node);
  }

  /** Toggle the game selection. Select/deselect all the descendants node */
  nodeSelectionTogglePlatform(node: GameNodePlatform): void {
    this.isSelectedAllPlatform = false;
    this.selectSKU.options.forEach((item: MatOption) => item.deselect());
    this.checklistSelectionPlatform.toggle(node);
    const descendants = this.treeControlPlatform.getDescendants(node);
    this.checklistSelectionPlatform.isSelected(node)
      ? this.checklistSelectionPlatform.select(...descendants, node)
      : this.checklistSelectionPlatform.deselect(...descendants, node);
    this.changeDetectorRef.markForCheck();

    let selesctedmattreeArray = [];
    let selesctedmattreeArrayTooltip = [];
    let platformNameList = [];
    let skuList = [];
    /*  if (this.checklistSelectionPlatform.selected.length > 1) {
       this.checklistSelectionPlatform.selected.forEach((d, index) => {
         this.dataSourcePlatform.data.forEach((drill, index) => {
           if (drill.id == d.id) {
             if (d.item == "All") {
 
               drill.children.value.forEach((dri, index) => {
                 if (dri.id == d.id) {
                   // skuList.push(dri.skuid);
                   this.checklistSelectionPlatform.deselect(drill.children.value[0]);
                 } else {
                   this.checklistSelectionPlatform.selected.splice(index, 1);
                   this.checklistSelectionPlatform.deselect(dri);
                 }
               });
             }
           } else {
           }
         });
       });
     } */
    /*  else if (this.checklistSelectionPlatform.selected.length == 1) {
       this.checklistSelectionPlatform.selected.forEach((d, index) => {
         this.tempList.forEach((drill, index) => {
           if (drill.platformGroupID == d.id) {
             platformNameList.push(drill.platformName);
           } else {
             drill.platformSkuList.forEach((dri, index) => {
               if (dri.skuid == d.id) {
                 skuList.push(dri.skuid);
               }
             });
           }
         });
       });
     } */
    /* this.selected = platformNameList.join(",");
    this.selectedSKUID = skuList.join(",");
    this.getDSI(this.duration, this.selectedGroupDomain, this.selectedSKUID, this.selected, this.selectedExposure); */
    /* } */
    let selesctedmattreeList = this.checklistSelectionPlatform.selected;
    if (selesctedmattreeList.length > 0) {
      this.tempList.forEach((d, index) => {
        selesctedmattreeList.forEach((data, index) => {
          if (data.item == d.platformName) {
            selesctedmattreeList.splice(index, 1);
          }
        });
      });

      selesctedmattreeList.forEach((data, index) => {
        selesctedmattreeArray.push(data.id);
      });
      selesctedmattreeList.forEach((data, index) => {
        selesctedmattreeArrayTooltip.push(data.item);
      });
      this.deselectPlatform(selesctedmattreeArray);
      this.selectedSKUID = selesctedmattreeArray.join(",");
      this.selectedSKU = selesctedmattreeArrayTooltip.join(",");
    }
    else {
      this.selectedSKU = "SKU";
    }
    this.getDSI(this.duration, this.selectedGroupDomain, this.selectedSKUID, this.selected, this.selectedExposure);
    this.GetGroupDomainTraigeAccuracy(this.selected, this.selectedExposure, this.selectedSKUID);
  }
  deselectPlatform(data) {
    data.forEach(element => {
      this.treeControlPlatform.dataNodes.forEach(ele => {
        ele.children.value.forEach(el => {
          //  this.checklistSelectionPlatform.deselect(el);
          if (element == el.id) {
            this.select.options.forEach((item: MatOption) => {
              if (item.value == ele.item) {
                item.deselect();
              }
            });
          }
        });
      });
    });
    this.platformPlaceholderTxt = "";
    /* let newStatus = true; */
    this.selected = "";
    this.allSelected = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        /* newStatus = false; */
        this.spinner.show();
        this.chartView = false;
      } else if (item.selected) {
        this.spinner.show();
        this.chartView = false;
        if (this.selected == "Platform" || this.selected == "") {
          this.selected = item.value;
        } else {
          this.selected = this.selected + ',' + item.value;
        }
      }
    });
    /* this.allSelected = newStatus; */
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
  }

  /* select all */
  isSelectedAllPlatform = false;
  selectedSKU = "SKU";
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
      this.treeControlPlatform.dataNodes.forEach((d, index) => {
        this.checklistSelectionPlatform.select(d);
        this.treeControlPlatform.expand(d);
      });
      this.isSelectedAllPlatform = true;
      if (this.checklistSelectionPlatform.selected.length > 0) {
        this.checklistSelectionPlatform.selected.forEach((d, index) => {
          if (d.children.value.length == 0) {
            //this.checklistSelectionPlatform.selected.splice(index, 1);
            this.checklistSelectionPlatform.deselect(d);
          }
        });
      }
    } else if (this.isSelectedAllPlatform) {
      this.treeControlPlatform.dataNodes.forEach((d, index) => {
        this.checklistSelectionPlatform.deselect(d);
        this.treeControlPlatform.expand(d);
      });
      this.isSelectedAllPlatform = false;
    }

    let selesctedmattreeArray = [];
    let selesctedmattreeArrayTooltip = [];
    let selesctedmattreeList = this.checklistSelectionPlatform.selected;
    if (selesctedmattreeList.length > 0) {
      this.tempList.forEach((d, index) => {
        selesctedmattreeList.forEach((data, index) => {
          if (data.item == d.platformName) {
            selesctedmattreeList.splice(index, 1);
          }
        });
      });

      selesctedmattreeList.forEach((data, index) => {
        selesctedmattreeArray.push(data.id);
      });
      selesctedmattreeList.forEach((data, index) => {
        selesctedmattreeArrayTooltip.push(data.item);
      });
      this.selectedSKUID = selesctedmattreeArray.join(",");
      this.selectedSKU = selesctedmattreeArrayTooltip.join(",");
    }
    else {
      // this.groupDomainPlaceholderTxt = "Group Domain";
      this.selectedSKU = "Platform";
    }
    this.getDSI(this.duration, this.selectedGroupDomain, this.selectedSKUID, this.selected, this.selectedExposure);
    this.GetGroupDomainTraigeAccuracy(this.selected, this.selectedExposure, this.selectedSKUID);
  }
  /* Platform Mat Tree End */
}

