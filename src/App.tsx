// TODO:
// 1. [x] Let App to handle the adding of a task instead of TodoInputForm
// 2. [x] Use Immutable array to update the change of task's state
// 3. [x] Create a Todo component instead of using the App component
// 4. [x] Use reducer and dispatch to optimize the state controlling
// 5. [x] Create a customized hook to handle data fetching
// 6. [x] Auto focus to the input component
// 7. [x] Support removing one todo item
// 8. [x] Blank todo is not allowed
// 9. [x] Support modification on one todo item
// 10. [x] Support drag and drop on one todo item to re-arrage the priority
// 11. [x] Show some statistical info
// 12. [ ] Support undo / redo
// 13. [x] Files splitted
// 14. [ ] Change dragging event to mouse down/up
// 14. [ ] React test framework

import { useReducer } from 'react';
import { TodoTask, Action } from './types';
import { TodoInputForm, TodoTaskList, TodoStats } from './components/Todo';
import { useLocalStorage } from './hooks/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

const reducer = (tasks: TodoTask[], action: Action): TodoTask[] => {
  console.log('Action received: ', action.type);
  let newTasks: TodoTask[] = [];

  switch (action.type) {
    case 'TASK_ADD': {
      const task: TodoTask = {
        id: uuidv4(),
        name: action.payload.name,
        completed: false,
      };
      newTasks = [...tasks, task];
      break;
    }
    case 'TASK_MODIFY': {
      newTasks = tasks.map((t) =>
        action.payload.taskId === t.id ? { ...t, name: action.payload.name } : t
      );
      break;
    }
    case 'TASK_TOGGLE': {
      newTasks = tasks.map((t) =>
        action.payload.taskId === t.id
          ? { ...t, completed: action.payload.checked }
          : t
      );
      break;
    }
    case 'TASK_DELETE': {
      newTasks = tasks.filter((t) => action.payload.taskId !== t.id);
      break;
    }
    case 'TASK_REORDER': {
      newTasks = action.payload.newTasks;
      break;
    }
    case 'TASK_SAVE': {
      newTasks = tasks;
      action.payload.saveHandler(newTasks);
      break;
    }
  }

  console.log('Task list: ', newTasks);
  return newTasks;
};

const App = () => {
  const MY_TODO_LIST_KEY = 'MyTodoListKey';
  const [storedTasks, setStoredTasks] = useLocalStorage<TodoTask[]>(
    MY_TODO_LIST_KEY,
    []
  );
  const [tasks, dispatch] = useReducer(reducer, storedTasks);

  return (
    <div className="container">
      <h1>ToDo List</h1>
      <TodoStats tasks={tasks}></TodoStats>
      <TodoInputForm
        taskAddHandler={(value) => {
          if (value.trim()) {
            dispatch({
              type: 'TASK_ADD',
              payload: { name: value },
            });

            dispatch({
              type: 'TASK_SAVE',
              payload: { saveHandler: setStoredTasks },
            });
          }
        }}
      />
      <TodoTaskList
        taskList={tasks}
        toggleTaskHandler={(taskId, checked) => {
          dispatch({
            type: 'TASK_TOGGLE',
            payload: {
              taskId: taskId,
              checked: checked,
            },
          });
          dispatch({
            type: 'TASK_SAVE',
            payload: { saveHandler: setStoredTasks },
          });
        }}
        modifyTaskHandler={(taskId, name) => {
          dispatch({
            type: 'TASK_MODIFY',
            payload: {
              taskId: taskId,
              name: name,
            },
          });
          dispatch({
            type: 'TASK_SAVE',
            payload: { saveHandler: setStoredTasks },
          });
        }}
        deleteTaskHandler={(taskId) => {
          dispatch({
            type: 'TASK_DELETE',
            payload: {
              taskId: taskId,
            },
          });
          dispatch({
            type: 'TASK_SAVE',
            payload: { saveHandler: setStoredTasks },
          });
        }}
        reorderTaskHandler={(taskList) => {
          dispatch({
            type: 'TASK_REORDER',
            payload: {
              newTasks: taskList,
            },
          });
        }}
        reorderTaskCompleteHandler={() => {
          dispatch({
            type: 'TASK_SAVE',
            payload: { saveHandler: setStoredTasks },
          });
        }}
      />
    </div>
  );
};

export default App;
