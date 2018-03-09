import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-navbar-button',
  templateUrl: './navbar-button.component.html',
  styleUrls: ['./navbar-button.component.css']
})
export class NavbarButtonComponent implements OnInit {
  @Input() icon: string;

  constructor() {
  }

  ngOnInit() {
  }

}
