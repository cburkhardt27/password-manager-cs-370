from setuptools import setup, find_packages

setup(
    name="password_manager",
    version="1.0",
    packages=find_packages(),
    install_requires=[
        # List your dependencies here, e.g.,
        # 'requests',
    ],
    entry_points={
        "console_scripts": [
            "password-manager=main:main",  # Creates `password-manager` command
        ],
    },
)