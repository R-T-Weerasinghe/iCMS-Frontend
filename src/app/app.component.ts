import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'iCMS-Frontend';
  currentUrl = "";
  isAuthLayout = false;

  constructor(private router: Router) {
    this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.currentUrl = event.url
          this.isAuthLayout = this.currentUrl.includes("auth");
        }
      });
  }

  ngOnInit() {

  }
}
