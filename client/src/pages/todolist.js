import axios from 'axios';
import React, { useState, useEffect } from 'react'

const url = 'http://localhost:5000/todolist/tasks';
export default function Todolist() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);

  async function submitBtn() {
    if(task === '') {
      alert("Please enter a task before submitting.");
      return;
    }
    try{
    await axios.post(url, { task });
    fetchTasks();
    }
    catch(err) {
      console.error("Error submitting task:", err);
    }
    setTask("");
  }
  async function fetchTasks() {
    try {
    const res = await axios.get(url,{withCredentials: true});
    if(res.status !== 200){
      throw new Error("Failed to fetch tasks");
    }
    const data = res.data;
    setTasks(data);
    }
    catch(err) {
      console.error("Error fetching tasks:", err);
    }
  }

  useEffect(() => {
    fetchTasks();
  }
  , []);
  return(
    <div className="App" style={{ padding: '20px',textAlign: 'center' }}>
      <h1 className='font-bold text-4xl'>Welcome to To Do List Application</h1>
      <p>This is an todo list application where you can set your daily tasks and when 
      they completed you can mark them as completed</p>
      <p>To get started, please create a new task.</p>
      <div>
        <p><b>Write your task and press the submit button to enter your task.</b></p>
        <input
          type="text"
          value={task}
          onChange={e => setTask(e.target.value)}
          placeholder="Enter your task here"
          style={{ borderRadius:'12px',fontSize:'large',textAlign:'center', height:'30px' }}
        /><br/>
        {!editingTaskId?
        <button
          name='submit'
          onClick={submitBtn}
          style={{ backgroundColor:'black',padding:'10px 30px',color:'white',marginTop:'10px',borderRadius:'20px' }}
        >
          Submit
        </button>
        :
          <button
            onClick={async () => {
              if (task === '') {
                alert("Please enter a task before updating.");
                return;
              }
              try{
                const res = await axios.put(`${url}/${editingTaskId}`, {task});
                setTask('');
                console.log("Task updated:", res.data);
                setEditingTaskId(null);
                fetchTasks();
              }catch(err){
                console.error("Error updating task:", err);
              }
            }}
            style={{ backgroundColor:'orange',padding:'10px 30px',color:'white',marginTop:'10px',borderRadius:'20px', marginLeft: '10px' }}
          >
            Update
          </button>
        }
      </div>
      <div style={{ marginTop: '20px', textAlign: 'left' }}>
        <h2 style={{ textAlign:'center',fontSize:'xx-large',textDecoration:'underline' }}>Tasks</h2>
        <ul>
          {tasks.map((taskItem)=>{
            return(
              <li key={taskItem._id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                {taskItem.task}
                <button style={{ backgroundColor:'red', color:'white', border:'none', borderRadius:'5px', padding:'5px 10px', marginLeft:'10px' }} onClick={async () => {
                  try{
                    await axios.delete(`${url}/${taskItem._id}`);
                    fetchTasks();
                  }catch(err) {
                    console.error("Error deleting task:", err);
                  }
                }}>Mark as completed</button>

                <button style={{ backgroundColor:'green', color:'white', border:'none', borderRadius:'5px', padding:'5px 10px', marginLeft:'10px' }} onClick={() => {
                  setTask(taskItem.task);
                  setEditingTaskId(taskItem._id);
                }}>Edit the Task</button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}