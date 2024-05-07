import noteApp from "./noteApp.svg";
import "./App.css";
import { useState, useEffect } from "react";

const port = 1234;
const ws = new WebSocket(`ws://localhost:${port}`);

let itemList = []; // Initialize an empty list to store items

function Container() {
  const [inputValue, setInputValue] = useState("");
  const [itemList, setItemList] = useState([]);

  useEffect(() => {
    ws.onmessage = (event) => {
      const updatedItemList = JSON.parse(event.data);
      setItemList(updatedItemList);
    };
  }, []);

  const handleAdd = () => {
    console.log("Add");
    const message = inputValue;
    ws.send(message);
    setInputValue("");
  };
  return (
    <div className="container">
      <div className="container-header">
        <img src={noteApp} alt="logo" className="container-logo" />
      </div>
      <div className="container-noteapp">
        <b>Note App</b>
      </div>
      <div>
        <input
          className="container-placeholder"
          style={{ display: "inline-block", border: "1px solid #ccc" }}
          placeholder="New note.."
          value={inputValue} // Bind input value to state
          onChange={(e) => setInputValue(e.target.value)}
        ></input>
        <button
          className="container-Add"
          onClick={handleAdd}
          style={{ marginLeft: "10px" }}
        >
          + Add
        </button>
      </div>
      <label className="container-Notes">
        <b>Notes</b>
      </label>
      <div className="container-list-wrapper">
        <div className="container-list">
          {itemList.map((item, index) => (
            <div key={index}>
              <label>{item}</label>
              <hr></hr>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Container;
