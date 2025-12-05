from django.http import HttpResponse

def landing_page(request):
    return HttpResponse("""
        <h1>Welcome to the LMS Backend 🚀</h1>
        <p>Available endpoints:</p>
        <ul>
            <li><a href="/admin/">Admin Dashboard</a></li>
            <li><a href="/api/token/">Obtain JWT Token</a></li>
            <li><a href="/api/token/refresh/">Refresh JWT Token</a></li>
            <li><a href="/api/users/">User Management</a></li>
            <li><a href="/api/">Course API</a></li>
        </ul>
    """)
