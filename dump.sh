python manage.py dumpdata --natural-primary --natural-foreign > "promthub_$(date +%Y-%m-%d_%H-%M-%S).json"
export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"
export PGPASSWORD=123
pg_dump -h dpg-cv0unhjtq21c73esk8e0-a.frankfurt-postgres.render.com -U prompthub_user -d prompthub_db_2rpq -Ft -b -f "promthub_$(date +%Y-%m-%d_%H-%M-%S).tar"