import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NamespaceSelector } from "./NamespaceSelector";
import { RequestsList } from "./RequestsList";
import { ChatInterface, ProcessingStep } from "./ChatInterface";
import { PreviewPane } from "./PreviewPane";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const AgentInterface = () => {
  const [selectedNamespace, setSelectedNamespace] = useState("default");
  const [selectedRequestId, setSelectedRequestId] = useState<string | undefined>();
  const [currentStep, setCurrentStep] = useState<ProcessingStep>('idle');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [previewContent, setPreviewContent] = useState<{
    content: string;
    fileName: string;
    fileType: 'text' | 'markdown';
  } | undefined>();

  const handleRequestSelect = (requestId: string) => {
    setSelectedRequestId(requestId);
    setCurrentStep('idle');
    setPreviewContent(undefined);
  };

  const handleStepChange = (step: ProcessingStep) => {
    setCurrentStep(step);
    
    // Simulate preview content for demo
    if (step === 'output-ready') {
      setPreviewContent({
        content: `Agent Output Preview

This is a sample preview of the generated content. In a real implementation, 
this would show the actual content returned by your AI agent.

The content includes:
- Processing results
- Generated responses
- Analysis outcomes
- Recommendations

You can scroll through this content to review before proceeding 
to the next processing step.`,
        fileName: "agent_output.txt",
        fileType: "text"
      });
    } else if (step === 'complete') {
      setPreviewContent({
        content: `# Final Processing Results

## Overview
The AI agent has completed all processing steps successfully.

## Generated Content
- **Primary Output**: Structured analysis and recommendations
- **Secondary Processing**: Enhanced formatting and organization
- **Quality Assurance**: All checks passed

## Technical Details
\`\`\`
Processing Chain: Complete
Files Generated: 2
Status: Success
Timestamp: ${new Date().toISOString()}
\`\`\`

## Next Steps
1. **Review** all generated content
2. **Download** files as needed
3. **Implement** recommendations
4. **Monitor** results

This markdown file contains the comprehensive results from your AI agent workflow.`,
        fileName: "final_output.md",
        fileType: "markdown"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background text-foreground">
      {/* Top Header */}
      <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden"
            >
              {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
            
            <div className="hidden lg:flex items-center gap-4">
              <h1 className="text-xl font-semibold bg-gradient-primary bg-clip-text text-transparent">
                AI Agent Platform
              </h1>
            </div>
          </div>

          <NamespaceSelector
            value={selectedNamespace}
            onValueChange={setSelectedNamespace}
          />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Sidebar - Requests */}
        <div
          className={cn(
            "bg-card border-r border-border transition-all duration-300",
            isSidebarOpen ? "w-80" : "w-0",
            "lg:relative absolute lg:translate-x-0 z-20 h-full",
            !isSidebarOpen && "lg:w-80 lg:translate-x-0 -translate-x-full"
          )}
        >
          <div className="h-full">
            <RequestsList
              namespace={selectedNamespace}
              selectedRequestId={selectedRequestId}
              onRequestSelect={handleRequestSelect}
            />
          </div>
        </div>

        {/* Center Pane - Chat Interface */}
        <div className="flex-1 bg-background">
          <ChatInterface
            requestId={selectedRequestId}
            onStepChange={handleStepChange}
            currentStep={currentStep}
          />
        </div>

        {/* Right Pane - Preview */}
        <div className="w-96 bg-card border-l border-border hidden xl:block">
          <PreviewPane
            content={previewContent?.content}
            fileName={previewContent?.fileName}
            fileType={previewContent?.fileType}
          />
        </div>
      </div>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-10 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};