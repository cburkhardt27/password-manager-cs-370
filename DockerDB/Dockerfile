# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Optionally, expose the port if your application requires it
EXPOSE 5000

# Run main.py when the container launches
CMD ["python", "main.py"]
