from django.shortcuts import render
import json
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from .models import ContentBlock


def change_content_block_order(request):
    if request.method == "POST" and request.is_ajax():

        direction = json.loads(request.body).get("direction")
        block_id = json.loads(request.body).get("block_id")

        content_block = get_object_or_404(ContentBlock, id=block_id)

        current_order = content_block.order
        new_order = current_order

        if direction == "up":
            new_order = current_order - 1
            if new_order >= 1:

                ContentBlock.objects.filter(
                    course=content_block.course,
                    order=current_order - 1
                ).update(order=current_order)
                content_block.order = new_order
                content_block.save()

        elif direction == "down":
            new_order = current_order + 1

            ContentBlock.objects.filter(
                course=content_block.course,
                order=current_order + 1
            ).update(order=current_order)
            content_block.order = new_order
            content_block.save()

        blocks = ContentBlock.objects.filter(
            course=content_block.course
        ).order_by(
            "order"
        )

        return render(
            request,
            "admin/blocks/_content_block_row.html",
            {"content_block": content_block},
        )

    return JsonResponse({"success": False, "message": "Invalid request"})
