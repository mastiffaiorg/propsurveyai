import openai
import requests
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from geopy.distance import geodesic
from pdf2image import convert_from_path
from typing import List
import os

# OpenAI GPT-4 API Configuration
openai.api_key = "YOUR_OPENAI_API_KEY"

# Initialize FastAPI app
app = FastAPI()

# Function to extract text from an image using GPT-4 Vision API
def extract_text_with_gpt_vision(image_path):
    with open(image_path, "rb") as image_file:
        image_data = image_file.read()

    response = openai.Image.create(
        file=image_data,
        model="gpt-4-vision"
    )

    return response['choices'][0]['text']

# Function to convert PDF to images (one image per page)
def convert_pdf_to_images(pdf_file):
    images = convert_from_path(pdf_file)
    image_paths = []
    for idx, image in enumerate(images):
        image_path = f"page_{idx + 1}.png"
        image.save(image_path, "PNG")
        image_paths.append(image_path)
    return image_paths

# Function to geocode a location using OpenStreetMap Nominatim API
def geocode_location_osm(location_description):
    url = "https://nominatim.openstreetmap.org/search"
    params = {
        "q": location_description,
        "format": "json"
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        if len(data) > 0:
            latitude = float(data[0]["lat"])
            longitude = float(data[0]["lon"])
            return latitude, longitude
        else:
            print(f"No results found for {location_description}")
            return None
    else:
        print(f"Error in API request: {response.status_code}")
        return None

# Function to calculate the next point based on a starting point, distance (in feet), and bearing (in degrees)
def calculate_new_point(lat, lon, distance_ft, bearing):
    distance_miles = distance_ft / 5280  # Convert feet to miles
    new_point = geodesic(miles=distance_miles).destination((lat, lon), bearing)
    return new_point.latitude, new_point.longitude

# Function to parse bearings and distances from the text (uses GPT-4)
def parse_bearings_and_distances(deed_text):
    prompt = "Extract all bearings and distances from the following deed text, and format them as a list of tuples. Each tuple should contain (bearing, distance)."
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": f"{prompt}\n{deed_text}"}
        ]
    )
    return eval(response.choices[0].message['content'])  # Assuming GPT returns a Python list format

# Endpoint to upload a PDF and return the bounding box
@app.post("/upload_deed/")
async def upload_deed(file: UploadFile = File(...), pob_description: str = "Smith Street and Analomink Street, East Stroudsburg, PA"):
    # Save the uploaded PDF
    pdf_path = f"{file.filename}"
    with open(pdf_path, "wb") as pdf_file:
        pdf_file.write(await file.read())

    try:
        # Convert PDF to images
        image_paths = convert_pdf_to_images(pdf_path)

        # Extract text from each page using GPT-4 Vision
        deed_text = ""
        for image_path in image_paths:
            deed_text += extract_text_with_gpt_vision(image_path) + "\n"
            os.remove(image_path)  # Clean up the image files after processing

        # Geocode the Point of Beginning
        pob_coords = geocode_location_osm(pob_description)
        if not pob_coords:
            raise HTTPException(status_code=404, detail="Point of Beginning not found.")
        
        # Parse bearings and distances
        bearings_distances = parse_bearings_and_distances(deed_text)

        # Calculate all boundary points
        current_lat, current_lon = pob_coords
        boundary_points = [(current_lat, current_lon)]
        for bearing, distance in bearings_distances:
            new_lat, new_lon = calculate_new_point(current_lat, current_lon, distance, bearing)
            boundary_points.append((new_lat, new_lon))
            current_lat, current_lon = new_lat, new_lon

        # Calculate the bounding box
        latitudes = [point[0] for point in boundary_points]
        longitudes = [point[1] for point in boundary_points]

        bounding_box = {
            "min_latitude": min(latitudes),
            "max_latitude": max(latitudes),
            "min_longitude": min(longitudes),
            "max_longitude": max(longitudes),
        }

        # Clean up the PDF file after processing
        os.remove(pdf_path)

        return JSONResponse(content={"bounding_box": bounding_box, "boundary_points": boundary_points})

    except Exception as e:
        os.remove(pdf_path)
        raise HTTPException(status_code=500, detail=str(e))

# To run the app: 
# uvicorn filename:app --reload
