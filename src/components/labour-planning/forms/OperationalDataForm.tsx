
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OperationalDataProps {
  data: {
    fileUploaded: boolean;
    dataPreview: any[];
    isValid: boolean;
  };
  updateData: (data: Partial<OperationalDataProps["data"]>) => void;
}

const OperationalDataForm = ({ data, updateData }: OperationalDataProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState("");

  // Simulate file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsUploading(true);

    // Simulate upload progress and processing
    setTimeout(() => {
      setIsUploading(false);
      // Mock data for preview
      const mockData = [
        { date: "2025-04-01", prescriptions: 120, calls: 45, consultations: 15 },
        { date: "2025-04-02", prescriptions: 135, calls: 52, consultations: 18 },
        { date: "2025-04-03", prescriptions: 128, calls: 48, consultations: 16 },
        { date: "2025-04-04", prescriptions: 142, calls: 55, consultations: 20 },
        { date: "2025-04-05", prescriptions: 115, calls: 42, consultations: 14 },
        { date: "2025-04-06", prescriptions: 90, calls: 38, consultations: 10 },
        { date: "2025-04-07", prescriptions: 75, calls: 30, consultations: 8 }
      ];

      updateData({
        fileUploaded: true,
        dataPreview: mockData,
        isValid: true
      });

      toast({
        title: "File uploaded successfully",
        description: "Your operational data has been processed and is ready for review."
      });
    }, 1500);
  };

  const handleRemoveFile = () => {
    setFileName("");
    updateData({
      fileUploaded: false,
      dataPreview: [],
      isValid: false
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Load Operational Data</CardTitle>
        <CardDescription>
          Upload your operational data to configure the labour model
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="flex flex-col items-center">
            <FileText className="h-10 w-10 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium">Upload your data file</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload a CSV file with prescription fills, call logs, consultations data
            </p>

            <div className="flex items-center gap-4">
              <Label htmlFor="data-file" className="cursor-pointer">
                <div className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md flex items-center">
                  <Upload className="mr-2 h-4 w-4" />
                  Browse Files
                </div>
                <Input
                  id="data-file"
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </Label>
              
              {fileName && (
                <span className="text-sm">
                  {fileName}
                  {isUploading && " (Processing...)"}
                </span>
              )}
            </div>

            {data.fileUploaded && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveFile}
                className="mt-4"
              >
                Remove File & Upload Another
              </Button>
            )}
          </div>
        </div>

        {data.fileUploaded && (
          <>
            <Alert variant={data.isValid ? "default" : "destructive"}>
              <div className="flex items-center gap-2">
                {data.isValid ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertTitle>
                  {data.isValid ? "Data Validation Successful" : "Validation Issues"}
                </AlertTitle>
              </div>
              <AlertDescription className="mt-2">
                {data.isValid
                  ? "Your data has been validated and is ready for the next step."
                  : "Please ensure your data includes dates, prescription counts, and consultation data."}
              </AlertDescription>
            </Alert>

            <div>
              <h3 className="text-lg font-medium mb-4">Data Preview</h3>
              <div className="border rounded-md overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Prescriptions</TableHead>
                      <TableHead>Calls</TableHead>
                      <TableHead>Consultations</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.dataPreview.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.prescriptions}</TableCell>
                        <TableCell>{row.calls}</TableCell>
                        <TableCell>{row.consultations}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OperationalDataForm;
