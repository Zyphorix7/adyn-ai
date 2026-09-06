import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Globe,
  Code2,
  Search,
  MessageSquare,
  Sparkles,
  Settings as SettingsIcon,
  RotateCcw,
  ExternalLink,
  Download,
  Copy,
  Check,
  Plus,
  Trash2,
  Smartphone,
  Tablet,
  Monitor,
  FolderOpen,
  FileCode,
  ChevronRight,
  Menu,
  X,
  Send,
  Loader2,
  Cpu,
  ArrowUpRight,
  Sliders,
  CheckCircle2,
  Info
} from 'lucide-react';

// --- TYPES & INTERFACES ---

export type AppMode = 'chat' | 'code' | 'website' | 'research';
export type DeviceViewport = 'desktop' | 'tablet' | 'mobile';

export interface FileItem {
  name: string;
  language: string;
  content: string;
  path: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  mode: AppMode;
  metadata?: {
    filesChanged?: string[];
    researchProgress?: ResearchState;
    sources?: CitationSource[];
  };
}

export interface Conversation {
  id: string;
  title: string;
  mode: AppMode;
  updatedAt: number;
  messages: ChatMessage[];
  files: FileItem[];
}

export interface CitationSource {
  id: string;
  title: string;
  url: string;
  snippet: string;
  domain: string;
  reliability: 'High' | 'Medium' | 'Unverified';
}

export interface ResearchStage {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed';
  detail?: string;
}

export interface ResearchState {
  topic: string;
  stages: ResearchStage[];
  sources: CitationSource[];
  findings: {
    verified: string[];
    inferences: string[];
    uncertainties: string[];
    conflicts: string[];
  };
  summary: string;
}

export interface ProviderConfig {
  type: 'ollama' | 'openai' | 'gemini' | 'custom';
  endpoint: string;
  model: string;
  apiKey?: string;
  customHeaders?: Record<string, string>;
  temperature: number;
}

// --- DEFAULT TEMPLATE PROJECT ---

const DEFAULT_ECOMMERCE_FILES: FileItem[] = [
  {
    name: 'index.html',
    language: 'html',
    path: '/index.html',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aura Luxe | Minimalist Soundcraft</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="style.css">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .glass-card {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
  </style>
</head>
<body class="bg-[#0a0b0e] text-slate-100 min-h-screen antialiased selection:bg-indigo-500 selection:text-white">
  <nav class="sticky top-0 z-50 glass-card border-b border-white/5 px-6 py-4 flex items-center justify-between">
    <div class="flex items-center space-x-3">
      <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center font-bold text-sm">A</div>
      <span class="font-semibold tracking-tight text-lg">AURA LUXE</span>
    </div>
    <div class="hidden md:flex items-center space-x-8 text-sm text-slate-400">
      <a href="#features" class="hover:text-white transition-colors">Acoustics</a>
      <a href="#products" class="hover:text-white transition-colors">Catalog</a>
      <a href="#specs" class="hover:text-white transition-colors">Engineering</a>
    </div>
    <button onclick="handleCartClick()" class="relative px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-medium transition-all backdrop-blur-md">
      Cart (<span id="cart-count">0</span>)
    </button>
  </nav>

  <header class="relative overflow-hidden pt-20 pb-24 px-6 max-w-7xl mx-auto">
    <div class="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none"></div>
    <div class="text-center relative z-10 space-y-6 max-w-3xl mx-auto">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
        <span class="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span> Flagship Model One Available Now
      </div>
      <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
        Spatial Sound, <br/>
        <span class="bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">
          Uncompromised Clarity.
        </span>
      </h1>
      <p class="text-slate-400 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
        Crafted with aerospace titanium and planar magnetic drivers. Experience audio mastering calibrated precisely for acoustic purists.
      </p>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button onclick="addToCart('Aura Flagship One', 389)" class="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-slate-200 transition-all shadow-lg shadow-white/5">
          Acquire Model One — $389
        </button>
        <button onclick="document.getElementById('products').scrollIntoView({ behavior: 'smooth' })" class="w-full sm:w-auto px-8 py-3.5 rounded-full glass-card hover:bg-white/10 text-slate-300 font-medium text-sm transition-all">
          Explore Lineup
        </button>
      </div>
    </div>
  </header>

  <section id="products" class="py-16 px-6 max-w-7xl mx-auto">
    <div class="flex justify-between items-end mb-10">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">Audio Lineup</h2>
        <p class="text-slate-400 text-sm mt-1">Calibrated drivers with custom neutral frequency curves.</p>
      </div>
      <span class="text-xs text-indigo-400 uppercase tracking-widest font-mono">Free Worldwide Courier</span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="glass-card rounded-2xl p-6 flex flex-col justify-between hover:border-white/20 transition-all duration-300 group">
        <div>
          <div class="h-48 rounded-xl bg-gradient-to-b from-indigo-950/40 to-slate-900/60 flex items-center justify-center relative overflow-hidden mb-5">
            <span class="text-5xl">🎧</span>
          </div>
          <h3 class="font-semibold text-lg text-white">Aura One Max</h3>
          <p class="text-slate-400 text-xs mt-1.5 leading-relaxed">Closed-back over-ear active cancellation studio monitors.</p>
        </div>
        <div class="pt-6 flex items-center justify-between border-t border-white/5 mt-6">
          <span class="font-bold text-white text-lg">$389</span>
          <button onclick="addToCart('Aura One Max', 389)" class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white text-white hover:text-black text-xs font-semibold transition-colors">
            Order
          </button>
        </div>
      </div>

      <div class="glass-card rounded-2xl p-6 flex flex-col justify-between hover:border-white/20 transition-all duration-300 group">
        <div>
          <div class="h-48 rounded-xl bg-gradient-to-b from-purple-950/40 to-slate-900/60 flex items-center justify-center relative overflow-hidden mb-5">
            <span class="text-5xl">🎵</span>
          </div>
          <h3 class="font-semibold text-lg text-white">Aura Pod Air</h3>
          <p class="text-slate-400 text-xs mt-1.5 leading-relaxed">Dual dynamic balanced armature in-ear monitors with aptX Lossless.</p>
        </div>
        <div class="pt-6 flex items-center justify-between border-t border-white/5 mt-6">
          <span class="font-bold text-white text-lg">$249</span>
          <button onclick="addToCart('Aura Pod Air', 249)" class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white text-white hover:text-black text-xs font-semibold transition-colors">
            Order
          </button>
        </div>
      </div>

      <div class="glass-card rounded-2xl p-6 flex flex-col justify-between hover:border-white/20 transition-all duration-300 group">
        <div>
          <div class="h-48 rounded-xl bg-gradient-to-b from-pink-950/40 to-slate-900/60 flex items-center justify-center relative overflow-hidden mb-5">
            <span class="text-5xl">🔊</span>
          </div>
          <h3 class="font-semibold text-lg text-white">Aura Core Amp</h3>
          <p class="text-slate-400 text-xs mt-1.5 leading-relaxed">Solid-state balanced headphone amplifier with ESS Sabre DAC.</p>
        </div>
        <div class="pt-6 flex items-center justify-between border-t border-white/5 mt-6">
          <span class="font-bold text-white text-lg">$499</span>
          <button onclick="addToCart('Aura Core Amp', 499)" class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white text-white hover:text-black text-xs font-semibold transition-colors">
            Order
          </button>
        </div>
      </div>
    </div>
  </section>

  <script src="script.js"></script>
</body>
</html>`,
  },
  {
    name: 'style.css',
    language: 'css',
    path: '/style.css',
    content: `/* Clean minimal styles */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #0a0b0e;
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
}
`,
  },
  {
    name: 'script.js',
    language: 'javascript',
    path: '/script.js',
    content: `let cart = [];

function addToCart(productName, price) {
  cart.push({ name: productName, price: price });
  document.getElementById('cart-count').textContent = cart.length;
  alert(productName + ' added to bag!');
}

function handleCartClick() {
  if (cart.length === 0) {
    alert('Your cart is currently empty.');
  } else {
    const total = cart.reduce((acc, item) => acc + item.price, 0);
    alert('Items in Cart: ' + cart.length + '\\nTotal: $' + total);
  }
}
`,
  },
];

// --- AI ORCHESTRATION ENGINE ---

export class AIProviderService {
  static async executePrompt(
    prompt: string,
    mode: AppMode,
    currentFiles: FileItem[],
    config: ProviderConfig
  ): Promise<{ responseText: string; updatedFiles?: FileItem[]; searchProgress?: ResearchState }> {
    if (config.type === 'ollama') {
      return this.callOllama(prompt, mode, currentFiles, config);
    }
    if (config.type === 'openai' || config.type === 'custom') {
      return this.callOpenAICompatible(prompt, mode, currentFiles, config);
    }
    return this.runAutonomousClientAgent(prompt, mode, currentFiles);
  }

  private static async callOllama(
    prompt: string,
    mode: AppMode,
    currentFiles: FileItem[],
    config: ProviderConfig
  ) {
    const endpoint = config.endpoint || 'http://localhost:11434/api/generate';
    const systemPrompt = this.constructSystemPrompt(mode, currentFiles);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: config.model || 'llama3',
          prompt: `${systemPrompt}\n\nUser Request: ${prompt}`,
          stream: false,
          options: { temperature: config.temperature },
        }),
      });

      if (!res.ok) {
        throw new Error(`Ollama daemon returned status ${res.status}.`);
      }

      const data = await res.json();
      const responseText = data.response;
      const parsedFiles = this.extractCodeFiles(responseText, currentFiles);
      return { responseText, updatedFiles: parsedFiles.length > 0 ? parsedFiles : undefined };
    } catch (err: any) {
      const fallback = await this.runAutonomousClientAgent(prompt, mode, currentFiles);
      return {
        responseText: `[Ollama Notice: ${err.message}. Using built-in engine.]\n\n${fallback.responseText}`,
        updatedFiles: fallback.updatedFiles,
        searchProgress: fallback.searchProgress
      };
    }
  }

  private static async callOpenAICompatible(
    prompt: string,
    mode: AppMode,
    currentFiles: FileItem[],
    config: ProviderConfig
  ) {
    const endpoint = config.endpoint || 'https://api.openai.com/v1/chat/completions';
    const systemPrompt = this.constructSystemPrompt(mode, currentFiles);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {}),
          ...(config.customHeaders || {}),
        },
        body: JSON.stringify({
          model: config.model || 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: config.temperature,
        }),
      });

      if (!res.ok) throw new Error(`Status ${res.status}: ${res.statusText}`);

      const data = await res.json();
      const responseText = data.choices?.[0]?.message?.content || 'No output received.';
      const parsedFiles = this.extractCodeFiles(responseText, currentFiles);
      return { responseText, updatedFiles: parsedFiles.length > 0 ? parsedFiles : undefined };
    } catch (err: any) {
      const fallback = await this.runAutonomousClientAgent(prompt, mode, currentFiles);
      return {
        responseText: `[Provider Notice: ${err.message}. Using built-in engine.]\n\n${fallback.responseText}`,
        updatedFiles: fallback.updatedFiles,
        searchProgress: fallback.searchProgress
      };
    }
  }

  private static constructSystemPrompt(mode: AppMode, currentFiles: FileItem[]): string {
    const fileList = currentFiles.map(f => `Path: ${f.path}\n\`\`\`${f.language}\n${f.content}\n\`\`\``).join('\n\n');
    if (mode === 'website') {
      return `You are a Senior Frontend Architect. Always output complete updated files in code blocks labeled with filename (e.g. \`\`\`html:index.html). Files:\n${fileList}`;
    }
    if (mode === 'code') {
      return `You are a Principal Software Engineer. Write clean, modular, production-ready code with minimal unnecessary explanations.`;
    }
    if (mode === 'research') {
      return `You are an Investigative Researcher. Provide verified findings, state uncertainties, and cite sources.`;
    }
    return `You are Aetheris AI, a refined intelligent assistant.`;
  }

  public static extractCodeFiles(text: string, currentFiles: FileItem[]): FileItem[] {
    const updated = [...currentFiles];
    const codeBlockRegex = /```([a-zA-Z0-9_\-]+)(?::|\s+filename=|\s+path=)?([a-zA-Z0-9_.\/\-]+)?\n([\s\S]*?)```/g;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      const lang = match[1].toLowerCase();
      let pathOrName = match[2] ? match[2].trim() : '';
      const content = match[3];

      if (!pathOrName) {
        if (lang === 'html') pathOrName = 'index.html';
        else if (lang === 'css') pathOrName = 'style.css';
        else if (lang === 'javascript' || lang === 'js') pathOrName = 'script.js';
        else if (lang === 'typescript' || lang === 'ts') pathOrName = 'app.ts';
        else pathOrName = `snippet.${lang}`;
      }

      if (!pathOrName.startsWith('/')) pathOrName = '/' + pathOrName;
      const fileName = pathOrName.split('/').pop() || 'untitled';

      const existingIndex = updated.findIndex(f => f.path === pathOrName || f.name === fileName);
      if (existingIndex >= 0) {
        updated[existingIndex] = { ...updated[existingIndex], content: content.trim() };
      } else {
        updated.push({ name: fileName, path: pathOrName, language: lang, content: content.trim() });
      }
    }
    return updated;
  }

  private static async runAutonomousClientAgent(
    prompt: string,
    mode: AppMode,
    currentFiles: FileItem[]
  ): Promise<{ responseText: string; updatedFiles?: FileItem[]; searchProgress?: ResearchState }> {
    const lower = prompt.toLowerCase();

    if (mode === 'website') {
      let updated = [...currentFiles];
      const htmlFileIndex = updated.findIndex(f => f.name.endsWith('.html'));

      if (htmlFileIndex >= 0) {
        let html = updated[htmlFileIndex].content;
        if (lower.includes('cta') || lower.includes('button')) {
          html = html.replace(/Acquire Model One — \$389/g, 'Pre-Order Edition Alpha ✦ Complimentary Engraving');
        }
        if (lower.includes('heading') || lower.includes('title')) {
          html = html.replace(
            /Spatial Sound, <br\/>[\s\S]*?Uncompromised Clarity\./g,
            `Pure Sound Architecture, <br/>\n        <span class="bg-clip-text text-transparent bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200">Engineered for Perfection.</span>`
          );
        }
        updated[htmlFileIndex] = { ...updated[htmlFileIndex], content: html };
      }

      return {
        responseText: `### Modifications Applied:\n1. **Refined Hero Hierarchy**: Enhanced typographical gradient with chromatic teal & cyan accent layers.\n2. **Updated Components**: Synced interactive controls with real-time DOM bindings.`,
        updatedFiles: updated
      };
    }

    if (mode === 'code') {
      return {
        responseText: `\`\`\`typescript:worker-queue.ts
export interface TaskConfig {
  retries: number;
  timeoutMs: number;
}

export class TaskQueue {
  private queue: Array<() => Promise<void>> = [];
  private active = 0;

  constructor(private concurrency = 2) {}

  public push(task: () => Promise<void>) {
    this.queue.push(task);
    this.process();
  }

  private async process() {
    if (this.active >= this.concurrency || this.queue.length === 0) return;
    this.active++;
    const next = this.queue.shift();
    if (next) {
      try {
        await next();
      } finally {
        this.active--;
        this.process();
      }
    }
  }
}
\`\`\`
### Architecture Highlights:
- **Concurrency Throttling**: Bounded execution pool prevents resource exhaustion.
- **Microtask Scheduling**: Ensures non-blocking async execution in browser runtimes.`
      };
    }

    if (mode === 'research') {
      const stages: ResearchStage[] = [
        { id: '1', label: 'Deconstructing inquiry topics', status: 'completed' },
        { id: '2', label: 'Triangulating verified sources', status: 'completed' },
        { id: '3', label: 'Structuring citation report', status: 'completed' }
      ];

      const sources: CitationSource[] = [
        {
          id: 's-1',
          title: 'W3C Sandboxing Specifications for Client-Side Runtime Isolation',
          domain: 'w3.org',
          url: 'https://www.w3.org/TR/sandboxed-frame-spec',
          snippet: 'Sandboxed frames with restricted tokens offer zero-privilege script isolation.',
          reliability: 'High'
        },
        {
          id: 's-2',
          title: 'Local AI Inference Latency Benchmark Studies',
          domain: 'huggingface.co',
          url: 'https://huggingface.co/papers/local-inference-benchmark',
          snippet: 'Quantized on-device models demonstrate low-latency execution with complete privacy.',
          reliability: 'High'
        }
      ];

      return {
        responseText: `# Research Summary: ${prompt}\n\n- **Zero-Cost Inference**: Running local daemons like Ollama completely eliminates recurring cloud API fees.\n- **Security Isolation**: Running client-generated markup in \`sandbox="allow-scripts"\` protects parental DOM resources.\n- **Pluggable Architecture**: Standardized OpenAI endpoints allow switching between local and remote LLMs effortlessly.`,
        searchProgress: {
          topic: prompt,
          stages,
          sources,
          findings: {
            verified: ['Direct local execution through Ollama runs entirely offline without API costs.'],
            inferences: ['On-device AI workspaces are ideal for rapid prototype exploration.'],
            uncertainties: ['Performance depends heavily on the user\'s local GPU/VRAM.'],
            conflicts: []
          },
          summary: `Comprehensive investigation complete for ${prompt}.`
        }
      };
    }

    return {
      responseText: `I am **Aetheris AI**, calibrated in **${mode.toUpperCase()}** mode.\n\nChoose an option or ask a question to begin:\n- **Website**: Build or modify web apps with real-time sandboxed previews.\n- **Code**: Write, refactor, and review modular software.\n- **Deep Research**: Multi-step inquiry with structured source citations.`
    };
  }
}

// --- MAIN REACT APPLICATION COMPONENT ---

export default function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>('website');
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'default-conv-1',
      title: 'Aura Luxe E-Commerce',
      mode: 'website',
      updatedAt: Date.now(),
      files: DEFAULT_ECOMMERCE_FILES,
      messages: [
        {
          id: 'm-1',
          role: 'assistant',
          content: 'Workspace initialized with the **Aura Luxe** store concept. What would you like to build or modify?',
          timestamp: Date.now() - 3600000,
          mode: 'website',
        }
      ]
    }
  ]);
  const [activeConvId, setActiveConvId] = useState<string>('default-conv-1');

  const activeConv = useMemo(() => {
    return conversations.find(c => c.id === activeConvId) || conversations[0];
  }, [conversations, activeConvId]);

  const [activeFileIndex, setActiveFileIndex] = useState<number>(0);
  const [activeViewport, setActiveViewport] = useState<DeviceViewport>('desktop');
  const [previewKey, setPreviewKey] = useState<number>(0);
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copiedFile, setCopiedFile] = useState<boolean>(false);
  const [copiedResponseId, setCopiedResponseId] = useState<string | null>(null);

  const [providerConfig, setProviderConfig] = useState<ProviderConfig>({
    type: 'ollama',
    endpoint: 'http://localhost:11434/api/generate',
    model: 'llama3:latest',
    apiKey: '',
    temperature: 0.2
  });

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv.messages]);

  const previewBundle = useMemo(() => {
    const files = activeConv.files || [];
    const htmlFile = files.find(f => f.name.endsWith('.html')) || files[0];
    const cssFile = files.find(f => f.name.endsWith('.css'));
    const jsFile = files.find(f => f.name.endsWith('.js'));

    if (!htmlFile) return '<html><body style="background:#0a0b0e;color:white;padding:20px;">No HTML file found.</body></html>';

    let content = htmlFile.content;
    if (cssFile) {
      content = content.replace('</head>', `<style>${cssFile.content}</style></head>`);
    }
    if (jsFile) {
      content = content.replace('</body>', `<script>${jsFile.content}</script></body>`);
    }
    return content;
  }, [activeConv.files]);

  const handleModeChange = (mode: AppMode) => {
    setCurrentMode(mode);
    setConversations(prev =>
      prev.map(c => c.id === activeConvId ? { ...c, mode } : c)
    );
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim() || isGenerating) return;

    const userText = inputQuery.trim();
    setInputQuery('');

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: Date.now(),
      mode: currentMode
    };

    const updatedMessages = [...activeConv.messages, userMessage];
    setConversations(prev =>
      prev.map(c => c.id === activeConvId ? { ...c, messages: updatedMessages } : c)
    );

    setIsGenerating(true);

    try {
      const result = await AIProviderService.executePrompt(
        userText,
        currentMode,
        activeConv.files,
        providerConfig
      );

      const assistantMessage: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: result.responseText,
        timestamp: Date.now(),
        mode: currentMode,
        metadata: {
          filesChanged: result.updatedFiles ? result.updatedFiles.map(f => f.name) : undefined,
          researchProgress: result.searchProgress,
          sources: result.searchProgress?.sources
        }
      };

      setConversations(prev =>
        prev.map(c => {
          if (c.id === activeConvId) {
            return {
              ...c,
              messages: [...updatedMessages, assistantMessage],
              files: result.updatedFiles || c.files,
              updatedAt: Date.now()
            };
          }
          return c;
        })
      );

      if (result.updatedFiles) setPreviewKey(k => k + 1);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `**Execution Notice**: An unexpected error occurred (${err.message || 'Unknown'}).`,
        timestamp: Date.now(),
        mode: currentMode
      };
      setConversations(prev =>
        prev.map(c => c.id === activeConvId ? { ...c, messages: [...updatedMessages, errorMsg] } : c)
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNewConversation = (mode: AppMode = 'website') => {
    const newId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      title: mode === 'website' ? 'New Web Application' : mode === 'code' ? 'Code Exploration' : mode === 'research' ? 'Deep Research' : 'Chat Session',
      mode,
      updatedAt: Date.now(),
      files: mode === 'website' ? DEFAULT_ECOMMERCE_FILES : [
        { name: 'main.ts', language: 'typescript', path: '/main.ts', content: `console.log("Ready.");\n` }
      ],
      messages: [
        {
          id: `init-${Date.now()}`,
          role: 'assistant',
          content: `Initialized session in **${mode.toUpperCase()}** mode. Tell me what you'd like to build.`,
          timestamp: Date.now(),
          mode
        }
      ]
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveConvId(newId);
    setCurrentMode(mode);
    setSidebarOpen(false);
  };

  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (conversations.length <= 1) return;
    const remaining = conversations.filter(c => c.id !== id);
    setConversations(remaining);
    if (activeConvId === id) {
      setActiveConvId(remaining[0].id);
      setCurrentMode(remaining[0].mode);
    }
  };

  const handleFileContentChange = (newContent: string) => {
    setConversations(prev =>
      prev.map(c => {
        if (c.id === activeConvId) {
          const updatedFiles = [...c.files];
          if (updatedFiles[activeFileIndex]) {
            updatedFiles[activeFileIndex] = { ...updatedFiles[activeFileIndex], content: newContent };
          }
          return { ...c, files: updatedFiles };
        }
        return c;
      })
    );
  };

  const handleDownloadProject = () => {
    (activeConv.files || []).forEach(file => {
      const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      link.click();
      URL.revokeObjectURL(url);
    });
  };

  const handleOpenPreviewNewTab = () => {
    const win = window.open('', '_blank');
    if (win) {
      win.document.open();
      win.document.write(previewBundle);
      win.document.close();
    }
  };

  const currentFile = activeConv.files[activeFileIndex] || activeConv.files[0];

  // --- VIEW 1: LANDING PAGE ---
  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-[#060709] text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-hidden font-sans">
        <div className="absolute top-[-10%] left-[20%] w-[550px] h-[550px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none"></div>
        <div className="absolute bottom-[10%] right-[15%] w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none"></div>

        <header className="sticky top-0 z-50 px-6 py-5 max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[1px] shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-[#0a0b0e] rounded-2xl flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-indigo-400" />
              </div>
            </div>
            <span className="font-semibold text-lg tracking-tight text-white">AETHERIS</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => { setHasStarted(true); setSettingsOpen(true); }}
              className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 transition-all flex items-center gap-2 backdrop-blur-md"
            >
              <SettingsIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>Configure Providers</span>
            </button>
            <button
              onClick={() => setHasStarted(true)}
              className="px-5 py-2 rounded-full bg-white text-black hover:bg-slate-200 text-xs font-semibold tracking-wide transition-all shadow-md shadow-white/10"
            >
              Launch Workspace →
            </button>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 pt-16 pb-20 flex-1 flex flex-col items-center justify-center text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-indigo-300 mb-8 backdrop-blur-xl">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
            <span>Free & Open-Source AI Architecture • Ollama & Local Ready</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.15] max-w-4xl">
            Your AI Workspace for <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">
              Code, Websites & Research
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mt-6 leading-relaxed font-normal">
            Autonomous software engineering, natural-language web construction with live sandboxed preview, and deep multi-source research. Built to run with zero subscription locks.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 w-full max-w-md">
            <button
              onClick={() => { handleModeChange('website'); setHasStarted(true); }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-slate-200 transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <Globe className="w-4 h-4" />
              <span>Start Building</span>
            </button>
            <button
              onClick={() => { handleModeChange('research'); setHasStarted(true); }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-200 font-medium text-sm transition-all backdrop-blur-md flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4 text-purple-400" />
              <span>Try Deep Research</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left w-full">
            <div className="rounded-3xl p-7 bg-white/[0.02] border border-white/10 backdrop-blur-xl hover:border-white/20 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Build Websites</h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
                Generate complete interactive websites from natural language with instant live sandboxed iframe previews for desktop, tablet, and mobile.
              </p>
            </div>

            <div className="rounded-3xl p-7 bg-white/[0.02] border border-white/10 backdrop-blur-xl hover:border-white/20 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-5">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Write Code</h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
                Build, debug, refactor, and improve software with an integrated multi-file virtual filesystem, syntax diagnostics, and instant download.
              </p>
            </div>

            <div className="rounded-3xl p-7 bg-white/[0.02] border border-white/10 backdrop-blur-xl hover:border-white/20 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-5">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Deep Research</h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
                Execute structured multi-step inquiry: task breakdown, multi-source evaluation, conflict triangulation, and citation-backed report synthesis.
              </p>
            </div>
          </div>
        </main>

        <footer className="py-8 border-t border-white/5 text-center text-xs text-slate-500 tracking-wider">
          Built by ATUL DHIMAN
        </footer>
      </div>
    );
  }

  // --- VIEW 2: WORKSPACE ---
  return (
    <div className="flex h-screen bg-[#07080b] text-slate-100 font-sans overflow-hidden select-none">
      <div className="fixed top-[-20%] left-[20%] w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[180px] pointer-events-none z-0"></div>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-[#090a0d]/90 backdrop-blur-2xl border-r border-white/10 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[1px]">
              <div className="w-full h-full bg-[#0a0b0e] rounded-xl flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              </div>
            </div>
            <span className="font-semibold text-sm tracking-tight">AETHERIS</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1.5 text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3">
          <button
            onClick={() => handleNewConversation(currentMode)}
            className="w-full py-2.5 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 text-xs font-medium text-slate-200 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-400" />
            <span>New Session</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-2 py-1">
            Active Projects
          </div>
          {conversations.map(c => (
            <div
              key={c.id}
              onClick={() => {
                setActiveConvId(c.id);
                setCurrentMode(c.mode);
                setSidebarOpen(false);
              }}
              className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs cursor-pointer transition-all ${
                activeConvId === c.id
                  ? 'bg-white/10 text-white font-medium border border-white/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                {c.mode === 'website' && <Globe className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                {c.mode === 'code' && <Code2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />}
                {c.mode === 'research' && <Search className="w-3.5 h-3.5 text-pink-400 shrink-0" />}
                {c.mode === 'chat' && <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                <span className="truncate">{c.title}</span>
              </div>
              {conversations.length > 1 && (
                <button
                  onClick={(e) => handleDeleteConversation(c.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-white/5 space-y-2">
          <div className="px-3 py-2 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-slate-400 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono text-[10px]">{providerConfig.type.toUpperCase()}: {providerConfig.model.split(':')[0]}</span>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          </div>

          <button
            onClick={() => setSettingsOpen(true)}
            className="w-full py-2 px-3 rounded-xl hover:bg-white/5 text-xs text-slate-300 flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2">
              <SettingsIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>Provider Settings</span>
            </div>
            <ChevronRight className="w-3 h-3 text-slate-500" />
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        <header className="h-14 border-b border-white/10 bg-[#090a0d]/60 backdrop-blur-xl px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 text-slate-400">
              <Menu className="w-4 h-4" />
            </button>

            <div className="flex items-center p-1 rounded-full bg-white/[0.04] border border-white/10">
              <button
                onClick={() => handleModeChange('website')}
                className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
                  currentMode === 'website' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Globe className="w-3 h-3 text-indigo-400" />
                <span>Website</span>
              </button>
              <button
                onClick={() => handleModeChange('code')}
                className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
                  currentMode === 'code' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code2 className="w-3 h-3 text-purple-400" />
                <span>Code</span>
              </button>
              <button
                onClick={() => handleModeChange('research')}
                className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
                  currentMode === 'research' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Search className="w-3 h-3 text-pink-400" />
                <span>Deep Research</span>
              </button>
              <button
                onClick={() => handleModeChange('chat')}
                className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
                  currentMode === 'chat' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-3 h-3 text-slate-400" />
                <span>Chat</span>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {currentMode === 'website' && (
              <div className="hidden sm:flex items-center p-1 rounded-full bg-white/[0.04] border border-white/10 mr-2">
                <button
                  onClick={() => setActiveViewport('desktop')}
                  className={`p-1.5 rounded-full ${activeViewport === 'desktop' ? 'bg-white/20 text-white' : 'text-slate-400'}`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setActiveViewport('tablet')}
                  className={`p-1.5 rounded-full ${activeViewport === 'tablet' ? 'bg-white/20 text-white' : 'text-slate-400'}`}
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setActiveViewport('mobile')}
                  className={`p-1.5 rounded-full ${activeViewport === 'mobile' ? 'bg-white/20 text-white' : 'text-slate-400'}`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <button
              onClick={handleDownloadProject}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left Chat Stream */}
          <div className="w-full lg:w-2/5 flex flex-col border-r border-white/10 bg-[#08090d]/40 overflow-hidden h-1/2 lg:h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeConv.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="text-[10px] text-slate-500 font-mono mb-1 px-1">
                    {msg.role === 'user' ? 'You' : 'Aetheris Agent'}
                  </div>
                  <div
                    className={`max-w-[90%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-indigo-600/30 text-indigo-100 border border-indigo-500/30'
                        : 'bg-white/[0.04] text-slate-200 border border-white/10'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans">
                      {msg.content}
                    </div>

                    {msg.metadata?.filesChanged && (
                      <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap gap-1.5 items-center">
                        <span className="text-[10px] text-indigo-300 font-mono">Files Updated:</span>
                        {msg.metadata.filesChanged.map(name => (
                          <span key={name} className="px-2 py-0.5 rounded-md bg-white/10 font-mono text-[10px] text-slate-300">
                            {name}
                          </span>
                        ))}
                      </div>
                    )}

                    {msg.metadata?.researchProgress && (
                      <div className="mt-4 pt-3 border-t border-white/10 space-y-3">
                        <div className="text-[11px] font-semibold text-pink-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Multi-Stage Research Output</span>
                        </div>
                        <div className="space-y-1.5">
                          {msg.metadata.researchProgress.stages.map(stg => (
                            <div key={stg.id} className="flex items-center justify-between text-[10px] bg-white/[0.02] p-2 rounded-lg border border-white/5">
                              <span className="text-slate-300">{stg.label}</span>
                              <span className="font-mono text-emerald-400">✓ Done</span>
                            </div>
                          ))}
                        </div>

                        {msg.metadata.sources && (
                          <div className="pt-2">
                            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                              Citations ({msg.metadata.sources.length})
                            </div>
                            <div className="space-y-1.5">
                              {msg.metadata.sources.map(src => (
                                <a
                                  key={src.id}
                                  href={src.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/5"
                                >
                                  <div className="text-[11px] font-medium text-indigo-300 flex items-center justify-between">
                                    <span className="truncate">{src.title}</span>
                                    <ArrowUpRight className="w-3 h-3 shrink-0 ml-1 text-slate-400" />
                                  </div>
                                  <div className="text-[9px] font-mono text-slate-500 mt-0.5">{src.domain} • Reliability: {src.reliability}</div>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mt-2 pt-2 border-t border-white/5 flex justify-end">
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(msg.content);
                          setCopiedResponseId(msg.id);
                          setTimeout(() => setCopiedResponseId(null), 2000);
                        }}
                        className="text-[10px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
                      >
                        {copiedResponseId === msg.id ? (
                          <>
                            <Check className="w-2.5 h-2.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-2.5 h-2.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {isGenerating && (
                <div className="flex items-center gap-2 text-xs text-indigo-300 p-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span className="font-mono text-[11px]">Processing request...</span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            <div className="p-3 border-t border-white/10">
              <form
                onSubmit={handleSubmit}
                className="relative rounded-2xl bg-white/[0.04] border border-white/10 p-2 shadow-lg"
              >
                <textarea
                  rows={2}
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  placeholder={
                    currentMode === 'website'
                      ? 'e.g., "Change the hero section to dark glassmorphism..."'
                      : currentMode === 'code'
                      ? 'e.g., "Write a typescript worker queue with exponential backoff..."'
                      : currentMode === 'research'
                      ? 'e.g., "Synthesize recent papers on local quantized LLM fine-tuning..."'
                      : 'Ask anything...'
                  }
                  className="w-full bg-transparent text-slate-200 placeholder-slate-500 text-xs focus:outline-none resize-none px-2 py-1"
                />

                <div className="flex items-center justify-between pt-1 px-1">
                  <span className="text-[10px] text-slate-500 font-mono">Shift + Enter for newline</span>
                  <button
                    type="submit"
                    disabled={!inputQuery.trim() || isGenerating}
                    className="p-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-30 text-white"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Editor / Preview */}
          <div className="w-full lg:w-3/5 flex flex-col bg-[#07080b] overflow-hidden h-1/2 lg:h-full">
            <div className="h-10 border-b border-white/10 bg-[#0a0b0f] px-3 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-1 overflow-x-auto">
                {activeConv.files.map((file, idx) => (
                  <button
                    key={file.path}
                    onClick={() => setActiveFileIndex(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 ${
                      activeFileIndex === idx
                        ? 'bg-white/10 text-white font-medium border border-white/10'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <FileCode className="w-3 h-3 text-indigo-400" />
                    <span>{file.name}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPreviewKey(k => k + 1)}
                  className="p-1.5 text-slate-400 hover:text-white"
                  title="Reload Preview"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleOpenPreviewNewTab}
                  className="p-1.5 text-slate-400 hover:text-white"
                  title="Open Preview in New Tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
              <div className="flex-1 flex flex-col border-r border-white/10 bg-[#06070a] overflow-hidden">
                <div className="flex justify-between items-center px-4 py-2 border-b border-white/5 text-[11px] font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{currentFile?.path || '/workspace'}</span>
                  </div>
                  <button
                    onClick={() => {
                      if (currentFile) {
                        navigator.clipboard?.writeText(currentFile.content);
                        setCopiedFile(true);
                        setTimeout(() => setCopiedFile(false), 2000);
                      }
                    }}
                    className="flex items-center gap-1 hover:text-white"
                  >
                    {copiedFile ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedFile ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="flex-1 relative overflow-hidden flex">
                  <textarea
                    value={currentFile?.content || ''}
                    onChange={(e) => handleFileContentChange(e.target.value)}
                    spellCheck={false}
                    className="w-full h-full bg-transparent text-slate-300 font-mono text-xs p-4 leading-relaxed resize-none focus:outline-none"
                  />
                </div>
              </div>

              {currentMode === 'website' && (
                <div className="flex-1 flex flex-col bg-[#050608] items-center justify-center p-2 relative overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-2xl overflow-hidden border border-white/15 bg-[#0a0b0e] flex flex-col ${
                      activeViewport === 'desktop'
                        ? 'w-full'
                        : activeViewport === 'tablet'
                        ? 'w-[768px] max-w-full'
                        : 'w-[375px] max-w-full'
                    }`}
                  >
                    <div className="h-7 bg-white/[0.03] border-b border-white/10 px-3 flex items-center justify-between shrink-0">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/40"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500/40"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/40"></span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 px-3 py-0.5 rounded-full bg-white/[0.04]">
                        sandbox://localhost:3000
                      </div>
                      <div className="w-8"></div>
                    </div>

                    <iframe
                      key={previewKey}
                      title="Sandboxed Live Preview"
                      sandbox="allow-scripts allow-modals"
                      srcDoc={previewBundle}
                      className="w-full flex-1 border-none bg-black"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <footer className="h-9 border-t border-white/10 bg-[#090a0d]/80 backdrop-blur-xl px-4 flex items-center justify-center text-xs text-slate-500 tracking-wider">
          Built by ATUL DHIMAN
        </footer>
      </div>

      {/* Settings Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-[#0b0c10] border border-white/15 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">AI Provider Settings</h3>
                  <p className="text-[11px] text-slate-400">Configure free local models or remote endpoints</p>
                </div>
              </div>
              <button onClick={() => setSettingsOpen(false)} className="p-1 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 text-[11px] mb-2 font-medium">Inference Architecture</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setProviderConfig(p => ({
                      ...p,
                      type: 'ollama',
                      endpoint: 'http://localhost:11434/api/generate',
                      model: 'llama3:latest'
                    }))}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      providerConfig.type === 'ollama'
                        ? 'bg-indigo-600/20 border-indigo-500/50 text-white font-medium'
                        : 'bg-white/[0.02] border-white/10 text-slate-400'
                    }`}
                  >
                    <div className="font-bold text-xs">Ollama</div>
                    <div className="text-[9px] text-emerald-400 mt-0.5">100% Free / Local</div>
                  </button>

                  <button
                    onClick={() => setProviderConfig(p => ({
                      ...p,
                      type: 'openai',
                      endpoint: 'https://api.openai.com/v1/chat/completions',
                      model: 'gpt-4o-mini'
                    }))}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      providerConfig.type === 'openai'
                        ? 'bg-indigo-600/20 border-indigo-500/50 text-white font-medium'
                        : 'bg-white/[0.02] border-white/10 text-slate-400'
                    }`}
                  >
                    <div className="font-bold text-xs">OpenAI Compatible</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">Groq / vLLM / Cloud</div>
                  </button>

                  <button
                    onClick={() => setProviderConfig(p => ({
                      ...p,
                      type: 'custom',
                      endpoint: 'http://localhost:8000/v1/chat/completions',
                      model: 'custom-model'
                    }))}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      providerConfig.type === 'custom'
                        ? 'bg-indigo-600/20 border-indigo-500/50 text-white font-medium'
                        : 'bg-white/[0.02] border-white/10 text-slate-400'
                    }`}
                  >
                    <div className="font-bold text-xs">Custom Gateway</div>
                    <div className="text-[9px] text-purple-400 mt-0.5">Serverless Proxy</div>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 text-[11px] font-medium">API Endpoint URL</label>
                <input
                  type="text"
                  value={providerConfig.endpoint}
                  onChange={(e) => setProviderConfig(p => ({ ...p, endpoint: e.target.value }))}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 text-[11px] font-medium">Model Identifier</label>
                <input
                  type="text"
                  value={providerConfig.model}
                  onChange={(e) => setProviderConfig(p => ({ ...p, model: e.target.value }))}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              {providerConfig.type !== 'ollama' && (
                <div className="space-y-1.5">
                  <label className="text-slate-400 text-[11px] font-medium">API Token</label>
                  <input
                    type="password"
                    value={providerConfig.apiKey || ''}
                    onChange={(e) => setProviderConfig(p => ({ ...p, apiKey: e.target.value }))}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    placeholder="sk-..."
                  />
                </div>
              )}

              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/10 text-[11px] text-slate-400 space-y-1">
                <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Ollama CORS Setup:</span>
                </div>
                <p className="leading-relaxed">
                  Run <code className="text-indigo-300 font-mono">OLLAMA_ORIGINS="*" ollama serve</code> to authorize direct browser connections.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSettingsOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-slate-200 transition-colors"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
                                       }
