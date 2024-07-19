import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-call-recordings',
  templateUrl: './call-recordings.component.html',
  styleUrl: './call-recordings.component.scss',
})
export class CallRecordingsComponent {
  breadcrumbItems: MenuItem[] = [
    { label: 'Call Analytics', routerLink: '/call/dashboard' },
    { label: 'Call Recordings' },
  ];

  constructor(private router: Router) {
  }

  addCallRecording(): void {
    this.router.navigate(['/call/upload']);
  }
}
