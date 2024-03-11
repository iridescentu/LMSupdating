import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../AuthContext";
import {
  apiDeleteMyTodoList,
  apiGetMyTodoList,
  apiPostMyTodoList,
  apiPutMyTodoList,
} from "../../RestApi";
import styled from "styled-components";

const Container = styled.div``;

const TodoTitle = styled.p`
  font-size: 50px;
  font-weight: bold;
  padding: 5px 0;
`;

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const AddBtn = styled.button`
  background-color: white;
  color: #3182f6;
  padding: 5px 10px;
  margin: 8px 0;
  border: 2px solid #3182f6;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background-color: #3182f6;
    color: white;
  }
`;

const DelBtn = styled.button`
  background-color: white;
  color: #3182f6;
  padding: 3px 5px;
  margin: 8px 8px;
  border: 2px solid #3182f6;
  cursor: pointer;
  border-radius: 15px;
  font-size: 10px;

  &:hover {
    background-color: #3182f6;
    color: white;
  }
`;

const TodoItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  padding: 5px 5px;
`;

export function TodoList() {
  const { user } = useContext(AuthContext);
  const [todos, setTodos] = useState([]);
  const [newTodoContent, setNewTodoContent] = useState("");
  const memberId = user.memberId;

  useEffect(() => {
    apiGetMyTodoList(memberId)
      .then((response) => {
        setTodos(response.data.data);
      })
      .catch((error) => {
        console.error("TodoList 조회 실패: ", error);
      });
  }, [memberId]);

  const saveTodo = () => {
    const todoData = {
      member: {
        memberId: memberId,
      },
      taskName: newTodoContent,
    };

    apiPostMyTodoList(todoData)
      .then((response) => {
        apiGetMyTodoList(memberId)
          .then((response) => {
            setTodos(response.data.data);
          })
          .catch((error) => {
            console.error("TodoList 조회 실패: ", error);
          });
        setNewTodoContent(""); // input field 초기화
      })
      .catch((error) => {
        console.error("TodoList 저장 실패: ", error);
      });
  };

  const updateTodo = (taskId, updatedContent) => {
    const updatedTodoData = {
      member: {
        memberId: memberId,
      },
      taskName: updatedContent,
    };

    apiPutMyTodoList(taskId, updatedTodoData)
      .then((response) => {
        setTodos(
          todos.map((todo) =>
            todo.taskId === taskId ? response.data.data : todo
          )
        );
      })
      .catch((error) => {
        console.error("TodoList 수정 실패: ", error);
      });
  };

  const deleteTodo = (taskId) => {
    apiDeleteMyTodoList(taskId)
      .then(() => {
        setTodos(todos.filter((todo) => todo.taskId !== taskId));
      })
      .catch((error) => {
        console.error("TodoList 삭제 실패: ", error);
      });
  };

  return (
    <Container>
      <TodoTitle>Surfer's Todo-List</TodoTitle>
      <FormContainer>
        <input
          type="text"
          value={newTodoContent}
          onChange={(e) => setNewTodoContent(e.target.value)}
        />
        <AddBtn onClick={saveTodo}>Add Todo</AddBtn>
      </FormContainer>
      <ul>
        {todos.map((todo) =>
          todo ? (
            <TodoItem key={todo.taskId}>
              {" "}
              <span>• {todo.taskName}</span>
              <DelBtn onClick={() => deleteTodo(todo.taskId)}>✕</DelBtn>
            </TodoItem>
          ) : null
        )}
      </ul>
    </Container>
  );
}
