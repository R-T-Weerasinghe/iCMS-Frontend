export interface EmailAcc {
    address: string;   
}

export interface EmailAccWithNickName {
  address: string;   
  nickname: string;
}



export interface SSShiftData {
    accs_to_check_ss: EmailAcc[];
    ss_lower_bound: number;
    ss_upper_bound: number;
    is_checking_ss: boolean;
    is_lower_checking: boolean;
    is_upper_checking: boolean;
}

export interface NotiSendingChannelsRecord{
    user_name:string;
    is_dashboard_notifications: boolean;
    is_email_notifications: boolean;
    noti_sending_emails:EmailAcc[];
}

export interface PostingNotiSendingChannelsRecord{
  is_dashboard_notifications: boolean;
  is_email_notifications: boolean;
  noti_sending_emails:string[];
}


export interface PostNewIntegratingEmail{
  emailAddress: string,
  nickName: string,
  clientSecret:string
}

export interface PostingCriticalityData{
  accs_to_check_criticality: string[]
}

export interface PostingOverdueIssuesData{
  accs_to_check_overdue_emails: string[]
}

export interface SendSystemConfigData{
    overdue_margin_time: number;
}

export interface UserRoleResponse{
    isAdmin: boolean;
}


export interface DeleteNotiSendingEmail{
  noti_sending_emails: string[];
}

export interface DeleteReadingEmail{
  removing_email: string;
}

