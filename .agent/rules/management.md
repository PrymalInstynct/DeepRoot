---
trigger: always_on
---

# Project Management & Workflow Rules

## 1. Task Management
- Always maintain a `TASKS.md` file in the project root.
- Before starting any work, check `TASKS.md` for the next prioritized item.
- After completing a task, update `TASKS.md` by marking it as done and appending the next logical steps.

## 2. Trunk-Based Branching Logic
Before beginning work, identify the current Git context:

- **Condition A (On `main`):** If the current branch is `main`, create a new branch following the naming convention below.
- **Condition B (Not on `main`):** If the current branch is NOT `main` (e.g., starts with `feature/`, `bugfix/`, etc.), **STAY on the current branch.** Do not create nested branches.
- **Naming Convention:**
    - `feature/`: For new features (e.g., `feature/user-authentication`)
    - `bugfix/`: For fixing bugs (e.g., `bugfix/fix-header-styling`)
    - `hotfix/`: For urgent production fixes (e.g., `hotfix/critical-login-bug`)
    - `chore/`: For non-code tasks, dependencies, or documentation (e.g., `chore/update-readme`)
    - `experiment/`: For trying out new ideas or spikes (e.g., `experiment/new-dashboard`)

## 3. Workflow Execution
1. Identify the task from `TASKS.md`.
2. Determine the category of the task (feature, bugfix, etc.).
3. Check current branch name using `git branch --show-current`.
4. If on `main`, branch out based on the category of the task in `TASKS.md`.
5. If already on a specialized branch, proceed with the work directly on that branch.
6. Execute the work.
7. Update `TASKS.md` upon completion.