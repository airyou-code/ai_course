import ListGroup from "../components/ListGroup";
import Header from "../components/layout/Header";
import CardGroup from "../components/CardGroup";

function MainPage() {
  const items = ["1 Item", "2 Item", "3 Item", "5 Item", "4 Item"];
  return (
    <>
      <Header />
      <div className="container">
        <CardGroup />
        {/* <ListGroup items={items} heading="List" /> */}
      </div>
    </>
  );
}

export default MainPage;
