import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CallRecordingService } from "../../services/call-recording.service";
import { CallRecording } from "../../types";
import { CallAnalyticsService } from "../../services/call-analytics.service";
import userMessages from "../../../shared/user-messages";
import UserMessages from "../../../shared/user-messages";
import { MessageService } from "primeng/api";
import { TokenStorageService } from "../../../shared/shared-services/token-storage.service";
import { CallOperatorService } from "../../services/call-operator.service";

@Component({
  selector: 'app-call-summary-chart',
  templateUrl: './call-summary-chart.component.html',
  styleUrl: './call-summary-chart.component.scss'
})
export class CallSummaryChartComponent implements OnInit {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  callRecordings: CallRecording[] = [];
  statusColors!: { [key: string]: string };
  visibleSummary: boolean = false;
  visiblePlay: boolean = false;
  visibleConfirmation: boolean = false;
  selectedCall!: CallRecording; // Add a property to store the selected call details
  audio: any;
  audioPosition: any;
  currentTime: any;
  totalTime: any;
  email: any;
  selectedCallSummary: string = "";
  isError: boolean = false;
  isLoading: boolean = true;
  noData: boolean = false;
  isAbleToDelete: boolean = false;
  isOperator: boolean = false
  operatorId: any;
  protected readonly userMessages = userMessages;

  constructor(
    private callRecordingService: CallRecordingService,
    private callOperatorService: CallOperatorService,
    private callAnalyticsService: CallAnalyticsService,
    private messageService: MessageService,
    private tokenStorageService: TokenStorageService
  ) {
  }

  ngOnInit() {
    let permissions = this.tokenStorageService.getStorageKeyValue("permissions");
    this.email = this.tokenStorageService.getEmailFromLocalStorage("permissions");
    this.isAbleToDelete = permissions.includes("Delete Call Recording");
    const documentStyle: CSSStyleDeclaration = getComputedStyle(document.documentElement);
    this.statusColors = {
      "Positive": documentStyle.getPropertyValue("--positive-color"),
      "Negative": documentStyle.getPropertyValue("--negative-color"),
      "Neutral": documentStyle.getPropertyValue("--neutral-color")
    }
    this.reloadDataSource();
  }

  onConfirmDelete(callId: string) {
    this.visibleConfirmation = false;
    this.deleteCall(callId);
  }

  reloadDataSource(): void {
    if (this.email) {
      this.callOperatorService.getOperatorByEmail(this.email).subscribe((response) => {
        console.log('Operator ', response.data);
        if (response.data && Object.keys(response.data).length > 0) {
          this.isOperator = true;
          this.operatorId = response.data.operator_id;
        }
      });
    } else {
      console.log('No email found in localStorage');
    }
    try {
      this.isLoading = true;
      this.callRecordingService.getCallsList().subscribe((data) => {
        // Map the fetched data to match the structure of callRecordings
        if (data.status) {
          if (data.data.length === 0) {
            this.noData = true;
          } else {
            this.callRecordings = data.data.map((record: any) => {
              console.log(record);
              return {
                id: record.id,
                description: record.description,
                transcription: record.transcription,
                callUrl: record.call_recording_url,
                duration: record.call_duration ?? 4.39,
                date: new Date(record.call_date),
                sentiment: record.sentiment,
                keywords: record.keywords,
                topics: record.topics,
                operator_id: record.operator_id,
              } as CallRecording;
            });
            console.log('Fetched callRecordings:', this.callRecordings);
            // If the user is an operator, filter the call recordings by operator ID
            if (this.isOperator) {
              this.callRecordings = this.callRecordings.filter(record => record.operator_id === this.operatorId);
              if (this.callRecordings.length > 0) {
                this.noData = false
              } else {
                this.noData = true
              }
            } else {
              this.noData = false;
            }

          }
        } else {
          this.isError = true;
          this.messageService.add({ severity: "error", summary: "Error", detail: UserMessages.FETCH_ERROR });
        }
        this.isLoading = false;
      }, (error) => {
        console.error('Error fetching call recordings', error);
        this.isError = true;
        this.isLoading = false;
        this.messageService.add({ severity: "error", summary: "Error", detail: UserMessages.FETCH_ERROR });
      });
    } catch (error) {
      console.error('Error fetching recordings', error);
      this.isError = true;
    }
  }


  showDialogSummary(call: CallRecording): void {
    this.selectedCall = call;
    this.callAnalyticsService.getCallSummary(call.id).then(response => {
      this.selectedCallSummary = response.data.summary;
      console.log(response);
      console.log(call);
    }).catch(err => {
      console.log(err)
      this.selectedCallSummary = "Sorry, failed to get the call summary."
    }).finally(() => {
      this.visibleSummary = true;
    });
  }

  showDialogPlay(call: CallRecording): void {
    this.selectedCall = call;
    this.visiblePlay = true;
  }

  showDialogConfirmation(call: CallRecording): void {
    this.selectedCall = call;
    this.visibleConfirmation = true;
  }

  // Function to play the audio
  playAudio(audioUrl: string) {
    if (!this.audio) {
      this.audio = new Audio(audioUrl);
      this.audio.play();

    } else {
      // If audio is already playing, resume from the stop position
      this.audio.play();
    }
    this.audio.currentTime = this.audioPosition;
    this.audio.addEventListener('timeupdate', this.updateTime.bind(this));
  }

  pauseAudio() {
    if (this.audio) {
      // Store the current playback position before pausing
      this.audio.pause();
      this.audioPosition = this.audio.currentTime;
    }
  }

  resumeAudio() {
    if (this.audio && this.audioPosition !== null) {
      this.audio.play();
      this.audio.currentTime = this.audioPosition;
    }
  }

  increaseVolume() {
    const audioElement = document.querySelector('audio') as HTMLAudioElement;
    if (audioElement) {
      audioElement.volume += 0.1; // Increase volume by 0.1
    }
  }

  updateTime() {
    if (this.audio) {
      this.currentTime = this.audio.currentTime;
      this.totalTime = this.audio.duration;
    }
  }

  deleteCall(call_id: string) {
    this.callRecordingService.deleteCall(call_id).subscribe({
      next: (data) => {
        console.log('Delete successful', data);
        this.reloadDataSource();  // Method to refresh the call recordings list
      },
      error: (error) => {
        console.error('Error deleting call', error);
      }
    });
  }
}
