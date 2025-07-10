import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface PreviewPaneProps {
  content?: string;
  fileName?: string;
  fileType?: 'text' | 'markdown';
}

export const PreviewPane = ({ content, fileName, fileType = 'text' }: PreviewPaneProps) => {
  const handleDownload = () => {
    if (!content || !fileName) return;
    
    const blob = new Blob([content], { type: fileType === 'markdown' ? 'text/markdown' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!content) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <Eye className="h-12 w-12 text-muted-foreground mx-auto" />
          <div>
            <h3 className="text-lg font-medium text-foreground">Preview Pane</h3>
            <p className="text-sm text-muted-foreground">
              File contents will appear here when you click preview
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-medium text-foreground">{fileName}</h3>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {fileType.toUpperCase()}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {content.length} characters
                </span>
              </div>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <Card className="m-4 shadow-card h-[calc(100%-2rem)]">
          <CardHeader>
            <CardTitle className="text-sm">Content Preview</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="p-0">
            <div className="p-4 h-full overflow-auto">
              {fileType === 'markdown' ? (
                <div className="prose prose-invert max-w-none">
                  {/* For a real app, you'd use a markdown renderer like react-markdown */}
                  <pre className="whitespace-pre-wrap text-sm text-foreground font-mono leading-relaxed">
                    {content}
                  </pre>
                </div>
              ) : (
                <pre className="whitespace-pre-wrap text-sm text-foreground font-mono leading-relaxed">
                  {content}
                </pre>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};