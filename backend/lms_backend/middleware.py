class DebugMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            if request.path == '/api/assignments/submissions/' and request.method == 'POST':
                print("\n" + "="*60)
                print("MIDDLEWARE DEBUG - Submission POST Request")
                print("="*60)
                print(f"Path: {request.path}")
                print(f"Method: {request.method}")
                print(f"User: {request.user}")
                print(f"Authenticated: {request.user.is_authenticated}")
                if hasattr(request.user, 'role'):
                    print(f"Role: '{request.user.role}'")
                # Simplified headers - dict(request.headers) might fail
                auth_header = request.headers.get('Authorization', 'None')
                print(f"Authorization header: {auth_header[:50] if auth_header else 'None'}...")
                print("="*60 + "\n")
        except Exception as e:
            print(f"Middleware error: {e}")
        
        response = self.get_response(request)
        return response