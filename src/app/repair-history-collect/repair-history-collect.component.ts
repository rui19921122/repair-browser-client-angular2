import {Component, OnInit} from '@angular/core';
import {UserService} from '../user.service';

@Component({
  selector: 'app-repair-history-collect',
  templateUrl: './repair-history-collect.component.html',
  styleUrls: ['./repair-history-collect.component.css']
})
export class RepairHistoryCollectComponent implements OnInit {
  public page_height: number;

  constructor(public user_service: UserService) {
    this.page_height = window.innerHeight - 52;
    console.log(this.page_height);
  }

  ngOnInit() {
  }

}
