import { Box, Container } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./App.css";
import { useAuth } from "./context/AuthProvider";
import Login from "./layouts/login";

function App() {
  const { tokenAuthenticated } = useAuth();
  console.log(
    "🚀 ~ file: App.tsx:9 ~ App ~ tokenAuthenticated",
    tokenAuthenticated,
  );
  const theme = createTheme();
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="lg">
        {tokenAuthenticated ? <Box>login</Box> : <Login />}
      </Container>
    </ThemeProvider>
  );
}

export default App;
