"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Upload, Loader2, Download, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { parse } from "csv-parse/sync";

interface CourseType {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  price: number | null;
}

interface BulkAccessFormProps {
  courses: CourseType[];
}

interface CsvRow {
  Email: string;
  Name?: string;
  "Purchase Date"?: string;
  "Original Purchase ID"?: string;
  [key: string]: string | undefined;
}

export const BulkAccessForm = ({ courses }: BulkAccessFormProps) => {
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [csvData, setCsvData] = useState<CsvRow[]>([]);
  const [csvError, setCsvError] = useState<string>("");
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      try {
        const text = await selectedFile.text();
        const records = parse(text, {
          columns: true,
          skip_empty_lines: true,
          trim: true,
        }) as CsvRow[];

        // Validate required columns
        if (!records[0]?.Email) {
          throw new Error("CSV must contain an 'Email' column");
        }

        setCsvData(records.slice(0, 100)); // Show first 100 rows max
        setCsvError("");
      } catch (error) {
        console.error("Error parsing CSV:", error);
        setCsvError(error instanceof Error ? error.message : "Invalid CSV format");
        setCsvData([]);
        setFile(null);
        if (e.target.value) e.target.value = "";
      }
    }
  };

  const downloadTemplate = () => {
    const csvContent = "Email,Name,Purchase Date,Original Purchase ID\nexample@email.com,John Doe,2024-01-01,ORDER123";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user_migration_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCourse || !file) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a course and upload a CSV file.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("courseId", selectedCourse);

      const response = await fetch("/api/admin/bulk-access", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      toast({
        title: "Success",
        description: `Successfully migrated ${data.successCount} user(s). ${data.errorCount ? `Failed: ${data.errorCount}` : ""}`,
      });

      // Reset form
      setFile(null);
      setSelectedCourse("");
      setCsvData([]);
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Error processing user migration:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process user migration",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Import Users</CardTitle>
          <CardDescription>
            Upload a CSV file containing user details to migrate them from your old platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Course</label>
            <Select
              value={selectedCourse}
              onValueChange={setSelectedCourse}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses?.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {courses?.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No published courses available. Please publish a course first.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Upload CSV File</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={downloadTemplate}
                className="text-xs"
              >
                <Download className="h-4 w-4 mr-1" />
                Download Template
              </Button>
            </div>
            <div className="border-2 border-dashed rounded-lg p-4">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-2">
                CSV file should include: Email (required), Name, Purchase Date, and Original Purchase ID
              </p>
            </div>
          </div>

          {csvError && (
            <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 p-3 rounded-md">
              <AlertCircle className="h-4 w-4" />
              {csvError}
            </div>
          )}

          {csvData.length > 0 && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {Object.keys(csvData[0]).map((header) => (
                      <TableHead key={header}>{header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {csvData.map((row, index) => (
                    <TableRow key={index}>
                      {Object.values(row).map((value, i) => (
                        <TableCell key={i}>{value || "-"}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {csvData.length === 100 && (
                <div className="text-xs text-muted-foreground p-2 text-center bg-muted">
                  Showing first 100 rows
                </div>
              )}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || !selectedCourse || !file || csvData.length === 0}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Migration...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Import Users
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}; 