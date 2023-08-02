import { ToDoType } from "./utils/interfaces";
import Form from "./Form";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import "./styles.css";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import List from "./List";

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

  const [animationParent] = useAutoAnimate();

  const [toSubmit, setToSubmit] = useState<ToDoType>({
    title: "",
    creationDate: new Date().toDateString(),
    completed: false,
    dueDate: "",
  });
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:4000"
      : "https://tom-todo-app-y14l.onrender.com";

  //FETCH from either render.com or my localhost:port -- AXIOS
  const fetchToDos = async () => {
    const response = await axios.get(`${baseUrl}/to-dos`);
    // console.log(response.data);
    setRenderedToDos(response.data);
  };

  //FETCH ON LOAD
  useEffect(() => {
    fetchToDos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(event);
    await axios.post(`${baseUrl}/to-dos`, toSubmit);
    fetchToDos();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const key = event.target.name;
    const value = event.target.value;
    setToSubmit((prev) => ({ ...prev, [key]: value }));
  };

  const handleCompleted = async (element: ToDoType) => {
    console.log(element.completed);
    if (element.completed === true) {
      await axios.patch(`${baseUrl}/to-dos/${element.id}`, {
        completed: false,
      });
    } else {
      await axios.patch(`${baseUrl}/to-dos/${element.id}`, {
        completed: true,
      });
    }

    console.log(toSubmit);
    fetchToDos();
  };

  const inProgressList = renderedToDos
    .filter((todo) => todo.completed === false)
    .sort(
      (todo1, todo2) =>
        parseInt(todo1.creationDate) - parseInt(todo2.creationDate)
    );
  const doneList = renderedToDos
    .filter((todo) => todo.completed === true)
    .sort(
      (todo1, todo2) =>
        parseInt(todo1.creationDate) - parseInt(todo2.creationDate)
    );

  const todayDate = moment(new Date()).format("YYYY-MM-DD");

  const handleOverdueFilter = (filterValue: string) => {
    if (filterValue === "All") {
      fetchToDos();
    } else {
      setRenderedToDos((prev) =>
        prev.filter(
          (todo) => moment(todo.dueDate).format("YYYY-MM-DD") < todayDate
        )
      );
      console.log(
        renderedToDos.map((todo) => moment(todo.dueDate).format("YYYY-MM-DD")),
        todayDate,
        renderedToDos.map(
          (todo) => moment(todo.dueDate).format("YYYY-MM-DD") < todayDate
        )
      );
    }
  };

  return (
    <>
      <div className="header"></div>
      <h1>To-do List</h1>
      <hr></hr>

      <div className="filter">
        <select onChange={(event) => handleOverdueFilter(event.target.value)}>
          <option value={"All"}>All</option>
          <option value={"Overdue"}>Overdue</option>
        </select>
      </div>

      <div className="to-do-sections">
        <div className="in-progress-section" ref={animationParent}>
          <h2>In Progress:</h2>
          <List listData={inProgressList} handleCompleted={handleCompleted} />
        </div>

        <div className="done-section" ref={animationParent}>
          <h2>Done:</h2>
          <List listData={doneList} handleCompleted={handleCompleted} />
        </div>
      </div>
      <hr />

      <div className="submission">
        <h3>Add To-Do</h3>
        <Form
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          toSubmit={toSubmit}
        />
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
