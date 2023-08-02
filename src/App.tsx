import { ToDoType } from "./utils/interfaces";

import "./styles.css";
import { useEffect, useState } from "react";
import axios from "axios";

function App(): JSX.Element {
  const [renderedToDos, setRenderedToDos] = useState<ToDoType[]>([
    {
      id: 1,
      title: "Do the Dishes",
      completed: false,
      creationDate: "15-04-2023",
      dueDate: "05/08/2023",
    },
  ]);

  const [toSubmit, setToSubmit] = useState<ToDoType>({
    id: renderedToDos.length + 1,
    title: "",
    creationDate: new Date().toDateString(),
    completed: false,
    dueDate: "",
  });
  const baseUrl = "http://localhost:4000";

  //FETCH from either render.com or my localhost:port -- AXIOS
  const fetchToDos = async () => {
    const response = await axios.get(`${baseUrl}/to-dos`);
    console.log(response.data);
    setRenderedToDos(response.data);
  };

  //FETCH ON LOAD
  useEffect(() => {
    fetchToDos();
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(event);

    axios.post(`${baseUrl}/to-dos`, toSubmit);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const key = event.target.name;
    const value = event.target.value;
    setToSubmit((prev) => ({ ...prev, [key]: value }));
    console.log(toSubmit);
  };

  const inProgressList = renderedToDos.filter(
    (todo) => todo.completed === false
  );
  const doneList = renderedToDos.filter((todo) => todo.completed === true);

  return (
    <>
      <div className="header"></div>
      <h1>To-do List</h1>
      <hr></hr>

      <div className="to-do-sections">
        <div className="in-progress-section">
          <h2>In Progress:</h2>
          <ul>
            {inProgressList.map((element) => (
              <>
                <li key={element.id}>
                  {element.title} - {element.dueDate}
                </li>
                <select>
                  <option>Done</option>
                  <option>In Progress</option>
                </select>
              </>
            ))}
          </ul>
        </div>

        <div className="done-section">
          <h2>Done:</h2>
          <ul>
            {doneList.map((element) => (
              <li key={element.id}>{element.title}</li>
            ))}
          </ul>
        </div>
      </div>

      <hr></hr>
      <h3>Add To-Do</h3>
      <div>
        <form className="form" onSubmit={handleSubmit}>
          <label>Description:</label>
          <input
            name="title"
            onChange={handleChange}
            value={toSubmit.title || ""}
          ></input>

          <label>Due Date:</label>

          <input
            name="dueDate"
            type="date"
            placeholder="dd-mm-yyyy"
            min={"2023-08-02"}
            max="2030-12-31"
            onChange={handleChange}
            value={toSubmit.dueDate || ""}
          ></input>

          <button>Submit</button>
        </form>
      </div>
    </>
  );
}

export default App;

/*Possible features
    Adding and editing todos
    Marking todos as 'complete'
    Deleting todos
    Sorting todos by creation date
    Setting a due date
    Filtering overdue todos*/
