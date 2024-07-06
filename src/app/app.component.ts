import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from "@angular/router";
import { WebSocketService } from "./shared/shared-services/web-socket.service";
import { webSocket } from "rxjs/webSocket";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'iCMS-Frontend';
  currentUrl = "";
  isAuthLayout = false;

  constructor(private router: Router, private webSocketService: WebSocketService) {
    this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.currentUrl = event.url
          this.isAuthLayout = this.currentUrl.includes("auth");
        }
      });
    // this.webSocketService.connect("ws://localhost:8000/ws/notify");
  }

  ngOnInit() {
    // this.webSocketService.sendMessage("Hello from the client!");
    // const liveData$ = this.webSocketService.messages$.pipe(
    //   map((rows:any) => rows.data),
    //   catchError(error => { throw error }),
    //   tap({
    //       error: error => console.log('[Live component] Error:', error),
    //       complete: () => console.log('[Live component] Connection Closed')
    //     }
    //   )
    // );
    // liveData$.subscribe((data) => {
    //   console.log(data);
    // });

    const subject = webSocket("ws://localhost:8000/ws/notify");

    subject.subscribe({
      next: msg => console.log('message received: ' + msg), // Called whenever there is a message from the server.
      error: err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
      complete: () => console.log('complete') // Called when connection is closed (for whatever reason).
    });
  }
}
