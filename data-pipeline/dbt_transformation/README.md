## 🐍 Environment Setup

### 1. Create the Virtual Environment

Open your terminal at the root directory of the project and run the following command to create a new virtual environment named `dbt-env`:

```bash
python -m venv dbt-env
```

### 2. Activate the Environment

You must activate the virtual environment every time you work on the Python/dbt portions of this project. Use the command corresponding to your operating system:

- For Windows (PowerShell):

```bash
.\dbt-env\Scripts\Activate.ps1
```

- For Windows (Command Prompt):

```bash
dbt-env\Scripts\activate.bat
```

### 3. Install Packages

Once the environment is active, install all the required dependencies listed in the requirements.txt file:

```bash
pip install -r requirements.txt
```

### 4. Deactivate (When Finished)

When you are done working on the project, you can exit the virtual environment by simply typing:

```bash
deactivate
```
