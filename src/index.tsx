import ReactDOM from "react-dom/client";
import "./scss/volt.scss";
import "react-datetime/css/react-datetime.css";
import "react-toastify/dist/ReactToastify.css";
import { HashRouter } from "react-router-dom";
import { store, persistor } from "./store/store";
import { Provider } from "react-redux";
import ScrollToTop from "./components/ScrollToTop";
import reportWebVitals from "./reportWebVitals";
import Router from "./pages/Router";
import { PersistGate } from "redux-persist/integration/react";
import package_json from "../package.json";

import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

// console.log("package_json.resetRedux", package_json.resetRedux);
// Sentry.init({
//   dsn: "https://92d5188348a24f92bb7b85b7d0ff62dd@o4504900846813184.ingest.sentry.io/4504900846878720",
//   integrations: [new BrowserTracing()],
//   tracesSampleRate: 1.0,
// });

if (localStorage.getItem("clearReduxPersist") !== package_json.resetRedux) {
  persistor.purge();
  localStorage.setItem("clearReduxPersist", package_json.resetRedux);
}
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <HashRouter>
        <ScrollToTop />
        <Router />
      </HashRouter>
    </PersistGate>
  </Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
