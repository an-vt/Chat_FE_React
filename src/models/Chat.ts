import { MessageType, RoomType } from "../common/constants";

export interface Room {
  _id: string;
  type: RoomType;
  unreadCount: number;
  name: string;
  lastUpdatedTimestamp: string;
}

export interface Message {
  _id: string;
  content: string;
  senderUid: string;
  senderName: string;
  type: MessageType;
  roomId: string;
  receivers: string[];
  sendingTimestamp: string;
}
