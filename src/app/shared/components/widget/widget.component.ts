import { Component, OnInit, AfterViewInit, Input, OnDestroy } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4themes_dark from '@amcharts/amcharts4/themes/dark';

@Component({
  selector: 'cqi-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.css']
})
export class WidgetComponent implements OnInit, AfterViewInit {
  @Input() widget: any;
  constructor() { }
  id;
  data;
  ngOnInit(): void {
    this.id = this.widget.domainGroupName;
    var obj = [
      {
        'category': "Sighting Percent",
        'value': this.widget.sightingPercent,
        "full": 100
      }, {
        'category': "Traige Accuracy",
        'value': this.widget.traigeAccuracy,
        "full": 100
      }]
    this.data = obj;
  }
  ngAfterViewInit() {
    this.createChart();
  }

  createChart() {
    am4core.options.autoSetClassName = true;
    am4core.options.commercialLicense = true;
    //am4core.options.autoDispose = true;
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    let chart = am4core.create(this.id, am4charts.XYChart);
    chart.numberFormatter.numberFormat = "#'%'";
    // Add data
    chart.data = this.data;
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
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "category";
    series.name = "value";
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = 1;

    /* let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1; */



    series.columns.template.adapter.add("fill", function (fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });

  }

  /*  createChart() {
     am4core.options.autoSetClassName = true;
     am4core.options.commercialLicense = true;
     // Themes begin
     am4core.useTheme(am4themes_animated);
     // Themes end
 
     // Create chart instance
     var chart = am4core.create(this.id, am4charts.RadarChart);
 
     // Add data
     chart.data = this.data;
 
     // Make chart not full circle
     chart.startAngle = -90;
     chart.endAngle = 180;
     chart.innerRadius = am4core.percent(20);
 
     // Set number format
     chart.numberFormatter.numberFormat = "#.#'%'";
 
     // Create axes
     var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis<am4charts.AxisRendererRadial>());
     categoryAxis.dataFields.category = "category";
     categoryAxis.renderer.grid.template.location = 0;
     categoryAxis.renderer.grid.template.strokeOpacity = 0;
     categoryAxis.renderer.labels.template.horizontalCenter = "right";
     //categoryAxis.renderer.labels.template.fontWeight = 500;
     categoryAxis.renderer.labels.template.adapter.add("fill", function (fill, target) {
       return (target.dataItem.index >= 0) ? chart.colors.getIndex(target.dataItem.index) : fill;
     });
     categoryAxis.renderer.minGridDistance = 10;
 
     var valueAxis = chart.xAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererCircular>());
     valueAxis.renderer.grid.template.strokeOpacity = 0;
     valueAxis.min = 0;
     valueAxis.max = 100;
     valueAxis.strictMinMax = true;
 
     // Create series
     var series1 = chart.series.push(new am4charts.RadarColumnSeries());
     series1.dataFields.valueX = "full";
     series1.dataFields.categoryY = "category";
     series1.clustered = false;
     series1.columns.template.fill = new am4core.InterfaceColorSet().getFor("alternativeBackground");
     series1.columns.template.fillOpacity = 0.08;
     //series1.columns.template.cornerRadiusTopLeft = 20;
     series1.columns.template.strokeWidth = 0;
     series1.columns.template.radarColumn.cornerRadius = 20;
 
     var series2 = chart.series.push(new am4charts.RadarColumnSeries());
     series2.dataFields.valueX = "value";
     series2.dataFields.categoryY = "category";
     series2.clustered = false;
     series2.columns.template.strokeWidth = 0;
     series2.columns.template.tooltipText = "{category}: [bold]{value}[/]";
     series2.columns.template.radarColumn.cornerRadius = 20;
 
     series2.columns.template.adapter.add("fill", function (fill, target) {
       return chart.colors.getIndex(target.dataItem.index);
     });
 
     // Add cursor
     chart.cursor = new am4charts.RadarCursor();
   } */
}
