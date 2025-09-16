import React, { useState, useRef } from 'react';
import { Scale, Upload, Brain, CheckCircle, AlertTriangle, FileText, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import heroImage from '@/assets/hero-dispute-solver.jpg';

interface AnalysisResult {
  winner: string;
  reasoning: string;
  confidence: number;
}

const DisputeSolver = () => {
  const [yourStory, setYourStory] = useState('');
  const [otherStory, setOtherStory] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    setFiles(selectedFiles);
    
    if (selectedFiles && selectedFiles.length > 0) {
      toast({
        title: "Files uploaded",
        description: `${selectedFiles.length} file(s) selected successfully.`,
      });
    }
  };

  const handleAnalyze = async () => {
    if (!yourStory.trim() || !otherStory.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in both sides of the story before analyzing.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      // Simulate API call to backend
      const formData = new FormData();
      formData.append('yourStory', yourStory);
      formData.append('otherStory', otherStory);
      
      if (files) {
        for (let i = 0; i < files.length; i++) {
          formData.append('evidence', files[i]);
        }
      }

      // For demo purposes, we'll simulate the API response
      setTimeout(() => {
        const mockResult: AnalysisResult = {
          winner: Math.random() > 0.5 ? "Your Side" : "The Other Side",
          reasoning: "Based on the analysis of both narratives and evidence provided, this decision considers the consistency of facts, the strength of supporting evidence, and the logical flow of events. The winning side presents a more coherent and well-supported argument with fewer contradictions.",
          confidence: Math.floor(Math.random() * 30) + 70 // 70-100%
        };
        
        setResult(mockResult);
        setIsAnalyzing(false);
        
        toast({
          title: "Analysis complete",
          description: "The AI has finished analyzing your dispute.",
        });
      }, 3000);

    } catch (err) {
      setError("Sorry, something went wrong. Please try again.");
      setIsAnalyzing(false);
      toast({
        title: "Error",
        description: "Failed to analyze the dispute. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-success';
    if (confidence >= 70) return 'text-warning';
    return 'text-destructive';
  };

  const getWinnerIcon = (winner: string) => {
    return winner === "Your Side" ? CheckCircle : AlertTriangle;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-light to-background">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="AI Dispute Resolution" 
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <Scale className="w-12 h-12 text-primary mr-4" />
              <h1 className="text-4xl md:text-6xl font-bold text-foreground">
                AI Dispute Solver
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Find a fair resolution. Let's hear both sides of the story.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Story Input Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Your Side */}
          <div className="dispute-card animate-fade-in">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 rounded-full bg-primary mr-3"></div>
              <h3 className="text-xl font-semibold text-foreground">Your Side of the Story</h3>
            </div>
            <textarea
              value={yourStory}
              onChange={(e) => setYourStory(e.target.value)}
              className="dispute-input w-full h-48 resize-none"
              placeholder="Describe your perspective of what happened. Include relevant details, timeline, and any important context that supports your position..."
            />
          </div>

          {/* Other Side */}
          <div className="dispute-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 rounded-full bg-muted-foreground mr-3"></div>
              <h3 className="text-xl font-semibold text-foreground">The Other Person's Side</h3>
            </div>
            <textarea
              value={otherStory}
              onChange={(e) => setOtherStory(e.target.value)}
              className="dispute-input w-full h-48 resize-none"
              placeholder="Present the other person's perspective as fairly and accurately as possible. What would they say happened? Include their viewpoint and arguments..."
            />
          </div>
        </div>

        {/* File Upload Section */}
        <div className="dispute-card mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center mb-4">
            <Upload className="w-5 h-5 text-primary mr-3" />
            <h3 className="text-xl font-semibold text-foreground">Upload Evidence</h3>
            <span className="text-sm text-muted-foreground ml-2">(Optional)</span>
          </div>
          
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
            />
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-6 py-3 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose Files
            </button>
            <p className="text-sm text-muted-foreground mt-2">
              Support documents, photos, screenshots, or other evidence
            </p>
          </div>

          {files && files.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-foreground mb-2">Selected Files:</h4>
              <div className="space-y-2">
                {Array.from(files).map((file, index) => (
                  <div key={index} className="flex items-center text-sm text-muted-foreground">
                    <FileText className="w-4 h-4 mr-2" />
                    {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Analyze Button */}
        <div className="text-center mb-12">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !yourStory.trim() || !otherStory.trim()}
            className="dispute-button-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isAnalyzing ? (
              <>
                <Brain className="w-6 h-6 mr-3 animate-pulse-thinking" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="w-6 h-6 mr-3" />
                Analyze & Solve
              </>
            )}
          </button>
        </div>

        {/* Thinking Animation */}
        {isAnalyzing && (
          <div className="dispute-card mb-8 text-center animate-scale-in">
            <div className="thinking-gradient w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin-slow" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">AI is Thinking...</h3>
            <p className="text-muted-foreground">
              Analyzing both perspectives, weighing evidence, and determining the most fair resolution.
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="dispute-card mb-8 border-destructive bg-destructive/5 animate-scale-in">
            <div className="flex items-center text-destructive">
              <AlertTriangle className="w-5 h-5 mr-3" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="dispute-card animate-scale-in">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                {React.createElement(getWinnerIcon(result.winner), {
                  className: `w-12 h-12 ${result.winner === "Your Side" ? "text-success" : "text-warning"} mr-4`
                })}
                <h2 className="text-3xl font-bold text-foreground">Analysis Complete</h2>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">Winner</h3>
                <p className={`text-2xl font-bold ${result.winner === "Your Side" ? "text-success" : "text-warning"}`}>
                  {result.winner}
                </p>
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">Confidence Score</h3>
                <p className={`text-2xl font-bold ${getConfidenceColor(result.confidence)}`}>
                  {result.confidence}%
                </p>
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">Status</h3>
                <p className="text-2xl font-bold text-primary">Resolved</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Detailed Reasoning</h3>
              <div className="bg-muted/50 rounded-lg p-6">
                <p className="text-foreground leading-relaxed">{result.reasoning}</p>
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="text-center mt-16 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            This AI analysis is for informational purposes only and is not legally binding.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DisputeSolver;
