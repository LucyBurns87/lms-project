# Stop any running Django server (CTRL+C manually if needed)
Write-Host "Resetting Django project..."

# Delete database
Remove-Item -Force db.sqlite3

# Clear migration files (except __init__.py)
Get-ChildItem -Recurse -Include *.py -Path .\apps\*\migrations |
    Where-Object { $_.Name -ne "__init__.py" } |
    Remove-Item -Force

# Rebuild database
python manage.py migrate

# Recreate migrations for apps
python manage.py makemigrations users
python manage.py makemigrations courses

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
