import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'hgjhytgfhg jgjhghgjhg'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'postgresql://ordertrackerdb_user:6NaWmOFmjjpvjSVsYjR5HPNI8S5prkKX@dpg-cufvabq3esus73e5dgq0-a.oregon-postgres.render.com/ordertrackerdb'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'hgnf hgkjhgjh hghgjh'