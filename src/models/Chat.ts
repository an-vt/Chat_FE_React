export interface Attendee {
  attendeeUid: string;
  type: "school" | "parent";
  tokens: string;
  rooms: AttendeeRoom[];
}

export interface AttendeeRoom {
  roomId: string;
  partner_name: string;
  partner_uid: string;
  unread_count: number;
  last_updated_timestamp: {
    nanoseconds: number;
    seconds: number;
  };
}

export interface Room {
  roomId: string;
  attendees: string[];
  created_timestamp: {
    nanoseconds: number;
    seconds: number;
  };
}

export interface RoomMessage {
  messageId?: string;
  sender_uid: string;
  sender_name: string;
  sender_type: "school" | "parent";
  receiver_uid: string;
  receiver_name: string;
  receiver_type: "school" | "parent";
  type: "text" | "image" | "video" | "announcement";
  content: string;
  sending_timestamp: {
    nanoseconds: number;
    seconds: number;
  };
}

export interface ChatParent {
  id: number;
  number: string;
  uid: string;
  firstName: string;
  kanaFirstName: string;
  lastName: string;
  kanaLastName: string;
}
