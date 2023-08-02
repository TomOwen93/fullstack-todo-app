import { ToDoType } from "./utils/interfaces";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import moment from "moment";

interface ListProps {
  listData: ToDoType[];
  handleCompleted: (element: ToDoType) => void;
  handleChangeDelete: (element: ToDoType) => void;
}

export default function List({
  listData,
  handleCompleted,
  handleChangeDelete,
}: ListProps): JSX.Element {
  const handleChangeCompleted = (element: ToDoType) => {
    handleCompleted(element);
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

          {listData.map((element) => (
            <tr key={element.id} ref={animationParent}>
              <td>{element.title}</td>
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
