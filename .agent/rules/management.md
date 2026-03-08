---
trigger: always_on
---

# Project Management & Workflow Rules

## 1. Task Management
- Always maintain a `TASKS.md` file in the project root.
- Before starting any work, check `TASKS.md` for the next prioritized item.
- After completing a task, update `TASKS.md` by marking it as done and appending the next logical steps.

## 2. Branch Naming Philosophy
Before beginning a new task, create a new branch using the following structured naming convention:

- **feature/**: For new features (e.g., `feature/user-authentication`)
- **bugfix/**: For fixing bugs (e.g., `bugfix/fix-header-styling`)
- **hotfix/**: For urgent production fixes (e.g., `hotfix/critical-login-bug`)
- **chore/**: For non-code tasks, dependencies, or documentation (e.g., `chore/update-readme`)
- **experiment/**: For trying out new ideas or spikes (e.g., `experiment/new-dashboard`)

## 3. Workflow Execution
1. Identify the task from `TASKS.md`.
2. Determine the category (feature, bugfix, etc.).
3. Create and switch to the appropriately named branch.
4. Execute the work.
5. Update `TASKS.md` upon completion.