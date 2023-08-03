import { ToDoType } from "./utils/interfaces";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import moment from "moment";
import { useState } from "react";

interface ListProps {
  listData: ToDoType[];
  handleCompleted: (element: ToDoType) => void;
  handleChangeDelete: (element: ToDoType) => void;
  handleChangeExisting: (key: string, value: string, element: ToDoType) => void;
}

export default function List({
  listData,
  handleCompleted,
  handleChangeDelete,
  handleChangeExisting,
}: ListProps): JSX.Element {
  const handleChangeCompleted = (element: ToDoType) => {
    handleCompleted(element);
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editedKeyValue, setEditedKeyValue] = useState({});

  //   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //     if (e.key === "Enter") {
  //       handleChangeExisting(editedKeyValue);
  //     }
  //   };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    element: ToDoType
  ) => {
    const key = e.target.name;
    const value = e.target.value;
    handleChangeExisting(key, value, element);
    // setEditedKeyValue({[key]:value})
  };

  const [animationParent] = useAutoAnimate();

  return (
    <>
      <div className="list-table">
        <table>
          <tr>
            <th>Description</th>
            <th>Due Date</th>
            <th>Creation Date</th>
            <th>Done?</th>
            <th>Delete?</th>
          </tr>

          {listData.map((element, index) => (
            <tr key={element.id} ref={animationParent}>
              <td>
                {isEditing ? (
                  <input
                    name="title"
                    value={element.title}
                    // onKeyDown={(e) => handleKeyDown(e)}
                    onChange={(e) => handleInputChange(e, element)}
                  ></input>
                ) : (
                  <div onClick={() => setIsEditing(true)}>{element.title}</div>
                )}
              </td>
              <td>{moment(element.dueDate).format("DD/MM/YYYY")}</td>
              <td>{moment(element.creationDate).format("DD/MM/YYYY")}</td>
              <td>
                <>
                  {element.completed === true ? (
                    <select onChange={() => handleChangeCompleted(element)}>
                      <option>Done</option>
                      <option value="In Progress" defaultValue="In Progress">
                        In Progress
                      </option>
                    </select>
                  ) : (
                    <select onChange={() => handleChangeCompleted(element)}>
                      <option>In Progress</option>
                      <option value="Done" defaultValue="Done">
                        Done
                      </option>
                    </select>
                  )}
                </>
              </td>
              <td>
                <button onClick={() => handleChangeDelete(element)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </table>
      </div>
    </>
  );
}
