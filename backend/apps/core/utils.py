def generate_random_string(length=8):
    import random
    import string
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

def send_email(to_email, subject, message):
    from django.core.mail import send_mail
    send_mail(subject, message, 'from@example.com', [to_email]) 

def calculate_average(grades):
    if not grades:
        return 0
    return sum(grades) / len(grades)