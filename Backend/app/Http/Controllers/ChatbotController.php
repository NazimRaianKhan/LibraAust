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
        $this->geminiApiKey = config('services.gemini.key'); 
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
                        $contextData = "\n\nAvailable books in our AUST library database:\n" . $this->formatBooksForAI($books);
                        $contextData .= "\n\nIMPORTANT: Only recommend the books listed above. Do not suggest any other books.";
                    } else {
                        $contextData = "\n\nNo books found in our library database for this topic. Tell the user that books on this topic are not available in our library. Do not recommend any other books.";
                    }
                } catch (\Exception $e) {
                    Log::warning('Database query failed', ['error' => $e->getMessage()]);
                    $contextData = "\n\nUnable to fetch book information. Tell user to try again later.";
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
                    'temperature' => 0.5,
                    'topK' => 20,
                    'topP' => 0.8,
                    'maxOutputTokens' => 512,
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
        return "You are AUST Library Assistant for Ahsanullah University of Science and Technology.

STRICT RULE: You can ONLY mention books that are provided in the 'Available books in our AUST library database' section. If no books are provided, say the topic is not available.

TOPICS YOU HANDLE:
- Library hours: 8:00 AM to 6:00 PM
- Book recommendations (books and thesis) for: CSE, EEE, BBA, ME, TE, CE, IPE, ARCH
- Library location: AUST Campus, Tejgaon, Dhaka
- Book locations and shelf information

RESPONSE RULES:
- Be direct and concise
- If someone asks for department books, ask what specific area they're interested in
- Only show books from the provided database list
- If no books provided, say: 'Books on this topic are not available in our library'
- Include shelf location when showing books
- Handle both books and thesis requests

NEVER suggest books not in the provided database.";
    }

    private function detectBookRequest($message)
    {
        $keywords = [
            'book', 'books', 'recommend', 'thesis', 'research', 
            'CSE', 'EEE', 'BBA', 'ME', 'TE', 'CE', 'IPE', 'ARCH',
            'programming', 'algorithm', 'database', 'network',
            'circuit', 'electronics', 'power', 'signal',
            'business', 'management', 'accounting', 'finance',
            'mechanical', 'engineering', 'thermodynamics',
            'textile', 'fabric', 'dyeing', 'manufacturing',
            'civil', 'construction', 'structural', 'concrete',
            'industrial', 'production', 'quality',
            'architecture', 'design', 'building', 'planning',
            'where is', 'location', 'shelf'
        ];
       
        foreach ($keywords as $keyword) {
            if (stripos($message, $keyword) !== false) {
                return true;
            }
        }
        return false;
    }

    private function getRelevantBooks($message)
    {
        try {
            $query = Publication::query();

            // Handle book location queries
            if (stripos($message, 'where is') !== false || stripos($message, 'location') !== false) {
                $words = explode(' ', strtolower($message));
                $titleWords = [];
                $found = false;
                
                foreach ($words as $word) {
                    if ($found && !in_array($word, ['book', 'the', 'a', 'an', 'is', 'located'])) {
                        $titleWords[] = $word;
                    }
                    if (in_array($word, ['where', 'location'])) {
                        $found = true;
                    }
                }
                
                if (!empty($titleWords)) {
                    $searchTerm = implode(' ', $titleWords);
                    return $query->where('title', 'LIKE', "%{$searchTerm}%")->limit(2)->get();
                }
            }

            // Check for department first
            $departments = ['CSE', 'EEE', 'BBA', 'ME', 'TE', 'CE', 'IPE', 'ARCH'];
            $foundDept = false;
            
            foreach ($departments as $dept) {
                if (stripos($message, $dept) !== false) {
                    $query->where('department', $dept);
                    $foundDept = true;
                    break;
                }
            }

            // Check for thesis or book type - THIS IS THE KEY FIX
            $isThesisRequest = false;
            if (stripos($message, 'thesis') !== false) {
                $query->where('type', 'thesis');
                $isThesisRequest = true;
            } elseif (stripos($message, 'book') !== false) {
                $query->where('type', 'book');
            }

            // Check for specific interests
            $interests = [
                'programming' => ['programming', 'java', 'code', 'coding', 'python', 'javascript'],
                'algorithm' => ['algorithm', 'data structure'],
                'database' => ['database', 'sql'],
                'network' => ['network', 'networking'],
                'circuit' => ['circuit', 'electronics'],
                'power' => ['power', 'electrical'],
                'signal' => ['signal', 'processing'],
                'business' => ['business', 'management', 'marketing'],
                'accounting' => ['accounting', 'finance', 'economics'],
                'administration' => ['administration', 'organization', 'leadership'],
                'mechanical' => ['mechanical', 'machine', 'engine'],
                'thermodynamics' => ['thermodynamics', 'thermal', 'heat'],
                'manufacturing' => ['manufacturing', 'production'],
                'textile' => ['textile', 'fabric', 'fiber'],
                'dyeing' => ['dyeing', 'printing', 'coloring'],
                'civil' => ['civil', 'construction', 'structural'],
                'concrete' => ['concrete', 'material', 'cement'],
                'industrial' => ['industrial', 'process', 'system'],
                'quality' => ['quality', 'control', 'assurance'],
                'production' => ['production', 'efficiency', 'optimization'],
                'architecture' => ['architecture', 'design', 'building'],
                'planning' => ['planning', 'urban', 'interior']
            ];

            $hasSpecificInterest = false;
            foreach ($interests as $category => $terms) {
                foreach ($terms as $term) {
                    if (stripos($message, $term) !== false) {
                        $query->where(function($q) use ($term) {
                            $q->where('title', 'LIKE', "%{$term}%")
                              ->orWhere('description', 'LIKE', "%{$term}%");
                        });
                        $hasSpecificInterest = true;
                        break 2;
                    }
                }
            }

            // Modified logic for thesis and book requests
            if ($foundDept && !$hasSpecificInterest) {
                $generalRequests = ['books', 'book', 'need', 'want', 'show', 'recommend'];
                $isGeneralRequest = false;
                
                foreach ($generalRequests as $general) {
                    if (stripos($message, $general) !== false) {
                        $isGeneralRequest = true;
                        break;
                    }
                }
                
                // For thesis requests, don't return empty - show available thesis
                if ($isThesisRequest) {
                    // Show available thesis from the department
                    return $query->where('available_copies', '>', 0)->limit(3)->get();
                } elseif ($isGeneralRequest) {
                    return collect(); // Empty to trigger interest question for books
                }
            }

            return $query->where('available_copies', '>', 0)->limit(3)->get();
           
        } catch (\Exception $e) {
            Log::error('Database query failed: ' . $e->getMessage());
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
            
            if ($book->shelf_location) {
                $formatted .= " 📍 Location: {$book->shelf_location}";
            }
            
            $formatted .= "\n";
        }
        return $formatted;
    }
}