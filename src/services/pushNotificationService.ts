import { RealtimePushNotification, RoleType, NavView } from '../types';

type NotificationListener = (notification: RealtimePushNotification) => void;
type ConnectionStatusListener = (status: 'connected' | 'connecting' | 'disconnected' | 'error') => void;

class PushNotificationService {
  private socket: WebSocket | null = null;
  private reconnectTimeout: any = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 15;
  private listeners: Set<NotificationListener> = new Set();
  private statusListeners: Set<ConnectionStatusListener> = new Set();
  private connectionStatus: 'connected' | 'connecting' | 'disconnected' | 'error' = 'disconnected';
  private audioCtx: AudioContext | null = null;
  private soundEnabled = true;
  private currentUserId = '';
  private currentUserRole: RoleType = 'supervisor';
  private currentCompanyId = '';

  constructor() {
    // Lazy AudioContext initialization on first user interaction
    if (typeof window !== 'undefined') {
      const unlockAudio = () => {
        if (!this.audioCtx) {
          try {
            const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioCtxClass) {
              this.audioCtx = new AudioCtxClass();
            }
          } catch (err) {
            console.warn('[PushService] AudioContext not supported:', err);
          }
        } else if (this.audioCtx.state === 'suspended') {
          this.audioCtx.resume().catch(() => {});
        }
      };

      window.addEventListener('click', unlockAudio, { once: true, passive: true });
      window.addEventListener('keydown', unlockAudio, { once: true, passive: true });
    }
  }

  // -------------------------------------------------------------
  // Web Audio Alert Synthesizer
  // -------------------------------------------------------------
  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public playAlertSound(type: 'urgent_alarm' | 'warning_beep' | 'standard_chime' = 'urgent_alarm') {
    if (!this.soundEnabled || typeof window === 'undefined') return;

    try {
      if (!this.audioCtx) {
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtxClass) {
          this.audioCtx = new AudioCtxClass();
        }
      }

      if (!this.audioCtx) return;

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }

      const now = this.audioCtx.currentTime;

      if (type === 'urgent_alarm') {
        // High-risk critical alert (two rapid high-frequency emergency tones)
        const osc1 = this.audioCtx.createOscillator();
        const osc2 = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(880, now); // A5
        osc1.frequency.setValueAtTime(1174, now + 0.15); // D6
        osc1.frequency.setValueAtTime(880, now + 0.3);
        osc1.frequency.setValueAtTime(1396, now + 0.45); // F6

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(440, now);
        osc2.frequency.setValueAtTime(587, now + 0.15);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.exponentialRampToValueAtTime(0.25, now + 0.05);
        gain.gain.setValueAtTime(0.2, now + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.75);
        osc2.stop(now + 0.75);
      } else if (type === 'warning_beep') {
        // Driver license expiration warning (gentle two-tone chime)
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, now); // E5
        osc.frequency.setValueAtTime(880, now + 0.2); // A5

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.6);
      } else {
        // Standard notification chime
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.15); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.3); // G5

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.55);
      }
    } catch (err) {
      console.warn('[PushService] Could not play synthesized alert sound:', err);
    }
  }

  // -------------------------------------------------------------
  // Web Notification API (Browser Native Push)
  // -------------------------------------------------------------
  public isWebNotificationSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  public getPermissionStatus(): NotificationPermission {
    if (!this.isWebNotificationSupported()) return 'denied';
    return Notification.permission;
  }

  public async requestPermission(): Promise<NotificationPermission> {
    if (!this.isWebNotificationSupported()) return 'denied';
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (err) {
      console.warn('[PushService] Error requesting notification permission:', err);
      return Notification.permission;
    }
  }

  public showBrowserPushNotification(
    notification: RealtimePushNotification,
    onClick?: () => void
  ) {
    if (!this.isWebNotificationSupported() || Notification.permission !== 'granted') {
      return;
    }

    try {
      const isCritical = notification.severity === 'critica';
      const browserNotification = new Notification(notification.title, {
        body: notification.body,
        icon: '/favicon.ico',
        tag: notification.id,
        requireInteraction: isCritical,
        silent: !this.soundEnabled
      });

      browserNotification.onclick = () => {
        window.focus();
        if (onClick) onClick();
        browserNotification.close();
      };
    } catch (err) {
      console.warn('[PushService] Error creating native browser notification:', err);
    }
  }

  // -------------------------------------------------------------
  // WebSocket Connection & Real-Time Sync
  // -------------------------------------------------------------
  public connect(user: { id: string; role: RoleType; companyId: string }) {
    if (typeof window === 'undefined') return;

    this.currentUserId = user.id;
    this.currentUserRole = user.role;
    this.currentCompanyId = user.companyId;

    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      // Re-send registration if user changed
      this.sendRegistration();
      return;
    }

    this.updateStatus('connecting');

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/notifications`;

      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        this.reconnectAttempts = 0;
        this.updateStatus('connected');
        this.sendRegistration();
        console.log('[PushService] WebSocket connected to real-time notification engine.');
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleIncomingMessage(data);
        } catch (err) {
          console.warn('[PushService] Error parsing incoming WS message:', err);
        }
      };

      this.socket.onclose = () => {
        this.updateStatus('disconnected');
        this.scheduleReconnect();
      };

      this.socket.onerror = (err) => {
        console.warn('[PushService] WebSocket connection error:', err);
        this.updateStatus('error');
      };
    } catch (err) {
      console.warn('[PushService] Failed to establish WebSocket connection:', err);
      this.updateStatus('error');
      this.scheduleReconnect();
    }
  }

  private sendRegistration() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          type: 'REGISTER',
          payload: {
            userId: this.currentUserId,
            role: this.currentUserRole,
            companyId: this.currentCompanyId
          }
        })
      );
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.warn('[PushService] Max reconnect attempts reached. Keeping fallback state.');
      return;
    }

    const delay = Math.min(1000 * Math.pow(1.5, this.reconnectAttempts), 15000);
    this.reconnectAttempts++;

    this.reconnectTimeout = setTimeout(() => {
      if (this.currentUserId) {
        this.connect({
          id: this.currentUserId,
          role: this.currentUserRole,
          companyId: this.currentCompanyId
        });
      }
    }, delay);
  }

  private handleIncomingMessage(data: any) {
    if (!data || !data.type) return;

    if (data.type === 'PUSH_NOTIFICATION') {
      const notification: RealtimePushNotification = data.payload;
      if (!notification) return;

      // Play audio chime
      if (notification.audioChime) {
        this.playAlertSound(notification.audioChime);
      } else if (notification.severity === 'critica') {
        this.playAlertSound('urgent_alarm');
      } else {
        this.playAlertSound('warning_beep');
      }

      // Show native browser push notification
      this.showBrowserPushNotification(notification);

      // Notify registered React component listeners
      this.listeners.forEach((listener) => {
        try {
          listener(notification);
        } catch (err) {
          console.error('[PushService] Error in listener callback:', err);
        }
      });
    }
  }

  private updateStatus(status: 'connected' | 'connecting' | 'disconnected' | 'error') {
    this.connectionStatus = status;
    this.statusListeners.forEach((l) => l(status));
  }

  public getConnectionStatus() {
    return this.connectionStatus;
  }

  public subscribe(listener: NotificationListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public subscribeStatus(listener: ConnectionStatusListener): () => void {
    this.statusListeners.add(listener);
    listener(this.connectionStatus);
    return () => {
      this.statusListeners.delete(listener);
    };
  }

  // -------------------------------------------------------------
  // REST API Methods for Notifications
  // -------------------------------------------------------------
  public async fetchNotifications(): Promise<RealtimePushNotification[]> {
    try {
      const res = await fetch('/api/notifications/realtime');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.notifications || [];
    } catch (err) {
      console.warn('[PushService] Failed to fetch notifications from API:', err);
      return [];
    }
  }

  public async broadcastNotification(
    notification: Omit<RealtimePushNotification, 'id' | 'timestamp' | 'isRead' | 'isAcknowledged'>
  ): Promise<RealtimePushNotification | null> {
    try {
      const res = await fetch('/api/notifications/realtime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notification)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.notification || null;
    } catch (err) {
      console.warn('[PushService] Error broadcasting notification to API:', err);
      return null;
    }
  }

  public async acknowledgeNotification(id: string, supervisorName: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/notifications/realtime/${id}/acknowledge`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acknowledgedBy: supervisorName })
      });
      return res.ok;
    } catch (err) {
      console.warn('[PushService] Error acknowledging notification:', err);
      return false;
    }
  }

  public async checkLicenseExpirations(drivers: any[]): Promise<RealtimePushNotification[]> {
    try {
      const res = await fetch('/api/notifications/check-expirations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drivers })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.generatedAlerts || [];
    } catch (err) {
      console.warn('[PushService] Error running license expiration check:', err);
      return [];
    }
  }
}

export const pushNotificationService = new PushNotificationService();
