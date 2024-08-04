import { Component, OnInit } from '@angular/core';
import { io } from 'socket.io-client';
import { environments } from '../../../../../environments/environments';

@Component({
  selector: 'app-video-chat',
  templateUrl: './video-chat.component.html',
  styleUrls: ['./video-chat.component.css'],
})
export class VideoChatComponent implements OnInit {
  private socket: any;
  private localStream: MediaStream | null = null;
  private peerConnection: RTCPeerConnection | null = null;
  private config = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  };
  roomId: string = ''; // Variable to hold the meeting ID

  constructor() {
    this.socket = io(environments.chatServiceUrl); 
  }

  ngOnInit(): void {
    this.socket.on('offer', async (offer: RTCSessionDescriptionInit) => {
      await this.handleOffer(offer);
    });

    this.socket.on('answer', async (answer: RTCSessionDescriptionInit) => {
      await this.handleAnswer(answer);
    });

    this.socket.on('ice-candidate', (candidate: RTCIceCandidate) => {
      this.handleIceCandidate(candidate);
    });
  }

  async startCall() {
    if (!this.roomId) {
      alert('Please enter a meeting ID');
      return;
    }

    this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const localVideo = document.getElementById('localVideo') as HTMLVideoElement;
    localVideo.srcObject = this.localStream;

    this.peerConnection = new RTCPeerConnection(this.config);

    this.localStream.getTracks().forEach(track => {
      this.peerConnection?.addTrack(track, this.localStream!);
    });

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('ice-candidate', this.roomId, event.candidate);
      }
    };

    this.peerConnection.ontrack = (event) => {
      const remoteVideo = document.getElementById('remoteVideo') as HTMLVideoElement;
      remoteVideo.srcObject = event.streams[0];
    };

    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);

    this.socket.emit('join-room', this.roomId); // Join the room
    this.socket.emit('offer', this.roomId, offer);
  }

  async joinCall() {
    if (!this.roomId) {
      alert('Please enter a meeting ID');
      return;
    }

    this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const localVideo = document.getElementById('localVideo') as HTMLVideoElement;
    localVideo.srcObject = this.localStream;

    this.peerConnection = new RTCPeerConnection(this.config);

    this.localStream.getTracks().forEach(track => {
      this.peerConnection?.addTrack(track, this.localStream!);
    });

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('ice-candidate', this.roomId, event.candidate);
      }
    };

    this.peerConnection.ontrack = (event) => {
      const remoteVideo = document.getElementById('remoteVideo') as HTMLVideoElement;
      remoteVideo.srcObject = event.streams[0];
    };

    this.socket.emit('join-room', this.roomId); // Join the room
  }

  private async handleOffer(offer: RTCSessionDescriptionInit) {
    if (!this.peerConnection) {
      await this.joinCall();
    }
    await this.peerConnection!.setRemoteDescription(offer);
    const answer = await this.peerConnection!.createAnswer();
    await this.peerConnection!.setLocalDescription(answer);
    this.socket.emit('answer', this.roomId, answer);
  }

  private async handleAnswer(answer: RTCSessionDescriptionInit) {
    await this.peerConnection!.setRemoteDescription(answer);
  }

  private handleIceCandidate(candidate: RTCIceCandidate) {
    this.peerConnection?.addIceCandidate(new RTCIceCandidate(candidate));
  }
}
