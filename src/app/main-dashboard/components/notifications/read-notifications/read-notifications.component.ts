import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/api';
import { NotificationService } from '../../../services/notification.service';
import { Subscription, forkJoin } from 'rxjs';
import { DateRangeService } from '../../../services/shared-date-range/date-range.service';
import { AuthenticationService } from '../../../../auth/services/authentication.service';

interface CustomMessage extends Message {
  read: boolean;
  sources:string;
}

@Component({
  selector: 'app-read-notifications',
  templateUrl: './read-notifications.component.html',
  styleUrls: ['./read-notifications.component.scss']
})
export class ReadNotificationsComponent implements OnInit {

  showDatePicker: boolean = true;
  sidebarVisible: boolean = true;
  rangeDates: Date[] | undefined;

  visible:boolean =false;
  showData:any[]=[];

  filteredNotifications: CustomMessage[] = [];

  readnotifications: CustomMessage[] = [{severity: "info", summary: "No Notifications", detail: "Empty",read:false,sources:'' }];
  unreadnotifications: CustomMessage[] = [];
  emptyRead:boolean=true;
  refreshTime:number = 1000;

  private socketSubscription: Subscription | undefined;

  constructor(private notificationService: NotificationService,
    private dateRangeService:DateRangeService,
    private authService: AuthenticationService
  )
  {}

  ngOnInit(): void {
    this.readNotification();


    this.socketSubscription = this.notificationService.messages$.subscribe(
      message => {
        this.readNotification();
      }
  );

  this.dateRangeService.currentDateRange.subscribe(range => {
    if (range && range.length > 0) {
      const startDate = new Date(range[0]);
      let endDate = new Date(range[0]);

      if (range[1]) {
        endDate = new Date(range[1]);
      }
      this.filteredNotifications = this.readnotifications.filter(notification => {
        const notificationDate = new Date(notification.summary || '');
        // Include the end date in the range
        return notificationDate >= startDate && notificationDate <= endDate;
      });
    } else {
      this.filteredNotifications = this.readnotifications;
    }
  });

  }

  viewNotification(notification:any){
    this.visible=true;
    this.showData=[notification['summary'],notification['data'],notification['detail']];
    if(notification.read==true)
      {
        this.authService.getIdToken().subscribe((token) =>{
        this.notificationService.updateUnreadNotifications(token,notification.id).subscribe(
          (response) => {
            this.readNotification();
                    },
        );
      });
        
      }
  }

  addMessages(){
   this.readNotification();
  }

  clearMessages(){
    const existingNotificationDicts = this.readnotifications.map(notification => ({ id: notification.id }));
    this.readnotifications = [];
    this.unreadnotifications= [];
    this.filteredNotifications=[];
    this.authService.getIdToken().subscribe((token) =>{
    this.notificationService.updateReadNotifications(token,existingNotificationDicts).subscribe(
      (response) => {
        this.readNotification();
      },
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

      this.filteredNotifications = this.readnotifications.filter(notification => {
        const notificationDate = new Date(notification.summary || '');
        // Include the end date in the range
        return notificationDate >= startDate && notificationDate <= endDate;
      });
    } else {
      this.filteredNotifications = this.readnotifications;
    }
  }

  dateReset(){
    this.rangeDates=[];
    this.onDateRangeChange();
  }

  filterNotificationsByDate() {
    if (this.rangeDates && this.rangeDates.length === 2) {
      const [startDate, endDate] = this.rangeDates;
      this.filteredNotifications = this.readnotifications.filter(notification => {
        const notificationDate = new Date(notification.summary || '');
        return notificationDate >= startDate && notificationDate <= endDate;
      });
    } else {
      this.filteredNotifications = this.readnotifications;
    }
  }


  // readNotification() {
  //   this.notificationService.getReadNotifications().subscribe(
  //     (notifications) => {
  //       console.log(notifications);
  //       if(notifications.length!=0){
  //         const newIds = notifications.map((notification: { id: any }) => notification.id);
  //         this.readnotifications = this.readnotifications.filter(notification => newIds.includes(notification.id));
  //       // Iterate over each read notification
  //       for (const notification of notifications) {
  //         // Check if the notification already exists in the list
  //         const existingNotificationIndex = this.readnotifications.findIndex(readNotification => readNotification.id === notification.id);
  //         if (existingNotificationIndex === -1) {
  //           // If the notification doesn't exist, add it to the list
  //           const newMessage: Message = {
  //             severity: "success",
  //             detail: notification.alert,
  //             summary: notification.created_at,
  //             id: notification.id ,// Assuming id is a unique identifier for notifications
  //             data:notification.email
  //           };
  //           this.readnotifications.push(newMessage);
  //         }
  //       }
  //       this.emptyRead=true
  //       this.filteredNotifications=this.readnotifications;
  //       this.unreadnotifications = this.readnotifications;
  //     }
  //     else if (this.emptyRead) {
  //       this.readnotifications = [{severity: "success", summary: "No Notifications", detail: "Empty" }];
  //       this.filteredNotifications=this.readnotifications;
  //       this. emptyRead = false
  //     }
  //     },

  //   );
  // }


  readNotification(): void {
    this.authService.getIdToken().subscribe((token) => {
      forkJoin([
        this.notificationService.getReadNotifications(token),
        this.notificationService.getNotifications(token)
      ]).subscribe(([readNotifications, unreadNotifications]) => {
  
        const unreadNotificationsTemp: CustomMessage[] = [];
        const readNotificationsTemp: CustomMessage[] = [];
        let emptyRead = false;
        let emptyUnread = false;
  
        // Process unread notifications
        if (unreadNotifications.length !== 0) {
          for (const notification of unreadNotifications) {
            const newMessage: CustomMessage = {
              severity: "info",
              summary: notification.datetime,
              detail: notification.title,
              id: notification.id,
              data: notification.description,
              read: true,  // Mark as unread
              sources: notification.sources
            };
            unreadNotificationsTemp.push(newMessage);
          }
        } else {
          emptyUnread = true;
        }
  
        // Process read notifications
        if (readNotifications.length !== 0) {
          for (const notification of readNotifications) {
            const newMessage: CustomMessage = {
              severity: "success",
              summary: notification.datetime,
              detail: notification.title,
              id: notification.id,
              data: notification.description,
              read: false,  // Mark as read
              sources: notification.sources
            };
            readNotificationsTemp.push(newMessage);
          }
        } else {
          emptyRead = true;
        }
  
        // Sort unread notifications by datetime from most recent to least recent
        unreadNotificationsTemp.sort((a, b) => 
          new Date(b.summary || "").getTime() - new Date(a.summary || "").getTime()
        );
  
        // Sort read notifications by datetime from most recent to least recent
        readNotificationsTemp.sort((a, b) => 
          new Date(b.summary || "").getTime() - new Date(a.summary || "").getTime()
        );
  
        // Concatenate unread and read notifications
        const allNotifications = unreadNotificationsTemp.concat(readNotificationsTemp);
  
        // Handle empty notifications for both read and unread
        if (emptyRead && emptyUnread) {
          this.filteredNotifications = [{ severity: "info", summary: "No Notifications", detail: "Empty", read: false, sources: '' }];
        } else {
          this.filteredNotifications = allNotifications;
        }
  
        this.readnotifications = allNotifications;
      });
    });
  }
  
  }
