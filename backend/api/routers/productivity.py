from __future__ import annotations

from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from api.deps import db_session
from engines.productivity.projects import service as project_service
from engines.productivity.tasks import service as task_service
from models.project import Project
from models.task import Task

router = APIRouter(prefix="/productivity", tags=["productivity"])


class ProjectOut(BaseModel):
    id: str
    name: str
    description: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None


class ProjectCreateIn(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=2000)


class ProjectUpdateIn(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=2000)


class TaskOut(BaseModel):
    id: str
    project_id: str | None = None
    title: str
    description: str | None = None
    status: str
    priority: int
    created_at: datetime | None = None
    updated_at: datetime | None = None


class TaskCreateIn(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=4000)
    project_id: str | None = None
    status: str = Field(default="todo", max_length=32)
    priority: int = 0


class TaskUpdateIn(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=4000)
    project_id: str | None = None
    status: str | None = Field(default=None, max_length=32)
    priority: int | None = None


def _project_to_out(p: Project) -> ProjectOut:
    return ProjectOut(
        id=p.id,
        name=p.name,
        description=p.description,
        created_at=p.created_at,
        updated_at=p.updated_at,
    )


def _task_to_out(t: Task) -> TaskOut:
    return TaskOut(
        id=t.id,
        project_id=t.project_id,
        title=t.title,
        description=t.description,
        status=t.status,
        priority=t.priority,
        created_at=t.created_at,
        updated_at=t.updated_at,
    )


@router.get("/projects", response_model=list[ProjectOut])
def list_projects(db: Session = Depends(db_session), limit: int = 100, offset: int = 0) -> list[ProjectOut]:
    items = project_service.list_projects(db, limit=limit, offset=offset)
    return [_project_to_out(p) for p in items]


@router.post("/projects", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
def create_project(payload: ProjectCreateIn, db: Session = Depends(db_session)) -> ProjectOut:
    item = project_service.create_project(
        db, project_service.ProjectCreate(name=payload.name, description=payload.description)
    )
    return _project_to_out(item)


@router.get("/projects/{project_id}", response_model=ProjectOut)
def get_project(project_id: str, db: Session = Depends(db_session)) -> ProjectOut:
    item = project_service.get_project(db, project_id)
    if item is None:
        raise HTTPException(status_code=404, detail="project_not_found")
    return _project_to_out(item)


@router.patch("/projects/{project_id}", response_model=ProjectOut)
def update_project(project_id: str, payload: ProjectUpdateIn, db: Session = Depends(db_session)) -> ProjectOut:
    item = project_service.get_project(db, project_id)
    if item is None:
        raise HTTPException(status_code=404, detail="project_not_found")
    updated = project_service.update_project(
        db, item, project_service.ProjectUpdate(name=payload.name, description=payload.description)
    )
    return _project_to_out(updated)


@router.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(project_id: str, db: Session = Depends(db_session)) -> None:
    item = project_service.get_project(db, project_id)
    if item is None:
        raise HTTPException(status_code=404, detail="project_not_found")
    project_service.delete_project(db, item)
    return None


@router.get("/tasks", response_model=list[TaskOut])
def list_tasks(db: Session = Depends(db_session), limit: int = 100, offset: int = 0) -> list[TaskOut]:
    items = task_service.list_tasks(db, limit=limit, offset=offset)
    return [_task_to_out(t) for t in items]


@router.post("/tasks", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
def create_task(payload: TaskCreateIn, db: Session = Depends(db_session)) -> TaskOut:
    item = task_service.create_task(
        db,
        task_service.TaskCreate(
            title=payload.title,
            description=payload.description,
            project_id=payload.project_id,
            status=payload.status,
            priority=payload.priority,
        ),
    )
    return _task_to_out(item)


@router.get("/tasks/{task_id}", response_model=TaskOut)
def get_task(task_id: str, db: Session = Depends(db_session)) -> TaskOut:
    item = task_service.get_task(db, task_id)
    if item is None:
        raise HTTPException(status_code=404, detail="task_not_found")
    return _task_to_out(item)


@router.patch("/tasks/{task_id}", response_model=TaskOut)
def update_task(task_id: str, payload: TaskUpdateIn, db: Session = Depends(db_session)) -> TaskOut:
    item = task_service.get_task(db, task_id)
    if item is None:
        raise HTTPException(status_code=404, detail="task_not_found")
    updated = task_service.update_task(
        db,
        item,
        task_service.TaskUpdate(
            title=payload.title,
            description=payload.description,
            project_id=payload.project_id,
            status=payload.status,
            priority=payload.priority,
        ),
    )
    return _task_to_out(updated)


@router.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: str, db: Session = Depends(db_session)) -> None:
    item = task_service.get_task(db, task_id)
    if item is None:
        raise HTTPException(status_code=404, detail="task_not_found")
    task_service.delete_task(db, item)
    return None

