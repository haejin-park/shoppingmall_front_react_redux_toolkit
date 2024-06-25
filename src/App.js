import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AppLayout from "./Layout/AppLayout";
import AppRouter from "./routes/AppRouter";
import "./style/common.style.css";
import ScrollToTop from "./component/ScrollToTop";

function App() {
  return (
    <div>    
      <AppLayout>
        <ScrollToTop />
        <AppRouter/>
      </AppLayout>
    </div>
  );
}

export default App;