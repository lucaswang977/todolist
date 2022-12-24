import { TodoTask, InputFormProps, TaskListProps } from '../types';
import { reorderArray } from '../utilities';
import React, { useState, useRef, useEffect } from 'react';

export const TodoInputForm = (props: InputFormProps) => {
  const [inputState, setInputState] = useState({ value: '' });
  const inputElement = useRef<HTMLInputElement>(null);

  const handleTaskAdd = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    props.taskAddHandler(inputState.value);
    setInputState({ value: '' });

    if (inputElement.current) inputElement.current.focus();
  };

  return (
    <form onSubmit={handleTaskAdd}>
      <input
        ref={inputElement}
        type="text"
        value={inputState.value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setInputState({ value: e.target.value })
        }
      ></input>
      <button type="submit">Add</button>
    </form>
  );
};

export const TodoTaskList = (props: TaskListProps) => {
  const [dragItem, setDragItem] = useState<TodoTask | null>();
  const [modifyItem, setModifyItem] = useState<TodoTask | null>();
  const [inputValue, setInputValue] = useState('');
  const inputElement = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (modifyItem) {
      if (inputElement.current) {
        inputElement.current.focus();
      }
    }
  }, [modifyItem]);

  const handleDragEnter = (
    e: React.DragEvent<HTMLLIElement>,
    enterTask: TodoTask
  ) => {
    if (dragItem !== enterTask) {
      const fromIndex = props.taskList.findIndex((item) => item === dragItem);
      const toIndex = props.taskList.findIndex((item) => item === enterTask);

      const newTasks = reorderArray<TodoTask>(
        props.taskList,
        fromIndex,
        toIndex
      );
      props.reorderTaskHandler(newTasks);
    }
  };

  const enterModifyMode = (task: TodoTask) => {
    setModifyItem(task);
    setInputValue(task!.name);
  };

  const exitModifyMode = () => {
    if (modifyItem && inputValue !== modifyItem.name) {
      props.modifyTaskHandler(modifyItem.id, inputValue);
    }
    setModifyItem(null);
  };

  const showLabelOrInput = (task: TodoTask) => {
    if (modifyItem === task) {
      return (
        <input
          type="text"
          ref={inputElement}
          value={inputValue}
          style={{ zIndex: 2 }}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') exitModifyMode();
          }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInputValue(e.target.value)
          }
        ></input>
      );
    } else {
      return (
        <label
          onClick={(e) => {
            if (e.detail == 2) enterModifyMode(task);
          }}
        >
          {task.name}
        </label>
      );
    }
  };

  const getClassName = (task: TodoTask) => {
    let classArr = [];

    if (modifyItem) classArr.push('visually-disabled');
    classArr.push(task === dragItem ? 'dragging' : 'not-dragging');

    return classArr.join(' ');
  };

  return (
    <div className="task-list">
      <div
        onClick={() => exitModifyMode()}
        className={modifyItem ? 'input-mask' : 'input-mask visually-hidden'}
      ></div>
      <ul>
        {props.taskList.map((task) => {
          return (
            <li
              draggable={modifyItem ? 'false' : 'true'}
              key={task.id}
              className={getClassName(task)}
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = 'move';
                setDragItem(task);
              }}
              onDragEnd={() => {
                setDragItem(null);
                props.reorderTaskCompleteHandler();
              }}
              onDragEnter={(e: React.DragEvent<HTMLLIElement>) =>
                handleDragEnter(e, task)
              }
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={(e) =>
                  props.toggleTaskHandler(task.id, e.target.checked)
                }
              />
              {showLabelOrInput(task)}
              <button onClick={(e) => props.deleteTaskHandler(task.id)}>
                -
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const TodoStats = (props: { tasks: TodoTask[] }) => {
  const totalTodoTasks = props.tasks.length;
  const completedTodoTasks = props.tasks.filter(
    (item) => item.completed === true
  ).length;

  return (
    <p>
      {completedTodoTasks}/{totalTodoTasks}
    </p>
  );
};
