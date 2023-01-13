import { Card, Grid } from "@mui/material";
import RightChat from "./components/RightChat";
import SideBarChat from "./components/SideBarChat";

export default function ChatPage() {
  // const { loadingRooms, loadingMessages } = useChat();
  return (
    <Card>
      {/* {loadingRooms && loadingMessages && <MDLoading />} */}
      <Grid container>
        <Grid item xl={3} lg={3} md={3}>
          <SideBarChat />
        </Grid>
        <Grid item xl={9} lg={9} md={9}>
          <RightChat />
        </Grid>
      </Grid>
    </Card>
  );
}
