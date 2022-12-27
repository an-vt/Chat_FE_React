import ChatProvider from 'context/chat';
import ChatPage from './ChatPage';

export default function ChatLayout() {
  return (
    <ChatProvider>
      <ChatPage />
    </ChatProvider>
  );
}
