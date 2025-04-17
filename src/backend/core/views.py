from django.http import HttpResponse
from django.db.migrations.executor import MigrationExecutor
from django.db import connection


def migrations_are_applied():
    executor = MigrationExecutor(connection)
    targets = executor.loader.graph.leaf_nodes()
    plan = executor.migration_plan(targets)
    return len(plan) == 0


def healthcheck(request):
    # raise KeyError
    return HttpResponse("0", status=200)


def healthcheck_migrations(request):
    if migrations_are_applied():
        return HttpResponse("0", status=200)
    else:
        return HttpResponse("1", status=400)
