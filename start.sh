#!/bin/bash

# Create a Python virtual environment
python3 -m venv venv

# Activate the virtual environment
source venv/bin/activate

# Install dependencies from requirements.txt
pip install -r requirements.txt

./webapp/manage.py migrate

./webapp/manage.py createsuperuser

./webapp/manage.py runserver
