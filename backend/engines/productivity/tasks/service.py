from __future__ import annotations

from dataclasses import dataclass

from sqlalchemy import select
from sqlalchemy.orm import Session

from models.task import Task


@dataclass(frozen=True)
class TaskCreate:
    title: str
    description: str | None = None
    project_id: str | None = None
    status: str = "todo"
    priority: int = 0


@dataclass(frozen=True)
class TaskUpdate:
    title: str | None = None
    description: str | None = None
    project_id: str | None = None
    status: str | None = None
    priority: int | None = None


def list_tasks(db: Session, limit: int = 100, offset: int = 0) -> list[Task]:
    stmt = select(Task).order_by(Task.updated_at.desc(), Task.created_at.desc()).limit(limit).offset(offset)
    return list(db.scalars(stmt).all())


def get_task(db: Session, task_id: str) -> Task | None:
    return db.get(Task, task_id)


def create_task(db: Session, payload: TaskCreate) -> Task:
    task = Task(
        title=payload.title,
        description=payload.description,
        project_id=payload.project_id,
        status=payload.status,
        priority=payload.priority,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def update_task(db: Session, task: Task, payload: TaskUpdate) -> Task:
    if payload.title is not None:
        task.title = payload.title
    if payload.description is not None:
        task.description = payload.description
    if payload.project_id is not None:
        task.project_id = payload.project_id
    if payload.status is not None:
        task.status = payload.status
    if payload.priority is not None:
        task.priority = payload.priority

    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, task: Task) -> None:
    db.delete(task)
    db.commit()

