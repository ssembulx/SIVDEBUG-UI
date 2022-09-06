import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cqi-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  message: string;
  ngOnInit(): void {
    this.route.queryParams.subscribe(data => {      
      this.message = data['message'];
    });
  }

}
