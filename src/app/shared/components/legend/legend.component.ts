import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Legend } from '../../models/legend';
import { ChartType } from 'src/app/models/chart-type';

@Component({
  selector: 'cqi-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.css']
})
export class LegendComponent implements OnInit {

  @Input() model: Legend;
  @Input() smallchart: string;
  @Input() ChartType: ChartType;
  @Input() ChartData: any[];
  @Input() Series: any[];
  @Input() lineSeriesValue: string;
  @Input() idx: number;

  @Output() legendClickEvent: EventEmitter<string> = new EventEmitter<string>();
  public constructor() {

  }

  ngOnInit(): void {

  }

  legendClick(platformName: string) {
    this.legendClickEvent.emit(platformName);
  }
}