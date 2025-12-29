
export interface WishData {
  name: string;
  message: string;
}

export enum AppStep {
  CREATE = 'CREATE',
  SHARE_LINK = 'SHARE_LINK',
  // Sequence for the recipient
  LIGHTS_OFF = 'LIGHTS_OFF',
  DECORATE = 'DECORATE',
  COUNTDOWN = 'COUNTDOWN',
  CELEBRATION = 'CELEBRATION'
}
