import { ToDoType, ToDoTypeNoId } from "./utils/interfaces";
import Form from "./Form";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import "./styles.css";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import List from "./List";
import { baseUrl } from "./utils/api";

function App(): JSX.Element {
  const [renderedToDos, setRenderedToDos] = useState<ToDoType[]>([]);
  const [toSubmit, setToSubmit] = useState<ToDoTypeNoId>({
    title: "",
    creationdate: new Date().toDateString(),
    completed: false,
    duedate: "",
  });
  const [animationParent] = useAutoAnimate();

  const fetchToDos = async () => {
    console.log("Fetched!");
    const { data } = await axios.get(`${baseUrl}/to-dos`);
    setRenderedToDos(data.data);
  };

  useEffect(() => {
    fetchToDos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await axios.post(`${baseUrl}/to-dos`, toSubmit);
    fetchToDos();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const key = event.target.name;
    const value = event.target.value;
    setToSubmit((prev) => ({ ...prev, [key]: value }));
  };

  const handleCompleted = async (element: ToDoType) => {
    if (element.completed === true) {
      await axios.patch(`${baseUrl}/to-dos/${element.id}`, {
        completed: false,
      });
    } else {
      await axios.patch(`${baseUrl}/to-dos/${element.id}`, {
        completed: true,
      });
    }

    fetchToDos();
  };

  const inProgressList = renderedToDos
    .filter((todo) => todo.completed === false)
    .sort(
      (todo1, todo2) =>
        parseInt(todo1.creationdate) - parseInt(todo2.creationdate)
    );
  const doneList = renderedToDos
    .filter((todo) => todo.completed === true)
    .sort(
      (todo1, todo2) =>
        parseInt(todo1.creationdate) - parseInt(todo2.creationdate)
    );

  const todayDate = moment(new Date()).format("YYYY-MM-DD");

  const handleOverdueFilter = (filterValue: string) => {
    if (filterValue === "All") {
      fetchToDos();
    } else {
      setRenderedToDos((prev) =>
        prev.filter(
          (todo) => moment(todo.duedate).format("YYYY-MM-DD") < todayDate
        )
      );
    }
  };

  const handleChangeDelete = async (element: ToDoType) => {
    axios.delete(`${baseUrl}/to-dos/${element.id}`);
    fetchToDos();
  };

  const replaceTitleSpecificToDo = (
    prev: ToDoType[],
    id: number,
    value: string
  ): ToDoType[] => {
    const replacementToDosArray = prev.map((todo) =>
      todo.id === id ? { ...todo, title: value } : todo
    );

    return replacementToDosArray;
  };

  const handleChangeExisting = async (
    key: string,
    value: string,
    element: ToDoType
  ) => {
    setRenderedToDos((prev) =>
      replaceTitleSpecificToDo(prev, element.id, value)
    );

    // await axios.patch(`${baseUrl}/to-dos/${element.id}`, { [key]: value });
    // fetchToDos();
  };

  return (
    <>
      <div className="header">
        <h1>To-do List</h1>
        <hr></hr>
        <h3>Filter To-dos:</h3>
      </div>
      <div className="filter" ref={animationParent}>
        <select onChange={(event) => handleOverdueFilter(event.target.value)}>
          <option value={"All"}>All</option>
          <option value={"Overdue"}>Overdue</option>
        </select>
      </div>

      <div className="to-do-sections">
        <div className="in-progress-section">
          <h2>In Progress:</h2>
          <List
            listData={inProgressList}
            handleCompleted={handleCompleted}
            handleChangeDelete={handleChangeDelete}
            handleChangeExisting={handleChangeExisting}
          />
        </div>

        <div className="done-section">
          <h2>Done:</h2>
          <List
            listData={doneList}
            handleCompleted={handleCompleted}
            handleChangeDelete={handleChangeDelete}
            handleChangeExisting={handleChangeExisting}
          />
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
