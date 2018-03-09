import {Component, OnInit, ViewEncapsulation} from '@angular/core';

// 展现当前将要提交的数据的错误信息
@Component({
  selector: 'app-check-post-data-dialog',
  templateUrl: './check-post-data-dialog.component.html',
  styleUrls: ['./check-post-data-dialog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CheckPostDataDialogComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
