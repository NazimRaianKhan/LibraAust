<?php

namespace App\Http\Controllers;

use App\Models\Publication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatbotController extends Controller
{
    private $geminiApiKey;
    private $geminiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

    public function __construct()
    {
        $this->geminiApiKey = "AIzaSyBCXZ_nPrwwfXqYS9VQUQC_zAWo39KeCL0";
    }

    public function chat(Request $request)
    {
        Log::info('Chatbot request received', ['message' => $request->input('message')]);

        $userMessage = $request->input('message');
       
        if (!$userMessage) {
            Log::warning('No message provided in request');
            return response()->json(['error' => 'Message is required'], 400);
        }

        if (!$this->geminiApiKey) {
            Log::error('Gemini API key not configured');
            return response()->json(['error' => 'AI service not configured'], 500);
        }

        try {
            // Check if user is asking for book recommendations
            $isBookRequest = $this->detectBookRequest($userMessage);
            $systemPrompt = $this->getSystemPrompt();
            $contextData = "";

            // If asking for books, get relevant publications
            if ($isBookRequest) {
                try {
                    $books = $this->getRelevantBooks($userMessage);
                    if (!empty($books)) {
                        $contextData = "\n\nAvailable books in our library:\n" . $this->formatBooksForAI($books);
                    } else {
                        // Get some general books if no specific matches
                        $generalBooks = $this->getGeneralBooks($userMessage);
                        if (!empty($generalBooks)) {
                            $contextData = "\n\nHere are some available books from our library:\n" . $this->formatBooksForAI($generalBooks);
                        }
                    }
                } catch (\Exception $e) {
                    Log::warning('Database query failed', ['error' => $e->getMessage()]);
                    $contextData = "\n\nNote: Unable to fetch specific book recommendations at the moment.";
                }
            }

            $fullPrompt = $systemPrompt . $contextData . "\n\nUser: " . $userMessage . "\n\nAssistant:";

            Log::info('Calling Gemini API', ['prompt_length' => strlen($fullPrompt)]);

            $response = Http::timeout(30)->post($this->geminiEndpoint . '?key=' . $this->geminiApiKey, [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $fullPrompt]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => 0.7,
                    'topK' => 40,
                    'topP' => 0.95,
                    'maxOutputTokens' => 1024,
                ]
            ]);

            if ($response->successful()) {
                $data = $response->json();
                Log::info('Gemini API response received', ['status' => $response->status()]);
               
                $aiResponse = $data['candidates'][0]['content']['parts'][0]['text'] ?? 'Sorry, I could not process your request.';
               
                return response()->json([
                    'response' => trim($aiResponse)
                ]);
            } else {
                Log::error('Gemini API failed', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                return response()->json(['error' => 'AI service unavailable'], 500);
            }

        } catch (\Exception $e) {
            Log::error('Chatbot error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            return response()->json(['error' => 'Something went wrong: ' . $e->getMessage()], 500);
        }
    }

    private function getSystemPrompt()
    {
        return "You are AUST Library Assistant - a quick, helpful AI for students at Ahsanullah University of Science and Technology.

RESPONSE STYLE:
- Give DIRECT, IMMEDIATE answers - no unnecessary questions
- Be concise and helpful
- When recommending books, show only 2-3 most relevant ones
- If someone asks for department books, ask ONE question about their specific interest area first
- Don't overwhelm with too many book suggestions

TOPICS YOU HANDLE:
- Library hours: 8:00 AM to 6:00 PM
- Book recommendations for departments: CSE, EEE, MPE, Textile, Architecture, Civil
- Academic resources and study help
- Library location: AUST Campus, Tejgaon, Dhaka
- Book locations and shelf information
- Research materials and thesis help

BOOK RECOMMENDATION STRATEGY:
- When someone says 'I need CSE books' or similar, ask: 'What specific area are you interested in? (e.g., programming, algorithms, databases, etc.)'
- Then show 2-3 most relevant books with shelf locations
- If no books match their interest, say 'Sorry, we don't have books on that specific topic' and suggest 2-3 related alternatives
- ALWAYS include shelf location when available
- Keep recommendations focused and limited

WHAT YOU DON'T DISCUSS:
- Non-academic topics (redirect politely to library matters)
- Personal advice unrelated to studies
- Entertainment or current events

Be helpful but focused - quality over quantity in recommendations!";
    }

    private function detectBookRequest($message)
    {
        $bookKeywords = [
            'book', 'books', 'recommend', 'recommendation', 'suggestions', 'suggest',
            'read', 'study', 'thesis', 'research', 'department', 'dept', 
            'CSE', 'cse', 'EEE', 'eee', 'MPE', 'mpe', 'Textile', 'textile', 
            'Architecture', 'architecture', 'Civil', 'civil', 'programming', 
            'engineering', 'mathematics', 'physics', 'computer', 'software',
            'where is', 'location', 'shelf', 'find', 'located'
        ];
       
        foreach ($bookKeywords as $keyword) {
            if (stripos($message, $keyword) !== false) {
                return true;
            }
        }
        return false;
    }

    private function getRelevantBooks($message)
    {
        if (!class_exists('App\Models\Publication')) {
            Log::warning('Publication model does not exist');
            return collect();
        }

        try {
            $query = Publication::query();

            // Check if user is asking for a specific book location
            if (stripos($message, 'where is') !== false || stripos($message, 'location') !== false || stripos($message, 'find') !== false) {
                // Try to extract book title from the question
                $words = explode(' ', $message);
                $potentialTitle = '';
                $foundWhere = false;
                
                foreach ($words as $word) {
                    if ($foundWhere && !in_array(strtolower($word), ['book', 'the', 'a', 'an', 'is', 'located', 'at'])) {
                        $potentialTitle .= $word . ' ';
                    }
                    if (stripos($word, 'where') !== false || stripos($word, 'location') !== false) {
                        $foundWhere = true;
                    }
                }
                
                if (trim($potentialTitle)) {
                    $query->where('title', 'LIKE', '%' . trim($potentialTitle) . '%');
                    return $query->limit(2)->get();
                }
            }

            // Check if user mentions both department and specific interest
            $departments = ['CSE', 'EEE', 'MPE', 'Textile', 'Arch', 'Civil'];
            $foundDepartment = false;
            $hasSpecificInterest = false;
            
            foreach ($departments as $dept) {
                if (stripos($message, $dept) !== false) {
                    $query->where('department', $dept);
                    $foundDepartment = true;
                    break;
                }
            }

            // Check if message has specific interest keywords
            $specificInterests = [
                'programming', 'code', 'coding', 'java', 'python', 'cpp', 'javascript',
                'database', 'sql', 'algorithm', 'data structure', 'machine learning', 'ai',
                'networking', 'security', 'web development', 'mobile app',
                'mathematics', 'calculus', 'algebra', 'statistics',
                'physics', 'mechanics', 'thermodynamics', 'electronics',
                'engineering', 'design', 'construction', 'structural',
                'textile', 'fabric', 'fiber', 'fashion', 'material',
                'architecture', 'building', 'planning', 'interior'
            ];

            foreach ($specificInterests as $interest) {
                if (stripos($message, $interest) !== false) {
                    $hasSpecificInterest = true;
                    $query->where(function($q) use ($interest) {
                        $q->where('title', 'LIKE', "%{$interest}%")
                          ->orWhere('description', 'LIKE', "%{$interest}%")
                          ->orWhere('author', 'LIKE', "%{$interest}%");
                    });
                    break;
                }
            }

            // If only department mentioned without specific interest, return empty
            // (AI will ask for specific interest)
            if ($foundDepartment && !$hasSpecificInterest) {
                // Check if this is a general request like "CSE books" without specifics
                $generalRequests = ['books', 'book', 'need', 'want', 'show', 'recommend'];
                $isGeneralRequest = false;
                
                foreach ($generalRequests as $general) {
                    if (stripos($message, $general) !== false) {
                        $isGeneralRequest = true;
                        break;
                    }
                }
                
                if ($isGeneralRequest) {
                    return collect(); // Return empty to trigger interest question
                }
            }

            // Check for type mentions
            if (stripos($message, 'thesis') !== false) {
                $query->where('type', 'thesis');
            } elseif (stripos($message, 'book') !== false) {
                $query->where('type', 'book');
            }

            return $query->where('available_copies', '>', 0)->limit(3)->get();
           
        } catch (\Exception $e) {
            Log::error('Database query failed in getRelevantBooks', ['error' => $e->getMessage()]);
            return collect();
        }
    }

    private function getGeneralBooks($message)
    {
        try {
            // If no specific books found, get 2-3 popular books from the requested department
            $departments = ['CSE', 'EEE', 'MPE', 'Textile', 'Arch', 'Civil'];
            
            foreach ($departments as $dept) {
                if (stripos($message, $dept) !== false) {
                    return Publication::where('department', $dept)
                                     ->where('available_copies', '>', 0)
                                     ->orderBy('total_copies', 'desc')
                                     ->limit(2)
                                     ->get();
                }
            }
            
            // If no department specified, get general popular books
            return Publication::where('available_copies', '>', 0)
                             ->orderBy('total_copies', 'desc')
                             ->limit(2)
                             ->get();
        } catch (\Exception $e) {
            Log::error('Failed to get general books', ['error' => $e->getMessage()]);
            return collect();
        }
    }

    private function formatBooksForAI($books)
    {
        $formatted = "";
        foreach ($books as $book) {
            $formatted .= "📚 \"{$book->title}\" by {$book->author}";
            if ($book->department) $formatted .= " ({$book->department})";
            if ($book->publication_year) $formatted .= " [{$book->publication_year}]";
            $formatted .= " - {$book->available_copies} available";
            
            // Add shelf location if available
            if ($book->shelf_location) {
                $formatted .= " 📍 Location: {$book->shelf_location}";
            }
            
            if ($book->description) {
                $shortDesc = substr(strip_tags($book->description), 0, 80);
                $formatted .= " - " . $shortDesc . (strlen($book->description) > 80 ? "..." : "");
            }
            $formatted .= "\n";
        }
        return $formatted;
    }
}