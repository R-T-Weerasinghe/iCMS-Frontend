import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../auth/services/authentication.service';
import { AppConfigService } from '../../services/app-config.service';
import { MenuItem } from 'primeng/api';
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-configurations',
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.scss']
})
export class ConfigurationsComponent implements OnInit {
  subscribedUsersActivity: string[] = []
  subscribedUsersAlert: string[] = []
  breadcrumbItems: MenuItem[] = [
    { label: 'App Settings' },
    { label: 'Configurations' },
  ];


  activity_counts = [
      {name: 'Add User', value: 0},
      {name: 'View Users', value: 0},
      {name: 'View User', value: 0},
      {name: 'Edit User', value: 0},
      {name: 'Delete User', value: 0},
      {name: 'Enable User', value: 0},
      {name: 'Disable User', value: 0},
      {name: 'Add Role', value: 0},
      {name: 'View Roles', value: 0},
      {name: 'View Role', value: 0},
      {name: 'Edit Role', value: 0},
      {name: 'Delete Role', value: 0},
      {name: 'Edit Config', value: 0},
      {name: 'View Config', value: 0},
      {name:'View Logs', value: 0},
    ];
    activity_weights = [
      {name: 'Add User', value: 0},
      {name: 'View Users', value: 0},
      {name: 'View User', value: 0},
      {name: 'Edit User', value: 0},
      {name: 'Delete User', value: 0},
      {name: 'Enable User', value: 0},
      {name: 'Disable User', value: 0},
      {name: 'Add Role', value: 0},
      {name: 'View Roles', value: 0},
      {name: 'View Role', value: 0},
      {name: 'Edit Role', value: 0},
      {name: 'Delete Role', value: 0},
      {name: 'Edit Config', value: 0},
      {name: 'View Config', value: 0},
      {name:'View Logs', value: 0},
    ];

    rules =[
      {name:"activity_alert_threshold", value: 0},
      {name:"activity_block_threshold", value: 0},
      {name:"auth sign faild alert threshold", value: 0},
      {name:"auth sign faild block threshold", value: 0},
      {name:"signin time zone diff alert", value: 0},
      {name:"signin time zone diff block", value: 0},
      {name:"block malvicious IPs", value: false},
      {name:"work time starts", value: 0},
      {name:"work time ends", value: 0},
      {name:"block users within unusual work hours", value: false},
      {name:"alert users within unusual work hours", value: false}
  ]


  constructor(
    private authService: AuthenticationService,
    private appConfigService: AppConfigService,
    private messageService: MessageService
  ) {

  }

  ngOnInit() {
    this.getSubscribedUsers();
    this.getAverageActions();
    this.getWeights();
    this.getRules()
  }

  getSubscribedUsers(): any {
    this.authService.getIdToken().subscribe((token) => {
      this.appConfigService.getSubscribedUsers(token).subscribe((response: any) => {
        console.log(response);
        let activityUsers = [];
        let alertUsers = [];
        for (let user of response) {
          if (user.type === 'activity') {
            activityUsers.push(user.username);
          } else if (user.type === 'alert') {
            alertUsers.push(user.username);
          }
        }
        // Assign new arrays to trigger change detection
        this.subscribedUsersActivity = [...activityUsers];
        this.subscribedUsersAlert = [...alertUsers];

        console.log(this.subscribedUsersActivity);
        console.log(this.subscribedUsersAlert);
      });
    });
  }

  setSubscribedUsersActivity(): any {
    let subcribers:{'username':string,'type':string} [] = [];

    this.authService.getIdToken().subscribe((token) => {
      for (let user of this.subscribedUsersActivity) {
        subcribers.push({username: user, type: 'activity'});
      }
      for (let user of this.subscribedUsersAlert) {
        subcribers.push({username: user, type: 'alert'});
      }
      this.appConfigService.setSubscribedUsers(token, subcribers).subscribe((response: any) => {
        this.messageService.add({severity: 'success', summary: 'Success', detail: 'Subscribed users updated successfully'});
      });
    });
  }
  getWeights(): any {
    this.authService.getIdToken().subscribe((token) => {
      this.appConfigService.getWeights(token).subscribe((response: any) => {
        console.log(response);
        this.activity_weights = response
      });
    });
  }
  getAverageActions(): any {
    this.authService.getIdToken().subscribe((token) => {
      this.appConfigService.getAverageActions(token).subscribe((response: any) => {
        console.log(response);
        this.activity_counts = response
      });
    });
  }

  saveSecurityConfigs() {

    this.authService.getIdToken().subscribe((token) => {
      this.appConfigService.setWeights(token, this.activity_weights).subscribe((response: any) => {
      });
      this.appConfigService.setAverageActions(token, this.activity_counts).subscribe((response: any) => {
        this.messageService.add({severity: 'success', summary: 'Success', detail: 'Security configurations updated successfully'});
      })
      this.appConfigService.setRules(token, this.rules).subscribe((response: any) => {
      });
    });

  }

  getRules(): any {
    this.authService.getIdToken().subscribe((token) => {
      this.appConfigService.getRules(token).subscribe((response: any) => {
        console.log(response);
        this.rules = response
      });
    });
  }

  setRules(): any {

  }
  isNumber(value: any): boolean {
    return typeof value === 'number' && !isNaN(value);
  }
  onNotificationFormSubmit() {

  }

  onSecurityFormSubmit() {

  }

  onAdvancedSettingsFormSubmit() {

  }
}
