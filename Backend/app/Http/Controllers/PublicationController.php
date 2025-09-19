<?php

namespace App\Http\Controllers;

use App\Models\Publication;
use Illuminate\Http\Request;
use Cloudinary\Configuration\Configuration;
use Cloudinary\Api\Upload\UploadApi;

class PublicationController extends Controller
{
    private function configureCloudinary()
    {
        Configuration::instance([
            'cloud' => [
                'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                'api_key'    => env('CLOUDINARY_API_KEY'),
                'api_secret' => env('CLOUDINARY_API_SECRET')
            ],
            'url' => ['secure' => true]
        ]);
    }

    // List (optional filter by type via ?type=book or ?type=thesis)
    public function index(Request $request)
    {
        $query = Publication::query();

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        return response()->json($query->get());
    }

    // Show single publication
    public function show($id)
    {
        $publication = Publication::findOrFail($id);
        return response()->json($publication);
    }

    // Create publication
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title'            => 'required|string|max:255',
                'author'           => 'required|string|max:255',
                'isbn'             => 'nullable|string|max:255',
                'publication_year' => 'nullable|integer',
                'publisher'        => 'nullable|string|max:255',
                'department'       => 'nullable|string|max:255',
                'type'             => 'required|in:book,thesis',
                'total_copies'     => 'nullable|integer|min:0',
                'available_copies' => 'nullable|integer|min:0',
                'shelf_location'   => 'nullable|string|max:255',
                'description'      => 'nullable|string',
                'cover'            => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:4096',
            ]);

            // Upload cover if exists
            if ($request->hasFile('cover')) {
                $file = $request->file('cover');

                if (!$file->isValid()) {
                    return response()->json(['error' => 'Invalid file upload'], 400);
                }

                $this->configureCloudinary();

                $uploadApi = new UploadApi();
                $result = $uploadApi->upload($file->getRealPath(), [
                    'folder' => 'library/publications',
                ]);

                $validated['cover_url']      = $result['secure_url'];
                $validated['cover_public_id'] = $result['public_id'];
            }

            $publication = Publication::create($validated);

            return response()->json($publication, 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error'  => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Publication creation failed: ' . $e->getMessage());
            return response()->json([
                'error'   => 'Failed to create publication',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    // Update publication
    public function update(Request $request, $id)
    {
        $publication = Publication::findOrFail($id);

        $validated = $request->validate([
            'title'            => 'required|string|max:255',
            'author'           => 'required|string|max:255',
            'isbn'             => 'nullable|string|max:255',
            'publication_year' => 'nullable|integer',
            'publisher'        => 'nullable|string|max:255',
            'department'       => 'nullable|string|max:255',
            'type'             => 'required|in:book,thesis',
            'total_copies'     => 'nullable|integer|min:0',
            'available_copies' => 'nullable|integer|min:0',
            'shelf_location'   => 'nullable|string|max:255',
            'description'      => 'nullable|string',
            'cover'            => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:4096',
        ]);

        // If new cover file uploaded
        if ($request->hasFile('cover')) {
            $this->configureCloudinary();

            // Delete old cover if exists
            if ($publication->cover_public_id) {
                try {
                    (new UploadApi())->destroy($publication->cover_public_id);
                } catch (\Exception $e) {
                    \Log::warning("Failed to delete old Cloudinary image: " . $e->getMessage());
                }
            }

            // Upload new cover
            try {
                $result = (new UploadApi())->upload($request->file('cover')->getRealPath(), [
                    'folder' => 'library/publications',
                ]);
                $validated['cover_url']       = $result['secure_url'];
                $validated['cover_public_id'] = $result['public_id'];
            } catch (\Exception $e) {
                return response()->json(['error' => 'Failed to upload image'], 500);
            }
        }

        $publication->update($validated);

        return response()->json($publication);
    }

    // Delete publication + cover
    public function destroy($id)
    {
        $publication = Publication::findOrFail($id);

        if ($publication->cover_public_id) {
            try {
                $this->configureCloudinary();
                (new UploadApi())->destroy($publication->cover_public_id);
            } catch (\Exception $e) {
                \Log::warning("Failed to delete Cloudinary image: " . $e->getMessage());
            }
        }

        $publication->delete();

        return response()->json(['message' => 'Publication deleted']);
    }
}
