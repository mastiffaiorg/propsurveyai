import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UploadFiles } from "(components)/upload-files";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Download } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function MainContent({ currentStep, setCurrentStep }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [extractedCoordinates, setExtractedCoordinates] = useState([]);
  const [bearings, setBearings] = useState("");
  const [boundingBox, setBoundingBox] = useState({
    minLat: "",
    maxLat: "",
    minLng: "",
    maxLng: "",
  });
  const [additionalPoints, setAdditionalPoints] = useState([]);
  const [extractedBearings, setExtractedBearings] = useState("");

  const dummyFileNames = [
    "Deed_123456.pdf",
    "Property_Survey_789012.pdf",
    "Land_Title_345678.pdf",
    "Boundary_Description_901234.pdf",
    "Easement_Document_567890.pdf",
    "Plot_Map_234567.pdf",
    "Subdivision_Plan_890123.pdf",
    "Right_of_Way_456789.pdf",
    "Zoning_Certificate_012345.pdf",
    "Topographic_Survey_678901.pdf",
    "Flood_Zone_Determination_234567.pdf",
    "Environmental_Assessment_890123.pdf",
    "Utility_Easement_456789.pdf",
    "Historical_Property_Record_012345.pdf",
    "Mineral_Rights_Document_678901.pdf",
  ];

  const steps = [
    { name: "Step 1", description: "Add Deeds" },
    { name: "Step 2", description: "Extract Coordinates" },
    { name: "Step 3", description: "View Plot" },
    { name: "Step 4", description: "Download DXF" },
  ];

  const colors = ["bg-blue-100", "bg-blue-200", "bg-blue-300", "bg-blue-400"];
  const textColors = [
    "text-blue-900",
    "text-blue-900",
    "text-blue-900",
    "text-white",
  ];

  const handleFileUpload = (files) => {
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setPageNumber(1);
    setExtractedCoordinates([
      { lat: 40.7128, lng: -74.006 },
      { lat: 40.7129, lng: -74.0061 },
      { lat: 40.713, lng: -74.0062 },
    ]);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleAddBoundingBox = () => {
    if (
      boundingBox.minLat &&
      boundingBox.maxLat &&
      boundingBox.minLng &&
      boundingBox.maxLng
    ) {
      const newCoordinates = [
        {
          lat: parseFloat(boundingBox.minLat),
          lng: parseFloat(boundingBox.minLng),
        },
        {
          lat: parseFloat(boundingBox.minLat),
          lng: parseFloat(boundingBox.maxLng),
        },
        {
          lat: parseFloat(boundingBox.maxLat),
          lng: parseFloat(boundingBox.maxLng),
        },
        {
          lat: parseFloat(boundingBox.maxLat),
          lng: parseFloat(boundingBox.minLng),
        },
        {
          lat: parseFloat(boundingBox.minLat),
          lng: parseFloat(boundingBox.minLng),
        },
      ];

      setExtractedCoordinates([...extractedCoordinates, ...newCoordinates]);
      setBoundingBox({
        minLat: "",
        maxLat: "",
        minLng: "",
        maxLng: "",
      });
    }
  };

  const handleAddAdditionalPoint = () => {
    setAdditionalPoints([...additionalPoints, { lat: "", lng: "" }]);
  };

  const handleAdditionalPointChange = (index, field, value) => {
    const updatedPoints = [...additionalPoints];
    updatedPoints[index][field] = value;
    setAdditionalPoints(updatedPoints);
  };

  const handleAddAllPoints = () => {
    const validPoints = additionalPoints.filter(
      (point) => point.lat && point.lng,
    );
    if (validPoints.length > 0) {
      const newCoordinates = validPoints.map((point) => ({
        lat: parseFloat(point.lat),
        lng: parseFloat(point.lng),
      }));
      setExtractedCoordinates([...extractedCoordinates, ...newCoordinates]);
      setAdditionalPoints([]);
    }
  };

  const handleDownloadDXF = () => {
    // Implement DXF download logic here
    console.log("Downloading DXF...");
  };

  return (
    <div className="space-y-6">
      <Card className="w-full bg-white shadow-md">
        <CardContent className="p-0">
          <ScrollArea className="w-full overflow-x-auto">
            <div
              className="flex justify-between w-full space-x-1 min-w-max"
            >
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`relative flex flex-col items-center justify-center ${
                    colors[index]
                  } p-2 w-20 sm:w-44 h-16 cursor-pointer ${
                    currentStep === index + 1 ? "ring-2 ring-blue-600" : ""
                  }`}
                  style={{
                    clipPath:
                      "polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%, 15% 50%)",
                  }}
                  onClick={() => setCurrentStep(index + 1)}
                >
                  <span
                    className={`font-semibold text-xs ${textColors[index]} text-center`}
                  >
                    {step.name}
                  </span>
                  <span
                    className={`text-xs sm:text-sm text-center mt-1 ${textColors[index]} leading-tight`}
                  >
                    {step.description}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {currentStep === 1 && (
        <div
          className="flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-6"
        >
          <Card className="w-full sm:w-1/4 bg-white shadow-md">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">
                Uploaded Files
              </h3>
              <ScrollArea className="h-[300px]">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className={`p-2 cursor-pointer ${
                      selectedFile === file ? "bg-blue-100" : ""
                    }`}
                    onClick={() => handleFileSelect(file)}
                  >
                    {file.name}
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="w-full sm:w-3/4 bg-white shadow-md">
            <CardContent className="p-4">
              <div className="mb-4">
                <UploadFiles onUpload={handleFileUpload} />

                {selectedFile && (
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold mb-2">
                      Selected File: {selectedFile.name}
                    </h4>
                    <div className="bg-gray-100 p-4 rounded">
                      <Document
                        file={selectedFile}
                        onLoadSuccess={onDocumentLoadSuccess}
                      >
                        <Page pageNumber={pageNumber} width={300} />
                      </Document>
                      <p>
                        Page {pageNumber} of {numPages}
                      </p>
                      <div className="flex justify-between mt-2">
                        <Button
                          onClick={() => setPageNumber(pageNumber - 1)}
                          disabled={pageNumber <= 1}
                        >
                          Previous
                        </Button>
                        <Button
                          onClick={() => setPageNumber(pageNumber + 1)}
                          disabled={pageNumber >= numPages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {currentStep === 2 && (
        <div
          className="flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-6"
        >
          <Card className="w-full sm:w-1/4 bg-white shadow-md">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">
                List of Deeds
              </h3>
              <ScrollArea className="h-[1200px]">
                {dummyFileNames.map((fileName, index) => (
                  <div
                    key={index}
                    className={`p-2 cursor-pointer hover:bg-blue-50 ${
                      selectedFile === fileName ? "bg-blue-100" : ""
                    }`}
                    onClick={() => handleFileSelect(fileName)}
                  >
                    {fileName}
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>

          <div className="w-full sm:w-3/4 space-y-6">
            <Card className="w-full bg-white shadow-md">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-4">
                  PDF Viewer
                </h3>
                <div
                  className="bg-gray-100 p-4 rounded h-[600px] flex items-center justify-center"
                >
                  {selectedFile ? (
                    <Document
                      file={selectedFile}
                      onLoadSuccess={onDocumentLoadSuccess}
                    >
                      <Page
                        pageNumber={pageNumber}
                        width={500}
                        height={550}
                      />
                    </Document>
                  ) : (
                    <p className="text-gray-500 text-lg">
                      PDF will be displayed here
                    </p>
                  )}
                </div>
                {selectedFile && (
                  <>
                    <p className="mt-2">
                      Page {pageNumber} of {numPages}
                    </p>
                    <div className="flex justify-between mt-2">
                      <Button
                        onClick={() => setPageNumber(pageNumber - 1)}
                        disabled={pageNumber <= 1}
                      >
                        Previous
                      </Button>
                      <Button
                        onClick={() => setPageNumber(pageNumber + 1)}
                        disabled={pageNumber >= numPages}
                      >
                        Next
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="w-full bg-white shadow-md">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-4">
                  Bearings Extracted from Deed
                </h3>
                <textarea
                  value={extractedBearings}
                  onChange={(e) => setExtractedBearings(e.target.value)}
                  className="w-full h-40 p-2 border rounded"
                  placeholder="Enter extracted bearings here..."
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div
          className="flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-6"
        >
          <Card className="w-full sm:w-1/4 bg-white shadow-md">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">
                List of Deeds
              </h3>
              <ScrollArea className="h-[500px]">
                {dummyFileNames.map((fileName, index) => (
                  <div
                    key={index}
                    className={`p-2 cursor-pointer hover:bg-blue-50 ${
                      selectedFile === fileName ? "bg-blue-100" : ""
                    }`}
                    onClick={() => handleFileSelect(fileName)}
                  >
                    {fileName}
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="w-full sm:w-2/4 bg-white shadow-md">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">
                Map View
              </h3>
              <div
                className="bg-gray-100 h-[500px] rounded flex items-center justify-center"
              >
                <p className="text-gray-500">
                  Map will be displayed here
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full sm:w-1/4 bg-white shadow-md">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">
                Extracted Geographic Coordinates
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bearings">
                    Bearings in Document
                  </Label>
                  <Input
                    value={bearings}
                    onChange={(e) => setBearings(e.target.value)}
                    placeholder="Enter bearings"
                  />
                </div>
                <div>
                  <Label>Bounding Box Coordinates</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={boundingBox.minLat}
                      onChange={(e) =>
                        setBoundingBox({
                          ...boundingBox,
                          minLat: e.target.value,
                        })
                      }
                      placeholder="Min Latitude"
                    />

                    <Input
                      value={boundingBox.maxLat}
                      onChange={(e) =>
                        setBoundingBox({
                          ...boundingBox,
                          maxLat: e.target.value,
                        })
                      }
                      placeholder="Max Latitude"
                    />

                    <Input
                      value={boundingBox.minLng}
                      onChange={(e) =>
                        setBoundingBox({
                          ...boundingBox,
                          minLng: e.target.value,
                        })
                      }
                      placeholder="Min Longitude"
                    />

                    <Input
                      value={boundingBox.maxLng}
                      onChange={(e) =>
                        setBoundingBox({
                          ...boundingBox,
                          maxLng: e.target.value,
                        })
                      }
                      placeholder="Max Longitude"
                    />
                  </div>
                  <Button
                    onClick={handleAddBoundingBox}
                    className="mt-2 w-full"
                  >
                    Update Bounding Box
                  </Button>
                </div>
                <div>
                  <Label>Additional Points</Label>
                  {additionalPoints.map((point, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-2 gap-2 mt-2"
                    >
                      <Input
                        value={point.lat}
                        onChange={(e) =>
                          handleAdditionalPointChange(
                            index,
                            "lat",
                            e.target.value,
                          )
                        }
                        placeholder="Latitude"
                      />

                      <Input
                        value={point.lng}
                        onChange={(e) =>
                          handleAdditionalPointChange(
                            index,
                            "lng",
                            e.target.value,
                          )
                        }
                        placeholder="Longitude"
                      />
                    </div>
                  ))}
                  <Button
                    onClick={handleAddAdditionalPoint}
                    className="mt-2 w-full"
                    variant="outline"
                  >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add Point
                  </Button>
                  {additionalPoints.length > 0 && (
                    <Button
                      onClick={handleAddAllPoints}
                      className="mt-2 w-full"
                    >
                      Add All Points
                    </Button>
                  )}
                </div>
                <ScrollArea className="h-[200px] mt-4">
                  {extractedCoordinates.map((coord, index) => (
                    <div key={index} className="p-2">
                      Lat: {coord.lat}, Lng: {coord.lng}
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {currentStep === 4 && (
        <div className="flex flex-col space-y-6">
          <Button
            onClick={handleDownloadDXF}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-6 px-6 rounded-lg shadow-lg flex items-center justify-center text-xl"
          >
            <Download className="w-8 h-8 mr-2" />
            Download DXF
          </Button>
          <Card className="w-full bg-white shadow-md">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">
                Final Map
              </h3>
              <div
                className="bg-gray-100 h-[500px] rounded flex items-center justify-center"
              >
                <p className="text-gray-500">
                  Final map will be displayed here
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Button
        onClick={() => setCurrentStep(currentStep + 1)}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-lg shadow-lg text-xl mt-6"
        disabled={currentStep === 4}
      >
        Next
      </Button>
    </div>
  );
}
