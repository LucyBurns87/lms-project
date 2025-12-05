"""
URL configuration for the Quizzes application.
Prepared for future quiz functionality - currently placeholder.

Planned URL Patterns (Future Implementation):
    /api/quizzes/                       - List/Create quizzes
    /api/quizzes/{id}/                  - Retrieve/Update/Delete quiz
    /api/quizzes/{id}/questions/        - Manage quiz questions
    /api/quizzes/{id}/take/            - Take quiz (student action)
    /api/quizzes/{id}/submit/          - Submit quiz answers
    /api/quizzes/attempts/             - List quiz attempts
    /api/quizzes/attempts/{id}/        - View attempt details

Future ViewSets:
    QuizViewSet: CRUD operations for quizzes
    QuestionViewSet: Manage quiz questions
    AttemptViewSet: Track student quiz attempts
    AnswerViewSet: Store and grade student answers
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter

# Initialize Django REST Framework router
# Ready to register ViewSets when quiz functionality is implemented
router = DefaultRouter()

# TODO: Register ViewSets when quiz models and views are created
# 
# Example future registration:
# from .views import QuizViewSet, QuestionViewSet, AttemptViewSet
#
# router.register(r'', QuizViewSet, basename='quiz')
# This will create:
#   GET    /api/quizzes/           -> List all quizzes
#   POST   /api/quizzes/           -> Create new quiz (teacher)
#   GET    /api/quizzes/{id}/      -> Get quiz details
#   PUT    /api/quizzes/{id}/      -> Update quiz
#   DELETE /api/quizzes/{id}/      -> Delete quiz
#
# router.register(r'questions', QuestionViewSet, basename='question')
# This will create:
#   GET    /api/quizzes/questions/        -> List all questions
#   POST   /api/quizzes/questions/        -> Create question
#   GET    /api/quizzes/questions/{id}/   -> Get question
#   PUT    /api/quizzes/questions/{id}/   -> Update question
#   DELETE /api/quizzes/questions/{id}/   -> Delete question
#
# router.register(r'attempts', AttemptViewSet, basename='attempt')
# This will create endpoints for managing quiz attempts

# Include router URLs (currently empty)
urlpatterns = [
    path('', include(router.urls)),
]

# Planned Quiz Feature Workflow:
# 1. Teacher creates quiz: POST /api/quizzes/
# 2. Teacher adds questions: POST /api/quizzes/{quiz_id}/questions/
# 3. Student takes quiz: POST /api/quizzes/{quiz_id}/take/
# 4. Student submits answers: POST /api/quizzes/{quiz_id}/submit/
# 5. System auto-grades: Returns score and correct answers
# 6. Student views results: GET /api/quizzes/attempts/{attempt_id}/