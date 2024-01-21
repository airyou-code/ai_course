import { useState } from "react";

interface Props {
  items: string[];
  heading: string;
}

function ListGroup(props: Props) {
  const [selectedIndex, setSelectedIndex] = useState(-1)

  return (
    <>
      <h1>{props.heading}</h1>
      <ul className="list-group blur-background">
        {props.items.map((item, index) => (
          <li
            className={
              selectedIndex === index
                ? "list-group-item active"
                : "list-group-item"
            }
            key={index}
            onClick={() => {
              selectedIndex === index
                ? setSelectedIndex(-1)
                : setSelectedIndex(index);
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

export default ListGroup;
