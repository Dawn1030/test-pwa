import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Menu } from 'src/app/core/interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  menuList: Array<Menu> = [
    { name: 'IndexedDB', url: '/test/indexeddb'},
    { name: 'Push', url: '/test/push'},
  ];

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goPage(url) {
    this.router.navigate([url]);
  }
}
