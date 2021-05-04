import React, { useState, useCallback, useRef } from "react"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import update from "immutability-helper"
import Paper from "@material-ui/core/Paper"

const tasksList = [
  { _id: 1, title: "First Task", status: "order_created" },
  { _id: 2, title: "Second Task", status: "order_created" },
  { _id: 3, title: "Third Task", status: "order_created" },
  { _id: 4, title: "Fourth Task", status: "picking" },
  { _id: 5, title: "Fifth Task", status: "assigned_to_picker" },
  { _id: 6, title: "Sixth Task", status: "scheduled" },
  { _id: 7, title: "Seventh Task", status: "assigned_to_driver" },
  { _id: 8, title: "Eighth Task", status: "assigned_to_driver" },
  { _id: 9, title: "Ninth Task", status: "in_transit" },
  { _id: 10, title: "Tenth Task", status: "complete" }
];

const channels = [
  "order_created",
  "assigned_to_picker",
  "picking_complete",
  "scheduled",
  "assigned_to_driver",
  "in_transit",
  "not_delivered",
  "returned",
  "complete"
]
const labelsMap = {
  order_created: "Order Created",
  assigned_to_picker: "Assigned to Picker",
  picking_complete: "Picking Complete",
  scheduled: "Scheduled",
  assigned_to_driver: "Assigned to Driver",
  in_transit: "In Transit",
  not_delivered: "Not Delivered",
  returned: "Returned",
  complete: "Complete",
}

const classes = {
  board: {
    display: "flex",
    width: "100%"
  },
  column: {
    flexGrow: 1,
    height: "80vh",
    backgroundColor: "#FFFFFF"
  },
  columnHead: {
    textAlign: "center",
    padding: "10px 30px 10px 30px",
    fontWeight: "bold",
    backgroundColor: "#EFEFEF"
  },
  item: {
    padding: 10,
    margin: 10,
    fontSize: "0.8em",
    cursor: "pointer",
    backgroundColor: "white",
    border: "1px solid #EFEFEF"
  }
}

const AdminCommonKanbanLayout = () => {
  const [tasks, setTaskStatus] = useState(tasksList)

  const changeTaskStatus = useCallback(
    (id, status) => {
      let task = tasks.find(task => task._id === id)
      const taskIndex = tasks.indexOf(task);
      task = { ...task, status }
      let newTasks = update(tasks, {
        [taskIndex]: { $set: task }
      });
      setTaskStatus(newTasks);
    },
    [tasks]
  )

  return (
      <DndProvider backend={HTML5Backend}>
        <Paper elevation={1} style={classes.board}>
          {channels.map(channel => (
            <KanbanColumn
              key={channel}
              status={channel}
              changeTaskStatus={changeTaskStatus}
            >
              <div style={classes.column}>
                <div style={classes.columnHead}>{labelsMap[channel]}</div>
                <div>
                  {tasks
                    .filter(item => item.status === channel)
                    .map(item => (
                      <KanbanItem key={item._id} id={item._id}>
                        <div style={classes.item}>{item.title}</div>
                      </KanbanItem>
                    ))}
                </div>
              </div>
            </KanbanColumn>
          ))}
        </Paper>
      </DndProvider>
  )
}

export default AdminCommonKanbanLayout

const KanbanColumn = ({ status, changeTaskStatus, children }) => {
  const ref = useRef(null)
  const [, drop] = useDrop({
    accept: "card",
    drop(item) {
      changeTaskStatus(item.id, status)
    }
  })
  drop(ref);
  return <div ref={ref}> {children}</div>
}

const KanbanItem = ({ id, children }) => {
  const ref = useRef(null);
  const [{ isDragging }, drag] = useDrag({
    item: { type: "card", id },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  })
  const opacity = isDragging ? 0 : 1;
  drag(ref);
  return (
    <div ref={ref} style={{ opacity }}>
      {children}
    </div>
  )
}
