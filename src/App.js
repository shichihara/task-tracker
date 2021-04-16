import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Tasks from './components/Tasks';
import AddTask from './components/AddTask';
import About from './components/About';
const App = () => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      await fetch('http://localhost:5000/tasks')
      .then((res) => res.json())
      .then((json) => setTasks(json));
    }
    fetchTasks();
  }, [])

  const fetchTask = async (id) => {
    return await fetch(`http://localhost:5000/tasks/${id}`)
    .then(res => res.json())
    .then(json => json);
  }

  //Add Task
  const addTask = async(task) => {
    const id = Math.floor(Math.random() * 1000) + 1;
    const newTask = {id, ...task};
    await fetch('http://localhost:5000/tasks',{
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(newTask)
    }).then(setTasks([...tasks, newTask]));

    
  }

  // Delete Task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`,
    {
      method: 'DELETE'
    });
    setTasks(tasks.filter((task) => task.id !== id));
  }

  //Toggle Reminder
  const toggleReminder = async(id) => {
    // console.log(id);
    const tasktoggle = await fetchTask(id);
    const updateTask = { ...tasktoggle, reminder: !tasktoggle.reminder}

    await fetch(`http://localhost:5000/tasks/${id}`,{
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(updateTask)})
      .then(res => res.json())
      .then(json => setTasks(
        tasks.map((task) => task.id === id 
        ? {...task, reminder: json.reminder}
        : task
        )
      )
    )
  }

  return (
    <Router>
      <div className='container'>
        <Header 
        onAdd={() => setShowAddTask(!showAddTask)}
        showAdd={showAddTask}/>
        <Route path='/' exact render={(props) => (
          <>
            { showAddTask && 
              <AddTask
              onAdd={addTask}/>
            }
            { Tasks.length > 0 ? (
                <Tasks 
                  tasks={tasks} 
                  onDelete={deleteTask}
                  onToggle={toggleReminder}
                />
              )
              : (
                'No Task To Show'
              )
            }
          </>
          )}
        />
        <Route path='/about' component={About}/>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
