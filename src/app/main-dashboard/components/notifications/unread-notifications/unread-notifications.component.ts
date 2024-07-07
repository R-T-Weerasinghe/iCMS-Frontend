import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/api';
import {NotificationService} from "../../../services/notification.service"
import { Subscription } from 'rxjs';
import { DateRangeService } from '../../../services/shared-date-range/date-range.service';
import { AuthenticationService } from '../../../../auth/services/authentication.service';

@Component({
  selector: 'app-unread-notifications',
  templateUrl: './unread-notifications.component.html',
  styleUrl: './unread-notifications.component.scss'
})
export class UnreadNotificationsComponent implements OnInit {

  showDatePicker: boolean = true;
  sidebarVisible: boolean = true;
  rangeDates: Date[] | undefined;

  message:string="Are you confirm to Ingnore";

  visible:boolean =false;
  showData:any[]=[];

  filteredNotifications: Message[] = [];

  notifications: Message[] = [];
  readNotifications: Message[]= [];
  notificationCount: number = 0;
  emptyUnread:boolean=true;
  refreshTime:number = 1000;


  private socketSubscription: Subscription | undefined;

  constructor(private notificationService: NotificationService,
    private dateRangeService:DateRangeService,
    private authService: AuthenticationService
  )
  {}

  ngOnInit(): void {
    this.fetchNotifications();

    this.socketSubscription = this.notificationService.messages$.subscribe(
      message => {
        console.log(message);
        this.fetchNotifications();
      }
    );

    
  this.dateRangeService.currentDateRange.subscribe(range => {
    if (range && range.length > 0) {
      const startDate = new Date(range[0]);
      let endDate = new Date(range[0]);

      if (range[1]) {
        endDate = new Date(range[1]);
      }
      this.filteredNotifications = this.notifications.filter(notification => {
        console.log(notification.summary);
        const notificationDate = new Date(notification.summary || '');
        // Include the end date in the range
        return notificationDate >= startDate && notificationDate <= endDate;
      });
    } else {
      this.filteredNotifications = this.notifications;
    }
  });
  }

  addMessages(){
    this.fetchNotifications();
  }

  clearMessages(){
    const existingNotificationDicts = this.notifications.map(notification => ({ id: notification.id }));
    this.notifications = [];
    this.readNotifications= [];
    this.filteredNotifications=[];
    this.authService.getIdToken().subscribe((token) =>{
    this.notificationService.updateUnreadNotifications(token,existingNotificationDicts).subscribe(
      (response) => {

      },
  );
});
  }

  ignoreMessages(notificationID:any){
    const index = this.notifications.findIndex(n => n.id === notificationID);
    if (index !== -1) {
      this.notifications.splice(index, 1);
      this.filteredNotifications=this.notifications;
      this.notificationCount = this.notifications.length;
    }

    this.authService.getIdToken().subscribe((token) =>{
    this.notificationService.updateUnreadNotifications(token,[{ id: notificationID }]).subscribe(
      (response) => {
      },
  );
});

  }

  viewNotification(notification:any){
    this.visible=true;
    this.showData=[notification['summary'],notification['data'],notification['detail']];
  }

  dateReset(){
    this.rangeDates=[];
    this.onDateRangeChange();
  }

  fetchNotifications() {
    this.authService.getIdToken().subscribe((token) =>{
    this.notificationService.getNotifications(token).subscribe(
      (newNotifications) => {

        if(newNotifications.length!==0){
          const newIds = newNotifications.map((notification: { id: any }) => notification.id);

          // Remove notifications that are not present in the new API response
          this.notifications = this.notifications.filter(notification => newIds.includes(notification.id));

          // Iterate over each new notification
          for (const newNotification of newNotifications) {
            // Check if the notification already exists in the list
            const existingNotificationIndex = this.notifications.findIndex(notification => notification.id === newNotification.id);

            if (existingNotificationIndex === -1) {
              // If the notification doesn't exist, add it to the list
              const newMessage: Message = {
                severity: "info",
                summary: newNotification.datetime,
            detail: `${newNotification.sources} : ${newNotification.title}`,
            id: newNotification.id,
            data: newNotification.description
              };
              this.notifications.push(newMessage);
            }
          }

          this.readNotifications = this.notifications;
          this.filteredNotifications = this.notifications;
          this.notificationCount = this.notifications.length;
          this.emptyUnread=true

        }
        else if (this.emptyUnread) {
          this.notifications = [{severity: "info", summary: "No Notifications", detail: "Empty" }];
          this.filteredNotifications = this.notifications;
          this. emptyUnread = false
        }

      }
    );
  });

  }


  onDateRangeChange() {
    if (this.rangeDates && this.rangeDates.length > 0) {
      const startDate = new Date(this.rangeDates[0]);
      let endDate = new Date(this.rangeDates[0]);

      if (this.rangeDates[1]) {
        endDate = new Date(this.rangeDates[1]);
      }

      this.filteredNotifications = this.notifications.filter(notification => {
        console.log(notification.summary);
        const notificationDate = new Date(notification.summary || '');
        // Include the end date in the range
        return notificationDate >= startDate && notificationDate <= endDate;
      });
    } else {
      this.filteredNotifications = this.notifications;
    }
  }

}
