import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';

import { ChartInfo } from '../../shared/models/chart-info';
import { genCustomer } from "../../const/gen-customer";

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

@Component({
  selector: 'cqi-gencustomersightings',
  templateUrl: './gencustomersightings.component.html',
  styleUrls: ['./gencustomersightings.component.css']
})
export class GencustomersightingsComponent implements OnInit {



  triageAccuracyData: any;
  duration = "Defect";
  loader: boolean = true;
  chartView: boolean = false;
  noDataFound: boolean = false;
  constructor(private router: Router, private service: DashboardService, private dataSvc: svcs.GenOverGenDataService, private dataShare: svcs.SharedService, private _snackBar: MatSnackBar, private modalService: NgbModal, private spinner: NgxSpinnerService) { }

  fullScreenFlag = false;

  latestchangesArray = [
    {
      "platformName": "ADL",
      "platform": "1000",
      "customer": "250",
      "silicon": "500"
    },
    {
      "platformName": "RKL",
      "platform": "1000",
      "customer": "250",
      "silicon": "500"
    },
    {
      "platformName": "TGL",
      "platform": "1000",
      "customer": "250",
      "silicon": "500"
    }
  ]

  ngOnInit(): void {
    this.dataShare.changeTitle("Gen Internal Sightings");
    this.triageAccuracyData = genCustomer;
    this.insideChart();
    this.dashboardChart();
    /*  this.service.GetCumulativeChart().subscribe(res => {
       // this.mainChart.data = res.chartDetails;
       // this.mainChart.series = res.series;  
     }); */
    this.spinner.show();
    this.chartView = false;
    this.noDataFound = false;
    this.getGenCustomerSightings("Year", "Group Domain", "Platform");
    /*  this.getGroupDomainData();
     this.getPlatformData();
     this.getGroupDomainConfig(); */
  }

  getfullScreen() {
    this.fullScreenFlag = !this.fullScreenFlag
  }
  chartInfo: ChartInfo = new ChartInfo();

  insideChart() {

    this.chartInfo.data = [
      {
        "category": "platform",
        "Count": "1000"
      },
      {
        "category": "customer",
        "Count": "550"
      },
      {
        "category": "silicon",
        "Count": "700"
      }
    ];

  }

  mainChart: ChartInfo = new ChartInfo();
  dashboardChart() {

    this.mainChart.data = [
      {
        "FilterType": "KBL",
        "customer": 614,
        "silicon": 436,
        "platform": 248,
      },
      {
        "FilterType": "RKL",
        "customer": 304,
        "silicon": 246,
        "platform": 155,
      },
      {
        "FilterType": "ICL",
        "customer": 610,
        "silicon": 553,
        "platform": 469,
      },
      {
        "FilterType": "ADL",
        "customer": 421,
        "silicon": 710,
        "platform": 472,
      },
      {
        "FilterType": "CML",
        "customer": 360,
        "silicon": 646,
        "platform": 320,
      },
      {
        "FilterType": "JSL",
        "customer": 342,
        "silicon": 688,
        "platform": 537,
      },
      {
        "FilterType": "LKF",
        "customer": 481,
        "silicon": 436,
        "platform": 554,
      },
      {
        "FilterType": "GLK",
        "customer": 467,
        "silicon": 169,
        "platform": 207,
      }
    ];

    this.mainChart.series = [
      {
        "name": "Platform",
        "valueY": "platform",
        "valueX": "FilterType",
        "width": 80
      },
      {
        "name": "Silicon",
        "valueY": "silicon",
        "valueX": "FilterType",
        "width": 78,
      },
      {
        "name": "Customer",
        "valueY": "customer",
        "valueX": "FilterType",
        "width": 76,
      }
    ];
  }

  legendClickEvent(platform: string) {
    this.router.navigate(['program-summary'], { state: { platform: platform } });
  }

  platformslist;
  selected = "Platform";
  getPlatformData() {
    this.dataSvc.getPlatform().subscribe(res => {
      if (res) {
        this.platformslist = res.platformslist;
      }
    });
  }

  getDcrDetailsList;
  ChartType = "Year"
  dcrInformation;
  getGenCustomerSightings(duration?: string, groupDomain?: string, platform?: string) {
    this.spinner.show();
    this.chartView = false;
    this.noDataFound = false;
    let data;
    if (this.duration == 'Defect') {
      data = {
        "Platform": "",
        "Viewtype": "CD",
        "Linetype": "C"
      }
    } else if (this.duration == 'Sighting') {
      data = {
        "Platform": "",
        "Viewtype": "CS",
        "Linetype": "C"
      }
    }
    this.dataSvc.getGenCustomerSightings(data).subscribe(res => {
      if (res) {
        this.getDcrDetailsList = res;
        this.dcrInformation = res.genOverGenConditionFixDetails;
        this.getDcrDetailsList.genovercustomercolourecode.forEach(d => {
          d["valueY"] = d.name.split(" ").join("") + "defects";
          d["valueX"] = "PV";
          d["tooltipText"] = d.name.split(" ").join("") + "MS";
          d["ms"] = d.name.split(" ").join("") + "MS";
          if (d.name == "Ice Lake") {
            d["isFavourite"] = true;
          } else if (d.name != "Ice Lake") {
            d["isFavourite"] = false;
          }
        });
        if (this.getDcrDetailsList == null) {
          this.spinner.hide();
          this.chartView = false;
          this.noDataFound = true;
        } else {
          this.noDataFound = false;
          this.spinner.hide();
          this.chartView = true;
          this.renderGenCustomerSightings();
        }
      }
    });
  }

  groupDomainList;
  selectedGroupDomain = "Group Domain";
  getGroupDomainData() {
    this.dataSvc.getGroupDomain().subscribe(res => {
      if (res) {
        this.groupDomainList = res.domainlist;
      }
    });
  }
  cumulativeChartData = this.returnData();
  testPlatforms;
  listLegendPlatform = [
    { platformName: "Amber Lake" },
    { platformName: "Cannon Lake" },
    { platformName: "Coffee Lake" },
    { platformName: "Whiskey Lake" },
    { platformName: "Gemini Lake" },
    { platformName: "Glacier Falls" },
    { platformName: "Kaby Lake" },
  ];
  renderGenCustomerSightings() {
    //this.cumulativeChartData = this.returnData();
    am4core.useTheme(am4themes_animated);
    am4core.options.autoSetClassName = true;
    am4core.options.commercialLicense = true;

    const chart = am4core.create('chartdiv', am4charts.XYChart);

    chart.padding(0, 30, 0, 0);
    chart.margin(0, 0, 0, 0);
    chart.align = 'center';

    chart.maskBullets = false;

    chart.data = this.getDcrDetailsList.data;
    let titleHeader;
    this.dataShare.currentTitle.subscribe(res => titleHeader = res);
    const title = chart.titles.create();
    title.text = titleHeader;
    title.fontWeight = '600';
    title.fill = am4core.color('#fff');
    title.fontSize = '25';
    title.marginBottom = 15;
    title.marginTop = 0;
    title.align = 'center';
    title.paddingLeft = 10;

    // Create axes
    const valueAxisX = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxisX.title.text = '[bold] Work Week';
    valueAxisX.fontSize = '7';
    valueAxisX.numberFormatter.numberFormat = "#|#|'PV'";
    valueAxisX.renderer.minGridDistance = 40;
    valueAxisX.renderer.grid.template.location = 0;
    valueAxisX.renderer.grid.template.disabled = true;
    valueAxisX.renderer.fullWidthTooltip = true;
    valueAxisX.renderer.baseGrid.strokeWidth = 1;
    valueAxisX.renderer.baseGrid.strokeOpacity = 1;
    valueAxisX.renderer.baseGrid.stroke = am4core.color('#d9d9d9');
    valueAxisX.renderer.baseGrid.strokeDasharray = 'dotted';
    //  valueAxisX.renderer.labels.template.fill = am4core.color('#04a8df');

    const valueAxisY = chart.yAxes.push(new am4charts.ValueAxis());
    // valueAxisY.title.text = '[bold]#. of Defects';
    if (this.duration == "Defect") {
      valueAxisY.title.text = '[bold]#. of Defects';
    } else if (this.duration == 'Sighting') {
      valueAxisY.title.text = '[bold]#. of Sighting';
    }
    // valueAxisY.title.fontWeight = 'bold';
    //  valueAxisY.renderer.baseGrid.disabled = true;
    //  valueAxisY.numberFormatter.numberFormat="#|#|'0'";
    valueAxisY.renderer.grid.template.disabled = true;

    // Create series

    // Series 1
    let i = 0;
    this.getDcrDetailsList.genovercustomercolourecode.forEach(d => {
      i += 1;
      const lineSeries = chart.series.push(new am4charts.LineSeries());
      lineSeries.dataFields.valueY = d.valueY;
      lineSeries.dataFields.valueX = d.valueX;
      lineSeries.strokeWidth = 2;
      lineSeries.stroke = am4core.color(d.colorcode);
      lineSeries.fill = am4core.color(d.colorcode);
      if (d.isFavourite === true) {
        lineSeries.id = 'g' + i;
      } else {
        lineSeries.id = d.valueY;
      }
      lineSeries.name = d.name;

      lineSeries.minBulletDistance = 10;
      lineSeries.tooltipText = "{valueY}";
      lineSeries.tooltip.pointerOrientation = "vertical";
      lineSeries.tooltip.background.cornerRadius = 20;
      lineSeries.tooltip.background.fillOpacity = 0.5;
      lineSeries.tooltip.label.padding(12, 12, 12, 12)

      /* const lineBullet = lineSeries.bullets.push(new am4charts.CircleBullet());
      lineBullet.tooltipText = '[font-size: 11px;]{name}: {valueY} '; */

      /*  const lineLabel = lineSeries.bullets.push(new am4charts.LabelBullet());
       lineLabel.label.text = '[font-size: 10px;]{' + d.name + '}';
 
       const lineLabel1 = lineSeries.bullets.push(new am4charts.LabelBullet());
       lineLabel1.label.text = '[font-size: 11px;]{' + d.name + '}';
       lineLabel1.dx = 35;
       lineLabel1.dy = 0;
       lineLabel1.label.fill = am4core.color('#000000');;
       lineLabel1.label.background.fill = d.colorcode;
 
       lineLabel.label.horizontalCenter = 'left';
       lineLabel.label.dx = 7;
       lineLabel.label.dy = 7; */

    });

    // Add cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.fullWidthLineX = true;
    chart.cursor.lineX.strokeOpacity = 0;
    chart.cursor.lineX.fill = am4core.color('#000');
    chart.cursor.lineX.fillOpacity = 0.1;
    chart.zoomOutButton.valign = 'bottom';
    //  chart.zoomOutButton.disabled = true;

    //  Scroll Bar
    chart.scrollbarX = new am4core.Scrollbar();
    chart.scrollbarX.animationDuration = 0;
    chart.scrollbarX.thumb.minWidth = 50;
    chart.scrollbarX.thumb.maxHeight = 21;
    chart.scrollbarX.marginTop = 10;
    chart.scrollbarX.marginBottom = 0;
    chart.scrollbarX.parent = chart.bottomAxesContainer;
    /* chart.scrollbarX.thumb.background.fill = am4core.color('#fff');
    chart.scrollbarX.thumb.background.stroke = am4core.color('#072f39');
    chart.scrollbarX.thumb.background.fillOpacity = 0.2;
    chart.scrollbarX.background.fill = am4core.color('#fff');
    chart.scrollbarX.thumb.background.fill = am4core.color('#fff');
    chart.scrollbarX.startGrip.background.fill = am4core.color('#fff');
    chart.scrollbarX.endGrip.background.fill = am4core.color('#fff');
    chart.scrollbarX.stroke = am4core.color('#fff');
    chart.scrollbarX.thumb.background.strokeWidth = 4; */

    // Code Added BY SRP


    const ToggleSeries = chart.series.push(new am4charts.LineSeries());
    ToggleSeries.dataFields.valueY = 'void'; // d.valueY;
    ToggleSeries.dataFields.valueX = 'PVWeek'; //  d.valueX;
    ToggleSeries.strokeWidth = 2;
    ToggleSeries.stroke = am4core.color('#ff3838');
    ToggleSeries.fill = am4core.color('#ff3838');

    ToggleSeries.id = 'void'; // d.valueY;

    ToggleSeries.name = 'Toggle All'; // d.name;


    const lineBullet = ToggleSeries.bullets.push(new am4charts.CircleBullet());
    lineBullet.circle.fill = am4core.color('#fff');
    lineBullet.circle.strokeWidth = 2;
    lineBullet.circle.propertyFields.radius = '3'; // d.radius;
    lineBullet.tooltipText = '[font-size: 11px;]{name}: {valueY} \n SKU:  MS Week:  OS: ';

    const lineState = lineBullet.states.create('hover');
    lineState.properties.scale = 1.2;

    const lineLabel = ToggleSeries.bullets.push(new am4charts.LabelBullet());
    lineLabel.label.text = '[font-size: 10px;]';
    lineLabel.label.horizontalCenter = 'left';
    lineLabel.label.dx = 7;
    lineLabel.label.dy = 7;

    // console.log('Series Length', chart.series.length);

    chart.legend = new am4charts.Legend();
    chart.legend.padding(0, 15, 0, 15);
    chart.legend.margin(0, 0, 0, 0);


    chart.legend.itemContainers.template.events.on('hit', (ev) => {
      const keyName = 'name';
      const keyHidden = 'isHidden';
      const legendName = ev.target.dataItem.dataContext[keyName];
      const isLegendHidden = ev.target.dataItem.dataContext[keyHidden];
      if (legendName !== 'Toggle All') {
        this.listLegendPlatform = [];
        this.dataShare.getLegend.subscribe(res => { this.listLegendPlatform = res; });
        let id = 1;
        if (this.listLegendPlatform != null) {
          id = this.listLegendPlatform.length + 1;
        }

        if (isLegendHidden) {

          this.listLegendPlatform.splice(this.listLegendPlatform.findIndex(x => x.platformName === legendName), 1);
        } else {

          this.listLegendPlatform.push({
            platformName: legendName
          });
        }

        this.dataShare.setLegend(this.listLegendPlatform);
      } else {
        if (isLegendHidden) {
          this.listLegendPlatform = [];
          this.dataShare.setLegend(this.listLegendPlatform);
        } else {
          this.listLegendPlatform = [];
          chart.series.values.forEach(s => {
            this.listLegendPlatform.push({ platformName: s.name });
          });
          this.dataShare.setLegend(this.listLegendPlatform);

        }

      }

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


    });



    this.listLegendPlatform = [];

    this.dataShare.getLegend.subscribe(res => { this.listLegendPlatform = res; });

    const checkLegendPlatformExistence = roleParam => this.listLegendPlatform.some(({ platformName }) => platformName === roleParam);

    if (this.listLegendPlatform != null) {
      chart.series.values.forEach(s => {
        // console.log('Series Name', s.name);
        // console.log('hiddenState' + s.name, s.hiddenState);
        if (checkLegendPlatformExistence(s.name)) {
          s.hidden = true;
        }
      });
    }



    /* exporting chart */
    // chart.exporting.menu = new am4core.ExportMenu();
    // chart.exporting.menu.align = 'right';
    // chart.exporting.menu.verticalAlign = 'top';

    // chart.exporting.menu.items = [
    //   {
    //     'label':'export',
    //     'menu': [
    //       {
    //         'label': 'Image',
    //         'menu': [
    //           { 'type': 'png', 'label': 'PNG' },
    //           { 'type': 'jpg', 'label': 'JPG' },
    //           { 'type': 'svg', 'label': 'SVG' },
    //           { 'type': 'pdf', 'label': 'PDF' }
    //         ]
    //       }, {
    //         'label': 'Print', 'type': 'print'
    //       }
    //     ]
    //   }
    // ];
    this.dataShare.change(false);

  }

  onPlatformValChange(value) {
    this.spinner.show();
    this.chartView = false;
    this.selected = value;
    this.getGenCustomerSightings(this.duration, this.selectedGroupDomain, this.selected);
  }

  onGroupValChange(value) {
    this.spinner.show();
    this.chartView = false;
    this.selectedGroupDomain = value;
    this.getGenCustomerSightings(this.duration, this.selectedGroupDomain, this.selected);
  }

  onValChange(value) {
    this.spinner.show();
    this.chartView = false;
    this.duration = value;
    this.getGenCustomerSightings(this.duration, this.selectedGroupDomain, this.selected);
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

  returnData() {
    return {
      "Series": [
        {
          "name": "Alder Lake",
          "valueY": "AlderLakeDefects",
          "valueX": "PVWeek",
          "tooltipText": "AlderLakeMS",
          "ms": "AlderLakeMS",
          "color": "#384f6c",
          "isFavourite": false,
          "radius": "AlderLakeMSSize",
          "os": "AlderLakeOS",
          "sku": "AlderLakeSKU",
          "ww": "AlderLakeWW",
          "PlatformID": 47,
          "ProgramSkuID": null,
          "ProgramDesignID": null,
          "Label": "AlderLakeLabel",
          "LabelColor": null,
          "RadiusBG": "AlderLakeRadiusBG"
        },
        {
          "name": "Amber Lake",
          "valueY": "AmberLakeDefects",
          "valueX": "PVWeek",
          "tooltipText": "AmberLakeMS",
          "ms": "AmberLakeMS",
          "color": "#d35400",
          "isFavourite": false,
          "radius": "AmberLakeMSSize",
          "os": "AmberLakeOS",
          "sku": "AmberLakeSKU",
          "ww": "AmberLakeWW",
          "PlatformID": 10,
          "ProgramSkuID": null,
          "ProgramDesignID": null,
          "Label": "AmberLakeLabel",
          "LabelColor": "#ffffff",
          "RadiusBG": "AmberLakeRadiusBG"
        },
        {
          "name": "Cannon Lake",
          "valueY": "CannonLakeDefects",
          "valueX": "PVWeek",
          "tooltipText": "CannonLakeMS",
          "ms": "CannonLakeMS",
          "color": "#633a82",
          "isFavourite": false,
          "radius": "CannonLakeMSSize",
          "os": "CannonLakeOS",
          "sku": "CannonLakeSKU",
          "ww": "CannonLakeWW",
          "PlatformID": 2,
          "ProgramSkuID": null,
          "ProgramDesignID": null,
          "Label": "CannonLakeLabel",
          "LabelColor": "#ffffff",
          "RadiusBG": "CannonLakeRadiusBG"
        },
        {
          "name": "Coffee Lake",
          "valueY": "CoffeeLakeDefects",
          "valueX": "PVWeek",
          "tooltipText": "CoffeeLakeMS",
          "ms": "CoffeeLakeMS",
          "color": "#FEA47F",
          "isFavourite": false,
          "radius": "CoffeeLakeMSSize",
          "os": "CoffeeLakeOS",
          "sku": "CoffeeLakeSKU",
          "ww": "CoffeeLakeWW",
          "PlatformID": 3,
          "ProgramSkuID": null,
          "ProgramDesignID": null,
          "Label": "CoffeeLakeLabel",
          "LabelColor": "#000000",
          "RadiusBG": "CoffeeLakeRadiusBG"
        },
        {
          "name": "Comet Lake",
          "valueY": "CometLakeDefects",
          "valueX": "PVWeek",
          "tooltipText": "CometLakeMS",
          "ms": "CometLakeMS",
          "color": "#7b7b7b",
          "isFavourite": false,
          "radius": "CometLakeMSSize",
          "os": "CometLakeOS",
          "sku": "CometLakeSKU",
          "ww": "CometLakeWW",
          "PlatformID": 39,
          "ProgramSkuID": null,
          "ProgramDesignID": null,
          "Label": "CometLakeLabel",
          "LabelColor": "#ffffff",
          "RadiusBG": "CometLakeRadiusBG"
        },
        {
          "name": "Gemini Lake",
          "valueY": "GeminiLakeDefects",
          "valueX": "PVWeek",
          "tooltipText": "GeminiLakeMS",
          "ms": "GeminiLakeMS",
          "color": "#ee5253",
          "isFavourite": false,
          "radius": "GeminiLakeMSSize",
          "os": "GeminiLakeOS",
          "sku": "GeminiLakeSKU",
          "ww": "GeminiLakeWW",
          "PlatformID": 6,
          "ProgramSkuID": null,
          "ProgramDesignID": null,
          "Label": "GeminiLakeLabel",
          "LabelColor": "#ffffff",
          "RadiusBG": "GeminiLakeRadiusBG"
        },
        {
          "name": "Ice Lake",
          "valueY": "IceLakeDefects",
          "valueX": "PVWeek",
          "tooltipText": "IceLakeMS",
          "ms": "IceLakeMS",
          "color": "#F6FF33",
          "isFavourite": true,
          "radius": "IceLakeMSSize",
          "os": "IceLakeOS",
          "sku": "IceLakeSKU",
          "ww": "IceLakeWW",
          "PlatformID": 4,
          "ProgramSkuID": null,
          "ProgramDesignID": null,
          "Label": "IceLakeLabel",
          "LabelColor": "#000000",
          "RadiusBG": "IceLakeRadiusBG"
        },
        {
          "name": "Jasper Lake",
          "valueY": "JasperLakeDefects",
          "valueX": "PVWeek",
          "tooltipText": "JasperLakeMS",
          "ms": "JasperLakeMS",
          "color": "#2f4d4d",
          "isFavourite": false,
          "radius": "JasperLakeMSSize",
          "os": "JasperLakeOS",
          "sku": "JasperLakeSKU",
          "ww": "JasperLakeWW",
          "PlatformID": 28,
          "ProgramSkuID": null,
          "ProgramDesignID": null,
          "Label": "JasperLakeLabel",
          "LabelColor": "#ffffff",
          "RadiusBG": "JasperLakeRadiusBG"
        },
        {
          "name": "Kaby Lake",
          "valueY": "KabyLakeDefects",
          "valueX": "PVWeek",
          "tooltipText": "KabyLakeMS",
          "ms": "KabyLakeMS",
          "color": "#0984e3",
          "isFavourite": false,
          "radius": "KabyLakeMSSize",
          "os": "KabyLakeOS",
          "sku": "KabyLakeSKU",
          "ww": "KabyLakeWW",
          "PlatformID": 1,
          "ProgramSkuID": null,
          "ProgramDesignID": null,
          "Label": "KabyLakeLabel",
          "LabelColor": "#ffffff",
          "RadiusBG": "KabyLakeRadiusBG"
        },
        {
          "name": "Lake Field",
          "valueY": "LakeFieldDefects",
          "valueX": "PVWeek",
          "tooltipText": "LakeFieldMS",
          "ms": "LakeFieldMS",
          "color": "#3ae374",
          "isFavourite": false,
          "radius": "LakeFieldMSSize",
          "os": "LakeFieldOS",
          "sku": "LakeFieldSKU",
          "ww": "LakeFieldWW",
          "PlatformID": 5,
          "ProgramSkuID": null,
          "ProgramDesignID": null,
          "Label": "LakeFieldLabel",
          "LabelColor": "#000000",
          "RadiusBG": "LakeFieldRadiusBG"
        },
        {
          "name": "Rocket Lake",
          "valueY": "RocketLakeDefects",
          "valueX": "PVWeek",
          "tooltipText": "RocketLakeMS",
          "ms": "RocketLakeMS",
          "color": "#593f57",
          "isFavourite": false,
          "radius": "RocketLakeMSSize",
          "os": "RocketLakeOS",
          "sku": "RocketLakeSKU",
          "ww": "RocketLakeWW",
          "PlatformID": 22,
          "ProgramSkuID": null,
          "ProgramDesignID": null,
          "Label": "RocketLakeLabel",
          "LabelColor": "#ffffff",
          "RadiusBG": "RocketLakeRadiusBG"
        },
        {
          "name": "Sky Lake",
          "valueY": "SkyLakeDefects",
          "valueX": "PVWeek",
          "tooltipText": "SkyLakeMS",
          "ms": "SkyLakeMS",
          "color": "#7efff5",
          "isFavourite": false,
          "radius": "SkyLakeMSSize",
          "os": "SkyLakeOS",
          "sku": "SkyLakeSKU",
          "ww": "SkyLakeWW",
          "PlatformID": 41,
          "ProgramSkuID": null,
          "ProgramDesignID": null,
          "Label": "SkyLakeLabel",
          "LabelColor": "#000000",
          "RadiusBG": "SkyLakeRadiusBG"
        },
        {
          "name": "Tiger Lake",
          "valueY": "TigerLakeDefects",
          "valueX": "PVWeek",
          "tooltipText": "TigerLakeMS",
          "ms": "TigerLakeMS",
          "color": "#BC0494",
          "isFavourite": false,
          "radius": "TigerLakeMSSize",
          "os": "TigerLakeOS",
          "sku": "TigerLakeSKU",
          "ww": "TigerLakeWW",
          "PlatformID": 14,
          "ProgramSkuID": null,
          "ProgramDesignID": null,
          "Label": "TigerLakeLabel",
          "LabelColor": "#ffffff",
          "RadiusBG": "TigerLakeRadiusBG"
        },
        {
          "name": "Whiskey Lake",
          "valueY": "WhiskeyLakeDefects",
          "valueX": "PVWeek",
          "tooltipText": "WhiskeyLakeMS",
          "ms": "WhiskeyLakeMS",
          "color": "#D6A2E8",
          "isFavourite": false,
          "radius": "WhiskeyLakeMSSize",
          "os": "WhiskeyLakeOS",
          "sku": "WhiskeyLakeSKU",
          "ww": "WhiskeyLakeWW",
          "PlatformID": 9,
          "ProgramSkuID": null,
          "ProgramDesignID": null,
          "Label": "WhiskeyLakeLabel",
          "LabelColor": "#000000",
          "RadiusBG": "WhiskeyLakeRadiusBG"
        }
      ],
      "Data": [
        {
          "PVWeek": "PV-157",
          "CannonLakeDefects": 0,
          "CannonLakeMS": null,
          "CannonLakeSKU": null,
          "CannonLakeOS": null,
          "CannonLakeWW": null,
          "CannonLakeMSSize": 2,
          "CannonLakeLabel": "",
          "CannonLakeRadiusBG": "#633a82"
        },
        {
          "PVWeek": "PV-150",
          "CannonLakeDefects": 1,
          "CannonLakeMS": null,
          "CannonLakeSKU": null,
          "CannonLakeOS": null,
          "CannonLakeWW": null,
          "CannonLakeMSSize": 2,
          "CannonLakeLabel": "",
          "CannonLakeRadiusBG": "#633a82"
        },
        {
          "PVWeek": "PV-140",
          "CannonLakeDefects": 2,
          "CannonLakeMS": null,
          "CannonLakeSKU": null,
          "CannonLakeOS": null,
          "CannonLakeWW": null,
          "CannonLakeMSSize": 2,
          "CannonLakeLabel": "",
          "CannonLakeRadiusBG": "#633a82"
        },
        {
          "PVWeek": "PV-130",
          "CannonLakeDefects": 3,
          "CannonLakeMS": null,
          "CannonLakeSKU": null,
          "CannonLakeOS": null,
          "CannonLakeWW": null,
          "CannonLakeMSSize": 2,
          "CannonLakeLabel": "",
          "CannonLakeRadiusBG": "#633a82"
        },
        {
          "PVWeek": "PV-120",
          "CannonLakeDefects": 3,
          "CannonLakeMS": null,
          "CannonLakeSKU": null,
          "CannonLakeOS": null,
          "CannonLakeWW": null,
          "CannonLakeMSSize": 2,
          "CannonLakeLabel": "",
          "CannonLakeRadiusBG": "#633a82"
        },
        {
          "PVWeek": "PV-115",
          "JasperLakeDefects": 0,
          "JasperLakeMS": null,
          "JasperLakeSKU": null,
          "JasperLakeOS": null,
          "JasperLakeWW": null,
          "JasperLakeMSSize": 2,
          "JasperLakeLabel": "",
          "JasperLakeRadiusBG": "#2f4d4d"
        },
        {
          "PVWeek": "PV-110",
          "CannonLakeDefects": 4,
          "CannonLakeMS": null,
          "CannonLakeSKU": null,
          "CannonLakeOS": null,
          "CannonLakeWW": null,
          "CannonLakeMSSize": 2,
          "CannonLakeLabel": "",
          "CannonLakeRadiusBG": "#633a82",
          "JasperLakeDefects": 1,
          "JasperLakeMS": null,
          "JasperLakeSKU": null,
          "JasperLakeOS": null,
          "JasperLakeWW": null,
          "JasperLakeMSSize": 2,
          "JasperLakeLabel": "",
          "JasperLakeRadiusBG": "#2f4d4d"
        },
        {
          "PVWeek": "PV-103",
          "LakeFieldDefects": 0,
          "LakeFieldMS": null,
          "LakeFieldSKU": null,
          "LakeFieldOS": null,
          "LakeFieldWW": null,
          "LakeFieldMSSize": 2,
          "LakeFieldLabel": "",
          "LakeFieldRadiusBG": "#3ae374"
        },
        {
          "PVWeek": "PV-100",
          "CannonLakeDefects": 7,
          "CannonLakeMS": null,
          "CannonLakeSKU": null,
          "CannonLakeOS": null,
          "CannonLakeWW": null,
          "CannonLakeMSSize": 2,
          "CannonLakeLabel": "",
          "CannonLakeRadiusBG": "#633a82",
          "JasperLakeDefects": 1,
          "JasperLakeMS": null,
          "JasperLakeSKU": null,
          "JasperLakeOS": null,
          "JasperLakeWW": null,
          "JasperLakeMSSize": 2,
          "JasperLakeLabel": "",
          "JasperLakeRadiusBG": "#2f4d4d",
          "LakeFieldDefects": 9,
          "LakeFieldMS": null,
          "LakeFieldSKU": null,
          "LakeFieldOS": null,
          "LakeFieldWW": null,
          "LakeFieldMSSize": 2,
          "LakeFieldLabel": "",
          "LakeFieldRadiusBG": "#3ae374"
        },
        {
          "PVWeek": "PV-91",
          "IceLakeDefects": 0,
          "IceLakeMS": null,
          "IceLakeSKU": null,
          "IceLakeOS": null,
          "IceLakeWW": null,
          "IceLakeMSSize": 2,
          "IceLakeLabel": "",
          "IceLakeRadiusBG": "#F6FF33"
        },
        {
          "PVWeek": "PV-90",
          "CannonLakeDefects": 23,
          "CannonLakeMS": null,
          "CannonLakeSKU": null,
          "CannonLakeOS": null,
          "CannonLakeWW": null,
          "CannonLakeMSSize": 2,
          "CannonLakeLabel": "",
          "CannonLakeRadiusBG": "#633a82",
          "IceLakeDefects": 3,
          "IceLakeMS": null,
          "IceLakeSKU": null,
          "IceLakeOS": null,
          "IceLakeWW": null,
          "IceLakeMSSize": 2,
          "IceLakeLabel": "",
          "IceLakeRadiusBG": "#F6FF33",
          "JasperLakeDefects": 1,
          "JasperLakeMS": null,
          "JasperLakeSKU": null,
          "JasperLakeOS": null,
          "JasperLakeWW": null,
          "JasperLakeMSSize": 2,
          "JasperLakeLabel": "",
          "JasperLakeRadiusBG": "#2f4d4d",
          "LakeFieldDefects": 19,
          "LakeFieldMS": null,
          "LakeFieldSKU": null,
          "LakeFieldOS": null,
          "LakeFieldWW": null,
          "LakeFieldMSSize": 2,
          "LakeFieldLabel": "",
          "LakeFieldRadiusBG": "#3ae374"
        },
        {
          "PVWeek": "PV-80",
          "CannonLakeDefects": 35,
          "CannonLakeMS": null,
          "CannonLakeSKU": null,
          "CannonLakeOS": null,
          "CannonLakeWW": null,
          "CannonLakeMSSize": 2,
          "CannonLakeLabel": "",
          "CannonLakeRadiusBG": "#633a82",
          "IceLakeDefects": 22,
          "IceLakeMS": null,
          "IceLakeSKU": null,
          "IceLakeOS": null,
          "IceLakeWW": null,
          "IceLakeMSSize": 2,
          "IceLakeLabel": "",
          "IceLakeRadiusBG": "#F6FF33",
          "JasperLakeDefects": 1,
          "JasperLakeMS": null,
          "JasperLakeSKU": null,
          "JasperLakeOS": null,
          "JasperLakeWW": null,
          "JasperLakeMSSize": 2,
          "JasperLakeLabel": "",
          "JasperLakeRadiusBG": "#2f4d4d",
          "LakeFieldDefects": 35,
          "LakeFieldMS": null,
          "LakeFieldSKU": null,
          "LakeFieldOS": null,
          "LakeFieldWW": null,
          "LakeFieldMSSize": 2,
          "LakeFieldLabel": "",
          "LakeFieldRadiusBG": "#3ae374"
        },
        {
          "PVWeek": "PV-74",
          "IceLakeDefects": 62,
          "IceLakeMS": "POE-S",
          "IceLakeSKU": "S",
          "IceLakeOS": null,
          "IceLakeWW": "5'18",
          "IceLakeMSSize": 3,
          "IceLakeLabel": "",
          "IceLakeRadiusBG": "#ffffff"
        },
        {
          "PVWeek": "PV-73",
          "SkyLakeDefects": 0,
          "SkyLakeMS": null,
          "SkyLakeSKU": null,
          "SkyLakeOS": null,
          "SkyLakeWW": null,
          "SkyLakeMSSize": 2,
          "SkyLakeLabel": "",
          "SkyLakeRadiusBG": "#7efff5"
        },
        {
          "PVWeek": "PV-71",
          "GeminiLakeDefects": 0,
          "GeminiLakeMS": null,
          "GeminiLakeSKU": null,
          "GeminiLakeOS": null,
          "GeminiLakeWW": null,
          "GeminiLakeMSSize": 2,
          "GeminiLakeLabel": "",
          "GeminiLakeRadiusBG": "#ee5253"
        },
        {
          "PVWeek": "PV-70",
          "CannonLakeDefects": 80,
          "CannonLakeMS": null,
          "CannonLakeSKU": null,
          "CannonLakeOS": null,
          "CannonLakeWW": null,
          "CannonLakeMSSize": 2,
          "CannonLakeLabel": "",
          "CannonLakeRadiusBG": "#633a82",
          "GeminiLakeDefects": 2,
          "GeminiLakeMS": null,
          "GeminiLakeSKU": null,
          "GeminiLakeOS": null,
          "GeminiLakeWW": null,
          "GeminiLakeMSSize": 2,
          "GeminiLakeLabel": "",
          "GeminiLakeRadiusBG": "#ee5253",
          "IceLakeDefects": 103,
          "IceLakeMS": null,
          "IceLakeSKU": null,
          "IceLakeOS": null,
          "IceLakeWW": null,
          "IceLakeMSSize": 2,
          "IceLakeLabel": "",
          "IceLakeRadiusBG": "#F6FF33",
          "JasperLakeDefects": 6,
          "JasperLakeMS": null,
          "JasperLakeSKU": null,
          "JasperLakeOS": null,
          "JasperLakeWW": null,
          "JasperLakeMSSize": 2,
          "JasperLakeLabel": "",
          "JasperLakeRadiusBG": "#2f4d4d",
          "LakeFieldDefects": 63,
          "LakeFieldMS": null,
          "LakeFieldSKU": null,
          "LakeFieldOS": null,
          "LakeFieldWW": null,
          "LakeFieldMSSize": 2,
          "LakeFieldLabel": "",
          "LakeFieldRadiusBG": "#3ae374",
          "SkyLakeDefects": 7,
          "SkyLakeMS": null,
          "SkyLakeSKU": null,
          "SkyLakeOS": null,
          "SkyLakeWW": null,
          "SkyLakeMSSize": 2,
          "SkyLakeLabel": "",
          "SkyLakeRadiusBG": "#7efff5",
          "TigerLakeDefects": 0,
          "TigerLakeMS": null,
          "TigerLakeSKU": null,
          "TigerLakeOS": null,
          "TigerLakeWW": null,
          "TigerLakeMSSize": 2,
          "TigerLakeLabel": "",
          "TigerLakeRadiusBG": "#BC0494"
        },
        {
          "PVWeek": "PV-64",
          "AlderLakeDefects": 0,
          "AlderLakeMS": null,
          "AlderLakeSKU": null,
          "AlderLakeOS": null,
          "AlderLakeWW": null,
          "AlderLakeMSSize": 2,
          "AlderLakeLabel": "",
          "AlderLakeRadiusBG": "#384f6c"
        },
        {
          "PVWeek": "PV-60",
          "AlderLakeDefects": 4,
          "AlderLakeMS": null,
          "AlderLakeSKU": null,
          "AlderLakeOS": null,
          "AlderLakeWW": null,
          "AlderLakeMSSize": 2,
          "AlderLakeLabel": "",
          "AlderLakeRadiusBG": "#384f6c",
          "CannonLakeDefects": 283,
          "CannonLakeMS": null,
          "CannonLakeSKU": null,
          "CannonLakeOS": null,
          "CannonLakeWW": null,
          "CannonLakeMSSize": 2,
          "CannonLakeLabel": "",
          "CannonLakeRadiusBG": "#633a82",
          "GeminiLakeDefects": 74,
          "GeminiLakeMS": null,
          "GeminiLakeSKU": null,
          "GeminiLakeOS": null,
          "GeminiLakeWW": null,
          "GeminiLakeMSSize": 2,
          "GeminiLakeLabel": "",
          "GeminiLakeRadiusBG": "#ee5253",
          "IceLakeDefects": 291,
          "IceLakeMS": null,
          "IceLakeSKU": null,
          "IceLakeOS": null,
          "IceLakeWW": null,
          "IceLakeMSSize": 2,
          "IceLakeLabel": "",
          "IceLakeRadiusBG": "#F6FF33",
          "JasperLakeDefects": 31,
          "JasperLakeMS": null,
          "JasperLakeSKU": null,
          "JasperLakeOS": null,
          "JasperLakeWW": null,
          "JasperLakeMSSize": 2,
          "JasperLakeLabel": "",
          "JasperLakeRadiusBG": "#2f4d4d",
          "LakeFieldDefects": 169,
          "LakeFieldMS": null,
          "LakeFieldSKU": null,
          "LakeFieldOS": null,
          "LakeFieldWW": null,
          "LakeFieldMSSize": 2,
          "LakeFieldLabel": "",
          "LakeFieldRadiusBG": "#3ae374",
          "SkyLakeDefects": 15,
          "SkyLakeMS": null,
          "SkyLakeSKU": null,
          "SkyLakeOS": null,
          "SkyLakeWW": null,
          "SkyLakeMSSize": 2,
          "SkyLakeLabel": "",
          "SkyLakeRadiusBG": "#7efff5",
          "TigerLakeDefects": 65,
          "TigerLakeMS": null,
          "TigerLakeSKU": null,
          "TigerLakeOS": null,
          "TigerLakeWW": null,
          "TigerLakeMSSize": 2,
          "TigerLakeLabel": "",
          "TigerLakeRadiusBG": "#BC0494"
        },
        {
          "PVWeek": "PV-59",
          "KabyLakeDefects": 0,
          "KabyLakeMS": null,
          "KabyLakeSKU": null,
          "KabyLakeOS": null,
          "KabyLakeWW": null,
          "KabyLakeMSSize": 2,
          "KabyLakeLabel": "",
          "KabyLakeRadiusBG": "#0984e3",
          "TigerLakeDefects": 79,
          "TigerLakeMS": "POE-UP3",
          "TigerLakeSKU": "UP3",
          "TigerLakeOS": null,
          "TigerLakeWW": "26'19",
          "TigerLakeMSSize": 3,
          "TigerLakeLabel": "",
          "TigerLakeRadiusBG": "#ffffff"
        },
        {
          "PVWeek": "PV-57",
          "CometLakeDefects": 0,
          "CometLakeMS": null,
          "CometLakeSKU": null,
          "CometLakeOS": null,
          "CometLakeWW": null,
          "CometLakeMSSize": 2,
          "CometLakeLabel": "",
          "CometLakeRadiusBG": "#7b7b7b"
        },
        {
          "PVWeek": "PV-54",
          "CoffeeLakeDefects": 0,
          "CoffeeLakeMS": null,
          "CoffeeLakeSKU": null,
          "CoffeeLakeOS": null,
          "CoffeeLakeWW": null,
          "CoffeeLakeMSSize": 2,
          "CoffeeLakeLabel": "",
          "CoffeeLakeRadiusBG": "#FEA47F",
          "RocketLakeDefects": 0,
          "RocketLakeMS": null,
          "RocketLakeSKU": null,
          "RocketLakeOS": null,
          "RocketLakeWW": null,
          "RocketLakeMSSize": 2,
          "RocketLakeLabel": "",
          "RocketLakeRadiusBG": "#593f57"
        },
        {
          "PVWeek": "PV-50",
          "AlderLakeDefects": 33,
          "AlderLakeMS": null,
          "AlderLakeSKU": null,
          "AlderLakeOS": null,
          "AlderLakeWW": null,
          "AlderLakeMSSize": 2,
          "AlderLakeLabel": "",
          "AlderLakeRadiusBG": "#384f6c",
          "CannonLakeDefects": 465,
          "CannonLakeMS": null,
          "CannonLakeSKU": null,
          "CannonLakeOS": null,
          "CannonLakeWW": null,
          "CannonLakeMSSize": 2,
          "CannonLakeLabel": "",
          "CannonLakeRadiusBG": "#633a82",
          "CoffeeLakeDefects": 12,
          "CoffeeLakeMS": null,
          "CoffeeLakeSKU": null,
          "CoffeeLakeOS": null,
          "CoffeeLakeWW": null,
          "CoffeeLakeMSSize": 2,
          "CoffeeLakeLabel": "",
          "CoffeeLakeRadiusBG": "#FEA47F",
          "CometLakeDefects": 27,
          "CometLakeMS": null,
          "CometLakeSKU": null,
          "CometLakeOS": null,
          "CometLakeWW": null,
          "CometLakeMSSize": 2,
          "CometLakeLabel": "",
          "CometLakeRadiusBG": "#7b7b7b",
          "GeminiLakeDefects": 250,
          "GeminiLakeMS": null,
          "GeminiLakeSKU": null,
          "GeminiLakeOS": null,
          "GeminiLakeWW": null,
          "GeminiLakeMSSize": 2,
          "GeminiLakeLabel": "",
          "GeminiLakeRadiusBG": "#ee5253",
          "IceLakeDefects": 639,
          "IceLakeMS": null,
          "IceLakeSKU": null,
          "IceLakeOS": null,
          "IceLakeWW": null,
          "IceLakeMSSize": 2,
          "IceLakeLabel": "",
          "IceLakeRadiusBG": "#F6FF33",
          "JasperLakeDefects": 111,
          "JasperLakeMS": null,
          "JasperLakeSKU": null,
          "JasperLakeOS": null,
          "JasperLakeWW": null,
          "JasperLakeMSSize": 2,
          "JasperLakeLabel": "",
          "JasperLakeRadiusBG": "#2f4d4d",
          "KabyLakeDefects": 1,
          "KabyLakeMS": null,
          "KabyLakeSKU": null,
          "KabyLakeOS": null,
          "KabyLakeWW": null,
          "KabyLakeMSSize": 2,
          "KabyLakeLabel": "",
          "KabyLakeRadiusBG": "#0984e3",
          "LakeFieldDefects": 367,
          "LakeFieldMS": null,
          "LakeFieldSKU": null,
          "LakeFieldOS": null,
          "LakeFieldWW": null,
          "LakeFieldMSSize": 2,
          "LakeFieldLabel": "",
          "LakeFieldRadiusBG": "#3ae374",
          "RocketLakeDefects": 1,
          "RocketLakeMS": null,
          "RocketLakeSKU": null,
          "RocketLakeOS": null,
          "RocketLakeWW": null,
          "RocketLakeMSSize": 2,
          "RocketLakeLabel": "",
          "RocketLakeRadiusBG": "#593f57",
          "SkyLakeDefects": 38,
          "SkyLakeMS": null,
          "SkyLakeSKU": null,
          "SkyLakeOS": null,
          "SkyLakeWW": null,
          "SkyLakeMSSize": 2,
          "SkyLakeLabel": "",
          "SkyLakeRadiusBG": "#7efff5",
          "TigerLakeDefects": 212,
          "TigerLakeMS": null,
          "TigerLakeSKU": null,
          "TigerLakeOS": null,
          "TigerLakeWW": null,
          "TigerLakeMSSize": 2,
          "TigerLakeLabel": "",
          "TigerLakeRadiusBG": "#BC0494"
        },
        {
          "PVWeek": "PV-43",
          "TigerLakeDefects": 443,
          "TigerLakeMS": "A-UP3-19H1",
          "TigerLakeSKU": "UP3",
          "TigerLakeOS": "19H1",
          "TigerLakeWW": "42'19",
          "TigerLakeMSSize": 3,
          "TigerLakeLabel": "",
          "TigerLakeRadiusBG": "#ffffff"
        },
        {
          "PVWeek": "PV-40",
          "AlderLakeDefects": 116,
          "AlderLakeMS": "Pre-Alpha",
          "AlderLakeSKU": null,
          "AlderLakeOS": null,
          "AlderLakeWW": "35'20",
          "AlderLakeMSSize": 3,
          "AlderLakeLabel": "",
          "AlderLakeRadiusBG": "#ffffff",
          "CannonLakeDefects": 653,
          "CannonLakeMS": null,
          "CannonLakeSKU": null,
          "CannonLakeOS": null,
          "CannonLakeWW": null,
          "CannonLakeMSSize": 2,
          "CannonLakeLabel": "",
          "CannonLakeRadiusBG": "#633a82",
          "CoffeeLakeDefects": 74,
          "CoffeeLakeMS": null,
          "CoffeeLakeSKU": null,
          "CoffeeLakeOS": null,
          "CoffeeLakeWW": null,
          "CoffeeLakeMSSize": 2,
          "CoffeeLakeLabel": "",
          "CoffeeLakeRadiusBG": "#FEA47F",
          "CometLakeDefects": 133,
          "CometLakeMS": null,
          "CometLakeSKU": null,
          "CometLakeOS": null,
          "CometLakeWW": null,
          "CometLakeMSSize": 2,
          "CometLakeLabel": "",
          "CometLakeRadiusBG": "#7b7b7b",
          "GeminiLakeDefects": 441,
          "GeminiLakeMS": null,
          "GeminiLakeSKU": null,
          "GeminiLakeOS": null,
          "GeminiLakeWW": null,
          "GeminiLakeMSSize": 2,
          "GeminiLakeLabel": "",
          "GeminiLakeRadiusBG": "#ee5253",
          "IceLakeDefects": 956,
          "IceLakeMS": null,
          "IceLakeSKU": null,
          "IceLakeOS": null,
          "IceLakeWW": null,
          "IceLakeMSSize": 2,
          "IceLakeLabel": "",
          "IceLakeRadiusBG": "#F6FF33",
          "JasperLakeDefects": 145,
          "JasperLakeMS": null,
          "JasperLakeSKU": null,
          "JasperLakeOS": null,
          "JasperLakeWW": null,
          "JasperLakeMSSize": 2,
          "JasperLakeLabel": "",
          "JasperLakeRadiusBG": "#2f4d4d",
          "KabyLakeDefects": 3,
          "KabyLakeMS": null,
          "KabyLakeSKU": null,
          "KabyLakeOS": null,
          "KabyLakeWW": null,
          "KabyLakeMSSize": 2,
          "KabyLakeLabel": "",
          "KabyLakeRadiusBG": "#0984e3",
          "LakeFieldDefects": 476,
          "LakeFieldMS": null,
          "LakeFieldSKU": null,
          "LakeFieldOS": null,
          "LakeFieldWW": null,
          "LakeFieldMSSize": 2,
          "LakeFieldLabel": "",
          "LakeFieldRadiusBG": "#3ae374",
          "RocketLakeDefects": 42,
          "RocketLakeMS": null,
          "RocketLakeSKU": null,
          "RocketLakeOS": null,
          "RocketLakeWW": null,
          "RocketLakeMSSize": 2,
          "RocketLakeLabel": "",
          "RocketLakeRadiusBG": "#593f57",
          "SkyLakeDefects": 89,
          "SkyLakeMS": null,
          "SkyLakeSKU": null,
          "SkyLakeOS": null,
          "SkyLakeWW": null,
          "SkyLakeMSSize": 2,
          "SkyLakeLabel": "",
          "SkyLakeRadiusBG": "#7efff5",
          "TigerLakeDefects": 566,
          "TigerLakeMS": null,
          "TigerLakeSKU": null,
          "TigerLakeOS": null,
          "TigerLakeWW": null,
          "TigerLakeMSSize": 2,
          "TigerLakeLabel": "",
          "TigerLakeRadiusBG": "#BC0494"
        },
        {
          "PVWeek": "PV-37",
          "RocketLakeDefects": 54,
          "RocketLakeMS": "A-S-19H1",
          "RocketLakeSKU": "S",
          "RocketLakeOS": "19H1",
          "RocketLakeWW": "14'20",
          "RocketLakeMSSize": 3,
          "RocketLakeLabel": "",
          "RocketLakeRadiusBG": "#ffffff"
        },
        {
          "PVWeek": "PV-36",
          "AlderLakeDefects": 226,
          "AlderLakeMS": "Pre-Alpha-S-20H1",
          "AlderLakeSKU": "S",
          "AlderLakeOS": "20H1",
          "AlderLakeWW": "39'20",
          "AlderLakeMSSize": 3,
          "AlderLakeLabel": "",
          "AlderLakeRadiusBG": "#ffffff"
        },
        {
          "PVWeek": "PV-35",
          "IceLakeDefects": 1144,
          "IceLakeMS": "A-U42",
          "IceLakeSKU": "U42",
          "IceLakeOS": null,
          "IceLakeWW": "44'18",
          "IceLakeMSSize": 3,
          "IceLakeLabel": "",
          "IceLakeRadiusBG": "#ffffff"
        },
        {
          "PVWeek": "PV-30",
          "AlderLakeDefects": 330,
          "AlderLakeMS": "A",
          "AlderLakeSKU": null,
          "AlderLakeOS": null,
          "AlderLakeWW": "45'20",
          "AlderLakeMSSize": 3,
          "AlderLakeLabel": "",
          "AlderLakeRadiusBG": "#ffffff",
          "CannonLakeDefects": 746,
          "CannonLakeMS": null,
          "CannonLakeSKU": null,
          "CannonLakeOS": null,
          "CannonLakeWW": null,
          "CannonLakeMSSize": 2,
          "CannonLakeLabel": "",
          "CannonLakeRadiusBG": "#633a82",
          "CoffeeLakeDefects": 288,
          "CoffeeLakeMS": null,
          "CoffeeLakeSKU": null,
          "CoffeeLakeOS": null,
          "CoffeeLakeWW": null,
          "CoffeeLakeMSSize": 2,
          "CoffeeLakeLabel": "",
          "CoffeeLakeRadiusBG": "#FEA47F",
          "CometLakeDefects": 303,
          "CometLakeMS": null,
          "CometLakeSKU": null,
          "CometLakeOS": null,
          "CometLakeWW": null,
          "CometLakeMSSize": 2,
          "CometLakeLabel": "",
          "CometLakeRadiusBG": "#7b7b7b",
          "GeminiLakeDefects": 521,
          "GeminiLakeMS": null,
          "GeminiLakeSKU": null,
          "GeminiLakeOS": null,
          "GeminiLakeWW": null,
          "GeminiLakeMSSize": 2,
          "GeminiLakeLabel": "",
          "GeminiLakeRadiusBG": "#ee5253",
          "IceLakeDefects": 1323,
          "IceLakeMS": null,
          "IceLakeSKU": null,
          "IceLakeOS": null,
          "IceLakeWW": null,
          "IceLakeMSSize": 2,
          "IceLakeLabel": "",
          "IceLakeRadiusBG": "#F6FF33",
          "JasperLakeDefects": 221,
          "JasperLakeMS": null,
          "JasperLakeSKU": null,
          "JasperLakeOS": null,
          "JasperLakeWW": null,
          "JasperLakeMSSize": 2,
          "JasperLakeLabel": "",
          "JasperLakeRadiusBG": "#2f4d4d",
          "KabyLakeDefects": 22,
          "KabyLakeMS": null,
          "KabyLakeSKU": null,
          "KabyLakeOS": null,
          "KabyLakeWW": null,
          "KabyLakeMSSize": 2,
          "KabyLakeLabel": "",
          "KabyLakeRadiusBG": "#0984e3",
          "LakeFieldDefects": 627,
          "LakeFieldMS": null,
          "LakeFieldSKU": null,
          "LakeFieldOS": null,
          "LakeFieldWW": null,
          "LakeFieldMSSize": 2,
          "LakeFieldLabel": "",
          "LakeFieldRadiusBG": "#3ae374",
          "RocketLakeDefects": 128,
          "RocketLakeMS": null,
          "RocketLakeSKU": null,
          "RocketLakeOS": null,
          "RocketLakeWW": null,
          "RocketLakeMSSize": 2,
          "RocketLakeLabel": "",
          "RocketLakeRadiusBG": "#593f57",
          "SkyLakeDefects": 193,
          "SkyLakeMS": null,
          "SkyLakeSKU": null,
          "SkyLakeOS": null,
          "SkyLakeWW": null,
          "SkyLakeMSSize": 2,
          "SkyLakeLabel": "",
          "SkyLakeRadiusBG": "#7efff5",
          "TigerLakeDefects": 846,
          "TigerLakeMS": null,
          "TigerLakeSKU": null,
          "TigerLakeOS": null,
          "TigerLakeWW": null,
          "TigerLakeMSSize": 2,
          "TigerLakeLabel": "",
          "TigerLakeRadiusBG": "#BC0494"
        },
        {
          "PVWeek": "PV-27",
          "CoffeeLakeDefects": 428,
          "CoffeeLakeMS": "A-H-RS3",
          "CoffeeLakeSKU": "H",
          "CoffeeLakeOS": "RS3",
          "CoffeeLakeWW": "32'17",
          "CoffeeLakeMSSize": 3,
          "CoffeeLakeLabel": "",
          "CoffeeLakeRadiusBG": "#ffffff"
        },
        {
          "PVWeek": "PV-26",
          "JasperLakeDefects": 266,
          "JasperLakeMS": "A-6W-20H1",
          "JasperLakeSKU": "6W",
          "JasperLakeOS": "20H1",
          "JasperLakeWW": "19'20",
          "JasperLakeMSSize": 3,
          "JasperLakeLabel": "",
          "JasperLakeRadiusBG": "#ffffff"
        },
        {
          "PVWeek": "PV-25",
          "AlderLakeDefects": 426,
          "AlderLakeMS": "A-S-20H2",
          "AlderLakeSKU": "S",
          "AlderLakeOS": "20H2",
          "AlderLakeWW": "50'20",
          "AlderLakeMSSize": 3,
          "AlderLakeLabel": "",
          "AlderLakeRadiusBG": "#ffffff",
          "RocketLakeDefects": 308,
          "RocketLakeMS": "A-S-20H1",
          "RocketLakeSKU": "S",
          "RocketLakeOS": "20H1",
          "RocketLakeWW": "26'20",
          "RocketLakeMSSize": 3,
          "RocketLakeLabel": "",
          "RocketLakeRadiusBG": "#ffffff",
          "TigerLakeDefects": 1125,
          "TigerLakeMS": "B-UP3",
          "TigerLakeSKU": "UP3",
          "TigerLakeOS": null,
          "TigerLakeWW": "7'20",
          "TigerLakeMSSize": 3,
          "TigerLakeLabel": "",
          "TigerLakeRadiusBG": "#ffffff"
        },
        {
          "PVWeek": "PV-24",
          "AlderLakeDefects": 463,
          "AlderLakeMS": "Pre-Alpha-P-20H2",
          "AlderLakeSKU": "P",
          "AlderLakeOS": "20H2",
          "AlderLakeWW": "51'20",
          "AlderLakeMSSize": 3,
          "AlderLakeLabel": "",
          "AlderLakeRadiusBG": "#ffffff",
          "CannonLakeDefects": 838,
          "CannonLakeMS": "Pre-Alpha-HT",
          "CannonLakeSKU": "HT",
          "CannonLakeOS": null,
          "CannonLakeWW": "31'17",
          "CannonLakeMSSize": 3,
          "CannonLakeLabel": "",
          "CannonLakeRadiusBG": "#ffffff",
          "KabyLakeDefects": 140,
          "KabyLakeMS": "A-U-TH2",
          "KabyLakeSKU": "U",
          "KabyLakeOS": "TH2",
          "KabyLakeWW": "52'15",
          "KabyLakeMSSize": 3,
          "KabyLakeLabel": "",
          "KabyLakeRadiusBG": "#ffffff"
        },
        {
          "PVWeek": "PV-22",
          "CannonLakeDefects": 913,
          "CannonLakeMS": "A-HT",
          "CannonLakeSKU": "HT",
          "CannonLakeOS": null,
          "CannonLakeWW": "33'17",
          "CannonLakeMSSize": 3,
          "CannonLakeLabel": "",
          "CannonLakeRadiusBG": "#ffffff"
        },
        {
          "PVWeek": "PV-21",
          "IceLakeDefects": 1571,
          "IceLakeMS": "B-U-RS5",
          "IceLakeSKU": "U",
          "IceLakeOS": "RS5",
          "IceLakeWW": "5'19",
          "IceLakeMSSize": 3,
          "IceLakeLabel": "",
          "IceLakeRadiusBG": "#ffffff"
        },
        {
          "PVWeek": "PV-20",
          "AlderLakeDefects": 567,
          "AlderLakeMS": null,
          "AlderLakeSKU": null,
          "AlderLakeOS": null,
          "AlderLakeWW": null,
          "AlderLakeMSSize": 2,
          "AlderLakeLabel": "",
          "AlderLakeRadiusBG": "#384f6c",
          "CannonLakeDefects": 958,
          "CannonLakeMS": null,
          "CannonLakeSKU": null,
          "CannonLakeOS": null,
          "CannonLakeWW": null,
          "CannonLakeMSSize": 2,
          "CannonLakeLabel": "",
          "CannonLakeRadiusBG": "#633a82",
          "CoffeeLakeDefects": 621,
          "CoffeeLakeMS": null,
          "CoffeeLakeSKU": null,
          "CoffeeLakeOS": null,
          "CoffeeLakeWW": null,
          "CoffeeLakeMSSize": 2,
          "CoffeeLakeLabel": "",
          "CoffeeLakeRadiusBG": "#FEA47F",
          "CometLakeDefects": 556,
          "CometLakeMS": null,
          "CometLakeSKU": null,
          "CometLakeOS": null,
          "CometLakeWW": null,
          "CometLakeMSSize": 2,
          "CometLakeLabel": "",
          "CometLakeRadiusBG": "#7b7b7b",
          "GeminiLakeDefects": 581,
          "GeminiLakeMS": null,
          "GeminiLakeSKU": null,
          "GeminiLakeOS": null,
          "GeminiLakeWW": null,
          "GeminiLakeMSSize": 2,
          "GeminiLakeLabel": "",
          "GeminiLakeRadiusBG": "#ee5253",
          "IceLakeDefects": 1610,
          "IceLakeMS": null,
          "IceLakeSKU": null,
          "IceLakeOS": null,
          "IceLakeWW": null,
          "IceLakeMSSize": 2,
          "IceLakeLabel": "",
          "IceLakeRadiusBG": "#F6FF33",
          "JasperLakeDefects": 306,
          "JasperLakeMS": null,
          "JasperLakeSKU": null,
          "JasperLakeOS": null,
          "JasperLakeWW": null,
          "JasperLakeMSSize": 2,
          "JasperLakeLabel": "",
          "JasperLakeRadiusBG": "#2f4d4d",
          "KabyLakeDefects": 256,
          "KabyLakeMS": null,
          "KabyLakeSKU": null,
          "KabyLakeOS": null,
          "KabyLakeWW": null,
          "KabyLakeMSSize": 2,
          "KabyLakeLabel": "",
          "KabyLakeRadiusBG": "#0984e3",
          "LakeFieldDefects": 746,
          "LakeFieldMS": null,
          "LakeFieldSKU": null,
          "LakeFieldOS": null,
          "LakeFieldWW": null,
          "LakeFieldMSSize": 2,
          "LakeFieldLabel": "",
          "LakeFieldRadiusBG": "#3ae374",
          "RocketLakeDefects": 437,
          "RocketLakeMS": null,
          "RocketLakeSKU": null,
          "RocketLakeOS": null,
          "RocketLakeWW": null,
          "RocketLakeMSSize": 2,
          "RocketLakeLabel": "",
          "RocketLakeRadiusBG": "#593f57",
          "SkyLakeDefects": 345,
          "SkyLakeMS": null,
          "SkyLakeSKU": null,
          "SkyLakeOS": null,
          "SkyLakeWW": null,
          "SkyLakeMSSize": 2,
          "SkyLakeLabel": "",
          "SkyLakeRadiusBG": "#7efff5",
          "TigerLakeDefects": 1361,
          "TigerLakeMS": null,
          "TigerLakeSKU": null,
          "TigerLakeOS": null,
          "TigerLakeWW": null,
          "TigerLakeMSSize": 2,
          "TigerLakeLabel": "",
          "TigerLakeRadiusBG": "#BC0494"
        },
        {
          "PVWeek": "PV-18",
          "CoffeeLakeDefects": 671,
          "CoffeeLakeMS": "B-H-RS3",
          "CoffeeLakeSKU": "H",
          "CoffeeLakeOS": "RS3",
          "CoffeeLakeWW": "41'17",
          "CoffeeLakeMSSize": 3,
          "CoffeeLakeLabel": "",
          "CoffeeLakeRadiusBG": "#ffffff",
          "JasperLakeDefects": 326,
          "JasperLakeMS": "B-6W-20H1",
          "JasperLakeSKU": "6W",
          "JasperLakeOS": "20H1",
          "JasperLakeWW": "27'20",
          "JasperLakeMSSize": 3,
          "JasperLakeLabel": "",
          "JasperLakeRadiusBG": "#ffffff",
          "WhiskeyLakeDefects": 0,
          "WhiskeyLakeMS": null,
          "WhiskeyLakeSKU": null,
          "WhiskeyLakeOS": null,
          "WhiskeyLakeWW": null,
          "WhiskeyLakeMSSize": 2,
          "WhiskeyLakeLabel": "",
          "WhiskeyLakeRadiusBG": "#D6A2E8"
        },
        {
          "PVWeek": "PV-17",
          "AlderLakeDefects": 673,
          "AlderLakeMS": "B",
          "AlderLakeSKU": null,
          "AlderLakeOS": null,
          "AlderLakeWW": "6'21",
          "AlderLakeMSSize": 3,
          "AlderLakeLabel": "",
          "AlderLakeRadiusBG": "#ffffff"
        },
        {
          "PVWeek": "PV-16",
          "AlderLakeDefects": 687,
          "AlderLakeMS": "A-P-21H1",
          "AlderLakeSKU": "P",
          "AlderLakeOS": "21H1",
          "AlderLakeWW": "7'21",
          "AlderLakeMSSize": 3,
          "AlderLakeLabel": "",
          "AlderLakeRadiusBG": "#ffffff"
        },
        {
          "PVWeek": "PV-15",
          "KabyLakeDefects": 422,
          "KabyLakeMS": "B-U-TH2",
          "KabyLakeSKU": "U",
          "KabyLakeOS": "TH2",
          "KabyLakeWW": "9'16",
          "KabyLakeMSSize": 3,
          "KabyLakeLabel": "",
          "KabyLakeRadiusBG": "#ffffff"
        },
        {
          "PVWeek": "PV-14",
          "CannonLakeDefects": 1078,
          "CannonLakeMS": "B-HT",
          "CannonLakeSKU": "HT",
          "CannonLakeOS": null,
          "CannonLakeWW": "41'17",
          "CannonLakeMSSize": 3,
          "CannonLakeLabel": "",
          "CannonLakeRadiusBG": "#ffffff",
          "SkyLakeDefects": 549,
          "SkyLakeMS": "B-S-TH1",
          "SkyLakeSKU": "S",
          "SkyLakeOS": "TH1",
          "SkyLakeWW": "12'15",
          "SkyLakeMSSize": 3,
          "SkyLakeLabel": "",
          "SkyLakeRadiusBG": "#ffffff"
        },
        {
          "PVWeek": "PV-13",
          "IceLakeDefects": 1818,
          "IceLakeMS": "QS-U-19H1",
          "IceLakeSKU": "U",
          "IceLakeOS": "19H1",
          "IceLakeWW": "13'19",
          "IceLakeMSSize": 3,
          "IceLakeLabel": "",
          "IceLakeRadiusBG": "#ffffff"
        },
        {
          "PVWeek": "PV-12",
          "AlderLakeDefects": 843,
          "AlderLakeMS": "Pre-Alpha-M-20H2",
          "AlderLakeSKU": "M",
          "AlderLakeOS": "20H2",
          "AlderLakeWW": "11'21",
          "AlderLakeMSSize": 3,
          "AlderLakeLabel": "Alder Lake",
          "AlderLakeRadiusBG": "#ffffff"
        },
        {
          "PVWeek": "PV-10",
          "CannonLakeDefects": 1158,
          "CannonLakeMS": null,
          "CannonLakeSKU": null,
          "CannonLakeOS": null,
          "CannonLakeWW": null,
          "CannonLakeMSSize": 2,
          "CannonLakeLabel": "",
          "CannonLakeRadiusBG": "#633a82",
          "CoffeeLakeDefects": 914,
          "CoffeeLakeMS": null,
          "CoffeeLakeSKU": null,
          "CoffeeLakeOS": null,
          "CoffeeLakeWW": null,
          "CoffeeLakeMSSize": 2,
          "CoffeeLakeLabel": "",
          "CoffeeLakeRadiusBG": "#FEA47F",
          "CometLakeDefects": 849,
          "CometLakeMS": null,
          "CometLakeSKU": null,
          "CometLakeOS": null,
          "CometLakeWW": null,
          "CometLakeMSSize": 2,
          "CometLakeLabel": "",
          "CometLakeRadiusBG": "#7b7b7b",
          "GeminiLakeDefects": 634,
          "GeminiLakeMS": null,
          "GeminiLakeSKU": null,
          "GeminiLakeOS": null,
          "GeminiLakeWW": null,
          "GeminiLakeMSSize": 2,
          "GeminiLakeLabel": "",
          "GeminiLakeRadiusBG": "#ee5253",
          "IceLakeDefects": 1888,
          "IceLakeMS": null,
          "IceLakeSKU": null,
          "IceLakeOS": null,
          "IceLakeWW": null,
          "IceLakeMSSize": 2,
          "IceLakeLabel": "",
          "IceLakeRadiusBG": "#F6FF33",
          "JasperLakeDefects": 387,
          "JasperLakeMS": null,
          "JasperLakeSKU": null,
          "JasperLakeOS": null,
          "JasperLakeWW": null,
          "JasperLakeMSSize": 2,
          "JasperLakeLabel": "",
          "JasperLakeRadiusBG": "#2f4d4d",
          "KabyLakeDefects": 563,
          "KabyLakeMS": null,
          "KabyLakeSKU": null,
          "KabyLakeOS": null,
          "KabyLakeWW": null,
          "KabyLakeMSSize": 2,
          "KabyLakeLabel": "",
          "KabyLakeRadiusBG": "#0984e3",
          "LakeFieldDefects": 848,
          "LakeFieldMS": null,
          "LakeFieldSKU": null,
          "LakeFieldOS": null,
          "LakeFieldWW": null,
          "LakeFieldMSSize": 2,
          "LakeFieldLabel": "",
          "LakeFieldRadiusBG": "#3ae374",
          "RocketLakeDefects": 679,
          "RocketLakeMS": "B-S-20H2",
          "RocketLakeSKU": "S",
          "RocketLakeOS": "20H2",
          "RocketLakeWW": "41'20",
          "RocketLakeMSSize": 3,
          "RocketLakeLabel": "",
          "RocketLakeRadiusBG": "#ffffff",
          "SkyLakeDefects": 616,
          "SkyLakeMS": null,
          "SkyLakeSKU": null,
          "SkyLakeOS": null,
          "SkyLakeWW": null,
          "SkyLakeMSSize": 2,
          "SkyLakeLabel": "",
          "SkyLakeRadiusBG": "#7efff5",
          "TigerLakeDefects": 1802,
          "TigerLakeMS": null,
          "TigerLakeSKU": null,
          "TigerLakeOS": null,
          "TigerLakeWW": null,
          "TigerLakeMSSize": 2,
          "TigerLakeLabel": "",
          "TigerLakeRadiusBG": "#BC0494",
          "WhiskeyLakeDefects": 63,
          "WhiskeyLakeMS": null,
          "WhiskeyLakeSKU": null,
          "WhiskeyLakeOS": null,
          "WhiskeyLakeWW": null,
          "WhiskeyLakeMSSize": 2,
          "WhiskeyLakeLabel": "",
          "WhiskeyLakeRadiusBG": "#D6A2E8"
        },
        {
          "PVWeek": "PV-9",
          "AmberLakeDefects": 0,
          "AmberLakeMS": null,
          "AmberLakeSKU": null,
          "AmberLakeOS": null,
          "AmberLakeWW": null,
          "AmberLakeMSSize": 2,
          "AmberLakeLabel": "",
          "AmberLakeRadiusBG": "#d35400",
          "JasperLakeDefects": 408,
          "JasperLakeMS": "QS",
          "JasperLakeSKU": null,
          "JasperLakeOS": null,
          "JasperLakeWW": "36'20",
          "JasperLakeMSSize": 3,
          "JasperLakeLabel": "",
          "JasperLakeRadiusBG": "#ffffff"
        },
        {
          "PVWeek": "PV-6",
          "CannonLakeDefects": 1228,
          "CannonLakeMS": "QS-HT",
          "CannonLakeSKU": "HT",
          "CannonLakeOS": null,
          "CannonLakeWW": "49'17",
          "CannonLakeMSSize": 3,
          "CannonLakeLabel": "",
          "CannonLakeRadiusBG": "#ffffff",
          "TigerLakeDefects": 2010,
          "TigerLakeMS": "QS-UP3",
          "TigerLakeSKU": "UP3",
          "TigerLakeOS": null,
          "TigerLakeWW": "26'20",
          "TigerLakeMSSize": 3,
          "TigerLakeLabel": "",
          "TigerLakeRadiusBG": "#ffffff"
        },
        {
          "PVWeek": "PV+0",
          "AmberLakeDefects": 43,
          "AmberLakeMS": "PV-Y-RS4",
          "AmberLakeSKU": "Y",
          "AmberLakeOS": "RS4",
          "AmberLakeWW": "25'18",
          "AmberLakeMSSize": 3,
          "AmberLakeLabel": "",
          "AmberLakeRadiusBG": "#ffffff",
          "CannonLakeDefects": 1290,
          "CannonLakeMS": "PV-HT",
          "CannonLakeSKU": "HT",
          "CannonLakeOS": null,
          "CannonLakeWW": "2'18",
          "CannonLakeMSSize": 3,
          "CannonLakeLabel": "",
          "CannonLakeRadiusBG": "#ffffff",
          "CoffeeLakeDefects": 1120,
          "CoffeeLakeMS": "PV-H-RS3",
          "CoffeeLakeSKU": "H",
          "CoffeeLakeOS": "RS3",
          "CoffeeLakeWW": "6'18",
          "CoffeeLakeMSSize": 3,
          "CoffeeLakeLabel": "",
          "CoffeeLakeRadiusBG": "#ffffff",
          "CometLakeDefects": 1082,
          "CometLakeMS": "PV-NA",
          "CometLakeSKU": "NA",
          "CometLakeOS": null,
          "CometLakeWW": "5'20",
          "CometLakeMSSize": 3,
          "CometLakeLabel": "",
          "CometLakeRadiusBG": "#ffffff",
          "GeminiLakeDefects": 658,
          "GeminiLakeMS": "PV-R",
          "GeminiLakeSKU": "R",
          "GeminiLakeOS": null,
          "GeminiLakeWW": "3'18",
          "GeminiLakeMSSize": 3,
          "GeminiLakeLabel": "",
          "GeminiLakeRadiusBG": "#ffffff",
          "IceLakeDefects": 2347,
          "IceLakeMS": "PV-U-19H1",
          "IceLakeSKU": "U",
          "IceLakeOS": "19H1",
          "IceLakeWW": "26'19",
          "IceLakeMSSize": 3,
          "IceLakeLabel": "",
          "IceLakeRadiusBG": "#ffffff",
          "JasperLakeDefects": 478,
          "JasperLakeMS": "PV-NA-20H1",
          "JasperLakeSKU": "NA",
          "JasperLakeOS": "20H1",
          "JasperLakeWW": "45'20",
          "JasperLakeMSSize": 3,
          "JasperLakeLabel": "",
          "JasperLakeRadiusBG": "#ffffff",
          "KabyLakeDefects": 982,
          "KabyLakeMS": "PV-U-TH2",
          "KabyLakeSKU": "U",
          "KabyLakeOS": "TH2",
          "KabyLakeWW": "24'16",
          "KabyLakeMSSize": 3,
          "KabyLakeLabel": "",
          "KabyLakeRadiusBG": "#ffffff",
          "LakeFieldDefects": 954,
          "LakeFieldMS": "PV-HT-19H1",
          "LakeFieldSKU": "HT",
          "LakeFieldOS": "19H1",
          "LakeFieldWW": "9'20",
          "LakeFieldMSSize": 3,
          "LakeFieldLabel": "",
          "LakeFieldRadiusBG": "#ffffff",
          "RocketLakeDefects": 945,
          "RocketLakeMS": "PV-S-20H2",
          "RocketLakeSKU": "S",
          "RocketLakeOS": "20H2",
          "RocketLakeWW": "51'20",
          "RocketLakeMSSize": 3,
          "RocketLakeLabel": "",
          "RocketLakeRadiusBG": "#ffffff",
          "SkyLakeDefects": 956,
          "SkyLakeMS": "PV-S-TH1",
          "SkyLakeSKU": "S",
          "SkyLakeOS": "TH1",
          "SkyLakeWW": "26'15",
          "SkyLakeMSSize": 3,
          "SkyLakeLabel": "",
          "SkyLakeRadiusBG": "#ffffff",
          "TigerLakeDefects": 2340,
          "TigerLakeMS": "PV-UP3-19H1",
          "TigerLakeSKU": "UP3",
          "TigerLakeOS": "19H1",
          "TigerLakeWW": "32'20",
          "TigerLakeMSSize": 3,
          "TigerLakeLabel": "",
          "TigerLakeRadiusBG": "#ffffff",
          "WhiskeyLakeDefects": 242,
          "WhiskeyLakeMS": "PV-U-RS4",
          "WhiskeyLakeSKU": "U",
          "WhiskeyLakeOS": "RS4",
          "WhiskeyLakeWW": "27'18",
          "WhiskeyLakeMSSize": 3,
          "WhiskeyLakeLabel": "",
          "WhiskeyLakeRadiusBG": "#ffffff"
        },
        {
          "PVWeek": "PV+10",
          "AmberLakeDefects": 127,
          "AmberLakeMS": null,
          "AmberLakeSKU": null,
          "AmberLakeOS": null,
          "AmberLakeWW": null,
          "AmberLakeMSSize": 2,
          "AmberLakeLabel": "",
          "AmberLakeRadiusBG": "#d35400",
          "CannonLakeDefects": 1433,
          "CannonLakeMS": null,
          "CannonLakeSKU": null,
          "CannonLakeOS": null,
          "CannonLakeWW": null,
          "CannonLakeMSSize": 2,
          "CannonLakeLabel": "",
          "CannonLakeRadiusBG": "#633a82",
          "CoffeeLakeDefects": 1379,
          "CoffeeLakeMS": null,
          "CoffeeLakeSKU": null,
          "CoffeeLakeOS": null,
          "CoffeeLakeWW": null,
          "CoffeeLakeMSSize": 2,
          "CoffeeLakeLabel": "",
          "CoffeeLakeRadiusBG": "#FEA47F",
          "CometLakeDefects": 1197,
          "CometLakeMS": null,
          "CometLakeSKU": null,
          "CometLakeOS": null,
          "CometLakeWW": null,
          "CometLakeMSSize": 2,
          "CometLakeLabel": "",
          "CometLakeRadiusBG": "#7b7b7b",
          "GeminiLakeDefects": 675,
          "GeminiLakeMS": null,
          "GeminiLakeSKU": null,
          "GeminiLakeOS": null,
          "GeminiLakeWW": null,
          "GeminiLakeMSSize": 2,
          "GeminiLakeLabel": "",
          "GeminiLakeRadiusBG": "#ee5253",
          "IceLakeDefects": 2502,
          "IceLakeMS": null,
          "IceLakeSKU": null,
          "IceLakeOS": null,
          "IceLakeWW": null,
          "IceLakeMSSize": 2,
          "IceLakeLabel": "",
          "IceLakeRadiusBG": "#F6FF33",
          "JasperLakeDefects": 488,
          "JasperLakeMS": null,
          "JasperLakeSKU": null,
          "JasperLakeOS": null,
          "JasperLakeWW": null,
          "JasperLakeMSSize": 2,
          "JasperLakeLabel": "",
          "JasperLakeRadiusBG": "#2f4d4d",
          "KabyLakeDefects": 1377,
          "KabyLakeMS": null,
          "KabyLakeSKU": null,
          "KabyLakeOS": null,
          "KabyLakeWW": null,
          "KabyLakeMSSize": 2,
          "KabyLakeLabel": "",
          "KabyLakeRadiusBG": "#0984e3",
          "LakeFieldDefects": 987,
          "LakeFieldMS": null,
          "LakeFieldSKU": null,
          "LakeFieldOS": null,
          "LakeFieldWW": null,
          "LakeFieldMSSize": 2,
          "LakeFieldLabel": "",
          "LakeFieldRadiusBG": "#3ae374",
          "RocketLakeDefects": 1079,
          "RocketLakeMS": null,
          "RocketLakeSKU": null,
          "RocketLakeOS": null,
          "RocketLakeWW": null,
          "RocketLakeMSSize": 2,
          "RocketLakeLabel": "",
          "RocketLakeRadiusBG": "#593f57",
          "SkyLakeDefects": 1218,
          "SkyLakeMS": null,
          "SkyLakeSKU": null,
          "SkyLakeOS": null,
          "SkyLakeWW": null,
          "SkyLakeMSSize": 2,
          "SkyLakeLabel": "",
          "SkyLakeRadiusBG": "#7efff5",
          "TigerLakeDefects": 2622,
          "TigerLakeMS": null,
          "TigerLakeSKU": null,
          "TigerLakeOS": null,
          "TigerLakeWW": null,
          "TigerLakeMSSize": 2,
          "TigerLakeLabel": "",
          "TigerLakeRadiusBG": "#BC0494",
          "WhiskeyLakeDefects": 350,
          "WhiskeyLakeMS": null,
          "WhiskeyLakeSKU": null,
          "WhiskeyLakeOS": null,
          "WhiskeyLakeWW": null,
          "WhiskeyLakeMSSize": 2,
          "WhiskeyLakeLabel": "",
          "WhiskeyLakeRadiusBG": "#D6A2E8"
        },
        {
          "PVWeek": "PV+12",
          "JasperLakeDefects": 500,
          "JasperLakeMS": null,
          "JasperLakeSKU": null,
          "JasperLakeOS": null,
          "JasperLakeWW": null,
          "JasperLakeMSSize": 2,
          "JasperLakeLabel": "Jasper Lake",
          "JasperLakeRadiusBG": "#2f4d4d",
          "RocketLakeDefects": 1094,
          "RocketLakeMS": null,
          "RocketLakeSKU": null,
          "RocketLakeOS": null,
          "RocketLakeWW": null,
          "RocketLakeMSSize": 2,
          "RocketLakeLabel": "Rocket Lake",
          "RocketLakeRadiusBG": "#593f57"
        },
        {
          "PVWeek": "PV+16",
          "IceLakeDefects": 2592,
          "IceLakeMS": "PV-Y-RS5",
          "IceLakeSKU": "Y",
          "IceLakeOS": "RS5",
          "IceLakeWW": "42'19",
          "IceLakeMSSize": 3,
          "IceLakeLabel": "",
          "IceLakeRadiusBG": "#ffffff"
        },
        {
          "PVWeek": "PV+17",
          "KabyLakeDefects": 1573,
          "KabyLakeMS": "PV-S-RS1",
          "KabyLakeSKU": "S",
          "KabyLakeOS": "RS1",
          "KabyLakeWW": "41'16",
          "KabyLakeMSSize": 3,
          "KabyLakeLabel": "",
          "KabyLakeRadiusBG": "#ffffff"
        },
        {
          "PVWeek": "PV+20",
          "AmberLakeDefects": 170,
          "AmberLakeMS": null,
          "AmberLakeSKU": null,
          "AmberLakeOS": null,
          "AmberLakeWW": null,
          "AmberLakeMSSize": 2,
          "AmberLakeLabel": "",
          "AmberLakeRadiusBG": "#d35400",
          "CannonLakeDefects": 1499,
          "CannonLakeMS": null,
          "CannonLakeSKU": null,
          "CannonLakeOS": null,
          "CannonLakeWW": null,
          "CannonLakeMSSize": 2,
          "CannonLakeLabel": "",
          "CannonLakeRadiusBG": "#633a82",
          "CoffeeLakeDefects": 1557,
          "CoffeeLakeMS": null,
          "CoffeeLakeSKU": null,
          "CoffeeLakeOS": null,
          "CoffeeLakeWW": null,
          "CoffeeLakeMSSize": 2,
          "CoffeeLakeLabel": "",
          "CoffeeLakeRadiusBG": "#FEA47F",
          "CometLakeDefects": 1313,
          "CometLakeMS": null,
          "CometLakeSKU": null,
          "CometLakeOS": null,
          "CometLakeWW": null,
          "CometLakeMSSize": 2,
          "CometLakeLabel": "",
          "CometLakeRadiusBG": "#7b7b7b",
          "GeminiLakeDefects": 716,
          "GeminiLakeMS": null,
          "GeminiLakeSKU": null,
          "GeminiLakeOS": null,
          "GeminiLakeWW": null,
          "GeminiLakeMSSize": 2,
          "GeminiLakeLabel": "",
          "GeminiLakeRadiusBG": "#ee5253",
          "IceLakeDefects": 2692,
          "IceLakeMS": null,
          "IceLakeSKU": null,
          "IceLakeOS": null,
          "IceLakeWW": null,
          "IceLakeMSSize": 2,
          "IceLakeLabel": "",
          "IceLakeRadiusBG": "#F6FF33",
          "KabyLakeDefects": 1649,
          "KabyLakeMS": null,
          "KabyLakeSKU": null,
          "KabyLakeOS": null,
          "KabyLakeWW": null,
          "KabyLakeMSSize": 2,
          "KabyLakeLabel": "",
          "KabyLakeRadiusBG": "#0984e3",
          "LakeFieldDefects": 1056,
          "LakeFieldMS": null,
          "LakeFieldSKU": null,
          "LakeFieldOS": null,
          "LakeFieldWW": null,
          "LakeFieldMSSize": 2,
          "LakeFieldLabel": "",
          "LakeFieldRadiusBG": "#3ae374",
          "SkyLakeDefects": 1335,
          "SkyLakeMS": null,
          "SkyLakeSKU": null,
          "SkyLakeOS": null,
          "SkyLakeWW": null,
          "SkyLakeMSSize": 2,
          "SkyLakeLabel": "",
          "SkyLakeRadiusBG": "#7efff5",
          "TigerLakeDefects": 2779,
          "TigerLakeMS": null,
          "TigerLakeSKU": null,
          "TigerLakeOS": null,
          "TigerLakeWW": null,
          "TigerLakeMSSize": 2,
          "TigerLakeLabel": "",
          "TigerLakeRadiusBG": "#BC0494",
          "WhiskeyLakeDefects": 547,
          "WhiskeyLakeMS": null,
          "WhiskeyLakeSKU": null,
          "WhiskeyLakeOS": null,
          "WhiskeyLakeWW": null,
          "WhiskeyLakeMSSize": 2,
          "WhiskeyLakeLabel": "",
          "WhiskeyLakeRadiusBG": "#D6A2E8"
        },
        {
          "PVWeek": "PV+23",
          "AmberLakeDefects": 191,
          "AmberLakeMS": "PV-Y-RS5",
          "AmberLakeSKU": "Y",
          "AmberLakeOS": "RS5",
          "AmberLakeWW": "48'18",
          "AmberLakeMSSize": 3,
          "AmberLakeLabel": "",
          "AmberLakeRadiusBG": "#ffffff"
        },
        {
          "PVWeek": "PV+27",
          "WhiskeyLakeDefects": 664,
          "WhiskeyLakeMS": "PV-U-RS5",
          "WhiskeyLakeSKU": "U",
          "WhiskeyLakeOS": "RS5",
          "WhiskeyLakeWW": "1'19",
          "WhiskeyLakeMSSize": 3,
          "WhiskeyLakeLabel": "",
          "WhiskeyLakeRadiusBG": "#ffffff"
        },
        {
          "PVWeek": "PV+30",
          "AmberLakeDefects": 215,
          "AmberLakeMS": null,
          "AmberLakeSKU": null,
          "AmberLakeOS": null,
          "AmberLakeWW": null,
          "AmberLakeMSSize": 2,
          "AmberLakeLabel": "",
          "AmberLakeRadiusBG": "#d35400",
          "CannonLakeDefects": 1700,
          "CannonLakeMS": null,
          "CannonLakeSKU": null,
          "CannonLakeOS": null,
          "CannonLakeWW": null,
          "CannonLakeMSSize": 2,
          "CannonLakeLabel": "",
          "CannonLakeRadiusBG": "#633a82",
          "CoffeeLakeDefects": 1772,
          "CoffeeLakeMS": null,
          "CoffeeLakeSKU": null,
          "CoffeeLakeOS": null,
          "CoffeeLakeWW": null,
          "CoffeeLakeMSSize": 2,
          "CoffeeLakeLabel": "",
          "CoffeeLakeRadiusBG": "#FEA47F",
          "CometLakeDefects": 1444,
          "CometLakeMS": null,
          "CometLakeSKU": null,
          "CometLakeOS": null,
          "CometLakeWW": null,
          "CometLakeMSSize": 2,
          "CometLakeLabel": "",
          "CometLakeRadiusBG": "#7b7b7b",
          "GeminiLakeDefects": 723,
          "GeminiLakeMS": null,
          "GeminiLakeSKU": null,
          "GeminiLakeOS": null,
          "GeminiLakeWW": null,
          "GeminiLakeMSSize": 2,
          "GeminiLakeLabel": "",
          "GeminiLakeRadiusBG": "#ee5253",
          "IceLakeDefects": 2767,
          "IceLakeMS": null,
          "IceLakeSKU": null,
          "IceLakeOS": null,
          "IceLakeWW": null,
          "IceLakeMSSize": 2,
          "IceLakeLabel": "",
          "IceLakeRadiusBG": "#F6FF33",
          "KabyLakeDefects": 1815,
          "KabyLakeMS": null,
          "KabyLakeSKU": null,
          "KabyLakeOS": null,
          "KabyLakeWW": null,
          "KabyLakeMSSize": 2,
          "KabyLakeLabel": "",
          "KabyLakeRadiusBG": "#0984e3",
          "LakeFieldDefects": 1087,
          "LakeFieldMS": null,
          "LakeFieldSKU": null,
          "LakeFieldOS": null,
          "LakeFieldWW": null,
          "LakeFieldMSSize": 2,
          "LakeFieldLabel": "",
          "LakeFieldRadiusBG": "#3ae374",
          "SkyLakeDefects": 1423,
          "SkyLakeMS": null,
          "SkyLakeSKU": null,
          "SkyLakeOS": null,
          "SkyLakeWW": null,
          "SkyLakeMSSize": 2,
          "SkyLakeLabel": "",
          "SkyLakeRadiusBG": "#7efff5",
          "TigerLakeDefects": 2883,
          "TigerLakeMS": null,
          "TigerLakeSKU": null,
          "TigerLakeOS": null,
          "TigerLakeWW": null,
          "TigerLakeMSSize": 2,
          "TigerLakeLabel": "",
          "TigerLakeRadiusBG": "#BC0494",
          "WhiskeyLakeDefects": 705,
          "WhiskeyLakeMS": null,
          "WhiskeyLakeSKU": null,
          "WhiskeyLakeOS": null,
          "WhiskeyLakeWW": null,
          "WhiskeyLakeMSSize": 2,
          "WhiskeyLakeLabel": "",
          "WhiskeyLakeRadiusBG": "#D6A2E8"
        },
        {
          "PVWeek": "PV+31",
          "TigerLakeDefects": 2890,
          "TigerLakeMS": null,
          "TigerLakeSKU": null,
          "TigerLakeOS": null,
          "TigerLakeWW": null,
          "TigerLakeMSSize": 2,
          "TigerLakeLabel": "Tiger Lake",
          "TigerLakeRadiusBG": "#BC0494"
        },
        {
          "PVWeek": "PV+32",
          "LakeFieldDefects": 1101,
          "LakeFieldMS": null,
          "LakeFieldSKU": null,
          "LakeFieldOS": null,
          "LakeFieldWW": null,
          "LakeFieldMSSize": 2,
          "LakeFieldLabel": "Lake Field",
          "LakeFieldRadiusBG": "#3ae374"
        },
        {
          "PVWeek": "PV+40",
          "AmberLakeDefects": 288,
          "AmberLakeMS": null,
          "AmberLakeSKU": null,
          "AmberLakeOS": null,
          "AmberLakeWW": null,
          "AmberLakeMSSize": 2,
          "AmberLakeLabel": "",
          "AmberLakeRadiusBG": "#d35400",
          "CannonLakeDefects": 1705,
          "CannonLakeMS": null,
          "CannonLakeSKU": null,
          "CannonLakeOS": null,
          "CannonLakeWW": null,
          "CannonLakeMSSize": 2,
          "CannonLakeLabel": "",
          "CannonLakeRadiusBG": "#633a82",
          "CoffeeLakeDefects": 1953,
          "CoffeeLakeMS": null,
          "CoffeeLakeSKU": null,
          "CoffeeLakeOS": null,
          "CoffeeLakeWW": null,
          "CoffeeLakeMSSize": 2,
          "CoffeeLakeLabel": "",
          "CoffeeLakeRadiusBG": "#FEA47F",
          "CometLakeDefects": 1457,
          "CometLakeMS": null,
          "CometLakeSKU": null,
          "CometLakeOS": null,
          "CometLakeWW": null,
          "CometLakeMSSize": 2,
          "CometLakeLabel": "",
          "CometLakeRadiusBG": "#7b7b7b",
          "GeminiLakeDefects": 729,
          "GeminiLakeMS": null,
          "GeminiLakeSKU": null,
          "GeminiLakeOS": null,
          "GeminiLakeWW": null,
          "GeminiLakeMSSize": 2,
          "GeminiLakeLabel": "",
          "GeminiLakeRadiusBG": "#ee5253",
          "IceLakeDefects": 2866,
          "IceLakeMS": null,
          "IceLakeSKU": null,
          "IceLakeOS": null,
          "IceLakeWW": null,
          "IceLakeMSSize": 2,
          "IceLakeLabel": "",
          "IceLakeRadiusBG": "#F6FF33",
          "KabyLakeDefects": 2106,
          "KabyLakeMS": null,
          "KabyLakeSKU": null,
          "KabyLakeOS": null,
          "KabyLakeWW": null,
          "KabyLakeMSSize": 2,
          "KabyLakeLabel": "",
          "KabyLakeRadiusBG": "#0984e3",
          "SkyLakeDefects": 1454,
          "SkyLakeMS": null,
          "SkyLakeSKU": null,
          "SkyLakeOS": null,
          "SkyLakeWW": null,
          "SkyLakeMSSize": 2,
          "SkyLakeLabel": "",
          "SkyLakeRadiusBG": "#7efff5",
          "WhiskeyLakeDefects": 874,
          "WhiskeyLakeMS": null,
          "WhiskeyLakeSKU": null,
          "WhiskeyLakeOS": null,
          "WhiskeyLakeWW": null,
          "WhiskeyLakeMSSize": 2,
          "WhiskeyLakeLabel": "",
          "WhiskeyLakeRadiusBG": "#D6A2E8"
        },
        {
          "PVWeek": "PV+48",
          "CoffeeLakeDefects": 2042,
          "CoffeeLakeMS": "PV-H-RS5",
          "CoffeeLakeSKU": "H",
          "CoffeeLakeOS": "RS5",
          "CoffeeLakeWW": "1'19",
          "CoffeeLakeMSSize": 3,
          "CoffeeLakeLabel": "",
          "CoffeeLakeRadiusBG": "#ffffff"
        },
        {
          "PVWeek": "PV+50",
          "AmberLakeDefects": 351,
          "AmberLakeMS": null,
          "AmberLakeSKU": null,
          "AmberLakeOS": null,
          "AmberLakeWW": null,
          "AmberLakeMSSize": 2,
          "AmberLakeLabel": "",
          "AmberLakeRadiusBG": "#d35400",
          "CannonLakeDefects": 1705,
          "CannonLakeMS": null,
          "CannonLakeSKU": null,
          "CannonLakeOS": null,
          "CannonLakeWW": null,
          "CannonLakeMSSize": 2,
          "CannonLakeLabel": "",
          "CannonLakeRadiusBG": "#633a82",
          "CoffeeLakeDefects": 2062,
          "CoffeeLakeMS": null,
          "CoffeeLakeSKU": null,
          "CoffeeLakeOS": null,
          "CoffeeLakeWW": null,
          "CoffeeLakeMSSize": 2,
          "CoffeeLakeLabel": "",
          "CoffeeLakeRadiusBG": "#FEA47F",
          "CometLakeDefects": 1460,
          "CometLakeMS": null,
          "CometLakeSKU": null,
          "CometLakeOS": null,
          "CometLakeWW": null,
          "CometLakeMSSize": 2,
          "CometLakeLabel": "",
          "CometLakeRadiusBG": "#7b7b7b",
          "GeminiLakeDefects": 737,
          "GeminiLakeMS": null,
          "GeminiLakeSKU": null,
          "GeminiLakeOS": null,
          "GeminiLakeWW": null,
          "GeminiLakeMSSize": 2,
          "GeminiLakeLabel": "",
          "GeminiLakeRadiusBG": "#ee5253",
          "IceLakeDefects": 2944,
          "IceLakeMS": null,
          "IceLakeSKU": null,
          "IceLakeOS": null,
          "IceLakeWW": null,
          "IceLakeMSSize": 2,
          "IceLakeLabel": "",
          "IceLakeRadiusBG": "#F6FF33",
          "KabyLakeDefects": 2371,
          "KabyLakeMS": null,
          "KabyLakeSKU": null,
          "KabyLakeOS": null,
          "KabyLakeWW": null,
          "KabyLakeMSSize": 2,
          "KabyLakeLabel": "",
          "KabyLakeRadiusBG": "#0984e3",
          "SkyLakeDefects": 1511,
          "SkyLakeMS": null,
          "SkyLakeSKU": null,
          "SkyLakeOS": null,
          "SkyLakeWW": null,
          "SkyLakeMSSize": 2,
          "SkyLakeLabel": "",
          "SkyLakeRadiusBG": "#7efff5",
          "WhiskeyLakeDefects": 981,
          "WhiskeyLakeMS": "PV-U-19H1",
          "WhiskeyLakeSKU": "U",
          "WhiskeyLakeOS": "19H1",
          "WhiskeyLakeWW": "24'19",
          "WhiskeyLakeMSSize": 3,
          "WhiskeyLakeLabel": "",
          "WhiskeyLakeRadiusBG": "#ffffff"
        },
        {
          "PVWeek": "PV+52",
          "AmberLakeDefects": 360,
          "AmberLakeMS": "PV-Y-19H1",
          "AmberLakeSKU": "Y",
          "AmberLakeOS": "19H1",
          "AmberLakeWW": "24'19",
          "AmberLakeMSSize": 3,
          "AmberLakeLabel": "",
          "AmberLakeRadiusBG": "#ffffff",
          "KabyLakeDefects": 2442,
          "KabyLakeMS": "PV-R-RS2",
          "KabyLakeSKU": "R",
          "KabyLakeOS": "RS2",
          "KabyLakeWW": "23'17",
          "KabyLakeMSSize": 3,
          "KabyLakeLabel": "",
          "KabyLakeRadiusBG": "#ffffff"
        },
        {
          "PVWeek": "PV+56",
          "CometLakeDefects": 1463,
          "CometLakeMS": null,
          "CometLakeSKU": null,
          "CometLakeOS": null,
          "CometLakeWW": null,
          "CometLakeMSSize": 2,
          "CometLakeLabel": "Comet Lake",
          "CometLakeRadiusBG": "#7b7b7b"
        },
        {
          "PVWeek": "PV+60",
          "AmberLakeDefects": 383,
          "AmberLakeMS": null,
          "AmberLakeSKU": null,
          "AmberLakeOS": null,
          "AmberLakeWW": null,
          "AmberLakeMSSize": 2,
          "AmberLakeLabel": "",
          "AmberLakeRadiusBG": "#d35400",
          "CannonLakeDefects": 1705,
          "CannonLakeMS": null,
          "CannonLakeSKU": null,
          "CannonLakeOS": null,
          "CannonLakeWW": null,
          "CannonLakeMSSize": 2,
          "CannonLakeLabel": "",
          "CannonLakeRadiusBG": "#633a82",
          "CoffeeLakeDefects": 2194,
          "CoffeeLakeMS": null,
          "CoffeeLakeSKU": null,
          "CoffeeLakeOS": null,
          "CoffeeLakeWW": null,
          "CoffeeLakeMSSize": 2,
          "CoffeeLakeLabel": "",
          "CoffeeLakeRadiusBG": "#FEA47F",
          "GeminiLakeDefects": 737,
          "GeminiLakeMS": null,
          "GeminiLakeSKU": null,
          "GeminiLakeOS": null,
          "GeminiLakeWW": null,
          "GeminiLakeMSSize": 2,
          "GeminiLakeLabel": "",
          "GeminiLakeRadiusBG": "#ee5253",
          "IceLakeDefects": 2976,
          "IceLakeMS": null,
          "IceLakeSKU": null,
          "IceLakeOS": null,
          "IceLakeWW": null,
          "IceLakeMSSize": 2,
          "IceLakeLabel": "",
          "IceLakeRadiusBG": "#F6FF33",
          "KabyLakeDefects": 2628,
          "KabyLakeMS": null,
          "KabyLakeSKU": null,
          "KabyLakeOS": null,
          "KabyLakeWW": null,
          "KabyLakeMSSize": 2,
          "KabyLakeLabel": "",
          "KabyLakeRadiusBG": "#0984e3",
          "SkyLakeDefects": 1529,
          "SkyLakeMS": null,
          "SkyLakeSKU": null,
          "SkyLakeOS": null,
          "SkyLakeWW": null,
          "SkyLakeMSSize": 2,
          "SkyLakeLabel": "",
          "SkyLakeRadiusBG": "#7efff5",
          "WhiskeyLakeDefects": 1008,
          "WhiskeyLakeMS": null,
          "WhiskeyLakeSKU": null,
          "WhiskeyLakeOS": null,
          "WhiskeyLakeWW": null,
          "WhiskeyLakeMSSize": 2,
          "WhiskeyLakeLabel": "",
          "WhiskeyLakeRadiusBG": "#D6A2E8"
        },
        {
          "PVWeek": "PV+70",
          "AmberLakeDefects": 393,
          "AmberLakeMS": null,
          "AmberLakeSKU": null,
          "AmberLakeOS": null,
          "AmberLakeWW": null,
          "AmberLakeMSSize": 2,
          "AmberLakeLabel": "",
          "AmberLakeRadiusBG": "#d35400",
          "CannonLakeDefects": 1705,
          "CannonLakeMS": null,
          "CannonLakeSKU": null,
          "CannonLakeOS": null,
          "CannonLakeWW": null,
          "CannonLakeMSSize": 2,
          "CannonLakeLabel": "",
          "CannonLakeRadiusBG": "#633a82",
          "CoffeeLakeDefects": 2261,
          "CoffeeLakeMS": null,
          "CoffeeLakeSKU": null,
          "CoffeeLakeOS": null,
          "CoffeeLakeWW": null,
          "CoffeeLakeMSSize": 2,
          "CoffeeLakeLabel": "",
          "CoffeeLakeRadiusBG": "#FEA47F",
          "GeminiLakeDefects": 747,
          "GeminiLakeMS": null,
          "GeminiLakeSKU": null,
          "GeminiLakeOS": null,
          "GeminiLakeWW": null,
          "GeminiLakeMSSize": 2,
          "GeminiLakeLabel": "",
          "GeminiLakeRadiusBG": "#ee5253",
          "IceLakeDefects": 3004,
          "IceLakeMS": null,
          "IceLakeSKU": null,
          "IceLakeOS": null,
          "IceLakeWW": null,
          "IceLakeMSSize": 2,
          "IceLakeLabel": "",
          "IceLakeRadiusBG": "#F6FF33",
          "KabyLakeDefects": 3083,
          "KabyLakeMS": null,
          "KabyLakeSKU": null,
          "KabyLakeOS": null,
          "KabyLakeWW": null,
          "KabyLakeMSSize": 2,
          "KabyLakeLabel": "",
          "KabyLakeRadiusBG": "#0984e3",
          "SkyLakeDefects": 1544,
          "SkyLakeMS": null,
          "SkyLakeSKU": null,
          "SkyLakeOS": null,
          "SkyLakeWW": null,
          "SkyLakeMSSize": 2,
          "SkyLakeLabel": "",
          "SkyLakeRadiusBG": "#7efff5",
          "WhiskeyLakeDefects": 1027,
          "WhiskeyLakeMS": null,
          "WhiskeyLakeSKU": null,
          "WhiskeyLakeOS": null,
          "WhiskeyLakeWW": null,
          "WhiskeyLakeMSSize": 2,
          "WhiskeyLakeLabel": "",
          "WhiskeyLakeRadiusBG": "#D6A2E8"
        },
        {
          "PVWeek": "PV+72",
          "CoffeeLakeDefects": 2279,
          "CoffeeLakeMS": "PV-S-19H1",
          "CoffeeLakeSKU": "S",
          "CoffeeLakeOS": "19H1",
          "CoffeeLakeWW": "25'19",
          "CoffeeLakeMSSize": 3,
          "CoffeeLakeLabel": "",
          "CoffeeLakeRadiusBG": "#ffffff"
        },
        {
          "PVWeek": "PV+74",
          "KabyLakeDefects": 3193,
          "KabyLakeMS": "PV-R-RS3",
          "KabyLakeSKU": "R",
          "KabyLakeOS": "RS3",
          "KabyLakeWW": "45'17",
          "KabyLakeMSSize": 3,
          "KabyLakeLabel": "",
          "KabyLakeRadiusBG": "#ffffff"
        },
        {
          "PVWeek": "PV+80",
          "AmberLakeDefects": 406,
          "AmberLakeMS": null,
          "AmberLakeSKU": null,
          "AmberLakeOS": null,
          "AmberLakeWW": null,
          "AmberLakeMSSize": 2,
          "AmberLakeLabel": "",
          "AmberLakeRadiusBG": "#d35400",
          "CannonLakeDefects": 1706,
          "CannonLakeMS": null,
          "CannonLakeSKU": null,
          "CannonLakeOS": null,
          "CannonLakeWW": null,
          "CannonLakeMSSize": 2,
          "CannonLakeLabel": "",
          "CannonLakeRadiusBG": "#633a82",
          "CoffeeLakeDefects": 2299,
          "CoffeeLakeMS": null,
          "CoffeeLakeSKU": null,
          "CoffeeLakeOS": null,
          "CoffeeLakeWW": null,
          "CoffeeLakeMSSize": 2,
          "CoffeeLakeLabel": "",
          "CoffeeLakeRadiusBG": "#FEA47F",
          "GeminiLakeDefects": 758,
          "GeminiLakeMS": null,
          "GeminiLakeSKU": null,
          "GeminiLakeOS": null,
          "GeminiLakeWW": null,
          "GeminiLakeMSSize": 2,
          "GeminiLakeLabel": "",
          "GeminiLakeRadiusBG": "#ee5253",
          "IceLakeDefects": 3005,
          "IceLakeMS": null,
          "IceLakeSKU": null,
          "IceLakeOS": null,
          "IceLakeWW": null,
          "IceLakeMSSize": 2,
          "IceLakeLabel": "",
          "IceLakeRadiusBG": "#F6FF33",
          "KabyLakeDefects": 3361,
          "KabyLakeMS": null,
          "KabyLakeSKU": null,
          "KabyLakeOS": null,
          "KabyLakeWW": null,
          "KabyLakeMSSize": 2,
          "KabyLakeLabel": "",
          "KabyLakeRadiusBG": "#0984e3",
          "SkyLakeDefects": 1545,
          "SkyLakeMS": null,
          "SkyLakeSKU": null,
          "SkyLakeOS": null,
          "SkyLakeWW": null,
          "SkyLakeMSSize": 2,
          "SkyLakeLabel": "",
          "SkyLakeRadiusBG": "#7efff5",
          "WhiskeyLakeDefects": 1035,
          "WhiskeyLakeMS": null,
          "WhiskeyLakeSKU": null,
          "WhiskeyLakeOS": null,
          "WhiskeyLakeWW": null,
          "WhiskeyLakeMSSize": 2,
          "WhiskeyLakeLabel": "",
          "WhiskeyLakeRadiusBG": "#D6A2E8"
        },
        {
          "PVWeek": "PV+82",
          "IceLakeDefects": 3012,
          "IceLakeMS": null,
          "IceLakeSKU": null,
          "IceLakeOS": null,
          "IceLakeWW": null,
          "IceLakeMSSize": 2,
          "IceLakeLabel": "Ice Lake",
          "IceLakeRadiusBG": "#F6FF33"
        },
        {
          "PVWeek": "PV+83",
          "KabyLakeDefects": 3390,
          "KabyLakeMS": "PV-U-RS3",
          "KabyLakeSKU": "U",
          "KabyLakeOS": "RS3",
          "KabyLakeWW": "1'18",
          "KabyLakeMSSize": 3,
          "KabyLakeLabel": "",
          "KabyLakeRadiusBG": "#ffffff"
        },
        {
          "PVWeek": "PV+90",
          "AmberLakeDefects": 457,
          "AmberLakeMS": null,
          "AmberLakeSKU": null,
          "AmberLakeOS": null,
          "AmberLakeWW": null,
          "AmberLakeMSSize": 2,
          "AmberLakeLabel": "",
          "AmberLakeRadiusBG": "#d35400",
          "CannonLakeDefects": 1707,
          "CannonLakeMS": null,
          "CannonLakeSKU": null,
          "CannonLakeOS": null,
          "CannonLakeWW": null,
          "CannonLakeMSSize": 2,
          "CannonLakeLabel": "Cannon Lake",
          "CannonLakeRadiusBG": "#633a82",
          "CoffeeLakeDefects": 2353,
          "CoffeeLakeMS": null,
          "CoffeeLakeSKU": null,
          "CoffeeLakeOS": null,
          "CoffeeLakeWW": null,
          "CoffeeLakeMSSize": 2,
          "CoffeeLakeLabel": "",
          "CoffeeLakeRadiusBG": "#FEA47F",
          "GeminiLakeDefects": 758,
          "GeminiLakeMS": null,
          "GeminiLakeSKU": null,
          "GeminiLakeOS": null,
          "GeminiLakeWW": null,
          "GeminiLakeMSSize": 2,
          "GeminiLakeLabel": "",
          "GeminiLakeRadiusBG": "#ee5253",
          "KabyLakeDefects": 3453,
          "KabyLakeMS": null,
          "KabyLakeSKU": null,
          "KabyLakeOS": null,
          "KabyLakeWW": null,
          "KabyLakeMSSize": 2,
          "KabyLakeLabel": "",
          "KabyLakeRadiusBG": "#0984e3",
          "SkyLakeDefects": 1553,
          "SkyLakeMS": null,
          "SkyLakeSKU": null,
          "SkyLakeOS": null,
          "SkyLakeWW": null,
          "SkyLakeMSSize": 2,
          "SkyLakeLabel": "",
          "SkyLakeRadiusBG": "#7efff5",
          "WhiskeyLakeDefects": 1039,
          "WhiskeyLakeMS": null,
          "WhiskeyLakeSKU": null,
          "WhiskeyLakeOS": null,
          "WhiskeyLakeWW": null,
          "WhiskeyLakeMSSize": 2,
          "WhiskeyLakeLabel": "",
          "WhiskeyLakeRadiusBG": "#D6A2E8"
        },
        {
          "PVWeek": "PV+100",
          "AmberLakeDefects": 571,
          "AmberLakeMS": null,
          "AmberLakeSKU": null,
          "AmberLakeOS": null,
          "AmberLakeWW": null,
          "AmberLakeMSSize": 2,
          "AmberLakeLabel": "",
          "AmberLakeRadiusBG": "#d35400",
          "CoffeeLakeDefects": 2370,
          "CoffeeLakeMS": null,
          "CoffeeLakeSKU": null,
          "CoffeeLakeOS": null,
          "CoffeeLakeWW": null,
          "CoffeeLakeMSSize": 2,
          "CoffeeLakeLabel": "",
          "CoffeeLakeRadiusBG": "#FEA47F",
          "GeminiLakeDefects": 765,
          "GeminiLakeMS": null,
          "GeminiLakeSKU": null,
          "GeminiLakeOS": null,
          "GeminiLakeWW": null,
          "GeminiLakeMSSize": 2,
          "GeminiLakeLabel": "",
          "GeminiLakeRadiusBG": "#ee5253",
          "KabyLakeDefects": 3525,
          "KabyLakeMS": null,
          "KabyLakeSKU": null,
          "KabyLakeOS": null,
          "KabyLakeWW": null,
          "KabyLakeMSSize": 2,
          "KabyLakeLabel": "",
          "KabyLakeRadiusBG": "#0984e3",
          "SkyLakeDefects": 1555,
          "SkyLakeMS": null,
          "SkyLakeSKU": null,
          "SkyLakeOS": null,
          "SkyLakeWW": null,
          "SkyLakeMSSize": 2,
          "SkyLakeLabel": "",
          "SkyLakeRadiusBG": "#7efff5",
          "WhiskeyLakeDefects": 1039,
          "WhiskeyLakeMS": null,
          "WhiskeyLakeSKU": null,
          "WhiskeyLakeOS": null,
          "WhiskeyLakeWW": null,
          "WhiskeyLakeMSSize": 2,
          "WhiskeyLakeLabel": "",
          "WhiskeyLakeRadiusBG": "#D6A2E8"
        },
        {
          "PVWeek": "PV+104",
          "GeminiLakeDefects": 766,
          "GeminiLakeMS": null,
          "GeminiLakeSKU": null,
          "GeminiLakeOS": null,
          "GeminiLakeWW": null,
          "GeminiLakeMSSize": 2,
          "GeminiLakeLabel": "Gemini Lake",
          "GeminiLakeRadiusBG": "#ee5253"
        },
        {
          "PVWeek": "PV+110",
          "AmberLakeDefects": 573,
          "AmberLakeMS": null,
          "AmberLakeSKU": null,
          "AmberLakeOS": null,
          "AmberLakeWW": null,
          "AmberLakeMSSize": 2,
          "AmberLakeLabel": "",
          "AmberLakeRadiusBG": "#d35400",
          "CoffeeLakeDefects": 2370,
          "CoffeeLakeMS": null,
          "CoffeeLakeSKU": null,
          "CoffeeLakeOS": null,
          "CoffeeLakeWW": null,
          "CoffeeLakeMSSize": 2,
          "CoffeeLakeLabel": "",
          "CoffeeLakeRadiusBG": "#FEA47F",
          "KabyLakeDefects": 3629,
          "KabyLakeMS": null,
          "KabyLakeSKU": null,
          "KabyLakeOS": null,
          "KabyLakeWW": null,
          "KabyLakeMSSize": 2,
          "KabyLakeLabel": "",
          "KabyLakeRadiusBG": "#0984e3",
          "SkyLakeDefects": 1566,
          "SkyLakeMS": null,
          "SkyLakeSKU": null,
          "SkyLakeOS": null,
          "SkyLakeWW": null,
          "SkyLakeMSSize": 2,
          "SkyLakeLabel": "",
          "SkyLakeRadiusBG": "#7efff5",
          "WhiskeyLakeDefects": 1039,
          "WhiskeyLakeMS": null,
          "WhiskeyLakeSKU": null,
          "WhiskeyLakeOS": null,
          "WhiskeyLakeWW": null,
          "WhiskeyLakeMSSize": 2,
          "WhiskeyLakeLabel": "",
          "WhiskeyLakeRadiusBG": "#D6A2E8"
        },
        {
          "PVWeek": "PV+111",
          "WhiskeyLakeDefects": 1046,
          "WhiskeyLakeMS": null,
          "WhiskeyLakeSKU": null,
          "WhiskeyLakeOS": null,
          "WhiskeyLakeWW": null,
          "WhiskeyLakeMSSize": 2,
          "WhiskeyLakeLabel": "Whiskey Lake",
          "WhiskeyLakeRadiusBG": "#D6A2E8"
        },
        {
          "PVWeek": "PV+114",
          "KabyLakeDefects": 3645,
          "KabyLakeMS": "PV-R-RS4",
          "KabyLakeSKU": "R",
          "KabyLakeOS": "RS4",
          "KabyLakeWW": "32'18",
          "KabyLakeMSSize": 3,
          "KabyLakeLabel": "",
          "KabyLakeRadiusBG": "#ffffff"
        },
        {
          "PVWeek": "PV+120",
          "AmberLakeDefects": 580,
          "AmberLakeMS": null,
          "AmberLakeSKU": null,
          "AmberLakeOS": null,
          "AmberLakeWW": null,
          "AmberLakeMSSize": 2,
          "AmberLakeLabel": "",
          "AmberLakeRadiusBG": "#d35400",
          "CoffeeLakeDefects": 2371,
          "CoffeeLakeMS": null,
          "CoffeeLakeSKU": null,
          "CoffeeLakeOS": null,
          "CoffeeLakeWW": null,
          "CoffeeLakeMSSize": 2,
          "CoffeeLakeLabel": "",
          "CoffeeLakeRadiusBG": "#FEA47F",
          "KabyLakeDefects": 3660,
          "KabyLakeMS": null,
          "KabyLakeSKU": null,
          "KabyLakeOS": null,
          "KabyLakeWW": null,
          "KabyLakeMSSize": 2,
          "KabyLakeLabel": "",
          "KabyLakeRadiusBG": "#0984e3",
          "SkyLakeDefects": 1575,
          "SkyLakeMS": null,
          "SkyLakeSKU": null,
          "SkyLakeOS": null,
          "SkyLakeWW": null,
          "SkyLakeMSSize": 2,
          "SkyLakeLabel": "",
          "SkyLakeRadiusBG": "#7efff5"
        },
        {
          "PVWeek": "PV+130",
          "AmberLakeDefects": 580,
          "AmberLakeMS": null,
          "AmberLakeSKU": null,
          "AmberLakeOS": null,
          "AmberLakeWW": null,
          "AmberLakeMSSize": 2,
          "AmberLakeLabel": "",
          "AmberLakeRadiusBG": "#d35400",
          "CoffeeLakeDefects": 2371,
          "CoffeeLakeMS": null,
          "CoffeeLakeSKU": null,
          "CoffeeLakeOS": null,
          "CoffeeLakeWW": null,
          "CoffeeLakeMSSize": 2,
          "CoffeeLakeLabel": "",
          "CoffeeLakeRadiusBG": "#FEA47F",
          "KabyLakeDefects": 3694,
          "KabyLakeMS": null,
          "KabyLakeSKU": null,
          "KabyLakeOS": null,
          "KabyLakeWW": null,
          "KabyLakeMSSize": 2,
          "KabyLakeLabel": "",
          "KabyLakeRadiusBG": "#0984e3",
          "SkyLakeDefects": 1576,
          "SkyLakeMS": null,
          "SkyLakeSKU": null,
          "SkyLakeOS": null,
          "SkyLakeWW": null,
          "SkyLakeMSSize": 2,
          "SkyLakeLabel": "",
          "SkyLakeRadiusBG": "#7efff5"
        },
        {
          "PVWeek": "PV+132",
          "CoffeeLakeDefects": 2377,
          "CoffeeLakeMS": null,
          "CoffeeLakeSKU": null,
          "CoffeeLakeOS": null,
          "CoffeeLakeWW": null,
          "CoffeeLakeMSSize": 2,
          "CoffeeLakeLabel": "Coffee Lake",
          "CoffeeLakeRadiusBG": "#FEA47F"
        },
        {
          "PVWeek": "PV+134",
          "KabyLakeDefects": 3705,
          "KabyLakeMS": "PV-R-RS5",
          "KabyLakeSKU": "R",
          "KabyLakeOS": "RS5",
          "KabyLakeWW": "52'18",
          "KabyLakeMSSize": 3,
          "KabyLakeLabel": "",
          "KabyLakeRadiusBG": "#ffffff"
        },
        {
          "PVWeek": "PV+139",
          "AmberLakeDefects": 581,
          "AmberLakeMS": null,
          "AmberLakeSKU": null,
          "AmberLakeOS": null,
          "AmberLakeWW": null,
          "AmberLakeMSSize": 2,
          "AmberLakeLabel": "Amber Lake",
          "AmberLakeRadiusBG": "#d35400"
        },
        {
          "PVWeek": "PV+140",
          "KabyLakeDefects": 3713,
          "KabyLakeMS": null,
          "KabyLakeSKU": null,
          "KabyLakeOS": null,
          "KabyLakeWW": null,
          "KabyLakeMSSize": 2,
          "KabyLakeLabel": "",
          "KabyLakeRadiusBG": "#0984e3",
          "SkyLakeDefects": 1578,
          "SkyLakeMS": null,
          "SkyLakeSKU": null,
          "SkyLakeOS": null,
          "SkyLakeWW": null,
          "SkyLakeMSSize": 2,
          "SkyLakeLabel": "",
          "SkyLakeRadiusBG": "#7efff5"
        },
        {
          "PVWeek": "PV+150",
          "KabyLakeDefects": 3720,
          "KabyLakeMS": null,
          "KabyLakeSKU": null,
          "KabyLakeOS": null,
          "KabyLakeWW": null,
          "KabyLakeMSSize": 2,
          "KabyLakeLabel": "",
          "KabyLakeRadiusBG": "#0984e3",
          "SkyLakeDefects": 1578,
          "SkyLakeMS": null,
          "SkyLakeSKU": null,
          "SkyLakeOS": null,
          "SkyLakeWW": null,
          "SkyLakeMSSize": 2,
          "SkyLakeLabel": "",
          "SkyLakeRadiusBG": "#7efff5"
        },
        {
          "PVWeek": "PV+160",
          "KabyLakeDefects": 3726,
          "KabyLakeMS": null,
          "KabyLakeSKU": null,
          "KabyLakeOS": null,
          "KabyLakeWW": null,
          "KabyLakeMSSize": 2,
          "KabyLakeLabel": "",
          "KabyLakeRadiusBG": "#0984e3",
          "SkyLakeDefects": 1578,
          "SkyLakeMS": null,
          "SkyLakeSKU": null,
          "SkyLakeOS": null,
          "SkyLakeWW": null,
          "SkyLakeMSSize": 2,
          "SkyLakeLabel": "",
          "SkyLakeRadiusBG": "#7efff5"
        },
        {
          "PVWeek": "PV+170",
          "KabyLakeDefects": 3731,
          "KabyLakeMS": null,
          "KabyLakeSKU": null,
          "KabyLakeOS": null,
          "KabyLakeWW": null,
          "KabyLakeMSSize": 2,
          "KabyLakeLabel": "",
          "KabyLakeRadiusBG": "#0984e3",
          "SkyLakeDefects": 1578,
          "SkyLakeMS": null,
          "SkyLakeSKU": null,
          "SkyLakeOS": null,
          "SkyLakeWW": null,
          "SkyLakeMSSize": 2,
          "SkyLakeLabel": "",
          "SkyLakeRadiusBG": "#7efff5"
        },
        {
          "PVWeek": "PV+172",
          "SkyLakeDefects": 1593,
          "SkyLakeMS": null,
          "SkyLakeSKU": null,
          "SkyLakeOS": null,
          "SkyLakeWW": null,
          "SkyLakeMSSize": 2,
          "SkyLakeLabel": "Sky Lake",
          "SkyLakeRadiusBG": "#7efff5"
        },
        {
          "PVWeek": "PV+180",
          "KabyLakeDefects": 3732,
          "KabyLakeMS": null,
          "KabyLakeSKU": null,
          "KabyLakeOS": null,
          "KabyLakeWW": null,
          "KabyLakeMSSize": 2,
          "KabyLakeLabel": "",
          "KabyLakeRadiusBG": "#0984e3"
        },
        {
          "PVWeek": "PV+190",
          "KabyLakeDefects": 3733,
          "KabyLakeMS": null,
          "KabyLakeSKU": null,
          "KabyLakeOS": null,
          "KabyLakeWW": null,
          "KabyLakeMSSize": 2,
          "KabyLakeLabel": "",
          "KabyLakeRadiusBG": "#0984e3"
        },
        {
          "PVWeek": "PV+200",
          "KabyLakeDefects": 3733,
          "KabyLakeMS": null,
          "KabyLakeSKU": null,
          "KabyLakeOS": null,
          "KabyLakeWW": null,
          "KabyLakeMSSize": 2,
          "KabyLakeLabel": "",
          "KabyLakeRadiusBG": "#0984e3"
        },
        {
          "PVWeek": "PV+210",
          "KabyLakeDefects": 3733,
          "KabyLakeMS": null,
          "KabyLakeSKU": null,
          "KabyLakeOS": null,
          "KabyLakeWW": null,
          "KabyLakeMSSize": 2,
          "KabyLakeLabel": "",
          "KabyLakeRadiusBG": "#0984e3"
        },
        {
          "PVWeek": "PV+220",
          "KabyLakeDefects": 3734,
          "KabyLakeMS": null,
          "KabyLakeSKU": null,
          "KabyLakeOS": null,
          "KabyLakeWW": null,
          "KabyLakeMSSize": 2,
          "KabyLakeLabel": "Kaby Lake",
          "KabyLakeRadiusBG": "#0984e3"
        }
      ],
      "FilterName": "Gen Over Gen Defects"
    }
  }

}
