import './App.css'
import ReactScheduler from "./scheduler/ReactScheduler.jsx";
import BasicReactScheduler from "./examples/BasicReactScheduler.jsx";

function App() {

  return (
    <>
      {new URLSearchParams(window.location.search).get('example') === 'basic'
        ? <BasicReactScheduler />
        : <ReactScheduler />}
    </>
  )
}

export default App
