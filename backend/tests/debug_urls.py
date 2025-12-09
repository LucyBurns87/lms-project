# debug_urls.py
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lms_backend.settings')
django.setup()

from django.urls import get_resolver

print("=" * 60)
print("REGISTERED URL PATTERNS")
print("=" * 60)

resolver = get_resolver()

# Get all URL patterns
def show_urls(urlpatterns, prefix=''):
    for pattern in urlpatterns:
        if hasattr(pattern, 'url_patterns'):
            # This is an include()
            show_urls(pattern.url_patterns, prefix + str(pattern.pattern))
        else:
            # This is a regular path
            print(f"{prefix}{pattern.pattern}")

show_urls(resolver.url_patterns)

print("\n" + "=" * 60)
print("SEARCHING FOR 'enrollment' PATTERNS")
print("=" * 60)

from django.urls import reverse

try:
    # Try to reverse the enrollment-list URL
    url = reverse('enrollment-list')
    print(f"✓ enrollment-list URL: {url}")
except Exception as e:
    print(f"✗ enrollment-list not found: {e}")

# Print all available URL names
print("\n" + "=" * 60)
print("URL NAMES CONTAINING 'enrollment'")
print("=" * 60)

from django.urls import get_resolver
resolver = get_resolver()

for pattern_name in resolver.reverse_dict.keys():
    if pattern_name and 'enroll' in str(pattern_name).lower():
        print(f"  - {pattern_name}")