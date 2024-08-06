import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SocketService } from '../../socket.service';
import { ToasterService } from '../../toaster.service';
import { Store } from '@ngrx/store';
import { AuthState } from '../../../../store/auth/auth.state';
import { selectUserInfo } from '../../../../store/auth/auth.selector';
import { Subject, takeUntil } from 'rxjs';
declare const Peer: any;

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrl: './meeting.component.css',
})
export class MeetingComponent implements OnInit {
  @ViewChild('localVideo') localVideo!: ElementRef;
  // @ViewChild('remoteVideo') remoteVideo!: ElementRef;
  userPeerId!: string;
  roomId: string | null = null;
  meetId: string | null = null;
  peer: any;
  socket: any;
  userRole: string | null = null;
  isMeetingOpen = false;
  participants: { id: string; stream?: MediaStream }[] = [];
  cameraEnabled = true;
  microPhoneEnabled = true;

  private _ngUnsubscribe$ = new Subject<void>();
  constructor(
    private socketService: SocketService,
    private _toasterService: ToasterService,
    private _store: Store<{ user: AuthState }>
  ) {}

  isVisible = false;
  ngOnInit(): void {
    this._store
      .select(selectUserInfo)
      .pipe(takeUntil(this._ngUnsubscribe$))
      .subscribe((res) => {
        // this.userRole = res.role;
        this.userRole = 'teacher';
      });
    this.socket = this.socketService.getSocket();
    this.initializePeer();

    this.socket.on('user-disconnected', (userId: string) => {
      this.removeParticipant(userId);
    });

    this.socket.on('meeting-ended', () => {
      this._toasterService.showWarning('The meeting has ended.');
      this.exitCall();
    });
  }

  initializePeer() {
    this.peer = new Peer(undefined, {
      host: 'localhost',
      port: 5070,
      path: '/peerjs',
      secure: false, // Set to true if using HTTPS
    });

    this.peer.on('open', (id: string) => {
      this.userPeerId = id;
    });

    this.peer.on('call', (call: any) => {
      this.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          call.answer(stream);
          call.on('stream', (remoteStream: MediaStream) => {
            this.addRemoteStream(call.peer, remoteStream);
          });
        })
        .catch((error) => {
          console.error('Error accessing media devices:', error);
          alert('Could not access media devices. Please check permissions.');
        });
    });
  }

  async joinRoom() {
    if (!this.roomId) {
      this._toasterService.showError('Enter a meeting Id to to join.');
      return;
    }

    try {
      this.isMeetingOpen = true;
      const stream = await this.getUserMedia({ video: true, audio: true });
      this.localVideo.nativeElement.srcObject = stream;
      this.localVideo.nativeElement.play();

      this.socket.emit('join-room', this.roomId, this.userPeerId);

      this.socket.on('user-connected', (userId: string) => {
        this.connectToNewUser(userId, stream);
      });

      this.socket.on('user-disconnected', (userId: string) => {
        this.removeParticipant(userId);
      });
    } catch (error) {
      this.isMeetingOpen = false;
      console.error('Error accessing media devices:', error);
      this._toasterService.showError(
        'Could not access media devices. Please check permissions.'
      );
    }
  }

  connectToNewUser(userId: string, stream: MediaStream) {
    const call = this.peer.call(userId, stream);
    call.on('stream', (remoteStream: MediaStream) => {
      this.addRemoteStream(userId, remoteStream);
    });
    call.on('error', (err: any) => {
      console.error('Call error:', err);
    });
  }

  addRemoteStream(userId: string, remoteStream: MediaStream) {
    const participantIndex = this.participants.findIndex(
      (participant) => participant.id === userId
    );

    if (participantIndex !== -1) {
      this.participants[participantIndex].stream = remoteStream;
    } else {
      this.participants.push({ id: userId, stream: remoteStream });
    }
    setTimeout(() => {
      this.updateRemoteVideoElement(userId, remoteStream);
    }, 100);
  }

  removeParticipant(userId: string) {
    this.participants = this.participants.filter(
      (participant) => participant.id !== userId
    );
    const videoElement = document.getElementById(`video-${userId}`);
    if (videoElement) {
      videoElement.remove();
    }
  }

  updateRemoteVideoElement(userId: string, remoteStream: MediaStream) {
    const videoElement = document.getElementById(
      `video-${userId}`
    ) as HTMLVideoElement;

    if (videoElement) {
      videoElement.srcObject = remoteStream;
      videoElement.play();
    }
  }

  getUserMedia(constraints: MediaStreamConstraints): Promise<MediaStream> {
    const navigatorWithDeprecatedGetUserMedia = navigator as any;

    const getUserMedia =
      navigator.mediaDevices?.getUserMedia ||
      navigatorWithDeprecatedGetUserMedia.webkitGetUserMedia ||
      navigatorWithDeprecatedGetUserMedia.mozGetUserMedia;

    if (!getUserMedia) {
      return Promise.reject(
        new Error('getUserMedia is not supported in this browser.')
      );
    }

    return navigator.mediaDevices.getUserMedia(constraints);
  }

  createNewMeeting() {
    const meetId = this.generateMeetingId();
    this.isVisible = true;
    this.meetId = meetId;
  }

  generateMeetingId() {
    const randomString = 'xxxx-4xxx-yxxx-xxx'.replace(/[xy]/g, function (c) {
      let r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
    return `meet.EduSpaceOnline-${randomString}`;
  }

  copyMeetingId() {
    if (!this.meetId) {
      return;
    }
    navigator.clipboard.writeText(this.meetId).then(
      () => {
        this._toasterService.showSuccess('Copied Meeting Id');
      },
      (error) => {
        this._toasterService.showError('Unknown error please try later');
      }
    );
  }

  toggleCamera() {
    this.cameraEnabled = !this.cameraEnabled;
    this.localVideo.nativeElement.srcObject
      .getVideoTracks()
      .forEach((track: MediaStreamTrack) => {
        track.enabled = this.cameraEnabled;
      });
  }

  toggleMic() {
    this.microPhoneEnabled = !this.microPhoneEnabled;
    this.localVideo.nativeElement.srcObject
      .getAudioTracks()
      .forEach((track: MediaStreamTrack) => {
        track.enabled = this.microPhoneEnabled;
      });
  }

  exitCall() {
    // Stop all media tracks
    const stream = this.localVideo.nativeElement.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    // Close all peer connections
    this.peer.destroy();

    // Emit an event to the server to notify others
    this.socket.emit('leave-room', this.roomId, this.userPeerId);

    // Reset the state
    this.participants = [];
    this.isMeetingOpen = false;

    // Navigate away or update UI
    this._toasterService.showSuccess('You have left the call.');
  }

  endMeeting() {
    // Notify other participants that the meeting is ending
    this.socket.emit('end-meeting', this.roomId);

    // Perform the same actions as exiting the call
    this.exitCall();

    // Show a message or navigate to a different page
    this._toasterService.showSuccess('Meeting ended successfully.');
  }

  closeModal() {
    this.isVisible = false;
    this.meetId = null;
  }
}
