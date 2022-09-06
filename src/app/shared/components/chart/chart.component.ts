import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

import { ChartInfo } from '../../models/chart-info';
import { ChartType } from '../../../models/chart-type';
//import { parse } from 'node:path';

@Component({
  selector: 'cqi-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  @Input() ChartType: ChartType;
  @Input() ChartData: any[];
  @Input() Series: any[];
  @Input() lineSeriesValue: string;
  @Input() chartdiv: string = '';

  @Input() idx: number;
  @Input() chartInfo: ChartInfo;


  chartSize: string = ''

  public constructor(private ref: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.ref.detectChanges();
    this.consumeChart();
  }

  consumeChart() {
    am4core.useTheme(am4themes_animated);
    am4core.options.commercialLicense = true;

    let chart = null;
    if (this.ChartType === ChartType.Main) {

      am4core.options.autoSetClassName = true;

      chart = am4core.create(this.chartdiv, am4charts.XYChart3D);

      chart.numberFormatter.numberFormat = "#";

      chart.colors.list = [
        am4core.color('#0984e3'),
        am4core.color('#b2bec3'),
        am4core.color('#fdcb6e')
      ];
      chart.padding(20, 20, 20, 20);
      chart.margin(0, 0, 0, 0);
      chart.align = 'center';

      chart.legend = this.getMainLegend();
      // chart.cursor = this.getMainCursor();
      this.getMainCategoryAxis(chart);
      this.getMainValueAxis(chart);

      chart.data = this.ChartData;
      this.getMainSeries(chart);
    }
    else if (this.ChartType === ChartType.Child) {
      /*this.chartSize = 's';
      chart = am4core.create(this.chartdiv, am4charts.XYChart);

      chart.padding(0, 0, 0, 0);
      chart.margin(0, 0, 0, 0);
      chart.align = 'center';

      chart.colors.list = [
        am4core.color('#67b7dc'),
        am4core.color('#f5cf0a'),
        am4core.color('#85b465'),
      ];

      chart.cursor = this.getChildCursor();
      this.getChildCategoryAxis(chart);
      this.getChildValueAxis(chart);
      chart.data = this.ChartData;
      this.getChildSeries(chart);*/

      this.chartSize = 's';
      if (this.idx === 0) {
        this.donut3d(this.ChartData);
      }
      else if (this.idx === 1) {
        this.Pie3d(this.ChartData);
      }
      else {
        this.cylinderChart(this.ChartData);
      }
    }
    else if (this.ChartType === ChartType.ExecutiveSummary) {
      // this.chartSize = 's';
      chart = am4core.create(this.chartdiv, am4charts.XYChart);

      chart.padding(10, 10, 10, 10);
      chart.margin(0, 0, 0, 0);
      chart.align = 'center';

      chart.colors.list = [
        am4core.color('#67b7dc'),
        am4core.color('#ED8137'),
        am4core.color('#85b465'),
      ];

      chart.cursor = this.getChildCursor();
      this.getExcutionSummryCategoryAxis(chart);
      this.getExcutionSummryValueAxis(chart);
      chart.data = this.ChartData;
      this.getExcutionSummrySeries(chart);
      this.getExcutionSummryLegend();
    } else if (this.ChartType === ChartType.DefectTrends) {

      chart = am4core.create(this.chartdiv, am4charts.XYChart);

      chart.padding(20, 20, 20, 20);
      chart.margin(0, 0, 0, 0);
      chart.align = 'center';

      this.getDefectTrendsDateAxis(chart);
      this.getDefectTrendsCursor(chart);
      this.getDefectTrendsLegend(chart);
      chart.data = this.ChartData;
      this.getDefectTrendsSeries(chart);
    }
    else {

    }
  }


  private getDefectTrendsSeries(chart) {
    this.Series.forEach(ele => {
      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

      var series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = ele.name;
      series.dataFields.dateX = "date";
      series.strokeWidth = 2;
      series.yAxis = valueAxis;
      series.name = ele.displayname;
      series.tooltipText = "{name}: [bold]{valueY}[/]";
      series.tensionX = 0.8;
      series.showOnInit = true;

      var interfaceColors = new am4core.InterfaceColorSet();
      var bullet;
      switch (ele.bulletShape) {
        case "triangle":
          bullet = series.bullets.push(new am4charts.Bullet());
          bullet.width = 12;
          bullet.height = 12;
          bullet.horizontalCenter = "middle";
          bullet.verticalCenter = "middle";

          var triangle = bullet.createChild(am4core.Triangle);
          triangle.stroke = interfaceColors.getFor("background");
          triangle.strokeWidth = 2;
          triangle.direction = "top";
          triangle.width = 12;
          triangle.height = 12;
          break;
        case "rectangle":
          bullet = series.bullets.push(new am4charts.Bullet());
          bullet.width = 10;
          bullet.height = 10;
          bullet.horizontalCenter = "middle";
          bullet.verticalCenter = "middle";

          var rectangle = bullet.createChild(am4core.Rectangle);
          rectangle.stroke = interfaceColors.getFor("background");
          rectangle.strokeWidth = 2;
          rectangle.width = 10;
          rectangle.height = 10;
          break;
        default:
          bullet = series.bullets.push(new am4charts.CircleBullet());
          bullet.circle.stroke = interfaceColors.getFor("background");
          bullet.circle.strokeWidth = 2;
          break;
      }

      valueAxis.renderer.line.strokeOpacity = 1;
      valueAxis.renderer.line.strokeWidth = 2;
      valueAxis.renderer.line.stroke = series.stroke;
      valueAxis.renderer.labels.template.fill = series.stroke;
      valueAxis.renderer.opposite = ele.axisOpposite;
    });
  }

  private getDefectTrendsCursor(chart) {
    chart.cursor = new am4charts.XYCursor();
  }

  private getDefectTrendsLegend(chart) {
    chart.legend = new am4charts.Legend();
  }

  private getDefectTrendsDateAxis(chart) {
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;
  }

  private getExcutionSummrySeries(chart) {
    this.Series.forEach(element => {
      var lineSeries = chart.series.push(new am4charts.LineSeries());
      lineSeries.name = element.name;
      lineSeries.dataFields.categoryX = element.valueX;
      lineSeries.dataFields.valueY = element.valueY;
      lineSeries.tooltipText = "{name}: {valueY}";
      lineSeries.strokeWidth = 1.5;
      lineSeries.showOnInit = true;
    });
  }
  private getExcutionSummryLegend() {
    const legend = new am4charts.Legend();
    legend.useDefaultMarker = true;
    return legend;
  }
  private getExcutionSummryValueAxis(chart) {
    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = 'Cumulative Bugs Sourced';
    valueAxis.renderer.line.opacity = 0.8;
    valueAxis.cursorTooltipEnabled = false;
  }
  private getExcutionSummryCategoryAxis(chart) {
    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.title.text = 'WW since Power on';
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.line.opacity = 0.9;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.dataFields.category = "Month";
    categoryAxis.startLocation = 0;
    categoryAxis.cursorTooltipEnabled = false;
  }
  private getMainLegend(): am4charts.Legend {
    const legend = new am4charts.Legend();
    legend.useDefaultMarker = true;
    return legend;
  }


  private getMainCursor(): am4charts.XYCursor {
    const cursor = new am4charts.XYCursor();
    cursor.maxTooltipDistance = 5;
    return cursor;
  }

  private getChildCursor(): am4charts.XYCursor {
    const cursor = new am4charts.XYCursor();
    cursor.behavior = "panX";
    cursor.lineY.opacity = 0;
    cursor.maxTooltipDistance = 5;
    return cursor;
  }


  private getMainCategoryAxis(chart) {
    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());

    categoryAxis.dataFields.category = "FilterType";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 60;
    categoryAxis.renderer.line.strokeOpacity = 0.9;
    categoryAxis.renderer.cellStartLocation = 0.3;
    categoryAxis.renderer.cellEndLocation = 0.8;
  }

  private getChildCategoryAxis(chart) {
    const categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.line.opacity = 0.9;
    categoryAxis.renderer.ticks.template.disabled = true;
    categoryAxis.renderer.labels.template.disabled = true;
    categoryAxis.renderer.minGridDistance = (this.lineSeriesValue === 'stacked') ? 40 : 10;
    categoryAxis.dataFields.category = "Month";
    categoryAxis.startLocation = 0;
    categoryAxis.cursorTooltipEnabled = false;
    if (this.lineSeriesValue === 'stacked') {
      categoryAxis.renderer.line.strokeOpacity = 0.9;
      categoryAxis.renderer.cellStartLocation = 0.1;
      categoryAxis.renderer.cellEndLocation = 0.9;
    }
  }


  private getMainValueAxis(chart) {
    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.minGridDistance = 30;
    valueAxis.title.text = " [bold]No. of Defects";
  }

  private getChildValueAxis(chart) {
    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.line.opacity = 0;
    valueAxis.renderer.ticks.template.disabled = true;
    valueAxis.min = 0;
    valueAxis.renderer.grid.template.disabled = true;
    valueAxis.renderer.labels.template.disabled = true;
    valueAxis.cursorTooltipEnabled = false;
  }


  private getMainSeries(chart) {
    if (this.Series) {
      this.Series.forEach(d => {
        var series = chart.series.push(new am4charts.ColumnSeries3D());
        series.dataFields.valueY = d.valueY;
        series.dataFields.categoryX = d.valueX;
        series.name = d.name;
        series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
        series.stacked = true;
        series.fillOpacity = 0.7;
        series.columns.template.width = am4core.percent(d.width);
        var bullet = series.bullets.push(new am4charts.LabelBullet())
          bullet.label.text = "{valueY}";
          bullet.locationY = 0.5;
          bullet.label.hideOversized = true;
      });
    }
  }

  private getChildSeries(chart) {
    if (this.Series) {
      if (this.lineSeriesValue === 'stacked') {
        this.Series.forEach(element => {
          var lineSeries = chart.series.push(new am4charts.ColumnSeries());
          lineSeries.name = element.name;
          lineSeries.dataFields.categoryX = element.valueX;
          lineSeries.dataFields.valueY = element.valueY;
          lineSeries.tooltipText = "{name}: {valueY}";
          lineSeries.fillOpacity = 0.9;
          lineSeries.strokeWidth = 1.5;
        });
      }
      else if (this.lineSeriesValue === 'unstacked') {
        this.Series.forEach(element => {
          var lineSeries = chart.series.push(new am4charts.LineSeries());
          lineSeries.name = element.name;
          lineSeries.dataFields.categoryX = element.valueX;
          lineSeries.dataFields.valueY = element.valueY;
          lineSeries.tooltipText = "{name}: {valueY}";
          // lineSeries.fillOpacity = 0.9;
          lineSeries.strokeWidth = 3;
          lineSeries.showOnInit = true;
          // lineSeries.stroke = am4core.color("#67b7dc");
          // lineSeries.fill = am4core.color("#67b7dc");
          // lineSeries.stacked = true;
        });
      }
    }
  }

  Pie3d(data) {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    var chart = am4core.create(this.chartdiv, am4charts.PieChart3D);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    //chart.legend = new am4charts.Legend();
    chart.padding(10, 10, 10, 10);
      chart.margin(0, 0, 0, 0);

    chart.data = data;

    var series = chart.series.push(new am4charts.PieSeries3D());
    series.dataFields.value = "Count";
    series.dataFields.category = "category";

  }

  donut3d(data) {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    var chart = am4core.create(this.chartdiv, am4charts.PieChart3D);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    //chart.legend = new am4charts.Legend();
    chart.padding(0, 10, 0, 20);
    chart.margin(0, 0, 0, 0);

    chart.data = data;

    chart.innerRadius = 100;

    var series = chart.series.push(new am4charts.PieSeries3D());
    series.dataFields.value = "Count";
    series.dataFields.category = "category";
  }

  cylinderChart(data) {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var chart = am4core.create(this.chartdiv, am4charts.XYChart3D);

    //chart.titles.create().text = "Crude oil reserves";
    // Add data
    chart.data =  [
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
      },
      
    ];


    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.grid.template.strokeOpacity = 0;
    categoryAxis.renderer.baseGrid.strokeWidth = 1;
    categoryAxis.renderer.minGridDistance = 40;
    categoryAxis.renderer.baseGrid.strokeOpacity = 1;
    categoryAxis.renderer.baseGrid.stroke = am4core.color('#000');

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.grid.template.strokeOpacity = 0;
    valueAxis.min = 500;
    valueAxis.max = 1500;
    valueAxis.strictMinMax = true;
    valueAxis.renderer.baseGrid.disabled = true;
    valueAxis.renderer.baseGrid.strokeWidth = 1;
    valueAxis.renderer.baseGrid.strokeOpacity = 1;
    valueAxis.renderer.baseGrid.stroke = am4core.color('#000');

    // Create series
    var series1 = chart.series.push(new am4charts.ConeSeries());
    series1.dataFields.valueY = "Count";
    series1.dataFields.categoryX = "category";
    series1.columns.template.width = am4core.percent(65);
    series1.columns.template.fillOpacity = 0.9;
    series1.columns.template.strokeOpacity = 1;
    series1.columns.template.strokeWidth = 2;
  }
}
