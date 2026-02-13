from __future__ import annotations

from dataclasses import dataclass

from sqlalchemy import select
from sqlalchemy.orm import Session

from models.project import Project


@dataclass(frozen=True)
class ProjectCreate:
    name: str
    description: str | None = None


@dataclass(frozen=True)
class ProjectUpdate:
    name: str | None = None
    description: str | None = None


def list_projects(db: Session, limit: int = 100, offset: int = 0) -> list[Project]:
    stmt = select(Project).order_by(Project.updated_at.desc(), Project.created_at.desc()).limit(limit).offset(offset)
    return list(db.scalars(stmt).all())


def get_project(db: Session, project_id: str) -> Project | None:
    return db.get(Project, project_id)


def create_project(db: Session, payload: ProjectCreate) -> Project:
    project = Project(name=payload.name, description=payload.description)
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


def update_project(db: Session, project: Project, payload: ProjectUpdate) -> Project:
    if payload.name is not None:
        project.name = payload.name
    if payload.description is not None:
        project.description = payload.description
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


def delete_project(db: Session, project: Project) -> None:
    db.delete(project)
    db.commit()

