import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NamespaceSelector } from "./NamespaceSelector";
import { RequestsList } from "./RequestsList";
import { ChatInterface, ProcessingStep } from "./ChatInterface";
import { PreviewPane } from "./PreviewPane";
import { Menu, X, ChevronDown, ChevronRight, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export const AgentInterface = () => {
  const [selectedNamespace, setSelectedNamespace] = useState("default");
  const [selectedRequestId, setSelectedRequestId] = useState<string | undefined>();
  const [currentStep, setCurrentStep] = useState<ProcessingStep>('idle');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isRequestsExpanded, setIsRequestsExpanded] = useState(true);
  const [isRightPaneVisible, setIsRightPaneVisible] = useState(true);
  const [previewContent, setPreviewContent] = useState<{
    content: string;
    fileName: string;
    fileType: 'text' | 'markdown';
  } | undefined>();
  const [intermediateOutput, setIntermediateOutput] = useState<{
    content: string;
    fileName: string;
    fileType: 'text' | 'markdown';
  } | undefined>();
  
  // Mock request count - in real app, this would come from your data
  const hasRequests = true; // Change this to false to test no-requests state

  const handleRequestSelect = (requestId: string) => {
    setSelectedRequestId(requestId);
    setCurrentStep('idle');
    setPreviewContent(undefined);
  };

  const handleStepChange = (step: ProcessingStep) => {
    setCurrentStep(step);
    
    // Simulate preview content for demo
    if (step === 'output-ready') {
      const outputContent = {
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
        fileType: "text" as const
      };
      
      setPreviewContent(outputContent);
      setIntermediateOutput(outputContent); // Keep intermediate output
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

  const handleCreateRequest = () => {
    // This would typically open a modal or form to create a new request
    // For demo purposes, we'll just select a mock request
    const newRequestId = `new-request-${Date.now()}`;
    setSelectedRequestId(newRequestId);
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
            >
              <Menu className="h-4 w-4" />
            </Button>
            
            <div className="hidden lg:flex items-center gap-4">
              <h1 className="text-xl font-semibold bg-gradient-primary bg-clip-text text-transparent">
                AI Agent Platform
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <NamespaceSelector
              value={selectedNamespace}
              onValueChange={setSelectedNamespace}
            />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsRightPaneVisible(!isRightPaneVisible)}
              className="hidden xl:flex"
            >
              {isRightPaneVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
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
          {isSidebarOpen && (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">Menu</h2>
              </div>
              
              <div className="flex-1 overflow-auto">
                <div className="p-2">
                  <Collapsible open={isRequestsExpanded} onOpenChange={setIsRequestsExpanded}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="w-full justify-between p-3">
                        <span>Requests</span>
                        {isRequestsExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="border-l-2 border-border ml-4">
                        <RequestsList
                          namespace={selectedNamespace}
                          selectedRequestId={selectedRequestId}
                          onRequestSelect={handleRequestSelect}
                        />
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                  
                  {/* Additional menu items can be added here */}
                  <Button variant="ghost" className="w-full justify-start p-3 mt-2">
                    Settings
                  </Button>
                  <Button variant="ghost" className="w-full justify-start p-3">
                    Help
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Center Pane - Chat Interface */}
        <div className="flex-1 bg-background">
          <ChatInterface
            requestId={selectedRequestId}
            hasRequests={hasRequests}
            onStepChange={handleStepChange}
            onCreateRequest={handleCreateRequest}
            currentStep={currentStep}
            intermediateOutput={intermediateOutput}
          />
        </div>

        {/* Right Pane - Preview */}
        {isRightPaneVisible && (
          <div className="w-96 bg-card border-l border-border hidden xl:block">
            <PreviewPane
              content={previewContent?.content}
              fileName={previewContent?.fileName}
              fileType={previewContent?.fileType}
            />
          </div>
        )}
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