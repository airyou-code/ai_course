import Message from "./Message"
import ListGroup from "./components/ListGroup";

function App() {
  const items = ["1 Item", "2 Item", "3 Item", "5 Item", "4 Item"];
  return (
    <div className="p-3 m-0 border-0 bd-example">
      <ListGroup items={items} heading="List"/>
    </div>
  );
}

export default App;