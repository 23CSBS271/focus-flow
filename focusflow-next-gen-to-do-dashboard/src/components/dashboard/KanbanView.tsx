"use client";

import { motion } from "framer-motion";
import { Task, TaskStatus } from "@/types/task";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  DragOverEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface KanbanViewProps {
  tasks: Task[];
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
}

interface Column {
  id: TaskStatus;
  title: string;
  color: string;
}

const columns: Column[] = [
  { id: "todo", title: "To Do", color: "from-blue-500 to-cyan-500" },
  { id: "in-progress", title: "In Progress", color: "from-yellow-500 to-orange-500" },
  { id: "completed", title: "Completed", color: "from-green-500 to-emerald-500" },
];

function DroppableColumn({
  column,
  children,
}: {
  column: Column;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`space-y-3 min-h-[400px] bg-muted/30 rounded-lg p-3 transition-colors ${
        isOver ? "bg-muted/50 ring-2 ring-primary" : ""
      }`}
    >
      {children}
    </div>
  );
}

function KanbanCard({
  task,
  onEdit,
  onDelete,
  onClick,
}: {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onClick?: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityColors = {
    low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    urgent: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  const categoryColors = {
    personal: "bg-purple-500/10 text-purple-500",
    work: "bg-blue-500/10 text-blue-500",
    health: "bg-green-500/10 text-green-500",
    shopping: "bg-orange-500/10 text-orange-500",
    other: "bg-gray-500/10 text-gray-500",
  };

  const handleDeleteConfirm = () => {
    onDelete?.(task.id);
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <Card className="p-3 cursor-move hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4
              className="font-semibold text-sm flex-1 cursor-pointer hover:text-primary"
              onClick={(e) => {
                e.stopPropagation();
                onClick?.();
              }}
            >
              {task.title}
            </h4>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreVertical className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(task)}>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)} className="text-destructive">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {task.description && (
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{task.description}</p>
          )}

          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1">
              <Badge className={`text-xs ${priorityColors[task.priority]}`} variant="outline">
                {task.priority}
              </Badge>
              <Badge className={`text-xs ${categoryColors[task.category]}`} variant="outline">
                {task.category}
              </Badge>
            </div>
            {task.dueDate && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {format(task.dueDate, "MMM dd")}
              </div>
            )}
          </div>

          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {task.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {task.tags.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{task.tags.length - 2}
                </Badge>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the task "{task.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function KanbanView({ tasks, onEdit, onDelete, onStatusChange }: KanbanViewProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over) {
      const taskId = active.id as string;
      
      // Check if dropping on a column (droppable area)
      const targetColumn = columns.find((col) => col.id === over.id);
      if (targetColumn) {
        onStatusChange?.(taskId, targetColumn.id);
      } else {
        // Dropping on another task - get that task's status
        const targetTask = tasks.find((t) => t.id === over.id);
        if (targetTask && targetTask.status !== tasks.find((t) => t.id === taskId)?.status) {
          onStatusChange?.(taskId, targetTask.status);
        }
      }
    }

    setActiveTask(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold">Kanban Board</h2>
          <p className="text-muted-foreground mt-1">Drag and drop tasks to update their status</p>
        </div>
        <div className="flex gap-4 text-sm">
          {columns.map((col) => (
            <div key={col.id} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${col.color}`}></div>
              <span className="text-muted-foreground">
                {tasks.filter((t) => t.status === col.id).length} {col.title}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Kanban Board */}
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-3 gap-6">
          {columns.map((column, index) => {
            const columnTasks = tasks.filter((task) => task.status === column.id);

            return (
              <motion.div
                key={column.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-3"
              >
                {/* Column Header */}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${column.color}`} />
                  <div>
                    <h3 className="font-semibold">{column.title}</h3>
                    <p className="text-xs text-muted-foreground">{columnTasks.length} tasks</p>
                  </div>
                </div>

                {/* Tasks */}
                <DroppableColumn column={column}>
                  <SortableContext items={columnTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                      {columnTasks.map((task) => (
                        <KanbanCard 
                          key={task.id} 
                          task={task} 
                          onEdit={onEdit} 
                          onDelete={onDelete}
                          onClick={() => onEdit?.(task)}
                        />
                      ))}
                      {columnTasks.length === 0 && (
                        <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
                          Drop tasks here
                        </div>
                      )}
                    </div>
                  </SortableContext>
                </DroppableColumn>
              </motion.div>
            );
          })}
        </div>

        <DragOverlay>
          {activeTask && (
            <Card className="p-3 shadow-xl rotate-3">
              <h4 className="font-semibold text-sm">{activeTask.title}</h4>
            </Card>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}